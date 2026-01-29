# Story 3.12: 전략 이름 및 설명 수정

Status: ready-for-dev

---

## Story

**As a** 사용자 (User),
**I want** 전략의 이름과 설명을 수정하고 싶다,
**so that** 전략을 쉽게 식별하고 문서화할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3.1에서 React Flow 에디터 기본 구조 완료 ✅
- Story 3.10에서 전략 저장/로드 (localStorage) 기능 구현 예정 ✅
- Story 3.11에서 JSON export/import 기능 구현 예정 ✅
- Strategy 타입과 metadata 구조 정의될 예정 ✅
- @xyflow/react v12.10.0, Zustand store 설치됨 ✅

**문제:**
- 전략에 이름이 없어 식별 어려움
- 전략에 설명이 없어 목적 불분명
- 여러 전략 관리 시 혼란 발생
- JSON export 시 메타데이터 부족

**해결:**
전략 이름 및 설명 수정 UI 구현

**중요:**
- **인라인 이름 편집**: 클릭 시 즉시 편집 모드
- **설명 모달**: "설명 추가" 버튼으로 텍스트 영역 모달 열기
- **마크다운 지원**: 볼드, 이탤릭, 리스트
- **실시간 저장**: Enter 또는 외부 클릭 시 자동 저장
- **메타데이터 동기화**: localStorage + JSON export + 전략 로드
- **FR17 충족**: 전략의 이름이 수정됨

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 전략 메타데이터 UI 구현

**Given** 노드 에디터가 구현되었다
**When** 개발자가 전략 메타데이터 UI를 추가한다
**Then** 상단 툴바에 전략 이름 표시가 있다
**And** 이름 옆에 연필 아이콘 (✏️)이 있다
**And** 이름을 클릭하면 편집 모드가 된다
**And** "설명 추가" 버튼이 제공된다

### AC 2: 전략 이름 인라인 편집

**Given** 전략 메타데이터 UI가 생성되었다
**When** 사용자가 전략 이름을 클릭한다
**Then** 인라인 편집이 활성화된다
**And** 사용자가 이름을 수정할 수 있다 (최대 50자)
**And** Enter 또는 클릭 외부 시 수정이 저장된다
**And** ESC 시 편집 취소
**And** **FR17: 전략의 이름이 수정된다**

### AC 3: 전략 설명 입력 모달

**Given** 사용자가 "설명 추가" 버튼을 클릭한다
**When** 전략 설명 입력 모달이 표시된다
**Then** 텍스트 영역이 제공된다 (최대 500자)
**And** 마크다운이 지원된다 (볼드 **text**, 이탤릭 *text*, 리스트 - item)
**And** 마크다운 미리보기가 표시된다
**And** 문자 수 카운터가 표시된다 (0/500)
**And** "저장"과 "취소" 버튼이 제공된다

### AC 4: 전략 설명 저장 및 표시

**Given** 전략 설명이 추가되었다
**When** 설명이 저장된다
**Then** 전략 메타데이터가 업데이트된다
**And** JSON export에 설명이 포함된다
**And** 전략 목록에 설명 미리보기가 표시된다 (최대 100자, 말줄임표)
**And** 미리보기 클릭 시 전체 설명 모달 열기

### AC 5: 전략 저장/로드/Export 연동

**Given** 전략 이름 및 설명이 설정되었다
**When** 사용자가 전략을 저장한다 (localStorage)
**Then** 이름과 설명이 전략 메타데이터에 포함된다
**And** localStorage에 저장된다
**And** JSON export에 포함된다
**And** 전략을 로드할 때 복원된다

---

## Tasks / Subtasks

### Task 1: 전략 메타데이터 타입 정의 (AC: #5)
- [ ] Subtask 1.1: `src/types/strategy.ts` 파일 생성 (또는 확장)
  ```typescript
  export interface StrategyMetadata {
    id: string;              // UUID
    name: string;            // 전략 이름 (1-50자)
    description?: string;    // 전략 설명 (최대 500자)
    createdAt: string;       // "2026-01-29T12:00:00.000Z"
    updatedAt: string;       // "2026-01-29T12:30:00.000Z"
    nodeCount: number;       // 노드 수
    edgeCount: number;       // 엣지 수
  }
  ```
