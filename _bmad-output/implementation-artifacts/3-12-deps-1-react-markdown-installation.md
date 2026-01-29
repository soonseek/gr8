# Story 3-12-deps-1: React-Markdown 라이브러리 설치

**Type**: Gap-Filler Story (Story 3-12 선행 조건)
**Status**: ready-for-dev

---

## Story

**As a** 개발자 (Developer),
**I want** React-Markdown 라이브러리를 설치하고 싶다,
**so that** Story 3-12에서 전략 설명의 마크다운 미리보기를 구현할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3-12 (전략 이름 및 설명 수정) 개발 예정 ✅
- Story 3-12 AC 3: 마크다운 지원 필요 (**볼드**, *이탤릭*, - 리스트) ✅
- Story 3-12 AC 3: 마크다운 미리보기 구현 필요 ✅
- Story 3-12 Task 3: react-markdown 사용 명시 ✅

**문제:**
- React-Markdown 라이브러리가 현재 npm packages에 설치되지 않음 ❌
- `npm list react-markdown` → "react-markdown not installed"
- React-Markdown이 없으면 마크다운 렌더링 구현 불가

**해결:**
React-Markdown 라이브러리 설치 및 XSS 방지 라이브러리 추가

**중요:**
- **React-Markdown**: React 기반 마크다운 렌더링 라이브러리
- **remark-sanitize**: XSS 방지를 위한 HTML sanitization 플러그인
- **Story 3-12 선행 조건**: 이 Story가 완료되어야 3-12 개발 가능

---

## 수용 기준 (Acceptance Criteria)

### AC 1: React-Markdown 라이브러리 설치 완료

**Given** 개발자가 프로젝트 루트에 있다
**When** `npm install react-markdown`를 실행한다
**Then** React-Markdown이 node_modules에 설치된다
**And** package.json에 react-markdown 의존성이 추가된다
**And** 설치 버전이 출력된다

### AC 2: remark-sanitize 라이브러리 설치 완료

**Given** React-Markdown이 설치되었다
**When** `npm install remark-sanitize`를 실행한다
**Then** remark-sanitize가 node_modules에 설치된다
**And** package.json에 remark-sanitize 의존성이 추가된다

### AC 3: 설치 검증

**Given** React-Markdown과 remark-sanitize가 설치되었다
**When** `npm list react-markdown`를 실행한다
**Then** React-Markdown 버전이 표시된다 (예: `react-markdown@9.x.x`)
**And** `npm list remark-sanitize`를 실행한다
**Then** remark-sanitize 버전이 표시된다 (예: `remark-sanitize@6.x.x`)

### AC 4: TypeScript 타입 정의 확인

**Given** React-Markdown이 설치되었다
**When** TypeScript 컴파일을 실행한다
**And** `import ReactMarkdown from 'react-markdown'` 코드를 작성한다
**Then** 타입 추론이 정상 작동한다
**And** 컴파일 에러가 없다

### AC 5: 간단한 마크다운 렌더링 테스트

**Given** React-Markdown이 설치되었다
**When** 간단한 마크다운 렌더링 테스트를 작성한다
**Then** 마크다운이 정상적으로 HTML로 렌더링된다
**And** XSS 공격이 방지된다 (script 태그 등 필터링)

---

## Tasks / Subtasks

### Task 1: React-Markdown 라이브러리 설치 (AC: #1, #3)
- [ ] Subtask 1.1: 프로젝트 루트로 이동
  ```bash
  cd gr8-frontend
  ```
- [ ] Subtask 1.2: React-Markdown 설치 명령 실행
  ```bash
  npm install react-markdown
  ```
- [ ] Subtask 1.3: 설치 완료 메시지 확인
  - "added X packages" 메시지 확인
- [ ] Subtask 1.4: package.json 업데이트 확인
  - `"react-markdown": "^9.x.x"` 추가 확인

### Task 2: remark-sanitize 라이브러리 설치 (AC: #2, #3)
- [ ] Subtask 2.1: remark-sanitize 설치 명령 실행
  ```bash
  npm install remark-sanitize
  ```
- [ ] Subtask 2.2: 설치 완료 메시지 확인
- [ ] Subtask 2.3: package.json 업데이트 확인
  - `"remark-sanitize": "^6.x.x"` 추가 확인

### Task 3: 설치 검증 (AC: #3, #4)
- [ ] Subtask 3.1: npm list 명령 실행
  ```bash
  npm list react-markdown
  npm list remark-sanitize
  ```
- [ ] Subtask 3.2: 버전 확인
  - 출력: `react-markdown@9.x.x` 확인
  - 출력: `remark-sanitize@6.x.x` 확인
  - NOT "not installed"
