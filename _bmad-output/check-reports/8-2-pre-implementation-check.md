# Pre-Implementation Check Report: Story 8-2-user-management

**Story ID**: 8-2
**Story Name**: 사용자 관리 (User Management)
**Check Date**: 2026-01-19
**Overall Result**: ❌ **GAPS FOUND - 개발 불가능** (Critical missing dependencies)

---

## Executive Summary

Story 8-2-user-management는 **현재 상태로는 개발할 수 없습니다**. 3개의 **Critical Gap Stories**를 먼저 구현해야 합니다.

### 주요 발견사항

1. **🔴 CRITICAL**: users 테이블에 8개의 필수 컬럼 누락
2. **🔴 CRITICAL**: 3개의 필수 테이블 전체 누락 (strategies, revenue_transactions, audit_logs)
3. **🟡 WARNING**: 의존성 깊이가 깊음 (Epic 5, 6 의존)

---

## Layer 1: 문서 로직 검증 (Document Logic Check)

### ✅ FR 커버리지 확인

| FR ID | 설명 | 커버리지 | 비고 |
|-------|------|----------|------|
| FR48 | 사용자 관리 (검색, 상태 변경, 정지) | ✅ 완전 | AC 1-7에서 모두 커버 |
| FR52 | 감사 로그 (모든 관리자 활동 기록) | ⚠️ 부분 | AC 4, 5, 6에서 언급되지만 구현 안됨 |
| NFR6 | API 응답시간 < 200ms | ✅ 완전 | AC 1, 8에서 명시 |
| NFR17 | 7년 보관 (핀테크 규제) | ⚠️ 간접 | Story 8.6(감사 로그)에서 다룸 |

### ✅ 의존성 매핑

Story 8-2가 의존하는 스토리들:

| 의존 Story | 상태 | 필요한 기능 | 검증 결과 |
|-----------|------|------------|-----------|
| 8-1 | ✅ done | Admin Dashboard 기본 구조 | ✅ 구현됨 (/api/admin/dashboard) |
| 8-1-web3-auth-2 | ✅ done | Admin 권한 미들웨어 | ✅ verify_admin_token 존재 |
| 8-1-api-1 | ✅ done | Admin Dashboard API | ✅ /api/admin/dashboard 존재 |
| 8-1-db-1 | ✅ done | users 테이블, role 컬럼 | ⚠️ users 테이블 존재하지만 추가 컬럼 필요 |
| **Epic 5** | ❌ backlog | strategies 테이블 | ❌ 테이블 누락 |
| **Epic 6** | ❌ backlog | revenue_transactions 테이블 | ❌ 테이블 누락 |
| **8-6** | ❌ backlog | audit_logs 테이블 | ❌ 테이블 누락 |

### ⚠️ AC 완결성 확인

**문제가 있는 AC:**
- AC 3 (활동 내역 탭): revenue_transactions, strategies 테이블 필요
- AC 3 (감사 로그 탭): audit_logs 테이블 필요
- AC 4, 5, 6 (상태 변경): users 테이블에 status 관련 컬럼 필요

---

## Layer 2: 실제 구현 상태 검증 (Implementation State Check)

### 🔴 CRITICAL GAPS: 데이터베이스 스키마

#### 1. users 테이블 - 8개 컬럼 누락

**현재 상태:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE,
  role VARCHAR(20),  -- 'user', 'admin'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**누락된 컬럼 (Story 8-2 필수):**

| 컬럼 | 타입 | 목적 | AC 참조 |
|------|------|------|---------|
| `status` | VARCHAR(20) | 사용자 상태 (active/suspended/banned) | AC 1, 4, 5, 6 |
| `suspension_reason` | TEXT | 정지/차단 사유 | AC 4, 5 |
| `suspended_at` | TIMESTAMP | 정지일 | AC 4 |
| `banned_at` | TIMESTAMP | 차단일 | AC 5 |
| `ens_domain` | VARCHAR(100) | ENS 도메인 | AC 1, 3 |
| `total_purchases` | DECIMAL(20,8) | 총 구매액 | AC 1, 3 |
| `total_sales` | DECIMAL(20,8) | 총 판매액 | AC 1, 3 |
| `strategy_count` | INTEGER | 전략 수 | AC 1, 3 |

**영향도:** 🔴 CRITICAL - AC 1, 3, 4, 5, 6 구현 불가

#### 2. 전체 누락 테이블

