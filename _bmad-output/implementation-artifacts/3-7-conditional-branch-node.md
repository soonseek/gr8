# Story 3.7: 조건부 분기 노드 (If-Then-Else)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 조건부 분기 노드를 사용하여 "조건이 만족하면 A, 아니면 B" 로직을 구현하고 싶다,
**so that** 전략이 상황에 따라 다르게 반응할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (ConditionNode 인터페이스 포함)
- Story 3.3~3.6에서 시장 데이터, 지표, 액션 노드 구현 ✅
- ConditionNodeComponent가 이미 기본 형태로 구현됨 (nodeTypes/index.tsx:296-335)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅

**문제:**
- 전략이 단일 경로로만 실행됨 (조건부 분기 없음)
- "RSI가 30 이하이면 매수, 아니면 관망" 같은 로직 불가
- 복잡한 트레이딩 시나리오 구현 불가

**해결:**
조건부 분기 노드(If-Then-Else) 구현

**중요:**
- **노드 형태**: 다이아몬드 ◇ (flowchart 표준)
- **포트 구조**: 1개 입력, 2개 출력 (Then, Else)
- **Then 포트**: 녹색 (조건 참)
- **Else 포트**: 빨간색 (조건 거짓)
- **다중 조건**: AND, OR 연산자 지원
- **중첩**: If 노드 안에 If 노드 가능
- **백테스트**: 각 캔들에서 조건 평가

---

## 수용 기준 (Acceptance Criteria)

