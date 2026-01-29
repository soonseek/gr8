# Story 3.11: 전략 JSON export/import

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 전략을 JSON 파일로 export하고 import하고 싶다,
**so that** 다른 사용자와 전략을 공유하거나 백업할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.10에서 전략 저장/로드 (localStorage) 기능 구현 예정 ✅
- Strategy 타입과 metadata 구조 정의될 예정 ✅
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅
- src/services 디렉토리 존재 ✅

**문제:**
- 전략을 파일로 백업할 수 없음
- 다른 사용자와 전략 공유 불가
- 다른 기기에서 전략 불러오기 불가
- 버전 관리(깃헙 비슷한 백업) 불가

**해결:**
JSON 파일 기반 export/import 기능 구현

**중요:**
- **JSON export**: 현재 전략을 .json 파일로 다운로드
- **JSON import**: .json 파일에서 전략 불러오기
- **파일명**: `{strategy-name}.json` (예: `rsi-strategy.json`)
- **전체 전략 포함**: nodes[], edges[], metadata
- **유효성 검증**: JSON 스키마 검증, 노드 타입 검증
- **덮어쓰기 확인**: import 시 기존 전략 보존 확인
- **FR16 충족**: 전략이 JSON으로 export/import 됨

---

## 수용 기준 (Acceptance Criteria)

### AC 1: strategyIO 서비스 구현

**Given** 전략 저장이 구현되었다 (Story 3.10)
**When** 개발자가 export/import 기능을 구현한다
**Then** `src/services/strategyIO.ts`가 생성된다
**And** `exportStrategyJSON()` 함수가 구현된다
**And** `importStrategyJSON()` 함수가 구현된다
**And** 파일 다운로드/업로드가 지원된다
**And** `validateStrategyJSON()` 함수가 구현된다 (유효성 검증)

### AC 2: 전략 Export UI 구현

**Given** 사용자가 "내보내기" 버튼을 클릭한다
**When** 현재 전략을 export한다
**Then** 전략 JSON이 생성된다
**And** 파일 다운로드가 시작된다 (파일명: `{strategy-name}.json`)
**And** JSON에 전체 전략이 포함된다 (nodes, edges, metadata, viewport)
**And** 다운로드 진행 상태가 표시된다 (" exporting...")
**And** 다운로드 완료 시 Toast 메시지가 표시된다

### AC 3: 전략 Import UI 구현

**Given** 사용자가 "가져오기" 버튼을 클릭한다
**When** JSON 파일을 선택한다
**Then** 파일 선택 대화상이 표시된다 (.json 필터)
**And** 파일이 업로드된다
**And** JSON 유효성 검증이 수행된다
**And** 유효하지 않은 JSON이면 에러 메시지가 표시된다
**And** 유효한 JSON이면 캔버스에 로드된다
**And** 기존 전략을 덮어쓸지 확인한다 ("현재 전략을 덮어쓰시겠습니까?")
**And** import 완료 시 Toast 메시지가 표시된다

### AC 4: JSON 유효성 검증

**Given** import가 진행 중이다
**When** JSON에 유효하지 않은 노드 타입이 포함되어 있다
**Then** "알 수 없는 노드 타입이 포함되어 있습니다: {unknown-types}" 에러가 표시된다
**And** import가 중단된다
**And** 유효한 노드만 import되도록 사용자에게 묻는다 (선택 사항)
**And** import를 계속하면 유효한 노드만 로드되고, 알 수 없는 노드는 무시됨

### AC 5: 다양한 전략 Export/Import 테스트

**Given** export/import가 구현되었다
**When** 개발자가 다양한 전략으로 테스트한다
**Then** 단순 전략(3개 노드)이 export/import된다
**And** 복잡한 전략(50개 노드)이 export/import된다
**And** 중첩 Loop가 포함된 전략이 export/import된다
**And** 모든 노드 설정이 보존된다 (data, position, type, id)
**And** 모든 엣지 연결이 보존된다 (source, target, id)
**And** viewport가 보존된다 (x, y, zoom)

---

## Tasks / Subtasks

