# Story 3.10: 전략 저장 및 로드 (localStorage)

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 작성 중인 전략을 저장하고 나중에 다시 불러오고 싶다,
**so that** 전략을 수정하고 계속 개발할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1~3.9에서 노드 에디터 기본 구조 완료 ✅
- Story 3.1에서 React Flow 에디터, Zustand store 구현 ✅
- 노드/엣지 추가, 수정, 삭제 가능 ✅
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅
- src/services 디렉토리 존재 ✅

**문제:**
- 페이지 새로고침 시 작업 중인 전략 초기화됨
- 브라우저 닫으면 전략 저장 안 됨
- 여러 전략 관리 불가 (매번 다시 그려야 함)
- 전략 백업/버전 관리 불가

**해결:**
localStorage 기반 전략 저장 및 로드 기능 구현

**중요:**
- **localStorage 사용**: 브라우저 로컬 스토리지 활용 (영구 저장)
- **전략 직렬화**: nodes[], edges[], metadata → JSON
- **전략 메타데이터**: 이름, 생성일, 수정일, 노드 수, 설명
- **저장 키**: `gr8-strategy-{id}` 형식
- **크기 제한**: 최대 1MB (localStorage 제한)
- **LRU 캐시**: 저장 공간 부족 시 가장 오래된 전략 자동 삭제
- **전략 목록**: 저장된 전략 목록 표시
- **일관성**: 저장/로드 시 모든 노드와 연결 복원

---

## 수용 기준 (Acceptance Criteria)

### AC 1: strategyStorage 서비스 구현

**Given** 노드 에디터가 구현되었다
**When** 개발자가 전략 저장 기능을 구현한다
**Then** `src/services/strategyStorage.ts`가 생성된다
**And** `saveStrategy()` 함수가 구현된다
**And** `loadStrategy()` 함수가 구현된다
**And** `listStrategies()` 함수가 구현된다
**And** `deleteStrategy()` 함수가 구현된다
**And** 모든 함수가 localStorage를 사용한다

### AC 2: 전략 저장 UI 구현

**Given** 사용자가 전략을 작성 중이다
**When** 사용자가 "저장" 버튼을 클릭한다
**Then** 전략 이름 입력 모달이 표시된다
**And** 사용자가 전략 이름을 입력한다 (예: "RSI 매매 전략")
**And** "저장"과 "취소" 버튼이 제공된다
**And** 이름이 비어있으면 에러 메시지가 표시된다
**And** 전략이 localStorage에 저장된다 (키: `gr8-strategy-{id}`)
**And** 전략 메타데이터가 저장된다 (이름, 생성일, 수정일, 노드 수, 설명)

### AC 3: 전략 로드 UI 구현

**Given** 전략이 저장되었다
**When** 사용자가 "불러오기" 버튼을 클릭한다
**Then** 저장된 전략 목록 모달이 표시된다
**And** 각 전략의 이름과 생성일이 표시된다
**And** 전략 설명 미리보기가 표시된다 (최대 100자)
**And** "불러오기", "삭제", "취소" 버튼이 제공된다
**And** 전략을 선택하고 "불러오기"를 클릭하면 캔버스에 로드된다
**And** 모든 노드와 연결이 복원된다
**And** React Flow 상태가 업데이트된다

### AC 4: 전략 데이터 구조

**Given** 전략 저장 기능이 구현되었다
**When** 개발자가 전략 데이터 구조를 검증한다
**Then** 전략이 JSON으로 직렬화된다
**And** 다음 정보가 포함된다:
  - metadata: { id, name, description, createdAt, updatedAt, nodeCount }
  - nodes: ReactFlow Node[] (모든 노드 설정 포함)
  - edges: ReactFlow Edge[] (모든 연결 포함)
  - viewport: { x, y, zoom } (캔버스 위치, 줌 레벨)
**And** 각 노드의 전체 설정이 포함된다 (data, position, type)
**And** 전략 크기가 제한된다 (최대 1MB, localStorage 제한)

### AC 5: 저장 공간 관리

**Given** 사용자가 여러 전략을 저장했다
**When** 저장 공간이 부족해진다
**Then** 가장 오래된 전략이 자동으로 삭제된다 (LRU - Least Recently Used)
**Or 사용자에게 삭제 확인 요청이 표시된다
**And** 사용자가 직접 전략을 삭제할 수 있다
**And** 삭제 시 "정말 삭제하시겠습니까?" 확인이 표시된다
**And** 삭제 후 전략 목록이 갱신된다