- [ ] Subtask 1.2: Zustand store에 metadata 상태 추가
  ```typescript
  interface EditorState {
    metadata: StrategyMetadata;
    setMetadata: (metadata: StrategyMetadata) => void;
    updateMetadata: (updates: Partial<StrategyMetadata>) => void;
  }
  ```
- [ ] Subtask 1.3: 초기 메타데이터 생성 로직
  - 자동 생성 UUID
  - 기본 이름: "무제 전략"
  - createdAt/updatedAt 자동 설정

### Task 2: 전략 이름 인라인 편집 컴포넌트 (AC: #1, #2)
- [ ] Subtask 2.1: `StrategyNameEditor.tsx` 컴포넌트 생성
  ```tsx
  interface StrategyNameEditorProps {
    name: string;
    onUpdate: (name: string) => void;
  }

  export function StrategyNameEditor({ name, onUpdate }: StrategyNameEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(name);
    // ... 인라인 편집 로직
  }
  ```
- [ ] Subtask 2.2: 편집 모드 토글 구현
  - 클릭 시 인라인 입력 필드 표시
  - 연필 아이콘 표시 (lucide-react: Pencil)
- [ ] Subtask 2.3: 입력 유효성 검증
  - 최대 50자 제한
  - 빈 문자열 방지 (최소 1자)
  - 특수 문자 제거 (선택사항)
- [ ] Subtask 2.4: 저장/취소 이벤트 처리
  - Enter: 저장
  - ESC: 취소
  - 외부 클릭: 저장 (onBlur)
- [ ] Subtask 2.5: Zustand store 연동
  ```typescript
  const updateMetadata = useEditorStore((state) => state.updateMetadata);
  updateMetadata({ name: newName, updatedAt: new Date().toISOString() });
  ```

### Task 3: 전략 설명 모달 컴포넌트 (AC: #3, #4)
- [ ] Subtask 3.1: `StrategyDescriptionModal.tsx` 컴포넌트 생성
  ```tsx
  interface StrategyDescriptionModalProps {
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (description: string) => void;
  }
  ```
- [ ] Subtask 3.2: 텍스트 영역 구현
  - 최대 500자 제한
  - 문자 수 카운터 (0/500)
  - 자동 높이 조정 (resize: vertical)
- [ ] Subtask 3.3: 마크다운 지원 구현
  - 라이브러리: `react-markdown` 또는 `marked`
  - 지원 문법: **bold**, *italic*, - list
  - XSS 방지: sanitize 필수
- [ ] Subtask 3.4: 마크다운 미리보기 구현
  - 실시간 미리보기 (입력 시 즉시 반영)
  - 또는 탭 전환 (입력/미리보기)
- [ ] Subtask 3.5: 저장/취소 버튼 구현
  - 저장: 메타데이터 업데이트, 모달 닫기
  - 취소: 변경 사항 무시, 모달 닫기
- [ ] Subtask 3.6: Zustand store 연동
  ```typescript
  updateMetadata({ description: newDescription, updatedAt: new Date().toISOString() });
  ```

### Task 4: 전략 툴바 UI 통합 (AC: #1)
- [ ] Subtask 4.1: StrategyEditor 상단 툴바에 메타데이터 섹션 추가
  ```tsx
  <div className="flex items-center gap-4 p-4 bg-gray-800 border-b">
    <StrategyNameEditor name={metadata.name} onUpdate={handleNameUpdate} />
    <button onClick={openDescriptionModal}>
      <FileText /> 설명 추가
    </button>
  </div>
  ```
- [ ] Subtask 4.2: "설명 추가" 버튼 스타일링
  - 기본 상태: "설명 추가" (회색 아이콘)
  - 설명 있음: "설명 편집" (파란색 아이콘)
  - 아이콘: lucide-react FileText