### Task 1: strategyIO 서비스 구현 (AC: #1)
- [ ] Subtask 1.1: `src/services/strategyIO.ts` 파일 생성
- [ ] Subtask 1.2: `exportStrategyJSON()` 함수 구현
  - 전략을 JSON Blob으로 변환
  - Blob URL 생성
  - 다운로드 링크 생성
  - 다운로드 트리거
- [ ] Subtask 1.3: `importStrategyJSON()` 함수 구현
  - 파일 읽기 (FileReader API)
  - JSON 파싱
  - validateStrategyJSON() 호출
  - ReactFlow 상태 업데이트
- [ ] Subtask 1.4: `validateStrategyJSON()` 함수 구현
  - JSON 스키마 검증 (Zod 또는 Yup)
  - 필수 필드 확인 (metadata, nodes, edges)
  - 노드 타입 검증 (유효한 NodeType enum)
  - 엣지 연결 검증 (source, target 노드 존재)

### Task 2: JSON 스키마 정의 (AC: #4)
- [ ] Subtask 2.1: `src/schemas/strategySchema.ts` 파일 생성
- [ ] Subtask 2.2: StrategyJSON 스키마 정의 (Zod)
  ```typescript
  import { z } from 'zod';

  export const StrategyJSONSchema = z.object({
    metadata: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(50),
      description: z.string().max(500).optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
      nodeCount: z.number().int().min(0),
      edgeCount: z.number().int().min(0),
    }),
    nodes: z.array(z.any()),  // ReactFlow Node[]
    edges: z.array(z.any()),  // ReactFlow Edge[]
    viewport: z.object({
      x: z.number(),
      y: z.number(),
      zoom: z.number().min(0.1).max(2),
    }),
  });
  ```
- [ ] Subtask 2.3: 노드 타입 검증 enum 정의
  ```typescript
  const VALID_NODE_TYPES = [
    'trigger', 'market_data', 'indicator',
    'action', 'condition', 'loop', 'risk_mgmt'
  ];
  ```

### Task 3: Export UI 구현 (AC: #2)
- [ ] Subtask 3.1: StrategyEditor 상단 툴바에 "내보내기" 버튼 추가
  - 다운로드 아이콘 ⬇️
  - Tooltip: "전략 JSON으로 내보내기 (Ctrl+E)"
- [ ] Subtask 3.2: export 진행 상태 표시
  - Toast: "전략 내보내기 중..."
  - 완료 후: "전략이 내보내졌습니다: {filename}"
