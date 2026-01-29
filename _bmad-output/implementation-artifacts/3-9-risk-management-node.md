# Story 3.9: 리스크 관리 노드 (Stop Loss, Take Profit)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** Stop Loss와 Take Profit를 설정하여 리스크를 관리하고 싶다,
**so that** 손실을 제한하고 이익을 확정할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (RiskManagementNode 인터페이스 포함)
- Story 3.3~3.8에서 시장 데이터, 지표, 액션, 조건, Loop 노드 구현 ✅
- RiskManagementNodeComponent가 이미 기본 형태로 구현됨 (nodeTypes/index.tsx:390-437)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅

**문제:**
- 리스크 관리 기능 없음 (손실 제한 불가)
- Stop Loss(손절), Take Profit(익절) 설정 불가
- 강한 상승 후 급락 시 손실 통제 불가
- 이익이 확정되지 않고 다시 손실로 전락 가능

**해결:**
리스크 관리 노드(Stop Loss, Take Profit) 구현

**중요:**
- **노드 형태**: 방패 모양 🛡️ (리스크 방어)
- **Stop Loss(SL)**: 진입 가격 이하로 떨어지면 손절
- **Take Profit(TP)**: 진입 가격 이상으로 상승하면 익절
- **퍼센트 또는 고정 가격** 선택 가능
- **Trailing Stop Loss**: 가격이 상승할 때 자동으로 SL 상향 조정
- **OCO (One Cancels Other)**: SL/TP 중 하나가 트리거되면 다른 하나 자동 비활성화
- **백테스트**: 각 캔들에서 가격 모니터링 및 청산 실행

---

## 수용 기준 (Acceptance Criteria)

