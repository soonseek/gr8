# Story 4-8-deps-1: React Hook Form 및 Zod 라이브러리 설치

Status: ready-for-dev

---

## Story

**As a** 프론트엔드 개발자 (Frontend Developer),
**I want** react-hook-form, zod, @hookform/resolvers 라이브러리와 Shadcn UI Progress 컴포넌트를 설치하고 싶다,
**so that** Story 4-8의 백테스트 실행 UI에서 폼 관리 및 검증 기능을 구현할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1-1에서 프론트엔드 스타터 템플릿 완료 ✅ (React, TypeScript, Tailwind CSS)
- Story 4-8에서 백테스트 실행 및 파라미터 설정 UI 구현 예정 ✅
- Shadcn UI Dialog, Button, Input, Label, Select, Alert 컴포넌트 이미 설치됨 ✅

**문제:**
- Story 4.8의 핵심 폼 관리 라이브러리인 react-hook-form이 미설치됨
- Zod 스키마 검증 라이브러리가 미설치됨
- React Hook Form과 Zod를 연결하는 @hookform/resolvers가 미설치됨
- Progress bar 렌더링을 위한 Shadcn UI Progress 컴포넌트가 미설치됨
- Story 4.8 개발 차단

**해결:**
react-hook-form, zod, @hookform/resolvers 라이브러리 설치 및 Shadcn UI Progress 컴포넌트 추가

**중요:**
- **Story 4-8의 선행 조건**: 이 Story가 완료되어야 Story 4-8 개발 가능
- **React Hook Form**: 성능 최적화된 폼 관리 라이브러리 (re-render 최소화)
- **Zod**: TypeScript-first 스키마 검증 라이브러리
- **Shadcn UI Progress**: 진행 상태 표시 컴포넌트

---

## 수용 기준 (Acceptance Criteria)

### AC 1: package.json에 폼 관리 라이브러리 추가

**Given** gr8-frontend/package.json이 있다
**When** 개발자가 npm install을 실행한다
**Then** react-hook-form이 추가된다
**And** zod가 추가된다
**And** @hookform/resolvers가 추가된다
**And** 버전이 최신 안정 버전이다

**기술 구현:**
```bash
# gr8-frontend/

npm install react-hook-form zod @hookform/resolvers
```

**Expected package.json:**
```json
{
  "dependencies": {
    "react-hook-form": "^7.55.0",  # 또는 최신 버전
    "zod": "^3.24.1",              # 또는 최신 버전
    "@hookform/resolvers": "^3.10.0"  # 또는 최신 버전
  }
}
```

### AC 2: TypeScript 타입 정의 확인

**Given** react-hook-form, zod, @hookform/resolvers가 설치되었다
**When** 개발자가 TypeScript에서 import를 실행한다
**Then** import가 성공한다
**And** 타입 추론이 동작한다
**And** 타입 에러가 없다

**기술 구현:**
```typescript
// import_test.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// TypeScript 컴파일 테스트
npx tsc --noEmit
```

**Expected Result:** No TypeScript errors

### AC 3: 기본 폼 컴포넌트 테스트

**Given** react-hook-form, zod, @hookform/resolvers가 설치되었다
**When** 개발자가 간단한 폼 컴포넌트를 생성한다
**Then** 폼이 렌더링된다
**And** Zod 스키마 검증이 동작한다
**And** 제출 시 데이터가 출력된다

**기술 구현:**
```typescript
// test-form.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const TestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type TestFormData = z.infer<typeof TestSchema>;

const TestForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(TestSchema),
  });

  const onSubmit = (data: TestFormData) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default TestForm;
```

### AC 4: Shadcn UI Progress 컴포넌트 추가

**Given** Shadcn UI가 설정되어 있다
**When** 개발자가 Progress 컴포넌트를 추가한다
**Then** src/components/ui/progress.tsx가 생성된다
**And** Progress 컴포넌트가 렌더링된다
**And** value prop으로 진행률을 설정할 수 있다

**기술 구현:**
```bash
# Shadcn UI Progress 컴포넌트 추가
npx shadcn-ui@latest add progress
```

**Expected Result:**
```
✅ Added component: progress
✅ Added file: src/components/ui/progress.tsx
```

**테스트 코드:**
```typescript
// test-progress.tsx
import React from 'react';
import { Progress } from '@/components/ui/progress';

const TestProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4">
      <Progress value={progress} className="w-full" />
      <p>Progress: {progress}%</p>
    </div>
  );
};

export default TestProgress;
```

---

## Tasks / Subtasks

### Task 1: 폼 관리 라이브러리 설치 (AC: #1)
- [ ] Subtask 1.1: npm install react-hook-form 실행
- [ ] Subtask 1.2: npm install zod 실행
- [ ] Subtask 1.3: npm install @hookform/resolvers 실행
- [ ] Subtask 1.4: package.json에 버전 확인

### Task 2: TypeScript 타입 정의 확인 (AC: #2)
- [ ] Subtask 2.1: TypeScript에서 import 테스트
- [ ] Subtask 2.2: npx tsc --noEmit 실행 및 에러 없음 확인
- [ ] Subtask 2.3: 타입 추론 동작 확인

### Task 3: 기본 폼 컴포넌트 테스트 (AC: #3)
- [ ] Subtask 3.1: TestForm 컴포넌트 생성
- [ ] Subtask 3.2: 개발 서버 실행 (npm run dev)
- [ ] Subtask 3.3: 브라우저에서 폼 렌더링 확인
- [ ] Subtask 3.4: Zod 검증 동작 확인