- [ ] Subtask 3.3: node_modules 디렉토리 확인
  ```bash
  ls node_modules/react-markdown
  ls node_modules/remark-sanitize
  ```
- [ ] Subtask 3.4: TypeScript 컴파일 테스트
  ```bash
  npm run build
  ```
- [ ] Subtask 3.5: package-lock.json 업데이트 확인

### Task 4: 간단한 마크다운 렌더링 테스트 (AC: #5)
- [ ] Subtask 4.1: 테스트 컴포넌트 생성 (src/components/__tests__/MarkdownTest.tsx)
  ```tsx
  import ReactMarkdown from 'react-markdown';
  import remarkSanitize from 'remark-sanitize';

  export function MarkdownTest() {
    const markdown = `
  # 테스트 제목

  **볼드 텍스트**와 *이탤릭 텍스트*입니다.

  - 리스트 항목 1
  - 리스트 항목 2

  [링크](https://example.com)
  `;

    return (
      <div className="p-4">
        <ReactMarkdown remarkPlugins={[remarkSanitize]}>
          {markdown}
        </ReactMarkdown>
      </div>
    );
  }
  ```
- [ ] Subtask 4.2: 테스트 컴포넌트를 App.tsx에 임시 추가
- [ ] Subtask 4.3: 개발 서버 시작
  ```bash
  npm run dev
  ```
- [ ] Subtask 4.4: 브라우저에서 마크다운 렌더링 확인
  - 제목, 볼드, 이탤릭, 리스트 정상 렌더링
- [ ] Subtask 4.5: XSS 방지 테스트
  ```tsx
  const maliciousMarkdown = `
  <script>alert('XSS')</script>
  <img src="x" onerror="alert('XSS')">
  **정상 텍스트**
  `;

  <ReactMarkdown remarkPlugins={[remarkSanitize]}>
    {maliciousMarkdown}
  </ReactMarkdown>
  ```
  - script 태그 제거됨
  - onerror 속성 제거됨
  - "정상 텍스트"만 렌더링됨
- [ ] Subtask 4.6: 테스트 컴포넌트 삭제 (선택사항)

---

## Dev Notes

### 🎯 목표

이 Gap-Filler Story는 **React-Markdown 라이브러리 설치**를 통해 Story 3-12의 마크다운 지원 기능을 가능하게 합니다. 완료되면:
- React-Markdown이 npm packages에 설치됨
- Story 3-12에서 `import ReactMarkdown from 'react-markdown'` 사용 가능
- remark-sanitize로 XSS 방지 가능
- 전략 설명의 마크다운 미리보기 구현 가능

### 📚 React-Markdown이란 무엇인가?

**React-Markdown**:
- React 기반 마크다운 렌더링 라이브러리
- 타입스크립트 지원 (풍부한 타입 정의)
- 플러그인 생태계 (remark, rehype)
- 커스터마이징 가능 (컴포넌트 오버라이드)
- 보안: remark-sanitize 플러그인으로 XSS 방지

**왜 React-Markdown인가?**
- React와 완벽한 통합
- TypeScript 퍼스트 클래스 지원
- 플러그인으로 확장 가능
- 커뮤니티가 활발함
- Story 3-12에서 React-Markdown 사용 명시됨

### 🏗️ React-Markdown 설치 방법

**npm:**
```bash
npm install react-markdown
npm install remark-sanitize
```

**yarn:**
```bash
yarn add react-markdown
yarn add remark-sanitize
```

**pnpm:**
```bash
pnpm add react-markdown
pnpm add remark-sanitize
```

**버전 확인:**
```bash
npm list react-markdown
# react-markdown@9.x.x

npm list remark-sanitize
# remark-sanitize@6.x.x
```

### 📐 React-Markdown 기본 사용법

**기본 렌더링:**
```tsx
import ReactMarkdown from 'react-markdown';

const markdown = `
# 제목

**볼드**와 *이탤릭*

- 리스트 항목 1
- 리스트 항목 2
`;

function App() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
```

**XSS 방지 (remark-sanitize):**
```tsx
import ReactMarkdown from 'react-markdown';
import remarkSanitize from 'remark-sanitize';

function App() {
  return (
    <ReactMarkdown remarkPlugins={[remarkSanitize]}>
      {markdown}
    </ReactMarkdown>
  );
}
```

**커스텀 스타일링:**
```tsx
import ReactMarkdown from 'react-markdown';
import remarkSanitize from 'remark-sanitize';

function App() {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkSanitize]}
      className="prose prose-invert max-w-none"
      components={{
        // 커스텀 컴포넌트 오버라이드
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold" {...props} />,
        p: ({ node, ...props }) => <p className="my-4" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 underline" {...props} />,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
```

### 🎨 Story 3-12에서의 활용

**StrategyDescriptionModal 컴포넌트:**
```tsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkSanitize from 'remark-sanitize';
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
        <h2 className="text-xl font-bold mb-4">전략 설명</h2>

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
          <div className="w-full h-64 p-4 bg-gray-700 rounded border border-gray-600 overflow-auto prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkSanitize]}>
              {value || '*설명 없음*'}
            </ReactMarkdown>
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

### ⚠️ 중요 고려사항

**1. TypeScript 버전 호환성:**
- React-Markdown 9.x는 TypeScript 4.5+ 필요
- 프로젝트 TypeScript 버전 확인: 5.9.3 ✅ (package.json line 59)
- 호환성 문제 없음

**2. 파일 크기:**
- React-Markdown은 압축 시 ~20KB (가벭움)
- remark-sanitize는 압축 시 ~5KB (매우 가벭움)
- Tree-shaking 지원 (사용하는 기능만 번들링)
- 성능 영향 최소화

**3. XSS 방지:**
- remark-sanitize 필수 사용
- 또는 DOMPurify로 대체 가능
- 사용자 입력 마크다운은 항상 sanitize

**4. 커스터마이징:**
- Tailwind CSS prose 클래스 사용 권장
- 또는 커스텀 스타일링 (components prop)
- 다크 모드 지원 (prose-invert)

**5. 성능 최적화:**
- 긴 텍스트는 memo로 감싸기
- 입력 변경 시 debounce 적용
- 미리보기는 요청 시만 렌더링

### 🧪 테스트 전략

**설치 검증 테스트:**
```bash
# 1. 설치 확인
npm list react-markdown
npm list remark-sanitize

# 2. 컴파일 테스트
npm run build

# 3. 간단한 렌더링 테스트
npx tsx -e "
import ReactMarkdown from 'react-markdown';
import remarkSanitize from 'remark-sanitize';

const md = '**Test**';
console.log('✅ React-Markdown works!');
"
```

**XSS 방지 테스트:**
```tsx
const malicious = `
<script>alert('XSS')</script>
<img src="x" onerror="alert('XSS')">
<a href="javascript:alert('XSS')">Click</a>
**Safe text**
`;

<ReactMarkdown remarkPlugins={[remarkSanitize]}>
  {malicious}
</ReactMarkdown>
// Output: <p>Safe text</p> (script, onerror, javascript: 제거됨)
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- None (선행 조건 없음)

**후속 Stories (이 Story의 완료가 필요한 Story):**
- ✅ **Story 3-12: 전략 이름 및 설명 수정** (check → in-progress 가능)
  - AC 3: 마크다운 지원
  - AC 3: 마크다운 미리보기
  - Task 3: StrategyDescriptionModal 구현

**진행 순서:**
```
3-12-deps-1 (이 Story) 완료
    ↓
3-12 개발 시작 가능 (in-progress)
```

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.5

### Debug Log References
None

### Completion Notes List
Story尚未开始实施。准备工作已完成。

**完成准备工作:**
1. ✅ Pre-Implementation Check Report (3-12) 확인
2. ✅ React-Markdown 미설치 상태 확인 (`npm list react-markdown` → "react-markdown not installed")
3. ✅ Story 3-12에서 React-Markdown 필요성 확인
4. ✅ 설치 방법 및 테스트 방법 정의
5. ✅ XSS 방지 전략 수립 (remark-sanitize)

**实施计划:**
- Task 1: React-Markdown 라이브러리 설치
- Task 2: remark-sanitize 라이브러리 설치
- Task 3: 설치 검증
- Task 4: 간단한 마크다운 렌더링 테스트

### File List

**Files to Modify (1 file)**
- `gr8-frontend/package.json` - ✅ 수정 (react-markdown, remark-sanitize 의존성 추가)

**Dependencies to Install:**
- `react-markdown` - React 기반 마크다운 렌더링 라이브러리 (npm install react-markdown)
- `remark-sanitize` - XSS 방지 플러그인 (npm install remark-sanitize)

**Test Files (Optional)**
- `gr8-frontend/src/components/__tests__/MarkdownTest.tsx` - ✅ 새로 생성 (테스트용)

**Total:** 1 file to modify, 2 dependencies to install

**TypeScript Compilation:** 설치 후 확인 필요

### Change Log

**2026-01-29 - Story 3-12-deps-1 Created**
- Created gap-filler story for React-Markdown library installation
- Identified gap during Story 3-12 pre-implementation check
- Defined installation and verification tasks
- Prepared XSS prevention strategy (remark-sanitize)
- Added React-Markdown usage examples for Story 3-12
