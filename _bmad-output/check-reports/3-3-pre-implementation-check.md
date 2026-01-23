# Pre-Implementation Check Report: Story 3-3

**Story ID:** 3-3-market-data-node
**Story Title:** 시장 데이터 노드 구현 (가격, 거래량)
**Check Date:** 2026-01-20
**Status:** ❌ FAIL - 치명적인 Gap 발견

---

## Executive Summary

Story 3-3는 **구현 불가능한 상태**입니다. 치명적인 선행 의존성이 충족되지 않았으며, 요구사항과 실제 구현 가능성 간에 중대한 괴리가 있습니다.

**주요 문제:**
1. ❌ **백엔드 의존성 누락**: Story 4-2 (backlog)가 먼저 완료되어야 함
2. ❌ **DB 테이블 미존재**: market_data 테이블이 생성되지 않음
3. ❌ **ccxt 라이브러리 미사용**: 사용자 요구사항("ccxt 라이브러리 반드시 사용") 위반
4. ❌ **API 엔드포인트 미정의**: 백엔드 엔드포인트가 Story 3-3에 없음

**권장 조치:**
- Story 3-3을 **백엔드 의존성 없이 프론트엔드 컴포넌트만** 구현하도록 재정의하거나
- Story 4-2를 먼저 **in-progress**로 변경하여 선행 구현

---

## Layer 1: 문서 논리 검증 (Document Logic Check)

### 1.1 FR 커버리지 분석

**Acceptance Criteria (6개):**
- ✅ AC 1: MarketDataNode 컴포넌트 구현 (프론트엔드)
- ✅ AC 2: 노드 팔레트 통합 (프론트엔드)
- ✅ AC 3: 속성 패널 설정 UI (프론트엔드)
- ✅ AC 4: 노드 데이터 즉시 반영 (프론트엔드)
- ❌ **AC 5: Binance API 연동** → Story 4-2에 의존 (backlog)
- ⚠️ **AC 6: 다양한 심볼/시간프레임 지원** → Story 4-2에 의존 (backlog)

**FR 커버리지:** 67% (4/6 AC가 프론트엔드만 가능)

**의존성 누락:**
- AC 5, AC 6는 Story 4-2 (historical-market-data)가 완료되어야 가능
- Story 3-3 Dev Notes에서 "Binance API 연동 준비 (실제 호출은 Story 4.2에서)"라고 언급하지만, 실제로는 API 스텁이 아닌 실제 연동이 필요함

### 1.2 의존성 매핑

**의존성 트리:**
```
Story 3-3 (market-data-node)
    ↓
Story 3-2 (node-type-definitions) ← Status: review (완료됨) ✅
Story 3-1 (react-flow-editor)    ← Status: review (완료됨) ✅
Story 4-2 (historical-market-data) ← Status: backlog ❌ 치명적!
```

**Story 4-2 (historical-market-data) 상세:**
- **목표:** Binance API에서 과거 OHLCV 데이터를 가져와 백테스팅에 사용
- **상태:** backlog
- **구현 내용:**
  - `ccxt` 라이브러리 또는 Binance Python SDK 사용
  - PostgreSQL market_data 테이블 생성
  - 데이터 파싱 및 저장
  - Rate limiting (1200 request/minute)
  - Redis 캐싱

**선행 조건 검증:**
- ✅ Story 3-1: React Flow 에디터 (review 상태, 거의 완료)
- ✅ Story 3-2: 노드 타입 정의 (review 상태, 거의 완료)
- ❌ **Story 4-2: market_data 테이블, 백엔드 API (backlog 상태, 미완료)**

### 1.3 누락된 기능 식별

**백엔드 의존성:**
- ❌ **market_data 테이블 미존재**: Alembic migration 없음
- ❌ **백엔드 API 엔드포인트 미정의**: `/api/v1/market/data` 엔드포인트 없음
- ❌ **ccxt 라이브러리 미설치**: requirements.txt에 없음
- ❌ **데이터 파싱 서비스 미구현**: market_data_service.py 없음

**사용자 요구사항 위반:**
- ❌ **"ccxt 라이브러리 반드시 사용"** 요구사항 무시
  - Story 4-2: "ccxt 또는 Binance Python SDK" (선택사항)
  - Architecture.md: ccxt 언급 없음
  - PRD: ccxt 언급 없음 (epics.md line 1827에만 단순 언급)

