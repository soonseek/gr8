# Story 1.1: 프론트엔드 스타터 템플릿 초기화

Status: ready-for-dev

---

## Story

**As a** 개발자 (Developer),
**I want** Vite + React + TypeScript 기반의 프론트엔드 프로젝트를 초기화하고 기본 개발 환경을 설정하고 싶다,
**so that** 빠르고 효율적으로 프론트엔드 기능을 개발할 수 있다.

---

## Acceptance Criteria

### 1. Vite 프로젝트 초기화

**Given** 개발자는 프로젝트 루트 디렉토리에 있다
**When** 개발자가 `npm create vite@latest gr8-frontend -- --template react-ts` 명령을 실행하고 의존성을 설치한다
**Then** `gr8-frontend/` 디렉토리가 생성되고 React 18+ + TypeScript 기반 프로젝트가 초기화된다
**And** `npm run dev` 실행 시 개발 서버가 `localhost:5173`에서 시작된다
**And** Hot Module Replacement (HMR)이 정상 작동한다

### 2. Tailwind CSS 설정

**Given** Vite 프로젝트가 초기화되었다
**When** 개발자가 Tailwind CSS 및 PostCSS를 설치하고 설정 파일들을 생성한다
**Then** `tailwind.config.js`와 `postcss.config.js`가 프로젝트 루트에 생성된다
**And** `src/index.css`에 Tailwind 지시자들이 추가된다
**And** 반응형 브레이크포인트가 설정된다 (sm: 375px, md: 768px, lg: 1024px, xl: 1280px)
**And** 다크모드 기본 테마가 적용된다 (bg-[#111827], text-gray-100)

### 3. 기본 디렉토리 구조

**Given** Vite + Tailwind가 설치되었다
**When** 개발자가 기본 디렉토리 구조를 생성한다
**Then** 다음 디렉토리들이 `src/` 하위에 생성된다: `components/`, `pages/`, `hooks/`, `stores/`, `services/`, `types/`
**And** 각 디렉토리에 `index.ts` 파일이 생성된다

### 4. 개발 도구 설정

**Given** 프로젝트 구조가 생성되었다
**When** 개발자가 설정 파일들을 확인한다
**Then** Vitest가 포함되어 있고 `npm run test` 실행 시 테스트 러너가 작동한다
**And** ESLint와 Prettier가 설정되어 있고 코드 포맷팅이 적용된다
**And** TypeScript 설정이 완료되어 타입 검사가 작동한다
**And** `package.json`에 dev, build, test, lint, preview 스크립트가 포함된다

### 5. 첫 번째 테스트 컴포넌트

**Given** 모든 설정이 완료되었다
**When** 개발자가 첫 번째 테스트 컴포넌트를 생성한다
**Then** `src/App.tsx`가 다크모드 스타일로 업데이트된다
**And** 기본 React Flow 프로젝트 구조가 준비된다
**And** 브라우저에서 "gr8" 타이틀과 다크 테마 배경이 확인된다

---

## Tasks / Subtasks

- [ ] **Task 1: Vite + React + TypeScript 프로젝트 초기화** (AC: #1)
  - [ ] Subtask 1.1: 프로젝트 루트에서 `npm create vite@latest gr8-frontend -- --template react-ts` 실행
  - [ ] Subtask 1.2: `cd gr8-frontend && npm install`으로 의존성 설치
  - [ ] Subtask 1.3: `npm run dev`로 개발 서버 시작 및 `localhost:5173` 접속 확인
  - [ ] Subtask 1.4: HMR 작동 확인 (파일 수정 시 브라우저 자동 새로고침)

- [ ] **Task 2: Tailwind CSS 및 PostCSS 설정** (AC: #2)
  - [ ] Subtask 2.1: `npm install -D tailwindcss postcss autoprefixer` 설치
  - [ ] Subtask 2.2: `npx tailwindcss init -p`로 설정 파일 생성
  - [ ] Subtask 2.3: `tailwind.config.js`에 content 경로 설정 (./index.html, ./src/**/*.{js,ts,jsx,tsx})
  - [ ] Subtask 2.4: 반응형 브레이크포인트 설정 (sm: 375px, md: 768px, lg: 1024px, xl: 1280px)
  - [ ] Subtask 2.5: `src/index.css`에 Tailwind 지시자 추가 (@tailwind base; @tailwind components; @tailwind utilities;)
  - [ ] Subtask 2.6: 다크모드 설정 (darkMode: 'class' 또는 'media')
  - [ ] Subtask 2.7: 기본 다크 테마 스타일 적용 (bg-[#111827], text-gray-100)

- [ ] **Task 3: 프로젝트 디렉토리 구조 생성** (AC: #3)
  - [ ] Subtask 3.1: `src/components/` 디렉토리 생성 및 `index.ts` 생성
  - [ ] Subtask 3.2: `src/pages/` 디렉토리 생성 및 `index.ts` 생성
  - [ ] Subtask 3.3: `src/hooks/` 디렉토리 생성 및 `index.ts` 생성
  - [ ] Subtask 3.4: `src/stores/` 디렉토리 생성 및 `index.ts` 생성 (Zustand 준비)
  - [ ] Subtask 3.5: `src/services/` 디렉토리 생성 및 `index.ts` 생성 (API 호출)
  - [ ] Subtask 3.6: `src/types/` 디렉토리 생성 및 `index.ts` 생성 (TypeScript 타입)

- [ ] **Task 4: 개발 도구 설정 확인** (AC: #4)
  - [ ] Subtask 4.1: Vitest 설치 확인 (`npm install -D vitest @testing-library/react @testing-library/jest-dom`)
  - [ ] Subtask 4.2: `npm run test` 실행으로 테스트 러너 작동 확인
  - [ ] Subtask 4.3: ESLint 설정 확인 (.eslintrc.cjs)
  - [ ] Subtask 4.4: Prettier 설정 확인 (.prettierrc)
  - [ ] Subtask 4.5: TypeScript strict mode 확인 (tsconfig.json의 strict: true)
  - [ ] Subtask 4.6: package.json 스크립트 확인 (dev, build, test, lint, preview)

- [ ] **Task 5: 첫 번째 테스트 컴포넌트 생성** (AC: #5)
  - [ ] Subtask 5.1: `src/App.tsx`를 다크모드 스타일로 수정
  - [ ] Subtask 5.2: Tailwind 클래스로 스타일 적용 (className="min-h-screen bg-gray-900 text-gray-100")
  - [ ] Subtask 5.3: "gr8" 타이틀과 간단한 헤딩 표시
  - [ ] Subtask 5.4: 브라우저에서 다크 테마 배경과 텍스트 확인
  - [ ] Subtask 5.5: 반응형 레이아웃 확인 (모바일/데스크톱)

---

## Dev Notes

### 🎯 목표

이 Story는 **gr8 프론트엔드 개발을 위한 기본 환경**을 구축하는 것입니다. 모든 설정이 완료되면 브라우저에서 다크 테마가 적용된 "gr8" 타이틀 화면을 확인할 수 있습니다. 이는 향후 모든 프론트엔드 기능 개발의 기반이 됩니다.

### 📚 관련 아키텍처 패턴 및 제약사항

**Technology Stack** [Source: architecture.md#Technical-Stack]:
- **React**: 18.3.1+ (Concurrent features, Suspense 지원)
- **TypeScript**: 5.7+ (strict mode 필수 - noImplicitAny, strictNullChecks)
- **Vite**: 빌드 도구 (HMR, 최적화된 production builds)
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Zustand**: 5.x (향후 상태 관리를 위해 준비)
- **Vitest**: 테스트 프레임워크

**프론트엔드 디렉토리 구조** [Source: project-context.md#File-Organization]:
```
src/
├── components/      # Reusable UI
├── pages/           # Page-level components
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores
├── services/        # API calls
├── types/           # TypeScript types
└── utils/           # Utility functions
```

**TypeScript Configuration** [Source: project-context.md#TypeScript-Rules]:
- **strict mode 필수**: noImplicitAny, strictNullChecks 활성화
- **절대 경로 import**: `@/` alias 사용 (src 경로)
- **타입 import 분리**: `import { type MyType }`로 런타임 오버헤드 방지

### 🏗️ 소스 트리 구성 요소

**생성할 파일들:**
1. `gr8-frontend/` - 전체 프론트엔드 프로젝트 루트
2. `src/components/index.ts` - 컴포넌트 바벨링
3. `src/pages/index.ts` - 페이지 바벨링
4. `src/hooks/index.ts` - 훅 바벨링
5. `src/stores/index.ts` - Zustand 스토어 바벨링
6. `src/services/index.ts` - API 서비스 바벨링
7. `src/types/index.ts` - 타입 바벨링

**수정할 파일들:**
1. `tailwind.config.js` - 반응형 브레이크포인트, 다크모드 설정
2. `postcss.config.js` - PostCSS 설정
3. `src/index.css` - Tailwind 지시자 추가
4. `src/App.tsx` - 다크모드 스타일 적용
5. `package.json` - 스크립트 확인 (dev, build, test, lint)

### 🧪 테스팅 표준 요약

**테스트 프레임워크** [Source: project-context.md#Frontend-Testing]:
- **Vitest**: Vite 네이티브 테스트 러너
- **Testing Library**: React 컴포넌트 테스트
- **Coverage Target**: 80%+ (향후 critical paths)

**테스트 구조** [Source: project-context.md#Test-Organization]:
```
tests/
├── unit/           # Component/hook tests
│   ├── components/ # UI components
│   └── hooks/      # Custom hooks
├── integration/    # API integration
└── e2e/           # Playwright tests (향후)
```

### ⚠️ 중요: 절대 하지 말아야 할 것

**❌ Common Mistakes to Avoid:**

1. **TypeScript strict mode 비활성화**: 절대 `strict: false`로 설정하지 마세요
2. **default export 사용**: named export 선호 (`export const Component = () => {...}`)
3. **any 타입 사용**: no-any 옵션 준수
4. **절대 경로 미사용**: `@/` alias 사용하여 `../../../`地狱 피하기
5. **Tailwind 설정 누락**: 반응형 브레이크포인트와 다크모드 필수 설정
6. **테스트 파일 누락**: Vitest 설치 확인 필수

### 🎨 UI/UX 가이드라인

**Dark Theme** [Source: ux-design-specification.md]:
- **Primary Background**: `#111827` (gray-900)
- **Text Color**: `#F9FAFB` (gray-50)
- **Accent Color**: 향후 정의 (현재는 기본 Tailwind 색상 사용)

**Responsive Design**:
- **Mobile First**: sm (375px) → md (768px) → lg (1024px) → xl (1280px)
- **Breakpoints**: Tailwind 기본 설정 사용

---

## Project Structure Notes

### Alignment with Unified Project Structure

**Frontend Structure** [Source: project-context.md#Frontend-Structure]:
```
gr8-frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components (향후 React Router)
│   ├── hooks/           # Custom React hooks (use prefix 필수)
│   ├── stores/          # Zustand state stores (5개 슬라이스)
│   ├── services/        # API calls (axios/fetch)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
├── tests/               # Test files
├── index.html           # Entry HTML
├── vite.config.ts       # Vite 설정
├── tsconfig.json        # TypeScript 설정
├── tailwind.config.js   # Tailwind 설정
└── package.json         # 의존성 및 스크립트
```

**Detected Conflicts or Variances**:
- 없음. 이 Story는 첫 번째 설정 Story이므로 충돌 없음.

---

## References

**Technical Stack**:
- [Source: project-context.md#Technology-Stack](../project-context.md#Technology-Stack) - React 18.3.1+, TypeScript 5.7+, Vite, Tailwind CSS
- [Source: architecture.md#Technical-Constraints](../planning-artifacts/architecture.md#Technical-Constraints) - 브라우저 지원 (Chrome 최신 2버전)

**Code Quality Standards**:
- [Source: project-context.md#TypeScript-Rules](../project-context.md#TypeScript-Rules) - strict mode, 절대 경로, named export
- [Source: project-context.md#Testing-Rules](../project-context.md#Testing-Rules) - Vitest, Testing Library, Coverage 80%+

**File Organization**:
- [Source: project-context.md#File-Organization](../project-context.md#File-Organization) - Feature-based structure guidelines

**Naming Conventions**:
- [Source: project-context.md#Naming-Conventions](../project-context.md#Naming-Conventions) - PascalCase (components), camelCase (functions)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

(첫 번째 Story이므로 이전 Debug Log 없음)

### Completion Notes List

(Story 구현 시 Dev Agent가 작성)

### File List

(Story 구현 시 Dev Agent가 작성)

---

## Additional Context for Developer

### 🔧 Tailwind CSS Configuration 예시

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 또는 'media'
  theme: {
    extend: {
      colors: {
        primary: '#111827', // gray-900
        secondary: '#1F2937', // gray-800
      },
      screens: {
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      }
    },
  },
  plugins: [],
}
```

### 📦 설치할 의존성

```bash
# Core dependencies (Vite 기본 포함)
npm install react react-dom

# Dev dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D typescript @types/react @types/react-dom
```

### ✅ 성공 확인 방법

1. **터미널**: `npm run dev` 실행 후 `localhost:5173` 접속
2. **브라우저**: 다크 배경(#111827)에 흰색 텍스트로 "gr8" 타이틀 표시
3. **HMR 테스트**: `App.tsx` 수정 시 브라우저 자동 새로고침
4. **테스트**: `npm run test` 실행 시 Vitest 러너 시작
5. **빌드**: `npm run build` 실행 시 `dist/` 폴더 생성

### 🚀 다음 Story

이 Story가 완료되면 **Story 1.2: 백엔드 스타터 템플릿 초기화**로 진행합니다. 하지만 오늘의 목표는 여기까지입니다! 🎉

---

_Story created: 2026-01-12_
_Ready for development!_