- [ ] Subtask 3.3: 파일명 생성 로직
  - 전략 이름에서 파일명 생성
  - 특수 문자 제거 (/, \, :, *, ?, ", <, >, |)
  - 소문자로 변환, 공백은 하이픈으로
  - 예: "RSI 매매 전략" → "rsi-trading-strategy.json"
- [ ] Subtask 3.4: 다운로드 트리거
  - `<a>` 태그의 download 속성 활용
  - 또는 `URL.createObjectURL(blob)` + 클릭 이벤트
- [ ] Subtask 3.5: 키보드 단축키 (Ctrl+E / Cmd+E)
  - export 트리거

### Task 4: Import UI 구현 (AC: #3)
- [ ] Subtask 4.1: StrategyEditor 상단 툴바에 "가져오기" 버튼 추가
  - 업로드 아이콘 ⬆️
  - Tooltip: "전략 JSON 파일에서 가져오기 (Ctrl+I)"
- [ ] Subtask 4.2: 파일 입력 컴포넌트 (hidden)
  - `<input type="file" accept=".json" />`
  - ref로 프로그래매틱 방식 접근
- [ ] Subtask 4.3: 파일 선택 시 import 시작
  - `onChange` 이벤트 핸들러
  - FileReader로 파일 읽기
  - importStrategyJSON() 호출
- [ ] Subtask 4.4: import 진행 상태 표시
  - Toast: "전략 불러오기 중..."
  - 완료 후: "전략이 로드되었습니다: {name}"
  - 실패 시: "전략을 로드할 수 없습니다"
- [ ] Subtask 4.5: 덮어쓰기 확인 모달
  - "현재 전략을 덮어쓰시겠습니까?"
  - "미리 저장하지 않으면 변경 사항이 손실됩니다"
  - "취소", "가져오기" 버튼
- [ ] Subtask 4.6: 키보드 단축키 (Ctrl+I / Cmd+I)
  - 파일 선택 대화상 열기

### Task 5: 유효성 검증 및 에러 처리 (AC: #4)
- [ ] Subtask 5.1: JSON 파싱 에러 처리
  - try-catch로 JSON.parse() 감싸기
  - 에러 시: "유효하지 않은 JSON 파일입니다"
- [ ] Subtask 5.2: 스키마 검증 에러 처리
  - Zod 검증 실패 시 에러 메시지
  - 누락된 필드 표시
- [ ] Subtask 5.3: 알 수 없는 노드 타입 검출
  - 노드의 type이 VALID_NODE_TYPES에 없는지 확인
  - 예: "알 수 없는 노드 타입: 'custom_node'"
  - 유효한 노드만 import 옵션 제공
- [ ] Subtask 5.4: 엣지 연결 검증
  - source, target 노드 ID가 nodes 배열에 있는지 확인
  - 없는 연결은 경고 로그 후 제거
- [ ] Subtask 5.5: 버전 호환성 검증
  - metadata.version 필드 확인 (선택사항)
  - 버전 불일치 시 업그레이드 로직 (선택사항)

### Task 6: React Flow 상태 복원 (AC: #5)
- [ ] Subtask 6.1: import 후 상태 복원
  - setNodes(strategy.nodes)
  - setEdges(strategy.edges)
  - setViewport(strategy.viewport)
- [ ] Subtask 6.2: fitView 호출
  - `reactFlow.fitView({ nodes: strategy.nodes })`
  - 모든 노드가 화면에 보이도록 조정
- [ ] Subtask 6.3: 노드 ID 충돌 해결
  - ID 중복 시 새 ID 생성
  - 엣지 ID도 업데이트

### Task 7: 다양한 전략 테스트 (AC: #5)
- [ ] Subtask 7.1: 단순 전략 export/import 테스트
  - 3개 노드 (Trigger, MarketData, Action)
  - 모든 데이터 보존 확인
- [ ] Subtask 7.2: 복잡한 전략 export/import 테스트
  - 50개 노드
  - 다양한 노드 타입 조합
- [ ] Subtask 7.3: 중첩 Loop export/import 테스트
  - Loop 안에 Loop
  - 복잡한 연결 구조
- [ ] Subtask 7.4: 단위 테스트 작성 (Vitest)

---

## Dev Notes

### 🎯 목표

이 Story는 **JSON 파일 기반 전략 export/import 기능**을 구현하여 사용자가 전략을 파일로 백업하고 공유할 수 있게 합니다. 완료되면:
- 전략을 .json 파일로 다운로드 가능
- .json 파일에서 전략 불러오기 가능
- 다른 사용자와 전략 공유 가능
- 버전 관리(깃헙 비슷한 백업) 가능
- FR16 충족: 전략이 JSON으로 export/import 됨

### 📚 Story 3.10과의 연계

**Story 3.10 (localStorage 저장/로드):**
- 브라우저 내부 저장
- 빠른 저장/로드
- 자동 저장

**Story 3.11 (JSON export/import):**
- 파일로 저장/공유
- 백업/버전 관리
- 사용자 간 공유

**데이터 구조 공유:**
```typescript
// Story 3.10과 3.11 모두 동일한 Strategy 타입 사용
interface Strategy {
  metadata: { ... };
  nodes: Node[];
  edges: Edge[];
  viewport: { x, y, zoom };
}
```

### 🏗️ JSON Export 구현

**Blob 생성:**
```typescript
function exportStrategyJSON(strategy: Strategy): void {
  const json = JSON.stringify(strategy, null, 2);  // 2-space indentation
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(strategy.metadata.name)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

**파일명 생성:**
```typescript
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')  // 특수 문자 제거
    .replace(/\s+/g, '-')              // 공백을 하이픈으로
    .substring(0, 50);               // 길이 제한
}
```

### 🏗️ JSON Import 구현

**FileReader API:**
```typescript
function importStrategyJSON(file: File): Promise<Strategy> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result as string);
        const strategy = StrategyJSONSchema.parse(json);
        resolve(strategy);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsText(file);
  });
}
```

**입력 컴포넌트:**
```tsx
<input
  type="file"
  accept=".json"
  ref={fileInputRef}
  style={{ display: 'none' }}
  onChange={(e) => handleFileSelect(e)}
