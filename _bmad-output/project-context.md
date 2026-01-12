---
project_name: 'gr8'
user_name: '소피아빠'
date: '2026-01-12'
sections_completed: ['discovery', 'technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
status: 'complete'
existing_patterns_found: 25
---

# Project Context for AI Agents

_이 파일은 AI 에이전트가 코드 구현 시 반드시 따라야 할 핵심 규칙과 패턴을 포함합니다. 에이전트가 놓치기 쉬운 명백하지 않은 세부사항에 중점을 둡니다._

---

## Technology Stack & Versions

### Frontend Stack
- **React**: 18.3.1+ (Concurrent features, Suspense 지원)
- **TypeScript**: 5.7+ (strict mode 필수 - noImplicitAny, strictNullChecks)
- **Vite**: 빌드 도구 (HMR, 최적화된 production builds)
- **Zustand**: 5.x (경량 상태 관리, TypeScript-first)
- **React Router**: v6.30.2 (Web3 호환성 검증됨 - Party Mode 결정)
- **React Query**: 5.x (서버 상태, 자동 캐싱, optimistic updates)
- **React Flow**: 노드-엣지 에디터 (전략 빌더 UI)
- **TradingView Lightweight Charts**: 실시간 차트 시각화
- **ethers.js**: v6 (Web3 지갑 연결, v5와 호환되지 않음)

### Backend Stack
- **FastAPI**: 0.115+ (async 지원, 자동 OpenAPI docs)
- **Python**: 3.11+ (성능 향상, type hints)
- **SQLAlchemy**: 2.0 (AsyncSession 사용 - 병렬 백테스팅 핵심)
- **Pydantic**: V2 (Rust core, FastAPI 자동 통합)
- **PostgreSQL**: 15+ (RDS in production, JSONB 최적화)
- **Redis**: 7.x (시장 데이터 캐싱, 백테스트 결과, 세션)

### Infrastructure
- **Docker**: Compose for local development
- **AWS ECS**: Fargate (serverless containers)
- **AWS S3 + CloudFront**: 정적 자산 호스팅
- **AWS RDS**: PostgreSQL 15+ (Multi-AZ)
- **GitHub Actions**: CI/CD 파이프라인
- **CloudWatch**: 로그, 메트릭, 알람

### Web3 Stack
- **Blockchain**: Monad L1 (Testnet for staging, Mainnet for production)
- **Wallet Libraries**: ethers.js v6, WalletConnect
- **Smart Contracts**: Solidity (MVP 전 감사 필수)

### ⚠️ Critical Version Constraints
- **React Router v6.30.2**: Web3 라이브러리와 호환성 검증 버전
- **SQLAlchemy 2.0 Async**: 반드시 AsyncSession 사용 (sync 대신 3-5x 성능)
- **Python 3.11+**: 3.10 이하에서는 성능 저하
- **ethers.js v6**: v5와 breaking changes 있음
- **TypeScript strict mode**: 모든 프로젝트에서 필수 활성화

---

## Critical Implementation Rules

### Language-Specific Rules

#### TypeScript Rules (Frontend)

**TypeScript Configuration:**
- **strict mode 필수**: noImplicitAny, strictNullChecks 활성화
- **절대 경로 import**: `@/` alias 사용 (src 경로)
- **타입 import 분리**: `import { type MyType }`로 런타임 오버헤드 방지

**Import/Export Conventions:**
- ✅ **named export 선호**: `export const fetchBacktest = () => {...}`
- ✅ **절대 경로 사용**: `import { Button } from '@/components/ui/Button'`
- ❌ **default export 지양**: 트리 쉐이킹 어려움

**Async/Await Patterns:**
- **async/await 사용**: Promise 체이닝 `.then()` 대신
- **error handling 필수**: 모든 async 함수에 try/catch 블록
- **React Query**: API 호출은 useQuery/useMutation으로 감싸기

**Error Handling:**
- **Zustand error stores**: `useErrorStore()` 전역 에러 상태
- **React Query errors**: 자동 재시도 + ErrorBoundary 연동
- **사용자 피드백**: 에러 발생 시 toast/alert로 알림

#### Python Rules (Backend)

**FastAPI Async Patterns:**
- **모든 엔드포인트 async**: `async def` 사용 (block I/O 제외)
- **SQLAlchemy AsyncSession**: 반드시 사용 - 병렬 백테스팅 성능 핵심
- ❌ **sync SQLAlchemy 금지**: 성능 저하 초래

**Type Hints Mandatory:**
```python
# ✅ 올바른 예
async def get_backtest(backtest_id: int) -> BacktestResponse:
    ...

# ❌ 잘못된 예
async def get_backtest(backtest_id):
    ...
```

**Pydantic V2 Integration:**
- 모든 API req/response에 `BaseModel` 상속
- `model_validate()` vs `parse_obj()` (V2 변경사항 주의)

**Web3 Integration:**
- **web3.py**: 백엔드에서 지갑 서명 검증
- **개인키 절대 직접 접근 금지**: 서명만 위임

#### Format Conversion Rules ⚠️

**snake_case ↔ camelCase 자동 변환:**
- **Backend → API**: `user_id` → `userId` (Pydantic alias 자동)
- **API → Frontend**: `userId` 그대로 사용
- **Frontend → API**: `userId` → `user_id` (FastAPI 자동)
- **예시**: SQLAlchemy `created_at` → API `createdAt` → Frontend `createdAt`

### Framework-Specific Rules

#### React Rules

**Hooks Usage:**
- **Custom hooks**: `use` prefix 필수 (`useBacktest`, `useWalletConnection`)
- **Rules of Hooks**: 최상위 레벨에서만 호출, 조건부 호출 금지
- **useState vs Zustand**: 지역 상태는 useState, 전역 상태는 Zustand

**Component Organization:**
- **Feature-based structure**: `features/backtest/`, `features/wallet/`
- **파일 분리**: Component + hooks + types + utils
- **Props 인터페이스**: 명시적 타입 정의 필수

#### Zustand State Management

**5개 State Slices (아키텍처 정의):**
```typescript
- editorStore: 노드-엣지 에디터 상태 (nodes, edges, selection)
- backtestStore: 백테스트 설정/결과 (config, results, status)
- walletStore: Web3 지갑 연결 (address, chainId, isConnected)
- userStore: 사용자 프로필/인증 (profile, token, isAuthenticated)
- marketStore: 시장 데이터/차트 (ohlcv, chartState)
```

**불변 업데이트 (immer middleware):**
```typescript
// ✅ 올바른 방법 (불변)
setNodes((draft) => {
  draft.push(newNode);
});

// ❌ 잘못된 방법 (가변)
nodes.push(newNode);
```

#### React Query Rules

**Query Keys (계층적 구조):**
```typescript
// ✅ 올바른 예
['backtests'] // 모든 백테스트
['backtests', id] // 특정 백테스트
['strategies', 'published'] // 공개 전략 필터

// ❌ 잘못된 예 (중복)
['backtest']
['backtest-list']
```

**Mutation Patterns:**
- **optimistic updates**: UI 즉시 반영 (서버 응답 전)
- **automatic rollbacks**: 실패 시 이전 상태로 복원
- **invalidateQueries**: 관련 데이터 자동 갱신

#### FastAPI Rules

**API Router Organization:**
```
/api/routers/
├── __init__.py
├── backtests.py      # 백테스트 CRUD + 실행
├── strategies.py     # 전략 CRUD
├── web3.py           # 지갑 연결, 서명
└── users.py          # 사용자, 인증
```

**Dependency Injection:**
```python
# ✅ 올바른 예
@router.get("/backtests/{id}")
async def get_backtest(
    id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    ...

# ❌ 잘못된 예 (직접 초기화)
async def get_backtest(id: int):
    db = Session()  # 금지
```

**Response Models:**
```python
# 모든 엔드포인트에 response_model 필수
@router.post("/backtests", response_model=BacktestResponse, status_code=201)
async def create_backtest(...):
    ...
```

### Testing Rules

#### Frontend Testing (Vitest + Testing Library)

**Test Organization:**
```
tests/
├── unit/           # Component/hook tests
│   ├── components/ # UI components
│   ├── hooks/      # Custom hooks
│   └── utils/      # Utility functions
├── integration/    # API integration
└── e2e/           # Playwright tests
```

**Coverage Requirements:**
- **Unit tests**: 80%+ target (critical paths)
- **Component tests**: 모든 UI 컴포넌트
- **Hook tests**: custom hooks 필수

**Testing Patterns:**
```typescript
// ✅ 올바른 예 (Testing Library)
describe('BacktestForm', () => {
  it('submits form with valid data', async () => {
    render(<BacktestForm />);
    await userEvent.type(screen.getByLabelText('Strategy Name'), 'My Strategy');
    await userEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(mockSubmit).toHaveBeenCalled();
  });
});
```

#### Backend Testing (pytest + async)

**Test Organization:**
```
tests/
├── unit/          # Service/unit tests
├── integration/   # API integration tests
├── e2e/          # Full journey tests
├── web3/         # Smart contract tests
└── smoke/        # Production health checks
```

**Async Test Patterns:**
```python
# ✅ 올바른 예 (pytest-asyncio)
@pytest.mark.asyncio
async def test_create_backtest(async_client, auth_headers):
    response = await async_client.post(
        "/api/backtests",
        json={"strategy_id": 1},
        headers=auth_headers
    )
    assert response.status_code == 201
```

**Critical Test Rules:**
- **All async tests**: `@pytest.mark.asyncio` 필수
- **Database fixtures**: `async_session` 사용 (syncSession 금지)
- **Web3 tests**: Testnet에서만 실행 (Mainnet 금지)

#### Integration vs Unit Test Boundaries

**Unit Tests:**
- 함수/클래스 단위 테스트
- 외부 의존성 mock

**Integration Tests:**
- API 엔드포인트 테스트
- 실제 DB 연결 (test database)
- Web3 interactions (Testnet)

**E2E Tests:**
- 사용자 시나리오 전체
- Playwright (프론트엔드)
- 실제 API + DB 연결

### Code Quality & Style Rules

#### Naming Conventions (Critical)

**Database (PostgreSQL):**
- Tables: 소문자 복수형 `users`, `backtest_results`
- Columns: snake_case `user_id`, `created_at`
- Primary key: `{table}_id` → `strategy_id`

**Backend (Python):**
- Files/modules: snake_case `backtest_service.py`
- Functions: snake_case `def get_backtest_result():`
- Classes: PascalCase `class BacktestEngine:`
- Constants: UPPER_SNAKE_CASE `MAX_BACKTEST_DURATION`

**Frontend (TypeScript):**
- Files/components: PascalCase `BacktestForm.tsx`
- Functions/variables: camelCase `const fetchBacktest = () => {}`
- Interfaces/Types: PascalCase `interface BacktestResult {}`
- Constants: UPPER_SNAKE_CASE `const MAX_RETRY = 3`

#### File Organization

**Frontend Structure:**
```
src/
├── components/      # Reusable UI
├── features/        # Feature-based (backtest, wallet, etc.)
│   ├── backtest/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.ts
├── lib/            # External library configs
├── stores/         # Zustand stores
├── utils/          # Utility functions
└── types/          # Global types
```

**Backend Structure:**
```
app/
├── api/
│   └── routers/    # API endpoints
├── core/           # Config, deps, security
├── models/         # SQLAlchemy models
├── schemas/        # Pydantic schemas
├── services/       # Business logic
└── db/             # Database session
```

#### Code Quality Standards

**TypeScript:**
- ESLint + Prettier 필수
- no-any 옵션 (any 금지)
- 모든 함수에 return type 명시

**Python:**
- Black formatter (line length 88)
- isort for imports
- mypy type checking (strict mode)
- pylint for code quality

#### Documentation Requirements

**Python Docstrings (Google style):**
```python
async def execute_backtest(config: BacktestConfig) -> BacktestResult:
    """백테스트를 실행하고 결과를 반환합니다.

    Args:
        config: 백테스트 설정 객체

    Returns:
        BacktestResult: 실행 결과

    Raises:
        ValueError: 설정이 유효하지 않을 때
    """
```

**TypeScript JSDoc:**
```typescript
/**
 * 백테스트를 실행합니다
 * @param config - 백테스트 설정
 * @returns 실행 결과
 */
export async function executeBacktest(
  config: BacktestConfig
): Promise<BacktestResult>
```

### Development Workflow Rules

#### Git/Repository Conventions

**Branch Naming:**
- Feature: `feature/backtest-engine`
- Bugfix: `bugfix/wallet-connection-error`
- Hotfix: `hotfix/security-patch`

**Commit Message Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(backtest): add parallel execution support

- Implement AsyncSession for concurrent backtests
- Add result aggregation logic

Closes #123
```

#### Pull Request Requirements

**PR Checklist:**
- [ ] All tests pass (unit + integration)
- [ ] Code coverage maintained or improved
- [ ] Documentation updated (if needed)
- [ ] TypeScript types validated (no any)
- [ ] Python mypy clean
- [ ] At least 1 approval required

#### Deployment Patterns

**Environment Promotion:**
1. **Local** → Docker Compose 테스트
2. **On-demand Staging** → CI/CD trigger (ECS)
3. **Web3 Testnet** → Smart contract deploy
4. **Production** → Mainnet deploy

**CI/CD Pipeline (GitHub Actions):**
- PR: Run lint, tests, type check
- Merge to main: Build + deploy to staging (on-demand)
- Manual approval: Deploy to production

---

### Critical Don't-Miss Rules ⚠️

#### Anti-Patterns to Avoid

**❌ SQLAlchemy Sync Sessions:**
```python
# 절대 금지
db = Session()
result = db.query(Backtest).all()

# 항상 async 사용
async with AsyncSession(db_engine) as session:
    result = await session.execute(select(Backtest))
```

**❌ Direct State Mutations (Zustand):**
```typescript
// 절대 금지
state.nodes.push(newNode);

// 항상 immer 사용
setNodes((draft) => {
  draft.push(newNode);
});
```

**❌ Missing Async Keywords:**
```python
# 절대 금지
def get_backtest(id: int):
    return db.query(...)

# 항상 async
async def get_backtest(id: int):
    return await db.execute(...)
```

#### Security Rules ⚠️

**Web3 Security:**
- **개인키 절대 직접 접근 금지**: 서명만 위임
- **서명 요청 시 사용자 확인**: 명시적 메시지
- **Mainnet 배포 전 감사 필수**: 스마트 컨트랙트

**API Security:**
- **모든 엔드포인트 인증**: 공개 엔드포인트 제외
- **Rate limiting**: API abuse 방지
- **Input validation**: Pydantic 필수

#### Performance Gotchas

**백테스트 성능:**
- ❌ 단일 프로세스 순차 실행 → 3-5분 소요
- ✅ AsyncSession 병렬 실행 → <30초 목표

**프론트엔드 성능:**
- ❌ 불필요한 re-renders → React.memo, useMemo 사용
- ❌ 거대한 번들 → Code splitting, lazy loading
- ✅ React Query 캐싱 → 중복 API 호출 방지

**데이터베이스 성능:**
- ❌ N+1 queries → eager loading (selectinload)
- ❌ Missing indexes → 자주 조회하는 컬럼에 인덱스
- ✅ Redis 캐싱 → 시장 데이터, 백테스트 결과

#### Edge Cases to Handle

**Web3 Edge Cases:**
- **지갑 연결 해제**: 사용자가 지갑을 잠금/전환
- **네트워크 전환**: Testnet ↔ Mainnet
- **트랜잭션 실패**: 가스 부족, nonce 오류
- **RPC timeout**: 재시도 로직 필수

**백테스트 Edge Cases:**
- **데이터 누락**: OHLCV 데이터 gap 처리
- **0으로 나누기**: 수익률 계산 시 분모 체크
- **메모리 초과**: 대용량 데이터 캔들 단위 처리

**UI Edge Cases:**
- **네트워크 장애**: Offline mode 표시
- **로딩 지연**: Skeleton screens
- **에러 복구**: Retry 버튼, 명확한 에러 메시지

---

## Usage Guidelines

**For AI Agents:**

- ✅ Read this file **before** implementing any code
- ✅ Follow **ALL** rules exactly as documented
- ✅ When in doubt, prefer the more restrictive option
- ✅ Update this file if new patterns emerge during implementation
- ✅ Cross-reference with `architecture.md` for complete context

**For Humans:**

- 📝 Keep this file **lean** and focused on agent needs
- 🔄 Update when technology stack or patterns change
- 🔍 Review quarterly for outdated rules
- 🗑️ Remove rules that become obvious over time
- 📋 Coordinate with architecture.md to avoid duplication

**Last Updated:** 2026-01-12

---

**이 project-context.md 파일은 AI 에이전트가 gr8 프로젝트의 코드를 구현할 때 반드시 따라야 할 핵심 규칙과 패턴을 포함합니다.**
