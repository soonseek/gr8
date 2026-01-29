# Story 4.9: 템플릿 전략 백테스트 결과 제공 (Template Strategy Backtest Results Provision)

Status: ready-for-dev

---

## Story

**As a** 신규 사용자 (New User),
**I want** 템플릿으로 제공되는 전략들의 백테스트 결과를 미리 확인하고 싶다,
**so that** 어떤 전략을 선택할지 결정하고, 실전 투자 전에 전략의 성과를 검증할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1-1에서 프론트엔드 스타터 템플릿 완료 ✅ (React, TypeScript, Tailwind CSS, Shadcn UI)
- Story 4-1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (API 엔드포인트 구조)
- Story 4-2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블)
- Story 4-3에서 전략 실행 엔진 check-passed ✅ (BacktestEngine 구현 예정)
- Story 4-4에서 성과 지표 계산 check ✅ (4-4-deps-1 보완 Story 생성됨)
- Story 4-5에서 거래 내역 추적 check-passed ✅
- Story 4-6에서 백테스트 결과 저장 check-passed ✅ (API 엔드포인트 구현 예정)
- Story 4-7에서 백테스트 결과 시각화 check ✅ (4-7-deps-1 보완 Story 생성됨)
- Story 4-8에서 백테스트 실행 UI check ✅ (4-8-deps-1 보완 Story 생성됨)

**문제:**
- 신규 사용자가 어떤 전략이 좋은지 알 수 없음
- 템플릿 전략의 성과를 미리 확인할 방법이 없음
- 전략 선택 시 참고할 백테스트 결과 요약이 없음
- 여러 전략을 한눈에 비교할 수 없음

**해결:**
전략 라이브러리 페이지에 템플릿 전략들의 백테스트 결과 요약을 표시하고, 상세 결과 페이지로 이동하는 기능 구현

**중요:**
- **FR25 커버**: 템플릿 전략 백테스트 결과 제공
- **백테스트 결과 캐싱**: 모든 템플릿 백테스트 결과는 미리 계산되어 DB에 저장
- **API 활용**: GET /api/v1/templates/with-backtest (Story 4-6에서 구현 예정)
- **전략 복사 기능**: "이 전략 사용하기" 버튼으로 템플릿을 사용자 작업 공간으로 복사
- **비교 가능성**: 여러 전략의 핵심 지표를 카드 형태로 한눈에 표시

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 전략 라이브러리 페이지에 백테스트 결과 표시 (FR25)

**Given** 템플릿 전략들이 제공된다
**When** 사용자가 "전략 라이브러리" 페이지를 연다
**Then** FR25: 각 템플릿 전략의 백테스트 결과가 표시된다
**And** 다음 요약 정보가 카드 형태로 제공된다:
  - 전략 이름 및 설명
  - 카테고리 (추세, 모멘텀, 평균 회귀)
  - 백테스트 기간 (예: 2024-01-01 ~ 2024-12-31)
  - ROI (총 수익률) - %로 표시, 색상 구분 (양수: 초록, 음수: 빨강)
  - MDD (최대 낙폭) - %로 표시
  - 승률 - %로 표시
  - 샤프 비율 - 소수점 2자리
  - 총 거래 횟수
**And** 결과가 한눈에 비교 가능하다 (그리드/표 형태)

