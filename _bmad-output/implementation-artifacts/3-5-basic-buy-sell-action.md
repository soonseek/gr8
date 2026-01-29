# Story 3.5: 기본 매수/매도 액션 노드

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 매수/매도 액션 노드를 추가하여 거래를 실행할 수 있고 싶다,
**so that** 전략이 트래딩 신호를 생성할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (ActionNode 인터페이스 포함)
- Story 3.3에서 시장 데이터 노드 구현 완료 ✅ (MarketDataNode로 OHLCV 데이터 제공)
- Story 3.4에서 기술적 지표 노드 구현 준비 ✅ (IndicatorNode로 매매 신호 생성 가능)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅
- 에디터 4영역 레이아웃 (Toolbar, NodePalette, PropertiesPanel, StatusBar) 완료 ✅

**문제:**
- 매수/매도 액션 노드 컴포넌트가 구현되지 않음
- 사용자가 트래딩 신호를 실행할 수 없음
- 백테스트 엔진에서 거래 기록 기능 없음

**해결:**
ActionNode 컴포넌트 구현 및 백테스트 엔진 연동

**중요:**
- **액션 타입**: BUY(매수), SELL(매도)
- **수량 설정**: base asset 또는 quote asset 단위
- **백테스트 연동**: 거래 시간, 가격, 수량 기록 (FR25)
- **포트폴리오 시뮬레이션**: 진입/청산 포인트로 기록

---

## 수용 기준 (Acceptance Criteria)