### AC 6: 지속성 검증

**Given** 전략 저장/로드가 구현되었다
**When** 개발자가 기능을 테스트한다
**Then** 저장 후 즉시 로드가 정상 작동한다
**And** 페이지 새로고침 후에도 로드가 작동한다
**And** 저장된 전략이 브라우저를 닫아도 유지된다
**And** 브라우저 재시작 후에도 전략이 유지된다
**And** FR15: 전략이 로컬에 저장된다

---

## Tasks / Subtasks

### Task 1: strategyStorage 서비스 구현 (AC: #1)
- [ ] Subtask 1.1: `src/services/strategyStorage.ts` 파일 생성
- [ ] Subtask 1.2: `saveStrategy()` 함수 구현
  - 전략을 JSON 직렬화
  - localStorage.setItem(`gr8-strategy-{id}`, JSON.stringify(strategy))
  - 메타데이터 업데이트 (createdAt, updatedAt)
- [ ] Subtask 1.3: `loadStrategy()` 함수 구현
  - localStorage.getItem(`gr8-strategy-{id}`)
  - JSON 파싱 및 타입 검증
  - ReactFlow 상태 복원
- [ ] Subtask 1.4: `listStrategies()` 함수 구현
  - 모든 `gr8-strategy-*` 키 조회
  - 메타데이터 추출 및 목록 반환
  - updatedAt 기준 내림차순 정렬
- [ ] Subtask 1.5: `deleteStrategy()` 함수 구현
  - localStorage.removeItem(`gr8-strategy-{id}`)
  - 성공 시 true 반환
- [ ] Subtask 1.6: `getStorageUsage()` 함수 구현 (선택사항)
  - localStorage 사용량 계산
  - 백분율 반환

### Task 2: 전략 타입 정의 (AC: #4)
- [ ] Subtask 2.1: `src/types/strategy.ts` 파일 생성
- [ ] Subtask 2.2: StrategyMetadata 인터페이스 정의
  ```typescript
  interface StrategyMetadata {
    id: string;
    name: string;
    description?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    nodeCount: number;
    edgeCount: number;
  }
  ```
- [ ] Subtask 2.3: Strategy 인터페이스 정의
  ```typescript
  interface Strategy {
    metadata: StrategyMetadata;
    nodes: Node[];
    edges: Edge[];
    viewport: { x: number; y: number; zoom: number };
  }
  ```
- [ ] Subtask 2.4: localStorage 키 상수 정의
  ```typescript
  const STRATEGY_KEY_PREFIX = 'gr8-strategy-';
  const MAX_STRATEGY_SIZE = 1 * 1024 * 1024; // 1MB
  ```

### Task 3: 전략 저장 UI 구현 (AC: #2)
- [ ] Subtask 3.1: StrategyEditor 상단 툴바에 "저장" 버튼 추가
  - 디스켓 아이콘 💾
  - Tooltip: "전략 저장 (Ctrl+S)"
- [ ] Subtask 3.2: 저장 모달 컴포넌트 생성
  - 전략 이름 입력 (TextInput, 최대 50자)
  - 설명 입력 (TextArea, 최대 500자, 선택사항)
  - "저장", "취소" 버튼
- [ ] Subtask 3.3: 이름 유효성 검증
  - 빈 이름: "전략 이름을 입력해주세요"
  - 중복 이름: "이미 존재하는 이름입니다"
- [ ] Subtask 3.4: 저장 성공 시 Toast 메시지
  - "전략이 저장되었습니다: {name}"
  - 3초 후 자동 닫힘
- [ ] Subtask 3.5: 키보드 단축키 (Ctrl+S / Cmd+S)
  - 저장 모달 열기

### Task 4: 전략 로드 UI 구현 (AC: #3)
- [ ] Subtask 4.1: StrategyEditor 상단 툴바에 "불러오기" 버튼 추가
  - 폴더 아이콘 📂
  - Tooltip: "전략 불러오기 (Ctrl+O)"
- [ ] Subtask 4.2: 전략 목록 모달 컴포넌트 생성
  - 저장된 전략 목록 표시
  - 각 전략 카드: 이름, 설명 미리보기, 생성일, 수정일
  - "불러오기", "삭제" 버튼
- [ ] Subtask 4.3: 빈 목록 메시지
  - "저장된 전략이 없습니다"
  - "새 전략을 만들어보세요!"
