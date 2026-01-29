# Story 3.8: 순환매 및 Loop 구조

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** Loop 노드를 사용하여 반복 작업을 구현하고 싶다,
**so that** 순환매(Rebalancing)이나 반복 매매 전략을 만들 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.2에서 노드 타입 정의 완료 ✅ (LoopNode 인터페이스 포함)
- Story 3.3~3.7에서 시장 데이터, 지표, 액션, 조건부 분기 노드 구현 ✅
- LoopNodeComponent가 이미 기본 형태로 구현됨 (nodeTypes/index.tsx:341-384)
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅

**문제:**
- 전략이 한 번만 실행됨 (반복 작업 불가)
- "매월 1일에 포트폴리오 리밸런싱" 같은 순환매 전략 구현 불가
- "RSI < 30이면 매수, RSI > 70이면 매도"를 매일 반복 불가

**해결:**
Loop 구조(For/While) 구현

**중요:**
- **노드 형태**: 육각형 ⬡
- **For Loop**: 고정 반복 횟수 (1~1000회)
- **While Loop**: 조건 기반 반복 (탈출 조건, 최대 100회)
- **Break 노드**: Loop 즉시 종료
- **그룹핑**: Loop 본문에 하위 노드들을 포함
- **순환매**: 매일/매주/매월 반복 실행 전략 지원
- **안전장치**: 최대 반복 횟수 제한 (무한 루프 방지)

---

## 수용 기준 (Acceptance Criteria)

