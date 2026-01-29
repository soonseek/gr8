# Story 3-9 Pre-Implementation Check Report

**Story ID**: 3-9
**Story Title**: 리스크 관리 노드 (Stop Loss, Take Profit)
**Check Date**: 2026-01-28
**Checked By**: Scrum Master Agent (SM)
**Overall Result**: ✅ **PASS** - 즉시 개발 가능

---

## Executive Summary

Story 3-9는 모든 레이어 검증을 통과했습니다. **RiskManagementNode 인터페이스가 이미 정의**되어 있으며, **RiskManagementNodeComponent도 기본 형태로 구현**되어 있습니다. 방패 모양과 SL/TP 세부 설정 UI만 추가하면 즉시 개발을 시작할 수 있습니다.

### 검증 결과 요약

| Layer | Status | Details |
|-------|--------|---------|
| **Layer 1: 문서 논리 검증** | ✅ **PASS** | FR14 커버, 의존성 매핑 정상 |
| **Layer 2: 구현 상태 검증** | ✅ **PASS** | 인터페이스 있음, Component 기본 구현됨 |
| **Layer 3: 의존성 그래프 분석** | ✅ **PASS** | 순환 의존성 없음, depth=4, fan-out=1 |
| **종합 결과** | ✅ **PASS** | **보완 Story 불필요** - 즉시 개발 가능 |

---

## Layer 1: 문서 논리 검증 (Document Logic Check)

### ✅ FR 커버리지 확인

**FR14: 사용자는 리스크 관리 노드를 구성할 수 있다 (Stop Loss, Take Profit)**

- **Source**: PRD.md - "FR14: 리스크 관리 노드"
- **Coverage**: Epic 3 - Story 3.9 → ✅ **완전 커버**
- **Verification**: AC 1~5에서 SL/TP, Trailing Stop, OCO 모두 명시

### ✅ 의존성 매핑 검증

**선행 Stories:**
1. **Story 3-1: React Flow 기본 에디터** ✅ (done)
   - 제공: 에디터 기반 구조, Zustand store

2. **Story 3-2: 노드 타입 정의** ✅ (done)
   - 제공: RiskManagementNode 인터페이스

3. **Story 3-5: 기본 매수/매도 액션 노드** ✅ (check-passed)
   - 제공: ActionNode, actionNodeId 참조

**의존성 체인:**
```
3-1 → 3-2 → 3-5 → 3-9 ✅
```

### ✅ Acceptance Criteria 완결성 확인

**Story 3-9 AC 검증:**
- AC 1: RiskManagementNode 컴포넌트 구현 (방패 모양) → ✅ 명확함
- AC 2: Stop Loss 설정 패널 → ✅ 명확함
- AC 3: Take Profit 설정 패널 → ✅ 명확함
- AC 4: 백테스트 엔진 연동 → ✅ 명확함
- AC 5: OCO 기능 → ✅ 명확함

**결과**: 모든 AC가 명확하고 검증 가능함

---

## Layer 2: 구현 상태 검증 (Implementation State Check)

### ✅ RiskManagementNode 인터페이스 이미 정의됨

**기존 타입 정의 확인** (types/nodes.ts:231-243):
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

**구현 상태:**
- ✅ RiskManagementNode 인터페이스 정의됨
- ✅ stopLoss, takeProfit, trailingStop 필드 있음
- ✅ actionNodeId 참조 있음 (어떤 액션의 리스크 관리인지)
- ⚠️ **확장 필요**: SL/TP 세부 설정 (퍼센트/고정 가격, 다중 TP 레벨)

### ✅ RiskManagementNodeComponent 기본 구현됨

**기존 구현 확인** (nodeTypes/index.tsx:390-437):
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

**구현 상태:**
- ✅ 기본 RiskManagementNodeComponent 구현됨
- ✅ SL/TP/Trailing 표시됨
- ⚠️ **AC 1 불일치**:
  - 현재: 사각형 형태 (rounded-lg)
  - 요구: 방패 모양 (🛡️)

### ⚠️ 추가 구현 필요

**AC 1: 방패 모양:**
- CSS `border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%` 구현

**AC 2, AC 3: PropertiesPanel UI:**
- ✅ PropertiesPanel.tsx 존재
- ⚠️ Stop Loss 설정 UI 추가 필요
  - 퍼센트/고정 가격 선택
  - Trailing Stop 설정
- ⚠️ Take Profit 설정 UI 추가 필요
  - 퍼센트/고정 가격 선택
  - 다중 TP 레벨

**AC 5: OCO 기능:**
- ⚠️ SL/TP 쌍 관리 로직 필요
- ⚠️ actionNodeId로 그룹핑
- ⚠️ 한쪽 트리거 시 다른 쪽 비활성화

### ✅ 코드 구조 확인

**기존 파일 확인:**
- ✅ `src/components/editor/nodeTypes/index.tsx` 존재
- ✅ RiskManagementNodeComponent 기본 구현됨 (lines 390-437)
- ✅ `src/components/editor/PropertiesPanel.tsx` 존재
- ✅ `src/utils/nodeFactory.ts` 존재
- ✅ `src/types/nodes.ts` 존재

**수정 필요 파일:**
- ⚠️ nodeTypes/index.tsx (방패 모양)
- ⚠️ PropertiesPanel.tsx (SL/TP 설정 UI)
- ⚠️ types/nodes.ts (SL/TP 세부 타입 확장)
- ⚠️ nodeFactory.ts (createRiskManagementNode 라벨)

---

## Layer 3: 의존성 그래프 분석 (Dependency Graph Analysis)

### ✅ 순환 의존성 감지

