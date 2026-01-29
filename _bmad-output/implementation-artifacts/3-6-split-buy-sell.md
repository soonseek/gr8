# Story 3.6: 분할 매수/매도 기능

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 매수/매도를 N번으로 나누어 실행하고 싶다,
**so that** 시장 영향을 분산하고 더 나은 평균 가격을 얻을 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (ActionNode 인터페이스 포함, splitCount/splitInterval 필드 있음)
- Story 3.5에서 기본 매수/매도 액션 노드 구현 준비 ✅
- ActionNodeComponent가 이미 구현됨 (nodeTypes/index.tsx)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅

**문제:**
- 일회성 매수/매도만 지원 (시장 영향 큼음)
- 대량 주문 시 슬리피지(가격 차이) 발생
- 평균 가격 최적화 불가

**해결:**
분할 매수/매도 기능 구현 (DCA: Dollar Cost Averaging)

**중요:**
- **분할 횟수**: 1~10회 (기본값: 1, 1은 일반 매수와 동일)
- **분할 간격**: 1분~1일 (기본값: 1시간)
- **백테스트 연동**: 순차적 실행, 상태 저장 ("3/5 완료")
- **시장 영향 분산**: 더 나은 평균 가격 달성
- **Story 3.5 확장**: 기존 ActionNode에 splitCount, splitInterval 추가

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 분할 매수/매도 옵션 추가

**Given** 액션 노드가 구현되었다 (Story 3.5)
**When** 개발자가 분할 매수/매도 기능을 추가한다
**Then** 액션 노드 설정에 "분할 매수/매도" 옵션이 추가된다
**And** 분할 횟수 입력이 제공된다 (1~10회, 기본값: 1)
**And** 분할 간격 입력이 제공된다 (1분~1일, 기본값: 1시간)
**And** 각 설정에 대한 라벨과 설명이 표시된다

### AC 2: 노드 라벨 동적 업데이트

**Given** 사용자가 분할 매수를 설정한다
**When** 분할 횟수를 5로, 간격을 1시간으로 설정한다
**Then** 노드 라벨이 업데이트된다 (예: "매수 100 USDC (5회 분할, 1시간 간격)")
**And** 전체 수량이 분할 횟수로 나누어진다 (100 USDC / 5 = 20 USDC씩)
**And** 각 매수가 1시간 간격으로 실행된다

### AC 3: 백테스트 엔진 연동 - 순차적 실행

**Given** 분할 매수/매도가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 첫 번째 매수가 즉시 실행된다
**And** 이후 매수들이 지정된 간격으로 실행된다
**And** 각 매수가 독립적인 거래로 기록된다
**And** 모든 매수가 완료될 때까지 다음 노드로 진행되지 않는다

### AC 4: 백테스트 재개 및 상태 저장

**Given** 분할 매수 중간에 시스템이 중단된다
**When** 백테스트가 재개된다
**Then** 마지막으로 완료된 분할부터 계속된다
**And** 이미 실행된 분할은 다시 실행되지 않는다
**And** 분할 상태가 백테스트 결과에 표시된다 ("3/5 완료")

### AC 5: 분할 설정 검증

**Given** 분할 매수/매도가 구현되었다
**When** 개발자가 다양한 분할 설정으로 테스트한다
**Then** 분할 횟수 1은 일반 매수와 동일하게 작동한다
**And** 분할 횟수 10이 정상 작동한다
**And** 다양한 간격(1분, 1시간, 1일)이 정상 작동한다
**And** 분할 간격이 백테스트 결과에 영향을 미친다 (슬리피지)

---

## Tasks / Subtasks

### Task 1: ActionNode 타입 확장 확인 (AC: #1)
- [ ] Subtask 1.1: ActionNode 인터페이스 확인 (splitCount, splitInterval 필드)
- [ ] Subtask 1.2: splitCount 기본값 설정 (1)
- [ ] Subtask 1.3: splitInterval 기본값 설정 (1h)
- [ ] Subtask 1.4: 분할 횟수 범위 검증 (1~10)
- [ ] Subtask 1.5: 분할 간격 범위 검증 (1m, 5m, 15m, 1h, 4h, 1d)