- [ ] Subtask 4.3: 반응형 디자인
  - 모바일: 이름만 표시, 설명 버튼 숨김
  - 태블릿: 이름 + 설명 버튼
  - 데스크톱: 이름 + 설명 버튼 + 메타데이터 정보

### Task 5: localStorage 저장 연동 (AC: #5)
- [ ] Subtask 5.1: strategyStorage.ts에 metadata 포함 로직 확인
  ```typescript
  // Story 3.10에서 이미 구현되어야 함
  function saveStrategy(metadata: StrategyMetadata, nodes: Node[], edges: Edge[], viewport: Viewport) {
    const strategy = { metadata, nodes, edges, viewport };
    localStorage.setItem(key, JSON.stringify(strategy));
  }
  ```
- [ ] Subtask 5.2: 저장 시 metadata 자동 포함 확인
  - 이름 변경 시 자동 저장 (debounce 1초)
  - 설명 변경 시 자동 저장
- [ ] Subtask 5.3: 로드 시 metadata 복원 확인
  ```typescript
  const { metadata, nodes, edges, viewport } = loadStrategy(id);
  setMetadata(metadata);
  ```

### Task 6: JSON export 연동 (AC: #4, #5)
- [ ] Subtask 6.1: strategyIO.ts에 metadata 포함 로직 확인
  ```typescript
  // Story 3.11에서 이미 구현되어야 함
  function exportStrategyJSON(strategy: Strategy) {
    // strategy.metadata.name, strategy.metadata.description 포함
    const json = JSON.stringify(strategy, null, 2);
    // ... 다운로드 로직
  }
  ```
- [ ] Subtask 6.2: JSON export 시 name/description 포함 확인
- [ ] Subtask 6.3: JSON import 시 metadata 복원 확인
- [ ] Subtask 6.4: 설명 미리보기 (전략 목록용)
  ```typescript
  function getPreviewDescription(description?: string): string {
    if (!description) return '';
    return description.length > 100
      ? description.substring(0, 100) + '...'
      : description;
  }
  ```

### Task 7: 전략 목록에 메타데이터 표시 (AC: #4)
- [ ] Subtask 7.1: LoadStrategyModal에 전략 카드 UI 업데이트
  ```tsx
  <div className="strategy-card">
    <h3>{strategy.metadata.name}</h3>
    <p className="text-sm text-gray-400">
      {getPreviewDescription(strategy.metadata.description)}
    </p>
    <div className="text-xs text-gray-500">
      {strategy.metadata.nodeCount} nodes • {formatDate(strategy.metadata.updatedAt)}
    </div>
  </div>
  ```
- [ ] Subtask 7.2: 설명 미리보기 클릭 시 전체 설명 모달 열기
- [ ] Subtask 7.3: 설명 없는 전략 처리
  - "설명 없음" 표시
  - 또는 빈 공간

### Task 8: 단위 테스트 작성 (Vitest)
- [ ] Subtask 8.1: StrategyNameEditor 테스트
  - 클릭 시 편집 모드 활성화
  - Enter 시 저장
  - ESC 시 취소
  - 최대 50자 제한
- [ ] Subtask 8.2: StrategyDescriptionModal 테스트
  - 500자 제한
  - 마크다운 렌더링
  - 저장/취소 버튼
- [ ] Subtask 8.3: metadata 업데이트 테스트
  - Zustand store 상태 변경
  - localStorage 저장 확인
  - JSON export 포함 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **전략 이름 및 설명 수정 UI**를 구현하여 사용자가 전략을 쉽게 식별하고 문서화할 수 있게 합니다. 완료되면:
- 상단 툴바에서 전략 이름 즉시 편집 가능
- "설명 추가" 버튼으로 전략 설명 입력 가능
- 마크다운 지원 (볼드, 이탤릭, 리스트)
- localStorage 및 JSON export에 메타데이터 자동 포함
- FR17 충족: 전략의 이름 수정 가능

### 📚 Story 3.10, 3.11과의 연계