| 테이블 | 목적 | 소속 Epic | AC 참조 | 상태 |
|--------|------|----------|---------|------|
| `strategies` | 게시된 전략 저장 | Epic 5 | AC 3 | ❌ 존재하지 않음 |
| `revenue_transactions` | 판매/구매 거래 기록 | Epic 5, 6 | AC 3 | ❌ 존재하지 않음 |
| `audit_logs` | 관리자 활동 감사 로그 | Epic 8, Story 8.6 | AC 3, 4, 5, 6 | ❌ 존재하지 않음 |

**영향도:**
- **strategies**: 🔴 CRITICAL - AC 3에서 "전략 수" 계산 불가
- **revenue_transactions**: 🔴 CRITICAL - AC 3에서 "총 구매/판매액" 계산 불가
- **audit_logs**: 🟡 MEDIUM - AC 3의 "감사 로그" 탭 표시 불가 (Story 8.6에서 해결 예정)

#### 3. 인덱스 누락

**누락된 인덱스:**
- `idx_users_status ON users(status, created_at)` - 성능 필수
- `idx_users_wallet ON users(wallet_address)` - 검색 최적화

### 🟡 PARTIAL GAPS: API 엔드포인트

#### 기존 구현 (Story 8-1-api-1)
```
✅ GET /api/admin/dashboard
✅ verify_admin_token 미들웨어
```

#### Story 8-2 필수 엔드포인트 (전체 미구현)

| 엔드포인트 | 목적 | 상태 |
|-----------|------|------|
| GET /api/admin/users | 사용자 목록 (페이지네이션, 검색, 필터) | ❌ 미구현 |
| GET /api/admin/users/{wallet_address} | 사용자 상세 | ❌ 미구현 |
| PUT /api/admin/users/{wallet_address}/status | 상태 변경 | ❌ 미구현 |
| GET /api/admin/users/{wallet_address}/activity | 활동 내역 | ❌ 미구현 |
| GET /api/admin/users/{wallet_address}/strategies | 사용자 전략 목록 | ❌ 미구현 |
| GET /api/admin/users/{wallet_address}/audit-logs | 감사 로그 | ❌ 미구현 |

### ✅ 코드 아티팩트

**존재하는 파일:**
- ✅ `gr8-backend/app/api/admin.py` (Admin Dashboard API)
- ✅ `gr8-backend/app/middleware/admin_auth.py` (verify_admin_token)
- ✅ `gr8-backend/app/models/user.py` (User 모델)
- ✅ `gr8-backend/app/schemas/admin.py` (Admin 스키마)

---

## Layer 3: 의존성 그래프 분석 (Dependency Graph Analysis)

### ✅ 순환 의존성

- **결과**: ❌ 없음
- **분석**: Story 8-2는 8-1에 의존하지만, 8-1은 8-2에 의존하지 않음 (안전)

### ⚠️ 의존성 깊이 (Dependency Depth)

```
Story 8-2 (User Management)
  ├─ Story 8-1 (Admin Dashboard) ✅ depth=1
  ├─ Story 8-1-db-1 (users 테이블) ✅ depth=1
  ├─ Story 8-1-web3-auth-2 (Admin 미들웨어) ✅ depth=1
  ├─ Story 8-1-api-1 (Admin API) ✅ depth=1
  ├─ Epic 5 (Strategy Marketplace) ❌ depth=∞ (backlog)
  │   └─ Story 5-4 (Strategy Publishing) ❌
  │   └─ Story 5-6 (Strategy Purchase) ❌
  ├─ Epic 6 (Creator Rewards) ❌ depth=∞ (backlog)
  │   └─ Story 6-3 (Revenue Distribution) ❌
  └─ Story 8-6 (Audit Log) ❌ depth=1 (backlog)
```

**문제점:**
- Epic 5와 Epic 6이 전체 backlog 상태
- Story 8-2는 Epic 5/6의 기능(전략, 거래)을 표시하려 함
- **의존성 깊이**: 이론적으로 무한대 (해결되지 않은 Epic에 의존)

### ✅ Fan-out 분석

- **Story 8-2가 의존하는 대상**: 7개 (8-1, 8-1-db-1, 8-1-web3-auth-2, 8-1-api-1, Epic 5, Epic 6, 8-6)
- **결과**: ⚠️ WARNING - 5개 이상 의존 (관리 복잡도 증가)

---

## Gap 분석 및 해결 방안

### Gap 1: users 테이블 컬럼 누락 🔴 CRITICAL

**영향 받는 AC:**
- AC 1 (status, ens_domain, total_purchases, total_sales, strategy_count)
- AC 3 (status)
- AC 4 (status, suspension_reason, suspended_at)
- AC 5 (status, suspension_reason, banned_at)
- AC 6 (status)