### Task 2: 속성 패널 UI 구현 (AC: #1, #2)
- [ ] Subtask 2.1: PropertiesPanel 컴포넌트에 ActionNode 분할 설정 UI 추가
- [ ] Subtask 2.2: 분할 매수/매도 토글 스위치 (기본값: OFF)
- [ ] Subtask 2.3: 분할 횟수 입력 UI (Number input: 1~10, 기본값 1)
- [ ] Subtask 2.4: 분할 간격 선택 UI (Select: 1m, 5m, 15m, 1h, 4h, 1d)
- [ ] Subtask 2.5: 설명 텍스트 추가 ("시장 영향 분산", "더 나은 평균 가격")

### Task 3: 노드 라벨 동적 업데이트 (AC: #2)
- [ ] Subtask 3.1: nodeFactory.ts에서 createLabel 함수 확장
- [ ] Subtask 3.2: 분할 설정 포함 라벨 생성 로직
  - splitCount = 1: "매수 100 USDC"
  - splitCount > 1: "매수 100 USDC (5회 분할, 1시간 간격)"
- [ ] Subtask 3.3: 라벨 업데이트 테스트

### Task 4: ActionNodeComponent 업데이트 (AC: #2)
- [ ] Subtask 4.1: ActionNodeComponent에 분할 정보 표시 추가
- [ ] Subtask 4.2: splitCount > 1일 때 분할 정보 뱃지 표시
- [ ] Subtask 4.3: 간격 정보 표시 (예: "5x @ 1h")

### Task 5: Zustand store와의 통합 (AC: #2)
- [ ] Subtask 5.1: editorStore에 updateNodeConfig 액션 사용 확인
- [ ] Subtask 5.2: 분할 설정 변경 시 store 업데이트
- [ ] Subtask 5.3: 노드 라벨 동적 업데이트 연동
- [ ] Subtask 5.4: React Flow의 onNodesChange 핸들러와 연동

### Task 6: 백테스트 엔진 연동 준비 (AC: #3, #4)
- [ ] Subtask 6.1: 백테스트 엔진 API 문서 확인 (Story 4.x)
- [ ] Subtask 6.2: 분할 실행 로직 스텁 구현
  - 첫 번째 매수: 즉시 실행
  - 이후 매수: 지정된 간격으로 실행
- [ ] Subtask 6.3: 분할 상태 저장 로직 스텁 (예: "3/5 완료")
- [ ] Subtask 6.4: 백테스트 재개 시 상태 복원 로직 스텁
- [ ] Subtask 6.5: 에러 처리 및 사용자 메시지

### Task 7: 테스트 및 검증 (AC: #5)
- [ ] Subtask 7.1: 분할 횟수 1 테스트 (일반 매수와 동일)
- [ ] Subtask 7.2: 분할 횟수 10 테스트 (최대 분할)
- [ ] Subtask 7.3: 다양한 간격 테스트 (1분, 1시간, 1일)
- [ ] Subtask 7.4: 슬리피지 영향 확인 (분할 vs 일회성)
- [ ] Subtask 7.5: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **분할 매수/매도 기능**을 구현하여 사용자가 대량 주문의 시장 영향을 분산하고 더 나은 평균 가격을 얻게 합니다. 완료되면:
- 사용자가 매수/매도를 N번으로 나누어 실행 가능 (1~10회)
- 분할 간격 설정 가능 (1분~1일)
- 백테스트에서 순차적 실행 및 상태 저장
- DCA(Dollar Cost Averaging) 전략 구현 가능
- 시장 영향 분산 및 슬리피지 감소

### 📚 Story 3.2 & 3.5에서 배운 패턴

**ActionNode 인터페이스** [Source: types/nodes.ts:181-193]:
```typescript
export interface ActionNode extends BaseNode {
  type: 'action';
  category: 'action';
  data: {
    label: string;
    config: {
      actionType: ActionType;
      amount: number;
      splitCount?: number;      // ✅ 이미 필드 존재
      splitInterval?: string;   // ✅ 이미 필드 존재
    };
  };
}
```

