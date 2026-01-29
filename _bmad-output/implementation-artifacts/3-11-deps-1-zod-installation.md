# Story 3-11-deps-1: Zod 라이브러리 설치

**Type**: Gap-Filler Story (Story 3-11 선행 조건)
**Status**: ready-for-dev

---

## Story

**As a** 개발자 (Developer),
**I want** Zod 라이브러리를 설치하고 싶다,
**so that** Story 3-11에서 JSON 스키마 검증을 구현할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 3-11 (전략 JSON export/import) 개발 예정 ✅
- Story 3-11 AC 1: `validateStrategyJSON()` 함수가 Zod 스키마 검증 필요 ✅
- Story 3-11 Task 2: `src/schemas/strategySchema.ts` 생성 시 Zod 사용 명시 ✅

**문제:**
- Zod 라이브러리가 현재 npm packages에 설치되지 않음 ❌
- `npm list zod` → "zod not installed"
- Zod가 없으면 JSON 스키마 검증 구현 불가

**해결:**
Zod 라이브러리 설치 및 TypeScript 타입 정의

**중요:**
- **Zod**: TypeScript-first 스키마 검증 라이브러리
- **용도**: JSON 파일 import 시 유효성 검증
- **Story 3-11 선행 조건**: 이 Story가 완료되어야 3-11 개발 가능

---

## 수용 기준 (Acceptance Criteria)

### AC 1: Zod 라이브러리 설치 완료

**Given** 개발자가 프로젝트 루트에 있다
**When** `npm install zod`를 실행한다
**Then** Zod가 node_modules에 설치된다
**And** package.json에 zod 의존성이 추가된다
**And** 설치 버전이 출력된다

### AC 2: TypeScript 타입 정의 확인

**Given** Zod가 설치되었다
**When** TypeScript 컴파일을 실행한다
**And** `import { z } from 'zod'` 코드를 작성한다
**Then** 타입 추론이 정상 작동한다
**And** 컴파일 에러가 없다

### AC 3: 설치 검증

**Given** Zod가 설치되었다
**When** `npm list zod`를 실행한다
**Then** Zod 버전이 표시된다 (예: `zod@3.x.x`)
**And** NOT 코드 없음 ("zod not installed" 메시지 없음)

### AC 4: 간단한 스키마 테스트

**Given** Zod가 설치되었다
**When** 간단한 Zod 스키마를 작성하고 테스트한다
**Then** 스키마 검증이 정상 작동한다
**And** 에러 메시지가 명확하게 표시된다

---

## Tasks / Subtasks

### Task 1: Zod 라이브러리 설치 (AC: #1, #3)
- [ ] Subtask 1.1: 프로젝트 루트로 이동
  ```bash
  cd gr8-frontend
  ```
- [ ] Subtask 1.2: Zod 설치 명령 실행
  ```bash
  npm install zod
  ```
- [ ] Subtask 1.3: 설치 완료 메시지 확인
  - "added X packages" 메시지 확인
- [ ] Subtask 1.4: package.json 업데이트 확인
  - `"zod": "^3.x.x"` 추가 확인

### Task 2: TypeScript 타입 정의 확인 (AC: #2)
- [ ] Subtask 2.1: TypeScript 컴파일 테스트
  ```bash
  npm run build
  ```
- [ ] Subtask 2.2: Zod import 테스트 파일 생성
  - `src/schemas/__tests__/zod-test.ts` 생성
  ```typescript
  import { z } from 'zod';

  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  const result = testSchema.parse({ name: 'Test', age: 25 });
  console.log(result);
  ```
- [ ] Subtask 2.3: 컴파일 에러 없는지 확인
- [ ] Subtask 2.4: 테스트 파일 삭제 (선택사항)

### Task 3: 설치 검증 (AC: #3)
- [ ] Subtask 3.1: npm list 명령 실행
  ```bash
  npm list zod
  ```
- [ ] Subtask 3.2: 버전 확인
  - 출력: `zod@3.x.x` 확인
  - NOT "zod not installed"
- [ ] Subtask 3.3: node_modules/zod 디렉토리 확인
  ```bash
  ls node_modules/zod
  ```
- [ ] Subtask 3.4: package-lock.json 업데이트 확인