**해결 방안:** **Gap Story 8-2-db-1 생성**

내용:
1. users 테이블에 8개 컬럼 추가
2. Alembic 마이그레이션 생성
3. 인덱스 추가 (idx_users_status, idx_users_wallet)
4. 기존 데이터 마이그레이션 (status='active'로 기본값 설정)

### Gap 2: strategies, revenue_transactions 테이블 누락 🔴 CRITICAL

**영향 받는 AC:**
- AC 1 (total_purchases, total_sales, strategy_count)
- AC 3 (활동 내역, 전략 목록)

**해결 방안:** **2가지 옵션**

#### 옵션 A: 완전 구현 (권장하지 않음)
- Epic 5와 Epic 6를 먼저 완전히 구현
- 단점: 너무 많은 선행 작업, Story 8-2 지연

#### 옵션 B: 최소 구현 (권장) ✅
**Gap Story 8-2-db-2 생성**: 스텁(stub) 테이블 생성

내용:
1. strategies 테이블 (최소 스키마):
   - id, creator_address, name, is_published, created_at
2. revenue_transactions 테이블 (최소 스키마):
   - id, strategy_id, creator_address, buyer_address, amount, created_at
3. users 테이블에 total_purchases, total_sales, strategy_count 컬럼 추가
   - 트리거로 자동 계산 (또는 백엔드 로직으로 계산)

**장점:**
- Story 8-2 즉시 개발 가능
- Epic 5/6 구현 시 테이블 확장
- 최소한의 기능으로 AC 충족

### Gap 3: audit_logs 테이블 누락 🟡 MEDIUM

**영향 받는 AC:**
- AC 3 (감사 로그 탭)
- AC 4, 5, 6 (감사 로그 기록 요구)

**해결 방안:** **Story 8-6(감사 로그) 먼저 구현 또는 스텁 구현**

#### 옵션 A: Story 8-6 먼저 구현 (권장) ✅
- Story 8-6을 우선순위로 상향 조정
- audit_logs 테이블 생성
- 감사 로그 미들웨어 구현
- Story 8-2에서 이를 활용

#### 옵션 B: 스텁 구현
- audit_logs 테이블을 최소 스키마로 생성
- Story 8-6에서 확장

**권장:** 옵션 A (Story 8-6 우선 구현)

---

## 보완 Stories (Gap-Filler Stories) 제안

### 8-2-db-1: users 테이블 상태 관리 컬럼 추가 (CRITICAL)

**Status:** ready-for-dev (이 스토리 생성 후)

**목적:** Story 8-2의 AC 1, 3, 4, 5, 6 구현을 위한 users 테이블 확장

**작업:**
1. users 테이블에 컬럼 추가:
   - status VARCHAR(20) DEFAULT 'active'
   - ens_domain VARCHAR(100)
   - suspension_reason TEXT
   - suspended_at TIMESTAMP
   - banned_at TIMESTAMP
2. 인덱스 추가:
   - idx_users_status ON users(status, created_at)
   - idx_users_wallet ON users(wallet_address)
3. User 모델 업데이트
4. 기존 사용자 데이터 마이그레이션 (status='active')

**의존성:**
- 선행: 8-1-db-1 (users 테이블 기본)
- 후속: 8-2 (User Management)

**예상 소요 시간:** 1-2시간

---

### 8-2-db-2: 거래 및 전략 스텁 테이블 생성 (CRITICAL)

**Status:** ready-for-dev (이 스토리 생성 후)

**목적:** Story 8-2의 AC 1, 3 구현을 위한 최소 테이블 구조 제공

**작업:**
1. strategies 테이블 생성 (최소 스키마):
   ```sql
   CREATE TABLE strategies (
     id VARCHAR(50) PRIMARY KEY,
     creator_address VARCHAR(50) NOT NULL,
     name VARCHAR(200),
     is_published BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (creator_address) REFERENCES users(wallet_address)
   );
   CREATE INDEX idx_strategies_creator ON strategies(creator_address, created_at);
   ```

2. revenue_transactions 테이블 생성 (최소 스키마):
   ```sql
   CREATE TABLE revenue_transactions (
     id SERIAL PRIMARY KEY,
     strategy_id VARCHAR(50),
     creator_address VARCHAR(50) NOT NULL,
     buyer_address VARCHAR(50) NOT NULL,
     amount DECIMAL(20, 8) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (creator_address) REFERENCES users(wallet_address),
     FOREIGN KEY (buyer_address) REFERENCES users(wallet_address)
   );
   CREATE INDEX idx_revenue_creator ON revenue_transactions(creator_address, created_at);
   CREATE INDEX idx_revenue_buyer ON revenue_transactions(buyer_address, created_at);
   ```