**분할 매수/매도 설정:**
- `splitCount`: 분할 횟수 (1~10, 1 = 분할 없음)
- `splitInterval`: 분할 간격 (1m, 5m, 15m, 1h, 4h, 1d)
- 분할 수량 = 전체 수량 / splitCount
- 예: 100 USDC, 5회 분할 → 20 USDC씩 5회

### 🏗️ React Flow 커스텀 노드 패턴

**기존 ActionNodeComponent** [Source: nodeTypes/index.tsx:238-290]:
```typescript
export const ActionNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNode['data'];
  const isBuy = nodeData.config.actionType === 'BUY';

  return (
    <div className={`px-4 py-2 rounded-lg border-2 bg-gray-800 ${
      isBuy ? 'border-green-500' : 'border-red-500'
    }`} style={{ minWidth: '200px' }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* ... node icon and label ... */}

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className={isBuy ? 'text-green-400' : 'text-red-400'}>
            {nodeData.config.actionType}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="text-yellow-400">{nodeData.config.amount}</span>
        </div>
        {nodeData.config.splitCount && (  // ✅ 이미 분할 정보 표시됨
          <div className="flex justify-between">
            <span>Split:</span>
            <span className="text-blue-400">
              {nodeData.config.splitCount}x ({nodeData.config.splitInterval})
            </span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
```

**확인 사항:**
- ✅ splitCount, splitInterval 표시 로직 이미 구현됨 (lines 276-283)
- ✅ 분할 정보가 있을 때만 표시됨

### 📐 파일 구조

**Story 3.6에서 수정할 파일:**
```
src/
├── components/
│   └── editor/
│       └── PropertiesPanel.tsx          # ✅ 수정 (ActionNode 분할 설정 UI 추가)
├── utils/
│   └── nodeFactory.ts                   # ✅ 수정 (분할 설정 기본값)
└── types/
    └── nodes.ts                          # Story 3.2에서 정의 완료 (필드 있음)
```

### 🎨 UI/UX 디자인 가이드

**속성 패널 디자인:**
```
┌─────────────────────────────────┐
│ 💰 매수/매도 액션 설정          │
├─────────────────────────────────┤
│ 액션 타입                        │
│ [BUY] (읽기 전용)               │
│                                  │
│ 수량                             │
│ [100]                            │
│                                  │
│ 수량 단위                        │
│ [USDC (quote asset) ▼]          │
│                                  │
│ ┌─ 분할 매수/매도 설정 ────────┐ │
│ │ 분할 매수 사용                 │ │
│ │ [토글 스위치]                  │ │
│ │                               │ │
│ │ 분할 횟수                     │ │
│ │ [5] (1~10회)                  │ │
│ │                               │ │
│ │ 분할 간격                     │ │
│ │ [1시간 ▼]                     │ │
│ │ (1분, 5분, 15분, 1시간, 4시간, 1일) │ │
│ │                               │ │
│ │ 💡 시장 영향을 분산하고      │ │
│ │ 더 나은 평균 가격을 얻을 수 │ │
│ │ 있습니다 (DCA 전략)          │ │
│ └───────────────────────────────┘ │
└─────────────────────────────────┘
```

**노드 라벨 예시:**
- 분할 없음 (splitCount=1): "매수 100 USDC"
- 5회 분할: "매수 100 USDC (5회 분할, 1시간 간격)"
- 10회 분할: "매수 1000 USDC (10회 분할, 1일 간격)"

### 💡 분할 매수/매도 이해

**DCA (Dollar Cost Averaging) 전략:**
- 정기적 일정 금액 투자
- 시장 타이밍 중요성 감소
- 평균 매입 단가 최적화
- 변동성 완화

**시장 영향 분산 예시:**
- 일회성: 1000 USDC를 한 번에 매수 → 가격 5% 상승 (슬리피지)
- 5회 분할: 200 USDC씩 5회 매수 → 가격 1% 상승 (슬리피지 감소)

**백테스트 실행 순서:**
```
시간 0: 첫 번째 매수 (200 USDC) → 포지션 진입
시간 1h: 두 번째 매수 (200 USDC) → 포지션 추가
시간 2h: 세 번째 매수 (200 USDC) → 포지션 추가
시간 3h: 네 번째 매수 (200 USDC) → 포지션 추가
시간 4h: 다섯 번째 매수 (200 USDC) → 포지션 완료
```