### AC 1: ActionNode 컴포넌트 구현

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodeTypes/ActionNode.tsx`를 생성한다 (또는 기존 nodeTypes/index.tsx의 ActionNodeComponent 확장)
**Then** 액션 노드 컴포넌트가 구현된다
**And** 매수 노드가 초록색으로 표시된다 (bg-green-900, border-green-600)
**And** 매도 노드가 빨간색으로 표시된다 (bg-red-900, border-red-600)
**And** 노드가 1개 입력 포트(target: Top, 신호)와 출력 포트(source: 없음)를 가진다
**And** 노드가 다크모드 스타일링된다

### AC 2: 노드 팔레트 통합

**Given** ActionNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 매수/매도 노드를 드래그한다
**Then** 노드가 캔버스에 추가된다
**And** nodeFactory를 통해 노드가 생성된다
**And** 우측 속성 패널에 노드 설정이 표시된다
**And** 이전 노드(ConditionNode, IndicatorNode 등)의 출력 포트와 연결할 수 있다

### AC 3: 액션 설정 패널 UI

**Given** 사용자가 노드 팔레트에서 매수 노드를 추가한다
**Then** 액션 설정 패널이 표시된다
**And** 액션 타입이 표시된다 (BUY 또는 SELL)
**And** 수량 입력이 제공된다 (예: 100 USDC)
**And** 수량 단위 선택이 제공된다 (base asset 또는 quote asset)
**And** 각 설정에 대한 라벨과 설명이 표시된다

### AC 4: 노드 데이터 즉시 반영

**Given** 매수/매도 노드가 추가되었다
**When** 사용자가 노드 설정을 변경한다
**Then** 변경 사항이 즉시 노드 데이터에 반영된다 (Zustand store 업데이트)
**And** 노드 라벨이 업데이트된다 (예: "매수 100 USDC", "매도 0.5 BTC")
**And** 설정이 localStorage에 저장된다
**And** 전략 실행 시 이 수량이 사용된다

### AC 5: 백테스트 엔진 연동 준비

**Given** 액션 노드가 구현되었다
**When** 백테스팅 엔진이 실행된다 (Story 4.x)
**Then** 액션 노드에 도달하면 거래가 기록된다
**And** 거래 시간, 가격, 수량이 백테스트 결과에 포함된다
**And** 포트폴리오가 업데이트된다 (시뮬레이션)
**And** 진입/청산 포인트로 기록된다 (FR25)
**And** 에러 시 사용자에게 친절한 메시지가 표시된다

---

## Tasks / Subtasks

### Task 1: ActionNode 컴포넌트 기본 구조 (AC: #1)
- [ ] Subtask 1.1: `src/components/editor/nodeTypes/ActionNode.tsx` 파일 생성 (또는 기존 ActionNodeComponent 확인)
- [ ] Subtask 1.2: React Flow의 `NodeProps` 타입 임포트 및 설정
- [ ] Subtask 1.3: Handle 컴포넌트 구현 (입력 포트만, 출력 없음)
- [ ] Subtask 1.4: 노드 본체 UI 구현 (액션 타입별 색상: 초록/빨강)
- [ ] Subtask 1.5: 매수 노드: bg-green-900, border-green-600
- [ ] Subtask 1.6: 매도 노드: bg-red-900, border-red-600

### Task 2: React Flow nodeTypes에 등록 (AC: #1, #2)
- [ ] Subtask 2.1: `src/components/editor/nodeTypes/index.ts` 파일 수정 확인
- [ ] Subtask 2.2: ActionNode 컴포넌트 임포트 확인
- [ ] Subtask 2.3: nodeTypes 객체에 action 키로 등록 확인
- [ ] Subtask 2.4: StrategyEditor 컴포넌트에 nodeTypes prop 전달 확인
- [ ] Subtask 2.5: 노드 팔레트에서 ActionNode 드래그 앤 드롭 테스트

### Task 3: 속성 패널 설정 UI 구현 (AC: #3)
- [ ] Subtask 3.1: PropertiesPanel 컴포넌트에 ActionNode 설정 UI 추가
- [ ] Subtask 3.2: 액션 타입 표시 (BUY 또는 SELL, 읽기 전용)
- [ ] Subtask 3.3: 수량 입력 UI (Number input)
- [ ] Subtask 3.4: 수량 단위 선택 UI (Select: base asset 또는 quote asset)
- [ ] Subtask 3.5: 라벨과 설명 표시

### Task 4: Zustand store와의 통합 (AC: #4)
- [ ] Subtask 4.1: editorStore에 updateNode 액션 사용 확인 (기존 구현 활용)
- [ ] Subtask 4.2: 속성 패널에서 설정 변경 시 store 업데이트
- [ ] Subtask 4.3: 노드 라벨 동적 업데이트 (config 기반 라벨 생성)
- [ ] Subtask 4.4: React Flow의 onNodesChange 핸들러와 연동 확인
- [ ] Subtask 4.5: localStorage에 전략 저장 기능 확인

### Task 5: 노드 팩토리 업데이트 (AC: #2)
- [ ] Subtask 5.1: utils/nodeFactory.ts에 createActionNode 함수 확인
- [ ] Subtask 5.2: 액션 타입별 기본 설정 (BUY: 100 USDC, SELL: 100 USDC)
- [ ] Subtask 5.3: 수량 단위 기본값 (quote asset)
- [ ] Subtask 5.4: 노드 팔레트에서 드래그 앤 드롭 테스트

### Task 6: 백테스트 엔진 연동 준비 (AC: #5)
- [ ] Subtask 6.1: 백테스트 엔진 API 문서 확인 (Story 4.x)
- [ ] Subtask 6.2: 거래 기록 데이터 구조 정의
- [ ] Subtask 6.3: 포트폴리오 업데이트 로직 스텁 구현
- [ ] Subtask 6.4: 에러 처리 및 사용자 메시지 구현
- [ ] Subtask 6.5: FR25(진입/청산 포인트) 기록 로직 스텁

### Task 7: 테스트 및 검증 (AC: 전체)
- [ ] Subtask 7.1: 매수 노드 UI 테스트 (초록색 스타일링)
- [ ] Subtask 7.2: 매도 노드 UI 테스트 (빨간색 스타일링)
- [ ] Subtask 7.3: 수량 설정 테스트 (다양한 수량)
- [ ] Subtask 7.4: 수량 단위 테스트 (base vs quote asset)
- [ ] Subtask 7.5: 노드 라벨 업데이트 테스트
- [ ] Subtask 7.6: 단위 테스트 작성 (Vitest - ActionNode.test.tsx)

---

## Dev Notes

### 🎯 목표

이 Story는 **매수/매도 액션 노드 컴포넌트**를 구현하여 사용자가 트래딩 신호를 실행할 수 있게 합니다. 완료되면:
- 사용자가 노드 팔레트에서 매수/매도 노드를 드래그하여 캔버스에 추가 가능
- 속성 패널에서 수량, 수량 단위 설정 가능
- 백테스트 엔진에서 거래 기록 및 포트폴리오 업데이트 가능
- 후속 스토리(3.6, 3.7 등)에서 분할 매수/매도, 조건부 분기와 연동 가능

### 📚 Story 3.2 & 3.3에서 배운 패턴

**ActionNode 인터페이스** [Source: 3-2-node-type-definitions.md#AC 3]:
```typescript
interface ActionNode extends BaseNode {
  type: NodeType.ACTION;
  category: NodeCategory.ACTION;
  data: {
    label: string;
    config: {
      actionType: ActionType;  // 'BUY' | 'SELL'
      amount: number;           // Amount to buy/sell (e.g., 100 USDC)
      amountUnit?: 'base' | 'quote';  // base asset or quote asset
      splitCount?: number;      // Split order count (1-10, optional)
      splitInterval?: string;   // Split interval (1m-1d, optional)
    };
  };
}
```

**노드 팩토리 패턴** [Source: 3-2-node-type-definitions.md#Dev Notes]:
```typescript
// nodeFactory.ts
case NodeType.ACTION:
  return {
    id,
    type: NodeType.ACTION,
    category: NodeCategory.ACTION,
    position,
    data: {
      label: 'Buy Action',
      config: {
        actionType: 'BUY',
        amount: 100,
        amountUnit: 'quote',  // default: quote asset (USDC)
        ...config,
      },
    },
  } as ActionNode;