**의존성 그래프:**
```
3-1 (React Flow Editor)
    ↓
3-2 (Node Type Definitions)
    ↓
3-5 (Buy/Sell Action Node) ← check-passed
    ↓
3-9 (Risk Management Node) ← 현재 Story
```

**분석 결과:**
- ✅ **순환 의존성 없음**: 모든 의존성이 단방향 (하향식)
- ✅ **Topological sort 가능**

### ✅ 의존성 깊이 분석

**Depth Calculation:**
- 3-9 → 3-5 (depth: 1)
- 3-9 → 3-2 (depth: 2)
- 3-9 → 3-1 (depth: 3)

**Result**: Max depth = 3
- ✅ **우수**: depth ≤ 3 (권장 범위 충족)

### ✅ Fan-out 분석

**Fan-out (하위 의존성 수):**
- 3-9의 직접 의존성: 3-5 (1개) ✅

**Result**: Max fan-out = 1
- ✅ **우수**: fan-out ≤ 4

---

## 발견된 Gaps 및 보완 Stories

### ✅ Gaps 없음

**모든 검증을 통과했습니다:**
- Layer 1: FR14 커버, 의존성 매핑 완료
- Layer 2: 인터페이스 있음, Component 기본 구현됨, 방패 모양/SL-TP UI만 추가 필요
- Layer 3: 의존성 그래프 정상

**결과**: **보완 Story 불필요**
- ⚠️ 방패 모양과 SL/TP 세부 설정 UI 구현 필요하지만, 새로운 Story 생성이 아닌 3-9 구현 범위

---

## 검증 결과 및 다음 단계

### 📊 최종 결과

| 항목 | 결과 | 비고 |
|------|------|------|
| **Layer 1: 문서 논리** | ✅ PASS | FR14 커버, 의존성 매핑 완료 |
| **Layer 2: 구현 상태** | ✅ PASS | 인터페이스 있음, Component 기본 구현됨 |
| **Layer 3: 의존성 그래프** | ✅ PASS | 순환 없음, depth=3, fan-out=1 |
| **종합 결과** | ✅ **PASS** | **즉시 개발 가능** |

### 🎯 권장사항

**즉시 실행 (P0):**
1. ✅ **Story 3-9 개발 시작**: 리스크 관리 노드 구현
2. ⚠️ **RiskManagementNodeComponent 방패 모양 구현**:
   - CSS `border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%`
3. ⚠️ **Stop Loss PropertiesPanel UI 추가**:
   - 퍼센트/고정 가격 선택
   - Trailing Stop 설정
4. ⚠️ **Take Profit PropertiesPanel UI 추가**:
   - 퍼센트/고정 가격 선택
   - 다중 TP 레벨
5. ⚠️ **OCO 기능 구현**:
   - actionNodeId로 SL/TP 쌍 관리
   - 한쪽 트리거 시 다른 쪽 비활성화

**선택사항 (P1):**
1. **Story 3-5 check-passed**: actionNodeId 참조 가능
2. **백테스트 엔진 스텁**: 실제 SL/TP 실행 로직은 Story 4.x에서 구현
3. **단위 테스트**: RiskManagementNode.test.tsx 작성

### 📝 Story 상태 전이

**현재 상태**: ready-for-dev
**권장 상태 전이**:
```
ready-for-dev → check-passed
```

**개발 시작 가능:**
```
3-9: in-progress (즉시 개발 시작 가능)
```

---

## 부록: 검증 방법 및 도구

### 사용된 검증 명령어

```bash
# 1. 타입 정의 확인
grep -A 15 "export interface RiskManagementNode" gr8-frontend/src/types/nodes.ts

# 2. Component 구현 확인
grep -A 50 "RiskManagementNodeComponent" gr8-frontend/src/components/editor/nodeTypes/index.tsx

# 3. FR 커버리지 확인
grep -r "FR14\|리스크 관리" _bmad-output/planning-artifacts/prd.md
grep -r "Story 3\.9" _bmad-output/planning-artifacts/epics.md
```

### 참고 문서

- **Story 3-9**: `_bmad-output/implementation-artifacts/3-9-risk-management-node.md`
- **project-context**: `_bmad-output/project-context.md`
- **architecture**: `_bmad-output/planning-artifacts/architecture.md`
- **epics**: `_bmad-output/planning-artifacts/epics.md` (Story 3.9: lines 1551-1594)

---

**보고서 생성일**: 2026-01-28
**검증자**: Scrum Master Agent (BMad Method)
**승인 상태**: Pending User Approval

---

## 📝 AC 1 수정 권장사항

### AC 1: RiskManagementNode 컴포넌트 구현

**방패 모양 구현:**
```css
.shield {
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: #1f2937;
  border: 2px solid #ec4899;
  width: 120px;
  height: 100px;
}
```

**또는 emoji 사용:**
```jsx
<div className="text-4xl">🛡️</div>
```

---

## 🎯 리스크 관리 예시

**Stop Loss:**
```
매수: 100 USDC
SL: 95% (진입 -5%)
→ 가격 95 USDC → 자동 청산
→ 손실 5 USDC로 제한
```

**Take Profit:**
```
매수: 100 USDC
TP: 110% (진입 +10%)
→ 가격 110 USDC → 자동 청산
→ 이익 10 USDC 확정
```

**OCO:**
```
매수: 100 USDC
SL: 95%, TP: 110%
→ 95 USDC 도달: SL 트리거, TP 비활성화
→ 110 USDC 도달: TP 트리거, SL 비활성화
```

**Trailing Stop:**
```
매수: 100 USDC
SL: 95%, Trailing: 5%, 활성화: 102%
→ 102 USDC 도달: Trailing 시작
→ 110 USDC: SL 104.5로 조정
→ 105 USDC: SL 104.5 유지
```
