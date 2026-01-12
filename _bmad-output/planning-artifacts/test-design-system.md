# System-Level Test Design

**Date:** 2026-01-12
**Author:** 소피아빠
**Status:** Draft
**Project:** gr8 (탈중앙화 자동 거래 전략 플랫폼)

---

## Executive Summary

**Scope:** System-level testability review for gr8 MVP (Phase 3 - Solutioning Gate)

**Testability Assessment:**
- **Controllability:** PASS with CONCERNS (API seeding available, Web3 dependency mocking needed)
- **Observability:** PASS with CONCERNS (logging planned, structured telemetry needs implementation)
- **Reliability:** PASS with CONCERNS (async architecture enables parallel testing, Web3 flakiness risks)

**Risk Summary:**
- Total risks identified: 12
- High-priority risks (≥6): 5
- Critical categories: SECURITY (3), PERF (1), TECH (1)

---

## 1. Testability Assessment

### 1.1 Controllability (시스템 상태 제어 가능성)

**Status:** PASS with CONCERNS

**Strengths:**
- ✅ **Database Seeding**: SQLAlchemy factories + AsyncSession enable fast, isolated test data setup
- ✅ **API-Level Control**: FastAPI endpoints可以直接调用进行状态设置 (without UI)
- ✅ **Dependency Injection**: FastAPI's `Depends()` allows mocking external services
- ✅ **Test Database**: Docker Compose provides isolated PostgreSQL instances

**Concerns:**
- ⚠️ **Web3 Dependency Mocking**: Monad Testnet dependency requires careful mocking strategy
  - **Risk**: External blockchain flakiness affects test reliability
  - **Mitigation**: Use anvil/hardhat local fork for deterministic Web3 testing
- ⚠️ **Market Data External API**: Binance API integration needs HAR capture/replay for deterministic testing
  - **Risk**: Real-time data dependency causes test non-determinism
  - **Mitigation**: Implement `network-recorder` pattern (HAR capture → replay)

**Recommendations:**
1. Implement Web3 local testnet fork (anvil/hardhat) for deterministic smart contract testing
2. Create HAR files for critical market data API responses (Binance historical OHLCV)
3. Use faker-based factories with auto-cleanup for all test data

### 1.2 Observability (시스템 상태 검사 가능성)

**Status:** PASS with CONCERNS

**Strengths:**
- ✅ **Logging Architecture**: Python logging + CloudWatch integration planned
- ✅ **HTTP Observability**: Server-Timing headers for API performance tracking
- ✅ **Test Result Visibility**: pytest + Playwright provide clear assertion messages

**Concerns:**
- ⚠️ **Structured Logging Not Implemented**: Trace ID correlation missing from architecture
  - **Risk**: Distributed tracing across frontend → backend → blockchain impossible
  - **Mitigation**: Implement OpenTelemetry trace propagation before MVP release
- ⚠️ **Backtest Progress Visibility**: Long-running backtest (<30s) needs progress hooks
  - **Risk**: Test failures unclear (which step failed? data fetch? strategy execution?)
  - **Mitigation**: Emit progress events via WebSocket or pollable status endpoint
- ⚠️ **Web3 Transaction Observability**: Smart contract interaction failures hard to debug
  - **Risk**: No clear visibility into gas estimation failures, nonce issues
  - **Mitigation**: Integrate Tenderly/revoke.cash for transaction debugging

**Recommendations:**
1. Implement OpenTelemetry with trace ID propagation (frontend → backend → blockchain)
2. Add backtest progress events: `backtest.started`, `backtest.progress`, `backtest.completed`
3. Create Web3 transaction logger: capture `txHash`, `gasUsed`, `status` for all smart contract calls

### 1.3 Reliability (테스트 안정성 및 재현성)

**Status:** PASS with CONCERNS