**Story 3.10 (localStorage 저장/로드):**
- metadata.name, metadata.description 포함
- 저장/로드 시 자동 동기화

**Story 3.11 (JSON export/import):**
- JSON 파일에 name/description 포함
- import 시 metadata 복원

**데이터 구조 공유:**
```typescript
interface Strategy {
  metadata: {
    id: string;
    name: string;            // Story 3.12에서 편집
    description?: string;    // Story 3.12에서 편집
    createdAt: string;
    updatedAt: string;
    nodeCount: number;
    edgeCount: number;
  };
  nodes: Node[];
  edges: Edge[];
  viewport: { x, y, zoom };
}
```

### 🏗️ 인라인 편집 구현

**StrategyNameEditor 컴포넌트:**
```tsx
import { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';

export function StrategyNameEditor() {
  const metadata = useEditorStore((state) => state.metadata);
  const updateMetadata = useEditorStore((state) => state.updateMetadata);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(metadata.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== metadata.name) {
      updateMetadata({
        name: trimmed,
        updatedAt: new Date().toISOString(),
      });
    } else {
      setValue(metadata.name); // Reset
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(metadata.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 50))}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="px-2 py-1 bg-gray-700 border border-blue-500 rounded"
        maxLength={50}
      />
    );
  }

  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:text-blue-400"
      onClick={() => setIsEditing(true)}
    >
      <h1 className="text-xl font-bold">{metadata.name}</h1>
      <Pencil size={16} />
    </div>
  );
}
```

### 🏗️ 설명 모달 구현

**StrategyDescriptionModal 컴포넌트:**
```tsx
import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEditorStore } from '@/stores/editorStore';

export function StrategyDescriptionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const metadata = useEditorStore((state) => state.metadata);
  const updateMetadata = useEditorStore((state) => state.updateMetadata);
  const [value, setValue] = useState(metadata.description || '');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    updateMetadata({
      description: value.trim(),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText /> 전략 설명
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* 탭 전환 */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${!showPreview ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setShowPreview(false)}
          >
            입력
          </button>
          <button
            className={`px-4 py-2 rounded ${showPreview ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setShowPreview(true)}
          >
            미리보기
          </button>
        </div>

        {/* 입력 또는 미리보기 */}
        {!showPreview ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, 500))}
            className="w-full h-64 p-4 bg-gray-700 rounded border border-gray-600"
            placeholder="전략 설명을 입력하세요...&#10;&#10;마크다운 지원:&#10;- **볼드**: **텍스트**&#10;- *이탤릭*: *텍스트*&#10;- 리스트: - 항목"
          />
        ) : (
          <div className="w-full h-64 p-4 bg-gray-700 rounded border border-gray-600 overflow-auto">
            <ReactMarkdown>{value || '*설명 없음*'}</ReactMarkdown>
          </div>
        )}

        {/* 문자 수 카운터 */}
        <div className="text-right text-sm text-gray-400 mt-2">
          {value.length}/500
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 📐 Zustand Store 확장

**editorStore.ts에 metadata 추가:**
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { StrategyMetadata } from '@/types/strategy';

interface EditorState {
  // 기존 상태
  nodes: BaseNode[];
  edges: Edge[];
  viewport: Viewport;

  // 메타데이터 상태 (Story 3.12)
  metadata: StrategyMetadata;

  // 기존 액션
  setNodes: (nodes: BaseNode[]) => void;
  setEdges: (edges: Edge[]) => void;

  // 메타데이터 액션 (Story 3.12)
  setMetadata: (metadata: StrategyMetadata) => void;
  updateMetadata: (updates: Partial<StrategyMetadata>) => void;
}

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    // 초기 상태
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },

    // 메타데이터 초기값
    metadata: {
      id: crypto.randomUUID(),
      name: '무제 전략',
      description: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: 0,
      edgeCount: 0,
    },

    // 메타데이터 액션
    setMetadata: (metadata) =>
      set((state) => {
        state.metadata = metadata;
      }),

    updateMetadata: (updates) =>
      set((state) => {
        Object.assign(state.metadata, updates);
      }),
  }))
);
```

### 📐 파일 구조

**Story 3.12에서 생성할 파일:**
```
src/
├── types/
│   └── strategy.ts                    # ✅ 생성 또는 확장 (StrategyMetadata)
├── components/
│   └── editor/
│       ├── StrategyNameEditor.tsx     # ✅ 새로 생성 (인라인 이름 편집)
│       └── StrategyDescriptionModal.tsx # ✅ 새로 생성 (설명 모달)
└── stores/
    └── editorStore.ts                 # ✅ 수정 (metadata 상태 추가)