```

**연결 검증 로직** [Source: 3-2-node-type-definitions.md#연결 검증 로직]:
- TRANSFORMATION(INDICATOR) → ACTION 가능
- LOGIC(CONDITION, LOOP, RISK_MGMT) → ACTION 가능
- ACTION은 입력을 받지만 출력이 없음 (터미널 노드)

### 🏗️ React Flow 커스텀 노드 패턴

**기존 ActionNodeComponent** [Source: nodeTypes/index.tsx:238-290]:
```typescript
export const ActionNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ActionNode['data'];
  const isBuy = nodeData.config.actionType === 'BUY';

  return (
    <div className={`px-4 py-2 rounded-lg border-2 bg-gray-800 ${
      isBuy ? 'border-green-500' : 'border-red-500'
    } ${selected ? 'ring-2 ring-green-300' : ''}`} style={{ minWidth: '200px' }}>
      {/* Input handle (Top) */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Node icon and label */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold ${
          isBuy ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {isBuy ? 'B' : 'S'}
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Action</div>
        </div>
      </div>

      {/* Config display */}
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
        {nodeData.config.splitCount && (
          <div className="flex justify-between">
            <span>Split:</span>
            <span className="text-blue-400">
              {nodeData.config.splitCount}x ({nodeData.config.splitInterval})
            </span>
          </div>
        )}
      </div>

      {/* NO output handle - Action is a terminal node */}
    </div>
  );
});
```

**확인 필요 사항:**
- 출력 포트(Handle)이 없는지 확인 (Action은 터미널 노드)
- 매수(BUY)는 초록색, 매도(SELL)는 빨간색
- 노드 라벨 동적 업데이트

### 📐 파일 구조

**Story 3.5에서 생성/수정할 파일:**
```
src/
├── components/
│   └── editor/
│       ├── nodeTypes/
│       │   └── index.tsx                # ✅ 수정/확인 (ActionNodeComponent)
│       └── PropertiesPanel.tsx          # ✅ 수정 (ActionNode 설정 UI 추가)
├── utils/
│   └── nodeFactory.ts                   # ✅ 수정/확인 (createActionNode)
└── types/
    └── nodes.ts                          # Story 3.2에서 정의 완료