**Strengths:**
- ✅ **Async Architecture**: SQLAlchemy 2.0 AsyncSession enables parallel test execution
- ✅ **Stateless Design**: RESTful API + JWT tokens support isolated test runs
- ✅ **Docker Isolation**: Each test run gets clean database, cache, and infrastructure

**Concerns:**
- ⚠️ **Web3 Flakiness**: Blockchain transactions inherently non-deterministic (gas prices, mempool delays)
  - **Risk**: Intermittent test failures from RPC timeout, transaction stuck in mempool
  - **Mitigation**: Use deterministic testnet fork (anvil) with `evm_setAutomine` for instant tx confirmation
- ⚠️ **Market Data Time Sensitivity**: Backtest accuracy depends on OHLCV data timestamps
  - **Risk**: Data gaps or timestamp misalignments cause backtest failures
  - **Mitigation**: Use deterministic seed data with known-good timestamps, validate data completeness in tests
- ⚠️ **Parallel Test Race Conditions**: Zustand stores may leak state between Playwright worker processes
  - **Risk**: Flaky tests when `--workers=4`, random failures from state pollution
  - **Mitigation**: Implement store reset in `beforeEach` hook, use unique wallet addresses per test

**Recommendations:**
1. Enable anvil's `evm_setAutomine` and `evm_setIntervalMining` for deterministic Web3 tests
2. Create `data-validator` helper: check OHLCV continuity, timestamp排序, no gaps
3. Implement Playwright `beforeEach` store reset: `editorStore.clear()`, `walletStore.clear()`
4. Use `faker.finance.ethereumAddress()` for unique wallet addresses in each test

---

## 2. Architecturally Significant Requirements (ASRs)

ASRs are quality requirements that drive architecture decisions and pose testability challenges.

### ASR-1: Backtest Performance (PERF)

**Requirement:** "백테스트 실행 시간: <30초 (90th percentile)"

**Impact on Architecture:**
- Drove decision to use SQLAlchemy 2.0 AsyncSession (3-5x faster than sync)
- Required Redis caching of market data to avoid repeated API calls
- Influenced parallel execution strategy (concurrent backtests supported)

**Testability Challenge:**
- Performance SLO (<30s) requires load testing infrastructure
- Need to measure 90th percentile, not average
- Must simulate realistic strategy complexity (not toy examples)

**Risk Score:**
- Probability: 2 (Possible - async architecture helps, but data volume unknown)
- Impact: 3 (Critical - blocks core value proposition)
- **Score: 6 (HIGH)**

**Testing Approach:**
- **Tool**: k6 for load testing (NOT Playwright)
- **Metric**: `p(90) < 30000` (30s threshold at 90th percentile)
- **Strategy**: Run 100 concurrent backtests with realistic strategy (5 indicators, 1-year data)
- **Evidence**: k6 trend output showing p90 duration < 30000ms

**Mitigation:**
- Owner: Backend Team
- Timeline: Sprint 2 (before Epic 4 implementation)
- Plan: Benchmark with 1, 3, 5 concurrent backtests; extrapolate to 100; optimize if p90 > 30s

### ASR-2: Web3 Security (SEC)

**Requirement:** "스마트 컨트랙트 MVP 전 감사 완료 필수"

**Impact on Architecture:**
- Requires separate Testnet deployment (Monad testnet) before mainnet
- Influenced contract architecture (upgradeable vs. immutable patterns)
- Drove decision to use ethers.js v6 (type-safe contract interactions)

**Testability Challenge:**
- Smart contract security testing requires specialized tools (not Playwright/Cypress)
- Gas optimization needs measurement (gas limit breaches)
- Reentrancy and overflow vulnerabilities need static analysis

**Risk Score:**
- Probability: 2 (Possible - common in Web3, but audit will catch)
- Impact: 3 (Critical - fund loss, regulatory violation)
- **Score: 6 (HIGH)**