/>
```

### 📐 파일 구조

**Story 3.11에서 생성할 파일:**
```
src/
├── services/
│   └── strategyIO.ts                   # ✅ 새로 생성 (export/import)
├── schemas/
│   └── strategySchema.ts              # ✅ 새로 생성 (Zod 스키마)
├── utils/
│   └── fileUtils.ts                    # ✅ 새로 생성 (파일명 생성)
└── components/
    └── editor/
        └── ConfirmOverwriteModal.tsx   # ✅ 새로 생성 (덮어쓰기 확인)
```

### 🎨 UI/UX 디자인 가이드

**내보내기 버튼:**
```
┌─────────────────────────────────┐
│ 툴바                            │
│ [저장] [불러오기] [내보내기]    │
│           ↑                     │
│       다운로드 아이콘           │
└─────────────────────────────────┘
```

**가져오기 버튼:**
```
┌─────────────────────────────────┐
│ 툴바                            │
│ [저장] [불러오기] [내보내기]    │
│       ↑                        │
│    업로드 아이콘                │
└─────────────────────────────────┘
```

**덮어쓰기 확인 모달:**
```
┌─────────────────────────────────┐
│ ⚠️ 전략 가져오기               │
├─────────────────────────────────┤
│ 현재 캔버스의 내용은 덮어쓰게  │
│ 됩니다.                         │
│                                  │
│ 미리 저장하지 않으면 변경 사항이 │
│ 손실됩니다.                     │
│                                  │
│            [취소] [가져오기]   │
└─────────────────────────────────┘
```

**알 수 없는 노드 타입 에러:**
```
┌─────────────────────────────────┐
│ ⚠️ 가져오기 실패               │
├─────────────────────────────────┤
│ 알 수 없는 노드 타입이 포함되어   │
│ 있습니다:                       │
│ • custom_node                  │
│ • deprecated_indicator         │
│                                  │
│ 유효한 노드만 가져오시겠습니까? │
│ (알 수 없는 노드은 제거됩니다)   │
│                                  │
│      [취소] [계속]             │
└─────────────────────────────────┘
```

### 💡 JSON 파일 예시

**rsi-trading-strategy.json:**
```json
{
  "metadata": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "RSI 매매 전략",
    "description": "RSI가 30 이하이면 매수, 70 이상이면 매도",
    "createdAt": "2026-01-28T12:00:00.000Z",
    "updatedAt": "2026-01-28T12:30:00.000Z",
    "nodeCount": 5,
    "edgeCount": 4
  },
  "nodes": [
    {
      "id": "1",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "시작" }
    },
    {
      "id": "2",
      "type": "market_data",
      "position": { "x": 100, "y": 300 },
      "data": {
        "label": "BTC/USDC",
        "config": { "exchange": "binance", "symbol": "BTCUSDC" }
      }
    },
    {
      "id": "3",
      "type": "indicator",
      "position": { "x": 350, "y": 200 },
      "data": {
        "label": "RSI 14",
        "config": { "indicatorType": "RSI", "period": 14 }
      }
    },
    {
      "id": "4",
      "type": "condition",
      "position": { "x": 600, "y": 200 },
      "data": {
        "label": "If RSI < 30",
        "config": { "operator": "LT", "leftValue": "RSI", "rightValue": 30 }
      }
    },
    {
      "id": "5",
      "type": "action",
      "position": { "x": 850, "y": 200 },
      "data": {
        "label": "매수 100 USDC",
        "config": { "actionType": "BUY", "amount": 100 }
      }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e2-3", "source": "2", "target": "3" },
    { "id": "e3-4", "source": "3", "target": "4" },
    { "id": "e4-5", "source": "4", "target": "5" }
  ],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}