```

### 🎨 UI/UX 디자인 가이드

**노드 디자인 패턴:**
- 다크모드: `bg-gray-800`
- 매수 노드: `border-green-500`, `bg-green-600` (아이콘 배경)
- 매도 노드: `border-red-500`, `bg-red-600` (아이콘 배경)
- 선택 상태: `ring-2 ring-green-300` (매수), `ring-red-300` (매도)
- 텍스트: `text-white` (라벨), `text-gray-400` (보조)

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
│ 또는 [BTC (base asset) ▼]       │
│                                  │
│ 💡 팁: quote asset은 USDC 같은 │
│ 거래 스테이블코인, base asset은 │
│ BTC, ETH 같은 코인입니다        │
└─────────────────────────────────┘
```

**노드 라벨 동적 업데이트 예시:**
- BUY + 100 USDC → "매수 100 USDC"
- SELL + 0.5 BTC → "매도 0.5 BTC"
- BUY + 1000 USDC (5회 분할) → "매수 1000 USDC (5회 분할)" - Story 3.6

### 💰 수량 단위 이해

**Quote Asset (거래 스테이블코인):**
- 예: USDC, USDT, DAI
- 의미: "이만큼의 가치를 사겠다/팔겠다"
- 사용 예: "100 USDC어치의 BTC를 사겠다"

**Base Asset (코인 자체):**
- 예: BTC, ETH, SOL
- 의미: "이만큼의 개수를 사겠다/팔겠다"
- 사용 예: "0.5 BTC를 사겠다"

**백테스트 엔진에서의 계산:**
```typescript
// Quote Asset (USDC)
if (actionUnit === 'quote') {
  const btcPrice = currentCandle.close;  // 예: $50,000
  const btcAmount = amount / btcPrice;   // 100 / 50,000 = 0.002 BTC
  portfolio.btc += btcAmount;
  portfolio.usdc -= amount;
}

// Base Asset (BTC)
if (actionUnit === 'base') {
  const btcPrice = currentCandle.close;  // 예: $50,000
  const usdValue = amount * btcPrice;    // 0.5 * 50,000 = $25,000
  portfolio.btc += amount;               // 0.5 BTC
  portfolio.usdc -= usdValue;            // -$25,000
}
```

### 🔄 백테스트 엔진 연동 준비

**거래 기록 데이터 구조** (Story 4.x에서 구현):
```typescript
interface TradeRecord {
  timestamp: number;        // 캔들 timestamp
  actionType: 'BUY' | 'SELL';
  price: number;            // 거래 가격 (close)
  amount: number;           // 거래 수량
  amountUnit: 'base' | 'quote';
  symbol: string;           // 예: 'BTC/USDT'
  portfolio: {
    btc: number;            // 포트폴리오 BTC 잔고
    usdc: number;           // 포트폴리오 USDC 잔고
  };
}
```

**FR25: 진입/청산 포인트 기록**
- 진입(Entry): 매수 후 포지션 보유 시작
- 청산(Exit): 매도 후 포지션 정리
- 백테스트 결과에 진입/청산 포인트 표시 (Story 4.7, 4.8)

### ⚠️ 중요 고려사항

**1. 액션 타입 고정:**
- ActionNode는 한 번 생성되면 액션 타입 변경 불가
- 매수 노드 → 매수 노드로만 유지
- 변경 필요 시 노드 삭제 후 재생성

**2. 수량 검증:**
- 최소 수량: 0.0001 (base asset), 1 USDC (quote asset)
- 최대 수량: 포트폴리오 잔고 확인 (백테스트 시)
- 0 또는 음수 불가