### ⚠️ 중요 고려사항

**1. 분할 횟수 범위:**
- 최소: 1 (분할 없음, 일반 매수와 동일)
- 최대: 10 (백테스트 속도 고려)
- 기본값: 1 (분할 사용하지 않음)

**2. 분할 간격 단위:**
- 1분 (1m): 고빈도 트레이딩
- 5분 (5m), 15분 (15m): 단기 트레이딩
- 1시간 (1h), 4시간 (4h): 일일 트레이딩
- 1일 (1d): 스윙 트레이딩

**3. 백테스트 엔진 연동:**
- 각 분할은 독립적인 거래로 기록
- 분할 상태 저장: "1/5 완료", "3/5 완료"
- 백테스트 중단 시 재개 가능
- 이미 실행된 분할은 재실행 안 함

**4. 포트폴리오 계산:**
- 전체 수량: 100 USDC
- 분할 횟수: 5
- 1회당 수량: 20 USDC
- 총 비용: 20 × 5 = 100 USDC
- 수수료: 각 분할마다 발생 (백테스트에서는 무시 가능)

**5. 에러 처리:**
- 분할 횟수가 0 또는 음수: "유효하지 않은 분할 횟수입니다"
- 분할 횟수가 10 초과: "분할 횟수는 최대 10회입니다"
- 간격이 너무 짧음: "분할 간격이 최소 데이터 간격보다 짧습니다"

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
describe('Split Order', () => {
  it('splitCount=1 is same as normal order', () => {
    const config = { amount: 100, splitCount: 1 };
    expect(config.splitCount).toBe(1);
  });

  it('splits amount correctly', () => {
    const totalAmount = 100;
    const splitCount = 5;
    const eachAmount = totalAmount / splitCount;
    expect(eachAmount).toBe(20);
  });

  it('generates correct label', () => {
    const config = {
      actionType: 'BUY',
      amount: 100,
      splitCount: 5,
      splitInterval: '1h'
    };
    const label = generateActionLabel(config);
    expect(label).toBe('매수 100 USDC (5회 분할, 1시간 간격)');
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (ActionNode 인터페이스)
- ✅ Story 3.3: 시장 데이터 노드 (OHLCV 데이터 소스)
- ✅ Story 3.4: 기술적 지표 노드 (매매 신호 생성)
- ✅ Story 3.5: 기본 매수/매도 액션 노드 (기본 구현 완료)

**후속 Stories (이 Story의 분할 기능 활용):**
- Story 3.7: 조건부 분기 노드 (예: RSI < 30이면 5회 분할 매수)
- Story 3.9: 리스크 관리 노드 (Stop Loss/Take Profit와 분할 조합)
- Story 4.x: 백테스트 엔진 (분할 실행 로직 구현)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-6的完整AC
2. ✅ 分析了Story 3.5的实现模式作为参考
3. ✅ 确认了ActionNode接口定义 (splitCount, splitInterval 필드 있음)
4. ✅ 整合了project-context.md的关键规则
5. ✅ 分析了现有ActionNodeComponent结构 (분할 정보 표시됨)
6. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: ActionNode 타입 확장 확인
- Task 2: 속성 패널 UI 구현
- Task 3: 노드 라벨 동적 업데이트
- Task 4: ActionNodeComponent 업데이트
- Task 5: Zustand store集成
- Task 6: 백테스트 엔진 연동 준비
- Task 7: 테스트 및 검증

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-6-split-buy-sell.md` - This story file

**Frontend Files to Modify (2 files)**
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 수정 (분할 설정 UI 추가)
- `gr8-frontend/src/utils/nodeFactory.ts` - ✅ 수정 (분할 설정 기본값)

**Test Files:**
- `gr8-frontend/src/components/editor/PropertiesPanel.test.tsx` - ✅ 새로 생성 (선택사항)

**Total:** 2-3 files to modify/create

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-6 Created**
- Created comprehensive story file for Split Buy/Sell functionality
- Extracted all AC from epics.md
- Analyzed Story 3-5 for implementation patterns
- Added detailed dev notes with code examples
- Prepared testing strategy with sample test cases
- Defined DCA (Dollar Cost Averaging) strategy logic