### AC 1: LoopNode 컴포넌트 구현

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/LoopNode.tsx`를 생성한다
**Then** Loop 노드 컴포넌트가 구현된다
**And** 노드가 육각형으로 표시된다 (⬡)
**And** 노드가 1개 입력 포트와 1개 출력 포트를 가진다
**And** Loop 본문에 하위 노드들을 포함할 수 있다 (그룹핑)

### AC 2: For Loop 설정 패널 구현

**Given** LoopNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 For Loop 노드를 추가한다
**Then** For Loop 설정 패널이 표시된다
**And** 반복 횟수 입력이 제공된다 (1~1000회)
**And** 루프 카운터 변수가 정의된다 (예: i)
**And** Loop 본문에 하위 노드들을 추가할 수 있다

### AC 3: For Loop 백테스트 연동

**Given** For Loop가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** Loop가 N번 반복된다
**And** 각 반복에서 루프 카운터가 증가한다
**And** Loop 본문의 노드들이 순차적으로 실행된다
**And** 반복 완료 후 다음 노드로 진행된다

### AC 4: While Loop 설정 패널 구현

**Given** 사용자가 노드 팔레트에서 While Loop 노드를 추가한다
**Then** While Loop 설정 패널이 표시된다
**And** 탈출 조건이 제공된다 (예: "포트폴리오 < 1000 USDC")
**And** 최대 반복 횟수 제한이 있다 (기본값: 100, 무한 루프 방지)
**And** 탈출 조건이 참이 될 때까지 반복된다

### AC 5: While Loop 백테스트 연동

**Given** While Loop가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 반복 전에 탈출 조건이 평가된다
**And** 조건이 참이면 Loop가 종료된다
**And** 조건이 거짓이면 Loop가 계속된다
**And** 최대 반복 횟수에 도달하면 강제 종료되고 경고가 로깅된다

### AC 6: Break 노드 구현

**Given** Loop 노드가 구현되었다
**When** 사용자가 Break 노드를 추가한다
**Then** Loop 내에서 Break 노드가 실행되면 Loop가 즉시 종료된다
**And** Break 후 다음 노드로 진행된다
**And** Break가 없으면 Loop가 완료될 때까지 실행된다

### AC 7: 순환매(Rebalancing) 전략 지원

**Given** 순환매(Rebalancing) 전략을 구현한다
**When** 사용자가 Loop + 매수/매도를 조합한다
**Then** Loop가 매일/매주/매월 실행되도록 설정된다
**And** 예: "매월 1일에 포트폴리오를 리밸런싱"
**And** 예: "RSI < 30이면 매수, RSI > 70이면 매도"를 매일 반복
**And** 순환매가 백테스트 결과에 정확히 반영된다

### AC 8: 복잡한 Loop 구조 테스트

**Given** Loop 구조가 구현되었다
**When** 개발자가 복잡한 Loop를 테스트한다
**Then** 중첩 Loop가 지원된다 (Loop 안에 Loop)
**And** Loop 내에서 If 노드가 정상 작동한다
**And** Break 노드가 중첩 Loop에서 외부 Loop를 종료한다
**And** Loop 성능이 최적화된다 (1000회 이상도 빠름)

---

## Tasks / Subtasks

### Task 1: LoopNode 타입 확인 (AC: #1, #2, #4)
- [ ] Subtask 1.1: LoopNode 인터페이스 확인 (types/nodes.ts:214-226)
- [ ] Subtask 1.2: LoopType enum 확인 (FOR, WHILE)
- [ ] Subtask 1.3: iterations 필드 확인 (For Loop)
- [ ] Subtask 1.4: exitCondition 필드 확인 (While Loop)
- [ ] Subtask 1.5: maxIterations 필드 확인 (기본값 1000)

### Task 2: LoopNodeComponent 육각형 형태 구현 (AC: #1)
- [ ] Subtask 2.1: CSS로 육각형 형태 생성 (clip-path: polygon())
- [ ] Subtask 2.2: 입력 포트 1개 추가 (target: Top)
- [ ] Subtask 2.3: 출력 포트 1개 추가 (source: Bottom)
- [ ] Subtask 2.4: Loop 타입 표시 (FOR vs WHILE)
- [ ] Subtask 2.5: 반복 횟수/조건 표시

### Task 3: For Loop 속성 패널 UI 구현 (AC: #2)
- [ ] Subtask 3.1: PropertiesPanel에 For Loop 설정 UI 추가
- [ ] Subtask 3.2: 반복 횟수 입력 (Number input: 1~1000, 기본값 10)
- [ ] Subtask 3.3: 루프 카운터 변수명 입력 (기본값: "i")
- [ ] Subtask 3.4: Loop 본문 그룹핑 UI (하위 노드들을 드래그앤드롭)
- [ ] Subtask 3.5: 설명 텍스트 추가 ("고정 횟수만큼 반복")

### Task 4: While Loop 속성 패널 UI 구현 (AC: #4)
- [ ] Subtask 4.1: PropertiesPanel에 While Loop 설정 UI 추가
- [ ] Subtask 4.2: 탈출 조건 입력 (ConditionNode 참조)
- [ ] Subtask 4.3: 최대 반복 횟수 입력 (Number input: 1~1000, 기본값 100)
- [ ] Subtask 4.4: 경고 메시지 추가 ("무한 루프 방지를 위해 최대 횟수 제한")
- [ ] Subtask 4.5: Loop 본문 그룹핑 UI

### Task 5: 노드 라벨 동적 업데이트 (AC: #2, #4)
- [ ] Subtask 5.1: nodeFactory.ts에서 createLabel 함수 확장
- [ ] Subtask 5.2: For Loop 라벨: "For 10 iterations"
- [ ] Subtask 5.3: While Loop 라벨: "While (portfolio < 1000)"
- [ ] Subtask 5.4: 라벨이 너무 길면 truncate

### Task 6: 백테스트 엔진 연동 준비 (AC: #3, #5)
- [ ] Subtask 6.1: 백테스트 엔진 API 문서 확인 (Story 4.x)
- [ ] Subtask 6.2: For Loop 실행 로직 스텁
  - iterations만큼 반복
  - 루프 카운터 증가
  - Loop 본문 노드들 순차 실행
- [ ] Subtask 6.3: While Loop 실행 로직 스텁
  - 각 반복 전에 탈출 조건 평가
  - 조건 참 → Loop 종료
  - 조건 거짓 → Loop 계속
  - maxIterations 도달 시 강제 종료
- [ ] Subtask 6.4: 에러 처리 및 사용자 메시지
- [ ] Subtask 6.5: Loop 실행 로그 기록

### Task 7: Break 노드 구현 (AC: #6)
- [ ] Subtask 7.1: BreakNode 타입 정의 (types/nodes.ts)
- [ ] Subtask 7.2: BreakNodeComponent 구현
- [ ] Subtask 7.3: 노드 팔레트에 Break 노드 추가
- [ ] Subtask 7.4: 백테스트 엔진에서 Break 처리
  - Break 노드 실행 시 Loop 즉시 종료
  - 다음 노드로 진행
- [ ] Subtask 7.5: 중첩 Loop에서 Break 동작 테스트

### Task 8: 순환매(Rebalancing) 전략 예시 (AC: #7)
- [ ] Subtask 8.1: 매월 리밸런싱 전략 예시 작성
  - Loop: 30일마다 반복
  - 본문: 포트폴리오 비율 확인 및 리밸런싱
- [ ] Subtask 8.2: 매일 RSI 매매 전략 예시 작성
  - Loop: 매일 반복
  - 본문: If (RSI < 30) → 매수, If (RSI > 70) → 매도
- [ ] Subtask 8.3: 순환매 백테스트 결과 검증
- [ ] Subtask 8.4: 사용자 가이드 문서 작성

### Task 9: 복잡한 Loop 구조 테스트 (AC: #8)
- [ ] Subtask 9.1: 중첩 Loop 테스트 (Loop 안에 Loop)
- [ ] Subtask 9.2: Loop + If 조합 테스트
- [ ] Subtask 9.3: Break 노드 동작 테스트
- [ ] Subtask 9.4: 성능 테스트 (1000회 반복)
- [ ] Subtask 9.5: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **Loop 구조(For/While)**를 구현하여 사용자가 반복 작업 기반의 순환매 전략을 구성할 수 있게 합니다. 완료되면:
- For Loop로 고정 횟수 반복 작업 구현 가능
- While Loop로 조건 기반 반복 작업 구현 가능
- Break 노드로 Loop 제어 가능
- 순환매(Rebalancing) 전략 구현 가능
- 매일/매주/매월 반복 매매 전략 구현 가능

### 📚 Story 3.2에서 배운 패턴

**LoopNode 인터페이스** [Source: types/nodes.ts:214-226]:
```typescript
export interface LoopNode extends BaseNode {
  type: 'loop';
  category: 'logic';
  data: {
    label: string;
    config: {
      loopType: LoopType;        // 'FOR' | 'WHILE'
      iterations?: number;       // For loop: fixed iteration count
      exitCondition?: any;       // While loop: exit condition
      maxIterations: number;     // Safety limit (default: 1000)
    };
  };
}