**Testing Approach:**
- **Tools**: Slither (static analysis), Hardhat/Echidna (fuzzing), Tenderly (transaction debugging)
- **Coverage**: 100% line coverage for all smart contract functions
- **Gas Benchmark**: Max gas per tx < block gas limit (Monad: 30M gas)
- **Fuzzing**: Echidna properties for invariant checking (e.g., "total rewards never exceed pool balance")

**Mitigation:**
- Owner: Smart Contract Auditor + Web3 Lead
- Timeline: Before Epic 5 mainnet deployment
- Plan: External audit (Certik/Trail of Bits) + internal fuzzing campaign

### ASR-3: API Response Time (PERF)

**Requirement:** "API 응답 시간: <200ms (p95)"

**Impact on Architecture:**
- Required Redis caching of frequently accessed data (market data, user strategies)
- Drove decision to use FastAPI (async) instead of Flask (sync)
- Influenced database indexing strategy (OHLCV queries must be fast)

**Testability Challenge:**
- p95 measurement requires load testing (not single-request timing)
- Need to test under realistic load (not just 1 request)
- Database query performance must be profiled

**Risk Score:**
- Probability: 2 (Possible - unoptimized queries could exceed 200ms)
- Impact: 2 (Degraded - slow UI, but workaround exists)
- **Score: 4 (MEDIUM)**

**Testing Approach:**
- **Tool**: k6 load tests with thresholds
- **Metric**: `http_req_duration: ['p(95)<200']`
- **Scenarios**:
  - `GET /api/market/ohlcvs?symbol=BTCUSDT&interval=1h` (most frequent)
  - `POST /api/backtests` (heavy computation)
- **Profiling**: Use `python-slogger` or `py-spy` to identify slow queries

**Mitigation:**
- Owner: Backend Team
- Timeline: Sprint 3 (before Epic 4 full integration)
- Plan: Add database indexes on `symbol`, `timestamp` columns; implement query result caching

### ASR-4: Wallet Connection Security (SEC)

**Requirement:** "Web3 지갑 서명 요청, nonce 관리, 리플레이 공격 방지"

**Impact on Architecture:**
- Requires ethers.js `Signer` abstraction (never expose private keys)
- Drove decision to use `siwe` (Sign-In With Ethereum) standard
- Influenced session management (JWT tokens + wallet signature verification)

**Testability Challenge:**
- Testing wallet connection requires real wallet (MetaMask) or mock provider
- Nonce management needs multi-step test sequences (connect → sign → nonce increment → reconnect)
- Replay attack prevention requires transaction capture/replay

**Risk Score:**
- Probability: 2 (Possible - common Web3 vulnerability)
- Impact: 3 (Critical - unauthorized fund access)
- **Score: 6 (HIGH)**

**Testing Approach:**
- **Tool**: Playwright + MetaMask-flask (automated wallet testing)
- **Scenarios**:
  1. Connect wallet → verify signature request → verify nonce stored
  2. Capture signed message → attempt replay → verify replay rejected (403)
  3. Disconnect → reconnect → verify nonce incremented
- **Evidence**: Test screenshot showing signature request + 403 replay response

**Mitigation:**
- Owner: Web3 Lead
- Timeline: Sprint 1 (Epic 2 implementation)
- Plan: Implement SIWE library with nonce storage in Redis; add E2E tests for replay protection

### ASR-5: Data Integrity (DATA)

**Requirement:** "데이터 정확도: 99.9% (히스토리컬 데이터 무결성)"

**Impact on Architecture:**
- Required data validation layer (Pydantic models for OHLCV)
- Drove decision to store raw market data in PostgreSQL (not just cache)
- Influenced backtest engine design (validate data completeness before execution)

**Testability Challenge:**
- 99.9% accuracy means <0.1% error rate (1 error in 1000 data points)
- Need to detect gaps, duplicates, timestamp misalignments
- Must test across large datasets (1-year OHLCV = ~8,760 candlesticks per symbol)