- [ ] Subtask 4.4: 전략 선택 확인
  - 현재 전략이 있는 경우: "현재 전략을 덮어쓰시겠습니까?"
  - "미리 저장하지 않으면 변경 사항이 손실됩니다"
- [ ] Subtask 4.5: 로드 성공 시 Toast 메시지
  - "전략이 로드되었습니다: {name}"
- [ ] Subtask 4.6: 로드 실패 시 에러 메시지
  - "전략을 로드할 수 없습니다"
- [ ] Subtask 4.7: 키보드 단축키 (Ctrl+O / Cmd+O)
  - 전략 목록 모달 열기

### Task 5: 저장 공간 관리 구현 (AC: #5)
- [ ] Subtask 5.1: localStorage 크기 확인 로직
  - 각 저장 전 남은 공간 확인
  - 전략 크기 계산 (JSON.stringify(strategy).length)
- [ ] Subtask 5.2: LRU (Least Recently Used) 구현
  - updatedAt 추적
  - 공간 부족 시 가장 오래된 전략 자동 삭제
  - 삭제 전 Toast: "저장 공간 부족으로 가장 오래된 전략을 삭제했습니다"
- [ ] Subtask 5.3: 전략 삭제 확인 모달
  - "정말 '{name}' 전략을 삭제하시겠습니까?"
  - "삭제된 전략은 복구할 수 없습니다"
  - "삭제", "취소" 버튼
- [ ] Subtask 5.4: 삭제 성공 시 목록 갱신
  - 전략 목록에서 제거
  - Toast: "전략이 삭제되었습니다"

### Task 6: React Flow 상태 복원 (AC: #3, #6)
- [ ] Subtask 6.1: Zustand store에 setNodes, setEdges 함수 확인
- [ ] Subtask 6.2: loadStrategy에서 상태 복원
  - setNodes(strategy.nodes)
  - setEdges(strategy.edges)
  - setViewport(strategy.viewport)
- [ ] Subtask 6.3: 노드 ID 충돌 방지
  - 각 노드의 고유 ID 유지
  - 로드 시 ID 재생성 방지
- [ ] Subtask 6.4: viewport 복원
  - 캔버스 위치 (x, y)
  - 줌 레벨 (zoom)

### Task 7: 지속성 테스트 (AC: #6)
- [ ] Subtask 7.1: 저장 후 즉시 로드 테스트
  - 전략 저장 → 즉시 로드 → 모든 노드/엣지 복원 확인
- [ ] Subtask 7.2: 페이지 새로고침 테스트
  - 전략 저장 → F5 새로고침 → 로드 → 복원 확인
- [ ] Subtask 7.3: 브라우저 닫기 후 테스트
  - 전략 저장 → 브라우저 닫기 → 재시작 → 로드 → 복원 확인
- [ ] Subtask 7.4: 여러 전략 저장/로드 테스트
  - 3개 전략 저장 → 각각 로드 → 개별 복원 확인
- [ ] Subtask 7.5: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **localStorage 기반 전략 저장 및 로드 기능**을 구현하여 사용자가 작업 중인 전략을 저장하고 나중에 다시 불러올 수 있게 합니다. 완료되면:
- 페이지 새로고침/브라우저 닫아도 전략 유지
- 여러 전략 저장 및 관리 가능
- 전략 백업/버전 관리 가능
- FR15 충족: 전략이 로컬에 저장됨

### 📚 localStorage 이해

**localStorage 특징:**
- 브라우저 내장 저장소 (영구 저장)
- 도메인별로 격리 (Same-origin policy)
- 저장 용량: 일반적으로 5~10MB
- API: localStorage.setItem(), getItem(), removeItem(), clear()
- 데이터 형식: String만 저장 가능 (JSON 직렬화 필요)
- 동기식 (비동기 아님, 주의 필요)

**localStorage 한계:**
- String만 저장 가능 (객체는 JSON 직렬화 필요)
- 용량 제한 (도메인별 5~10MB)
- 탭 간 공유 안 됨 (같은 도메인 탭은 공유됨)
- 보안: XSS 공격에 취약 (민감 정보 X)

### 🏗️ 전략 데이터 구조