```

### 🎨 UI/UX 디자인 가이드

**상단 툴바:**
```
┌─────────────────────────────────────────────────────────┐
│ [무제 전략 ✏️] [📄 설명 추가] [저장] [불러오기] [내보내기] │
└─────────────────────────────────────────────────────────┘
```

**인라인 편집 모드:**
```
┌─────────────────────────────────────────────────────────┐
│ [RSI 매매 전략________] ✅ (Enter: 저장, ESC: 취소)      │
└─────────────────────────────────────────────────────────┘
```

**설명 모달:**
```
┌──────────────────────────────────────────────┐
│ 📄 전략 설명                     [✕]         │
├──────────────────────────────────────────────┤
│ [입력] [미리보기]                            │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ 이 전략은 RSI 지표를 활용한 매매 전략... │  │
│ │                                        │  │
│ │ - **매수**: RSI < 30                    │  │
│ │ - **매도**: RSI > 70                    │  │
│ │                                        │  │
│ │ *참고: 1시간 봉 사용*                   │  │
│ └────────────────────────────────────────┘  │
│                                              │
│                                   145/500     │
│                              [취소] [저장]   │
└──────────────────────────────────────────────┘
```

**전략 목록 (LoadStrategyModal):**
```
┌──────────────────────────────────────────────┐
│ 📂 불러올 전략 선택                [✕]       │
├──────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐  │
│ │ RSI 매매 전략                           │  │
│ │ 이 전략은 RSI 지표를 활용한...         │  │
│ │ 5 nodes • 2026-01-29 12:30      [보기] │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ 순환매 DCA 전략                        │  │
│ │ 설명 없음                              │  │
│ │ 12 nodes • 2026-01-28 09:15    [보기]  │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### ⚠️ 중요 고려사항

**1. 자동 저장 vs 수동 저장:**
- 이름 변경: 즉시 저장 (debounce 1초 권장)
- 설명 변경: 모달에서 "저장" 버튼 클릭 시 저장
- localStorage용량 고려: 자동 저장 시 과도한 I/O 방지

**2. 중복 방지:**
- 같은 이름의 전략 허용 (UUID로 구분)
- 사용자 알림: "같은 이름의 전략이 있습니다"

**3. XSS 방지:**
- 마크다운 렌더링 시 sanitize 필수
- `react-markdown` + `remark-sanitize` 사용 권장
- 또는 DOMPurify로 HTML sanitization

**4. 성능 최적화:**
- 인라인 편집: useState 로컬 상태 사용
- 저장 시에만 Zustand store 업데이트
- 마크다운 미리보기: debounce 적용

**5. 접근성:**
- 키보드 네비게이션 지원 (Tab, Enter, ESC)
- 화면 리더기 지원 (aria-label)
- 포커스 관리 (모달 열릴 때 입력 필드에 포커스)

### 💡 마크다운 라이브러리

**react-markdown 설치:**
```bash
npm install react-markdown
npm install remark-sanitize  # XSS 방지
```

**사용 예시:**
```tsx
import ReactMarkdown from 'react-markdown';
import remarkSanitize from 'remark-sanitize';

<ReactMarkdown
  remarkPlugins={[remarkSanitize]}
  className="prose prose-invert max-w-none"
>
  {description}
</ReactMarkdown>
```

**또는 DOMPurify:**
```tsx
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const sanitized = DOMPurify.sanitize(marked(description));
<div dangerouslySetInnerHTML={{ __html: sanitized }} />
```