**Risk Score:**
- Probability: 1 (Unlikely - Binance API is reliable, validation will catch errors)
- Impact: 3 (Critical - wrong backtest results → financial loss)
- **Score: 3 (MEDIUM)**

**Testing Approach:**
- **Tool**: pytest (data validation tests)
- **Scenarios**:
  1. Load 1-year BTCUSDT OHLCV → verify no gaps (1-hour intervals)
  2. Check for duplicate timestamps → expect 0 duplicates
  3. Validate OHLCV relationships: `Low ≤ Open ≤ High`, `Low ≤ Close ≤ High`
  4. Compare data against external source (CoinGecko) for sample dates
- **Metric**: Error rate < 0.1% (verified by data validation CI job)

**Mitigation:**
- Owner: Backend Team
- Timeline: Sprint 1 (Epic 1 infrastructure)
- Plan: Implement `data-validator` module; run validation on every Binance API fetch

---

## 3. Test Levels Strategy

### 3.1 Recommended Test Pyramid (gr8-Specific)

Based on architecture (Web3 + Fintech + PinTech complexity):

```
         E2E (10%)          ← Critical user journeys, Web3 wallet flows, backtest UI
       ┌─────────┐
      │           │
     │  API (30%) │         ← Business logic, smart contract integration, data validation
    │             │
   │               │
  │  Unit (60%)    │         ← Pure functions, data transformations, calculations
 │                 │
└─────────────────┘
```

**Rationale:**
- **60% Unit**: High confidence needed for financial calculations (backtest results, reward distribution)
- **30% API**: Complex business logic (strategy execution, reward splits) requires integration testing
- **10% E2E**: Web3 wallet flows are brittle but critical; minimize E2E to essential paths only

### 3.2 Test Level Selection Guide

| Scenario | Unit | API | E2E | Justification |
|----------|------|-----|-----|---------------|
| **Financial Calculations** (backtest PnL, reward splits) | ✅ Primary | ⚠️ Supplement | ❌ Overkill | Pure functions, deterministic, critical accuracy |
| **Data Validation** (OHLCV integrity, gap detection) | ✅ Primary | ⚠️ Supplement | ❌ Overkill | Pure data transformations, no external deps |
| **Smart Contract Interactions** (reward distribution, strategy NFT) | ❌ Can't test | ✅ Primary | ⚠️ Supplement | Contract requires Web3 provider; API tests use local fork |
| **Wallet Connection** (MetaMask, signature verification) | ❌ Can't test | ⚠️ Partial | ✅ Primary | User-facing flow, requires real wallet UI |
| **Backtest Execution** (strategy run, result calculation) | ⚠️ Partial | ✅ Primary | ❌ Overkill | Async workflow, DB operations, parallel execution |
| **Strategy Marketplace** (publish, subscribe, rating) | ❌ Can't test | ✅ Primary | ⚠️ Supplement | Multi-user interaction, DB transactions |
| **Critical User Journeys** (sign up → create strategy → run backtest) | ❌ Can't test | ⚠️ Partial | ✅ Primary | End-to-end validation of happy path |

### 3.3 Test Environment Needs

**Local Development (Docker Compose):**
- PostgreSQL 15 (test database)
- Redis 7 (cache, nonce storage)
- Anvil (local Ethereum fork for Web3 testing)
- Mock Binance API (HAR replay server)

**Staging (On-Demand ECS):**
- Full production-like stack
- Monad Testnet (real blockchain, but testnet tokens)
- Real Binance API (read-only, no rate limit bypass)

**Production (Mainnet):**
- Smoke tests only (no data modification)
- Read-only health checks (`/api/health`, `/api/market/status`)
- Smart contract read calls (no state changes)

---

## 4. NFR Testing Approach

### 4.1 Security (SEC)

**Testing Tools:**
- Playwright (E2E auth/authz)
- Slither (smart contract static analysis)
- npm audit (dependency vulnerabilities)
- OWASP ZAP (API security scanning)