**결론:** 4개의 치명적인 Gap (백엔드 DB, 백엔드 API, ccxt 라이브러리, 데이터 파싱 서비스)

---

## Layer 2: 구현 상태 검증 (Implementation State Check)

### 2.1 프론트엔드 구현 상태

**Story 3-1, 3-2에서 구현된 파일:**
```typescript
gr8-frontend/src/
├── components/
│   └── editor/
│       ├── StrategyEditor.tsx  ✅ ReactFlow 캔버스 (230 lines)
│       ├── Toolbar.tsx         ✅ 상단 툴바 (95 lines)
│       ├── NodePalette.tsx     ✅ 노드 팔레트 (130 lines)
│       ├── PropertiesPanel.tsx ✅ 속성 패널 (75 lines)
│       └── StatusBar.tsx       ✅ 상태바 (40 lines)
└── stores/
    └── editorStore.ts          ✅ Zustand store (110 lines)
```

**Story 3-3에서 생성할 파일 (4개):**
```typescript
gr8-frontend/src/
├── components/
│   └── editor/
│       └── nodes/
│           ├── MarketDataNode.tsx  ⬜ 생성 예정 (프론트엔드 컴포넌트)
│           └── index.ts            ⬜ 수정 예정 (nodeTypes 등록)
└── utils/
    └── marketDataParser.ts         ⬜ 생성 예정 (데이터 파싱)
```

**검증 결과:**
- ✅ 프론트엔드 컴포넌트는 독립적으로 구현 가능
- ❌ 하지만 실제 데이터를 가져올 백엔드 API가 없음

### 2.2 백엔드 구현 상태

**필요한 백엔드 구성 요소:**

**1) Database Schema (market_data 테이블):**
```sql
-- Story 4-2에서 정의됨 (backlog 상태)
CREATE TABLE market_data (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20),
  timeframe VARCHAR(10),
  timestamp BIGINT,
  open DECIMAL(20, 8),
  high DECIMAL(20, 8),
  low DECIMAL(20, 8),
  close DECIMAL(20, 8),
  volume DECIMAL(30, 8),
  UNIQUE(symbol, timeframe, timestamp)
);
CREATE INDEX idx_market_data_lookup ON market_data(symbol, timeframe, timestamp);
```

**현재 상태:**
- ❌ Alembic migration 없음 (`alembic/versions/` 폴더 확인)
- ❌ SQLAlchemy model 없음 (`app/models/market_data.py` 없음)

**2) Backend API Endpoint:**
```python
# 필요한 엔드포인트
GET /api/v1/market/data?symbol=BTCUSDT&timeframe=1h&start_date=2024-01-01&end_date=2024-12-31
Response: { "data": [...], "cached": true }
```

**현재 상태:**
- ❌ API 라우터 없음 (`app/api/routers/market_data.py` 없음)
- ❌ Pydantic schema 없음

**3) ccxt 라이브러리:**
```bash
# requirements.txt에 필요한 패키지
ccxt>=4.0.0  # ❌ 현재 없음
```

**현재 상태:**
- ❌ ccxt 미설치 (requirements.txt 확인)

**4) Market Data Service:**
```python
# app/services/market_data_service.py
class MarketDataService:
    async def fetch_historical_data(symbol, timeframe, start, end):
        # ccxt.binance().fetch_ohlcv()
        pass
```

**현재 상태:**
- ❌ 서비스 미구현

### 2.3 환경 설정 검증

**TypeScript 설정:**
```json
{
  "typescript": "~5.9.3",  ✅
  "@types/react": "^19.2.5",  ✅
  "@types/node": "^24.10.1"  ✅
}
```

**Backend 설정:**
```python
# requirements.txt
fastapi>=0.104.0  ✅
sqlalchemy>=2.0.0  ✅
alembic>=1.12.0  ✅
ccxt>=4.0.0  ❌ 누락
asyncpg>=0.29.0  ✅
```

**결론:** 백엔드 환경 설정 ccxt 누락

---

## Layer 3: 의존성 그래프 분석 (Dependency Graph Analysis)

### 3.1 의존성 깊이 분석