**Strategy 타입:**
```typescript
interface Strategy {
  metadata: {
    id: string;                  // UUID
    name: string;                // "RSI 매매 전략"
    description?: string;        // "RSI가 30 이하이면 매수..."
    createdAt: string;           // "2026-01-28T12:00:00.000Z"
    updatedAt: string;           // "2026-01-28T12:30:00.000Z"
    nodeCount: number;           // 10
    edgeCount: number;           // 12
  };
  nodes: Node[];                 // ReactFlow Node[]
  edges: Edge[];                 // ReactFlow Edge[]
  viewport: {
    x: number;                   // 0
    y: number;                   // 0
    zoom: number;                // 1
  };
}
```

**localStorage 키 형식:**
```
gr8-strategy-{uuid}
예: gr8-strategy-a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### 📐 파일 구조

**Story 3.10에서 생성할 파일:**
```
src/
├── services/
│   └── strategyStorage.ts             # ✅ 새로 생성 (localStorage 저장/로드)
├── types/
│   └── strategy.ts                    # ✅ 새로 생성 (Strategy 타입)
├── components/
│   └── editor/
│       ├── SaveStrategyModal.tsx      # ✅ 새로 생성 (저장 모달)
│       ├── LoadStrategyModal.tsx      # ✅ 새로 생성 (로드 모달)
│       └── StrategyCard.tsx           # ✅ 새로 생성 (전략 카드)
└── utils/
    └── storageUtils.ts                # ✅ 새로 생성 (localStorage 유틸)