**Test Scenarios:**
1. **Authentication:**
   - Unauthenticated user redirected to login (not exposed to dashboard)
   - JWT token expires after 15 minutes (auto-refresh with refresh token)
   - Password reset flow works (email verification)

2. **Authorization (RBAC):**
   - Regular user cannot access `/admin` routes (403)
   - Strategy owner can edit, others read-only
   - Creators can only view their own earnings

3. **Smart Contract Security:**
   - ReentrancyGuard prevents reentrancy attacks (Slither detection)
   - OnlyOwner restricts sensitive functions (pause, withdraw)
   - Overflow/underflow protected (Solidity 0.8+ built-in checks)

4. **OWASP Top 10:**
   - SQL injection blocked (parameterized queries)
   - XSS sanitized (React auto-escapes, validate in Playwright)
   - CSRF protected (SameSite cookies, CSRF tokens for state-changing routes)

**NFR Criteria:**
- ✅ PASS: All security tests green (Slither clean, npm audit 0 critical/high)
- ⚠️ CONCERNS: 1-2 medium vulnerabilities with mitigation plan
- ❌ FAIL: Critical exposure (unauthed access, SQL injection works)

### 4.2 Performance (PERF)

**Testing Tools:**
- k6 (load testing, NOT Playwright)
- Lighthouse (Core Web Vitals for frontend)
- python-slogger (backend profiling)

**Test Scenarios:**
1. **Load Testing (Expected Load):**
   - 50 concurrent users running backtests
   - SLO: p95 backtest duration < 30s
   - SLO: p95 API response < 200ms

2. **Stress Testing (Breaking Point):**
   - Ramp up to 500 concurrent users
   - Identify bottlenecks (DB connection pool, Redis limits)
   - Verify graceful degradation (not crash)

3. **Spike Testing (Traffic Surge):**
   - YouTuber promotes gr8 → 10,000 users in 10 minutes
   - Verify auto-scaling (ECS Fargate spin-up)
   - SLO: No 500 errors, queue requests if overloaded

4. **Endurance Testing (Memory Leaks):**
   - Sustained load (50 users) for 1 hour
   - Monitor memory usage (should not grow linearly)
   - Check for connection leaks (DB, Redis, WebSocket)

**NFR Criteria:**
- ✅ PASS: All SLOs met with k6 profiling evidence
- ⚠️ CONCERNS: Trending toward limits (p95 = 190ms approaching 200ms)
- ❌ FAIL: SLO breached (p95 > 200ms, p90 backtest > 30s)

### 4.3 Reliability (REL)

**Testing Tools:**
- Playwright (error handling UI validation)
- pytest (retry logic, circuit breaker)
- Chaos engineering (Gremlin for AWS failure injection - optional)

**Test Scenarios:**
1. **Error Handling:**
   - Binance API returns 500 → graceful error message + retry button
   - WebSocket disconnects → auto-reconnect with exponential backoff
   - Smart contract tx fails → clear error message (gas estimation, revert reason)

2. **Retries:**
   - Failed RPC call (Monad timeout) → 3 retries with exponential backoff
   - Test: Mock RPC timeout → verify 3 attempts → verify success or clear error

3. **Circuit Breaker:**
   - Binance API consistently fails → circuit opens → stop calling for 60s
   - Test: Mock 10 consecutive failures → verify circuit opens → verify "temporarily unavailable" UI

4. **Health Checks:**
   - `/api/health` returns status of DB, Redis, external APIs
   - Test: Stop Redis → health check returns `{"redis": "DOWN"}` → alert triggered

**NFR Criteria:**
- ✅ PASS: Error handling, retries, circuit breaker verified
- ⚠️ CONCERNS: Partial coverage (missing circuit breaker for some APIs)
- ❌ FAIL: No recovery path (500 error crashes app, no retry logic)

### 4.4 Maintainability (MAINT)

**Testing Tools:**
- CI tools (GitHub Actions for coverage, duplication)
- Playwright (observability validation)
- ESLint, Pylint (code quality)