**기술 구현:**
```typescript
// src/pages/StrategyLibrary.tsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateWithBacktest {
  id: string;
  name: string;
  description: string;
  category: 'trend' | 'momentum' | 'mean_reversion';
  backtest_result: {
    period_start: string;
    period_end: string;
    roi: number;          // % (e.g., 45.5)
    mdd: number;          // % (e.g., -12.3)
    win_rate: number;     // % (e.g., 65.0)
    sharpe_ratio: number; // (e.g., 1.85)
    total_trades: number;
  };
}

export function StrategyLibrary() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates', 'with-backtest'],
    queryFn: async () => {
      const response = await fetch('/api/v1/templates/with-backtest');
      return response.json();
    }
  });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">전략 라이브러리</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template: TemplateWithBacktest) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{template.name}</span>
                <Badge variant="secondary">
                  {getCategoryLabel(template.category)}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>

              <div className="space-y-2 text-sm">
                <MetricRow
                  label="백테스트 기간"
                  value={`${formatDate(template.backtest_result.period_start)} ~ ${formatDate(template.backtest_result.period_end)}`}
                />

                <MetricRow
                  label="ROI"
                  value={`${template.backtest_result.roi.toFixed(2)}%`}
                  valueClassName={template.backtest_result.roi >= 0 ? 'text-green-600' : 'text-red-600'}
                />

                <MetricRow
                  label="MDD"
                  value={`${template.backtest_result.mdd.toFixed(2)}%`}
                  valueClassName="text-red-600"
                />

                <MetricRow
                  label="승률"
                  value={`${template.backtest_result.win_rate.toFixed(1)}%`}
                />

                <MetricRow
                  label="샤프 비율"
                  value={template.backtest_result.sharpe_ratio.toFixed(2)}
                />

                <MetricRow
                  label="총 거래 횟수"
                  value={template.backtest_result.total_trades}
                />
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => navigateToTemplateDetail(template.id)}
              >
                상세 보기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  valueClassName = ''
}: {
  label: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels = {
    trend: '추세',
    momentum: '모멘텀',
    mean_reversion: '평균 회귀'
  };
  return labels[category] || category;
}
```

### AC 2: 상세 백테스트 결과 페이지로 이동

**Given** 템플릿 전략 백테스트 결과가 카드로 표시되었다
**When** 사용자가 특정 전략의 "상세 보기" 버튼을 클릭한다
**Then** 상세 백테스트 결과 페이지로 이동한다 (`/templates/:templateId`)
**And** Story 4.7에서 구현한 전체 시각화 컴포넌트가 표시된다:
  - 캔들스틱 차트 + Buy/Sell 마커
  - Equity Curve
  - MDD 하이라이트
  - 성과 지표 카드 (ROI, MDD, 승률, 샤프 비율)
  - 거래 내역 테이블
**And** "이 전략 사용하기" 버튼이 제공된다

**기술 구현:**
```typescript
// src/pages/TemplateDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BacktestResults } from '@/components/backtest/BacktestResults'; // Story 4.7의 컴포넌트 재사용

export function TemplateDetailPage() {
  const { templateId } = useParams<{ templateId: string }>();

  const { data: template, isLoading } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/templates/${templateId}`);
      return response.json();
    }
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (!template) return <div>템플릿을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground mt-2">{template.description}</p>
        </div>

        <Button
          size="lg"
          onClick={() => handleUseTemplate(template.id)}
        >
          이 전략 사용하기
        </Button>
      </div>

      {/* Story 4.7의 백테스트 결과 시각화 컴포넌트 재사용 */}
      <BacktestResults backtestId={template.backtest_result_id} />
    </div>
  );
}
```

### AC 3: "이 전략 사용하기" 기능 (FR25)

**Given** 사용자가 템플릿 상세 페이지를 보고 있다
**When** 사용자가 "이 전략 사용하기" 버튼을 클릭한다
**Then** 템플릿 전략이 사용자의 작업 공간으로 복사된다
**And** 사용자가 수정 가능한 상태가 된다 (전략 에디터로 이동)
**And** FR25: 원본 템플릿과 구분된다 (복사본 표시)
**And** 새 전략 ID가 생성된다
**And** 사용자에게 성공 메시지가 표시된다

**기술 구현:**
```typescript
// Frontend: POST /api/v1/strategies/copy-from-template
const handleUseTemplate = async (templateId: string) => {
  try {
    const response = await fetch('/api/v1/strategies/copy-from-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: templateId,
        user_id: currentUser.walletAddress
      })
    });

    const { strategy_id } = await response.json();

    // 성공 메시지 표시
    toast.success('전략이 복사되었습니다. 수정을 시작하세요!');

    // 전략 에디터로 이동
    navigate(`/editor/${strategy_id}`);
  } catch (error) {
    toast.error('전략 복사에 실패했습니다.');
  }
};