### Task 4: 간단한 스키마 테스트 (AC: #4)
- [ ] Subtask 4.1: 테스트 스크립트 생성 (src/scripts/test-zod.ts)
  ```typescript
  import { z } from 'zod';

  // 스키마 정의
  const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(50),
    email: z.string().email(),
    age: z.number().int().min(0).max(150),
  });

  // 유효한 데이터 테스트
  const validUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  };

  try {
    const user = UserSchema.parse(validUser);
    console.log('✅ Valid user:', user);
  } catch (error) {
    console.error('❌ Validation failed:', error.errors);
  }

  // 무효한 데이터 테스트
  const invalidUser = {
    id: 'not-a-uuid',
    name: '',
    email: 'invalid-email',
    age: 200,
  };

  try {
    const user = UserSchema.parse(invalidUser);
    console.log('✅ Valid user:', user);
  } catch (error) {
    console.log('✅ Validation correctly failed:', error.errors);
  }
  ```
- [ ] Subtask 4.2: 테스트 스크립트 실행
  ```bash
  npx tsx src/scripts/test-zod.ts
  ```
- [ ] Subtask 4.3: 유효한 데이터 테스트 통과 확인
- [ ] Subtask 4.4: 무효한 데이터 테스트 실패 확인 (에러 메시지 출력)
- [ ] Subtask 4.5: 테스트 스크립트 삭제 (선택사항)

---

## Dev Notes

### 🎯 목표

이 Gap-Filler Story는 **Zod 라이브러리 설치**를 통해 Story 3-11의 JSON 스키마 검증 기능을 가능하게 합니다. 완료되면:
- Zod가 npm packages에 설치됨
- Story 3-11에서 `import { z } from 'zod'` 사용 가능
- StrategyJSONSchema 정의 가능
- JSON 유효성 검증 구현 가능

### 📚 Zod란 무엇인가?

**Zod**:
- TypeScript-first 스키마 검증 라이브러리
- 타입 안전한 데이터 검증
- 자동 타입 추론 (TypeScript 타입 생성)
- 간결하고 직관적인 API
- 런타임 검증 + 컴파일 타임 타입 체크

**왜 Zod인가?**
- TypeScript와 완벽한 통합
- 에러 메시지가 명확함
- 성능이 우수함
- 커뮤니티가 활발함
- Story 3-11에서 Zod 사용 명시됨

### 🏗️ Zod 설치 방법

**npm:**
```bash
npm install zod
```

**yarn:**
```bash
yarn add zod
```

**pnpm:**
```bash
pnpm add zod
```

**버전 확인:**
```bash
npm list zod
# zod@3.x.x
```

### 📐 Zod 기본 사용법

**스키마 정의:**
```typescript
import { z } from 'zod';

// 기본 스키마
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  active: z.boolean().default(true),
  bio: z.string().optional(),
});

// 타입 추론
type User = z.infer<typeof UserSchema>;
// {
//   id: string;
//   name: string;
//   email: string;
//   age: number;
//   active: boolean;
//   bio?: string | undefined;
// }
```

**데이터 검증:**
```typescript
// 유효한 데이터
const validUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
};

const user = UserSchema.parse(validUser);
// ✅ 검증 통과, user 반환

// 무효한 데이터
const invalidUser = {
  id: 'not-a-uuid',
  name: '',
  email: 'invalid-email',
  age: 200,
};

try {
  const user = UserSchema.parse(invalidUser);
} catch (error) {
  console.error(error.errors);
  // ❌ ZodError: [
  //   { code: 'invalid_string', message: 'Invalid uuid' },
  //   { code: 'too_small', message: 'String must contain at least 1 character(s)' },
  //   { code: 'invalid_string', message: 'Invalid email' },
  //   { code: 'too_big', message: 'Number must be less than or equal to 150' }
  // ]
}
```

**안전한 파싱 (parse vs safeParse):**
```typescript
// parse: 에러 발생 (throw)
try {
  const user = UserSchema.parse(data);
} catch (error) {
  console.error(error);
}

// safeParse: 에러 없이 결과 반환
const result = UserSchema.safeParse(data);

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.errors);
}
```

### 🎨 Story 3-11에서의 활용