**Test Scenarios:**
1. **Code Coverage:**
   - Backend: pytest with `--cov=app` → coverage report
   - Frontend: Vitest with `coverage` → 80%+ target
   - Smart contracts: Hardhat coverage → 100% target (critical path)

2. **Code Duplication:**
   - jscpd (JavaScript/TypeScript duplication detector)
   - Target: <5% duplication

3. **Vulnerability Scanning:**
   - npm audit (frontend dependencies)
   - pip-audit (backend dependencies)
   - Target: 0 critical/high vulnerabilities

4. **Observability (Playwright Validation):**
   - Critical errors reported to Sentry (mock Sentry, verify `captureException` called)
   - API response times tracked (verify `Server-Timing` header present)
   - Structured logging (verify `trace-id` header propagated)

**NFR Criteria:**
- ✅ PASS: Coverage 80%+, duplication <5%, 0 critical vulnerabilities, observability validated
- ⚠️ CONCERNS: Coverage 60-79%, duplication 5-10%, some medium vulnerabilities
- ❌ FAIL: Coverage <60%, duplication >10%, critical vulnerabilities present

---

## 5. Testability Concerns (Blockers or Risks)

### Concern 1: Web3 Test Environment Setup (TECH)

**Severity:** CONCERNS (not blocker, but requires early attention)

**Issue:**
- Monad Testnet may not have stable RPC endpoints during MVP development
- Local testnet fork (anvil) configuration not documented in architecture

**Impact:**
- Delays Epic 2 (Wallet) and Epic 5 (Marketplace) testing
- Flaky tests if RPC endpoints unreliable

**Recommendation:**
1. **Sprint 0 Action:** Set up anvil local fork with deterministic block mining
2. **Configuration:** Add `ANVIL_RPC_URL` to `.env.test`
3. **Documentation:** Create "Web3 Testing Guide" in `docs/testing/web3.md`

**Gate Decision:**
- Not a blocker for Solutioning gate
- Must resolve before Epic 2 implementation begins

### Concern 2: Market Data Test Data Strategy (DATA)

**Severity:** CONCERNS

**Issue:**
- Architecture does not specify how to obtain test data for backtesting
- Binance API has rate limits (1200 requests/minute) - insufficient for load testing

**Impact:**
- Cannot run realistic load tests (need 1-year OHLCV data)
- Backtest accuracy validation impossible without known-good test datasets

**Recommendation:**
1. **Sprint 0 Action:** Download and store 1-year OHLCV data for top 5 symbols (BTC, ETH, SOL, XRP, ADA)
2. **Storage:** Store in `tests/fixtures/market-data/` as CSV files
3. **Validation:** Create `validate_ohlcv()` function to check data integrity
4. **Mock Server:** Implement HAR replay server for Binance API responses

**Gate Decision:**
- Not a blocker for Solutioning gate
- Must resolve before Epic 4 (Backtesting) implementation

### Concern 3: Parallel Test State Pollution (TECH)

**Severity:** CONCERNS

**Issue:**
- Architecture does not address Zustand store reset between tests
- Playwright workers may share state if `beforeEach` not implemented

**Impact:**
- Flaky tests when `--workers=4`
- Intermittent failures hard to debug

**Recommendation:**
1. **Sprint 0 Action:** Create `tests/support/store-reset.ts` helper
2. **Implementation:**
   ```typescript
   export function resetAllStores() {
     editorStore.clear();
     backtestStore.clear();
     walletStore.clear();
     userStore.clear();
     marketStore.clear();
   }
   ```
3. **Integration:** Add to `beforeEach` in `playwright.config.ts`

**Gate Decision:**
- Not a blocker for Solutioning gate
- Must resolve before Sprint 1 (Epic 1 implementation)

---

## 6. Recommendations for Sprint 0

### 6.1 Test Framework Initialization (TF Workflow)