### AC 1: RiskManagementNode 컴포넌트 구현

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/RiskManagementNode.tsx`를 생성한다
**Then** 리스크 관리 노드 컴포넌트가 구현된다
**And** Stop Loss(SL)과 Take Profit(TP)가 별도 노드로 제공된다
**And** 노드가 방패 모양으로 표시된다 (🛡️)
**And** 노드가 1개 입력 포트(진입 가격)와 1개 출력 포트(청산 신호)를 가진다

### AC 2: Stop Loss 설정 패널 구현

**Given** 사용자가 Stop Loss 노드를 추가한다
**When** SL 설정 패널이 표시된다
**Then** SL 가격 입력이 제공된다 (예: 진입 가격 - 5%)
**And** 퍼센트 또는 고정 가격을 선택할 수 있다
**And** 예: "진입 가격의 95%가 되면 청산"
**And** Trailing Stop Loss 옵션이 제공된다 (선택 사항)

### AC 3: Take Profit 설정 패널 구현

**Given** 사용자가 Take Profit 노드를 추가한다
**When** TP 설정 패널이 표시된다
**Then** TP 가격 입력이 제공된다 (예: 진입 가격 + 10%)
**And** 퍼센트 또는 고정 가격을 선택할 수 있다
**And** 예: "진입 가격의 110%가 되면 청산"
**And** 여러 TP 레벨을 설정할 수 있다 (예: TP1 50%, TP2 100%)

### AC 4: 백테스트 엔진 연동

**Given** SL/TP 노드가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 캔들에서 현재 가격이 모니터링된다
**And** SL 가격에 도달하면 포지션이 청산된다
**And** TP 가격에 도달하면 포지션이 청산된다
**And** 청산 가격, 시간, 이익/손실이 기록된다
**And** SL/TP가 트리거되면 해당 포지션은 더 이상 모니터링되지 않는다

### AC 5: OCO (One Cancels Other) 기능

**Given** 매수/매도 액션과 SL/TP가 조합되었다
**When** 사용자가 매수 + SL + TP를 설정한다
**Then** 매수 후 SL과 TP가 활성화된다
**And** 먼저 도달하는 쪽이 트리거된다
**And** 다른 하나는 자동으로 비활성화된다 (OCO - One Cancels Other)
**And** 백테스트 결과에 SL/TP 실행 여부가 표시된다

---

## Tasks / Subtasks

### Task 1: RiskManagementNode 타입 확장 (AC: #1, #2, #3)
- [ ] Subtask 1.1: RiskManagementNode 인터페이스 확인 (types/nodes.ts:231-243)
- [ ] Subtask 1.2: stopLoss 필드 확장
  - value: number (가격 또는 퍼센트)
  - type: 'PERCENT' | 'FIXED'
- [ ] Subtask 1.3: takeProfit 필드 확장
  - value: number
  - type: 'PERCENT' | 'FIXED'
  - levels: TP levels array (TP1, TP2, ...)
- [ ] Subtask 1.4: trailingStop 필드 확장
  - percentage: number
  - activationPrice: number (Trailing 활성화 가격)
- [ ] Subtask 1.5: actionNodeId 참조 확인 (어떤 액션의 리스크 관리인지)

### Task 2: RiskManagementNodeComponent 방패 모양 구현 (AC: #1)
- [ ] Subtask 2.1: CSS로 방패 모양 생성 (border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%)
- [ ] Subtask 2.2: 입력 포트 1개 추가 (target: Top)
- [ ] Subtask 2.3: 출력 포트 1개 추가 (source: Bottom)
- [ ] Subtask 2.4: SL/TP 가격 표시
- [ ] Subtask 2.5: Trailing Stop 표시

### Task 3: Stop Loss 속성 패널 UI 구현 (AC: #2)
- [ ] Subtask 3.1: PropertiesPanel에 Stop Loss 설정 UI 추가
- [ ] Subtask 3.2: SL 가격 입력 (Number input)
- [ ] Subtask 3.3: 퍼센트/고정 가격 선택 (Radio button)
  - 퍼센트: "진입 가격의 X%"
  - 고정 가격: "X USDC 도달 시"
- [ ] Subtask 3.4: Trailing Stop Loss 설정 (선택사항)
  - 활성화 여부 (Toggle)
  - Trailing 퍼센트 (예: 5%)
  - 활성화 가격 (예: 진입 + 2%)
- [ ] Subtask 3.5: 설명 텍스트 추가 ("손실 제한", "진입 가격 이하 시 자동 청산")

### Task 4: Take Profit 속성 패널 UI 구현 (AC: #3)
- [ ] Subtask 4.1: PropertiesPanel에 Take Profit 설정 UI 추가
- [ ] Subtask 4.2: TP 가격 입력 (Number input)
- [ ] Subtask 4.3: 퍼센트/고정 가격 선택 (Radio button)
- [ ] Subtask 4.4: 여러 TP 레벨 설정
  - TP 레벨 추가 버튼 ("+ TP 레벨 추가")
  - 각 레벨: 가격, 비율 (예: TP1: 50%, TP2: 100%)
- [ ] Subtask 4.5: 설명 텍스트 추가 ("이익 확정", "진입 가격 이상 시 자동 청산")

### Task 4: 노드 라벨 동적 업데이트 (AC: #2, #3)
- [ ] Subtask 4.1: nodeFactory.ts에서 createLabel 함수 확장
- [ ] Subtask 4.2: Stop Loss 라벨: "SL @ 95% (진입가격 -5%)"
- [ ] Subtask 4.3: Take Profit 라벨: "TP @ 110% (진입가격 +10%)"
- [ ] Subtask 4.4: 라벨이 너무 길면 truncate

### Task 5: 백테스트 엔진 연동 준비 (AC: #4)
- [ ] Subtask 5.1: 백테스트 엔진 API 문서 확인 (Story 4.x)
- [ ] Subtask 5.2: 가격 모니터링 로직 스텁
  - 각 캔들에서 현재 가격 확인
  - SL 가격 도달 → 포지션 청산
  - TP 가격 도달 → 포지션 청산
- [ ] Subtask 5.3: 청산 실행 로직 스텁
  - 청산 가격, 시간, 이익/손실 기록
  - 포지션 상태 업데이트 (closed)
- [ ] Subtask 5.4: Trailing Stop 로직 스텁
  - 가격 상승 시 SL 가격 상향 조정
  - 최고가 추적
- [ ] Subtask 5.5: 에러 처리 및 사용자 메시지

### Task 6: OCO (One Cancels Other) 기능 구현 (AC: #5)
- [ ] Subtask 6.1: SL과 TP 쌍 관리
  - actionNodeId로 그룹핑
  - 활성/비활성 상태 추적
- [ ] Subtask 6.2: SL 트리거 시 TP 자동 비활성화
- [ ] Subtask 6.3: TP 트리거 시 SL 자동 비활성화
- [ ] Subtask 6.4: 백테스트 결과에 트리거 표시
  - "SL 실행", "TP 실행"
  - 청산 가격, 시간, PnL

### Task 7: 테스트 및 검증 (AC: #2, #3, #4, #5)
- [ ] Subtask 7.1: Stop Loss 테스트
  - 진입 100 USDC, SL 95%
  - 가격 95 USDC 도달 시 청산 확인
- [ ] Subtask 7.2: Take Profit 테스트
  - 진입 100 USDC, TP 110%
  - 가격 110 USDC 도달 시 청산 확인
- [ ] Subtask 7.3: OCO 기능 테스트
  - 매수 + SL + TP 설정
  - TP 먼저 도달 시 SL 비활성화 확인
- [ ] Subtask 7.4: Trailing Stop 테스트
  - 진입 100 USDC, SL 95%, Trailing 5%
  - 가격 110 USDC 상승 시 SL 104.5 USDC로 조정
- [ ] Subtask 7.5: 다중 TP 레벨 테스트
- [ ] Subtask 7.6: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **리스크 관리 노드(Stop Loss, Take Profit)**를 구현하여 사용자가 손실을 제한하고 이익을 확정할 수 있게 합니다. 완료되면:
- Stop Loss로 손실 제한 가능 (진입 가격 -5% 청산)
- Take Profit로 이익 확정 가능 (진입 가격 +10% 청산)
- Trailing Stop으로 상승장 대응 가능
- OCO 기능으로 자동 비활성화
- 백테스트에서 SL/TP 실행 시뮬레이션 가능

### 📚 Story 3.2에서 배운 패턴

**RiskManagementNode 인터페이스** [Source: types/nodes.ts:231-243]:
```typescript
export interface RiskManagementNode extends BaseNode {
  type: 'risk_mgmt';
  category: 'logic';
  data: {
    label: string;
    config: {
      stopLoss?: number;    // Stop loss price/percentage
      takeProfit?: number;  // Take profit price/percentage
      trailingStop?: number; // Trailing stop percentage
      actionNodeId: string; // Reference to the action node
    };
  };
}
```

**확장 필요 (SL/TP 세부 설정):**
```typescript
export interface RiskManagementNode extends BaseNode {
  type: 'risk_mgmt';
  category: 'logic';
  data: {
    label: string;
    config: {
      stopLoss?: {
        value: number;           // 5 (5%)
        type: 'PERCENT' | 'FIXED'; // 퍼센트 or 고정 가격
      };
      takeProfit?: {
        value: number;
        type: 'PERCENT' | 'FIXED';
        levels?: Array<{         // 다중 TP 레벨
          value: number;
          percentage: number;    // 50%, 100%
        }>;
      };
      trailingStop?: {
        percentage: number;      // 5%
        activationPrice: number; // 진입 + 2%
      };
      actionNodeId: string;
    };
  };
}
```

### 🏗️ React Flow 커스텀 노드 패턴

**기존 RiskManagementNodeComponent** [Source: nodeTypes/index.tsx:390-437]:
```typescript
export const RiskManagementNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as RiskManagementNode['data'];

  return (
    <div className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-pink-500 ${
      selected ? 'ring-2 ring-pink-300' : ''
    }`} style={{ minWidth: '200px' }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-pink-600 flex items-center justify-center text-white font-bold">
          R
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Risk Management</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        {nodeData.config.stopLoss && (
          <div className="flex justify-between">
            <span>Stop Loss:</span>
            <span className="text-red-400">{nodeData.config.stopLoss}</span>
          </div>
        )}
        {nodeData.config.takeProfit && (
          <div className="flex justify-between">
            <span>Take Profit:</span>
            <span className="text-green-400">{nodeData.config.takeProfit}</span>
          </div>
        )}
        {nodeData.config.trailingStop && (
          <div className="flex justify-between">
            <span>Trailing:</span>
            <span className="text-blue-400">{nodeData.config.trailingStop}%</span>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
```

**수정 필요:**
1. 방패 모양 (border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%)
2. SL/TP 세부 정보 표시 (퍼센트/고정 가격)

### 📐 파일 구조

**Story 3.9에서 수정할 파일:**
```
src/
├── components/
│   └── editor/
│       ├── nodeTypes/
│       │   └── index.tsx                    # ✅ 수정 (방패 모양)
│       └── PropertiesPanel.tsx              # ✅ 수정 (SL/TP 설정 UI)
├── utils/
│   └── nodeFactory.ts                       # ✅ 수정 (createRiskManagementNode 라벨 생성)
└── types/
    └── nodes.ts                              # ✅ 수정 (RiskManagementNode 타입 확장)
```

### 🎨 UI/UX 디자인 가이드

**방패 모양 노드 디자인:**
```
   🛡️ SL @ 95%
  ┌─────────┐
  │ SL: 95% │
  │ TP: 110%│
  │ Trailing│
  └─────────┘
```

**Stop Loss 속성 패널:**
```
┌─────────────────────────────────┐
│ 🛡️ Stop Loss 설정                │
├─────────────────────────────────┤
│ 청산 가격                        │
│ [5] % (진입가격 대비)            │
│                                  │
│ 토글: [퍼센트] [고정 가격]      │
│                                  │
│ 💡 진입가격 이하로 떨어지면      │
│ 자동으로 청산합니다 (손실 제한) │
│                                  │
│ ┌─ Trailing Stop Loss (선택) ──┐│
│ │ 활성화 [토글]                 ││
│ │ 퍼센트: [5]%                  ││
│ │ 활성화: 진입 + [2]%           ││
│ │                               ││
│ │ 💡 가격 상승 시 자동으로     ││
│ │ SL 가격을 상향 조정합니다    ││
│ └───────────────────────────────┘│
└─────────────────────────────────┘
```

**Take Profit 속성 패널:**
```
┌─────────────────────────────────┐
│ 🎯 Take Profit 설정              │
├─────────────────────────────────┤
│ 청산 가격                        │
│ [10] % (진입가격 대비)           │
│                                  │
│ 토글: [퍼센트] [고정 가격]      │
│                                  │
│ 💡 진입가격 이상으로 상승하면   │
│ 자동으로 청산합니다 (이익 확정) │
│                                  │
│ ┌─ 다중 TP 레벨 (선택) ────────┐│
│ │ [+ TP 레벨 추가]              ││
│ │                               ││
│ │ TP 레벨 1:                    ││
│ │ [50]% → 50 USDC 매도          ││
│ │ [🗑️ 삭제]                     ││
│ │                               ││
│ │ TP 레벨 2:                    ││
│ │ [100]% → 나머지 전체 매도     ││
│ │ [🗑️ 삭제]                     ││
│ └───────────────────────────────┘│
└─────────────────────────────────┘
```

**노드 라벨 예시:**
- Stop Loss: "SL @ 95%", "SL @ 95 USDC"
- Take Profit: "TP @ 110%", "TP @ 110 USDC"
- Trailing: "TL @ 5% (act: 102%)"
- 복합: "RISK (SL: 95%, TP: 110%)"

### 💡 Stop Loss / Take Profit 이해

**Stop Loss (손절매):**
- 진입 가격: 100 USDC
- SL: 95% (진입 -5%)
- 가격이 95 USDC 도달 시 → 자동 청산 → 손실 5 USDC

**Take Profit (익절매):**
- 진입 가격: 100 USDC
- TP: 110% (진입 +10%)
- 가격이 110 USDC 도달 시 → 자동 청산 → 이익 10 USDC

**Trailing Stop Loss:**
- 진입: 100 USDC
- SL: 95%, Trailing: 5%, 활성화: 102%
- 가격 100 → 102 (SL: 95 고정)
- 가격 102 → 110 (SL: 104.5로 상향 조정, 110 * 0.95)
- 가격 110 → 105 (SL: 104.5 유지, 청산 안 됨)
- 가격 105 → 104.5 (SL 트리거, 청산)

**OCO (One Cancels Other):**
- 매수: 100 USDC
- SL: 95%, TP: 110%
- 시나리오 1: 가격 95 USDC → SL 트리거 → TP 비활성화 → 손실 5 USDC
- 시나리오 2: 가격 110 USDC → TP 트리거 → SL 비활성화 → 이익 10 USDC

**다중 TP 레벨:**
- TP1: 50% (50 USDC 매도)
- TP2: 100% (나머지 50 USDC 매도)
- 가격 105 USDC → TP1 트리거 → 50 USDC 매도
- 가격 110 USDC → TP2 트리거 → 50 USDC 매도

### ⚠️ 중요 고려사항

**1. 방패 모양 구현:**
- CSS `border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%`
- 또는 🛡️ emoji 사용

**2. 퍼센트 vs 고정 가격:**
- 퍼센트: "진입 가격의 95%" (진행률 계산 필요)
- 고정 가격: "95 USDC 도달 시" (절대 가격)

**3. Trailing Stop 로직:**
- 최고가 추적 필요
- 진입 + activationPrice 도달 시부터 Trailing 시작
- 최고가 - trailingPercentage = SL 가격
- 최고가 갱신 시 SL 가격 상향 조정 (하향은 불가)

**4. OCO 구현:**
- actionNodeId로 SL/TP 쌍 관리
- SL 트리거 → TP 비활성화
- TP 트리거 → SL 비활성화
- 백테스트에서 상태 추적

**5. 다중 TP 레벨:**
- TP1, TP2, ... 순차 실행
- 각 TP 레벨마다 청산 비율
- 예: TP1: 50% (0~50% 포지션), TP2: 100% (50%~100% 포지션)

**6. 백테스트 연동:**
- 각 캔들마다 가격 확인
- SL/TP 가격 도달 시 즉시 청산
- 청산 기록: 가격, 시간, PnL
- 청산 후 포지션 모니터링 중지

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
describe('RiskManagementNode', () => {
  it('calculates Stop Loss price correctly', () => {
    const entryPrice = 100;
    const sl = { value: 5, type: 'PERCENT' };
    expect(calculateStopLoss(entryPrice, sl)).toBe(95);
  });

  it('calculates Take Profit price correctly', () => {
    const entryPrice = 100;
    const tp = { value: 10, type: 'PERCENT' };
    expect(calculateTakeProfit(entryPrice, tp)).toBe(110);
  });

  it('triggers Stop Loss correctly', () => {
    const position = {
      entryPrice: 100,
      sl: 95,
      currentPrice: 95
    };
    expect(shouldTriggerStopLoss(position)).toBe(true);
  });

  it('updates Trailing Stop correctly', () => {
    const trailing = {
      percentage: 5,
      activationPrice: 102,
      currentHighest: 110
    };
    expect(calculateTrailingStop(trailing)).toBe(104.5);
  });

  it('handles OCO correctly', () => {
    const ocoState = { slActive: true, tpActive: true };
    const slTriggered = true;
    const newState = handleOCO(ocoState, slTriggered);
    expect(newState).toEqual({ slActive: false, tpActive: false });
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (RiskManagementNode 인터페이스)
- ✅ Story 3.5: 기본 매수/매도 액션 노드 (actionNodeId 참조)

**후속 Stories (이 Story의 리스크 관리 활용):**
- Story 4.x: 백테스트 엔진 (SL/TP 실행 로직 구현)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-9的完整AC (5개 AC)
2. ✅ 分析了Story 3-8的实现模式作为参考
3. ✅ 确认了RiskManagementNode接口定义 (types/nodes.ts:231-243)
4. ✅ 确认了FR14 커버리지 (리스크 관리 노드)
5. ✅ 整合了project-context.md的关键规则
6. ✅ 分析了现有RiskManagementNodeComponent结构 (nodeTypes/index.tsx:390-437)
7. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: RiskManagementNode 타입 확장
- Task 2: RiskManagementNodeComponent 방패 모양 구현
- Task 3: Stop Loss 속성 패널 UI 구현
- Task 4: Take Profit 속성 패널 UI 구현
- Task 5: 노드 라벨 동적 업데이트
- Task 6: 백테스트 엔진 연동 준비
- Task 7: OCO (One Cancels Other) 기능 구현

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-9-risk-management-node.md` - This story file

**Frontend Files to Modify (3 files)**
- `gr8-frontend/src/components/editor/nodeTypes/index.tsx` - ✅ 수정 (방패 모양)
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 수정 (SL/TP 설정 UI)
- `gr8-frontend/src/utils/nodeFactory.ts` - ✅ 수정 (createRiskManagementNode 라벨 생성)

**Type Definitions:**
- `gr8-frontend/src/types/nodes.ts` - ✅ 수정 (RiskManagementNode 타입 확장)

**Test Files:**
- `gr8-frontend/src/components/editor/nodeTypes/RiskManagementNode.test.tsx` - ✅ 새로 생성 (선택사항)

**Total:** 3-4 files to modify/create

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-9 Created**
- Created comprehensive story file for Risk Management Node (Stop Loss, Take Profit)
- Extracted all AC from epics.md (5 ACs)
- Analyzed existing RiskManagementNode implementation
- Added detailed dev notes with code examples
- Defined Stop Loss/Take Profit patterns
- Designed Trailing Stop and OCO functionality
- Prepared backtest engine integration