### Task 4: Shadcn UI Progress 컴포넌트 추가 (AC: #4)
- [ ] Subtask 4.1: npx shadcn-ui@latest add progress 실행
- [ ] Subtask 4.2: src/components/ui/progress.tsx 생성 확인
- [ ] Subtask 4.3: TestProgress 컴포넌트 생성
- [ ] Subtask 4.4: 브라우저에서 Progress 렌더링 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **필수 폼 관리 라이브러리를 설치**합니다. 완료되면:
- **Story 4-8 개발 가능**: 폼 관리 및 검증 기능 구현 가능
- **React Hook Form**: 성능 최적화된 폼 상태 관리
- **Zod**: TypeScript-first 스키마 검증
- **Shadcn UI Progress**: 진행 상태 표시

### 📚 라이브러리 선정 이유

**react-hook-form:**
- 성능 최적화 (uncontrolled components, re-render 최소화)
- 작은 번들 크기 (25KB gzipped)
- TypeScript 타입 지원 완벽
- 쉬운 API 및 확장성
- Zod와 완벽한 통합

**zod:**
- TypeScript-first 스키마 정의
- 타입 추론 자동 지원 (z.infer)
- 런타임 검증
- 직관적인 API
- 에러 메시지 커스터마이징

**@hookform/resolvers:**
- React Hook Form과 Zod 연결
- 다른 검증 라이브러리도 지원 (Yup, Joi, etc.)
- 공식 지원

**Shadcn UI Progress:**
- Radix UI 기반
- Tailwind CSS 스타일링
- 반응형 디자인
- 다크 모드 지원
- 커스터마이징 용이

### 🔗 Story 4-8과의 연관성

**Story 4-8에서 이 라이브러리들을 활용하는 곳:**

1. **BacktestParamsSchema** (Zod):
   ```typescript
   export const BacktestParamsSchema = z.object({
     startDate: z.date().max(new Date()),
     endDate: z.date().max(new Date()),
     initialCapital: z.number().positive(),
     timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']),
     commission: z.number().min(0).max(1),
     slippage: z.number().min(0).max(1)
   });
   ```

2. **BacktestParamsForm** (React Hook Form + Zod):
   ```typescript
   const {
     register,
     handleSubmit,
     formState: { errors }
   } = useForm({
     resolver: zodResolver(BacktestParamsSchema)
   });
   ```

3. **BacktestProgressModal** (Shadcn UI Progress):
   ```typescript
   import { Progress } from '@/components/ui/progress';

   <Progress value={progress} />
   ```

### ⚠️ 중요 고려사항

**1. 버전 호환성:**
- React 19.2.0과 호환성 확인 필요
- TypeScript 5.9.3과 호환성 확인 필요
- @radix-ui/react-dialog와 호환성 확인 필요

**2. 번들 사이즈:**
- react-hook-form: ~25KB (gzipped)
- zod: ~50KB (gzipped)
- @hookform/resolvers: ~2KB (gzipped)
- 총 합계: ~77KB (gzipped)
- Vite 트리셰이킹으로 번들 크기 최적화

**3. 브라우저 지원:**
- 최신 브라우저 (Chrome, Firefox, Safari, Edge)
- 모바일 브라우저 (iOS Safari, Chrome Mobile)
- IE11 미지원 (그러나 프로젝트가 이미 IE11 미지원으로 보임)

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1-1: 프론트엔드 스타터 템플릿 (React, TypeScript, Tailwind CSS)

**후속 Stories (이 Story의 결과 활용):**
- Story 4-8: 백테스트 실행 및 파라미터 설정 UI (실제 폼 구현)

**파일 수정 목록:**
1. `gr8-frontend/package.json` - ✅ 수정 (react-hook-form, zod, @hookform/resolvers 추가)
2. `gr8-frontend/src/components/ui/progress.tsx` - ✅ 추가 (Shadcn UI Progress)

**예상 소요 시간:** 30분

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Story 4-8 Pre-Implementation Check에서 Gap 발견
2. Gap 해결을 위한 보완 Story 생성
3. 4개 AC 정의 (package.json 추가, TypeScript 타입, 기본 폼 테스트, Shadcn UI Progress)
4. 4개 Task/14개 Subtask 정의
5. Dev Notes 작성 (라이브러리 선정 이유, Story 4-8과의 연관성)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- react-hook-form 설치
- zod 설치
- @hookform/resolvers 설치
- Shadcn UI Progress 컴포넌트 추가
- TypeScript 타입 정의 확인
- 기본 폼 컴포넌트 테스트

📋 **다음 단계:**
- Story 4-8-deps-1 개발 시작 (npm install)
- Story 4-8 개발 시작 (백테스트 실행 UI)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-8-deps-1.md` - This story file

**Frontend Files to Modify (est. 2 files)**
- `gr8-frontend/package.json` - ✅ 수정 (react-hook-form, zod, @hookform/resolvers 추가)
- `gr8-frontend/src/components/ui/progress.tsx` - ✅ 추가 (Shadcn UI Progress 컴포넌트)

**Test Files (optional, est. 2 files)**
- `gr8-frontend/src/test-form.tsx` - 🆕 새로 생성 (기본 폼 테스트)
- `gr8-frontend/src/test-progress.tsx` - 🆕 새로 생성 (Progress 테스트)

**Total:** 2-4 files to create/modify