### AC 1: ConditionNode 컴포넌트 구현

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/ConditionNode.tsx`를 생성한다
**Then** 조건 노드 컴포넌트가 구현된다
**And** 노드가 다이아몬드 형태로 표시된다 (◇)
**And** 노드가 1개 입력 포트(값)와 2개 출력 포트(Then, Else)를 가진다
**And** Then 출력이 녹색으로, Else 출력이 빨간색으로 표시된다

### AC 2: 조건 설정 패널 구현

**Given** ConditionNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 If 노드를 추가한다
**Then** 조건 설정 패널이 표시된다
**And** 왼쪽 피연산자 입력이 제공된다 (드롭다운 또는 노드 연결)
**And** 연산자 선택이 제공된다 (>, <, >=, <=, ==)
**And** 오른쪽 피연산자 입력이 제공된다 (값 또는 노드 연결)
**And** 예: "RSI > 70" 또는 "가격 > MA200"

### AC 3: 노드 라벨 동적 업데이트

**Given** If 노드가 추가되었다
**When** 사용자가 조건을 설정한다 (RSI > 70)
**Then** 노드 라벨이 업데이트된다 ("If RSI > 70")
**And** Then 포트에 연결된 노드들이 조건 참일 때 실행된다
**And** Else 포트에 연결된 노드들이 조건 거짓일 때 실행된다

### AC 4: 다중 조건 지원 (AND, OR)

**Given** If 노드가 구현되었다
**When** 사용자가 다중 조건을 설정한다
**Then** AND 연산자가 제공된다 (예: "RSI > 70 AND Volume > 1000")
**And** OR 연산자가 제공된다 (예: "RSI > 70 OR MACD > 0")
**And** 복잡한 불리언 식이 구성될 수 있다
**And** 중첩 If 노드가 지원된다 (If 안에 If)

### AC 5: 백테스트 엔진 연동

**Given** 조건부 분기가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 캔들에서 조건이 평가된다
**And** 조건이 참이면 Then 분기가 실행된다
**And** 조건이 거짓이면 Else 분기가 실행된다
**And** 조건 평가 결과가 백테스트 로그에 기록된다
**And** 분기 선택이 포트폴리오에 영향을 미친다

### AC 6: 복잡한 분기 로직 테스트

**Given** If 노드가 구현되었다
**When** 개발자가 복잡한 분기 로직을 테스트한다
**Then** 다중 If 노드가 중첩된다
**Then** If-Then-Else-If 체인이 지원된다
**And** 복잡한 트리 구조가 시각화된다
**And** 자동 레이아웃이 조건에 따라 조정된다

---

## Tasks / Subtasks

### Task 1: ConditionNode 타입 확장 (AC: #1, #2, #4)
- [ ] Subtask 1.1: ConditionNode 인터페이스 확인 (types/nodes.ts:198-209)
- [ ] Subtask 1.2: 다중 조건 지원을 위한 타입 확장
  - conditions 배열: { operator, leftValue, rightValue, logicalOperator }[]
  - logicalOperator: 'AND' | 'OR'
- [ ] Subtask 1.3: ConditionOperator enum 확인 (>, <, >=, <=, ==)
- [ ] Subtask 1.4: leftValue/rightValue 타입 확장 (string | number | NodeReference)

### Task 2: ConditionNodeComponent 다이아몬드 형태 구현 (AC: #1)
- [ ] Subtask 2.1: CSS transform으로 다이아몬드 형태 생성 (rotate(45deg))
- [ ] Subtask 2.2: 입력 포트 1개 추가 (target: Top)
- [ ] Subtask 2.3: Then 출력 포트 추가 (source: Bottom-Right, 녹색)
- [ ] Subtask 2.4: Else 출력 포트 추가 (source: Bottom-Left, 빨간색)
- [ ] Subtask 2.5: Handle 위치 조정 (다이아몬드 형태에 맞게)

### Task 3: 속성 패널 UI 구현 (AC: #2)
- [ ] Subtask 3.1: PropertiesPanel에 ConditionNode 설정 UI 추가
- [ ] Subtask 3.2: 왼쪽 피연산자 입력
  - 드롭다운: 노드 선택 (IndicatorNode, MarketDataNode 등)
  - 또는 수동 입력 (값)
- [ ] Subtask 3.3: 연산자 선택 (>, <, >=, <=, ==)
- [ ] Subtask 3.4: 오른쪽 피연산자 입력
  - 상수 값 입력 (숫자)
  - 또는 노드 참조
- [ ] Subtask 3.5: 다중 조건 추가 버튼 ("+ AND", "+ OR")
- [ ] Subtask 3.6: 조건 제거 버튼 (각 조건 행)

### Task 4: 노드 라벨 동적 업데이트 (AC: #3)
- [ ] Subtask 4.1: nodeFactory.ts에서 createLabel 함수 확장
- [ ] Subtask 4.2: 단일 조건 라벨: "If RSI > 70"
- [ ] Subtask 4.3: 다중 조건 라벨: "If (RSI > 70 AND Volume > 1000)"
- [ ] Subtask 4.4: 라벨이 너무 길면 truncate: "If (RSI > 70 AND ...)"

### Task 5: 다중 조건 로직 구현 (AC: #4)
- [ ] Subtask 5.1: ConditionNode.config.conditions 배열 지원
- [ ] Subtask 5.2: AND 연산자 평가: 모든 조건이 true여야 true
- [ ] Subtask 5.3: OR 연산자 평가: 하나라도 true면 true
- [ ] Subtask 5.4: 복잡한 식 파싱: "(A AND B) OR C"
- [ ] Subtask 5.5: 중첩 If 노드 지원 (하위 ConditionNode 참조)

### Task 6: React Flow 엣지 연동 (AC: #3, #6)
- [ ] Subtask 6.1: Then 포트에 연결된 엣지 식별 (sourceHandle: "then")
- [ ] Subtask 6.2: Else 포트에 연결된 엣지 식별 (sourceHandle: "else")
- [ ] Subtask 6.3: 조건 참 → Then 엣지의 타겟 노드들 실행
- [ ] Subtask 6.4: 조건 거짓 → Else 엣지의 타겟 노드들 실행
- [ ] Subtask 6.5: If-Then-Else-If 체인 엣지 연결 (Else → 다음 If)

### Task 7: 백테스트 엔진 연동 준비 (AC: #5)
- [ ] Subtask 7.1: 백테스트 엔진 API 문서 확인 (Story 4.x)
- [ ] Subtask 7.2: 조건 평가 함수 스텁 구현
  - evaluateCondition(node, candleData): boolean
- [ ] Subtask 7.3: 각 캔들에서 조건 평가
- [ ] Subtask 7.4: 분기 실행 로직 스텁
  - Then 분기: getConnectedNodes('then')
  - Else 분기: getConnectedNodes('else')
- [ ] Subtask 7.5: 백테스트 로그에 조건 평가 결과 기록
- [ ] Subtask 7.6: 분기 선택이 포트폴리오에 영향 미치는지 검증

### Task 8: 복잡한 분기 로직 테스트 (AC: #6)
- [ ] Subtask 8.1: 다중 If 노드 중첩 테스트 (If 안에 If)
- [ ] Subtask 8.2: If-Then-Else-If 체인 테스트
  - If (RSI > 70) → Then: Sell, Else → If (RSI < 30) → Then: Buy
- [ ] Subtask 8.3: 복잡한 트리 구조 시각화 테스트
- [ ] Subtask 8.4: 자동 레이아웃 테스트 (dagre 라이브러리)
- [ ] Subtask 8.5: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **조건부 분기 노드(If-Then-Else)**를 구현하여 사용자가 복잡한 트레이딩 로직을 구성할 수 있게 합니다. 완료되면:
- "RSI가 30 이하이면 매수, 아니면 관망" 같은 조건부 전략 구현 가능
- AND, OR 연산자로 복잡한 조건 조합 가능
- 중첩 If 노드로 다단계 의사결정 구조 구현 가능
- 백테스트에서 각 캔들마다 조건 평가 및 분기 실행

### 📚 Story 3.2 & 3.5에서 배운 패턴

**ConditionNode 인터페이스** [Source: types/nodes.ts:198-209]:
```typescript
export interface ConditionNode extends BaseNode {
  type: 'condition';
  category: 'logic';
  data: {
    label: string;
    config: {
      operator: ConditionOperator;  // >, <, >=, <=, ==
      leftValue: any;      // Left operand
      rightValue: any;     // Right operand
    };
  };
}