// Backend: app/api/routers/strategies.py
@router.post("/copy-from-template")
async def copy_strategy_from_template(
    request: CopyTemplateRequest,
    current_user: User = Depends(get_current_user)
):
    # 1. 템플릿 전략 조회
    template = await db.get_template(request.template_id)

    # 2. strategy_json 복사
    new_strategy_json = template.strategy_json.copy()

    # 3. 원본 템플릿과 구분 (name에 "(복사본)" 추가)
    new_strategy_json['name'] = f"{template.name} (복사본)"
    new_strategy_json['template_id'] = template.id

    # 4. 사용자 전략으로 저장
    new_strategy_id = await db.create_user_strategy(
        user_id=current_user.wallet_address,
        strategy_json=new_strategy_json
    )

    return {"strategy_id": new_strategy_id}
```

### AC 4: 백엔드 API 엔드포인트 구현

**Given** 백엔드가 설정되어 있다 (Story 4.1, 4.6)
**When** 개발자가 템플릿 관련 API를 구현한다
**Then** GET /api/v1/templates/with-backtest 엔드포인트가 구현된다
**And** GET /api/v1/templates/{template_id} 엔드포인트가 구현된다
**And** POST /api/v1/strategies/copy-from-template 엔드포인트가 구현된다
**And** template_strategies 테이블이 생성된다
**And** 백테스트 결과가 캐싱된다 (미리 계산됨)

**기술 구현:**
```python
# Database schema (Alembic migration)
# alembic/versions/xxx_create_template_strategies.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'template_strategies',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('category', sa.String(50)),  # trend, momentum, mean_reversion
        sa.Column('strategy_json', sa.JSON, nullable=False),
        sa.Column('backtest_result_id', sa.Integer, sa.ForeignKey('backtest_results.id')),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 인덱스 생성
    op.create_index('ix_template_strategies_category', 'template_strategies', ['category'])
    op.create_index('ix_template_strategies_is_active', 'template_strategies', ['is_active'])

# Backend API
# app/api/routers/templates.py
from fastapi import APIRouter, Depends
from app.schemas.template import TemplateWithBacktestResponse
from app.services.template_service import TemplateService

router = APIRouter(prefix="/api/v1/templates", tags=["templates"])

@router.get("/with-backtest", response_model=List[TemplateWithBacktestResponse])
async def get_templates_with_backtest(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user_optional)  # 인증 없이도 조회 가능
):
    """모든 템플릿 전략과 백테스트 결과 조회"""
    service = TemplateService()
    templates = await service.get_all_with_backtest(category=category)
    return templates