### 🧪 테스트 전략

**단위 테스트 (Vitest):**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StrategyNameEditor } from '../StrategyNameEditor';

describe('StrategyNameEditor', () => {
  it('renders name and pencil icon', () => {
    render(<StrategyNameEditor name="Test Strategy" onUpdate={() => {}} />);
    expect(screen.getByText('Test Strategy')).toBeInTheDocument();
  });

  it('enters edit mode on click', () => {
    render(<StrategyNameEditor name="Test Strategy" onUpdate={() => {}} />);
    fireEvent.click(screen.getByText('Test Strategy'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('saves on Enter key', () => {
    const onUpdate = vi.fn();
    render(<StrategyNameEditor name="Test Strategy" onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText('Test Strategy'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onUpdate).toHaveBeenCalledWith('New Name');
  });

  it('cancels on Escape key', () => {
    const onUpdate = vi.fn();
    render(<StrategyNameEditor name="Test Strategy" onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText('Test Strategy'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('limits to 50 characters', () => {
    render(<StrategyNameEditor name="Test" onUpdate={() => {}} />);
    fireEvent.click(screen.getByText('Test'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a'.repeat(100) } });
    expect((input as HTMLInputElement).value).toHaveLength(50);
  });
});
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 3.1: React Flow 기본 에디터 (Zustand store)
- ✅ Story 3.10: 전략 저장/로드 (Strategy 타입, localStorage)
- ✅ Story 3.11: JSON export/import (metadata 포함)

**후속 Stories (이 Story의 metadata 활용):**
- Story 3.13: 전략 버전 관리 (metadata.name으로 식별)
- Story 5.4: 전략 마켓플레이스 게시 (metadata.description 표시)

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ epics.md에서 Story 3-12 AC 추출 (5개 AC)
2. ✅ Story 3.10, 3.11과의 연계 분석
3. ✅ 인라인 편집 UI 패턴 정의
4. ✅ 마크다운 지원 방안 정의
5. ✅ Zustand store 확장 계획 수립

**实施计划:**
- Task 1: 전략 메타데이터 타입 정의
- Task 2: 전략 이름 인라인 편집 컴포넌트
- Task 3: 전략 설명 모달 컴포넌트
- Task 4: 전략 툴바 UI 통합
- Task 5: localStorage 저장 연동
- Task 6: JSON export 연동
- Task 7: 전략 목록에 메타데이터 표시
- Task 8: 단위 테스트 작성

### File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/3-12-strategy-name-description.md` - This story file

**Frontend Files to Create (2 files)**
- `gr8-frontend/src/components/editor/StrategyNameEditor.tsx` - ✅ 새로 생성 (인라인 이름 편집)
- `gr8-frontend/src/components/editor/StrategyDescriptionModal.tsx` - ✅ 새로 생성 (설명 모달)

**Files to Modify (2 files)**
- `gr8-frontend/src/types/strategy.ts` - ✅ 생성 또는 확장 (StrategyMetadata 인터페이스)
- `gr8-frontend/src/stores/editorStore.ts` - ✅ 수정 (metadata 상태 추가)

**Dependencies to Install:**
- `react-markdown` - 마크다운 렌더링 (npm install react-markdown)
- `remark-sanitize` - XSS 방지 (npm install remark-sanitize)

**Test Files:**
- `gr8-frontend/src/components/editor/__tests__/StrategyNameEditor.test.tsx` - ✅ 새로 생성
- `gr8-frontend/src/components/editor/__tests__/StrategyDescriptionModal.test.tsx` - ✅ 새로 생성

**Total:** 2 files to create, 2 files to modify, 2 dependencies to install

**TypeScript Compilation:** 待验证

### Change Log

**2026-01-29 - Story 3-12 Created**
- Created comprehensive story file for Strategy Name & Description Editing
- Extracted all AC from epics.md (5 ACs)
- Designed inline editing UI pattern
- Designed markdown support for descriptions
- Defined Zustand store extension for metadata
- Added auto-save on Enter/blur logic
- Added markdown preview with sanitization