```
Story 3-3 (market-data-node)
    ↓ depth=1
Story 3-2 (node-type-definitions) ✅
Story 3-1 (react-flow-editor) ✅
Story 4-2 (historical-market-data) ❌ backlog
    ↓ depth=2
Story 1-2 (backend-starter-template) ✅ done
```

**의존성 깊이:** 2
- ✅ depth ≤ 3: 정상 범위
- ❌ 하지만 Story 4-2가 backlog라서 실제 depth는 무한대 (block됨)

### 3.2 순환 의존성 검사

```
3-1 → 3-2 → 3-3 → 4-2 → ???
  ↑      ↓      ↓       ↓
  └──────┘ ✅ 순환 없음
```

**결론:** 순환 의존성 없음 (건전함)

### 3.3 Fan-out 분석

**Story 3-3를 의존하는 후속 Stories:**
- Story 3-4: 기술적 지표 노드 구현 (MarketDataNode 출력을 입력으로 사용)
- Story 3-5: 기본 매수/매도 액션 (시장 데이터 기반 액션)
- Story 4.3: 전략 실행 엔진 (데이터 소스 필요)

**Fan-out:** 3개
- ✅ 정상 범위 (과다 의존 아님)

---

## Gap 분석 및 해결 방안

### Gap 1: 백엔드 DB 스키마 누락 (치명적)

**발견 위치:**
- Story 3-3 AC 5: "Binance API를 호출하여 히스토리컬 데이터를 가져온다"
- Story 3-3 Dev Notes: "Binance API 연동 준비 (실제 호출은 Story 4.2에서)"

**현재 상태:**
- market_data 테이블 미존재
- Story 4-2만이 테이블 생성 정의

**영향도:**
- 치명적 (Story 3-3의 AC 5, AC 6 불가능)

**해결 옵션:**

#### 옵션 A: Story 3-3을 프론트엔드 전용으로 재정의 (권장) ⭐
```markdown
# Story 3-3 수정안
**목표:** 시장 데이터 노드 **UI 컴포넌트** 구현
**범위:** 프론트엔드만 (백엔드 API 연동 제외)
**AC 수정:**
- AC 5: "Mock 데이터로 UI 동작 테스트"로 변경
- AC 6: "다양한 심볼/시간프레임 설정 UI"로 변경
**백엔드 연동:** Story 4-2로 완전히 이관
```

**장점:**
- Story 3-3을 즉시 개발 가능
- 프론트엔드/백엔드 분리 원칙 준수
- Story 4-2에서 ccxt 라이브러리 집중 구현 가능

**단점:**
- Story 3-3 완료 후 실제 데이터를 볼 수 없음 (Story 4-2까지 기다려야 함)

#### 옵션 B: Story 4-2를 먼저 개발
```yaml
# sprint-status.yaml 수정
epic-4: in-progress  # backlog → in-progress
4-2-historical-market-data: ready-for-dev  # backlog → ready-for-dev
3-3-market-data-node: check-passed  # ready-for-dev → check-passed (4-2 완료 후 개발)
```

**장점:**
- 선행 조건 충족 후 Story 3-3 개발
- 백엔드부터 먼저 구축하는 전통적 접근

**단점:**
- 프론트엔드 개발이 지연됨
- 백엔드 구현 후 프론트엔드 수정 필요 가능성

### Gap 2: ccxt 라이브러리 미사용 (치명적)

**사용자 요구사항:**
> "거래소 데이터 가져오고, 나중에 실거래 하고 이런거는 다 ccxt 라이브러리 반드시 사용"

**현재 상태:**
- Story 4-2: "ccxt 또는 Binance Python SDK" (선택사항)
- Architecture.md: ccxt 언급 없음
- PRD: ccxt 언급 없음

**영향도:**
- 치명적 (사용자 요구사항 위반)

**해결 옵션:**

#### 옵션 A: Story 4-2에서 ccxt 라이브러리 강제 사용 (권장) ⭐
```markdown
# Story 4-2 수정안
**기술 구현:**
- `ccxt` 라이브러리 **반드시 사용** (Binance SDK 제외)
- ccxt >= 4.0.0 (최신 버전)
- 이유: 다중 거래소 지원, 표준화된 API, 실거래 준비

**삭제:**
- "또는 Binance Python SDK" 옵션 삭제
```