export const LoopType = {
  FOR: 'FOR',        // Fixed iteration count
  WHILE: 'WHILE',    // Condition-based loop
} as const;
```

**For Loop 설정:**
- loopType: 'FOR'
- iterations: 10 (1~1000)
- maxIterations: 1000 (안전장치)

**While Loop 설정:**
- loopType: 'WHILE'
- exitCondition: { operator: 'LT', leftValue: 'portfolio', rightValue: 1000 }
- maxIterations: 100 (기본값)

### 🏗️ React Flow 커스텀 노드 패턴

**기존 LoopNodeComponent** [Source: nodeTypes/index.tsx:341-384]:
```typescript
export const LoopNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as LoopNode['data'];

  return (
    <div className={`px-4 py-2 rounded-lg border-2 bg-gray-800 border-orange-500 ${
      selected ? 'ring-2 ring-orange-300' : ''
    }`} style={{ minWidth: '200px' }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center text-white font-bold">
          L
        </div>
        <div>
          <div className="font-bold text-white text-sm">{nodeData.label}</div>
          <div className="text-xs text-gray-400">Loop</div>
        </div>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="text-orange-400">{nodeData.config.loopType}</span>
        </div>
        {nodeData.config.loopType === 'FOR' && (
          <div className="flex justify-between">
            <span>Iterations:</span>
            <span className="text-yellow-400">{nodeData.config.iterations}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Max:</span>
          <span className="text-gray-400">{nodeData.config.maxIterations}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
```

**수정 필요:**
- 육각형 형태 (clip-path: polygon())
- While Loop 조건 표시 추가

### 📐 파일 구조

**Story 3.8에서 수정할 파일:**
```
src/
├── components/
│   └── editor/
│       ├── nodeTypes/
│       │   └── index.tsx                    # ✅ 수정 (LoopNodeComponent 육각형 형태)
│       └── PropertiesPanel.tsx              # ✅ 수정 (Loop 설정 UI)
├── utils/
│   └── nodeFactory.ts                       # ✅ 수정 (createLoopNode 라벨 생성)
└── types/
    └── nodes.ts                              # ✅ 수정 (BreakNode 타입 추가)
```

### 🎨 UI/UX 디자인 가이드

**육각형 노드 디자인:**
```
    ⬡ For 10 iterations
   / \
  /   \
 /     \
 \     /
  \   /
   \ /
    ↓
  Loop 본문
```

**For Loop 속성 패널:**
```
┌─────────────────────────────────┐
│ 🔄 For Loop 설정                 │
├─────────────────────────────────┤
│ 반복 횟수                        │
│ [10] (1~1000회)                 │
│                                  │
│ 루프 카운터 변수명               │
│ [i]                             │
│                                  │
│ ┌─ Loop 본문 ─────────────────┐ │
│ │                            │ │
│ │ [하위 노드들을 여기에 드래그] │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                  │
│ 💡 고정 횟수만큼 반복합니다      │
└─────────────────────────────────┘
```

**While Loop 속성 패널:**
```
┌─────────────────────────────────┐
│ 🔄 While Loop 설정               │
├─────────────────────────────────┤
│ 탈출 조건                        │
│ ┌───────────────────────────┐   │
│ │ [portfolio ▼] [<] [1000]  │   │
│ └───────────────────────────┘   │
│                                  │
│ 최대 반복 횟수                  │
│ [100] (무한 루프 방지)          │
│                                  │
│ ┌─ Loop 본문 ─────────────────┐ │
│ │                            │ │
│ │ [하위 노드들을 여기에 드래그] │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                  │
│ ⚠️ 조건이 참이 될 때까지 반복   │
└─────────────────────────────────┘
```

**노드 라벨 예시:**
- For Loop: "For 10 iterations", "For 30 days"
- While Loop: "While (portfolio < 1000)", "While (RSI > 70)"

### 💡 Loop 구조 이해

**For Loop (고정 횟수):**
```
For (i = 0; i < 10; i++)
  매수 100 USDC
```

**While Loop (조건 기반):**
```
While (portfolio < 1000)
  매수 100 USDC
```

**순환매(Rebalancing) 예시:**
```
Loop: 매월 1일
  If (BTC 비중 > 60%)
    Then: BTC 매도
  Else If (BTC 비중 < 40%)
    Then: BTC 매수
```

**매일 RSI 매매:**
```
Loop: 매일
  If (RSI < 30)
    Then: 매수
  Else If (RSI > 70)
    Then: 매도
```

**Break 노드 예시:**
```
While (portfolio < 10000)
  매수 100 USDC
  If (profit > 500)
    Then: Break (Loop 종료)
```

### ⚠️ 중요 고려사항

**1. 육각형 형태 구현:**
- CSS `clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)` 사용
- 또는 `transform: rotate(30deg)` + 사각형 조합

**2. Loop 본문 그룹핑:**
- React Flow의 Group 기능 사용
- 또는 하위 노드들을 Loop 노드의 자식으로 처리
- Loop 본문 노드들을 시각적으로 그룹핑

**3. For Loop 실행:**
- iterations만큼 반복
- 루프 카운터 i: 0, 1, 2, ..., iterations-1
- 각 반복에서 Loop 본문 노드들 순차 실행
- 반복 완료 후 다음 노드로 진행

**4. While Loop 실행:**
- 각 반복 전에 exitCondition 평가
- 조건 참 → Loop 종료
- 조건 거짓 → Loop 계속
- maxIterations 도달 시 강제 종료 + 경고 로그

**5. Break 노드:**
- Loop 내에서만 사용 가능
- Break 노드 실행 시 즉시 Loop 종료
- 다음 노드로 진행
- 중첩 Loop에서는 가장 가까운 외부 Loop 종료

**6. 안전장치:**
- For Loop: maxIterations = 1000 (기본값)
- While Loop: maxIterations = 100 (기본값)
- 최대 횟수 도달 시 경고 로그 + 강제 종료
- 무한 루프 방지

**7. 성능 최적화:**
- 1000회 이상 반복도 빠르게 실행
- 불필요한 상태 업데이트 방지
- Loop 실행 로그는 최대 100개만 저장

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
describe('LoopNode', () => {
  it('creates For Loop correctly', () => {
    const node = createLoopNode({
      loopType: 'FOR',
      iterations: 10,
      maxIterations: 1000
    });
    expect(node.config.loopType).toBe('FOR');
    expect(node.config.iterations).toBe(10);
  });

  it('creates While Loop correctly', () => {
    const node = createLoopNode({
      loopType: 'WHILE',
      exitCondition: { operator: 'LT', leftValue: 'portfolio', rightValue: 1000 },
      maxIterations: 100
    });
    expect(node.config.loopType).toBe('WHILE');
    expect(node.config.exitCondition).toBeDefined();
  });

  it('generates correct label for For Loop', () => {
    const config = { loopType: 'FOR', iterations: 10 };
    expect(createLoopLabel(config)).toBe('For 10 iterations');
  });

  it('generates correct label for While Loop', () => {
    const config = {
      loopType: 'WHILE',
      exitCondition: { leftValue: 'portfolio', operator: 'LT', rightValue: 1000 }
    };
    expect(createLoopLabel(config)).toBe('While (portfolio < 1000)');
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 설정
- ✅ Story 3.2: 노드 타입 정의 (LoopNode 인터페이스)
- ✅ Story 3.7: 조건부 분기 노드 (While Loop 탈출 조건에 활용)

**후속 Stories (이 Story의 Loop 구조 활용):**
- Story 3.9: 리스크 관리 노드 (Loop 내에서 Stop Loss/Take Profit)
- Story 4.x: 백테스트 엔진 (Loop 실행 로직 구현)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-8的完整AC (8개 AC)
2. ✅ 分析了Story 3-7的实现模式作为参考
3. ✅ 确认了LoopNode接口定义 (types/nodes.ts:214-226)
4. ✅ 确认了LoopType enum (FOR, WHILE)
5. ✅ 整合了project-context.md的关键规则
6. ✅ 分析了现有LoopNodeComponent结构 (nodeTypes/index.tsx:341-384)
7. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: LoopNode 타입 확인
- Task 2: LoopNodeComponent 육각형 형태 구현
- Task 3: For Loop 속성 패널 UI 구현
- Task 4: While Loop 속성 패널 UI 구현
- Task 5: 노드 라벨 동적 업데이트
- Task 6: 백테스트 엔진 연동 준비
- Task 7: Break 노드 구현
- Task 8: 순환매(Rebalancing) 전략 예시
- Task 9: 복잡한 Loop 구조 테스트

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-8-loop-structure.md` - This story file

**Frontend Files to Modify (3 files)**
- `gr8-frontend/src/components/editor/nodeTypes/index.tsx` - ✅ 수정 (LoopNodeComponent 육각형 형태)
- `gr8-frontend/src/components/editor/PropertiesPanel.tsx` - ✅ 수정 (Loop 설정 UI)
- `gr8-frontend/src/utils/nodeFactory.ts` - ✅ 수정 (createLoopNode 라벨 생성)

**Type Definitions:**
- `gr8-frontend/src/types/nodes.ts` - ✅ 수정 (BreakNode 타입 추가)

**Test Files:**
- `gr8-frontend/src/components/editor/nodeTypes/LoopNode.test.tsx` - ✅ 새로 생성 (선택사항)

**Total:** 3-4 files to modify/create

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-8 Created**
- Created comprehensive story file for Loop Structure (For/While)
- Extracted all AC from epics.md (8 ACs)
- Analyzed existing LoopNode implementation
- Added detailed dev notes with code examples
- Defined For/While loop patterns with safety limits
- Designed Rebalancing strategy support
- Prepared Break node implementation