@router.get("/{template_id}", response_model=TemplateWithBacktestResponse)
async def get_template_detail(
    template_id: str,
    current_user: User = Depends(get_current_user_optional)
):
    """특정 템플릿 상세 조회"""
    service = TemplateService()
    template = await service.get_with_backtest(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

# app/services/template_service.py
class TemplateService:
    async def get_all_with_backtest(self, category: Optional[str] = None):
        """모든 템플릿과 백테스트 결과 조회 (캐싱됨)"""
        query = """
            SELECT
                ts.id,
                ts.name,
                ts.description,
                ts.category,
                ts.strategy_json,
                ts.backtest_result_id,
                br.period_start,
                br.period_end,
                br.total_roi,
                br.max_drawdown,
                br.win_rate,
                br.sharpe_ratio,
                br.total_trades
            FROM template_strategies ts
            LEFT JOIN backtest_results br ON ts.backtest_result_id = br.id
            WHERE ts.is_active = true
            AND (:category IS NULL OR ts.category = :category)
            ORDER BY ts.created_at DESC
        """

        results = await db.fetch_all(query, {"category": category})
        return [self._parse_template_with_backtest(row) for row in results]

    def _parse_template_with_backtest(self, row) -> TemplateWithBacktestResponse:
        return TemplateWithBacktestResponse(
            id=row['id'],
            name=row['name'],
            description=row['description'],
            category=row['category'],
            strategy_json=row['strategy_json'],
            backtest_result=BacktestResultSummary(
                period_start=row['period_start'],
                period_end=row['period_end'],
                roi=row['total_roi'] * 100,  # decimal to %
                mdd=row['max_drawdown'] * 100,
                win_rate=row['win_rate'] * 100,
                sharpe_ratio=row['sharpe_ratio'],
                total_trades=row['total_trades']
            )
        )
```

### AC 5: 백테스트 결과 사전 계산 및 캐싱

**Given** 템플릿 전략들이 제공된다
**When** 시스템이 초기화된다
**Then** 모든 템플릿 전략의 백테스트가 사전에 실행된다
**And** 백테스트 결과가 DB에 저장된다 (backtest_results 테이블)
**And** template_strategies.backtest_result_id가 백테스트 결과를 참조한다
**And** API 요청 시 캐싱된 결과를 반환한다 (실시간 계산 X)

**기술 구현:**
```python
# app/services/template_backtest_seeder.py
class TemplateBacktestSeeder:
    """템플릿 전략 백테스트 사전 계산 서비스"""

    async def seed_all_templates(self):
        """모든 템플릿의 백테스트 실행 및 결과 저장"""
        templates = await db.fetch_all("SELECT * FROM template_strategies WHERE is_active = true")

        for template in templates:
            await self._run_and_store_backtest(template)

    async def _run_and_store_backtest(self, template):
        """단일 템플릿 백테스트 실행 및 저장"""
        # 1. 백테스트 파라미터 설정 (기본값)
        params = BacktestParams(
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            initial_capital=10000,
            timeframe='1h',
            commission=0.001,
            slippage=0.0005
        )

        # 2. 백테스트 실행 (Story 4.3의 BacktestEngine 활용)
        engine = BacktestEngine()
        result = await engine.run(
            strategy_json=template.strategy_json,
            params=params
        )

        # 3. 결과 저장
        backtest_id = await db.insert_backtest_result(result)

        # 4. 템플릿에 백테스트 ID 연결
        await db.update_template(
            template_id=template.id,
            backtest_result_id=backtest_id
        )

# CLI 명령으로 실행
# python -m app.cli.seed_template_backtests
```

---

## Tasks / Subtasks

### Task 1: Database 스키마 구현 (AC: #4)
- [ ] Subtask 1.1: Alembic migration 생성 (template_strategies 테이블)
- [ ] Subtask 1.2: backtest_result_id 외래키 제약조건 추가
- [ ] Subtask 1.3: 인덱스 생성 (category, is_active)
- [ ] Subtask 1.4: alembic upgrade head 실행

### Task 2: 백엔드 API 엔드포인트 구현 (AC: #4)
- [ ] Subtask 2.1: app/api/routers/templates.py 생성
- [ ] Subtask 2.2: GET /api/v1/templates/with-backtest 구현
- [ ] Subtask 2.3: GET /api/v1/templates/{template_id} 구현
- [ ] Subtask 2.4: POST /api/v1/strategies/copy-from-template 구현
- [ ] Subtask 2.5: Pydantic 스키마 구현 (TemplateWithBacktestResponse)

### Task 3: 템플릿 서비스 구현 (AC: #4, #5)
- [ ] Subtask 3.1: app/services/template_service.py 생성
- [ ] Subtask 3.2: get_all_with_backtest() 메서드 구현
- [ ] Subtask 3.3: get_with_backtest() 메서드 구현
- [ ] Subtask 3.4: copy_to_user_workspace() 메서드 구현

### Task 4: 백테스트 결과 사전 계산 (AC: #5)
- [ ] Subtask 4.1: 템플릿 전략 JSON 정의 (최소 3개: 추세, 모멘텀, 평균 회귀)
- [ ] Subtask 4.2: app/services/template_backtest_seeder.py 생성
- [ ] Subtask 4.3: seed_all_templates() 메서드 구현
- [ ] Subtask 4.4: CLI 명령 생성 (python -m app.cli.seed_template_backtests)
- [ ] Subtask 4.5: 템플릿 백테스트 실행 및 DB 저장

### Task 5: 프론트엔드 전략 라이브러리 페이지 구현 (AC: #1)
- [ ] Subtask 5.1: src/pages/StrategyLibrary.tsx 생성
- [ ] Subtask 5.2: useQuery로 templates 데이터 조회
- [ ] Subtask 5.3: TemplateCard 컴포넌트 구현
- [ ] Subtask 5.4: MetricRow 컴포넌트 구현
- [ ] Subtask 5.5: 그리드 레이아웃 (반응형: 1/2/3열)
- [ ] Subtask 5.6: 카테고리 Badge 표시

### Task 6: 프론트엔드 상세 페이지 구현 (AC: #2)
- [ ] Subtask 6.1: src/pages/TemplateDetailPage.tsx 생성
- [ ] Subtask 6.2: useParams로 templateId 추출
- [ ] Subtask 6.3: Story 4.7의 BacktestResults 컴포넌트 재사용
- [ ] Subtask 6.4: "이 전략 사용하기" 버튼 구현

### Task 7: "이 전략 사용하기" 기능 구현 (AC: #3)
- [ ] Subtask 7.1: POST /api/v1/strategies/copy-from-template 호출
- [ ] Subtask 7.2: 성공 시 toast 메시지 표시
- [ ] Subtask 7.3: 전략 에디터로 이동 (/editor/:strategyId)
- [ ] Subtask 7.4: 에러 핸들링

### Task 8: 네비게이션 및 라우팅 (AC: #1, #2)
- [ ] Subtask 8.1: /templates 라우트 추가 (StrategyLibrary)
- [ ] Subtask 8.2: /templates/:templateId 라우트 추가 (TemplateDetailPage)
- [ ] Subtask 8.3: 사이드바/네비게이션에 "전략 라이브러리" 링크 추가

### Task 9: 단위 테스트 작성
- [ ] Subtask 9.1: TemplateService get_all_with_backtest 테스트
- [ ] Subtask 9.2: TemplateService copy_to_user_workspace 테스트
- [ ] Subtask 9.3: StrategyLibrary 컴포넌트 테스트 (Mock API)
- [ ] Subtask 9.4: TemplateDetailPage 컴포넌트 테스트
- [ ] Subtask 9.5: vitest 실행 및 커버리지 확인 (> 80% 목표)

### Task 10: 통합 테스트 (백테스트 결과 확인)
- [ ] Subtask 10.1: 템플릿 백테스트 실행 및 결과 확인
- [ ] Subtask 10.2: API 응답 검증 (필수 필드 모두 존재)
- [ ] Subtask 10.3: 프론트엔드에서 데이터 표시 확인
- [ ] Subtask 10.4: "이 전략 사용하기" 기능 테스트

---

## Dev Notes

### 🎯 목표

이 Story는 **템플릿 전략 백테스트 결과 제공 기능을 구현**합니다. 완료되면:
- **전략 라이브러리 페이지**: 템플릿 전략들의 백테스트 결과 요약 표시
- **상세 결과 페이지**: Story 4.7의 시각화 컴포넌트 재사용
- **전략 복사 기능**: "이 전략 사용하기" 버튼으로 사용자 작업 공간으로 복사
- **FR25 만족**: 템플릿 전략 백테스트 결과 제공
- **사전 계산**: 모든 템플릿 백테스트가 미리 실행되어 캐싱됨

### 📚 Story 4.6 (백테스트 결과 저장)에서 배운 패턴

**백테스트 결과 DB 저장** [Source: 4-6-backtest-storage.md]:
```python
# backtest_results 테이블 구조
CREATE TABLE backtest_results (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    strategy_id INTEGER,
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    initial_capital DECIMAL(20, 8),
    final_capital DECIMAL(20, 8),
    total_roi DECIMAL(10, 4),
    max_drawdown DECIMAL(10, 4),
    win_rate DECIMAL(5, 4),
    sharpe_ratio DECIMAL(10, 4),
    total_trades INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**API 엔드포인트 패턴** [Source: 4-6-backtest-storage.md]:
```python
@router.get("/results/{backtest_id}")
async def get_backtest_result(backtest_id: str):
    result = await storage.get_result(backtest_id)
    return BacktestResultResponse(**result)
```

### 🏗️ 핵심 구현 전략

**1. 템플릿과 사용자 전략 분리**
- **template_strategies**: 읽기 전용, 시스템에서 관리
- **user_strategies**: 사용자가 생성/복사한 전략
- **복사 시**: strategy_json을 복사하고, name에 "(복사본)" 추가

**2. 백테스트 결과 캐싱 전략**
```python
# 사전 계산: 시스템 초기화 시 1회 실행
python -m app.cli.seed_template_backtests

# API 요청 시: DB 조회만 수행 (실시간 계산 X)
SELECT * FROM template_strategies ts
LEFT JOIN backtest_results br ON ts.backtest_result_id = br.id
```

**3. Story 4.7 컴포넌트 재사용**
```typescript
// TemplateDetailPage에서 BacktestResults 컴포넌트 재사용
import { BacktestResults } from '@/components/backtest/BacktestResults';

<BacktestResults backtestId={template.backtest_result_id} />
```

**4. 전략 복사 플로우**
```
1. 사용자가 "이 전략 사용하기" 클릭
   ↓
2. POST /api/v1/strategies/copy-from-template
   ↓
3. 템플릿 strategy_json 복사
   ↓
4. name에 "(복사본)" 추가
   ↓
5. 사용자 전략으로 저장 (새 strategy_id 생성)
   ↓
6. 전략 에디터로 이동 (/editor/{strategy_id})
```

### 📊 데이터 흐름

```
1. 시스템 초기화 시 (백엔드)
   ↓
2. 템플릿 백테스트 실행 (seed_all_templates)
   ├─ 템플릿 1: 추세 전략 백테스트 → 결과 저장
   ├─ 템플릿 2: 모멘텀 전략 백테스트 → 결과 저장
   └─ 템플릿 3: 평균 회귀 전략 백테스트 → 결과 저장
   ↓
3. template_strategies.backtest_result_id 업데이트
   ↓
4. 사용자가 "전략 라이브러리" 페이지 방문
   ↓
5. GET /api/v1/templates/with-backtest
   ↓
6. DB에서 캐싱된 결과 조회 (실시간 계산 X)
   ↓
7. 카드 형태로 백테스트 결과 표시
   ↓
8. 사용자가 "상세 보기" 클릭
   ↓
9. TemplateDetailPage로 이동
   ↓
10. Story 4.7의 BacktestResults 컴포넌트 표시
   ↓
11. 사용자가 "이 전략 사용하기" 클릭
   ↓
12. POST /api/v1/strategies/copy-from-template
   ↓
13. 전략 복사 및 전략 에디터로 이동
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1-1: 프론트엔드 스타터 템플릿 (React, TypeScript, Tailwind CSS)
- ✅ Story 4-1: 백테스팅 엔진 아키텍처 설계 (API 구조)
- ✅ Story 4-2: 과거 시장 데이터 수집 (market_data 테이블)
- ⚠️ Story 4-3: 전략 실행 엔진 (BacktestEngine) - **선행 필수**
- ⚠️ Story 4-4: 성과 지표 계산 (MetricsCalculator) - **선행 필수**
- ⚠️ Story 4-5: 거래 내역 추적 (self.trades) - **선행 필수**
- ⚠️ Story 4-6: 백테스트 결과 저장 (API 엔드포인트) - **선행 필수**
- ⚠️ Story 4-7: 백테스트 결과 시각화 (BacktestResults 컴포넌트) - **선행 필수**

**후속 Stories (이 Story의 결과 활용):**
- Story 5-1: 전략 마켓플레이스 UI (이 Story의 확장)
- Story 5-4: 전략 공개 (템플릿 사용자가 자신의 전략을 공개)

**파일 생성/수정 목록:**
1. `gr8-backend/alembic/versions/xxx_create_template_strategies.py` - 🆕 새로 생성 (DB 마이그레이션)
2. `gr8-backend/app/api/routers/templates.py` - 🆕 새로 생성
3. `gr8-backend/app/schemas/template.py` - 🆕 새로 생성 (Pydantic 스키마)
4. `gr8-backend/app/services/template_service.py` - 🆕 새로 생성
5. `gr8-backend/app/services/template_backtest_seeder.py` - 🆕 새로 생성
6. `gr8-backend/app/cli.py` - ✅ 수정 (seed_template_backtests 명령 추가)
7. `gr8-frontend/src/pages/StrategyLibrary.tsx` - 🆕 새로 생성
8. `gr8-frontend/src/pages/TemplateDetailPage.tsx` - 🆕 새로 생성
9. `gr8-frontend/src/components/strategy/TemplateCard.tsx` - 🆕 새로 생성
10. `gr8-frontend/src/routes.tsx` - ✅ 수정 (/templates, /templates/:id 라우트 추가)
11. `tests/unit/test_template_service.test.py` - 🆕 새로 생성

### ⚠️ 중요 고려사항

**1. 백테스트 결과 사전 계산 필수**
- 모든 템플릿 백테스트를 미리 실행해야 함
- CLI 명령으로 실행: `python -m app.cli.seed_template_backtests`
- 백테스트 결과가 DB에 없으면 API가 404 반환

**2. Story 4.7 컴포넌트 재사용**
- TemplateDetailPage는 BacktestResults 컴포넌트를 그대로 재사용
- Story 4.7이 먼저 완료되어야 함
- backtest_result_id로 연결

**3. 인증 선택사항**
- 전략 라이브러리 페이지: 인증 없이 접근 가능 (마케팅 목적)
- "이 전략 사용하기": 인증 필수 (지갑 연결 필요)

**4. 템플릿 전략 최소 3개**
- 추세 전략 (Trend Following)
- 모멘텀 전략 (Momentum)
- 평균 회귀 전략 (Mean Reversion)
- 각각 다른 카테고리로 분류

**5. 전략 복사 시 원본과 구분**
- name에 "(복사본)" 추가
- template_id 필드로 원본 추적
- 사용자가 자유롭게 수정 가능

**6. NFR6 준수 (< 200ms API 응답)**
- 백테스트 결과 캐싱으로 실시간 계산 회피
- DB 인덱스로 조회 최적화
- React Query로 프론트엔드 캐싱

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.9 요구사항 분석 (epics.md)
2. Story 4.7, 4.8 문서 분석 (시각화, 실행 UI)
3. Story 4.1, 4.6 아키텍처 패턴 분석
4. Architecture.md에서 성능 요구사항 분석
5. Git 커밋 히스토리 분석 (최근 작업 패턴)
6. 5개 AC 정의 (전략 라이브러리, 상세 페이지, 전략 복사, API, 백테스트 캐싱)
7. 10개 Task/47개 Subtask 정의
8. Dev Notes 작성 (데이터 흐름, Story 4.7 재사용, 전략 복사 플로우)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- 전략 라이브러리 페이지 (템플릿 백테스트 결과 카드)
- 상세 결과 페이지 (Story 4.7 BacktestResults 컴포넌트 재사용)
- "이 전략 사용하기" 기능 (전략 복사)
- 백엔드 API (GET /templates/with-backtest, POST /strategies/copy-from-template)
- 백테스트 결과 사전 계산 및 캐싱
- FR25 만족

📋 **다음 단계:**
- Story 4-9 개발 시작 (DB 스키마, API, 프론트엔드)
- Story 4-10: 백테스트 검증 (자동화된 테스트 케이스)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-9-template-backtest-results.md` - This story file

**Backend Files to Create (est. 5 files)**
- `gr8-backend/alembic/versions/xxx_create_template_strategies.py` - 🆕 새로 생성 (DB 마이그레이션)
- `gr8-backend/app/api/routers/templates.py` - 🆕 새로 생성
- `gr8-backend/app/schemas/template.py` - 🆕 새로 생성 (Pydantic 스키마)
- `gr8-backend/app/services/template_service.py` - 🆕 새로 생성
- `gr8-backend/app/services/template_backtest_seeder.py` - 🆕 새로 생성

**Frontend Files to Create (est. 3 files)**
- `gr8-frontend/src/pages/StrategyLibrary.tsx` - 🆕 새로 생성
- `gr8-frontend/src/pages/TemplateDetailPage.tsx` - 🆕 새로 생성
- `gr8-frontend/src/components/strategy/TemplateCard.tsx` - 🆕 새로 생성

**Files to Modify (est. 2 files)**
- `gr8-backend/app/cli.py` - ✅ 수정 (seed_template_backtests 명령 추가)
- `gr8-frontend/src/routes.tsx` - ✅ 수정 (/templates 라우트 추가)

**Test Files (est. 1 file)**
- `tests/unit/test_template_service.test.py` - 🆕 새로 생성

**Total:** 9-11 files to create/modify