**3. 포트폴리오 시뮬레이션:**
- 초기 포트폴리오: 10,000 USDC (예시)
- 매수: USDC → BTC (USDC 차감, BTC 추가)
- 매도: BTC → USDC (BTC 차감, USDC 추가)
- 잔고 부족 시 거래 실패 처리

**4. 에러 처리:**
- 수량이 0 또는 음수: "유효하지 않은 수량입니다"
- 포트폴리오 잔고 부족: "잔고가 부족합니다"
- 잘못된 수량 단위: "지원하지 않는 수량 단위입니다"

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
// src/components/editor/nodeTypes/__tests__/ActionNode.test.tsx
import { render, screen } from '@testing-library/react';
import { ActionNodeComponent } from '../ActionNode';

describe('ActionNode', () => {
  it('renders buy node with green styling', () => {
    const mockData = {
      label: '매수 100 USDC',
      config: {
        actionType: 'BUY',
        amount: 100,
        amountUnit: 'quote',
      },
    };

    render(<ActionNodeComponent data={mockData} selected={false} />);
    expect(screen.getByText('매수 100 USDC')).toBeInTheDocument();
    expect(screen.getByText('BUY')).toBeInTheDocument();
  });

  it('renders sell node with red styling', () => {
    const mockData = {
      label: '매도 0.5 BTC',
      config: {
        actionType: 'SELL',
        amount: 0.5,
        amountUnit: 'base',
      },
    };

    render(<ActionNodeComponent data={mockData} selected={false} />);
    expect(screen.getByText('매도 0.5 BTC')).toBeInTheDocument();
    expect(screen.getByText('SELL')).toBeInTheDocument();
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (ActionNode 인터페이스)
- ✅ Story 3.3: 시장 데이터 노드 (OHLCV 데이터 소스)
- ✅ Story 3.4: 기술적 지표 노드 (매매 신호 생성)

**후속 Stories (이 Story의 ActionNode 활용):**
- Story 3.6: 분할 매수/매도 기능 (splitCount, splitInterval)
- Story 3.7: 조건부 분기 노드 구현 (예: RSI < 30 이면 매수)
- Story 3.9: 리스크 관리 노드 (Stop Loss, Take Profit)
- Story 4.x: 백테스트 엔진 (거래 기록, 포트폴리오 업데이트)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-5的完整AC
2. ✅ 分析了Story 3-3, 3-4的实现模式作为参考
3. ✅ 确认了ActionNode接口定义 (Story 3.2)
4. ✅ 整合了project-context.md的关键规则
5. ✅ 分析了现有ActionNodeComponent结构 (nodeTypes/index.tsx)
6. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: ActionNode 컴포넌트 확장/확인
- Task 2: nodeTypes 등록 확인
- Task 3: 속성 패널 설정 UI 구현
- Task 4: Zustand store集成
- Task 5: 노드 팩토리 확인
- Task 6: 백테스트 엔진 연동 준비
- Task 7: 테스트 및 검증

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-5-basic-buy-sell-action.md` - This story file

**Frontend Files to Modify/Create (3 files)**
- `gr8-frontend/src/components/editor/nodeTypes/index.tsx` - ✅ 확인/수정 (ActionNodeComponent)
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 수정 (ActionNode 설정 UI)
- `gr8-frontend/src/utils/nodeFactory.ts` - ✅ 확인/수정 (createActionNode)

**Test Files:**
- `gr8-frontend/src/components/editor/nodeTypes/__tests__/ActionNode.test.tsx` - ✅ 새로 생성 (선택사항)

**Total:** 3-4 files to modify/create

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-5 Created**
- Created comprehensive story file for Buy/Sell Action Node implementation
- Extracted all AC from epics.md
- Analyzed Story 3-3, 3-4 for implementation patterns
- Added detailed dev notes with code examples
- Prepared testing strategy with sample test cases
- Defined amount unit logic (base vs quote asset)