3. users 테이블에 계산 컬럼 추가:
   - total_purchases DECIMAL(20, 8) DEFAULT 0
   - total_sales DECIMAL(20, 8) DEFAULT 0
   - strategy_count INTEGER DEFAULT 0

4. SQLAlchemy 모델 생성:
   - Strategy 모델
   - RevenueTransaction 모델

**참고:**
- 이 스토리는 Epic 5/6의 완전한 구현을 대체하는 **스텁(placeholder)**입니다
- Epic 5/6 구현 시 테이블을 확장해야 합니다
- 당분간 Story 8-2의 기능을 지원하는 최소 구조입니다

**의존성:**
- 선행: 8-2-db-1
- 후속: 8-2 (User Management), Epic 5, Epic 6

**예상 소요 시간:** 2-3시간

---

### 8-6: 감사 로그 (Audit Log) - 우선 구현 권장 🟡

**참고:** 이 스토리는 원래 Epic 8의 Story 8.6으로 계획되어 있었습니다.

**권장 사항:** Story 8-2보다 **먼저** 구현하십시오.

**목적:** 모든 관리자 활동을 감사 로그로 기록 (FR52, NFR17)

**작업 (개요):**
1. audit_logs 테이블 생성
2. 감사 로그 미들웨어 구현
3. 로깅 데코레이터 구현
4. Story 8-2의 AC 4, 5, 6에서 감사 로그 기록

**상세 내용:** epics.md Story 8.6 참조

---

## 실행 계획 (Execution Plan)

### Phase 1: 필수 Gap Stories 구현

**순서:**
1. ✅ **8-2-db-1** (users 테이블 확장) - 1-2시간
2. ✅ **8-2-db-2** (스텁 테이블 생성) - 2-3시간
3. ✅ **8-6** (감사 로그) - 4-6시간

**총 예상 시간:** 7-11시간 (하루 작업 분량)

### Phase 2: Story 8-2 개발

**선행 조건:**
- [ ] 8-2-db-1: done
- [ ] 8-2-db-2: done
- [ ] 8-6: done (선택 사항이지만 권장)

**Story 8-2 시작 가능 시점:** Phase 1 완료 후

---

## 최종 권장 사항

### 1. 즉시 실행 (Immediate Actions)

1. **Gap Story 8-2-db-1 생성** (CRITICAL)
2. **Gap Story 8-2-db-2 생성** (CRITICAL)
3. **Story 8-6을 8-2보다 먼저 구현** (RECOMMENDED)

### 2. Sprint Status 업데이트

현재:
```yaml
8-2-user-management: ready-for-dev
```

변경 권장:
```yaml
8-2-db-1: ready-for-dev  # NEW - users 테이블 상태 관리 컬럼 추가
8-2-db-2: ready-for-dev  # NEW - 거래 및 전략 스텁 테이블 생성
8-6: ready-for-dev      # PRIORITY - 감사 로그 (Story 8.6 우선)
8-2-user-management: blocked # Blocked until 8-2-db-1, 8-2-db-2 done
```

### 3. Story 8-2 수정 사항

Story 8-2의 Dev Notes에 다음을 추가:
- **의존성**: 8-2-db-1, 8-2-db-2, 8-6(권장)
- **데이터베이스**: Gap Stories 완료 후 스키마 확인

---

## 결론 (Conclusion)

### 검증 결과: ❌ **GAPS FOUND - 개발 불가능**

Story 8-2-user-management는 **현재 상태로는 개발할 수 없습니다**.

### 주요 이유:
1. 🔴 users 테이블에 8개의 필수 컬럼 누락
2. 🔴 strategies, revenue_transactions 테이블 전체 누락
3. 🟡 audit_logs 테이블 누락 (Story 8.6)

### 해결 방안:
1. **Gap Story 8-2-db-1** 생성 및 구현 (CRITICAL)
2. **Gap Story 8-2-db-2** 생성 및 구현 (CRITICAL)
3. **Story 8-6** 우선 구현 (RECOMMENDED)

### 다음 단계:
1. 이 리포트를 검토하세요
2. Gap Stories 생성을 승인하세요
3. Gap Stories를 먼저 구현하세요
4. Story 8-2를 개발하세요

---

**리포트 생성일:** 2026-01-19
**검증자:** Bob (Scrum Master Agent)
**승인 대기**