```

### 🎨 UI/UX 디자인 가이드

**저장 모달:**
```
┌─────────────────────────────────┐
│ 💾 전략 저장                    │
├─────────────────────────────────┤
│ 전략 이름 *                     │
│ [RSI 매매 전략______________]   │
│                                  │
│ 설명 (선택사항)                 │
│ ┌───────────────────────────┐   │
│ │ RSI가 30 이하이면 매수,  │   │
│ │ 70 이상이면 매도...       │   │
│ │                           │   │
│ └───────────────────────────┘   │
│                                  │
│                   [취소] [저장] │
└─────────────────────────────────┘
```

**전략 목록 모달:**
```
┌─────────────────────────────────┐
│ 📂 저장된 전략                  │
├─────────────────────────────────┤
│                                  │
│ ┌───────────────────────────┐   │
│ │ RSI 매매 전략            🗑️│   │
│ │ RSI가 30 이하이면 매수... │   │
│ │ 생성일: 2026-01-28         │   │
│ │ [불러오기]               │   │
│ └───────────────────────────┘   │
│                                  │
│ ┌───────────────────────────┐   │
│ │ MACD 추세 전략           🗑️│   │
│ │ MACD가 시그널이면...      │   │
│ │ 생성일: 2026-01-27         │   │
│ │ [불러오기]               │   │
│ └───────────────────────────┘   │
│                                  │
│ 저장된 전략이 없습니다.         │
│                                  │
│                      [닫기]     │
└─────────────────────────────────┘
```

**삭제 확인 모달:**
```
┌─────────────────────────────────┐
│ ⚠️ 전략 삭제                    │
├─────────────────────────────────┤
│                                  │
│ 정말 'RSI 매매 전략' 전략을     │
│ 삭제하시겠습니까?               │
│                                  │
│ 삭제된 전략은 복구할 수 없습니다. │
│                                  │
│            [취소] [삭제]       │
└─────────────────────────────────┘
```

### 💡 저장 공간 관리

**localStorage 크기 계산:**
```typescript
function getStorageSize(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

function getStorageUsage(): { used: number; total: number; percentage: number } {
  const used = getStorageSize();
  const total = 5 * 1024 * 1024; // 5MB (일반적 제한)
  return {
    used,
    total,
    percentage: (used / total) * 100
  };
}
```

**LRU (Least Recently Used):**
```typescript
function removeOldestStrategyIfNeeded(requiredSize: number): void {
  const strategies = listStrategies();
  const usage = getStorageUsage();

  if (usage.used + requiredSize > usage.total * 0.9) {  // 90% 임계점
    const oldest = strategies.sort((a, b) =>
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    )[0];

    deleteStrategy(oldest.id);
    console.log(`Deleted oldest strategy: ${oldest.name}`);
  }
}
```

### ⚠️ 중요 고려사항

**1. JSON 직렬화/역직렬화:**
- 저장: `JSON.stringify(strategy)`
- 로드: `JSON.parse(localStorage.getItem(key))`
- 날짜: `new Date().toISOString()` → JSON → `new Date(dateString)`

**2. 에러 처리:**
- localStorage 꽉 참: QuotaExceededError
- JSON 파싱 실패: SyntaxError
- 유효하지 않은 데이터: ValidationError

**3. 타입 안전성:**
- Zod 또는 Yup로 JSON 스키마 검증
- 로드 시 타입 검증

**4. 성능 최적화:**
- 전략 목록 캐싱 (React Query 또는 Zustand)
- 저장/로드 비동기 처리 (사용자 경험 향상)
- 큰 전략 (50+ 노드) 지연 로딩

**5. 보안:**
- XSS 방지: JSON 직렬화 시 sanitize
- 민감 정보 X: 지갑 주소, 개인키 등 localStorage에 저장 X
- 입력 검증: 이름, 설명 길이 제한

**6. 사용자 경험:**
- 저장 전 확인: "현재 전략을 덮어쓰시겠습니까?"
- 진행 상태 표시: "저장 중...", "로드 중..."
- 성공/실패 피드백: Toast 메시지
- 키보드 단축키: Ctrl+S (저장), Ctrl+O (로드)

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveStrategy, loadStrategy, listStrategies, deleteStrategy } from '../strategyStorage';

describe('strategyStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('saves strategy to localStorage', () => {
    const strategy = {
      metadata: { id: 'test-1', name: 'Test Strategy', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nodeCount: 3 },
      nodes: [{ id: '1', type: 'trigger', data: { label: 'Test' } }],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    };

    saveStrategy(strategy);
    const loaded = loadStrategy('test-1');

    expect(loaded).toEqual(strategy);
  });

  it('lists all strategies', () => {
    const strategy1 = { /* ... */ };
    const strategy2 = { /* ... */ };

    saveStrategy(strategy1);
    saveStrategy(strategy2);

    const strategies = listStrategies();

    expect(strategies).toHaveLength(2);
    expect(strategies[0].name).toBeDefined();
  });

  it('deletes strategy', () => {
    const strategy = { /* ... */ };
    saveStrategy(strategy);

    const deleted = deleteStrategy('test-1');
    const strategies = listStrategies();

    expect(deleted).toBe(true);
    expect(strategies).toHaveLength(0);
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 (Zustand store)
- ✅ Story 3.2: 노드 타입 정의

**후속 Stories (이 Story의 저장/로드 활용):**
- Story 3.11: JSON export/import (파일로 저장/공유)
- Story 3.12: 전략 이름/설명 수정

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-10的完整AC (6개 AC)
2. ✅ 分析了Story 3-9的实现模式作为参考
3. ✅ 确认了services目录存在
4. ✅ 整合了project-context.md的关键规则
5. ✅ 分析了Zustand store结构
6. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: strategyStorage 서비스 구현
- Task 2: 전략 타입 정의
- Task 3: 전략 저장 UI 구현
- Task 4: 전략 로드 UI 구현
- Task 5: 저장 공간 관리 구현
- Task 6: React Flow 상태 복원
- Task 7: 지속성 테스트

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-10-strategy-save-load.md` - This story file

**Frontend Files to Create (6 files)**
- `gr8-frontend/src/services/strategyStorage.ts` - ✅ 새로 생성 (localStorage 저장/로드)
- `gr8-frontend/src/types/strategy.ts` - ✅ 새로 생성 (Strategy 타입)
- `gr8-frontend/src/components/editor/SaveStrategyModal.tsx` - ✅ 새로 생성 (저장 모달)
- `gr8-frontend/src/components/editor/LoadStrategyModal.tsx` - ✅ 새로 생성 (로드 모달)
- `gr8-frontend/src/components/editor/StrategyCard.tsx` - ✅ 새로 생성 (전략 카드)
- `gr8-frontend/src/utils/storageUtils.ts` - ✅ 새로 생성 (localStorage 유틸)

**Files to Modify (1 file)**
- `gr8-frontend/src/components/editor/StrategyEditor.tsx` - ✅ 수정 (저장/로드 버튼 추가)

**Test Files:**
- `gr8-frontend/src/services/strategyStorage.test.ts` - ✅ 새로 생성

**Total:** 6-7 files to create, 1 file to modify

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-10 Created**
- Created comprehensive story file for Strategy Save/Load (localStorage)
- Extracted all AC from epics.md (6 ACs)
- Defined localStorage-based persistence architecture
- Designed strategy metadata structure
- Prepared LRU cache for storage management
- Added keyboard shortcuts (Ctrl+S, Ctrl+O)
- Designed save/load modals