**장점:**
- 사용자 요구사항 충족
- 다중 거래소 확장성 확보 (Binance, OKX, Bybit 등)
- 실거래시 거래소 변경 용이

**단점:**
- ccxt 학습 곡선 (하지만 표준화된 API라 단순함)

#### 옵션 B: Binance Python SDK 사용
- 단일 거래소 최적화
- 하지만 사용자 요구사항 위반

### Gap 3: 백엔드 API 엔드포인트 미정의

**현재 상태:**
- Story 3-3: 프론트엔드에서 호출할 API 엔드포인트 미정의
- Story 4-2: 백엔드 엔드포인트 정의 필요

**해결 옵션:**

#### Story 4-2에서 API 엔드포인트 정의
```python
# app/api/routers/market_data.py
from fastapi import APIRouter, Depends, Query
from app.schemas.market_data import MarketDataResponse

router = APIRouter(prefix="/api/v1/market", tags=["market"])

@router.get("/data", response_model=MarketDataResponse)
async def get_market_data(
    symbol: str = Query(..., description="심볼 (예: BTCUSDT)"),
    timeframe: str = Query(..., description="시간프레임 (1m, 5m, 1h, 1d)"),
    start_date: datetime = Query(..., description="시작일"),
    end_date: datetime = Query(..., description="종료일"),
    current_user: User = Depends(get_current_user)  # Web3 인증
):
    # ccxt로 데이터 조회 또는 캐시된 데이터 반환
    pass
```

**Story 3-3 Dev Notes에 추가:**
```markdown
### 🌐 백엔드 API 통합

**엔드포인트** (Story 4-2에서 구현 예정):
```
GET /api/v1/market/data
Query Parameters:
- symbol: string (예: BTCUSDT)
- timeframe: string (1m, 5m, 15m, 1h, 4h, 1d)
- start_date: datetime (ISO 8601)
- end_date: datetime (ISO 8601)

Response:
{
  "data": [
    {
      "timestamp": 1499040000000,
      "open": "0.01634790",
      "high": "0.80000000",
      "low": "0.01575800",
      "close": "0.01577100",
      "volume": "148976.1141"
    },
    ...
  ],
  "cached": true,
  "symbol": "BTCUSDT",
  "timeframe": "1h"
}
```

**프론트엔드 호출 예시:**
```typescript
// src/services/marketDataService.ts
export async function fetchMarketData(
  symbol: string,
  timeframe: string,
  startDate: Date,
  endDate: Date
): Promise<MarketData[]> {
  const response = await axios.get('/api/v1/market/data', {
    params: {
      symbol: formatSymbolForAPI(symbol),  // BTC/USDT → BTCUSDT
      timeframe,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    },
  });
  return response.data.data;
}
```
```

### Gap 4: 데이터 파싱 서비스 누락

**해결 옵션:**

#### Story 4-2에서 ccxt 통합 서비스 구현
```python
# app/services/market_data_service.py
import ccxt
from app.models.market_data import MarketData
from sqlalchemy.ext.asyncio import AsyncSession

class MarketDataService:
    def __init__(self):
        self.exchange = ccxt.binance({
            'enableRateLimit': True,  # 자동 rate limiting
            'options': {
                'defaultType': 'spot',
            }
        })

    async def fetch_and_store(
        self,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime,
        db: AsyncSession
    ) -> List[MarketData]:
        """
        ccxt로 데이터 가져와서 DB에 저장
        """
        # ccxt fetch_ohlcv
        ohlcv = await self.exchange.fetch_ohlcv(
            symbol,
            timeframe,
            start_date.timestamp() * 1000,
            end_date.timestamp() * 1000
        )

        # DB에 저장 (중복 제거: UNIQUE constraint)
        for candle in ohlcv:
            market_data = MarketData(
                symbol=symbol,
                timeframe=timeframe,
                timestamp=candle[0],
                open=candle[1],
                high=candle[2],
                low=candle[3],
                close=candle[4],
                volume=candle[5]
            )
            db.add(market_data)

        await db.commit()
        return ohlcv
```

---

## 최종 검증 결과

### 종합 평가