export enum ConditionOperator {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  EQUAL = '==',
}
```

**확장 필요 (다중 조건 지원):**
```typescript
export interface ConditionNode extends BaseNode {
  type: 'condition';
  category: 'logic';
  data: {
    label: string;
    config: {
      conditions: ConditionRule[];  // 다중 조건
      logicalOperator?: 'AND' | 'OR'; // 조건 간 연산자
    };
  };
}

export interface ConditionRule {
  id: string;
  operator: ConditionOperator;
  leftValue: string | number;  // "RSI", 70
  rightValue: string | number;
  leftNodeRef?: string;  // 참조할 노드 ID (optional)
  rightNodeRef?: string;
}
```

### 🏗️ React Flow 커스텀 노드 패턴

**기존 ConditionNodeComponent** [Source: nodeTypes/index.tsx:296-335]:
```typescript
export const ConditionNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ConditionNode['data'];

  return (
    <div className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-yellow-500 ${
      selected ? 'ring-2 ring-yellow-300' : ''
    }`} style={{ minWidth: '200px' }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-yellow-600 flex items-center justify-center text-white font-bold">
          C
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Condition</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Operator:</span>
          <span className="text-yellow-400">{nodeData.config.operator}</span>
        </div>
        <div className="flex justify-between">
          <span>Value:</span>
          <span className="text-gray-400">
            {nodeData.config.leftValue} {nodeData.config.operator} {nodeData.config.rightValue}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
```

**수정 필요:**
1. 다이아몬드 형태 (rotate(45deg))
2. 2개 출력 포트 (Then, Else)
3. 녹색/빨간색 Handle

### 📐 파일 구조

**Story 3.7에서 수정할 파일:**
```
src/
├── components/
│   └── editor/
│       ├── nodeTypes/
│       │   └── index.tsx                    # ✅ 수정 (ConditionNodeComponent 다이아몬드 형태, 2개 출력 포트)
│       └── PropertiesPanel.tsx              # ✅ 수정 (ConditionNode 설정 UI)
├── utils/
│   └── nodeFactory.ts                       # ✅ 수정 (createConditionNode 라벨 생성)
└── types/
    └── nodes.ts                              # ✅ 수정 (ConditionNode 타입 확장)
```

### 🎨 UI/UX 디자인 가이드

**다이아몬드 노드 디자인:**
```
        ◇ If RSI > 70
       / \
   Then/   \Else
     /       \
  매수      관맴
(녹색)    (빨간색)
```

**속성 패널 디자인:**
```
┌─────────────────────────────────┐
│ 🔀 조건부 분기 설정               │
├─────────────────────────────────┤
│ 조건 1                          │
│ ┌───────────────────────────┐   │
│ │ [RSI ▼] [>] [70]         │   │
│ │                           │   │
│ │ 왼쪽 값    연산자  오른쪽 값│   │
│ └───────────────────────────┘   │
│                                  │
│ [+ AND 조건 추가] [+ OR 조건 추가]│
│                                  │
│ 조건 2 (AND)                     │
│ ┌───────────────────────────┐   │
│ │ [Volume ▼] [>] [1000]    │   │
│ │ [🗑️ 삭제]                 │   │
│ └───────────────────────────┘   │
│                                  │
│ 💡 예: "If RSI > 70 AND Volume > 1000"│
└─────────────────────────────────┘
```

**노드 라벨 예시:**
- 단일 조건: "If RSI > 70"
- 다중 조건: "If (RSI > 70 AND Volume > 1000)"
- 복잡한 조건: "If ((RSI > 70 AND MACD > 0) OR Price < MA200)"

### 💡 조건부 분기 이해

**단일 If-Then-Else:**
```
If (RSI > 70)
  Then: Sell
  Else: Hold
```

**다중 조건 (AND):**
```
If (RSI > 70 AND Volume > 1000)
  Then: Sell (Strong Signal)
  Else: Hold
```

**다중 조건 (OR):**
```
If (RSI > 70 OR MACD > 0)
  Then: Consider Selling
  Else: Hold
```

**If-Then-Else-If 체인:**
```
If (RSI > 70)
  Then: Sell
  Else If (RSI < 30)
    Then: Buy
    Else: Hold
```

**중첩 If:**
```
If (Price > MA200)
  Then If (RSI > 70)
    Then: Strong Buy
    Else: Buy
  Else: Hold
```

### ⚠️ 중요 고려사항

**1. 다이아몬드 형태 구현:**
- CSS `transform: rotate(45deg)` 사용
- 내부 텍스트는 다시 `rotate(-45deg)`로 정방향
- Handle 위치 조정 (Top, Bottom-Right, Bottom-Left)

**2. 2개 출력 포트:**
- Then 포트: `id="then"`, position={Position.Bottom}, style={녹색}
- Else 포트: `id="else"`, position={Position.Bottom}, style={빨간색}
- 엣지 연결 시 `sourceHandle: "then"` 또는 `sourceHandle: "else"` 사용

**3. 다중 조건 평가:**
- AND: 모든 conditions이 true여야 true
- OR: 하나라도 true면 true
- 복잡한 식: 괄호로 그룹화 `(A AND B) OR C`

**4. 백테스트 엔진 연동:**
- 각 캔들에서 `evaluateCondition(node, candleData)` 호출
- 결과가 true → Then 분기 실행
- 결과가 false → Else 분기 실행
- 분기 결과를 백테스트 로그에 기록

**5. 노드 참조:**
- leftValue가 "RSI"이면 IndicatorNode의 RSI 값 참조
- rightValue가 70이면 상수 70과 비교
- 양쪽 다 노드 참조 가능 (예: "RSI > MA200")

**6. 엣지 라우팅:**
- React Flow의 `smoothstep` 엣지 타입 사용
- Then/Else 엣지가 서로 겹치지 않도록 라우팅
- 자동 레이아웃 (dagre 라이브러리) 고려

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
describe('ConditionNode', () => {
  it('evaluates single condition correctly', () => {
    const node = createConditionNode({
      operator: '>',
      leftValue: 70,
      rightValue: 50
    });
    expect(evaluateCondition(node, { rsi: 70 })).toBe(true);
    expect(evaluateCondition(node, { rsi: 50 })).toBe(false);
  });

  it('evaluates AND conditions', () => {
    const node = createConditionNode({
      conditions: [
        { operator: '>', leftValue: 'RSI', rightValue: 70 },
        { operator: '>', leftValue: 'Volume', rightValue: 1000 }
      ],
      logicalOperator: 'AND'
    });
    const candleData = { rsi: 75, volume: 1500 };
    expect(evaluateCondition(node, candleData)).toBe(true);
  });

  it('evaluates OR conditions', () => {
    const node = createConditionNode({
      conditions: [
        { operator: '>', leftValue: 'RSI', rightValue: 70 },
        { operator: '>', leftValue: 'MACD', rightValue: 0 }
      ],
      logicalOperator: 'OR'
    });
    const candleData = { rsi: 65, macd: 0.5 };
    expect(evaluateCondition(node, candleData)).toBe(true);
  });

  it('generates correct label', () => {
    const config = {
      operator: '>',
      leftValue: 'RSI',
      rightValue: 70
    };
    expect(createConditionLabel(config)).toBe('If RSI > 70');
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (ConditionNode 인터페이스)
- ✅ Story 3.3: 시장 데이터 노드 (OHLCV 데이터 소스)
- ✅ Story 3.4: 기술적 지표 노드 (RSI, MACD 등)

**후속 Stories (이 Story의 조건부 분기 활용):**
- Story 3.8: Loop 구조 (If와 조합하여 복잡한 로직)
- Story 3.9: 리스크 관리 노드 (조건부 Stop Loss/Take Profit)
- Story 4.x: 백테스트 엔진 (조건 평가 로직 구현)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-7的完整AC (6개 AC)
2. ✅ 分析了Story 3.6的实现模式作为参考
3. ✅ 确认了ConditionNode接口定义 (types/nodes.ts:198-209)
4. ✅ 整合了project-context.md的关键规则
5. ✅ 分析了现有ConditionNodeComponent结构 (nodeTypes/index.tsx:296-335)
6. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: ConditionNode 타입 확장 (다중 조건 지원)
- Task 2: ConditionNodeComponent 다이아몬드 형태 구현
- Task 3: 속성 패널 UI 구현
- Task 4: 노드 라벨 동적 업데이트
- Task 5: 다중 조건 로직 구현
- Task 6: React Flow 엣지 연동
- Task 7: 백테스트 엔진 연동 준비
- Task 8: 복잡한 분기 로직 테스트

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-7-conditional-branch-node.md` - This story file

**Frontend Files to Modify (3 files)**
- `gr8-frontend/src/components/editor/nodeTypes/index.tsx` - ✅ 수정 (ConditionNodeComponent 다이아몬드 형태, 2개 출력 포트)
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 수정 (ConditionNode 설정 UI)
- `gr8-frontend/src/utils/nodeFactory.ts` - ✅ 수정 (createConditionNode 라벨 생성)

**Type Definitions:**
- `gr8-frontend/src/types/nodes.ts` - ✅ 수정 (ConditionNode 타입 확장)

**Test Files:**
- `gr8-frontend/src/components/editor/nodeTypes/ConditionNode.test.tsx` - ✅ 새로 생성 (선택사항)

**Total:** 3-4 files to modify/create

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-7 Created**
- Created comprehensive story file for Conditional Branch Node (If-Then-Else)
- Extracted all AC from epics.md (6 ACs)
- Analyzed existing ConditionNode implementation
- Added detailed dev notes with code examples
- Defined diamond shape node pattern with 2 output ports (Then, Else)
- Prepared multi-condition logic (AND, OR operators)
- Designed complex branching strategy support