**Prerequisites:**
- [ ] Run `*framework` workflow to scaffold test infrastructure
- [ ] Configure Playwright for E2E testing
- [ ] Configure pytest for backend testing
- [ ] Set up anvil for Web3 local testing

**Deliverables:**
- `playwright.config.ts` (with Web3 wallet support)
- `pytest.ini` (with async support, test database)
- `tests/support/fixtures/` (database, Web3, API factories)
- `.env.test` (test environment variables)

### 6.2 CI/CD Pipeline Setup (CI Workflow)

**Prerequisites:**
- [ ] Run `*ci` workflow to configure GitHub Actions
- [ ] Set up test stages: lint → unit → integration → e2e → security → performance
- [ ] Configure test reporting (coverage, screenshots, videos)

**Deliverables:**
- `.github/workflows/test.yml` (CI pipeline)
- `.github/workflows/security.yml` (npm audit, Slither)
- `.github/workflows/performance.yml` (k6 load tests)
- Codecov or Code Climate integration

### 6.3 Test Data Strategy (Action Item)

**Tasks:**
1. **Download Market Data:**
   - Fetch 1-year OHLCV data for top 5 symbols from Binance
   - Store in `tests/fixtures/market-data/` as CSV files
   - Validate data integrity (gaps, duplicates, OHLC relationships)

2. **Create Factories:**
   - `tests/factories/users.ts` (faker-based user generation)
   - `tests/factories/strategies.ts` (strategy JSON generation)
   - `tests/factories/backtests.ts` (backtest result fixtures)

3. **Implement HAR Replay:**
   - Record critical Binance API responses (OHLCV fetch)
   - Create HAR replay server for deterministic testing
   - Document in `docs/testing/har-replay.md`

---

## 7. Follow-on Workflows (Manual)

**Recommended Next Steps:**

1. **[TF] Initialize Test Framework:**
   - Run `*framework` workflow to scaffold Playwright + pytest
   - Configure Web3 testing (anvil local fork)
   - Set up test fixtures and factories

2. **[CI] Scaffold CI/CD Pipeline:**
   - Run `*ci` workflow to configure GitHub Actions
   - Add stages: lint → unit → integration → e2e → security → performance
   - Configure test reporting (coverage, artifacts)

3. **[AT] Generate ATDD Tests for Epic 1:**
   - After Epic 1 stories are finalized
   - Generate failing E2E tests for critical paths
   - Implement tests during Sprint 1

4. **[NR] Validate NFRs Before MVP Launch:**
   - Run `*nfr-assess` workflow 2 weeks before MVP release
   - Validate all SLOs (backtest <30s, API <200ms, 99%+ uptime)
   - Security audit (smart contracts, penetration test)

---

## Appendix

### Knowledge Base References

- `nfr-criteria.md` - NFR validation approach (security, performance, reliability, maintainability)
- `test-levels-framework.md` - Test level selection guidance (E2E vs API vs Unit)
- `risk-governance.md` - Risk classification framework (6 categories, scoring matrix)
- `test-quality.md` - Test quality standards (determinism, isolation, explicit assertions)

### Related Documents

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Epics: `_bmad-output/planning-artifacts/epics.md`
- UX Design: `_bmad-output/planning-artifacts/ux-design-specification.md`

### Testability Review Summary

**Overall Assessment:** PASS with CONCERNS

**Blockers:** None

**Concerns to Address:**
1. Web3 test environment setup (anvil configuration)
2. Market data test data strategy (HAR replay, fixture data)
3. Parallel test state pollution (store reset)

**Gate Decision:** ✅ **APPROVED FOR SOLUTIONING GATE**

**Condition:** Address 3 concerns in Sprint 0 before Epic 1 implementation

---

**Generated by:** BMad TEA Agent - Test Architect Module
**Workflow:** `_bmad/bmm/testarch/test-design` (System-Level Mode)
**Version:** 4.0 (BMad v6)