| 레이어 | 상태 | 점수 | 비고 |
|--------|------|------|------|
| Layer 1: 문서 논리 | ❌ FAIL | 40/100 | 선행 의존성(Story 4-2) 미충족 |
| Layer 2: 구현 상태 | ❌ FAIL | 30/100 | 백엔드(DB, API, ccxt) 미구현 |
| Layer 3: 의존성 그래프 | ⚠️ WARNING | 70/100 | Story 4-2 blockage로 depth 무한대 |

**총점:** 46.7/100

### 상태: ❌ FAIL - 치명적인 Gap 발견

**의미:**
- Story 3-3는 **현재 상태로는 개발 불가능**
- Story 4-2 (백엔드)가 먼저 완료되어야 함
- ccxt 라이브러리 사용 의무화 필요

---

## 권장 사항

### 1. 즉시 조치 (Critical)

**옵션 A: Story 3-3을 프론트엔드 전용으로 재정의** (권장) ⭐
- AC 5, AC 6에서 백엔드 연동 제거
- Mock 데이터로 UI 개발
- Story 4-2 완료 후 통합 테스트

**또는**

**옵션 B: Story 4-2를 먼저 개발**
- sprint-status.yaml에서 Story 4-2를 ready-for-dev로 변경
- Story 3-3을 check-passed로 변경 (4-2 완료 후 개발)

### 2. Story 4-2 수정 사항

**ccxt 라이브러리 의무화:**
```markdown
# Story 4.2 수정안
**기술 구현:**
- `ccxt` 라이브러리 **반드시 사용** (버전 >= 4.0.0)
- 이유: 다중 거래소 지원, 표준화된 API, 실거래 준비

**삭제:**
- "또는 Binance Python SDK" 옵션 삭제
```

**백엔드 API 엔드포인트 정의:**
- `/api/v1/market/data` 엔드포인트 구현
- Pydantic schema 정의
- ccxt 기반 데이터 파싱 서비스

### 3. Architecture.md 업데이트

**ccxt 라이브러리 명시:**
```markdown
### External Data Integration

**Exchange Integration:**
- **Library:** ccxt >= 4.0.0 (Professional Cryptocurrency Trading Library)
  - Unified API across 100+ exchanges (Binance, OKX, Bybit, etc.)
  - Real-time and historical market data
  - Trading execution (future proof for live trading)
- **Supported Exchanges (MVP):**
  - Binance (primary)
  - OKX (Phase 2)
  - Bybit (Phase 2)

**Why ccxt?**
- ✅ Standardized API across exchanges
- ✅ Battle-tested, production-grade library
- ✅ Active community and maintenance
- ✅ Supports both data fetching and trading
```

### 4. 의존성 순서 재조정

**현재 (문제):**
```
3-3: ready-for-dev ❌
4-2: backlog ❌
```

**권장 (옵션 A):**
```
3-3: ready-for-dev ✅ (프론트엔드 전용)
4-2: backlog (백엔드)
```

**권장 (옵션 B):**
```
3-3: check-passed (4-2 완료 대기)
4-2: ready-for-dev ✅ (백엔드 먼저)
```

---

## 부록: 검증 체크리스트

### Layer 1 체크리스트
- [x] 모든 FR이 AC로 변환됨
- [ ] 선행 Story가 완료 상태임 (Story 4-2: backlog ❌)
- [ ] 외부 라이브러리 의존성 확인됨 (ccxt: 미정의 ❌)
- [x] 누락된 기능 식별 완료

### Layer 2 체크리스트
- [x] 선행 Story 구현 상태 확인 (Story 3-1, 3-2: review ✅)
- [ ] DB 스키마 준비 완료 (market_data: 없음 ❌)
- [ ] 백엔드 API 엔드포인트 정의 (없음 ❌)
- [ ] 패키지 의존성 검증 완료 (ccxt: 없음 ❌)

### Layer 3 체크리스트
- [x] 의존성 깊이 분석 (depth=2, 정상)
- [x] 순환 의존성 검사 (없음)
- [x] Fan-out 분석 (3개, 정상)

---

**보고서 생성:** 2026-01-20
**검증자:** Claude Sonnet 4.5 (Pre-Implementation Check Workflow)
**다음 단계:** 사용자 결재 필요 (옵션 A 또는 B 선택)