```

### ⚠️ 중요 고려사항

**1. 파일 크기 제한:**
- 일반적인 제한: 없음
- 권장: 최대 10MB (50개 노드 정도)
- 큰 파일의 경우 로딩 스피너 표시

**2. 보안:**
- JSON 파싱 시 코드 인젝션 공격 방지
- sanitized된 JSON만 import
- 악성적인 JSON이면 import 거부

**3. 버전 호환성:**
- metadata.version 필드 추가 (선택사항)
- 버전 불일치 시 자동 업그레이드 로직
- 마이그레이션 가이드 제공

**4. 사용자 경험:**
- 파일 선택 간소화 (.json 필터)
- 진행 상태 표시 (Toast, Spinner)
- 명확한 에러 메시지
- 키보드 단축키 (Ctrl+E, Ctrl+I)

**5. 데이터 무결성:**
- export 시 모든 데이터 포함 확인
- import 시 필수 필드 검증
- 손상된 엣지 연결 복구 시도

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
import { describe, it, expect } from 'vitest';
import { exportStrategyJSON, importStrategyJSON, validateStrategyJSON } from '../strategyIO';

describe('strategyIO', () => {
  it('exports strategy to JSON', () => {
    const strategy = {
      metadata: { /* ... */ },
      nodes: [{ id: '1', type: 'trigger', /* ... */ }],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    };

    const json = JSON.stringify(strategy);
    expect(json).toBeDefined();
    expect(json).toContain('"nodes"');
  });

  it('imports strategy from JSON', async () => {
    const json = JSON.stringify({ /* ... */ });
    const blob = new Blob([json], { type: 'application/json' });
    const file = new File([blob], 'strategy.json');

    const strategy = await importStrategyJSON(file);
    expect(strategy.metadata).toBeDefined();
    expect(strategy.nodes).toHaveLength(3);
  });

  it('validates JSON schema', () => {
    const invalidJSON = { metadata: {} };  // Missing required fields
    const validate = () => validateStrategyJSON(invalidJSON);

    expect(validate).toThrow();
  });

  it('detects unknown node types', () => {
    const invalidNode = {
      type: 'unknown_type',
      /* ... */
    };

    const strategy = {
      metadata: { /* ... */ },
      nodes: [invalidNode],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    };

    const result = validateStrategyJSON(strategy);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('unknown_type');
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 (Zustand store)
- ✅ Story 3.10: 전략 저장/로드 (Strategy 타입 정의)

**후속 Stories (이 Story의 export/import 활용):**
- Story 3.12: 전략 이름/설명 수정 (JSON export에 포함)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ 从epics.md中提取了Story 3-11的完整AC (5개 AC)
2. ✅ 分析了Story 3-10的实现模式作为参考
3. ✅ 确认了services目录存在
4. ✅ 整合了project-context.md的关键规则
5. ✅ 分析了Zustand store结构
6. ✅ 整合了architecture.md的架构决策

**实施计划:**
- Task 1: strategyIO 서비스 구현
- Task 2: JSON 스키마 정의 (Zod)
- Task 3: Export UI 구현
- Task 4: Import UI 구현
- Task 5: 유효성 검증 및 에러 처리
- Task 6: React Flow 상태 복원
- Task 7: 다양한 전략 테스트

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-11-strategy-export-import.md` - This story file

**Frontend Files to Create (4 files)**
- `gr8-frontend/src/services/strategyIO.ts` - ✅ 새로 생성 (export/import)
- `gr8-frontend/src/schemas/strategySchema.ts` - ✅ 새로 생성 (Zod 스키마)
- `gr8-frontend/src/utils/fileUtils.ts` - ✅ 새로 생성 (파일명 생성)
- `gr8-frontend/src/components/editor/ConfirmOverwriteModal.tsx` - ✅ 새로 생성 (덮어쓰기 확인)

**Files to Modify (1 file)**
- `gr8-frontend/src/components/editor/StrategyEditor.tsx` - ✅ 수정 (export/import 버튼 추가)

**Dependencies to Install:**
- `zod` - JSON 스키마 검증 (npm install zod)

**Test Files:**
- `gr8-frontend/src/services/strategyIO.test.ts` - ✅ 새로 생성

**Total:** 4-5 files to create, 1 file to modify, 1 dependency to install

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-28 - Story 3-11 Created**
- Created comprehensive story file for Strategy JSON Export/Import
- Extracted all AC from epics.md (5 ACs)
- Defined Blob/FileReader API implementation
- Designed Zod schema validation
- Prepared error handling for unknown node types
- Added keyboard shortcuts (Ctrl+E, Ctrl+I)
- Designed file download/upload UI