**StrategyJSON 스키마** (Story 3-11 Task 2):
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
  nodes: z.array(z.any()), // ReactFlow Node[]
  edges: z.array(z.any()), // ReactFlow Edge[]
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number().min(0.1).max(2),
  }),
});

// 타입 추론
type StrategyJSON = z.infer<typeof StrategyJSONSchema>;
```

**JSON import 시 검증** (Story 3-11 Task 1):
```typescript
import { StrategyJSONSchema } from '@/schemas/strategySchema';

export async function importStrategyJSON(file: File): Promise<StrategyJSON> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result as string);
        const strategy = StrategyJSONSchema.parse(json); // Zod validation
        resolve(strategy);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Validation errors:', error.errors);
          reject(new Error('Invalid strategy JSON format'));
        } else {
          reject(error);
        }
      }
    };

    reader.readAsText(file);
  });
}
```

### ⚠️ 중요 고려사항

**1. TypeScript 버전 호환성:**
- Zod 3.x는 TypeScript 4.5+ 필요
- 프로젝트 TypeScript 버전 확인: 5.9.3 ✅ (package.json line 59)
- 호환성 문제 없음

**2. 파일 크기:**
- Zod는 압축 시 ~10KB (매우 가벭움)
- Tree-shaking 지원 (사용하는 기능만 번들링)
- 성능 영향 최소화

**3. 런타임 vs 컴파일 타임:**
- Zod는 런타임 검증 수행
- TypeScript는 컴파일 타임 타입 체크 수행
- 두 계층 모두 보호 제공

**4. 다른 라이브러리와의 비교:**
- **Yup**: JavaScript 원생, Zod보다 무거움
- **Joi**: 설정 기반, Zod보다 복잡함
- **Ajv**: JSON Schema 기반, TypeScript 지원 부족
- **Zod 선택 이유**: TypeScript-first, 간단한 API, 우수한 성능

### 🧪 테스트 전략

**설치 검증 테스트:**
```bash
# 1. 설치 확인
npm list zod

# 2. 컴파일 테스트
npm run build

# 3. 간단한 스키마 테스트
npx tsx -e "
import { z } from 'zod';
const schema = z.object({ name: z.string() });
const result = schema.parse({ name: 'Test' });
console.log('✅ Zod works!', result);
"
```

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- None (선행 조건 없음)

**후속 Stories (이 Story의 완료가 필요한 Story):**
- ✅ **Story 3-11: 전략 JSON export/import** (ready-for-dev → in-progress 가능)
  - AC 1: validateStrategyJSON() 함수 구현
  - AC 4: JSON 유효성 검증
  - Task 2: StrategyJSON 스키마 정의

**진행 순서:**
```
3-11-deps-1 (이 Story) 완료
    ↓
3-11 개발 시작 가능 (in-progress)
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
1. ✅ Pre-Implementation Check Report (3-11) 확인
2. ✅ Zod 미설치 상태 확인 (`npm list zod` → "zod not installed")
3. ✅ Story 3-11에서 Zod 필요성 확인
4. ✅ 설치 방법 및 테스트 방법 정의

**实施计划:**
- Task 1: Zod 라이브러리 설치
- Task 2: TypeScript 타입 정의 확인
- Task 3: 설치 검증
- Task 4: 간단한 스키마 테스트

### File List

**Files to Modify (1 file)**
- `gr8-frontend/package.json` - ✅ 수정 (zod 의존성 추가)

**Dependencies to Install:**
- `zod` - TypeScript-first 스키마 검증 라이브러리 (npm install zod)

**Test Files (Optional)**
- `gr8-frontend/src/schemas/__tests__/zod-test.ts` - ✅ 새로 생성 (테스트용)
- `gr8-frontend/src/scripts/test-zod.ts` - ✅ 새로 생성 (테스트용)

**Total:** 1 file to modify, 1 dependency to install

**TypeScript Compilation:** 설치 후 확인 필요

### Change Log

**2026-01-29 - Story 3-11-deps-1 Created**
- Created gap-filler story for Zod library installation
- Identified gap during Story 3-11 pre-implementation check
- Defined installation and verification tasks
- Prepared Zod usage examples for Story 3-11
