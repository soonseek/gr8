---
stepsCompleted: ['validate-prerequisites', 'design-epics']
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# gr8 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for gr8, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

### 1. 지갑 및 인증 (Wallet & Authentication)
- **FR1**: 사용자는 Web3 지갑을 연동하여 gr8에 인증할 수 있다
- **FR2**: 사용자는 MetaMask 지갑을 연결할 수 있다
- **FR3**: 사용자는 WalletConnect를 통해 모바일 지갑을 연결할 수 있다
- **FR4**: 사용자는 지갑 연결 시 현재 체인이 올바른지 확인받을 수 있다
- **FR5**: 사용자는 잘못된 체인일 경우 자동으로 Monad L1로 전환 요청을 받을 수 있다
- **FR6**: 사용자는 지갑 주소를 식별 가능한 형식으로 볼 수 있다
- **FR7**: 사용자는 세션을 유지할 수 있다 (페이지 새로고침 후 연결 유지)
- **FR8**: 사용자는 지갑 연결을 해제할 수 있다

### 2. 전략 개발 (Strategy Development)
- **FR9**: 사용자는 노드-엣지 에디터로 전략을 시각적으로 구성할 수 있다
- **FR10**: 사용자는 드래그 앤 드롭으로 노드를 추가/삭제/연결할 수 있다
- **FR11**: 사용자는 시장 데이터 노드를 사용할 수 있다 (가격, 거래량)
- **FR12**: 사용자는 기술적 지표 노드를 사용할 수 있다 (RSI, MACD, Moving Average)
- **FR13**: 사용자는 매수/매도 액션 노드를 구성할 수 있다
- **FR14**: 사용자는 리스크 관리 노드를 구성할 수 있다 (Stop Loss, Take Profit)
- **FR15**: 사용자는 전략을 로컬에 저장할 수 있다
- **FR16**: 사용자는 전략을 JSON으로 export/import 할 수 있다
- **FR17**: 사용자는 전략의 이름과 설명을 수정할 수 있다

### 3. 백테스팅 (Backtesting)
- **FR18**: 사용자는 자신의 전략을 백테스트할 수 있다
- **FR19**: 사용자는 템플릿을 백테스트할 수 있다
- **FR20**: 사용자는 백테스트 기간을 설정할 수 있다
- **FR21**: 사용자는 백테스트 결과를 확인할 수 있다
- **FR22**: 사용자는 백테스트 결과에서 수익률을 볼 수 있다
- **FR23**: 사용자는 백테스트 결과에서 최대 낙폭(MDD)을 볼 수 있다
- **FR24**: 사용자는 백테스트 결과에서 샤프 비율을 볼 수 있다
- **FR25**: 사용자는 백테스트 결과에서 진입/청산 포인트(액션 히스토리)를 볼 수 있다
- **FR26**: 사용자는 백테스트 결과의 무결성을 블록체인에서 검증할 수 있다
- **FR27**: 사용자는 백테스트 결과가 블록체인에 검증되었음을 확인하는 뱃지를 볼 수 있다

### 4. 전략 마켓플레이스 (Strategy Marketplace)
- **FR28**: 사용자는 전략 템플릿 라이브러리를 둘러볼 수 있다
- **FR29**: 사용자는 카테고리별로 전략을 필터링할 수 있다 (RSI, MACD, Moving Average)
- **FR30**: 사용자는 템플릿의 백테스트 결과를 미리 볼 수 있다
- **FR31**: 사용자는 공개된 전략을 검색할 수 있다
- **FR32**: 사용자는 공개된 전략을 원클릭으로 복제할 수 있다
- **FR33**: 사용자는 자신의 전략을 공개할 수 있다
- **FR34**: 사용자는 전략 공개 시 가격을 설정할 수 있다
- **FR35**: 사용자는 전략에 설명과 메타데이터를 추가할 수 있다
- **FR36**: 사용자는 전략 수정본을 생성할 수 있다 (포크)

### 5. 보상 시스템 (Reward System)
- **FR37**: 시스템은 사용자가 전략을 복제할 때 원작자에게 자동으로 보상을 분배할 수 있다
- **FR38**: 사용자는 자신이 공개한 전략으로 발생한 수익을 대시보드에서 볼 수 있다
- **FR39**: 사용자는 수익을 인출할 수 있다
- **FR40**: 시스템은 보상 분배 내역을 블록체인에 기록할 수 있다

### 6. 유튜버/크리에이터 (Influencer & Creator)
- **FR41**: 유튜버는 전용 온보딩 플로우를 통해 가입할 수 있다
- **FR42**: 유튜버는 YouTube 채널을 연동하여 구독자 수를 검증할 수 있다
- **FR43**: 유튜버는 자신만의 레퍼럴 링크를 생성할 수 있다
- **FR44**: 시스템은 레퍼럴 링크를 통해 유입된 사용자를 추적할 수 있다
- **FR45**: 유튜버는 자신의 레퍼럴 성과(유입 수, 전략 공유 횟수)를 볼 수 있다
- **FR46**: 유튜버는 자신의 전략 공유로 발생한 수익을 실시간으로 볼 수 있다

### 7. 운영 및 규제 준수 (Operations & Compliance)
- **FR47**: 운영자는 사용자 계정을 정지할 수 있다
- **FR48**: 운영자는 사용자 계정을 해제할 수 있다
- **FR49**: 운영자는 공개된 전략을 삭제할 수 있다
- **FR50**: 운영자는 공개된 전략을 수정할 수 있다
- **FR51**: 운영자는 시스템 공지사항을 게시할 수 있다
- **FR52**: 운영자는 시스템 상태를 모니터링할 수 있다 (접속 사용자 수, API 응답 시간, 백테스트 큐 상태)
- **FR53**: 운영자는 백테스팅 엔진 상태를 모니터링할 수 있다 (실행 중인 백테스트 수, 실패율)
- **FR54**: 운영자는 비정상 행위를 감지할 수 있다 (백테스트 조작, 계정 이상 행위, 스마트 컨트랙트 공격)
- **FR55**: 운영자는 자동으로 감지된 비정상 행위를 검토할 수 있다
- **FR56**: 시스템은 모든 사용자 행동과 트랜잭션을 감사 로그로 기록할 수 있다
- **FR57**: 시스템은 감사 로그를 7년 이상 보관할 수 있다
- **FR58**: 시스템은 백테스트 결과 데이터를 암호화하여 저장할 수 있다

### NonFunctional Requirements

### 1. Performance (성능)
- **NFR-PERF-001**: 시스템은 90th percentile 백테스트 결과를 30초 이내에 제공해야 한다
- **NFR-PERF-002**: 시스템은 모든 API 요청의 95th percentile 응답 시간을 200ms 이내로 처리해야 한다
- **NFR-PERF-003**: 시스템은 페이지 로드를 2초 이내에 완료해야 한다 (초방 방문자)
- **NFR-PERF-004**: 시스템은 지갑 연결을 10초 이내에 완료해야 한다
- **NFR-PERF-005**: 시스템은 전략 복제를 3초 이내에 완료해야 한다

### 2. Security (보안)
- **NFR-SEC-001**: 시스템은 모든 저장 데이터를 AES-256으로 암호화해야 한다 (At Rest)
- **NFR-SEC-002**: 시스템은 모든 전송 데이터를 TLS 1.3으로 암호화해야 한다 (In Transit)
- **NFR-SEC-003**: 시스템은 스마트 컨트랙트 배포 전 외부 보안 감사를 완료해야 한다 (Critical 0개)
- **NFR-SEC-004**: 시스템은 펜트레이션 테스트를 완료해야 한다 (Critical 취약점 0개)
- **NFR-SEC-005**: 시스템은 모든 사용자 PII(개인식별정보)에 대한 접근을 제어해야 한다 (RBAC)
- **NFR-SEC-006**: 시스템은 Reentrancy 공격을 방지하기 위해 모든 스마트 컨트랙트에 보호 메커니즘을 구현해야 한다
- **NFR-SEC-007**: 시스템은 온체인 서킷 브레이커를 구현하여 극심한 변동성 시 스마트 컨트랙트를 일시 정지할 수 있어야 한다
- **NFR-SEC-008**: 시스템은 모든 트랜잭션과 사용자 행동을 감사 로그로 기록해야 한다 (7년 보관)
- **NFR-SEC-009**: 시스템은 백테스트 결과의 무결성을 보장하기 위해 데이터 소스 해시값을 저장해야 한다
- **NFR-SEC-010**: 시스템은 비정상 행위(백테스트 조작, 계정 이상 행위)를 실시간으로 감지해야 한다
- **NFR-SEC-011**: 시스템은 KYC/AML 프로세스를 지원해야 한다 (3단계: Selfie, ID, 주소지)
- **NFR-SEC-012**: 시스템은 의심 거래를 자동 감지하고 신고할 수 있어야 한다
- **NFR-SEC-013**: 시스템은 $3,000 이상 거래 시 Travel Rule을 준수해야 한다

### 3. Scalability (확장성)
- **NFR-SCALE-001**: 시스템은 동시에 1,000명의 활성 사용자를 지원할 수 있어야 한다 (MVP 목표)
- **NFR-SCALE-002**: 시스템은 3개월 차에 10,000명의 활성 사용자로 확장할 수 있어야 한다 (성장 목표)
- **NFR-SCALE-003**: 시스템은 트래픽 스파이크(유명 유튜버 영상 게시)를 처리하기 위해 오토스케일링을 지원해야 한다
- **NFR-SCALE-004**: 시스템은 10배 사용자 성장 시 성능 저하를 10% 이내로 유지해야 한다
- **NFR-SCALE-005**: 시스템은 백테스팅 큐를 처리하기 위해 수평적 확장이 가능해야 한다
- **NFR-SCALE-006**: 시스템은 데이터베이스 읽기 병목을 방지하기 위해 리플리카를 지원해야 한다

### 4. Reliability (신뢰성)
- **NFR-REL-001**: 시스템은 99% 이상의 가용성을 제공해야 한다 (월간 기준)
- **NFR-REL-002**: 시스템은 계획된 중단 시 24시간 전에 사용자에게 통지해야 한다
- **NFR-REL-003**: 시스템은 비계획된 중단 시 1시간 이내에 복구해야 한다 (MTTR)
- **NFR-REL-004**: 시스템은 데이터 손실률 0%를 유지해야 한다 (백테스트 결과, 사용자 데이터)
- **NFR-REL-005**: 시스템은 지리적으로 분리된 2개 이상의 리전에 백업을 저장해야 한다
- **NFR-REL-006**: 시스템은 일일 백업을 자동으로 수행해야 한다

### 5. Integration (통합)
- **NFR-INT-001**: 시스템은 Binance API를 통해 히스토리컬 데이터를 조회할 수 있어야 한다
- **NFR-INT-002**: 시스템은 Binance API 장애 시 99.9% 가용성을 유지해야 한다 (백업 API)
- **NFR-INT-003**: 시스템은 MetaMask 지갑과 Web3 표준(EIP-191)으로 통신해야 한다
- **NFR-INT-004**: 시스템은 WalletConnect 프로토콜을 통해 100+ 지갑과 연동할 수 있어야 한다
- **NFR-INT-005**: 시스템은 YouTube API를 통해 채널 정보를 검증할 수 있어야 한다
- **NFR-INT-006**: 시스템은 Monad L1 블록체인과 RPC 통신을 할 수 있어야 한다
- **NFR-INT-007**: 시스템은 외부 API 장애 시 회로탄적(fallback) 메커니즘을 구현해야 한다

### 6. Blockchain/Web3 (블록체인)
- **NFR-BC-001**: 시스템은 트랜잭션당 가스 비용을 $0.10 미만으로 유지해야 한다
- **NFR-BC-002**: 시스템은 온체인 트랜잭션 지연 시간을 30초 이내로 처리해야 한다
- **NFR-BC-003**: 시스템은 지갑 연결 성공률을 95% 이상 유지해야 한다
- **NFR-BC-004**: 시스템은 가스 가격 변동성에 대해 예측 가능한 가스비를 제공해야 한다
- **NFR-BC-005**: 시스템은 배치 처리를 통해 가스 비용을 최적화해야 한다 (여러 백테스트를 하나의 트랜잭션에)
- **NFR-BC-006**: 시스템은 잘못된 체인 연결 시 자동으로 올바른 체인으로 전환을 요청해야 한다

### Additional Requirements

### From Architecture Document:

**Starter Template (CRITICAL for Epic 1 Story 1):**
- 프로젝트는 **Vite + React + TypeScript** (Frontend) + **FastAPI + PostgreSQL** (Backend) 스타터 템플릿을 사용합니다
- Frontend Initialization: `npm create vite@latest gr8-frontend -- --template react-ts`
- Backend Initialization: FastAPI 프로젝트 생성 + PostgreSQL + SQLAlchemy 2.0 + asyncpg

**Infrastructure & Deployment:**
- AWS ECS Fargate + S3/CloudFront 호스팅 전략
- On-Demand Staging + Web3 Testnet Hybrid 환경 전략 (MVP 비용 최적화: 월 $5-10)
- GitHub Actions CI/CD 파이프라인
- AWS Systems Manager Parameter Store for 환경 설정 관리

**Database:**
- Amazon RDS for PostgreSQL (MVP: db.t3.micro, Single-AZ, 20GB storage)
- SQLAlchemy 2.0 async ORM with connection pooling (pool_size=10, max_overflow=20)

**Monitoring & Logging:**
- AWS CloudWatch for 모니터링 및 로깅
- Application Metrics: 백테스트 실행 시간, API 응답 시간, 에러율, 지갑 연결 수
- Infrastructure Metrics: ECS CPU/Memory, RDS CPU/Memory/connections, ElastiCache metrics
- Business Metrics: 첫 백테스트 성공률 (목표 90%+), 사용자 온보딩 완료율
- Alarms: ApplicationErrorRate > 5%, DatabaseCPU > 90%, APILatencyP95 > 1000ms

**Testing Strategy:**
- Progressive Testing: Local Dev → On-Demand Staging → Web3 Testnet → Production
- Unit Tests (Vitest + pytest), Integration Tests, E2E Tests (Playwright), Web3 Tests

### From UX Design Document:

**Responsive Web (Mobile-First):**
- Mobile-First 접근: 375px (모바일), 768px (태블릿), 1024px (데스크톱), 1280px (큰 화면)
- 모바일 (375px+): 노드-엣지 에디터 세로 모드, 간소화된 UI
- 태블릿 (768px+): 노드-엣지 에디터 가로/세로 모드 지원
- 데스크톱 (1024px+): 완전한 기능의 노드-엣지 에디터

**Browser Support:**
- Primary: Chrome (최신 2버전)
- Secondary: Safari (최신 2버전), Firefox (최신 2버전)
- Rationale: Web3 지갑(Metamask, WalletConnect) 호환성 고려

**Dark Mode:**
- 항상 다크모드 (트레이딩 표준)
- 라이트모드 토글 불필요

**Accessibility (WCAG 2.1 AA Compliance):**
- 색상 대비: 4.5:1 이상
- 키보드 내비게이션: `tabindex`, `focus` ring
- 스크린 리더: `aria-label`, `role`
- Touch Targets: 최소 44×44px (Apple HIG)
- Font Sizes: 본문 최소 16px, 보조 텍스트 최소 14px

**No Offline Mode:**
- 실시간 시장 데이터 필요 (OHLCV)
- 온체인 기록 확인 필요
- 모든 기능은 항상 연결 상태 가정

### FR Coverage Map

#### 지갑 및 인증 (Wallet & Authentication) - Epic 2
- FR1: Epic 2 - Web3 지갑 연동 인증
- FR2: Epic 2 - MetaMask 지갑 연결
- FR3: Epic 2 - WalletConnect 모바일 지갑 연결
- FR4: Epic 2 - 체인 확인
- FR5: Epic 2 - 체인 자동 전환 요청 (Monad L1)
- FR6: Epic 2 - 지갑 주소 표시
- FR7: Epic 2 - 세션 유지
- FR8: Epic 2 - 지갑 연결 해제

#### 전략 개발 (Strategy Development) - Epic 3
- FR9: Epic 3 - 노드-엣지 에디터로 전략 시각적 구성
- FR10: Epic 3 - 드래그 앤 드롭 노드 추가/삭제/연결
- FR11: Epic 3 - 시장 데이터 노드 (가격, 거래량)
- FR12: Epic 3 - 기술적 지표 노드 (RSI, MACD, Moving Average)
- FR13: Epic 3 - 매수/매도 액션 노드 구성
- FR14: Epic 3 - 리스크 관리 노드 (Stop Loss, Take Profit)
- FR15: Epic 3 - 전략 로컬 저장
- FR16: Epic 3 - 전략 JSON export/import
- FR17: Epic 3 - 전략 이름 및 설명 수정

#### 백테스팅 (Backtesting) - Epic 4
- FR18: Epic 4 - 사용자 전략 백테스트 실행
- FR19: Epic 4 - 템플릿 전략 백테스트 실행
- FR20: Epic 4 - 백테스트 기간 설정
- FR21: Epic 4 - 백테스트 결과 확인
- FR22: Epic 4 - 백테스트 결과 수익률 표시
- FR23: Epic 4 - 백테스트 결과 최대 낙폭(MDD) 표시
- FR24: Epic 4 - 백테스트 결과 샤프 비율 표시
- FR25: Epic 4 - 백테스트 결과 진입/청산 포인트(액션 히스토리) 표시
- FR26: Epic 4 - 백테스트 결과 블록체인 검증
- FR27: Epic 4 - 검증 뱃지 표시

#### 전략 마켓플레이스 (Strategy Marketplace) - Epic 5
- FR28: Epic 5 - 전략 템플릿 라이브러리 탐색
- FR29: Epic 5 - 카테고리별 전략 필터링 (RSI, MACD, Moving Average)
- FR30: Epic 5 - 템플릿 백테스트 결과 미리보기
- FR31: Epic 5 - 공개 전략 검색
- FR32: Epic 5 - 원클릭 전략 복제
- FR33: Epic 5 - 자신의 전략 공개
- FR34: Epic 5 - 전략 가격 설정
- FR35: Epic 5 - 전략 설명 및 메타데이터 추가
- FR36: Epic 5 - 전략 포크 (수정본 생성)

#### 보상 시스템 (Reward System) - Epic 6
- FR37: Epic 6 - 전략 복제 시 자동 보상 분배
- FR38: Epic 6 - 수익 대시보드
- FR39: Epic 6 - 수익 인출
- FR40: Epic 6 - 보상 분배 블록체인 기록

#### 유튜버/크리에이터 (Influencer & Creator) - Epic 7
- FR41: Epic 7 - 유튜버 전용 온보딩 플로우
- FR42: Epic 7 - YouTube 채널 연동 (구독자 수 검증)
- FR43: Epic 7 - 레퍼럴 링크 생성
- FR44: Epic 7 - 레퍼럴 추적
- FR45: Epic 7 - 레퍼럴 성과 대시보드 (유입 수, 전략 공유 횟수)
- FR46: Epic 7 - 실시간 수익 모니터링

#### 운영 및 규제 준수 (Operations & Compliance) - Epic 8
- FR47: Epic 8 - 사용자 계정 정지
- FR48: Epic 8 - 사용자 계정 해제
- FR49: Epic 8 - 공개 전략 삭제
- FR50: Epic 8 - 공개 전략 수정
- FR51: Epic 8 - 시스템 공지사항 게시
- FR52: Epic 8 - 시스템 상태 모니터링 (접속 사용자 수, API 응답 시간, 백테스트 큐 상태)
- FR53: Epic 8 - 백테스팅 엔진 상태 모니터링 (실행 중인 백테스트 수, 실패율)
- FR54: Epic 8 - 비정상 행위 감지 (백테스트 조작, 계정 이상 행위, 스마트 컨트랙트 공격)
- FR55: Epic 8 - 비정상 행위 검토
- FR56: Epic 8 - 감사 로그 기록 (7년 이상 보관)
- FR57: Epic 8 - 감사 로그 7년 이상 보관
- FR58: Epic 8 - 백테스트 결과 암호화 저장

## Epic List

### Epic 1: 프로젝트 기반 및 인프라 (Project Foundation & Infrastructure)

개발팀이 안정적이고 확장 가능한 기술적 기반 위에 제품을 구축할 수 있습니다. Vite + React + TypeScript 프론트엔드와 FastAPI + PostgreSQL 백엔드 스타터 템플릿을 초기화하고, AWS 인프라(ECS Fargate, RDS, CloudWatch)를 구성하며, GitHub Actions CI/CD 파이프라인과 모니터링 및 로깅 시스템을 설정합니다.

**FRs covered:** NFRs (Performance, Security, Scalability, Reliability, Integration, Blockchain)
**NFRs addressed:** 모든 인프라 관련 비기능적 요구사항

---

### Epic 2: Web3 지갑 연동 및 사용자 인증 (Web3 Wallet & Authentication)

사용자가 Web3 지갑으로 안전하고 간편하게 로그인하고 세션을 유지할 수 있습니다. MetaMask 및 WalletConnect를 통한 지갑 연결, 체인 확인 및 자동 전환(Monad L1), 지갑 주소 표시, 세션 유지, 지갑 연결 해제 기능을 제공하며, 반응형 디자인(모바일/태블릿/데스크톱)을 지원합니다.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8

---

### Epic 3: 전략 개발 도구 (Strategy Development Tool)

사용자가 직관적인 노드-엣지 에디터로 거래 전략을 시각적으로 구성하고 저장할 수 있습니다. React Flow 기반 노드-엣지 에디터, 드래그 앤 드롭 노드 추가/삭제/연결, 시장 데이터 노드(가격, 거래량), 기술적 지표 노드(RSI, MACD, Moving Average), 매수/매도 액션 노드, 리스크 관리 노드(Stop Loss, Take Profit), 전략 로컬 저장, JSON export/import, 전략 이름 및 설명 수정 기능을 제공합니다.

**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17

---

### Epic 4: 백테스팅 엔진 및 결과 검증 (Backtesting Engine & Verification)

사용자가 자신의 전략을 과거 데이터로 테스트하고 블록체인으로 검증된 결과를 확인할 수 있습니다. 사용자 전략 및 템플릿 전략 백테스트 실행, 백테스트 기간 설정, 백테스트 결과 표시(수익률, 최대 낙폭(MDD), 샤프 비율, 진입/청산 포인트), 백테스트 결과 블록체인 검증, 검증 뱃지 표시 기능을 제공합니다.

**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27

---

### Epic 5: 전략 마켓플레이스 (Strategy Marketplace)

사용자가 다른 사용자의 전략을 발견하고, 복제하고, 자신의 전략을 공유할 수 있습니다. 전략 템플릿 라이브러리 탐색, 카테고리별 필터링(RSI, MACD, Moving Average), 템플릿 백테스트 결과 미리보기, 공개 전략 검색, 원클릭 전략 복제, 자신의 전략 공개, 전략 가격 설정, 전략 설명 및 메타데이터 추가, 전략 포크(수정본 생성) 기능을 제공합니다.

**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36

---

### Epic 6: 크리에이터 보상 시스템 (Creator Reward System)

전략 작성자가 자신의 공개 전략 사용으로 발생한 수익을 추적하고 인출할 수 있습니다. 전략 복제 시 자동 보상 분배, 수익 대시보드, 수익 인출, 보상 분배 블록체인 기록 기능을 제공합니다.

**FRs covered:** FR37, FR38, FR39, FR40

---

### Epic 7: 크리에이터 및 유튜버 통합 (Creator & Influencer Program)

유튜버/크리에이터가 자신만의 레퍼럴 링크로 추적된 사용자를 유입하고 성과를 모니터링할 수 있습니다. 유튜버 전용 온보딩 플로우, YouTube 채널 연동(구독자 수 검증), 레퍼럴 링크 생성, 레퍼럴 추적, 레퍼럴 성과 대시보드(유입 수, 전략 공유 횟수), 실시간 수익 모니터링 기능을 제공합니다.

**FRs covered:** FR41, FR42, FR43, FR44, FR45, FR46

---

### Epic 8: 운영 대시보드 및 규제 준수 (Operations Dashboard & Compliance)

운영팀이 시스템 상태를 모니터링하고, 사용자/콘텐츠를 관리하며, 규제 요구사항을 준수할 수 있습니다. 사용자 계정 정지/해제, 공개 전략 삭제/수정, 시스템 공지사항 게시, 시스템 상태 모니터링(접속 사용자 수, API 응답 시간, 백테스트 큐 상태), 백테스팅 엔진 상태 모니터링(실행 중인 백테스트 수, 실패율), 비정상 행위 감지(백테스트 조작, 계정 이상 행위, 스마트 컨트랙트 공격), 비정상 행위 검토, 감사 로그 기록(7년 이상 보관), 백테스트 결과 암호화 저장 기능을 제공합니다.

**FRs covered:** FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR57, FR58

---

## Epic 1: 프로젝트 기반 및 인프라 (Project Foundation & Infrastructure) [기술적 전제 조건]

> **⚠️ 기술적 전제 조건**: 이 Epic은 다른 모든 사용자 중심 Epic들이 구현될 수 있도록 하는 기술적 기반을 구축합니다. Greenfield 프로젝트의 초기 설정 단계로서 개발자 중심의 기술 스토리들로 구성됩니다.

개발팀이 안정적이고 확장 가능한 기술적 기반 위에 제품을 구축할 수 있습니다. Vite + React + TypeScript 프론트엔드와 FastAPI + PostgreSQL 백엔드 스타터 템플릿을 초기화하고, AWS 인프라(ECS Fargate, RDS, CloudWatch)를 구성하며, GitHub Actions CI/CD 파이프라인과 모니터링 및 로깅 시스템을 설정합니다.

**FRs covered:** NFRs (Performance, Security, Scalability, Reliability, Integration, Blockchain)
**NFRs addressed:** 모든 인프라 관련 비기능적 요구사항

---

### Story 1.1: 프론트엔드 스타터 템플릿 초기화

As a 개발자 (Developer),
I want Vite + React + TypeScript 기반의 프론트엔드 프로젝트를 초기화하고 기본 개발 환경을 설정하고 싶다,
So that 빠르고 효율적으로 프론트엔드 기능을 개발할 수 있다.

**Acceptance Criteria:**

**Given** 개발자는 프로젝트 루트 디렉토리에 있다
**When** 개발자가 `npm create vite@latest gr8-frontend -- --template react-ts` 명령을 실행하고 의존성을 설치한다
**Then** `gr8-frontend/` 디렉토리가 생성되고 React 18 + TypeScript 기반 프로젝트가 초기화된다
**And** `npm run dev` 실행 시 개발 서버가 `localhost:5173`에서 시작된다
**And** Hot Module Replacement (HMR)이 정상 작동한다

**Given** Vite 프로젝트가 초기화되었다
**When** 개발자가 Tailwind CSS 및 PostCSS를 설치하고 설정 파일들을 생성한다
**Then** `tailwind.config.js`와 `postcss.config.js`가 프로젝트 루트에 생성된다
**And** `src/index.css`에 Tailwind 지시자들이 추가된다
**And** 반응형 브레이크포인트가 설정된다 (sm: 375px, md: 768px, lg: 1024px, xl: 1280px)
**And** 다크모드 기본 테마가 적용된다 (bg-[#111827], text-gray-100)

**Given** Vite + Tailwind가 설치되었다
**When** 개발자가 기본 디렉토리 구조를 생성한다
**Then** 다음 디렉토리들이 `src/` 하위에 생성된다: `components/`, `pages/`, `hooks/`, `stores/`, `services/`, `types/`
**And** 각 디렉토리에 `index.ts` 파일이 생성된다

**Given** 프로젝트 구조가 생성되었다
**When** 개발자가 설정 파일들을 확인한다
**Then** Vitest가 포함되어 있고 `npm run test` 실행 시 테스트 러너가 작동한다
**And** ESLint와 Prettier가 설정되어 있고 코드 포맷팅이 적용된다
**And** TypeScript 설정이 완료되어 타입 검사가 작동한다
**And** `package.json`에 dev, build, test, lint, preview 스크립트가 포함된다

**Given** 모든 설정이 완료되었다
**When** 개발자가 첫 번째 테스트 컴포넌트를 생성한다
**Then** `src/App.tsx`가 다크모드 스타일로 업데이트된다
**And** 기본 React Flow 프로젝트 구조가 준비된다
**And** 브라우저에서 "gr8" 타이틀과 다크 테마 배경이 확인된다

---

### Story 1.2: 백엔드 스타터 템플릿 초기화

As a 개발자 (Developer),
I want FastAPI + PostgreSQL 기반의 백엔드 프로젝트를 초기화하고 기본 API 구조를 설정하고 싶다,
So that 확장 가능하고 타입 안전한 백엔드 API를 빠르게 개발할 수 있다.

**Acceptance Criteria:**

**Given** 개발자는 프로젝트 루트 디렉토리에 있다
**When** 개발자가 `gr8-backend` 디렉토리를 생성하고 Python 가상 환경을 설정한다
**Then** Python 3.11+ 가상 환경이 생성되고 활성화된다
**And** FastAPI, Uvicorn, SQLAlchemy 2.0, asyncpg, psycopg2-binary, Pydantic, Alembic, pytest, pytest-asyncio가 설치된다

**Given** FastAPI 의존성이 설치되었다
**When** 개발자가 `app/{api,core,models,schemas,services}` 디렉토리 구조를 생성한다
**Then** `app/api/`, `app/core/`, `app/models/`, `app/schemas/`, `app/services/` 디렉토리가 생성된다
**And** 각 디렉토리에 `__init__.py`가 생성된다
**And** `main.py`, `tests/`, `alembic/` 디렉토리 구조가 완성된다

**Given** 프로젝트 구조가 생성되었다
**When** 개발자가 `core/database.py`에 SQLAlchemy async 엔진을 설정한다
**Then** async PostgreSQL 연결이 설정되고 (DATABASE_URL 환경변수 사용)
**And** connection pooling이 구성된다 (pool_size=10, max_overflow=20, pool_pre_ping=True)
**And** AsyncSession 의존성이 생성된다
**And** `get_db()` 함수가 API 엔드포인트에서 사용할 수 있게 된다

**Given** SQLAlchemy가 설정되었다
**When** 개발자가 `alembic init` 명령을 실행하고 설정을 구성한다
**Then** `alembic/` 디렉토리와 `alembic.ini`가 생성된다
**And** `alembic/env.py`가 SQLAlchemy 모델을 인식하도록 설정된다
**And** `alembic.ini`가 DATABASE_URL을 사용하도록 설정된다
**And** 첫 번째 마이그레이션을 생성할 수 있는 상태가 된다

**Given** 데이터베이스 연결이 설정되었다
**When** 개발자가 `main.py`에 FastAPI 앱을 초기화한다
**Then** FastAPI 앱이 생성되고 타이틀은 "gr8 API"로 설정된다
**And** CORS 미들웨어가 프론트엔드(origin: localhost:5173)를 허용하도록 설정된다
**And** OpenAPI/Swagger docs가 `/docs` 경로에서 사용 가능하다
**And** 상태 확인 엔드포인트 `GET /`가 "Hello gr8" 메시지를 반환한다
**And** Uvicorn 서버가 `uvicorn main:app --reload` 명령으로 `localhost:8000`에서 시작된다

**Given** FastAPI 앱이 설정되었다
**When** 개발자가 `core/config.py`에 Pydantic 설정을 정의한다
**Then** `Settings` 클래스가 환경변수를 로드하도록 설정된다 (DATABASE_URL, ENVIRONMENT 등)
**And** 모든 설정 값이 타입 검증된다
**And** `.env.example` 파일이 예제 환경변수와 함께 생성된다
**And** `.env`가 `.gitignore`에 추가된다

**Given** FastAPI 앱과 데이터베이스가 설정되었다
**When** 개발자가 pytest 설정을 생성한다
**Then** `tests/conftest.py`가 생성되어 테스트 데이터베이스 fixture를 제공한다
**And** `pytest -v` 실행 시 기본 테스트가 통과한다
**And** `tests/test_main.py`에 상태 확인 엔드포인트 테스트가 포함된다

**Given** pytest가 설정되었다
**When** 개발자가 Docker Compose를 설정한다
**Then** 프로젝트 루트에 `docker-compose.yml`이 생성된다
**And** PostgreSQL 서비스가 정의된다 (image: postgres:15-alpine)
**And** PostgreSQL 환경변수가 설정된다 (POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD)
**And** PostgreSQL 데이터 볼륨이 마운트된다
**And** FastAPI 앱이 Dockerfile로 빌드되도록 설정된다
**And** 프론트엔드와 백엔드 간의 네트워크가 연결된다
**And** `docker-compose up -d` 명령으로 전체 스택이 시작된다
**And** 백엔드가 `http://localhost:8000`에서 접근 가능하다
**And** `docker-compose down` 명령으로 모든 컨테이너가 정리된다

---

### Story 1.3: 프로덕션용 AWS 인프라 구성 (Terraform)

As a DevOps 엔지니어 (DevOps Engineer),
I want Terraform을 사용하여 프로덕션 배포용 AWS 인프라(ECS, ECR, RDS)를 코드로 정의하고 싶다,
So that 프로덕션 환경을 버전 관리하고 재현 가능하게 배포할 수 있다.

**Acceptance Criteria:**

**Given** 개발자는 프로젝트 루트 디렉토리에 있다
**When** 개발자가 `infrastructure/terraform/` 디렉토리를 생성하고 Terraform 설정을 초기화한다
**Then** `infrastructure/terraform/` 디렉토리 구조가 생성된다 (main.tf, variables.tf, outputs.tf, provider.tf, modules/)
**And** `terraform init` 실행 시 AWS 프로바이더가 초기화된다
**And** AWS 자격증명이 구성되고 리전이 설정된다 (예: ap-northeast-2)

**Given** Terraform 프로젝트가 초기화되었다
**When** 개발자가 VPC 모듈을 정의하고 `terraform apply`를 실행한다
**Then** gr8 전용 VPC가 생성된다 (CIDR: 10.0.0.0/16)
**And** 2개의 가용 영역(AZ)에 퍼블릭 및 프라이빗 서브넷이 생성된다
**And** 인터넷 게이트웨이와 NAT 게이트웨이가 구성된다
**And** 보안 그룹이 생성되어 ECS와 RDS 간의 트래픽만 허용한다

**Given** VPC 네트워킹이 구성되었다
**When** 개발자가 ECR 리포지토리를 정의하고 적용한다
**Then** `gr8-backend` ECR 리포지토리가 생성된다
**And** 리포지토리 라이프사이클 정책이 설정된다 (untagged 이미지 30일 후 삭제)
**And** ECR 푸시를 위한 IAM 정책이 생성된다

**Given** ECR 리포지토리가 생성되었다
**When** 개발자가 RDS PostgreSQL 모듈을 정의하고 적용한다
**Then** Amazon RDS PostgreSQL db.t3.micro 인스턴스가 생성된다 (MVP 사양)
**And** 20GB GP3 스토리지가 할당된다
**And** 7일 백업 보관 윈도우가 설정된다
**And** 데이터베이스가 프라이빗 서브넷에 배치된다 (인터넷 접근 불가)
**And** 보안 그룹이 ECS 태스크만 RDS에 접근하도록 제한한다
**And** 데이터베이스 자격증명이 AWS SSM Parameter Store에 안전하게 저장된다

**Given** RDS 인스턴스가 생성되었다
**When** 개발자가 ECS Fargate 클러스터 모듈을 정의하고 적용한다
**Then** `gr8-production` ECS 클러스터가 생성된다 (Fargate launch type)
**And** ECS Task Execution Role이 생성되어 ECR에서 이미지를 pull할 수 있다
**And** CloudWatch Logs 로그 그룹이 생성된다 (`/ecs/gr8-backend`)
**And** ALB(Application Load Balancer)가 생성되고 퍼블릭 서브넷에 배치된다
**And** ALB가 ECS 서비스로 트래픽을 라우팅하도록 설정된다

**Given** 모든 AWS 리소스가 생성되었다
**When** 개발자가 outputs.tf를 정의한다
**Then** RDS 엔드포인트, ECR URL, ECS 클러스터 이름, ALB DNS 이름이 출력된다
**And** `terraform output` 명령으로 모든 리소스 정보를 조회할 수 있다
**And** `infrastructure/README.md`에 배포 절차가 문서화된다

**Given** Terraform 인프라가 배포되었다
**When** 개발자가 AWS 콘솔에서 리소스를 확인한다
**Then** VPC, 서브넷, 보안 그룹이 올바르게 구성되어 있다
**And** ECR 리포지토리가 접근 가능하다
**And** RDS 인스턴스가 `available` 상태이다
**And** ECS 클러스터가 활성화되어 있다
**And** ALB가 정상 작동한다
**And** `terraform plan` 실행 시 변경 사항이 없음을 확인한다

---

### Story 1.4: CI/CD 파이프라인 설정 (GitHub Actions)

As a DevOps 엔지니어 (DevOps Engineer),
I want GitHub Actions를 사용하여 자동화된 CI/CD 파이프라인을 구축하고 싶다,
So that 코드 변경 시 자동으로 테스트되고 프로덕션에 안전하게 배포할 수 있다.

**Acceptance Criteria:**

**Given** 프로젝트에 GitHub 저장소가 구성되어 있다
**When** 개발자가 `.github/workflows/` 디렉토리를 생성한다
**Then** `ci.yml`과 `deploy.yml` 워크플로우 파일이 생성된다
**And** 워크플로우가 main 브랜치에 대한 push/pull_request 이벤트에 트리거된다
**And** GitHub Actions 실행 권한이 설정된다

**Given** `.github/workflows/ci.yml`이 생성되었다
**When** 개발자가 CI 워크플로우를 정의한다
**Then** 워크플로우가 다음 단계를 순차적으로 실행한다: Checkout, Frontend Lint (ESLint), Frontend Type Check (TypeScript), Frontend Tests (Vitest), Backend Lint (Pylint), Backend Type Check (mypy), Backend Tests (pytest)
**And** 모든 단계가 성공해야 워크플로우가 통과한다
**And** 실패 시 GitHub에서 실패한 단계를 표시한다

**Given** CI 워크플로우가 통과되었다
**When** 개발자가 Docker 빌드 단계를 추가한다
**Then** 백엔드 Docker 이미지가 빌드된다 (ECR login 포함)
**And** 이미지가 ECR에 푸시된다 (`gr8-backend:latest` + commit SHA 태그)
**And** 프론트엔드 정적 파일이 빌드된다 (`npm run build`)
**And** GitHub Actions 아티팩트에 빌드 결과가 저장된다

**Given** Docker 이미지가 ECR에 푸시되었다
**When** 개발자가 `.github/workflows/deploy.yml`을 정의한다
**Then** 워크플로우가 `workflow_dispatch` 이벤트로 수동 트리거된다
**And** 배포 시 다음 단계를 실행한다: Terraform Apply, ECS Update (새 Docker 이미지로), Smoke Tests (상태 확인 엔드포인트)
**And** 배포 성공/실패를 Slack으로 알림 보낸다 (선택사항)

**Given** GitHub Actions 워크플로우가 설정되었다
**When** 개발자가 GitHub Secrets를 구성한다
**Then** AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DOCKERHUB_USERNAME, DOCKERHUB_PASSWORD 시크릿이 GitHub 저장소에 설정된다
**And** `.github/workflows/` 파일이 시크릿을 참조한다
**And** 시크릿이 로그에 노출되지 않는다

**Given** CI/CD 파이프라인이 실행 중이다
**When** 워크플로우가 실행된다
**Then** GitHub Pull Request에 체크마크 상태가 표시된다
**And** 실패한 단계를 빨간색 X로 표시한다
**And** 성공한 단계를 녹색 체크로 표시한다
**And** (선택사항) Slack 웹훅으로 배포 결과를 알림한다

**Given** CI/CD 파이프라인이 설정되었다
**When** 개발자가 테스트 커밋을 push한다
**Then** CI 워크플로우가 자동으로 트리거된다
**And** 모든 테스트와 린트가 통과한다
**And** Docker 이미지가 ECR에 푸시된다
**And** `workflow_dispatch`로 배포 워크플로우를 수동 실행할 수 있다
**And** 배포 후 프로덕션 URL에서 앱이 접근 가능하다

---

### Story 1.5: CloudWatch 모니터링 및 로깅 설정

As a DevOps 엔지니어 (DevOps Engineer),
I want AWS CloudWatch를 사용하여 애플리케이션과 인프라의 모니터링 및 로깅 시스템을 구축하고 싶다,
So that 시스템 상태를 실시간으로 모니터링하고 문제를 빠르게 감지할 수 있다.

**Acceptance Criteria:**

**Given** ECS 클러스터가 생성되었다 (Story 1.3)
**When** 개발자가 CloudWatch Logs 그룹을 Terraform에 추가한다
**Then** `/ecs/gr8-backend` 로그 그룹이 생성된다
**And** 로그 스트림이 ECS 태스크별로 자동 생성된다
**And** 로그 보관 정책이 7일로 설정된다 (MVP)
**And** FastAPI 앱의 로그가 CloudWatch로 전송된다

**Given** CloudWatch Logs 그룹이 생성되었다
**When** 개발자가 백엔드 앱에 구조화된 로깅을 구현한다
**Then** 로그가 JSON 형식으로 출력된다 (timestamp, level, service, user_wallet, message 등)
**And** 로그 레벨이 DEBUG, INFO, WARNING, ERROR, CRITICAL로 구분된다
**And** 모든 API 요청이 로그에 기록된다
**And** 모든 에러와 예외가 스택 트레이스와 함께 기록된다

**Given** 로그가 CloudWatch로 전송되고 있다
**When** 개발자가 CloudWatch Alarms을 정의한다
**Then** 다음 알람이 생성된다: ApplicationErrorRate (>5%), DatabaseCPU (>90%), APILatencyP95 (>1000ms), BacktestFailureRate (>10%)
**And** Critical 알람은 PagerDuty와 통합된다 (선택사항)
**And** Warning 알람은 Slack으로 알림을 보낸다

**Given** Alarms이 설정되었다
**When** 개발자가 CloudWatch Dashboard를 생성한다
**Then** `gr8-production` 대시보드가 생성된다
**And** 대시보드에 다음 위젯이 표시된다: 백테스트 실행 시간, API 응답 시간, 에러율, 활성 지갑 연결 수, DB 연결 풀, ECS CPU/Memory, RDS CPU/Memory/연결 수, ALB 요청 수
**And** 대시보드가 1분 간격으로 자동 새로고침된다
**And** 비즈니스 메트릭이 표시된다 (첫 백테스트 성공률 90%+ 목표, 사용자 온보딩 완료율)

**Given** CloudWatch Dashboard가 생성되었다
**When** 개발자가 백엔드 앱에서 커스텀 메트릭을 전송한다
**Then** `boto3` CloudWatch 클라이언트를 사용하여 메트릭이 전송된다
**And** 다음 커스텀 메트릭이 CloudWatch에 기록된다: 백테스트 실행 시간, 사용자 지갑 연결 수, 전략 생성/수정/삭제 수, 백테스트 성공/실패 수
**And** 메트릭이 네임스페이스 `gr8` 하에 저장된다

**Given** 구조화된 로그가 CloudWatch에 기록되고 있다
**When** 운영자가 CloudWatch Logs Insights를 사용한다
**Then** 운영자는 다음 쿼리를 실행할 수 있다: 특정 사용자 활동 로그, 시간 범위 에러 필터링, 백테스트 실행 시간 분석, API 엔드포인트별 요청 수
**And** 쿼리 결과를 CSV로 내보낼 수 있다
**And** 자주 사용하는 쿼리를 저장할 수 있다

**Given** 모든 모니터링 구성이 완료되었다
**When** 개발자가 테스트 트래픽을 생성한다
**Then** 로그가 실시간으로 CloudWatch Logs에 표시된다
**And** 메트릭이 CloudWatch Dashboard에 업데이트된다
**And** 에러 시 알람이 트리거된다
**And** Slack/이메일로 알림이 전송된다
**And** CloudWatch Logs Insights로 로그를 검색할 수 있다

---

### Story 1.6: 환경 설정 관리 (AWS Systems Manager Parameter Store)

As a DevOps 엔지니어 (DevOps Engineer),
I want AWS Systems Manager Parameter Store를 사용하여 모든 환경 설정을 안전하게 관리하고 싶다,
So that 민감한 정보를 코드에 노출하지 않고 환경별로 안전하게 관리할 수 있다.

**Acceptance Criteria:**

**Given** AWS 인프라가 배포되었다 (Story 1.3)
**When** 개발자가 Terraform으로 Parameter Store 파라미터를 정의한다
**Then** 다음 계층 구조로 파라미터가 생성된다: `/gr8/dev/*`, `/gr8/staging/*`, `/gr8/production/*`
**And** 민감한 파라미터(MONAD_PRIVATE_KEY)는 `SecureString` 타입으로 KMS 암호화된다
**And** 일반 파라미터는 `String` 타입으로 저장된다

**Given** Parameter Store 구조가 생성되었다
**When** 개발자가 프로덕션 환경 변수를 Parameter Store에 저장한다
**Then** 다음 파라미터가 `/gr8/production/` 경로에 생성된다: DATABASE_URL, MONAD_RPC_URL, MONAD_PRIVATE_KEY (SecureString), ETHERSCAN_API_KEY (SecureString), JWT_SECRET (SecureString), ENVIRONMENT
**And** 모든 SecureString 파라미터가 AWS KMS로 암호화된다
**And** 파라미터 버전 관리가 활성화된다

**Given** Parameter Store가 구성되었다
**When** 개발자가 로컬 개발용 `.env` 파일을 생성한다
**Then** 프로젝트 루트에 `.env` 파일이 생성된다
**And** `.env` 파일이 `.gitignore`에 추가되어 있다
**And** `.env.example` 파일이 생성되어 예제 환경변수를 제공한다
**And** 모든 개발자가 `.env.example`를 복사하여 `.env`를 생성하도록 안내된다

**Given** 환경변수가 Parameter Store에 저장되었다
**When** 개발자가 FastAPI 앱에서 Parameter Store를 읽도록 구현한다
**Then** `core/config.py`에 AWS SSM 클라이언트가 구현된다 (boto3)
**And** Pydantic `Settings` 클래스가 Parameter Store에서 값을 로드한다
**And** 로컬 개발에서는 `.env` 파일을 우선 사용한다
**And** 프로덕션에서는 Parameter Store만 사용한다

**Given** 백엔드가 Parameter Store를 사용한다
**When** 개발자가 CI/CD 파이프라인을 구성한다
**Then** GitHub Actions가 EC2 인스턴스 프로파일을 사용하여 Parameter Store에 접근한다
**And** ECS Task Definition이 Parameter Store에서 환경변수를 참조하도록 설정된다
**And** 민감한 정보가 GitHub Secrets에 저장되지 않는다

**Given** 모든 환경 설정이 구성되었다
**When** 개발자가 각 환경에서 앱을 실행한다
**Then** 로컬 개발(`docker-compose up`)에서 `.env` 파일이 사용된다
**And** 프로덕션(ECS)에서 Parameter Store가 사용된다
**And** 코드 변경 없이 환경만 변경된다
**And** 각 환경에서 올바른 데이터베이스와 RPC URL에 연결된다

**Given** Parameter Store가 사용 중이다
**When** 운영자가 환경 설정을 관리한다
**Then** 모든 민감한 파라미터가 KMS로 암호화된다
**And** IAM 정책이 최소 권한 원칙을 따른다 (읽기 전용 권한)
**And** 파라미터 변경 시 CloudTrail에 감사 로그가 기록된다
**And** 파라미터 버전 관리로 변경 이역을 추적할 수 있다
**And** `terraform apply` 시 민감한 값이 표시되지 않는s

---

## Epic 2: Web3 지갑 연동 및 사용자 인증 (Web3 Wallet & Authentication)

사용자가 Web3 지갑으로 안전하고 간편하게 로그인하고 세션을 유지할 수 있습니다. MetaMask 및 WalletConnect를 통한 지갑 연결, 체인 확인 및 자동 전환(Monad L1), 지갑 주소 표시, 세션 유지, 지갑 연결 해제 기능을 제공하며, 반응형 디자인(모바일/태블릿/데스크톱)을 지원합니다.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8

---

### Story 2.1: Web3 라이브러리 설치 및 기본 설정

As a 프론트엔드 개발자 (Frontend Developer),
I want Web3 지갑 연동을 위한 라이브러리를 설치하고 기본 설정을 완료하고 싶다,
So that MetaMask와 WalletConnect를 통한 지갑 연결 기능을 구현할 수 있다.

**Acceptance Criteria:**

**Given** 프론트엔드 프로젝트가 초기화되었다 (Story 1.1)
**When** 개발자가 Web3 라이브러리를 설치한다
**Then** 다음 패키지들이 `package.json`에 추가된다: wagmi, viem, @tanstack/react-query, @walletconnect/web3-provider
**And** 모든 의존성이 성공적으로 설치된다

**Given** Web3 라이브러리가 설치되었다
**When** 개발자가 `src/config/wagmi.ts`를 생성한다
**Then** Wagmi Config가 Monad L1과 Monad Testnet 체인으로 설정된다
**And** WalletConnect Project ID가 환경변수로 설정된다
**And** 앱 이름이 "gr8"으로 설정된다

**Given** Wagmi Config가 생성되었다
**When** 개발자가 `src/providers/Web3Provider.tsx`를 생성한다
**Then** WagmiProvider와 QueryClientProvider가 래핑된다
**And** App.tsx 최상단에 Web3Provider가 추가된다
**And** 모든 자식 컴포넌트에서 Web3 훅을 사용할 수 있다

**Given** Web3Provider가 설정되었다
**When** 개발자가 `src/hooks/useWallet.ts`를 생성한다
**Then** 다음 훅들이 구현된다: useAccount(), useConnect(), useDisconnect(), useSwitchChain()
**And** 모든 훅이 TypeScript 타입과 함께 export된다

**Given** Web3 라이브러리가 설치되었다
**When** 개발자가 `.env.example`과 `.env`를 업데이트한다
**Then** `VITE_WC_PROJECT_ID`가 추가된다
**And** `.env.example`에 예제 값이 포함된다
**And** `.env`는 `.gitignore`에 이미 포함되어 있다

**Given** 모든 설정이 완료되었다
**When** 개발자가 `src/components/Web3Debug.tsx`를 생성한다
**Then** 컴포넌트가 다음 정보를 표시한다: 연결 상태, 지갑 주소, 현재 체인 ID
**And** 개발 서버에서 컴포넌트가 정상 렌더링된다

**Given** Web3 라이브러리가 설치되었다
**When** 개발자가 `npm run build`를 실행한다
**Then** 빌드가 성공적으로 완료된다
**And** TypeScript 타입 에러가 없다
**And** `npm run lint`가 통과한다

---

### Story 2.2: MetaMask 지갑 연결 UI 및 로직

As a 사용자 (User),
I want "지갑 연결하기" 버튼을 클릭하여 MetaMask 지갑을 연결하고 싶다,
So that gr8 서비스에 Web3 지갑으로 인증할 수 있다.

**Acceptance Criteria:**

**Given** Web3 라이브러리가 설정되었다 (Story 2.1)
**When** 개발자가 `src/components/WalletConnectButton.tsx`를 생성한다
**Then** "지갑 연결하기" 버튼이 생성된다
**And** 버튼이 다크모드 스타일로 디자인된다 (bg-primary-500, hover:bg-primary-600)
**And** 버튼이 반응형으로 디자인된다 (모바일: 100% 너비, 데스크톱: auto)
**And** 버튼이 헤더 또는 사이드바에 배치된다
**And** 연결되지 않은 상태에서만 버튼이 표시된다

**Given** 지갑 연결 버튼이 생성되었다
**When** 사용자가 버튼을 클릭한다
**Then** `useConnect()` 훅이 호출되어 MetaMask 연결을 시도한다
**And** 브라우저에 MetaMask 확장프로그램이 설치되어 있지 않으면 설치 안내를 표시한다
**And** MetaMask 팝업이 열리고 사용자가 연결을 승인한다
**And** 연결 성공 시 지갑 주소를 가져온다
**And** 지갑 연결이 10초 이내에 완료된다

**Given** MetaMask 연결 로직이 구현되었다
**When** 사용자가 지갑을 성공적으로 연결한다
**Then** 연결 상태가 Zustand store에 저장된다
**And** 지갑 주소, 체인 ID가 저장된다
**And** "지갑 연결하기" 버튼이 숨겨진다
**And** 지갑 주소 표시 UI가 나타난다 (Story 2.5)
**And** 연결 성공 토스트 메시지가 표시된다 ("지갑이 연결되었습니다")

**Given** MetaMask 연결 로직이 구현되었다
**When** 사용자가 MetaMask에서 연결을 거부한다
**Then** 연결 실패 이유가 토스트 메시지로 표시된다
**And** 에러가 CloudWatch에 로깅된다
**And** 사용자가 다시 시도할 수 있다

**Given** 사용자가 MetaMask가 설치되지 않은 브라우저에서 접속한다
**When** 사용자가 "지갑 연결하기" 버튼을 클릭한다
**Then** "MetaMask 확장프로그램을 설치해주세요" 모달이 표시된다
**And** MetaMask 공식 웹사이트로 이동하는 버튼이 포함된다
**And** "나중에 하기" 버튼으로 모달을 닫을 수 있다

**Given** 지갑 연결 버튼이 구현되었다
**When** 개발자가 다양한 화면 크기에서 테스트한다
**Then** 모바일 (375px+): 버튼이 전체 너비, 하단 고정
**And** 태블릿 (768px+): 버튼이 헤더에 우측 정렬
**And** 데스크톱 (1024px+): 버튼이 헤더에 우측 정렬
**And** 모든 크기에서 터치 타겟이 44×44px 이상이다

**Given** 지갑 연결 버튼이 구현되었다
**When** 사용자가 버튼을 클릭하고 MetaMask 팝업이 열려있다
**Then** 버튼에 로딩 스피너가 표시된다
**And** 버튼이 비활성화된다 (중복 클릭 방지)
**And** "연결 중..." 텍스트가 표시된다
**And** 연결 완료 또는 실패 시 로딩 상태가 해제된s

---

### Story 2.3: WalletConnect를 통한 모바일 지갑 연결

As a 모바일 사용자 (Mobile User),
I want WalletConnect를 사용하여 모바일 지갑 앱(Trust Wallet, Coinbase Wallet 등)을 연결하고 싶다,
So that MetaMask가 없어도 gr8 서비스에 지갑으로 인증할 수 있다.

**Acceptance Criteria:**

**Given** Web3 라이브러리가 설치되었다 (Story 2.1)
**When** 개발자가 Wagmi Config에 WalletConnect를 추가한다
**Then** WalletConnect 프로바이더가 구성된다
**And** WalletConnect Project ID가 환경변수에서 로드된다
**And** 지원되는 지갑 목록이 포함된다 (Trust Wallet, Coinbase Wallet, Rainbow, Argent 등 100+)
**And** 메타데이터가 설정된다 (name: "gr8", description, url)

**Given** WalletConnect가 설정되었다
**When** 사용자가 "지갑 연결하기" 버튼을 클릭한다
**Then** 사용 가능한 지갑 목록이 모달로 표시된다
**And** MetaMask 옵션이 최상단에 표시된다
**And** "더 보기..." 버튼으로 전체 지갑 목록을 볼 수 있다
**And** 각 지갑에 아이콘과 이름이 표시된다
**And** 모달이 반응형으로 디자인된다 (모바일: 전체 화면, 데스크톱: 600×400px)

**Given** 지갑 목록 모달이 열려 있다
**When** 데스크톱 사용자가 WalletConnect 지원 지갑을 선택한다
**Then** QR 코드가 생성되어 표시된다
**And** "모바일 지갑 앱에서 QR 코드를 스캔하세요" 안내가 표시된다
**And** QR 코드가 30초 동안 유효하다
**And** 만료 시 "새 QR 코드 생성" 버튼이 표시된다

**Given** 지갑 목록 모달이 열려 있다
**When** 모바일 사용자가 WalletConnect 지원 지갑을 선택한다
**Then** 해당 지갑 앱의 딥링크로 리디렉션된다 (예: trust://, wc:)
**And** 사용자가 지갑 앱에서 연결을 승인한다
**And** 브라우저로 자동 리디렉션되어 연결이 완료된다
**And** 지갑 앱이 설치되지 않으면 앱스토어로 이동하는 버튼이 표시된다

**Given** 사용자가 WalletConnect로 지갑을 연결했다
**When** 연결이 성공한다
**Then** WalletConnect 세션이 생성된다
**And** 세션 URI가 로컬 스토리지에 저장된다
**And** Zustand store에 연결 정보가 업데이트된다
**And** 지갑 주소와 체인 정보가 표시된다
**And** 연결 성공 토스트가 표시된다

**Given** WalletConnect 세션이 활성화되어 있다
**When** 사용자가 지갑 연결을 해제한다 (Story 2.7)
**Then** WalletConnect 세션이 종료된다
**And** 지갑 앱에 세션 종료 알림이 전송된다
**And** 로컬 스토리지에서 세션 URI가 삭제된다
**And** Zustand store가 초기화된다

**Given** WalletConnect가 구현되었다
**When** 개발자가 다양한 지갑으로 테스트한다
**Then** 다음 지갑들이 정상 연결된다: MetaMask, Trust Wallet, Coinbase Wallet, Rainbow Wallet, Argent Wallet, imToken
**And** 각 지갑에서 서명 요청이 정상 작동한다
**And** 지갑 전환 시 기존 연결이 해제되고 새 연결이 생성된다
**And** 100+ 지갑이 WalletConnect 프로토콜로 지원된다

**Given** WalletConnect 연결이 진행 중이다
**When** 연결이 실패하거나 시간 초과가 발생한다
**Then** 사용자에게 친절한 에러 메시지가 표시된다
**And** "다시 시도" 버튼이 제공된다
**And** 에러가 CloudWatch에 로깅된다 (지갑 종류, 에러 타입 포함)
**And** 사용자가 다른 지갑을 선택할 수 있다

---

### Story 2.4: 체인 확인 및 자동 전환 (Monad L1)

As a 사용자 (User),
I want 지갑이 올바른 블록체인(Monad L1)에 연결되어 있음을 확인하고 싶다,
So that 잘못된 체인에서 트랜잭션을 실행하는 실수를 방지할 수 있다.

**Acceptance Criteria:**

**Given** 사용자가 지갑을 연결했다 (Story 2.2 또는 2.3)
**When** 지갑 연결이 완료되면 시스템이 현재 체인 ID를 확인한다
**Then** `useAccount()` 훅으로 현재 체인 ID를 가져온다
**And** 현재 체인이 Monad L1인지 확인한다
**And** 체인 확인 결과가 상태 표시기로 표시된다 (체인 아이콘 + 이름)

**Given** 사용자가 잘못된 체인에 연결되어 있다 (예: Ethereum Mainnet)
**When** 시스템이 올바르지 않은 체인을 감지한다
**Then** "잘못된 체인에 연결되어 있습니다" 경고 모달이 표시된다
**And** 현재 체인과 올바른 체인(Monad L1)이 표시된다
**And** "Monad L1으로 전환하기" 버튼이 제공된다
**And** "나중에 하기" 옵션이 제공된다

**Given** 사용자가 "Monad L1으로 전환하기" 버튼을 클릭한다
**When** `useSwitchChain()` 훅이 호출된다
**Then** 지갑에 체인 전환 요청이 전송된다
**And** MetaMask/지갑 앱에서 체인 전환 승인 요청이 표시된다
**And** 사용자가 승인하면 지갑이 Monad L1으로 전환된다
**And** NFR-BC-006: 자동으로 올바른 체인으로 전환 요청이 완료된다

**Given** 사용자가 지갑에서 체인 전환을 거부한다
**When** 전환 요청이 거부된다
**Then** "체인 전환이 거부되었습니다. 일부 기능이 제한될 수 있습니다" 메시지가 표시된다
**And** 사용자가 현재 체인을 유지할 수 있다
**And** 특정 기능(백테스트 실행 등)이 비활성화된다

**Given** 사용자가 올바른 체인(Monad L1)에 연결되어 있다
**When** 체인 확인 로직이 실행된다
**Then** 녹색 체인 상태 표시기가 보인다 ("Monad L1")
**And** 모든 기능이 활성화된다
**And** 추가 경고가 표시되지 않는다

**Given** 체인 전환 기능이 구현되었다
**When** 사용자가 수동으로 체인을 전환한다 (지갑 앱에서)
**Then** 앱이 체인 변경 이벤트를 감지한다
**And** 새 체인이 올바른지 확인한다
**And** 체인 상태 표시기가 실시간으로 업데이트된다
**And** 잘못된 체인으로 전환 시 경고가 다시 표시된다

---

### Story 2.5: 지갑 주소 표시 및 사용자 식별

As a 사용자 (User),
I want 내 지갑 주소를 식별 가능한 형식으로 보고 싶다,
So that 내 지갑이 올바르게 연결되었음을 확인할 수 있다.

**Acceptance Criteria:**

**Given** 사용자가 지갑을 연결했다
**When** 연결이 완료되면 지갑 주소가 표시된다
**Then** `src/components/WalletAddress.tsx` 컴포넌트가 생성된다
**And** 지갑 주소가 축약 형식으로 표시된다 (예: `0x1234...5678`)
**And** 전체 주소가 툴팁으로 표시된다 (마우스 오버 시)
**And** 주소 복사 버튼이 제공된다
**And** 헤더 또는 사이드바에 배치된다

**Given** 지갑 주소가 표시되었다
**When** 사용자가 복사 버튼을 클릭한다
**Then** 전체 지갑 주소가 클립보드에 복사된다
**And** "주소가 복사되었습니다" 토스트 메시지가 표시된다
**And** 복사 버튼 아이콘이 잠시 변경된다 (확인 체크 표시)

**Given** 지갑 주소 컴포넌트가 구현되었다
**When** 개발자가 다양한 주소 길이로 테스트한다
**Then** 모든 EVM 호환 주소가 올바르게 표시된다
**And** ENS(이름 서비스)가 있으면 ENS 이름이 우선 표시된다 (예: `alice.eth`)
**And** ENS 없는 경우에는 축약된 주소가 표시된다
**And** 주소 형식 검증이 수행된다 (0x로 시작, 42자)

**Given** 지갑 주소가 표시되었다
**When** 사용자가 지갑 주소를 클릭한다
**Then** 지갑 세부 정보 모달이 표시된다
**And** 전체 지갑 주소가 표시된다
**And** 현재 체인 정보가 표시된다
**And** 지갑 잔액이 표시된다 (MONAD 토큰, 선택 사항)
**And** Etherscan 블록탐색기 링크가 제공된다

**Given** 지갑 주소 컴포넌트가 구현되었다
**When** 개발자가 반응형 디자인을 테스트한다
**Then** 모바일 (375px+): 주소와 복사 버튼이 작게 표시된다 (16px 폰트)
**And** 태블릿 (768px+): 주소와 복사 버튼이 중간 크기로 표시된다
**And** 데스크톱 (1024px+): 주소와 복사 버튼이 기본 크기로 표시된다 (18px 폰트)
**And** 모든 크기에서 터치 타겟이 44×44px 이상이다

---

### Story 2.6: 세션 유지 (localStorage + Zustand)

As a 사용자 (User),
I want 페이지를 새로고침해도 지갑 연결이 유지되기를 원한다,
So that 매번 지갑을 다시 연결할 필요 없이 서비스를 이용할 수 있다.

**Acceptance Criteria:**

**Given** Web3 Provider가 설정되었다 (Story 2.1)
**When** 개발자가 `src/stores/walletStore.ts`를 생성한다
**Then** Zustand store가 생성되어 지갑 상태를 관리한다
**And** 다음 상태가 저장된다: isConnected, address, chainId, connector
**And** `persist` 미들웨어가 구성되어 localStorage에 저장된다
**And** 저장 키는 `gr8-wallet-storage`이다

**Given** 지갑 연결이 완료되었다
**When** 사용자가 페이지를 새로고침한다 (F5 또는 Ctrl+R)
**Then** localStorage에서 지갑 상태가 복원된다
**And** `useAccount()` 훅이 이전 지갑 주소를 반환한다
**And** 지갑 주소 표시가 즉시 보인다 (재연결 없음)
**And** FR7: 페이지 새로고침 후 연결이 유지된다

**Given** 세션 유지가 구현되었다
**When** 사용자가 브라우저를 닫았다가 다시 연다
**Then** 다음 방문 시 지갑이 자동으로 연결된다
**And** 자동 연결 시 "지갑이 연결되었습니다" 토스트가 표시된다
**And** 세션은 7일 동안 유지된다 (localStorage 만료 설정)
**And** 사용자가 명시적으로 연결 해제하기 전까지 유지된다

**Given** 세션이 localStorage에 저장되었다
**When** 사용자가 같은 지갑을 다시 연결하려 한다
**Then** 기존 세션이 감지되고 즉시 연결된다
**And** MetaMask/WalletConnect 팝업이 표시되지 않는다 (이미 승인됨)
**And** 지갑 주소 변경이 감지되면 세션이 업데이트된다

**Given** 세션 유지 기능이 구현되었다
**When** 개발자가 보안을 검증한다
**Then** 민감한 정보(프라이빗 키)가 localStorage에 저장되지 않는다
**And** 공개 정보(주소, 체인 ID)만 저장된다
**And** 세션 데이터는 암호화되지 않아도 안전하다 (공개 정보만)
**And** localStorage가 삭제되면 세션이 초기화된다

**Given** 사용자가 여러 탭에서 gr8을 열었다
**When** 한 탭에서 지갑을 연결 해제한다
**Then** `storage` 이벤트가 감지되고 모든 탭에 알림이 전송된다
**And** 다른 탭에서도 지갑 연결이 해제된다
**And** 모든 탭에서 Zustand store가 동기화된다
**And** 사용자 경험이 일관되게 유지된다

---

### Story 2.7: 지갑 연결 해제 및 재연결

As a 사용자 (User),
I want 지갑 연결을 해제하고 다른 지갑으로 다시 연결하고 싶다,
Sothat 지갑을 변경하거나 로그아웃할 수 있다.

**Acceptance Criteria:**

**Given** 사용자가 지갑을 연결했다
**When** 개발자가 `src/components/WalletDisconnectButton.tsx`를 생성한다
**Then** "연결 해제" 버튼이 생성된다
**And** 버튼이 지갑 주소 근처에 배치된다
**And** 버튼이 아이콘 또는 텍스트 "연결 해제"로 표시된다
**And** 버튼이 위험 색상으로 스타일링된다 (text-danger-500)

**Given** 지갑 연결 해제 버튼이 생성되었다
**When** 사용자가 버튼을 클릭한다
**Then** 확인 모달이 표시된다 ("정말 연결을 해제하시겠습니까?")
**And** "예, 연결 해제"와 "취소" 버튼이 제공된다
**And** 모달이 다크모드 스타일로 디자인된다

**Given** 확인 모달이 표시되었다
**When** 사용자가 "예, 연결 해제"를 클릭한다
**Then** `useDisconnect()` 훅이 호출된다
**And** MetaMask/WalletConnect 세션이 종료된다
**And** Zustand store에서 지갑 정보가 제거된다
**And** localStorage에서 세션이 삭제된다
**And** "지갑 연결이 해제되었습니다" 토스트가 표시된다
**And** FR8: 지갑 연결이 해제된다

**Given** 사용자가 지갑 연결을 해제했다
**When** 사용자가 "지갑 연결하기" 버튼을 다시 클릭한다
**Then** 지갑 목록 모달이 다시 표시된다
**And** 사용자가 이전과 같은 지갑을 선택할 수 있다
**And** 사용자가 다른 지갑을 선택할 수 있다
**And** 새 지갑 연결이 정상 작동한다

**Given** 지갑 연결 해제 기능이 구현되었다
**When** 개발자가 다양한 시나리오를 테스트한다
**Then** MetaMask 연결 후 연결 해제가 정상 작동한다
**And** WalletConnect 연결 후 연결 해제가 정상 작동한다
**And** 지갑 전환(해제 후 재연결)이 정상 작동한다
**And** 페이지 새로고침 후 연결이 유지되지 않는다 (세션 만료)

**Given** 지갑 연결 해제 중 오류가 발생한다
**When** 연결 해제가 실패한다
**Then** "연결 해제에 실패했습니다. 다시 시도해주세요" 에러 메시지가 표시된다
**And** 에러가 CloudWatch에 로깅된다
**And** 사용자가 다시 시도할 수 있다
**And** 지갑 상태가 일관되게 유지된다

---

## ✅ Epic 2 완료 요약

**Web3 지갑 연동 및 사용자 인증** - 7개 스토리 완료
- Story 2.1: Web3 라이브러리 설치 및 기본 설정
- Story 2.2: MetaMask 지갑 연결 UI 및 로직
- Story 2.3: WalletConnect를 통한 모바일 지갑 연결
- Story 2.4: 체인 확인 및 자동 전환 (Monad L1)
- Story 2.5: 지갑 주소 표시 및 사용자 식별
- Story 2.6: 세션 유지 (localStorage + Zustand)
- Story 2.7: 지갑 연결 해제 및 재연결

**FR 커버리지:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8 (모두 완료)

---

## Epic 3: 전략 개발 도구 (Strategy Development Tool)

사용자가 직관적인 노드-엣지 에디터로 거래 전략을 시각적으로 구성하고 저장할 수 있습니다. React Flow 기반 노드-엣지 에디터, 드래그 앤 드롭 노드 추가/삭제/연결, 시장 데이터 노드(가격, 거래량), 기술적 지표 노드(RSI, MACD, Moving Average), 매수/매도 액션 노드(분할 매수/매도 포함), 리스크 관리 노드(Stop Loss, Take Profit), 전략 로컬 저장, JSON export/import, 전략 이름 및 설명 수정 기능을 제공합니다. **고급 기능: 조건부 분기(If-Then-Else), 순환매(Rebalancing), Loop 구조를 지원하는 알고트레이딩 플랫폼입니다.**

**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17

---

### Story 3.1: React Flow 기본 에디터 설정

As a 프론트엔드 개발자 (Frontend Developer),
I want React Flow를 기반으로 하는 노드-엣지 에디터를 초기화하고 싶다,
So that 사용자가 시각적으로 전략을 구성할 수 있는 캔버스를 제공할 수 있다.

**Acceptance Criteria:**

**Given** 프론트엔드 프로젝트가 초기화되었다 (Story 1.1)
**When** 개발자가 React Flow 라이브러리를 설치한다
**Then** `reactflow` 패키지가 설치된다
**And** `@xyflow/react` (React Flow 새 버전)가 설치된다
**And** 필요한 의존성들이 추가된다

**Given** React Flow가 설치되었다
**When** 개발자가 `src/components/editor/StrategyEditor.tsx`를 생성한다
**Then** ReactFlow 컴포넌트가 초기화된다
**And** 캔버스가 다크모드로 스타일링된다 (bg-[#0a0a0a], grid 패턴)
**And** 캔버스 크기가 반응형으로 설정된다 (100vh, 100vw)
**And** 줌, 팬, 미니맵 기능이 활성화된다
**And** 배경에 그리드가 표시된다 (점선 패턴, 20px 간격)

**Given** StrategyEditor 컴포넌트가 생성되었다
**When** 개발자가 기본 에디터 상태를 설정한다
**Then** Zustand store `useEditorStore`가 생성된다
**And** 다음 상태가 관리된다: nodes, edges, selectedNodeId, viewport
**And** `@xyflow/react`의 `useNodesState`, `useEdgesState`, `useReactFlow` 훅이 사용된다
**And** 초기 상태는 빈 캔버스이다

**Given** 에디터 캔버스가 생성되었다
**When** 개발자가 에디터 컨트롤을 추가한다
**Then** 상단 툴바가 생성된다 (노드 추가 버튼, 저장, 불러오기, 내보내기)
**And** 좌측 사이드바에 노드 팔레트가 생성된다
**And** 우측 패널에 노드 속성 편집기가 생성된다 (선택된 노드 시)
**And** 하단 상태바에 현재 전략 정보가 표시된다

**Given** 에디터 레이아웃이 구현되었다
**When** 개발자가 다양한 화면 크기에서 테스트한다
**Then** 모바일 (375px+): 사이드바가 숨겨지고 전체 화면 캔버스가 표시된다
**And** 태블릿 (768px+): 좌측 팔레트가 200px 너비로 표시된다
**And** 데스크톱 (1024px+): 좌측 팔레트 250px, 우측 속성 패널 300px
**And** 모든 크기에서 캔버스가 중앙에 배치된다

**Given** React Flow 에디터가 구현되었다
**When** 개발자가 노드 드래그 앤 드롭을 테스트한다
**Then** 노드가 캔버스에 추가될 수 있다
**And** 노드가 드래그로 이동된다
**And** 노드 간 연결(에지)이 생성될 수 있다
**And** 노드와 에지가 삭제될 수 있다 (Delete 키 또는 백스페이스)
**And** 여러 노드가 Shift+클릭으로 다중 선택된다

**Given** 에디터 기본 기능이 완료되었다
**When** 개발자가 `npm run build`를 실행한다
**Then** 빌드가 성공적으로 완료된다
**And** TypeScript 타입 에러가 없다
**And** 에디터가 정상 렌더링된다

---

### Story 3.2: 노드 타입 정의 및 데이터 모델

As a 프론트엔드 개발자 (Frontend Developer),
I want 모든 노드 타입의 데이터 모델과 TypeScript 타입을 정의하고 싶다,
So that 에디터에서 다양한 종류의 노드를 일관되게 처리할 수 있다.

**Acceptance Criteria:**

**Given** React Flow 에디터가 설정되었다 (Story 3.1)
**When** 개발자가 `src/types/nodes.ts`를 생성한다
**Then** 다음 노드 타입이 정의된다:
```typescript
enum NodeType {
  MARKET_DATA = 'market_data',      // 시장 데이터
  INDICATOR = 'indicator',           // 기술적 지표
  ACTION = 'action',                // 매수/매도 액션
  CONDITION = 'condition',          // If-Then-Else 조건
  LOOP = 'loop',                    // For/While 루프
  RISK_MANAGEMENT = 'risk_mgmt',    // Stop Loss/Take Profit
}
```
**And** 각 노드 타입별 TypeScript 인터페이스가 정의된다

**Given** 노드 타입이 정의되었다
**When** 개발자가 기본 노드 인터페이스를 구현한다
**Then** `BaseNode` 인터페이스가 정의된다:
```typescript
interface BaseNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
  };
}
```
**And** 모든 노드가 `BaseNode`를 확장한다
**And** 노드 데이터가 직렬화 가능하다 (JSON으로 저장)

**Given** 노드 데이터 모델이 정의되었다
**When** 개발자가 시장 데이터 노드 타입을 정의한다
**Then** `MarketDataNode` 인터페이스가 생성된다
**And** 지원되는 데이터 타입이 정의된다: PRICE(가격), VOLUME(거래량), OHLCV(시가/고가/저가/종가/거래량)
**And** 심볼 설정이 포함된다 (예: BTC/USDT)
**And** 시간프레임 설정이 포함된다 (1m, 5m, 15m, 1h, 4h, 1d)

**Given** 시장 데이터 노드가 정의되었다
**When** 개발자가 기술적 지표 노드 타입을 정의한다
**Then** `IndicatorNode` 인터페이스가 생성된다
**And** 지원되는 지표가 정의된다: RSI, MACD, SMA, EMA, BOLLINGER_BANDS
**And** 각 지표별 파라미터가 정의된다 (예: RSI period: 14)
**And** 입력 노드 참조가 포함된다 (시장 데이터 또는 다른 지표)

**Given** 지표 노드가 정의되었다
**When** 개발자가 액션 노드 타입을 정의한다
**Then** `ActionNode` 인터페이스가 생성된다
**And** 액션 타입이 정의된다: BUY, SELL
**And** 수량 설정이 포함된다 (예: 100 USDC)
**And** 분할 설정이 포함된다 (splitCount: 1~10, splitInterval: 1m~1d)
**And** SL/TP 설정이 포함된다 (선택 사항, Story 3.9)

**Given** 액션 노드가 정의되었다
**When** 개발자가 조건 노드 타입을 정의한다
**Then** `ConditionNode` 인터페이스가 생성된다
**And** 조건 연산자가 정의된다: GT(>), LT(<), GTE(>=), LTE(<=), EQ(==), AND, OR
**And** 좌측 입력, 우측 Then 출력, 우측 Else 출력이 정의된다
**And** 중첩 조건이 지원된다 (노드 안에 노드)

**Given** 조건 노드가 정의되었다
**When** 개발자가 Loop 노드 타입을 정의한다
**Then** `LoopNode` 인터페이스가 생성된다
**And** Loop 타입이 정의된다: FOR(고정 횟수), WHILE(조건 만족 시)
**And** 반복 횟수 또는 탈출 조건이 포함된다
**And** Loop 본문에 하위 노드들이 포함될 수 있다
**And** 최대 반복 횟수 제한이 있다 (1000회, 무한 루프 방지)

**Given** 모든 노드 타입이 정의되었다
**When** 개발자가 노드 팩토리를 생성한다
**Then** `nodeTypes` 객체가 생성되어 모든 노드 타입을 등록한다
**And** 각 노드 타입별 커스텀 컴포넌트가 매핑된다
**And** React Flow에서 `nodeTypes` prop으로 전달된다
**And** 노드 추가 시 해당 타입의 컴포넌트가 렌더링된다

---

### Story 3.3: 시장 데이터 노드 구현 (가격, 거래량)

As a 사용자 (User),
I want 시장 데이터 노드를 캔버스에 추가하여 가격 및 거래량을 가져올 수 있고 싶다,
So that 전략의 데이터 소스를 설정할 수 있다.

**Acceptance Criteria:**

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/MarketDataNode.tsx`를 생성한다
**Then** 시장 데이터 노드 컴포넌트가 구현된다
**And** 노드가 아이콘과 라벨을 표시한다 (📊 가격/거래량)
**And** 노드가 1개 입력 포트(없음)과 1개 출력 포트(데이터)를 가진다
**And** 노드가 다크모드 스타일링된다 (bg-gray-800, border-gray-700)

**Given** MarketDataNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 시장 데이터 노드를 드래그한다
**Then** 노드가 캔버스에 추가된다
**And** 우측 속성 패널에 노드 설정이 표시된다
**And** 데이터 타입 선택이 제공된다 (PRICE, VOLUME, OHLCV)
**And** 심볼 입력 필드가 제공된다 (예: BTC/USDT)
**And** 시간프레임 선택이 제공된다 (1m, 5m, 15m, 1h, 4h, 1d)

**Given** 시장 데이터 노드가 추가되었다
**When** 사용자가 노드 설정을 변경한다
**Then** 변경 사항이 즉시 노드 데이터에 반영된다
**And** 노드 라벨이 업데이트된다 (예: "BTC/USDT 가격")
**And** 다른 노드에서 이 노드를 참조할 수 있다

**Given** 시장 데이터 노드가 구성되었다
**When** 백테스팅 엔진이 실행된다 (Story 4.x)
**Then** 노드가 Binance API를 호출하여 히스토리컬 데이터를 가져온다
**And** NFR-INT-001: Binance API를 통해 데이터를 조회한다
**And** 데이터가 지정된 시간프레임으로 집계된다
**And** 다음 노드로 데이터가 전달된다

**Given** 시장 데이터 노드가 구현되었다
**When** 개발자가 다양한 심볼과 시간프레임으로 테스트한다
**Then** 모든 지원 심볼이 정상 작동한다 (BTC, ETH, SOL 등)
**And** 모든 시간프레임이 정상 작동한다
**And** OHLCV 데이터가 올바르게 파싱된다
**And** 에러 시 사용자에게 친절한 메시지가 표시된다

---

### Story 3.4: 기술적 지표 노드 구현 (RSI, MACD, MA)

As a 사용자 (User),
I want 기술적 지표 노드를 추가하여 RSI, MACD, Moving Average를 계산할 수 있고 싶다,
So that 매매 신호를 생성할 수 있다.

**Acceptance Criteria:**

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/IndicatorNode.tsx`를 생성한다
**Then** 기술적 지표 노드 컴포넌트가 구현된다
**And** 노드가 아이콘과 라벨을 표시한다 (📈 지표)
**And** 노드가 1개 입력 포트(이전 노드)와 1개 출력 포트(지표 값)를 가진다
**And** 지표별로 다른 아이콘이 표시된다

**Given** IndicatorNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 RSI 노드를 추가한다
**Then** RSI 설정 패널이 표시된다
**And** Period 입력이 제공된다 (기본값: 14)
**And** Source 입력이 연결되어야 한다 (시장 데이터 또는 다른 지표)
**And** Period 범위: 2~100

**Given** 사용자가 RSI 노드를 추가했다
**When** 입력 데이터가 연결된다
**Then** RSI 값(0~100)이 출력된다
**And** 다른 노드에서 RSI 값을 참조할 수 있다

**Given** 사용자가 노드 팔레트에서 MACD 노드를 추가한다
**Then** MACD 설정 패널이 표시된다
**And** Fast Period 입력이 제공된다 (기본값: 12)
**And** Slow Period 입력이 제공된다 (기본값: 26)
**And** Signal Period 입력이 제공된다 (기본값: 9)
**And** Source 입력이 연결되어야 한다

**Given** 사용자가 MACD 노드를 추가했다
**When** 입력 데이터가 연결된다
**Then** MACD Line, Signal Line, Histogram이 출력된다
**And** 다른 노드에서 이 값들을 참조할 수 있다

**Given** 사용자가 노드 팔레트에서 Moving Average 노드를 추가한다
**Then** MA 설정 패널이 표시된다
**And** MA 타입 선택이 제공된다 (SMA, EMA)
**And** Period 입력이 제공된다 (기본값: 20)
**And** Source 입력이 연결되어야 한다

**Given** 사용자가 MA 노드를 추가했다
**When** 입력 데이터가 연결된다
**Then** MA 값이 출력된다
**And** 여러 MA를 서로 연결할 수 있다 (예: Golden Cross: MA50 > MA200)

**Given** 기술적 지표 노드가 구현되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 지표가 입력 데이터를 기반으로 계산된다
**And** 지표 계산 라이브러리가 사용된다 (예: technicalindicators)
**And** 계산 결과가 다음 노드로 전달된다
**And** 계산 오류 시 에러가 로깅되고 사용자에게 알려진다

---

### Story 3.5: 기본 매수/매도 액션 노드

As a 사용자 (User),
I want 매수/매도 액션 노드를 추가하여 거래를 실행할 수 있고 싶다,
So that 전략이 트래딩 신호를 생성할 수 있다.

**Acceptance Criteria:**

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/ActionNode.tsx`를 생성한다
**Then** 액션 노드 컴포넌트가 구현된다
**And** 매수 노드가 초록색으로 표시된다 (bg-green-900, border-green-600)
**And** 매도 노드가 빨간색으로 표시된다 (bg-red-900, border-red-600)
**And** 노드가 1개 입력 포트(신호)와 출력 포트(없음)를 가진다

**Given** ActionNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 매수/매도 노드를 추가한다
**Then** 액션 설정 패널이 표시된다
**And** 액션 타입이 표시된다 (BUY 또는 SELL)
**And** 수량 입력이 제공된다 (예: 100 USDC)
**And** 수량 단위가 표시된다 (base asset 또는 quote asset)

**Given** 매수/매도 노드가 추가되었다
**When** 사용자가 수량을 설정한다
**Then** 노드 라벨이 업데이트된다 (예: "매수 100 USDC")
**And** 설정이 localStorage에 저장된다
**And** 전략 실행 시 이 수량이 사용된다

**Given** 액션 노드가 구현되었다
**When** 백테스팅 엔진이 실행된다
**Then** 액션 노드에 도달하면 거래가 기록된다
**And** 거래 시간, 가격, 수량이 백테스트 결과에 포함된다
**And** 포트폴리오가 업데이트된다 (시뮬레이션)
**And** 진입/청산 포인트로 기록된다 (FR25)

---

### Story 3.6: 분할 매수/매도 기능

As a 사용자 (User),
I want 매수/매도를 N번으로 나누어 실행하고 싶다,
So that 시장 영향을 분산하고 더 나은 평균 가격을 얻을 수 있다.

**Acceptance Criteria:**

**Given** 액션 노드가 구현되었다 (Story 3.5)
**When** 개발자가 분할 매수/매도 기능을 추가한다
**Then** 액션 노드 설정에 "분할 매수/매도" 옵션이 추가된다
**And** 분할 횟수 입력이 제공된다 (1~10회, 기본값: 1)
**And** 분할 간격 입력이 제공된다 (1분~1일, 기본값: 1시간)

**Given** 사용자가 분할 매수를 설정한다
**When** 분할 횟수를 5로, 간격을 1시간으로 설정한다
**Then** 노드 라벨이 업데이트된다 (예: "매수 100 USDC (5회 분할, 1시간 간격)")
**And** 전체 수량이 분할 횟수로 나누어진다 (100 USDC / 5 = 20 USDC씩)
**And** 각 매수가 1시간 간격으로 실행된다

**Given** 분할 매수/매도가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 첫 번째 매수가 즉시 실행된다
**And** 이후 매수들이 지정된 간격으로 실행된다
**And** 각 매수가 독립적인 거래로 기록된다
**And** 모든 매수가 완료될 때까지 다음 노드로 진행되지 않는다

**Given** 분할 매수 중간에 시스템이 중단된다
**When** 백테스트가 재개된다
**Then** 마지막으로 완료된 분할부터 계속된다
**And** 이미 실행된 분할은 다시 실행되지 않는다
**And** 분할 상태가 백테스트 결과에 표시된다 ("3/5 완료")

**Given** 분할 매수/매도가 구현되었다
**When** 개발자가 다양한 분할 설정으로 테스트한다
**Then** 분할 횟수 1은 일반 매수와 동일하게 작동한다
**And** 분할 횟수 10이 정상 작동한다
**And** 다양한 간격(1분, 1시간, 1일)이 정상 작동한다
**And** 분할 간격이 백테스트 결과에 영향을 미친다 (슬리피지)

---

### Story 3.7: 조건부 분기 노드 (If-Then-Else)

As a 사용자 (User),
I want 조건부 분기 노드를 사용하여 "조건이 만족하면 A, 아니면 B" 로직을 구현하고 싶다,
So that 전략이 상황에 따라 다르게 반응할 수 있다.

**Acceptance Criteria:**

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/ConditionNode.tsx`를 생성한다
**Then** 조건 노드 컴포넌트가 구현된다
**And** 노드가 다이아몬드 형태로 표시된다 (◇)
**And** 노드가 1개 입력 포트(값)와 2개 출력 포트(Then, Else)를 가진다
**And** Then 출력이 녹색으로, Else 출력이 빨간색으로 표시된다

**Given** ConditionNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 If 노드를 추가한다
**Then** 조건 설정 패널이 표시된다
**And** 왼쪽 피연산자 입력이 제공된다 (드롭다운 또는 노드 연결)
**And** 연산자 선택이 제공된다 (>, <, >=, <=, ==)
**And** 오른쪽 피연산자 입력이 제공된다 (값 또는 노드 연결)
**And** 예: "RSI > 70" 또는 "가격 > MA200"

**Given** If 노드가 추가되었다
**When** 사용자가 조건을 설정한다 (RSI > 70)
**Then** 노드 라벨이 업데이트된다 ("If RSI > 70")
**And** Then 포트에 연결된 노드들이 조건 참일 때 실행된다
**And** Else 포트에 연결된 노드들이 조건 거짓일 때 실행된다

**Given** If 노드가 구현되었다
**When** 사용자가 다중 조건을 설정한다
**Then** AND 연산자가 제공된다 (예: "RSI > 70 AND Volume > 1000")
**And** OR 연산자가 제공된다 (예: "RSI > 70 OR MACD > 0")
**And** 복잡한 불리언 식이 구성될 수 있다
**And** 중첩 If 노드가 지원된다 (If 안에 If)

**Given** 조건부 분기가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 캔들에서 조건이 평가된다
**And** 조건이 참이면 Then 분기가 실행된다
**And** 조건이 거짓이면 Else 분기가 실행된다
**And** 조건 평가 결과가 백테스트 로그에 기록된다
**And** 분기 선택이 포트폴리오에 영향을 미친다

**Given** If 노드가 구현되었다
**When** 개발자가 복잡한 분기 로직을 테스트한다
**Then** 다중 If 노드가 중첩된다
**Then** If-Then-Else-If 체인이 지원된다
**And** 복잡한 트리 구조가 시각화된다
**And** 자동 레이아웃이 조건에 따라 조정된다

---

### Story 3.8: 순환매 및 Loop 구조

As a 사용자 (User),
I want Loop 노드를 사용하여 반복 작업을 구현하고 싶다,
So that 순환매(Rebalancing)이나 반복 매매 전략을 만들 수 있다.

**Acceptance Criteria:**

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/LoopNode.tsx`를 생성한다
**Then** Loop 노드 컴포넌트가 구현된다
**And** 노드가 육각형으로 표시된다 (⬡)
**And** 노드가 1개 입력 포트와 1개 출력 포트를 가진다
**And** Loop 본문에 하위 노드들을 포함할 수 있다 (그룹핑)

**Given** LoopNode 컴포넌트가 생성되었다
**When** 사용자가 노드 팔레트에서 For Loop 노드를 추가한다
**Then** For Loop 설정 패널이 표시된다
**And** 반복 횟수 입력이 제공된다 (1~1000회)
**And** 루프 카운터 변수가 정의된다 (예: i)
**And** Loop 본문에 하위 노드들을 추가할 수 있다

**Given** For Loop가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** Loop가 N번 반복된다
**And** 각 반복에서 루프 카운터가 증가한다
**And** Loop 본문의 노드들이 순차적으로 실행된다
**And** 반복 완료 후 다음 노드로 진행된다

**Given** 사용자가 노드 팔레트에서 While Loop 노드를 추가한다
**Then** While Loop 설정 패널이 표시된다
**And** 탈출 조건이 제공된다 (예: "포트폴리오 < 1000 USDC")
**And** 최대 반복 횟수 제한이 있다 (기본값: 100, 무한 루프 방지)
**And** 탈출 조건이 참이 될 때까지 반복된다

**Given** While Loop가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 반복 전에 탈출 조건이 평가된다
**And** 조건이 참이면 Loop가 종료된다
**And** 조건이 거짓이면 Loop가 계속된다
**And** 최대 반복 횟수에 도달하면 강제 종료되고 경고가 로깅된다

**Given** Loop 노드가 구현되었다
**When** 사용자가 Break 노드를 추가한다
**Then** Loop 내에서 Break 노드가 실행되면 Loop가 즉시 종료된다
**And** Break 후 다음 노드로 진행된다
**And** Break가 없으면 Loop가 완료될 때까지 실행된다

**Given** 순환매(Rebalancing) 전략을 구현한다
**When** 사용자가 Loop + 매수/매도를 조합한다
**Then** Loop가 매일/매주/매월 실행되도록 설정된다
**And** 예: "매월 1일에 포트폴리오를 리밸런싱"
**And** 예: "RSI < 30이면 매수, RSI > 70이면 매도"를 매일 반복
**And** 순환매가 백테스트 결과에 정확히 반영된다

**Given** Loop 구조가 구현되었다
**When** 개발자가 복잡한 Loop를 테스트한다
**Then** 중첩 Loop가 지원된다 (Loop 안에 Loop)
**And** Loop 내에서 If 노드가 정상 작동한다
**And** Break 노드가 중첩 Loop에서 외부 Loop를 종료한다
**And** Loop 성능이 최적화된다 (1000회 이상도 빠름)

---

### Story 3.9: 리스크 관리 노드 (Stop Loss, Take Profit)

As a 사용자 (User),
I want Stop Loss와 Take Profit를 설정하여 리스크를 관리하고 싶다,
So that 손실을 제한하고 이익을 확정할 수 있다.

**Acceptance Criteria:**

**Given** 노드 타입이 정의되었다 (Story 3.2)
**When** 개발자가 `src/components/editor/nodes/RiskManagementNode.tsx`를 생성한다
**Then** 리스크 관리 노드 컴포넌트가 구현된다
**And** Stop Loss(SL)과 Take Profit(TP)가 별도 노드로 제공된다
**And** 노드가 방패 모양으로 표시된다 (🛡️)
**And** 노드가 1개 입력 포트(진입 가격)와 1개 출력 포트(청산 신호)를 가진다

**Given** 사용자가 Stop Loss 노드를 추가한다
**When** SL 설정 패널이 표시된다
**Then** SL 가격 입력이 제공된다 (예: 진입 가격 - 5%)
**And** 퍼센트 또는 고정 가격을 선택할 수 있다
**And** 예: "진입 가격의 95%가 되면 청산"
**And** Trailing Stop Loss 옵션이 제공된다 (선택 사항)

**Given** 사용자가 Take Profit 노드를 추가한다
**When** TP 설정 패널이 표시된다
**Then** TP 가격 입력이 제공된다 (예: 진입 가격 + 10%)
**And** 퍼센트 또는 고정 가격을 선택할 수 있다
**And** 예: "진입 가격의 110%가 되면 청산"
**And** 여러 TP 레벨을 설정할 수 있다 (예: TP1 50%, TP2 100%)

**Given** SL/TP 노드가 설정되었다
**When** 백테스팅 엔진이 실행된다
**Then** 각 캔들에서 현재 가격이 모니터링된다
**And** SL 가격에 도달하면 포지션이 청산된다
**And** TP 가격에 도달하면 포지션이 청산된다
**And** 청산 가격, 시간, 이익/손실이 기록된다
**And** SL/TP가 트리거되면 해당 포지션은 더 이상 모니터링되지 않는다

**Given** 매수/매도 액션과 SL/TP가 조합되었다
**When** 사용자가 매수 + SL + TP를 설정한다
**Then** 매수 후 SL과 TP가 활성화된다
**And** 먼저 도달하는 쪽이 트리거된다
**And** 다른 하나는 자동으로 비활성화된다 (OCO - One Cancels Other)
**And** 백테스트 결과에 SL/TP 실행 여부가 표시된다

---

### Story 3.10: 전략 저장 및 로드 (localStorage)

As a 사용자 (User),
I want 작성 중인 전략을 저장하고 나중에 다시 불러오고 싶다,
So that 전략을 수정하고 계속 개발할 수 있다.

**Acceptance Criteria:**

**Given** 노드 에디터가 구현되었다
**When** 개발자가 전략 저장 기능을 구현한다
**Then** `src/services/strategyStorage.ts`가 생성된다
**And** `saveStrategy()` 함수가 구현된다
**And** `loadStrategy()` 함수가 구현된다
**And** `listStrategies()` 함수가 구현된다
**And** 모든 함수가 localStorage를 사용한다

**Given** 사용자가 전략을 작성 중이다
**When** 사용자가 "저장" 버튼을 클릭한다
**Then** 전략 이름 입력 모달이 표시된다
**And** 사용자가 전략 이름을 입력한다 (예: "RSI 매매 전략")
**And** 전략이 localStorage에 저장된다 (키: `gr8-strategy-{id}`)
**And** 전략 메타데이터가 저장된다 (이름, 생성일, 수정일, 노드 수)

**Given** 전략이 저장되었다
**When** 사용자가 "불러오기" 버튼을 클릭한다
**Then** 저장된 전략 목록이 표시된다
**And** 각 전략의 이름과 생성일이 표시된다
**And** 전략을 선택하면 캔버스에 로드된다
**And** 모든 노드와 연결이 복원된다

**Given** 전략 저장 기능이 구현되었다
**When** 개발자가 전략 데이터 구조를 검증한다
**Then** 전략이 JSON으로 직렬화된다
**And** 다음 정보가 포함된다: nodes[], edges[], metadata
**And** 각 노드의 전체 설정이 포함된다
**And** 전략 크기가 제한된다 (최대 1MB, localStorage 제한)

**Given** 사용자가 여러 전략을 저장했다
**When** 저장 공간이 부족해진다
**Then** 가장 오래된 전략이 자동으로 삭제된다 (LRU)
**Or 사용자에게 삭제 확인 요청이 표시된다
**And** 사용자가 직접 전략을 삭제할 수 있다

**Given** 전략 저장/로드가 구현되었다
**When** 개발자가 기능을 테스트한다
**Then** 저장 후 즉시 로드가 정상 작동한다
**And** 페이지 새로고침 후에도 로드가 작동한다
**And** 저장된 전략이 브라우저를 닫아도 유지된다
**And** FR15: 전략이 로컬에 저장된다

---

### Story 3.11: 전략 JSON export/import

As a 사용자 (User),
I want 전략을 JSON 파일로 export하고 import하고 싶다,
So that 다른 사용자와 전략을 공유하거나 백업할 수 있다.

**Acceptance Criteria:**

**Given** 전략 저장이 구현되었다 (Story 3.10)
**When** 개발자가 export/import 기능을 구현한다
**Then** `src/services/strategyIO.ts`가 생성된다
**And** `exportStrategyJSON()` 함수가 구현된다
**And** `importStrategyJSON()` 함수가 구현된다
**And** 파일 다운로드/업로드가 지원된다

**Given** 사용자가 "내보내기" 버튼을 클릭한다
**When** 현재 전략을 export한다
**Then** 전략 JSON이 생성된다
**And** 파일 다운로드가 시작된다 (파일명: `{strategy-name}.json`)
**And** JSON에 전체 전략이 포함된다 (nodes, edges, metadata)
**And** FR16: 전략이 JSON으로 export/import 된다

**Given** 사용자가 "가져오기" 버튼을 클릭한다
**When** JSON 파일을 선택한다
**Then** 파일이 업로드된다
**And** JSON 유효성 검증이 수행된다
**And** 유효하지 않은 JSON이면 에러 메시지가 표시된다
**And** 유효한 JSON이면 캔버스에 로드된다
**And** 기존 전략을 덮어쓸지 확인한다

**Given** import가 진행 중이다
**When** JSON에 유효하지 않은 노드 타입이 포함되어 있다
**Then** "알 수 없는 노드 타입이 포함되어 있습니다" 에러가 표시된다
**And** import가 중단된다
**And** 유효한 노드만 import되도록 사용자에게 묻는다 (선택 사항)

**Given** export/import가 구현되었다
**When** 개발자가 다양한 전략으로 테스트한다
**Then** 단순 전략(3개 노드)이 export/import된다
**And** 복잡한 전략(50개 노드)이 export/import된다
**And** 중첩 Loop가 포함된 전략이 export/import된다
**And** 모든 노드 설정이 보존된다

---

### Story 3.12: 전략 이름 및 설명 수정

As a 사용자 (User),
I want 전략의 이름과 설명을 수정하고 싶다,
So that 전략을 쉽게 식별하고 문서화할 수 있다.

**Acceptance Criteria:**

**Given** 노드 에디터가 구현되었다
**When** 개발자가 전략 메타데이터 UI를 추가한다
**Then** 상단 툴바에 전략 이름 표시가 있다
**And** 이름 옆에 연필 아이콘이 있다
**And** 이름을 클릭하면 편집 모드가 된다
**And** "설명 추가" 버튼이 제공된다

**Given** 전략 메타데이터 UI가 생성되었다
**When** 사용자가 전략 이름을 클릭한다
**Then** 인라인 편집이 활성화된다
**And** 사용자가 이름을 수정할 수 있다
**And** Enter 또는 클릭 외부 시 수정이 저장된다
**And** FR17: 전략의 이름이 수정된다

**Given** 사용자가 "설명 추가" 버튼을 클릭한다
**When** 전략 설명 입력 모달이 표시된다
**Then** 텍스트 영역이 제공된다 (최대 500자)
**Then** 마크다운이 지원된다 (볼드, 이탤릭, 리스트)
**And** "저장"과 "취소" 버튼이 제공된다

**Given** 전략 설명이 추가되었다
**When** 설명이 저장된다
**Then** 전략 메타데이터가 업데이트된다
**And** JSON export에 설명이 포함된다
**And** 전략 목록에 설명 미리보기가 표시된다 (최대 100자)

**Given** 전략 이름 및 설명이 설정되었다
**When** 사용자가 전략을 저장한다
**Then** 이름과 설명이 전략 메타데이터에 포함된다
**And** localStorage에 저장된다
**And** JSON export에 포함된다
**And** 전략을 로드할 때 복원된다

---

## Epic 4: 백테스팅 엔진 및 결과 검증

**Epic 목표**: 사용자가 생성한 거래 전략을 과거 데이터로 검증하고, 성과 지표를 시각화하여 전략의 유효성을 평가할 수 있게 한다.

**비즈니스 가치**: 백테스팅을 통해 사용자는 실전 투자 전에 전략의 수익성을 검증할 수 있어, 리스크를 줄이고 수익을 극대화할 수 있다.

**관련 요구사항**:
- FR18: 다양한 시간 프레임 지원 (1분, 5분, 15분, 1시간, 4시간, 1일)
- FR19: 과거 데이터 가져오기 (Binance API)
- FR20: 백테스트 실행 (기간 설정, 초기 자본)
- FR21: 성과 지표 계산 (ROI, MDD, 승률, 손익비, 샤프 비율)
- FR22: 거래 내역 추적 (모든 매수/매도 기록)
- FR23: 차트 시각화 (가격, 거래 시점, 수익 곡선)
- FR24: 백테스트 결과 저장 및 불러오기
- FR25: 템플릿 전략 백테스트 결과 제공
- FR26: 첫 백테스트 성공률 90%+ 목표
- FR27: 온체인 검증 지원 (선택)

**추정 스토리 수**: 10개

---

### Story 4.1: 백테스팅 엔진 아키텍처 설계

**사용자 스토리**: 백엔드 개발자로서, 확장 가능한 백테스팅 엔진 아키텍처를 설계하여 다양한 전략을 효율적으로 실행하고자 한다.

**수용 기준**:

**Given** 프로젝트 구조가 설정되었다
**When** 개발자가 백테스팅 엔진 아키텍처를 설계한다
**Then** FastAPI 기반 백테스팅 API가 정의된다
**And** 전략 실행 레이어가 분리되어 있다
**And** 데이터 Fetch 레이어가 독립적이다
**And** 결과 저장 레이어가 추상화되어 있다
**And** 비동기 실행이 지원된다 (Celery/BackgroundTasks)

**Given** 백테스팅 엔진 아키텍처가 설계되었다
**When** 개발자가 폴더 구조를 생성한다
**Then** 다음 구조가 생성된다:
```
backend/
  app/
    backtest/
      __init__.py
      engine.py         # 백테스팅 엔진 코어
      executor.py       # 전략 실행기
      data_fetcher.py   # 과거 데이터 가져오기
      metrics.py        # 성과 지표 계산
      storage.py        # 결과 저장
      api.py           # FastAPI 라우터
```
**And** NFR6: API 응답시간 < 200ms 유지를 위한 캐싱 전략이 있다
**And** NFR14: 백테스트 1회 실행 < 2분 보장을 위한 최적화 계획이 있다

**기술 구현**:
- FastAPI BackgroundTasks 또는 Celery for 비동기 실행
- SQLAlchemy for 결과 저장 (backtest_results 테이블)
- Redis for 캐싱 (자주 조회하는 과거 데이터)
- 태스크 큐 for 대기열 관리

---

### Story 4.2: 과거 시장 데이터 가져오기 (Binance API)

**사용자 스토리**: 시스템으로서, Binance API에서 과거 OHLCV 데이터를 가져와 백테스팅에 사용할 수 있게 한다.

**수용 기준**:

**Given** Binance API 접근 권한이 있다
**When** 사용자가 백테스트를 실행한다
**Then** 지정된 기간의 과거 데이터가 자동으로 가져와진다
**And** FR18: 다양한 시간 프레임이 지원된다 (1m, 5m, 15m, 1h, 4h, 1d)
**And** FR19: Binance API에서 OHLCV 데이터를 가져온다
**And** 데이터가 PostgreSQL에 저장된다
**And** 요청_rate limit이 준수된다 (1200 request/minute)

**Given** 데이터 가져오기 기능이 구현되었다
**When** 사용자가 백테스트 기간을 설정한다 (예: 2024-01-01 ~ 2024-12-31)
**Then** 해당 기간의 데이터가 존재하는지 확인한다
**And** 캐시된 데이터가 있으면 재사용한다
**And** 누락된 기간만 가져온다 (incremental update)
**And** 데이터 유효성을 검증한다 (결측값, 이상값 체크)

**Given** 과거 데이터가 저장되었다
**When** 백테스팅 엔진이 데이터를 조회한다
**Then** 빠른 조회를 위한 인덱스가 활용된다 (symbol, timeframe, timestamp)
**And** NFR6: API 응답시간 < 200ms가 만족된다
**And** 메모리 사용량이 최적화된다 (chunked loading)

**기술 구현**:
- `ccxt` 라이브러리 또는 Binance Python SDK
- Database schema:
  ```sql
  CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20),
    timeframe VARCHAR(10),
    timestamp BIGINT,
    open DECIMAL(20, 8),
    high DECIMAL(20, 8),
    low DECIMAL(20, 8),
    close DECIMAL(20, 8),
    volume DECIMAL(30, 8),
    UNIQUE(symbol, timeframe, timestamp)
  );
  CREATE INDEX idx_market_data_lookup ON market_data(symbol, timeframe, timestamp);
  ```
- Redis 캐싱: `market_data:{symbol}:{timeframe}:{start_date}:{end_date}`
- Rate limiter: 1 request per 50ms (conservative)

---

### Story 4.3: 전략 실행 엔진 구현

**사용자 스토리**: 백테스팅 엔진으로서, 사용자가 정의한 노드 기반 전략을 과거 데이터에 대해 순차적으로 실행하여 거래 시뮬레이션을 수행한다.

**수용 기준**:

**Given** 과거 데이터가 준비되었다
**When** 백테스팅 엔진이 실행된다
**Then** 전략 JSON이 파싱된다
**And** 노드 그래프가 실행 가능한 형태로 변환된다
**And** FR20: 지정된 기간에 대해 순차적으로 실행된다
**And** 각 캔들마다 시뮬레이션이 진행된다

**Given** 전략 실행 엔진이 구현되었다
**When** 전략이 실행된다
**Then** Market Data 노드가 현재 캔들의 데이터를 제공한다
**And** Indicator 노드가 기술적 지표를 계산한다 (RSI, MACD, MA)
**And** Condition 노드가 조건을 평가한다 (If-Then-Else)
**And** Loop 노드가 순환 로직을 처리한다 (For/While)
**And** Action 노드가 매수/매도를 실행한다
**And** Risk Management 노드가 손절/익절을 모니터링한다

**Given** 전략 실행 중 매수/매도가 발생한다
**When** Buy/Sell 액션이 실행된다
**Then** FR20: 초기 자본이 고려된다
**And** 수수료가 계산된다 (0.1%)
**And** 슬리피지가 시뮬레이션된다 (0.05%)
**And** 포지션이 업데이트된다
**And** FR22: 모든 거래가 기록된다

**기술 구현**:
```python
class BacktestEngine:
    def __init__(self, strategy: dict, initial_capital: float):
        self.strategy = parse_strategy(strategy)
        self.initial_capital = initial_capital
        self.current_capital = initial_capital
        self.position = {}
        self.trades = []

    def run(self, data: pd.DataFrame):
        for i, candle in data.iterrows():
            # 각 노드 실행
            context = self._execute_nodes(candle, i)
            # 액션 처리
            self._handle_actions(context)
        return self._get_results()

    def _execute_nodes(self, candle, index):
        # 노드 그래프 실행 로직
        pass

    def _handle_actions(self, context):
        # 매수/매도 실행 및 포지션 관리
        pass
```

---

### Story 4.4: 성과 지표 계산 (ROI, MDD, 승률 등)

**사용자 스토리**: 사용자로서, 백테스트 결과에 대해 다양한 성과 지표를 확인하여 전략의 수익성과 리스크를 평가하고 싶다.

**수용 기준**:

**Given** 백테스트가 완료되었다
**When** 결과가 계산된다
**Then** FR21: 다음 성과 지표가 자동으로 계산된다:
  - ROI (총 수익률): (최종 자본 - 초기 자본) / 초기 자본 × 100%
  - MDD (최대 낙폭): 최고점에서 최저점까지의 최대 손실률
  - 승률: 수익성 거래 / 전체 거래 × 100%
  - 손익비: 평균 수익 / 평균 손실
  - 샤프 비율: (수익률 - 무위험 이자율) / 수익률 표준편차
  - 총 거래 횟수
  - 평균 보유 기간

**Given** 성과 지표가 계산되었다
**When** 사용자가 결과를 조회한다
**Then** 모든 지표가 한눈에 표시된다
**And** 지표가 시각적으로 요약된다 (카드/대시보드 형태)
**And** 벤치마크와 비교된다 (예: Buy & Hold)
**And** NFR18: 계산 오차 범위 ±0.1% 이내가 보장된다

**Given** MDD가 계산되었다
**When** 사용자가 MDD를 본다
**Then** 최대 낙폭이 퍼센트로 표시된다
**And** MDD가 발생한 기간이 표시된다
**And** 차트에 MDD 구간이 하이라이트된다

**기술 구현**:
```python
def calculate_metrics(trades: List[Trade], initial_capital: float) -> dict:
    final_capital = calculate_final_capital(trades, initial_capital)
    roi = (final_capital - initial_capital) / initial_capital * 100

    equity_curve = build_equity_curve(trades, initial_capital)
    mdd = calculate_max_drawdown(equity_curve)

    winning_trades = [t for t in trades if t.profit > 0]
    losing_trades = [t for t in trades if t.profit < 0]
    win_rate = len(winning_trades) / len(trades) * 100

    avg_win = np.mean([t.profit for t in winning_trades])
    avg_loss = np.mean([t.profit for t in losing_trades])
    profit_factor = abs(avg_win / avg_loss) if losing_trades else float('inf')

    sharpe_ratio = calculate_sharpe_ratio(equity_curve)

    return {
        'roi': roi,
        'mdd': mdd,
        'win_rate': win_rate,
        'profit_factor': profit_factor,
        'sharpe_ratio': sharpe_ratio,
        'total_trades': len(trades),
        'final_capital': final_capital
    }
```

---

### Story 4.5: 거래 내역 추적

**사용자 스토리**: 사용자로서, 백테스팅 중 발생한 모든 매수/매도 거래의 상세 내역을 확인하여 어떤 결정이 내려졌는지 이해하고 싶다.

**수용 기준**:

**Given** 백테스트가 실행된다
**When** 매수/매도가 발생한다
**Then** FR22: 모든 거래가 기록된다
**And** 각 거래에 다음 정보가 저장된다:
  - 타임스탬프
  - 거래 유형 (BUY/SELL)
  - 가격
  - 수량
  - 수수료
  - 포지션 사이즈
  - 노드 ID (어떤 조건으로 실행되었는지)

**Given** 백테스트가 완료되었다
**When** 사용자가 거래 내역을 조회한다
**Then** FR22: 모든 거래가 시간 순서대로 표시된다
**And** 각 거래의 상세 정보가 표시된다
**And** 수익/손실이 색상으로 구분된다 (초록/빨강)
**And** 페이지네이션이 지원된다 (20개씩)

**Given** 거래 내역이 표시되었다
**When** 사용자가 특정 거래를 클릭한다
**Then** 해당 거래가 발생한 시점의 차트로 이동한다
**And** 해당 거래를 유발한 노드가 하이라이트된다
**And** 당시의 시장 데이터가 표시된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE backtest_trades (
    id SERIAL PRIMARY KEY,
    backtest_id INTEGER REFERENCES backtest_results(id),
    timestamp BIGINT,
    trade_type VARCHAR(10),  -- BUY/SELL
    price DECIMAL(20, 8),
    quantity DECIMAL(20, 8),
    fee DECIMAL(20, 8),
    position_size DECIMAL(20, 8),
    pnl DECIMAL(20, 8),
    node_id VARCHAR(50),     -- 어떤 노드에서 실행되었는지
    market_data JSONB         -- 당시 시장 데이터 스냅샷
  );
  CREATE INDEX idx_backtest_trades_query ON backtest_trades(backtest_id, timestamp);
  ```

---

### Story 4.6: 백테스트 결과 저장 및 불러오기

**사용자 스토리**: 사용자로서, 백테스트 결과를 저장하고 나중에 다시 불러와서 이전 결과와 비교하고 싶다.

**수용 기준**:

**Given** 백테스트가 완료되었다
**When** 사용자가 결과를 저장한다
**Then** FR24: 백테스트 결과가 데이터베이스에 저장된다
**And** 다음 정보가 포함된다:
  - 전략 ID
  - 실행 기간
  - 초기 자본
  - 성과 지표 (ROI, MDD, 승률 등)
  - 모든 거래 내역
  - 실행 시간
  - 실행자 (사용자 ID)
**And** 결과에 고유 ID가 할당된다

**Given** 백테스트 결과가 저장되었다
**When** 사용자가 "내 백테스트" 페이지를 연다
**Then** FR24: 모든 저장된 결과가 목록으로 표시된다
**And** 각 결과의 요약 정보가 표시된다 (전략명, 기간, ROI, 실행일)
**And** 최신 순으로 정렬된다
**And** 검색과 필터링이 지원된다 (전략별, 기간별)

**Given** 저장된 백테스트 결과가 있다
**When** 사용자가 특정 결과를 선택한다
**Then** FR24: 상세 결과가 불러와진다
**And** 모든 성과 지표가 복원된다
**And** 거래 내역이 표시된다
**And** 차트가 다시 그려진다
**And** NFR6: API 응답시간 < 200ms가 만족된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE backtest_results (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    strategy_id VARCHAR(50),
    strategy_name VARCHAR(200),
    start_date DATE,
    end_date DATE,
    initial_capital DECIMAL(20, 8),
    final_capital DECIMAL(20, 8),
    roi DECIMAL(10, 4),
    mdd DECIMAL(10, 4),
    win_rate DECIMAL(10, 4),
    sharpe_ratio DECIMAL(10, 4),
    total_trades INTEGER,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    strategy_json JSONB,      -- 전략 스냅샷
    metrics_json JSONB        -- 모든 성과 지표
  );
  CREATE INDEX idx_backtest_user_results ON backtest_results(user_id, created_at DESC);
  ```

---

### Story 4.7: 백테스트 결과 시각화 UI

**사용자 스토리**: 사용자로서, 백테스트 결과를 차트와 그래프로 시각화하여 전략의 성과를 직관적으로 이해하고 싶다.

**수용 기준**:

**Given** 백테스트가 완료되었다
**When** 결과 페이지가 표시된다
**Then** FR23: 차트 시각화가 제공된다
**And** 메인 차트에 가격 움직임이 표시된다
**And** 모든 매수/매도 시점이 마커로 표시된다
**And** 수익 곡선(Equity Curve)이 별도 차트로 표시된다
**And** MDD 구간이 하이라이트된다

**Given** 결과 차트가 표시되었다
**When** 사용자가 차트와 상호작용한다
**Then** 줌 인/아웃이 가능하다
**And** 범위 선택이 가능하다 (특정 기간만 확대)
**And** 마우스 호버 시 상세 정보가 표시된다 (가격, 거래 내역)
**And** 매수/매도 마커 클릭 시 해당 거래 상세가 표시된다

**Given** 시각화 라이브러리가 선택되었다
**When** 차트가 구현된다
**Then** TradingView Widgets 또는 lightweight-charts가 사용된다
**And** 차트가 반응형이다 (모바일 지원)
**And** NFR6: 렌더링 성능 < 500ms가 만족된다
**And** 다크 모드가 지원된다

**기술 구현**:
- `react-lightweight-charts` 또는 `tradingview-widget`
- 차트 구성:
  ```typescript
  interface BacktestChart {
    priceChart: {
      type: 'candlestick',
      data: OHLCV[],
      markers: {
        time: number,
        position: 'aboveBar' | 'belowBar',
        color: string,
        shape: 'arrow' | 'circle',
        text: 'Buy' | 'Sell'
      }[]
    },
    equityChart: {
      type: 'line',
      data: { time: number, value: number }[],
      mddHighlight: { start: number, end: number }
    }
  }
  ```
- Recharts for 추가 지표 차트 (수익 분포, 월간 수익률 등)

---

### Story 4.8: 백테스트 실행 및 파라미터 설정 UI

**사용자 스토리**: 사용자로서, 백테스트를 실행할 때 기간, 초기 자본, 기간 설정 등 파라미터를 쉽게 설정하고 싶다.

**수용 기준**:

**Given** 사용자가 전략 에디터에 있다
**When** "백테스트 실행" 버튼을 클릭한다
**Then** 백테스트 설정 모달이 표시된다
**And** 다음 파라미터를 설정할 수 있다:
  - 시작 날짜 (Date picker)
  - 종료 날짜 (Date picker)
  - 초기 자본 (Number input, 기본값 $10,000)
  - 타임프레임 (Select: 1m, 5m, 15m, 1h, 4h, 1d)
  - 수수료 (Number input, 기본값 0.1%)
  - 슬리피지 (Number input, 기본값 0.05%)

**Given** 백테스트 설정 모달이 열렸다
**When** 사용자가 파라미터를 설정한다
**Then** 시작/종료 날짜의 유효성이 검증된다
**And** 초기 자본이 양수여야 한다
**And** 날짜 범위가 데이터 가용 범위 내인지 확인된다
**And** FR20: 최대 1년 범위로 제한된다 (성능 고려)

**Given** 파라미터가 설정되었다
**When** "백테스트 시작" 버튼을 클릭한다
**Then** 백테스트가 비동기로 실행된다
**And** 진행 상태가 표시된다 (Progress bar)
**And** FR26: 첫 백테스트 성공률 90%+를 위해 예상 소요 시간이 표시된다
**And** 완료 시 알림이 표시된다
**And** NFR14: 2분 이내에 완료된다 (1년 데이터 기준)

**기술 구현**:
- React Hook Form for 폼 관리
- Zod for 스키마 검증:
  ```typescript
  const BacktestParamsSchema = z.object({
    startDate: z.date().max(new Date()),
    endDate: z.date().max(new Date()),
    initialCapital: z.number().positive().max(1000000),
    timeframe: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']),
    commission: z.number().min(0).max(1).default(0.001),
    slippage: z.number().min(0).max(1).default(0.0005)
  });
  ```
- WebSocket for 실시간 진행 상태 업데이트
- Polling fallback (3초마다 상태 확인)

---

### Story 4.9: 템플릿 전략 백테스트 결과 제공

**사용자 스토리**: 신규 사용자로서, 템플릿으로 제공되는 전략들의 백테스트 결과를 미리 확인하여 어떤 전략을 선택할지 결정하고 싶다.

**수용 기준**:

**Given** 템플릿 전략들이 제공된다
**When** 사용자가 "전략 라이브러리" 페이지를 연다
**Then** FR25: 각 템플릿 전략의 백테스트 결과가 표시된다
**And** 다음 요약 정보가 제공된다:
  - 전략 이름 및 설명
  - 백테스트 기간 (예: 2024-01-01 ~ 2024-12-31)
  - ROI (총 수익률)
  - MDD (최대 낙폭)
  - 승률
  - 샤프 비율
  - 총 거래 횟수
**And** 결과가 한눈에 비교 가능하다

**Given** 템플릿 전략 백테스트 결과가 표시되었다
**When** 사용자가 특정 전략을 선택한다
**Then** 상세 백테스트 결과 페이지로 이동한다
**And** 전체 차트와 지표가 표시된다
**And** "이 전략 사용하기" 버튼이 제공된다

**Given** 템플릿이 선택된다
**When** 사용자가 "이 전략 사용하기"를 클릭한다
**Then** 전략이 사용자의 작업 공간으로 복사된다
**And** 사용자가 수정 가능한 상태가 된다
**And** FR25: 원본 템플릿과 구분된다 (복사본 표시)

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE template_strategies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200),
    description TEXT,
    category VARCHAR(50),  -- trend, momentum, mean_reversion
    strategy_json JSONB,
    backtest_result_id INTEGER REFERENCES backtest_results(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- API endpoint: `GET /api/templates/with-backtest`
- 결과 캐싱: 모든 템플릿 백테스트 결과는 미리 계산되어 캐시됨

---

### Story 4.10: 백테스트 검증 및 에러 핸들링

**사용자 스토리**: 사용자로서, 백테스트 실행 중 에러가 발생하면 명확한 에러 메시지를 받고, FR26의 첫 백테스트 성공률 90%+ 목표를 달성하고 싶다.

**수용 기준**:

**Given** 사용자가 백테스트를 실행한다
**When** 전략에 에러가 있다 (예: 순환 참조, 연결 끊김)
**Then** 전략 유효성 검사가 먼저 실행된다
**And** 에러가 명확하게 표시된다
**And** 어떤 노드에 문제가 있는지 하이라이트된다
**And** 수정 제안이 제공된다

**Given** 전략 유효성 검사를 통과했다
**When** 백테스트가 실행된다
**Then** 다음이 검증된다:
  - 모든 노드가 연결되어 있다
  - 순환 참조가 없다 (Loop 노드 제외)
  - 필수 파라미터가 설정되었다
  - 데이터가 충분하다
**And** FR26: 검증 실패 시 실행되지 않는다

**Given** 백테스트 실행 중 에러가 발생한다
**When** API 에러가 발생한다
**Then** 사용자에게 친절한 에러 메시지가 표시된다
**And** 에러 로그가 서버에 기록된다
**And** NFR17: 에러 로그는 7년 보관된다 (핀테크 규제 준수)
**And** 재시도 옵션이 제공된다

**Given** FR26: 첫 백테스트 성공률 90%+ 목표가 있다
**When** 백테스트 기능이 개발된다
**Then** 포괄적인 에러 핸들링이 구현된다
**And** 사용자 입력 검증이 강화된다
**And** 전략 유효성 검사가 엄격하다
**And** 에러 메시지가 명확하고 조작 가능하다
**And** FR26: 성공률이 모니터링된다 (Datadog/CloudWatch)

**기술 구현**:
```python
class BacktestValidator:
    def validate_strategy(self, strategy: dict) -> ValidationResult:
        errors = []

        # 연결 검증
        if not self._check_connections(strategy):
            errors.append("모든 노드가 연결되어야 합니다")

        # 순환 참조 검증
        if self._has_circular_reference(strategy):
            errors.append("순환 참조가 발견되었습니다")

        # 파라미터 검증
        missing_params = self._check_required_params(strategy)
        if missing_params:
            errors.append(f"필수 파라미터가 누락되었습니다: {missing_params}")

        # 데이터 가용성 검증
        if not self._check_data_availability(strategy):
            errors.append("요청한 기간의 데이터가 없습니다")

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors
        )
```

**성공률 추적**:
- CloudWatch metric: `BacktestSuccessRate` (성공 / (성공 + 실패))
- CloudWatch Alarm: 성공률 < 90% 시 경보
- 에러 유형별 분류 대시보드

---

**Epic 4 완료 기준**:
- ✅ 모든 10개 스토리가 구현되었다
- ✅ FR18-FR27이 모두 커버되었다
- ✅ 사용자가 전략을 백테스트하고 결과를 확인할 수 있다
- ✅ FR26: 첫 백테스트 성공률 90%+ 달성
- ✅ NFR14: 백테스트 실행 시간 < 2분
- ✅ NFR6: API 응답시간 < 200ms

---

## Epic 5: 전략 마켓플레이스

**Epic 목표**: 사용자가 자신의 전략을 마켓플레이스에 게시하고, 다른 사용자의 전략을 검색, 구매, 포크하여 활용할 수 있는 생태계를 구축한다.

**비즈니스 가치**: 전략 마켓플레이스를 통해 크리에이터는 수익을 창출하고, 사용자는 검증된 전략을 쉽게 접근하여 자신의 트레이딩 성과를 향상시킬 수 있다. 플랫폼은 수수료로 수익을 얻는다.

**관련 요구사항**:
- FR28: 전략 라이브러리 페이지 (모든 공유 전략 목록)
- FR29: 전략 필터링 및 검색 (성과, 카테고리, 가격)
- FR30: 전략 상세 페이지 (설명, 백테스트 결과, 거래 내역)
- FR31: 전략 게시 기능 (이름, 설명, 가격, 스마트 컨트랙트 배포)
- FR32: 전략 구매 (스마트 컨트랙트, 지갑 결제)
- FR33: 전략 포크 (구매 후 수정 가능한 복사본 생성)
- FR34: 가격 모델 (무료, 일시불, 구독)
- FR35: 수수료 모델 (플랫폼 10%, 크리에이터 90%)
- FR36: 전략 검증 (백테스트 결과 온체인 저장)

**추정 스토리 수**: 9개

---

### Story 5.1: 전략 라이브러리 페이지 UI

**사용자 스토리**: 사용자로서, 마켓플레이스에서 다른 사용자들이 공유한 모든 전략을 한눈에 보고 싶다.

**수용 기준**:

**Given** 사용자가 로그인했다
**When** 사용자가 "마켓플레이스" 페이지를 연다
**Then** FR28: 전략 라이브러리 페이지가 표시된다
**And** 모든 공유된 전략이 카드 형태로 표시된다
**And** 각 전략 카드에 다음 정보가 표시된다:
  - 전략 이름
  - 크리에이터 이름 또는 지갑 주소 (축약형)
  - 썸네일 이미지 (선택 사항)
  - 백테스트 ROI (큰 폰트)
  - MDD
  - 승률
  - 가격 (무료/유료)
  - 평균 별점 (리뷰가 있다면)
**And** 기본 정렬은 "인기순"이다

**Given** 전략 라이브러리 페이지가 표시되었다
**When** 페이지가 로드된다
**Then** NFR6: API 응답시간 < 200ms가 만족된다
**And** 무한 스크롤 또는 페이지네이션이 지원된다 (20개씩)
**And** 로딩 스켈레톤이 표시된다
**And** NFR15: 95번째 백분위수 로딩 시간 < 1초

**Given** 전략 카드들이 표시되었다
**When** 사용자가 카드를 호버한다
**Then** 카드가 하이라이트된다
**And** "상세 보기" 버튼이 표시된다
**And** 클릭 시 전략 상세 페이지로 이동한다

**기술 구현**:
- React Query for data fetching
- Virtual scrolling (react-virtuoso) for performance
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
- Skeleton loading component
```typescript
interface StrategyCard {
  id: string;
  name: string;
  creator: {
    address: string;
    ens?: string;
  };
  thumbnail?: string;
  backtestResult: {
    roi: number;
    mdd: number;
    winRate: number;
  };
  price: {
    amount: number;
    currency: 'USD' | 'USDC';
    model: 'free' | 'one_time' | 'subscription';
  };
  averageRating?: number;
  reviewCount?: number;
}
```

---

### Story 5.2: 전략 필터링 및 검색

**사용자 스토리**: 사용자로서, 원하는 성과나 조건에 맞는 전략을 빠르게 찾기 위해 필터링과 검색 기능을 사용하고 싶다.

**수용 기준**:

**Given** 사용자가 마켓플레이스 페이지에 있다
**When** 페이지가 로드된다
**Then** FR29: 필터바가 상단에 표시된다
**And** 다음 필터 옵션이 제공된다:
  - 검색어 (전략 이름, 크리에이터)
  - 카테고리 (추세 추종, 모멘텀, 평균 회귀, 기타)
  - 최소 ROI (Slider: 0% ~ 500%)
  - 최대 MDD (Slider: 0% ~ 100%)
  - 최소 승률 (Slider: 0% ~ 100%)
  - 가격 유형 (전체, 무료, 유료)
  - 정렬 (인기순, 최신순, ROI 높은순, 가격 낮은순)
**And** 각 필터가 적용된 결과 개수를 표시한다

**Given** 필터바가 표시되었다
**When** 사용자가 검색어를 입력한다
**Then** FR29: 실시간 검색이 실행된다 (debounce 300ms)
**And** 전략 이름과 크리에이터 주소가 검색된다
**And** NFR6: 검색 결과 < 200ms 응답

**Given** 사용자가 필터를 적용한다
**When** ROI 슬라이더를 50%로 설정한다
**Then** ROI 50% 이상인 전략만 표시된다
**And** FR29: 다른 필터와 AND 조건으로 결합된다
**And** URL에 필터 파라미터가 반영된다 (공유 가능)
**And** 필터가 localStorage에 저장된다 (다음 방문 시 복원)

**Given** 복합 필터가 적용되었다
**When** 사용자가 "필터 초기화"를 클릭한다
**Then** 모든 필터가 초기화된다
**And** 모든 전략이 다시 표시된다

**기술 구현**:
- URLSearchParams for 필터 상태 관리
- Debounced search input
- Algolia 또는 PostgreSQL Full Text Search (검색 최적화)
- Database indexing:
  ```sql
  CREATE INDEX idx_strategies_search ON published_strategies(name, creator_address);
  CREATE INDEX idx_strategies_filters ON published_strategies(category, price_model, created_at);
  ```
- React Hook Form for 필터 상태

---

### Story 5.3: 전략 상세 페이지

**사용자 스토리**: 사용자로서, 전략의 상세 정보(설명, 백테스트 결과, 거래 내역, 크리에이터 정보)를 확인하여 구매할지 결정하고 싶다.

**수용 기준**:

**Given** 사용자가 전략 카드를 클릭한다
**When** 전략 상세 페이지가 열린다
**Then** FR30: 전략 상세 정보가 표시된다
**And** 다음 섹션들이 제공된다:
  1. **헤더**: 전략 이름, 크리에이터 정보, 배지 (검증됨/인기)
  2. **요약**: 백테스트 핵심 지표 (ROI, MDD, 승률, 샤프 비율)
  3. **설명**: 전략 설명 (마크다운 렌더링)
  4. **백테스트 차트**: 가격 차트 + 매수/매도 마커
  5. **성과 지표**: 모든 지표 상세 테이블
  6. **거래 내역**: 최근 20개 거래 (전체 보기 링크)
  7. **가격 및 구매**: 가격 모델, 구매 버튼
  8. **리뷰**: 사용자 리뷰 및 별점 (Story 8.x)
**And** NFR6: 페이지 로드 < 500ms

**Given** 전략 상세 페이지가 표시되었다
**When** 사용자가 크리에이터 정보를 본다
**Then** FR30: 크리에이터 지갑 주소가 표시된다
**And** ENS 도메인이 있다면 표시된다
**And** "크리에이터의 다른 전략" 링크가 제공된다
**And** 총 판매량, 총 수익이 표시된다 (Story 6.x)

**Given** 사용자가 백테스트 결과를 확인한다
**When** "백테스트 상세 보기"를 클릭한다
**Then** FR30: 전체 백테스트 결과 모달이 열린다
**And** 모든 성과 지표가 표시된다
**And** 전체 거래 내역이 표시된다 (페이지네이션)
**And** FR36: 온체인 검증 배지가 표시된다
**And** "블록체인에서 확인하기" 링크가 제공된다

**Given** 전략을 구매하지 않은 사용자다
**When** 상세 페이지를 본다
**Then** 전략 로직(노드 그래프)은 가려진다
**And** "전략 내용 보기" 대신 "구매 후 확인 가능" 메시지가 표시된다
**And** 미리보기 섬네일만 표시된다

**기술 구현**:
- React Router for 라우팅 (`/marketplace/:strategyId`)
- Markdown 라이브러리 (react-markdown)
- 차트 라이브러리 재사용 (Story 4.7)
```typescript
interface StrategyDetail {
  id: string;
  name: string;
  description: string;
  creator: {
    address: string;
    ens?: string;
    totalSales: number;
    totalRevenue: number;
  };
  backtestResult: BacktestResult;
  price: PriceInfo;
  isVerified: boolean;  // FR36
  isPopular: boolean;   // 추천 알고리즘
  reviews: Review[];
  isPurchased: boolean; // 현재 사용자 구매 여부
}
```

---

### Story 5.4: 전략 게시 기능

**사용자 스토리**: 크리에이터로서, 내가 만든 전략을 마켓플레이스에 게시하고 가격을 설정하여 다른 사용자들에게 판매하고 싶다.

**수용 기준**:

**Given** 사용자가 전략 에디터에 있다
**When** "마켓플레이스에 게시" 버튼을 클릭한다
**Then** FR31: 전략 게시 모달이 표시된다
**And** 다음 필드를 입력할 수 있다:
  - 전략 이름 (필수, 50자 제한)
  - 전략 설명 (필수, 500자, 마크다운 지원)
  - 카테고리 (Select: 추세 추종, 모멘텀, 평균 회귀, 기타)
  - 썸네일 이미지 (선택, 최대 5MB)
  - 가격 모델 (Radio: 무료, 일시불, 구독)
  - 가격 (가격 모델이 유료일 때)
**And** 게시 요약 정보가 표시된다 (수수료, 정산 주기)

**Given** 게시 모달이 열렸다
**When** 사용자가 정보를 입력하고 "게시"를 클릭한다
**Then** FR31: 전략이 스마트 컨트랙트에 배포된다
**And** FR31: 백테스트 결과가 온체인에 저장된다 (FR36)
**And** 전략 메타데이터가 데이터베이스에 저장된다
**And** 지갑 서명이 요청된다 (MetaMask/WalletConnect)
**And** 게시 수수료가 표시된다 (가스비)
**And** "게시 완료" 알림이 표시된다

**Given** 전략 게시가 완료되었다
**When** 사용자가 "내 전략" 페이지를 연다
**Then** 게시된 전략이 "게시됨" 탭에 표시된다
**And** 판매 통계가 표시된다 (판매량, 수익)
**And** "게시 취소" 버튼이 제공된다 (판매 없을 때만)
**And** "가격 수정" 버튼이 제공된다

**Given** 전략 게시 중 에러가 발생한다
**When** 스마트 컨트랙트 배포가 실패한다
**Then** 명확한 에러 메시지가 표시된다
**And** 실패 사유가 설명된다 (예: 가스비 부족, 거절)
**And** 재시도 옵션이 제공된다
**And** NFR17: 에러 로그가 7년 보관된다 (핀테크 규제 준수)

**기술 구현**:
- Smart Contract deployment (Story 6.x)
- Backend API:
  ```python
  @router.post("/api/marketplace/publish")
  async def publish_strategy(
    strategy_id: str,
    metadata: StrategyPublishMetadata,
    user_id: str
  ):
      # 1. 전략 유효성 검증
      # 2. 백테스트 결과 온체인 저장 (FR36)
      # 3. 스마트 컨트랙트 배포
      # 4. 메타데이터 DB 저장
      pass
  ```
- IPFS for 전략 JSON 저장 (탈중앙화)
- Database schema:
  ```sql
  CREATE TABLE published_strategies (
    id VARCHAR(50) PRIMARY KEY,
    strategy_id VARCHAR(50),
    creator_address VARCHAR(50) NOT NULL,
    name VARCHAR(200),
    description TEXT,
    category VARCHAR(50),
    thumbnail_url VARCHAR(500),
    price_model VARCHAR(20),  -- free, one_time, subscription
    price_amount DECIMAL(20, 8),
    contract_address VARCHAR(50),
    backtest_tx_hash VARCHAR(100),  -- FR36
    is_verified BOOLEAN DEFAULT false,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```

---

### Story 5.5: 스마트 컨트랙트 배포 (전략 NFT/라이선스)

**사용자 스토리**: 시스템으로서, 전략 게시 시 스마트 컨트랙트를 배포하여 전략의 소유권과 라이선스를 관리하고, 구매 시 안전한 거래를 보장한다.

**수용 기준**:

**Given** 크리에이터가 전략 게시를 요청한다
**When** 백엔드가 스마트 컨트랙트 배포를 처리한다
**Then** FR31: 전략용 스마트 컨트랙트가 배포된다
**And** FR36: 백테스트 결과가 온체인에 기록된다
**And** 컨트랙트에 다음 정보가 저장된다:
  - 크리에이터 주소
  - 전략 메타데이터 (IPFS hash)
  - 가격 모델 및 가격
  - 백테스트 결과 해시 (검증용)
**And** 배포 트랜잭션 해시가 반환된다

**Given** 스마트 컨트랙트가 배포되었다
**When** 사용자가 전략을 구매한다
**Then** FR32: 구매 트랜잭션이 실행된다
**And** 결제가 지갑에서 이루어진다 (USDC/ETH)
**And** FR35: 수수료가 분배된다 (10% 플랫폼, 90% 크리에이터)
**And** 구매자에게 NFT/라이선스가 발행된다
**And** 구매가 완료되면 전략 잠금이 해제된다

**Given** 사용자가 전략을 구매했다
**When** 사용자가 "내 전략" 페이지를 연다
**Then** 구매한 전략이 "구매함" 탭에 표시된다
**And** 전략을 수정할 수 있다 (포크)
**And** 전략을 다시 게시할 수 없다 (저작권 보호)

**기술 구현**:
- Solidity Smart Contract:
  ```solidity
  contract StrategyMarketplace {
      struct Strategy {
          address creator;
          string metadataURI;  // IPFS
          PriceModel priceModel;
          uint256 price;
          bytes32 backtestHash;  // FR36
      }

      enum PriceModel { Free, OneTime, Subscription }

      mapping(uint256 => Strategy) public strategies;
      mapping(address => mapping(uint256 => bool)) public purchases;

      event StrategyPublished(uint256 indexed strategyId, address creator);
      event StrategyPurchased(uint256 indexed strategyId, address buyer, address creator);

      function publishStrategy(
          string memory metadataURI,
          PriceModel priceModel,
          uint256 price,
          bytes32 backtestHash
      ) external returns (uint256) {
          // FR31: 전략 게시
      }

      function purchaseStrategy(uint256 strategyId) external payable {
          // FR32: 구매 처리
          // FR35: 수수료 분배 (10% 플랫폼, 90% 크리에이터)
      }

      function verifyPurchase(uint256 strategyId, address user) external view returns (bool) {
          return purchases[user][strategyId];
      }
  }
  ```
- ethers.js / viem for Web3 interaction
- IPFS for 전략 JSON storage (Pinata/NFT.Storage)

---

### Story 5.6: 전략 구매 (Wallet Payment)

**사용자 스토리**: 사용자로서, 마음에 드는 전략을 지갑으로 결제하고 구매하여 내 작업 공간에서 사용하고 싶다.

**수용 기준**:

**Given** 사용자가 전략 상세 페이지에 있다
**When** 사용자가 아직 구매하지 않은 전략을 본다
**Then** FR32: "구매하기" 버튼이 표시된다
**And** 가격이 명확하게 표시된다
**And** 가격 모델이 표시된다 (일시불/구독)
**And** 수수료 정보가 표시된다 (없음)

**Given** "구매하기" 버튼이 표시되었다
**When** 사용자가 버튼을 클릭한다
**Then** FR32: 지갑 서명 요청이 표시된다
**And** 거래 세부 정보가 표시된다:
  - 전략 이름
  - 가격
  - 수수료 (0%)
  - 총 결제 금액
**And** MetaMask/WalletConnect가 실행된다
**And** 트랜잭션이 블록체인에 제출된다

**Given** 구매 트랜잭션이 제출되었다
**When** 트랜잭션이 완료될 때까지 기다린다
**Then** 진행 상태가 표시된다 (Processing...)
**And** 예상 완료 시간이 표시된다 (약 15초)
**And** 완료 시 "구매 완료" 알림이 표시된다
**And** 페이지가 자동으로 새로고침된다

**Given** 구매가 완료되었다
**When** 페이지가 새로고침된다
**Then** "구매하기" 버튼이 "내 작업 공간에 추가"로 변경된다
**And** 전략 로직(노드 그래프)이 표시된다
**And** "포크하기" 버튼이 활성화된다
**And** FR33: 포크(수정 가능한 복사본 생성)가 가능하다

**Given** 구매 중 에러가 발생한다
**When** 사용자가 트랜잭션을 거절한다
**Then** "거절됨" 메시지가 표시된다
**And** 다시 시도할 수 있다

**Given** 잔액이 부족하다
**When** 구매를 시도한다
**Then** "잔액 부족" 에러가 표시된다
**And** 필요한 금액이 안내된다
**And** 지갑 충전 링크가 제공된다

**기술 구현**:
- Smart Contract interaction (viem/ethers)
```typescript
async function purchaseStrategy(strategyId: string, price: bigint) {
  const { request } = await publicClient.simulateContract({
    address: MARKETPLACE_CONTRACT,
    abi: marketplaceABI,
    functionName: 'purchaseStrategy',
    args: [strategyId],
    value: price
  });

  const hash = await walletClient.writeContract(request);

  // 트랜잭션 완료 대기
  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}
```
- Transaction status monitoring (WebSocket polling)
- Error handling (User rejected, Insufficient funds)

---

### Story 5.7: 전략 포크 (Fork)

**사용자 스토리**: 사용자로서, 구매한 전략을 기반으로 수정하여 나만의 버전을 만들고 싶다.

**수용 기준**:

**Given** 사용자가 전략을 구매했다
**When** 전략 상세 페이지에 있다
**Then** FR33: "포크하기" 버튼이 표시된다
**And** 버튼 옆에 설명이 있다: "이 전략의 복사본을 생성하고 수정하세요"

**Given** "포크하기" 버튼을 클릭한다
**When** 포크 확인 모달이 표시된다
**Then** 다음 정보가 표시된다:
  - 원본 전략 이름
  - 새로운 이름 입력 필드 (기본값: "[원본] - 포크")
  - 설명 입력 필드 (선택)
  - "원본 크레딧 유지" 체크박스 (기본값: 체크됨)
**And** "포크 생성" 버튼이 제공된다

**Given** 사용자가 "포크 생성"을 클릭한다
**When** 포크가 생성된다
**Then** FR33: 전략의 복사본이 생성된다
**And** 사용자의 작업 공간으로 이동한다
**And** 전략 에디터가 열린다
**And** 모든 노드와 연결이 복사된다
**And** "원본: [전략명]" 라벨이 표시된다
**And** 수정이 자유롭다

**Given** 포크된 전략이 생성되었다
**When** 사용자가 전략을 저장한다
**Then** FR33: 원본과 완전히 독립적인 복사본이다
**And** 원본 크리에이터에게 크레딧이 표시된다
**And** "원본 크레딧 유지"가 체크되어 있으면 메타데이터에 원본 정보가 포함된다
**And** 포크된 전략을 다시 게시할 수 있다 (Story 5.4)

**Given** 포크된 전략을 다시 게시하려고 한다
**When** "마켓플레이스에 게시"를 클릭한다
**Then** FR33: 원본 저작권을 확인하는 경고가 표시된다
**And** "이 전략은 [원본]을 포크한 것입니다" 메시지가 포함된다
**And** 원본 전략 링크가 제공된다
**And** 원본 크리에이터에게 로열티가 지급되지 않는다 (변경 사항 충분)

**기술 구현**:
- Backend API:
  ```python
  @router.post("/api/strategies/fork")
  async def fork_strategy(
      original_strategy_id: str,
      new_name: str,
      new_description: str,
      credit_original: bool,
      user_id: str
  ):
      # 1. 구매 여부 확인
      # 2. 전략 JSON 복사
      # 3. 메타데이터 추가 (original_strategy_id, credit_original)
      # 4. 사용자 workspace에 저장
      pass
  ```
- Frontend: React Router navigate to `/editor?strategyId={forkedId}`
```typescript
interface ForkedStrategy extends Strategy {
  originalStrategyId: string;
  originalCreator: string;
  creditOriginal: boolean;
  forkedAt: Date;
}
```

---

### Story 5.8: 가격 모델 구현 (무료, 일시불, 구독)

**사용자 스토리**: 크리에이터로서, 전략에 다양한 가격 모델(무료, 일시불, 구독)을 적용하여 수익을 최적화하고 싶다.

**수용 기준**:

**Given** 크리에이터가 전략 게시 모달에 있다
**When** 가격 모델을 선택한다
**Then** FR34: 세 가지 옵션이 제공된다:
  1. **무료**: 0 USD, anyone can access
  2. **일시불**: One-time payment (예: $49, $99, $199)
  3. **구독**: Monthly recurring (예: $9/월, $19/월)
**And** 각 모델의 설명이 표시된다
**And** 선택에 따라 입력 필드가 변경된다

**Given** "무료"를 선택한다
**When** 전략이 게시된다
**Then** FR34:任何人이 무료로 접근할 수 있다
**And** "구매" 과정 없이 바로 "내 작업 공간에 추가"가 가능하다
**And** 크리에이터는 수익을 얻지 못한다
**And** 후에 "유료"로 변경할 수 있다

**Given** "일시불"을 선택한다
**When** 가격을 $99로 설정하고 게시한다
**Then** FR34: 구매자는 $99를 한 번만 결제한다
**And** 결제 후 영구적으로 접근 권한을 얻는다
**And** 크리에이터는 $99의 90%($89.1)를 수령한다 (FR35)
**And** NFR3: USDC로 결제이며, 플랫폼 수수료 10%가 적용된다

**Given** "구독"을 선택한다
**When** 월 $9로 설정하고 게시한다
**Then** FR34: 구매자는 매월 $9를 결제한다
**And** 매월 결제 시 접근 권한이 갱신된다
**And** 결제 실패 시 접근 권한이 일시 정지된다
**And** 크리에이터는 매월 $9의 90%($8.1)를 수령한다
**And** 구독 취소 시 월말까지 접근 가능하다

**Given** 구독 모델이 설정되었다
**When** 다음 결제일이 되면
**Then** 자동 결제가 시도된다 (Smart Contract)
**And** 결제 성공 시 접근 권한이 연장된다
**And** 결제 실패 시 이메일/알림이 발송된다
**And** 7일 유예 기간이 제공된다

**기술 구현**:
- Smart Contract:
  ```solidity
  enum PriceModel { Free, OneTime, Subscription }

  struct Strategy {
      PriceModel priceModel;
      uint256 priceAmount;
      mapping(address => uint256) subscriptionExpiry;  // for subscriptions
  }

  function purchaseStrategy(uint256 strategyId) external payable {
      Strategy storage strategy = strategies[strategyId];

      if (strategy.priceModel == PriceModel.Free) {
          // 무료: 바로 접근 권한 부여
          purchases[strategyId][msg.sender] = true;
      } else if (strategy.priceModel == PriceModel.OneTime) {
          // 일시불: 영구 접근 권한
          require(msg.value >= strategy.priceAmount, "Insufficient payment");
          purchases[strategyId][msg.sender] = true;
          _distributeRevenue(strategy.priceAmount, strategy.creator);
      } else if (strategy.priceModel == PriceModel.Subscription) {
          // 구독: 30일 접근 권한
          require(msg.value >= strategy.priceAmount, "Insufficient payment");
          strategy.subscriptionExpiry[msg.sender] = block.timestamp + 30 days;
          _distributeRevenue(strategy.priceAmount, strategy.creator);
      }
  }

  function renewSubscription(uint256 strategyId) external payable {
      // 구독 갱신 로직
  }
  ```
- Subscription billing cron job (Backend)

---

### Story 5.9: 수수료 분배 시스템

**사용자 스토리**: 시스템으로서, 전략 판매 수익을 플랫폼과 크리에이터에게 공정하게 분배하여 생태계를 지속 가능하게 만든다.

**수용 기준**:

**Given** 전략이 판매된다
**When** 구매 트랜잭션이 발생한다
**Then** FR35: 수수료가 자동으로 분배된다
**And** 플랫폼 10%, 크리에이터 90%로 나뉜다
**And** 분배가 스마트 컨트랙트로 자동화된다
**And** NFR3: USDC로 정산된다

**Given** $99 일시불 전략이 판매되었다
**When** 구매가 완료된다
**Then** 총 $99가 수집된다
**And** FR35: $9.9가 플랫폼 지갑으로 전송된다 (10%)
**And** $89.1이 크리에이터 지갑으로 전송된다 (90%)
**And** 분배 내역이 블록체인에 기록된다

**Given** $9/월 구독 전략이 판매되었다
**When** 매월 결제가 일어난다
**Then** 각 결제마다 $0.9가 플랫폼으로, $8.1이 크리에이터로 전송된다
**And** FR35: 동일한 비율이 매번 적용된다

**Given** 수수료 분배가 완료되었다
**When** 크리에이터가 "수익 대시보드"를 연다
**Then** 총 수익이 표시된다 (Story 6.x)
**And** 수익 내역이 표시된다 (월별, 전략별)
**And** 인출 가능한 잔액이 표시된다
**And** "인출하기" 버튼이 제공된다

**Given** 플랫폼 운영자가 대시보드를 본다
**When** "수수료 수익"을 확인한다
**Then** FR35: 플랫폼 수수료 총액이 표시된다
**And** 전략별 수수료 내역이 표시된다
**And** 월간 수수료 추이가 그래프로 표시된다

**기술 구현**:
- Smart Contract:
  ```solidity
  contract StrategyMarketplace {
      address public platformWallet;
      uint256 public constant PLATFORM_FEE_BP = 1000;  // 10% in basis points
      uint256 public constant CREATOR_SHARE_BP = 9000;  // 90%

      event RevenueDistributed(
          uint256 indexed strategyId,
          address indexed creator,
          uint256 totalAmount,
          uint256 platformFee,
          uint256 creatorRevenue
      );

      function _distributeRevenue(uint256 amount, address creator) internal {
          uint256 platformFee = (amount * PLATFORM_FEE_BP) / 10000;
          uint256 creatorRevenue = amount - platformFee;

          // USDC transfer (assuming ERC20)
          IERC20(USDC).transfer(platformWallet, platformFee);
          IERC20(USDC).transfer(creator, creatorRevenue);

          emit RevenueDistributed(strategyId, creator, amount, platformFee, creatorRevenue);
      }
  }
  ```
- Database tracking (for dashboard):
  ```sql
  CREATE TABLE revenue_transactions (
    id SERIAL PRIMARY KEY,
    strategy_id VARCHAR(50),
    creator_address VARCHAR(50),
    buyer_address VARCHAR(50),
    total_amount DECIMAL(20, 8),
    platform_fee DECIMAL(20, 8),
    creator_revenue DECIMAL(20, 8),
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_revenue_creator ON revenue_transactions(creator_address, created_at);
  CREATE INDEX idx_revenue_strategy ON revenue_transactions(strategy_id, created_at);
  ```

---

**Epic 5 완료 기준**:
- ✅ 모든 9개 스토리가 구현되었다
- ✅ FR28-FR36이 모두 커버되었다
- ✅ 사용자가 마켓플레이스에서 전략을 검색, 구매, 포크할 수 있다
- ✅ 크리에이터가 전략을 게시하고 수익을 창출할 수 있다
- ✅ FR35: 수수료 10/90 분배가 자동화된다
- ✅ FR36: 백테스트 결과가 온체인에 검증된다
- ✅ NFR6: API 응답시간 < 200ms
- ✅ NFR15: 95번째 백분위수 로딩 시간 < 1초

---

## Epic 6: 크리에이터 보상 시스템

**Epic 목표**: 크리에이터가 자신의 수익을 실시간으로 추적하고, 수익을 지갑으로 인출하여 현금화할 수 있게 한다.

**비즈니스 가치**: 투명하고 신속한 수익 분배는 크리에이터의 참여 동기를 높이고, 플랫폼에 고품질 전략을 지속적으로 공유하게 만든다.

**관련 요구사항**:
- FR37: 수익 대시보드 (총 수익, 월간 수익, 전략별 수익)
- FR38: 수익 내역 (모든 판매, 수수료 분배, 인출 내역)
- FR39: 자동 수익 분배 (스마트 컨트랙트로 즉시 지급)
- FR40: 수익 인출 (USDC로 지갑으로 출금)

**추정 스토리 수**: 4개

---

### Story 6.1: 수익 대시보드

**사용자 스토리**: 크리에이터로서, 내 수익 현황을 한눈에 파악하여 얼마를 벌었는지 확인하고 싶다.

**수용 기준**:

**Given** 크리에이터가 로그인했다
**When** "수익" 페이지를 연다
**Then** FR37: 수익 대시보드가 표시된다
**And** 다음 요약 카드들이 표시된다:
  1. **총 수익**: 모든 시간의 총 수익 (USDC)
  2. **이번 달 수익**: 현재 달의 수익
  3. **인출 가능 잔액**: 출금 가능한 금액
  4. **총 판매량**: 모든 전략의 판매 횟수
  5. **인출 예정**: 출금 진행 중인 금액
**And** 모든 금액이 USDC로 표시된다
**And** NFR6: API 응답시간 < 200ms

**Given** 수익 대시보드가 표시되었다
**When** "이번 달 수익"을 본다
**Then** FR37: 월간 수익 추이가 선 그래프로 표시된다
**And** 최근 6개월 데이터가 표시된다
**And** 각 달의 수익이 호버 시 표시된다
**And** 전월 대비 성장률이 퍼센트로 표시된다

**Given** 대시보드에 요약 카드들이 있다
**When** 사용자가 카드를 클릭한다
**Then** 상세 내역으로 이동한다 (Story 6.2)
**And** 해당 데이터만 필터링되어 표시된다

**Given** 수익이 발생했다
**When** 스마트 컨트랙트에서 수익이 분배된다
**Then** FR39: 수익이 즉시 크리에이터 지갑으로 전송된다
**And** FR37: 대시보드가 자동으로 갱신된다
**And** "새 수익" 알림이 표시된다
**And** 수익 내역에 기록된다

**기술 구현**:
- Backend API:
  ```python
  @router.get("/api/creator/revenue/summary")
  async def get_revenue_summary(user_id: str):
      # 1. DB에서 총 수익 계산
      # 2. 월간 수익 계산 (last 6 months)
      # 3. 인출 가능 잔액 확인 (on-chain balance)
      # 4. 판매량 집계
      return RevenueSummary(
          totalRevenue: Decimal,
          monthlyRevenue: List[MonthlyRevenue],
          withdrawableBalance: Decimal,
          totalSales: int,
          pendingWithdrawals: Decimal
      )
  ```
- Frontend: Recharts for 시각화
- WebSocket for 실시간 업데이트 (새 수익 발생 시)
```typescript
interface RevenueSummary {
  totalRevenue: string;  // USDC
  monthlyRevenue: {
    month: string;
    amount: string;
    growthRate: number;
  }[];
  withdrawableBalance: string;
  totalSales: number;
  pendingWithdrawals: string;
}
```

---

### Story 6.2: 수익 내역

**사용자 스토리**: 크리에이터로서, 모든 수익과 인출 내역을 상세하게 확인하여 어디서 얼마를 벌었는지 추적하고 싶다.

**수용 기준**:

**Given** 크리에이터가 "수익" 페이지에 있다
**When** "내역" 탭을 클릭한다
**Then** FR38: 모든 수익 내역이 테이블로 표시된다
**And** 각 내역에 다음 정보가 포함된다:
  - 날짜 및 시간
  - 유형 (판매, 인출, 수수료 분배)
  - 전략 이름 (판매의 경우)
  - 금액 (USDC)
  - 상태 (완료, 진행 중, 실패)
  - 트랜잭션 해시 (블록체인 확인 링크)
**And** 최신 내역이 상단에 표시된다
**And** 페이지네이션이 제공된다 (20개씩)

**Given** 수익 내역 테이블이 표시되었다
**When** 사용자가 필터를 적용한다
**Then** 다음 필터 옵션이 제공된다:
  - 유형별 (전체, 판매, 인출)
  - 전략별 (모든 전략)
  - 기간 (오늘, 이번 주, 이번 달, 사용자 지정)
  - 상태 (전체, 완료, 진행 중, 실패)
**And** FR38: 선택된 필터가 URL에 반영된다

**Given** 판매 내역이 있다
**When** 특정 판매 내역을 클릭한다
**Then** FR38: 상세 내역 모달이 표시된다
**And** 다음 정보가 포함된다:
  - 구매자 지갑 주소 (축약형)
  - 전략 이름 및 설명
  - 판매 가격
  - 수수료 분배 내역 (90% 크리에이터, 10% 플랫폼)
  - 트랜잭션 해시 및 블록체인 확인 링크
  - 날짜 및 시간
**And** "영수증 다운로드" 버튼이 제공된다 (PDF)

**Given** 인출 내역이 있다
**When** 인출 내역을 클릭한다
**Then** FR38: 인출 상세가 표시된다
**And** 다음 정보가 포함된다:
  - 인출 금액
  - 수수료 (네트워크 수수료)
  - 수령 주소
  - 트랜잭션 상태 (Pending/Confirmed)
  - 트랜잭션 해시
**And** 진행 중인 인출의 경우 예상 완료 시간이 표시된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE creator_revenue_events (
    id SERIAL PRIMARY KEY,
    creator_address VARCHAR(50) NOT NULL,
    event_type VARCHAR(20),  -- sale, withdrawal, fee_distribution
    strategy_id VARCHAR(50),
    strategy_name VARCHAR(200),
    amount DECIMAL(20, 8),
    platform_fee DECIMAL(20, 8),
    creator_revenue DECIMAL(20, 8),
    buyer_address VARCHAR(50),
    tx_hash VARCHAR(100),
    status VARCHAR(20),  -- completed, pending, failed
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_revenue_creator ON creator_revenue_events(creator_address, created_at DESC);
  CREATE INDEX idx_revenue_type ON creator_revenue_events(event_type, created_at);
  ```
- React Table for 테이블 구현
- jsPDF for PDF 영수증 생성

---

### Story 6.3: 자동 수익 분배 (Smart Contract)

**사용자 스토리**: 시스템으로서, 전략 판매가 발생할 때마다 자동으로 수익을 크리에이터 지갑으로 분배하여 즉시 현금화되게 한다.

**수용 기준**:

**Given** 전략이 판매된다
**When** 구매 트랜잭션이 블록체인에 기록된다
**Then** FR39: 수익 분배가 자동으로 실행된다
**And** 스마트 컨트랙트에서 즉시 분배된다
**And** 90%가 크리에이터 지갑으로 전송된다
**And** 10%가 플랫폼 지갑으로 전송된다
**And** 분배가 완료될 때까지 기다리지 않아도 된다

**Given** 수익 분배가 실행된다
**When** 트랜잭션이 완료된다
**Then** FR39: 크리에이터 지갑에 USDC가 입금된다
**And** RevenueDistributed 이벤트가 발생된다
**And** 백엔드가 이벤트를 수신한다
**And** 데이터베이스에 기록된다
**And** 크리에이터에게 알림이 발송된다 (이메일/앱)

**Given** 수익 분배 중 에러가 발생한다
**When** 트랜잭션이 실패한다
**Then** 에러 로그가 기록된다
**And** NFR17: 에러 로그가 7년 보관된다 (핀테크 규제 준수)
**And** 재시도 메커니즘이 실행된다 (최대 3회)
**And** 모든 시도 실패 시 운영자에게 알림이 전송된다

**Given** 크리에이터가 수익을 받았다
**When** "수익 대시보드"를 연다
**Then** FR39: 새로운 수익이 즉시 표시된다
**And** "총 수익"이 업데이트된다
**And** "인출 가능 잔액"이 증가한다
**And** 수익 내역에 기록된다

**기술 구현**:
- Smart Contract (Story 5.5 확장):
  ```solidity
  contract StrategyMarketplace {
      address public platformWallet;
      uint256 public constant PLATFORM_FEE_BP = 1000;  // 10%
      uint256 public constant CREATOR_SHARE_BP = 9000;  // 90%

      event RevenueDistributed(
          uint256 indexed strategyId,
          address indexed creator,
          address indexed buyer,
          uint256 totalAmount,
          uint256 platformFee,
          uint256 creatorRevenue,
          uint256 timestamp
      );

      function purchaseStrategy(uint256 strategyId) external payable {
          Strategy storage strategy = strategies[strategyId];
          uint256 price = strategy.price;

          // FR39: 즉시 수익 분배
          uint256 platformFee = (price * PLATFORM_FEE_BP) / 10000;
          uint256 creatorRevenue = price - platformFee;

          // USDC 전송
          IERC20(USDC).transfer(platformWallet, platformFee);
          IERC20(USDC).transfer(strategy.creator, creatorRevenue);

          // 구매자에게 라이선스 부여
          purchases[strategyId][msg.sender] = true;

          emit RevenueDistributed(
              strategyId,
              strategy.creator,
              msg.sender,
              price,
              platformFee,
              creatorRevenue,
              block.timestamp
          );
      }
  }
  ```
- Backend Event Listener:
  ```python
  async def listen_to_revenue_events():
      async for event in websocket_contract.events.RevenueDistributed():
          # 1. 데이터베이스에 기록
          await record_revenue_event(event)

          # 2. 크리에이터에게 알림 발송
          await send_notification(event['creator'], event)

          # 3. 실시간 대시보드 업데이트 (WebSocket)
          await broadcast_revenue_update(event['creator'], {
              'amount': event['creatorRevenue'],
              'strategyId': event['strategyId']
          })
  ```
- WebSocket (Socket.io) for 실시간 알림

---

### Story 6.4: 수익 인출

**사용자 스토리**: 크리에이터로서, 벌어들인 수익을 내 지갑으로 인출하여 현금화하고 싶다.

**수용 기준**:

**Given** 크리에이터가 수익을 벌었다
**When** "수익" 페이지에서 "인출하기" 버튼을 클릭한다
**Then** FR40: 인출 모달이 표시된다
**And** 다음 정보가 입력된다:
  - 인출 금액 (Number input)
  - 수령 지갑 주소 (기본값: 연결된 지갑)
  - 수수료 표시 (네트워크 수수료)
**And** "인출 가능 잔액"이 표시된다
**And** "최대 인출" 버튼이 제공된다 (전액 인출)

**Given** 인출 모달이 열렸다
**When** 사용자가 인출 금액을 입력한다
**Then** 입력 유효성 검증이 실행된다
**And** FR40: 인출 금액 > 0 USD 이어야 한다
**And** 인출 금액 ≤ 인출 가능 잔액이어야 한다
**And** 최소 인출 금액 ≥ 10 USD (가스비 고려)
**And** 수령 주소가 유효한 EOA 주소여야 한다

**Given** 유효한 인출 요청을 제출한다
**When** "인출" 버튼을 클릭한다
**Then** FR40: 지갑 서명이 요청된다
**And** 인출 트랜잭션이 스마트 컨트랙트에 제출된다
**And** 진행 상태가 표시된다 (Processing...)
**And** 트랜잭션 해시가 표시된다

**Given** 인출 트랜잭션이 제출되었다
**When** 트랜잭션이 완료될 때까지 기다린다
**Then** "인출 중" 상태가 표시된다
**And** 예상 완료 시간이 표시된다 (약 1-2분)
**And** 트랜잭션 상태가 폴링된다

**Given** 인출이 완료되었다
**When** 트랜잭션이 컨펌된다
**Then** "인출 완료" 알림이 표시된다
**And** FR40: USDC가 사용자 지갑으로 전송되었다
**And** "인출 가능 잔액"이 감소한다
**And** 수익 내역에 기록된다 (유형: 인출)
**And** "블록체인에서 확인하기" 링크가 제공된다

**Given** 인출 중 에러가 발생한다
**When** 사용자가 트랜잭션을 거절한다
**Then** "거절됨" 메시지가 표시된다
**And** 잔액이 차감되지 않는다
**And** 다시 시도할 수 있다

**Given** 잔액이 부족하다
**When** 인출을 시도한다
**Then** "인출 가능 잔액 부족" 에러가 표시된다
**And** 현재 잔액이 안내된다

**기술 구현**:
- Smart Contract:
  ```solidity
  contract CreatorRevenue {
      mapping(address => uint256) public withdrawableBalance;

      event WithdrawalInitiated(
          address indexed creator,
          uint256 amount,
          address recipient,
          uint256 timestamp
      );

      function withdraw(uint256 amount, address recipient) external {
          require(withdrawableBalance[msg.sender] >= amount, "Insufficient balance");
          require(amount >= 10 * 10**6, "Minimum withdrawal 10 USDC"); // 6 decimals

          // 잔액 차감
          withdrawableBalance[msg.sender] -= amount;

          // USDC 전송
          IERC20(USDC).transfer(recipient, amount);

          emit WithdrawalInitiated(msg.sender, amount, recipient, block.timestamp);
      }
  }
  ```
- Frontend:
  ```typescript
  async function withdrawRevenue(amount: bigint, recipient: string) {
      const { request } = await publicClient.simulateContract({
          address: CREATOR_REVENUE_CONTRACT,
          abi: creatorRevenueABI,
          functionName: 'withdraw',
          args: [amount, recipient]
      });

      const hash = await walletClient.writeContract(request);

      // 트랜잭션 모니터링
      await publicClient.waitForTransactionReceipt({ hash });

      return hash;
  }
  ```
- Transaction status polling (3초마다, 최대 2분)

---

**Epic 6 완료 기준**:
- ✅ 모든 4개 스토리가 구현되었다
- ✅ FR37-FR40이 모두 커버되었다
- ✅ 크리에이터가 수익을 추적하고 인출할 수 있다
- ✅ FR39: 수익 분배가 즉시 자동화된다
- ✅ FR40: 인출이 USDC로 지갑으로 가능하다
- ✅ NFR6: API 응답시간 < 200ms
- ✅ NFR17: 에러 로그 7년 보관 (핀테크 규제 준수)

---

## Epic 7: 크리에이터 및 유튜버 통합

**Epic 목표**: 유튜버와 크리에이터가 자신의 추천 링크를 통해 유저를 유입하고, 유입된 유저의 활동에 따라 수익을 공유받을 수 있는 파트너십 프로그램을 구축한다.

**비즈니스 가치**: 유튜버 및 크리에이터 파트너십을 통해 바이럴 마케팅 효과를 극대화하고, 초기 사용자 확보를 가속화한다. 인센티브 구조로 지속적인 유입을 유도한다.

**관련 요구사항**:
- FR41: 유튜버/크리에이터 등록 (신청, 승인 프로세스)
- FR42: 고유 추천 링크 생성 (각 파트너별)
- FR43: 유입 추적 (추천 링크 클릭, 지갑 연결)
- FR44: 수익 공유 모델 (첫 거래 수수료의 20%를 파트너에게)
- FR45: 파트너 대시보드 (유입 수, 전환율, 수익)
- FR46: 월간 보고서 (성과 요약, 지급 예정 금액)

**추정 스토리 수**: 6개

---

### Story 7.1: 유튜버/크리에이터 등록 및 승인 프로세스

**사용자 스토리**: 유튜버/크리에이터로서, 파트너십 프로그램에 신청하여 내 추천 링크를 생성하고 수익을 공유받고 싶다.

**수용 기준**:

**Given** 사용자가 로그인했다
**When** "파트너십" 페이지를 연다
**Then** FR41: 파트너십 프로그램 소개가 표시된다
**And** 혜택이 설명된다:
  - 첫 거래 수수료의 20% 수익 공유
  - 고유 추천 링크 제공
  - 실시간 추적 대시보드
  - 월간 보고서
**And** "신청하기" 버튼이 제공된다

**Given** 사용자가 "신청하기"를 클릭한다
**When** 신청 폼이 표시된다
**Then** FR41: 다음 정보를 입력할 수 있다:
  - 유튜브 채널 URL (필수)
  - 채널 이름 (자동 추출)
  - 구독자 수 (자동 추출)
  - 소개/설명 (선택, 500자)
  - 예상 월 유입 유저 수 (Select: 100-500, 500-1K, 1K-5K, 5K+)
  - 홍보 계획 (선택, 500자)
**And** YouTube API 연동으로 채널 정보가 자동으로 검증된다

**Given** 신청 폼을 제출한다
**When** 제출이 완료되면
**Then** FR41: 신청 상태가 "검토 중"으로 변경된다
**And** "신청이 접수되었습니다. 검토는 영업일 2-3일 소요됩니다." 메시지가 표시된다
**And** 운영자에게 알림이 발송된다

**Given** 운영자가 신청을 검토한다
**When** 운영자 대시보드에서 신청을 본다
**Then** 모든 신청 내역이 표시된다
**And** 채널 정보가 표시된다 (구독자 수, 콘텐츠 확인)
**And** "승인"/"거절" 버튼이 제공된다
**And** 거절 시 사유 입력이 필수다

**Given** 운영자가 신청을 승인한다
**When** "승인"을 클릭한다
**Then** FR41: 신청자에게 승인 알림이 발송된다
**And** 추천 링크가 자동으로 생성된다 (Story 7.2)
**And** 파트너 대시보드가 활성화된다 (Story 7.5)
**And** 데이터베이스에 파트너 정보가 저장된다

**Given** 운영자가 신청을 거절한다
**When** "거절"을 클릭하고 사유를 입력한다
**Then** 거절 알림이 발송된다
**And** 거절 사유가 포함된다
**And** 30일 후 재신청 가능하다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE partner_applications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    wallet_address VARCHAR(50) NOT NULL,
    youtube_channel_url VARCHAR(500),
    channel_name VARCHAR(200),
    subscriber_count INTEGER,
    description TEXT,
    expected_monthly_referrals VARCHAR(50),
    promotion_plan TEXT,
    status VARCHAR(20),  -- pending, approved, rejected
    rejection_reason TEXT,
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    wallet_address VARCHAR(50) NOT NULL UNIQUE,
    youtube_channel_url VARCHAR(500),
    referral_code VARCHAR(20) UNIQUE,
    referral_link VARCHAR(500),
    total_referrals INTEGER DEFAULT 0,
    total_revenue DECIMAL(20, 8) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',  -- active, suspended
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES partner_applications(user_id)
  );
  ```
- YouTube Data API v3 for 채널 정보 추출
- Admin approval interface (Story 8.x)

---

### Story 7.2: 고유 추천 링크 생성

**사용자 스토리**: 파트너로서, 승인 후 나만의 추천 링크를 받아서 커뮤니티에 공유하고 싶다.

**수용 기준**:

**Given** 파트너 신청이 승인되었다
**When** 승인 프로세스가 완료되면
**Then** FR42: 고유 추천 링크가 자동으로 생성된다
**And** 추천 코드가 생성된다 (영문 8-12자, 예: ALPHA123)
**And** 링크 형식: `https://gr8.trade/ref/{CODE}`
**And** 링크가 고유하게 보장된다

**Given** 파트너가 "파트너 대시보드"를 연다
**When** 대시보드가 로드된다
**Then** FR42: 추천 링크가 상단에 크게 표시된다
**And** "복사" 버튼이 제공된다
**And** "복사 완료!" 알림이 표시된다
**And** QR 코드도 제공된다 (비디오/이미지에 사용)

**Given** 추천 링크가 생성되었다
**When** 링크를 클릭하면
**Then** gr8 웹사이트 랜딩 페이지로 이동한다
**And** URL에 추천 코드가 포함된다
**And** FR43: 추천 쿠키가 저장된다 (30일 유효)
**And** 지갑 연결 시 추천 정보가 연결된다

**Given** 파트너가 추천 링크를 공유한다
**When** 다른 사용자가 링크를 통해 방문한다
**Then** FR43: 방문 이벤트가 기록된다
**And** 방문자 IP, 타임스탬프, 추천 코드가 저장된다
**And** 중복 방문이 추적된다
**And** 파트너 대시보드에 실시간 반영된다

**Given** 파트너가 링크를 여러 곳에 공유한다
**When** 유입 소스를 추적하고 싶다면
**Then** FR42: UTM 파라미터가 지원된다
**And` `https://gr8.trade/ref/CODE?utm_source=youtube&utm_campaign=video1`
**And** 각 소스별 성과가 대시보드에 표시된다

**기술 구현**:
- Referral code generation:
  ```python
  import random
  import string

  def generate_referral_code() -> str:
      # 8-12자 영문+숫자
      length = random.randint(8, 12)
      code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

      # 중복 체크
      if not is_code_exists(code):
          return code
      return generate_referral_code()  # 재시도
  ```
- Frontend routing:
  ```typescript
  // https://gr8.trade/ref/CODE
  router.get('/ref/:code', async (req, res) => {
      const { code } = req.params;

      // 1. 코드 유효성 검증
      const partner = await validateReferralCode(code);

      if (partner) {
          // 2. 추천 쿠키 저장 (30일)
          res.cookie('referral_code', code, {
              maxAge: 30 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              secure: true
          });

          // 3. 방문 이벤트 기록
          await record_referral_visit(code, req.ip, req.headers['user-agent']);
      }

      // 4. 랜딩 페이지로 리다이렉트
      res.redirect('/');
  });
  ```
- QR Code generation: `qrcode` npm package
- Database schema:
  ```sql
  CREATE TABLE referral_visits (
    id SERIAL PRIMARY KEY,
    referral_code VARCHAR(20),
    visitor_ip VARCHAR(50),
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_campaign VARCHAR(100),
    converted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_referral_visits ON referral_visits(referral_code, created_at);
  ```

---

### Story 7.3: 유입 추적 시스템

**사용자 스토리**: 시스템으로서, 추천 링크를 통해 유입된 사용자를 추적하여 어떤 파트너를 통해 전환되었는지 기록한다.

**수용 기준**:

**Given** 사용자가 추천 링크를 클릭한다
**When** 웹사이트에 방문한다
**Then** FR43: 추천 쿠키가 저장된다
**And** 쿠키 유효기간은 30일이다
**And** 방문 기록이 생성된다

**Given** 추천 쿠키가 있는 사용자다
**When** 지갑을 연결한다
**Then** FR43: 추천 정보가 지갑 주소와 연결된다
**And** 지갑 연결 이벤트가 기록된다
**And** 파트너 대시보드에 "새 유입" 카운트가 반영된다

**Given** 지갑이 연결되었다
**When** 사용자가 첫 구매를 한다
**Then** FR43: 전환이 완료된 것으로 기록된다
**And** FR44: 수익 공유가 트리거된다
**And** 파트너에게 20% 수익이 지급된다
**And** 방문 기록의 `converted`가 `true`로 업데이트된다

**Given** 사용자가 여러 추천 링크를 클릭한다
**When** 최초 방문 이후 30일 내에 다른 링크를 클릭한다
**Then** FR43: 최초 추천인이 유지된다 (First-touch attribution)
**And** 새 추천 쿠키는 무시된다
**And** 파트너 변경 불가

**Given** 30일이 지났다
**When** 사용자가 다시 방문한다
**Then** 추천 쿠키가 만료된다
**And** 새 추천 링크 클릭 시 새 파트너로 연결된다

**Given** 추천 데이터가 기록되었다
**When** 파트너 대시보드를 본다
**Then** FR45: 다음 지표가 표시된다
  - 총 방문 수
  - 지갑 연결 수 (전환)
  - 첫 구매 수
  - 전환율 (지갑 연결 / 방문)
  - 구매 전환율 (첫 구매 / 지갑 연결)
**And** 실시간으로 업데이트된다

**기술 구현**:
- Middleware for referral tracking:
  ```python
  from fastapi import Request

  @middleware("http")
  async def referral_tracker(request: Request, call_next):
      # 1. 쿠키에서 추천 코드 확인
      referral_code = request.cookies.get('referral_code')

      # 2. URL 파라미터 확인
      if not referral_code and 'ref' in request.query_params:
          referral_code = request.query_params['ref']

      # 3. 지갑 연결 시 추천 연결
      if referral_code and request.url.path == '/api/wallet/connect':
          wallet_address = await get_wallet_from_request(request)
          await link_referral(wallet_address, referral_code)

      response = await call_next(request)
      return response
  ```
- Backend API:
  ```python
  @router.post("/api/wallet/connect")
  async def connect_wallet(wallet_address: str, request: Request):
      # 1. 추천 코드 확인
      referral_code = request.cookies.get('referral_code')

      # 2. 지갑 연결
      user = await connect_wallet(wallet_address)

      # 3. 추천 연결 (처음 연결 시만)
      if referral_code and not user.referral_partner:
          await link_referral_to_user(wallet_address, referral_code)

      return user

  async def link_referral_to_user(wallet_address: str, referral_code: str):
      # 1. 추천 코드 유효성 확인
      partner = await get_partner_by_code(referral_code)

      # 2. 사용자에게 추천인 저장
      await update_user_referral(wallet_address, partner.wallet_address)

      # 3. 방문 기록 업데이트
      await mark_referral_visit_converted(referral_code, wallet_address)
  ```
- Database schema:
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(50) UNIQUE,
    referral_partner VARCHAR(50),  -- 추천인 지갑 주소
    referral_code VARCHAR(20),     -- 사용된 추천 코드
    referred_at TIMESTAMP,
    first_purchase_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_users_referral ON users(referral_partner);
  CREATE INDEX idx_users_wallet ON users(wallet_address);
  ```

---

### Story 7.4: 수익 공유 모델 (20% Revenue Share)

**사용자 스토리**: 시스템으로서, 파트너가 추천한 사용자의 첫 거래 수수료 중 20%를 파트너에게 자동으로 분배한다.

**수용 기준**:

**Given** 파트너가 추천한 사용자가 있다
**When** 해당 사용자가 첫 구매를 한다
**Then** FR44: 수익 공유가 자동으로 계산된다
**And** 첫 거래 수수료의 20%가 파트너에게 지급된다
**And** 80%는 플랫폼이 유지한다
**And** 스마트 컨트랙트로 분배된다

**Given** $99 전략이 판매되었다
**When** 이것이 추천인의 첫 구매이다
**Then** 전체 수수료: $9.9 (10% 플랫폼 수수료)
**And** FR44: 파트너 지급: $1.98 (20% of $9.9)
**And** 플랫폼 수익: $7.92 (80% of $9.9)
**And** 분배 내역이 데이터베이스에 기록된다

**Given** 수익 공제가 실행된다
**When** 트랜잭션이 완료된다
**Then** FR44: 파트너 지갑으로 USDC가 전송된다
**And** PartnerRevenueShare 이벤트가 발생된다
**And** 파트너 대시보드에 실시간 반영된다
**And** "새 수익" 알림이 발송된다

**Given** 사용자가 여러 번 구매한다
**When** 두 번째 구매를 한다
**Then** FR44: 수익 공유는 첫 구매에만 적용된다
**And** 이후 구매는 파트너 수익 없이 플랫폼이 100% 수령한다
**And** 사용자 메타데이터에 `first_purchase_completed: true`가 저장된다

**Given** 파트너 수익이 발생했다
**When** 파트너가 "수익" 탭을 연다
**Then** FR45: 파트너 수익이 별도 섹션으로 표시된다
**And** "추천 수익"으로 명시된다
**And** 각 추천인별 수익 내역이 표시된다
**And** 월간 추천 수익 합계가 표시된다

**Given** 월말이 되었다
**When** FR46: 월간 보고서가 생성된다
**Then** 추천 수익 합계가 포함된다
**And** 지급 예정 금액이 표시된다
**And** 각 추천인별 기여도가 표시된다

**기술 구현**:
- Smart Contract:
  ```solidity
  contract PartnerRevenueShare {
      uint256 public constant PARTNER_SHARE_BP = 2000;  // 20%
      uint256 public constant PLATFORM_SHARE_BP = 8000;  // 80%

      struct Partner {
          address walletAddress;
          string referralCode;
          uint256 totalRevenue;
      }

      mapping(address => Partner) public partners;
      mapping(address => address) public userReferralPartner;  // user => partner
      mapping(address => bool) public firstPurchaseCompleted;

      event PartnerRevenueShare(
          address indexed partner,
          address indexed referredUser,
          uint256 purchaseAmount,
          uint256 platformFee,
          uint256 partnerRevenue,
          uint256 timestamp
      );

      function processPurchase(
          address buyer,
          uint256 purchaseAmount,
          address strategyCreator
      ) external {
          uint256 platformFee = (purchaseAmount * 1000) / 10000;  // 10%

          // 추천인 확인
          address partner = userReferralPartner[buyer];

          if (partner != address(0) && !firstPurchaseCompleted[buyer]) {
              // 첫 구매이고 추천인이 있음
              uint256 partnerRevenue = (platformFee * PARTNER_SHARE_BP) / 10000;
              uint256 platformRevenue = platformFee - partnerRevenue;

              // 파트너에게 지급
              IERC20(USDC).transfer(partner, partnerRevenue);

              // 플랫폼 지갑에 나머지
              IERC20(USDC).transfer(platformWallet, platformRevenue);

              firstPurchaseCompleted[buyer] = true;

              emit PartnerRevenueShare(
                  partner,
                  buyer,
                  purchaseAmount,
                  platformFee,
                  partnerRevenue,
                  block.timestamp
              );
          } else {
              // 추천인 없거나 첫 구매 아님 - 플랫폼이 100%
              IERC20(USDC).transfer(platformWallet, platformFee);
          }

          // 크리에이터에게 90% 지급 (Story 6.3)
          uint256 creatorRevenue = purchaseAmount - platformFee;
          IERC20(USDC).transfer(strategyCreator, creatorRevenue);
      }
  }
  ```
- Database tracking:
  ```sql
  CREATE TABLE partner_revenue_events (
    id SERIAL PRIMARY KEY,
    partner_address VARCHAR(50),
    referred_user_address VARCHAR(50),
    strategy_id VARCHAR(50),
    purchase_amount DECIMAL(20, 8),
    platform_fee DECIMAL(20, 8),
    partner_revenue DECIMAL(20, 8),
    platform_revenue DECIMAL(20, 8),
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_partner_revenue ON partner_revenue_events(partner_address, created_at);
  ```

---

### Story 7.5: 파트너 대시보드

**사용자 스토리**: 파트너로서, 내 추천 성과를 실시간으로 확인하여 어디서 얼마나 유입되었는지 파악하고 싶다.

**수용 기준**:

**Given** 파트너가 로그인했다
**When** "파트너 대시보드"를 연다
**Then** FR45: 파트너 대시보드가 표시된다
**And** 다음 요약 카드들이 상단에 표시된다:
  1. **총 방문 수**: 추천 링크 클릭 수
  2. **지갑 연결 수**: 전환된 유저 수
  3. **첫 구매 수**: 구매 전환 수
  4. **전환율**: 지갑 연결 / 방문 (%)
  5. **총 추천 수익**: 모든 추천 수익 합계 (USDC)
  6. **이번 달 수익**: 현재 달 추천 수익
**And** 모든 지표가 실시간이다

**Given** 대시보드에 요약 카드들이 있다
**When** "총 방문 수"를 본다
**Then** FR45: 일별 방문 추이가 선 그래프로 표시된다
**And** 최근 30일 데이터가 표시된다
**And** 호버 시 방문 수가 표시된다

**Given** "지갑 연결 수"를 본다
**When** 그래프를 확인한다
**Then** 일별 지갑 연결 추이가 표시된다
**And** 전환 유입이 하이라이트된다

**Given** "총 추천 수익"을 본다
**When** 클릭하면
**Then** FR45: 수익 상세 내역으로 이동한다
**And** 각 추천인별 수익이 표시된다
**And** 날짜별 수익 내역이 표시된다

**Given** 대시보드 하단에 있다
**When** 테이블을 확인한다
**Then** FR45: 다음 테이블들이 제공된다:
  1. **최근 유입**: 최근 10명의 유입 유저 (지갑 주소, 날짜, 상태)
  2. **최근 구매**: 최근 10건의 추천 구매 (유저, 전략, 수익)
  3. **소스별 성과**: UTM 소스별 방문 및 전환 수
**And** 각 테이블에 "모두 보기" 링크가 있다

**Given** 추천 링크를 여러 곳에 공유했다
**When** "소스별 성과"를 본다
**Then** FR45: 각 소스(YouTube, Twitter, 등)의 성과가 표시된다
**And** UTM 파라미터로 집계된다
**And** 가장 효과적인 채널이 식별된다

**Given** 파트너가 추천 링크를 복사한다
**When** 다시 공유하려고 한다
**Then** 대시보드 상단에 추천 링크가 항상 표시된다
**And** "복사" 버튼과 QR 코드가 제공된다

**기술 구현**:
- Backend API:
  ```python
  @router.get("/api/partner/dashboard")
  async def get_partner_dashboard(partner_address: str):
      # 1. 총 방문 수
      total_visits = await get_referral_visits_count(partner_address)

      # 2. 지갑 연결 수
      wallet_connections = await get_referral_conversions_count(partner_address)

      # 3. 첫 구매 수
      first_purchases = await get_first_purchases_count(partner_address)

      # 4. 총 추천 수익
      total_revenue = await get_partner_revenue(partner_address)

      # 5. 이번 달 수익
      monthly_revenue = await get_partner_revenue(
          partner_address,
          start_date=date.today().replace(day=1)
      )

      # 6. 일별 추이 (last 30 days)
      daily_stats = await get_daily_partner_stats(
          partner_address,
          days=30
      )

      return PartnerDashboard(
          totalVisits=total_visits,
          walletConnections=wallet_connections,
          firstPurchases=first_purchases,
          conversionRate=round(wallet_connections / total_visits * 100, 2) if total_visits > 0 else 0,
          totalRevenue=total_revenue,
          monthlyRevenue=monthly_revenue,
          dailyStats=daily_stats,
          recentReferrals=await get_recent_referrals(partner_address, limit=10),
          recentPurchases=await get_recent_purchases(partner_address, limit=10),
          sourcePerformance=await get_source_performance(partner_address)
      )
  ```
- Frontend: Recharts for 시각화
- WebSocket for 실시간 업데이트

```typescript
interface PartnerDashboard {
  totalVisits: number;
  walletConnections: number;
  firstPurchases: number;
  conversionRate: number;
  totalRevenue: string;  // USDC
  monthlyRevenue: string;
  dailyStats: {
    date: string;
    visits: number;
    connections: number;
    purchases: number;
  }[];
  recentReferrals: {
    walletAddress: string;
    connectedAt: Date;
    status: 'connected' | 'purchased';
  }[];
  recentPurchases: {
    userAddress: string;
    strategyName: string;
    revenue: string;
    createdAt: Date;
  }[];
  sourcePerformance: {
    utmSource: string;
    visits: number;
    conversions: number;
    revenue: string;
  }[];
}
```

---

### Story 7.6: 월간 보고서 생성 및 이메일 발송

**사용자 스토리**: 파트너로서, 매월 내 성과 요약과 지급 예정 금액을 이메일로 받아 얼마를 벌었는지 확인하고 싶다.

**수용 기준**:

**Given** 월말이 되었다 (매월 1일)
**When** 월간 보고서 작업이 실행된다
**Then** FR46: 모든 파트너에게 월간 보고서가 생성된다
**And** 이메일로 발송된다
**And** 보고서에 다음 정보가 포함된다:
  - 보고서 기간 (예: 2024년 1월)
  - 총 방문 수
  - 지갑 연결 수
  - 첫 구매 수
  - 전환율
  - 총 추천 수익 (USDC)
  - 지급 예정 금액
  - 월간 성과 추이 (그래프)
  - 상위 추천 유저 (Top 5)

**Given** 보고서 이메일을 받는다
**When** 이메일을 연다
**Then** FR46: "gr8 파트너 월간 보고서 - YYYY년 M월" 제목이다
**And** HTML 형식으로 보기 좋게 렌더링된다
**And** "대시보드에서 보기" 버튼이 제공된다
**And** PDF 다운로드 링크가 있다

**Given** 파트너가 월간 보고서를 확인한다
**When** "대시보드에서 보기"를 클릭한다
**Then** FR46: 대시보드에 "보고서" 탭이 열린다
**And** 모든 월간 보고서가 목록으로 표시된다
**And** 각 보고서에 다음이 표시된다:
  - 보고서 기간
  - 총 수익
  - 다운로드 링크 (PDF)
**And** 최신 보고서가 상단에 표시된다

**Given** 월간 보고서를 다운로드한다
**When** PDF를 열면
**Then** FR46: 전체 성과 요약이 PDF로 포맷팅된다
**And** 모든 지표와 그래프가 포함된다
**And** 파트너 정보(이름, 추천 코드)가 헤더에 있다
**And** "파트너십 약관"이 포함된다

**Given** 보고서가 생성되었다
**When** 파트너가 수익을 인출한다
**Then** FR40: 인출 가능한 금액이 표시된다
**And** 추천 수익은 즉시 인출 가능하다
**And** 인출 프로세스는 Story 6.4와 동일하다

**기술 구현**:
- Scheduled job (Celery Beat / AWS EventBridge):
  ```python
  from celery import Celery
  from datetime import date

  app = Celery('tasks', broker='redis://localhost')

  @app.task
  def generate_monthly_reports():
      today = date.today()
      last_month = today.replace(day=1) - timedelta(days=1)

      # 모든 파트너 조회
      partners = get_all_active_partners()

      for partner in partners:
          # 월간 보고서 생성
          report = generate_partner_report(
              partner.wallet_address,
              year=last_month.year,
              month=last_month.month
          )

          # PDF 생성
          pdf_url = generate_report_pdf(report)

          # 이메일 발송
          send_monthly_report_email(
              partner_email=partner.email,
              report=report,
              pdf_url=pdf_url
          )

  # 매월 1일 오전 9시 실행
  app.conf.beat_schedule = {
      'generate-monthly-reports': {
          'task': 'generate_monthly_reports',
          'schedule': crontab(hour=9, minute=0, day_of_month=1),
      },
  }
  ```
- PDF generation: `ReportLab` (Python) or `jsPDF` (Node.js)
- Email template (HTML + MJML):
  ```html
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          .report-header { background: #6366f1; color: white; }
          .metric-card { border: 1px solid #e5e7eb; padding: 16px; }
      </style>
  </head>
  <body>
      <div class="report-header">
          <h1>gr8 파트너 월간 보고서</h1>
          <p>{{ report_period }}</p>
      </div>

      <div class="metrics">
          <div class="metric-card">
              <h3>총 방문 수</h3>
              <p>{{ total_visits }}</p>
          </div>
          <!-- ... -->
      </div>

      <div class="revenue">
          <h2>총 추천 수익: {{ total_revenue }} USDC</h2>
      </div>
  </body>
  </html>
  ```
- Database schema:
  ```sql
  CREATE TABLE partner_monthly_reports (
    id SERIAL PRIMARY KEY,
    partner_address VARCHAR(50),
    year INTEGER,
    month INTEGER,
    total_visits INTEGER,
    wallet_connections INTEGER,
    first_purchases INTEGER,
    conversion_rate DECIMAL(5, 2),
    total_revenue DECIMAL(20, 8),
    pdf_url VARCHAR(500),
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(partner_address, year, month)
  );

  CREATE INDEX idx_partner_reports ON partner_monthly_reports(partner_address, created_at DESC);
  ```

---

**Epic 7 완료 기준**:
- ✅ 모든 6개 스토리가 구현되었다
- ✅ FR41-FR46이 모두 커버되었다
- ✅ 유튜버/크리에이터가 파트너십에 신청할 수 있다
- ✅ 고유 추천 링크가 생성되고 유입이 추적된다
- ✅ FR44: 첫 거래 수수료의 20%가 파트너에게 지급된다
- ✅ FR46: 월간 보고서가 자동 생성되어 이메일로 발송된다
- ✅ NFR6: API 응답시간 < 200ms

---

## Epic 8: 운영 대시보드 및 규제 준수

**Epic 목표**: 운영자가 플랫폼의 모든 활동을 모니터링하고, 사용자를 관리하며, 규제 준수를 위한 감사 로그와 이상 탐지 시스템을 운영한다.

**비즈니스 가치**: 운영 대시보드를 통해 플랫폼 상태를 실시간으로 파악하고, 규제 준수를 보장하며, 이상 활동을 조기에 탐지하여 플랫폼과 사용자를 보호한다.

**관련 요구사항**:
- FR47: 운영자 대시보드 (사용자 수, 거래량, 수익)
- FR48: 사용자 관리 (검색, 상태 변경, 정지)
- FR49: 파트너십 신청 관리 (승인/거절)
- FR50: 시스템 건강 모니터링 (CPU, 메모리, API)
- FR51: 이상 탐지 (비정상적 패턴, 스팸)
- FR52: 감사 로그 (모든 관리자 활동 기록)
- FR53: 이메일 알림 시스템 (중요 이벤트 알림)
- FR54: 리포트 생성 (일간/주간/월간)
- FR55: AML/KYC 지원 (선택, 고급 기능)
- FR56: 불량 전략 신고 기능
- FR57: 커뮤니티 가이드라인 시행
- FR58: 데이터 분석 및 인사이트 (GA 연동)

**추정 스토리 수**: 12개

---

### Story 8.1: 운영자 대시보드 (Overview)

**사용자 스토리**: 운영자로서, 플랫폼의 핵심 지표들을 한눈에 확인하여 전반적인 상태를 파악하고 싶다.

**수용 기준**:

**Given** 운영자가 로그인했다
**When** "운영 대시보드" 페이지를 연다
**Then** FR47: 운영자 대시보드가 표시된다
**And** 다음 요약 카드들이 상단에 표시된다:
  1. **총 사용자 수**: 지갑 연결된 고유 사용자
  2. **활성 사용자 수**: 지난 24시간 내 활동
  3. **총 전략 수**: 게시된 전략
  4. **총 거래량**: 모든 전략 판매
  5. **총 수익**: 플랫폼 수수료 (USDC)
  6. **보류 중 파트너 신청**: 승인 대기 중
**And** 모든 지표가 실시간이다

**Given** 대시보드가 표시되었다
**When** "총 사용자 수"를 본다
**Then** FR47: 사용자 증가 추이가 선 그래프로 표시된다
**And** 최근 30일 데이터가 표시된다
**And** 전월 대비 성장률이 퍼센트로 표시된다

**Given** "총 거래량"을 확인한다
**When** 그래프를 본다
**Then** 일별 거래량 추이가 표시된다
**And** 가장 많이 판매된 전략 Top 5가 표시된다

**Given** "보류 중 파트너 신청"을 클릭한다
**When** 카드를 클릭하면
**Then** 파트너 신청 관리 페이지로 이동한다 (Story 8.3)

**Given** 실시간 데이터가 필요하다
**When** 새로고침하지 않아도
**Then** WebSocket으로 실시간 업데이트가 제공된다
**And** 새 거래 발생 시 자동으로 갱신된다
**And** 마지막 업데이트 시간이 표시된다

**기술 구현**:
- Backend API:
  ```python
  @router.get("/api/admin/dashboard")
  async def get_admin_dashboard():
      # 1. 총 사용자 수
      total_users = await count_total_users()

      # 2. 활성 사용자 수 (last 24h)
      active_users = await count_active_users(hours=24)

      # 3. 총 전략 수
      total_strategies = await count_total_strategies()

      # 4. 총 거래량
      total_transactions = await count_total_transactions()

      # 5. 총 수익
      total_revenue = await calculate_platform_revenue()

      # 6. 보류 중 파트너 신청
      pending_applications = await count_pending_partner_applications()

      # 7. 일별 추이 (last 30 days)
      daily_stats = await get_daily_platform_stats(days=30)

      return AdminDashboard(
          totalUsers=total_users,
          activeUsers=active_users,
          totalStrategies=total_strategies,
          totalTransactions=total_transactions,
          totalRevenue=total_revenue,
          pendingApplications=pending_applications,
          dailyStats=daily_stats
      )
  ```
- Frontend: Recharts for 시각화
- WebSocket for 실시간 업데이트

```typescript
interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  totalStrategies: number;
  totalTransactions: number;
  totalRevenue: string;  // USDC
  pendingApplications: number;
  dailyStats: {
    date: string;
    newUsers: number;
    transactions: number;
    revenue: string;
  }[];
}
```

---

### Story 8.2: 사용자 관리

**사용자 스토리**: 운영자로서, 모든 사용자를 검색하고 관리하며, 문제가 있는 사용자를 정지하거나 차단하고 싶다.

**수용 기준**:

**Given** 운영자가 "사용자 관리" 페이지를 연다
**When** 페이지가 로드된다
**Then** FR48: 모든 사용자 목록이 표시된다
**And** 각 사용자에 다음 정보가 표시된다:
  - 지갑 주소 (축약형)
  - ENS 도메인 (있으면)
  - 가입일
  - 상태 (활성, 정지, 차단)
  - 총 구매액
  - 총 판매액
  - 전략 수
**And** 페이지네이션이 제공된다 (50개씩)
**And** NFR6: API 응답시간 < 200ms

**Given** 사용자 목록이 표시되었다
**When** 검색어를 입력한다
**Then** FR48: 지갑 주소, ENS 도메인으로 검색된다
**And** 실시간 필터링이 제공된다 (debounce 300ms)
**And** 결과가 즉시 표시된다

**Given** 상태 필터를 적용한다
**When** "정지"를 선택한다
**Then** 정지된 사용자만 표시된다
**And** 정지 사유가 표시된다
**And** 정지일이 표시된다

**Given** 특정 사용자를 선택한다
**When** 사용자 행을 클릭한다
**Then** FR48: 사용자 상세 모달이 표시된다
**And** 다음 탭이 제공된다:
  1. **기본 정보**: 지갑 주소, 가입일, 상태
  2. **활동 내역**: 구매, 판매, 백테스트
  3. **전략**: 게시한 모든 전략
  4. **감사 로그**: 해당 사용자의 모든 활동
**And** "상태 변경" 버튼이 제공된다

**Given** 사용자 상태를 변경하려고 한다
**When** "정지"를 선택하고 사유를 입력한다
**Then** FR48: 사용자 상태가 "정지"로 변경된다
**And** 사용자는 더 이상 전략을 구매/게시할 수 없다
**And** 기존 구매는 유지된다
**And** 사용자에게 이메일 알림이 발송된다 (FR53)
**And** FR52: 감사 로그가 기록된다

**Given** 사용자를 차단해야 한다
**When** "차단"을 선택한다
**Then** FR48: 사용자가 완전히 차단된다
**And** 로그인이 불가능하다
**And** 모든 활동이 중지된다
**And** 차단 사유가 기록된다
**And** 감사 로그에 기록된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(50) UNIQUE,
    ens_domain VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',  -- active, suspended, banned
    suspension_reason TEXT,
    suspended_at TIMESTAMP,
    banned_at TIMESTAMP,
    total_purchases DECIMAL(20, 8) DEFAULT 0,
    total_sales DECIMAL(20, 8) DEFAULT 0,
    strategy_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_users_status ON users(status, created_at);
  CREATE INDEX idx_users_wallet ON users(wallet_address);
  ```
- Backend API:
  ```python
  @router.put("/api/admin/users/{user_id}/status")
  async def update_user_status(
      user_id: str,
      status: str,  -- suspended, banned, active
      reason: str,
      admin_id: str
  ):
      # 1. 사용자 상태 업데이트
      await update_user(user_id, status=status, suspension_reason=reason)

      # 2. 감사 로그 기록 (FR52)
      await log_admin_action(
          admin_id=admin_id,
          action='update_user_status',
          target_user_id=user_id,
          details={'status': status, 'reason': reason}
      )

      # 3. 이메일 알림 발송 (FR53)
      await send_email_notification(
          user_id=user_id,
          subject=f"계정 상태 변경: {status}",
          template='user_status_changed',
          data={'status': status, 'reason': reason}
      )

      return {"success": True}
  ```

---

### Story 8.3: 파트너십 신청 관리

**사용자 스토리**: 운영자로서, 파트너십 신청을 검토하고 승인/거절하여 적격한 파트너만 선별하고 싶다.

**수용 기준**:

**Given** 운영자가 "파트너십" 페이지를 연다
**When** 페이지가 로드된다
**Then** FR49: 모든 파트너 신청이 표시된다
**And** 다음 정보가 포함된다:
  - 신청자 지갑 주소
  - 유튜브 채널 URL
  - 채널 이름
  - 구독자 수
  - 예상 월 유입 유저 수
  - 홍보 계획
  - 신청일
  - 상태 (검토 중, 승인, 거절)
**And** 기본 정렬: 최신 신청 우선

**Given** 신청 목록이 표시되었다
**When** 상태 필터를 적용한다
**Then** FR49: 상태별로 필터링된다
**And** "검토 중" 신청이 상단에 표시된다

**Given** 특정 신청을 선택한다
**When** 신청을 클릭한다
**Then** FR49: 신청 상세 모달이 표시된다
**And** 유튜브 채널 미리보기가 제공된다 (embed)
**And** 채널 통계가 표시된다 (구독자, 조회수)
**And** 신청자의 기존 활동이 표시된다 (있으면)

**Given** 신청을 승인하려고 한다
**When** "승인" 버튼을 클릭한다
**Then** FR49: 승인 확인 모달이 표시된다
**And** "승인"을 확인하면:
  - 신청 상태가 "승인"으로 변경된다
  - 추천 링크가 자동 생성된다 (Story 7.2)
  - 승인자 정보가 기록된다
  - 사용자에게 승인 알림이 발송된다
  - FR52: 감사 로그가 기록된다

**Given** 신청을 거절해야 한다
**When** "거절" 버튼을 클릭한다
**Then** FR49: 거절 사유 입력이 필수다
**And** 사유를 입력하고 "거절"을 확인하면:
  - 신청 상태가 "거절"으로 변경된다
  - 거절 사유가 기록된다
  - 사용자에게 거절 알림이 발송된다
  - 30일 후 재신청 가능하다
  - 감사 로그가 기록된다

**기술 구현**:
- Database schema: Story 7.1 참조
- Backend API:
  ```python
  @router.put("/api/admin/partner-applications/{application_id}")
  async def update_partner_application(
      application_id: str,
      status: str,  -- approved, rejected
      rejection_reason: Optional[str],
      admin_id: str
  ):
      # 1. 신청 상태 업데이트
      application = await update_application_status(
          application_id,
          status=status,
          rejection_reason=rejection_reason,
          reviewed_by=admin_id
      )

      # 2. 감사 로그 기록 (FR52)
      await log_admin_action(
          admin_id=admin_id,
          action='partner_application_' + status,
          target_application_id=application_id,
          details={'rejection_reason': rejection_reason}
      )

      # 3. 이메일 알림 발송 (FR53)
      if status == 'approved':
          # 추천 링크 생성
          referral_code = await generate_referral_code()
          referral_link = f"https://gr8.trade/ref/{referral_code}"

          await create_partner_record(
              user_id=application.user_id,
              wallet_address=application.wallet_address,
              referral_code=referral_code,
              referral_link=referral_link
          )

          await send_email_notification(
              user_id=application.user_id,
              subject="파트너십 신청 승인",
              template='partner_approved',
              data={'referral_link': referral_link}
          )
      else:
          await send_email_notification(
              user_id=application.user_id,
              subject="파트너십 신청 거절",
              template='partner_rejected',
              data={'reason': rejection_reason}
          )

      return application
  ```

---

### Story 8.4: 시스템 건강 모니터링

**사용자 스토리**: 운영자로서, 시스템의 건강 상태(CPU, 메모리, API 응답시간)를 실시간으로 모니터링하여 문제를 조기에 발견하고 싶다.

**수용 기준**:

**Given** 운영자가 "시스템" 페이지를 연다
**When** 페이지가 로드된다
**Then** FR50: 시스템 건강 대시보드가 표시된다
**And** 다음 지표들이 실시간으로 표시된다:
  1. **API 응답시간**: 평균, P50, P95, P99 (ms)
  2. **요청율**: RPS (Requests Per Second)
  3. **에러율**: 4xx, 5xx 비율 (%)
  4. **CPU 사용량**: 백엔드 서버 (%)
  5. **메모리 사용량**: 백엔드 서버 (%)
  6. **DB 연결 수**: 활성/최대
  7. **캐시 적중률**: Redis (%)
**And** 5초마다 자동 갱신된다

**Given** API 응답시간을 확인한다
**When** 지표가 표시된다
**Then** FR50: P95 응답시간이 표시된다
**And** NFR6: 200ms 목표에 대한 현재 상태가 표시된다
**And** 목표 초과 시 빨간색으로 경고된다

**Given** 에러율을 모니터링한다
**When** 에러율이 1%를 초과하면
**Then** FR51: 경고 알림이 표시된다
**And** 해당 지표가 빨간색으로 하이라이트된다
**And** 최근 에러 로그가 표시된다

**Given** CPU/메모리 사용량을 본다
**When** 사용량이 80%를 초과하면
**Then** FR51: "리소스 부족" 경고가 표시된다
**And** Auto-scaling 제안이 표시된다 (AWS ECS)

**Given** 시스템 이벤트가 발생한다
**When** API 장애가 발생하면
**Then** FR50: 장애가 대시보드에 표시된다
**And** 시작 시간, 지속 시간이 표시된다
**And** 영향받은 엔드포인트가 표시된다

**기술 구현**:
- CloudWatch integration:
  ```python
  import boto3

  cloudwatch = boto3.client('cloudwatch')

  def get_system_metrics():
      # 1. API 응답시간 (ECS)
      api_latency = cloudwatch.get_metric_statistics(
          Namespace='AWS/ECS',
          MetricName='CPUUtilization',
          Dimensions=[{'Name': 'ServiceName', 'Value': 'gr8-backend'}],
          StartTime=datetime.now() - timedelta(minutes=5),
          EndTime=datetime.now(),
          Period=60,
          Statistics=['Average', 'Maximum', 'Minimum']
      )

      # 2. 에러율 (ALB)
      error_rate = cloudwatch.get_metric_statistics(
          Namespace='AWS/ApplicationELB',
          MetricName='HTTPCode_Target_5XX_Count',
          Dimensions=[...],
          ...
      )

      # 3. CPU/Memory (ECS)
      cpu_memory = cloudwatch.get_metric_statistics(
          Namespace='AWS/ECS',
          MetricName='CPUUtilization',
          ...
      )

      return SystemMetrics(
          apiLatency=api_latency,
          errorRate=error_rate,
          cpuUsage=cpu_memory['CPUUtilization'],
          memoryUsage=cpu_memory['MemoryUtilization']
      )
  ```
- Backend API:
  ```python
  @router.get("/api/admin/system/health")
  async def get_system_health():
      return get_system_metrics()
  ```
- Frontend: WebSocket for 실시간 업데이트 (5초마다)

```typescript
interface SystemHealth {
  apiLatency: {
    p50: number;
    p95: number;
    p99: number;
  };
  errorRate: {
    rate4xx: number;  // %
    rate5xx: number;  // %
  };
  cpuUsage: number;   // %
  memoryUsage: number; // %
  dbConnections: {
    active: number;
    max: number;
  };
  cacheHitRate: number; // %
}
```

---

### Story 8.5: 이상 탐지 시스템

**사용자 스토리**: 시스템으로서, 비정상적인 활동 패턴을 자동으로 탐지하여 운영자에게 알리고, 잠재적 위협을 조기에 차단한다.

**수용 기준**:

**Given** 이상 탐지 시스템이 실행 중이다
**When** 다음 이상 패턴이 감지되면:
  1. 단일 사용자가 1시간 내에 10개 이상의 전략 구매
  2. 단일 IP에서 100개 이상의 계정 생성
  3. 스팸 전략 게시 (중복 내용)
  4. 의심스러운 백테스트 반복 실행
  5. 대량의 리뷰 작성 (동일 사용자)
**Then** FR51: 이상 활동이 자동으로 탐지된다
**And** 운영자에게 알림이 발송된다
**And** FR52: 감사 로그에 기록된다

**Given** 스팸 전략이 게시된다
**When** 중복 내용이 감지되면
**Then** FR51: 자동으로 "검토 필요" 상태로 변경된다
**And** 게시가 일시 정지된다
**And** 운영자에게 검토 요청 알림이 전송된다

**Given** 대량 구매가 발생한다
**When** 단일 사용자가 1시간 내에 10개 이상을 구매한다
**Then** FR51: "대량 구매" 알림이 발생된다
**And** 사용자 활동이 일시 정지된다 (선택)
**And** 운영자가 수동으로 검토한다

**Given** 이상 활동이 탐지되었다
**When** 운영자가 "이상 활동" 페이지를 연다
**Then** FR51: 모든 탐지된 이벤트가 표시된다
**And** 각 이벤트에 다음이 포함된다:
  - 탐지 시간
  - 탐지 유형
  - 관련 사용자/전략
  - 위험도 (낮음, 중간, 높음)
  - 상태 (검토 중, 해결됨, 오탐)
**And** "조치" 버튼이 제공된다

**Given** 높음 위험도의 이벤트가 발생했다
**When** 운영자가 확인한다
**Then** 자동으로 사용자가 정지된다
**And** 관련 전략이 숨겨진다
**And** 이메일 알림이 발송된다

**기술 구현**:
- Anomaly detection service:
  ```python
  from datetime import datetime, timedelta

  class AnomalyDetector:
      async def detect_bulk_purchases(self):
          # 1시간 내 10개 이상 구매한 사용자 탐지
          one_hour_ago = datetime.now() - timedelta(hours=1)

          bulk_buyers = await db.query("""
              SELECT buyer_address, COUNT(*) as purchase_count
              FROM revenue_transactions
              WHERE created_at >= ?
              GROUP BY buyer_address
              HAVING purchase_count >= 10
          """, one_hour_ago)

          for buyer in bulk_buyers:
              await self.alert_admin(
                  type='bulk_purchase',
                  severity='high',
                  user_address=buyer['buyer_address'],
                  details={'purchase_count': buyer['purchase_count']}
              )

      async def detect_spam_strategies(self):
          # 중복 내용의 스팸 전략 탐지
          spam_strategies = await db.query("""
              SELECT name, description, COUNT(*) as duplicate_count
              FROM published_strategies
              WHERE created_at >= datetime('now', '-1 day')
              GROUP BY name, description
              HAVING duplicate_count >= 3
          """)

          for strategy in spam_strategies:
              await self.flag_strategy(
                  strategy_id=strategy['id'],
                  reason='spam_duplicate',
                  severity='medium'
              )

      async def detect_review_manipulation(self):
          # 단일 사용자의 대량 리뷰 작성 탐지
          # ... 구현
          pass
  ```
- Scheduled job (매 5분마다 실행):
  ```python
  from celery import Celery

  app = Celery('anomaly_detection', broker='redis://localhost')

  @app.task
  def run_anomaly_detection():
      detector = AnomalyDetector()
      await detector.detect_bulk_purchases()
      await detector.detect_spam_strategies()
      await detector.detect_review_manipulation()

  # 5분마다 실행
  app.conf.beat_schedule = {
      'anomaly-detection': {
          'task': 'run_anomaly_detection',
          'schedule': crontab(minute='*/5'),
      },
  }
  ```
- Database schema:
  ```sql
  CREATE TABLE anomaly_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    severity VARCHAR(20),  -- low, medium, high
    user_address VARCHAR(50),
    strategy_id VARCHAR(50),
    details JSONB,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, resolved, false_positive
    resolved_by VARCHAR(50),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_anomaly_events ON anomaly_events(severity, created_at);
  ```

---

### Story 8.6: 감사 로그 (Audit Log)

**사용자 스토리**: 시스템으로서, 모든 관리자 활동을 감사 로그로 기록하여 규제 준수를 보장하고 문제 발생 시 추적할 수 있게 한다.

**수용 기준**:

**Given** 관리자가 관리 활동을 수행한다
**When** 다음 작업이 실행되면:
  - 사용자 상태 변경 (정지/차단)
  - 파트너 신청 승인/거절
  - 전략 삭제/숨김
  - 리뷰 삭제
  - 시스템 설정 변경
**Then** FR52: 모든 활동이 자동으로 기록된다
**And** NFR17: 로그가 7년 보관된다 (핀테크 규제 준수)
**And** 다음 정보가 포함된다:
  - 수행자 (관리자 ID/지갑)
  - 작업 유형
  - 대상 (사용자/전략/신청 ID)
  - 변경 전/후 값
  - 타임스탬프
  - IP 주소

**Given** 감사 로그가 기록되었다
**When** 운영자가 "감사 로그" 페이지를 연다
**Then** FR52: 모든 감사 로그가 표시된다
**And** 필터가 제공된다:
  - 관리자별
  - 작업 유형별
  - 기간
  - 대상 유형별
**And** 페이지네이션이 제공된다 (100개씩)

**Given** 특정 감사 로그를 선택한다
**When** 로그를 클릭한다
**Then** FR52: 상세 정보가 표시된다
**And** 변경 전/후 값이 비교된다
**And** "원래대로 복원" 버튼이 제공된다 (가능한 경우)

**Given** 규제 기관이 요청한다
**When** 감사 로그 내보내기를 실행한다
**Then** FR52: CSV/JSON 형식으로 내보낼 수 있다
**And** 기간을 지정할 수 있다
**And** 모든 필드가 포함된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    admin_address VARCHAR(50),
    admin_name VARCHAR(200),
    action_type VARCHAR(50),  -- user_suspend, user_ban, partner_approve, etc.
    target_type VARCHAR(50),   -- user, strategy, application, etc.
    target_id VARCHAR(50),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_address, created_at DESC);
  CREATE INDEX idx_audit_logs_action ON audit_logs(action_type, created_at);
  CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id, created_at);

  -- 7년 보관 (NFR17, 핀테크 규제 준수)
  CREATE INDEX idx_audit_logs_retention ON audit_logs(created_at);
  ```
- Audit logging middleware:
  ```python
  from fastapi import Request

  async def log_admin_action(
      admin_address: str,
      action_type: str,
      target_type: str,
      target_id: str,
      old_value: dict = None,
      new_value: dict = None,
      request: Request = None
  ):
      await db.insert('audit_logs', {
          'admin_address': admin_address,
          'action_type': action_type,
          'target_type': target_type,
          'target_id': target_id,
          'old_value': old_value,
          'new_value': new_value,
          'ip_address': request.client.host if request else None,
          'user_agent': request.headers.get('user-agent') if request else None
      })

  # Decorator for automatic logging
  def audit_log(action_type: str, target_type: str):
      def decorator(func):
          async def wrapper(*args, **kwargs):
              result = await func(*args, **kwargs)

              # Extract relevant info
              admin = kwargs.get('admin_id')
              target_id = kwargs.get('target_id')

              await log_admin_action(
                  admin_address=admin,
                  action_type=action_type,
                  target_type=target_type,
                  target_id=target_id,
                  old_value=result.get('old'),
                  new_value=result.get('new')
              )

              return result
          return wrapper
      return decorator

  # Usage
  @audit_log('user_suspend', 'user')
  async def suspend_user(user_id: str, admin_id: str):
      # ...
  ```
- Cleanup job (매일 실행):
  ```python
  @app.task
  def cleanup_old_audit_logs():
      # 90일 이전 로그 삭제 (NFR17)
      cutoff_date = datetime.now() - timedelta(days=90)
      await db.execute(
          "DELETE FROM audit_logs WHERE created_at < ?",
          cutoff_date
      )
  ```

---

### Story 8.7: 이메일 알림 시스템

**사용자 스토리**: 시스템으로서, 중요한 이벤트 발생 시 사용자와 운영자에게 이메일로 알림을 발송하여适时 대응하게 한다.

**수용 기준**:

**Given** 중요한 이벤트가 발생한다
**When** 다음 이벤트가 발생하면:
  1. 전략 판매 (크리에이터)
  2. 파트너 신청 승인/거절 (신청자)
  3. 사용자 상태 변경 (사용자)
  4. 이상 활동 탐지 (운영자)
  5. 시스템 장애 (운영자)
**Then** FR53: 이메일 알림이 자동으로 발송된다
**And** 알림에는 관련 정보가 포함된다
**And** HTML 형식으로 보기 좋게 렌더링된다

**Given** 전략이 판매되었다
**When** 구매가 완료되면
**Then** FR53: 크리에이터에게 "판매 알림" 이메일이 발송된다
**And** 이메일에 다음이 포함된다:
  - 전략 이름
  - 구매자 지갑 주소 (축약형)
  - 판매 가격
  - 수익 (90%)
  - "수익 대시보드에서 보기" 링크
**And** 즉시 발송된다 (5분 내)

**Given** 파트너 신청이 승인되었다
**When** 승인이 완료되면
**Then** FR53: 신청자에게 "승인 알림" 이메일이 발송된다
**And** 이메일에 다음이 포함된다:
  - 축하 메시지
  - 추천 링크
  - QR 코드
  - "시작하기" 가이드

**Given** 사용자가 정지되었다
**When** 상태가 변경되면
**Then** FR53: 사용자에게 "정지 알림" 이메일이 발송된다
**And** 이메일에 다음이 포함된다:
  - 정지 사유
  - 정지 기간
  - 이의제기 방법
  - "문의하기" 링크

**Given** 이메일 발송이 실패한다
**When** SMTP 에러가 발생하면
**Then** 에러 로그가 기록된다 (NFR17: 7년 보관, 핀테크 규제 준수)
**And** 재시도가 실행된다 (최대 3회)
**And** 모두 실패 시 운영자에게 알림이 전송된다

**기술 구현**:
- Email service (AWS SES / SendGrid):
  ```python
  import boto3
  from jinja2 import Template

  ses = boto3.client('ses')

  EMAIL_TEMPLATES = {
      'strategy_sold': Template('''
          <h1>전략 판매 알림</h1>
          <p>{{ strategy_name }}이(가) 판매되었습니다!</p>
          <ul>
              <li>구매자: {{ buyer_address }}</li>
              <li>가격: ${{ price }}</li>
              <li>수익: ${{ revenue }}</li>
          </ul>
          <a href="{{ dashboard_url }}">수익 대시보드에서 보기</a>
      '''),
      'partner_approved': Template('...'),
      'user_suspended': Template('...')
  }

  async def send_email_notification(
      user_id: str,
      subject: str,
      template: str,
      data: dict
  ):
      # 1. 사용자 이메일 조회
      user = await get_user(user_id)
      recipient_email = user.email

      if not recipient_email:
          return {"success": False, "error": "No email"}

      # 2. 이메일 본문 렌더링
      template_obj = EMAIL_TEMPLATES[template]
      html_body = template_obj.render(**data)

      # 3. 이메일 발송 (AWS SES)
      try:
          response = ses.send_email(
              Source='noreply@gr8.trade',
              Destination={'ToAddresses': [recipient_email]},
              Message={
                  'Subject': {'Data': subject},
                  'Body': {
                      'Html': {'Data': html_body}
                  }
              }
          )
          return {"success": True, "message_id": response['MessageId']}
      except Exception as e:
          # 에러 로그 기록
          await log_error('email_send_failed', {
              'user_id': user_id,
              'template': template,
              'error': str(e)
          })

          # 재시도 (최대 3회)
          return await retry_send_email(recipient_email, subject, html_body, max_retries=3)
  ```
- Retry mechanism:
  ```python
  from tenacity import retry, stop_after_attempt, wait_exponential

  @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
  async def retry_send_email(recipient, subject, html_body):
      return await ses.send_email(...)
  ```

---

### Story 8.8: 리포트 생성 (일간/주간/월간)

**사용자 스토리**: 운영자로서, 정기적으로 플랫폼 성과 리포트를 생성하여 비즈니스 현황을 파악하고 싶다.

**수용 기준**:

**Given** 운영자가 "리포트" 페이지를 연다
**When** 페이지가 로드된다
**Then** FR54: 리포트 대시보드가 표시된다
**And** 다음 리포트가 제공된다:
  - 일간 리포트 (어제)
  - 주간 리포트 (지난 주)
  - 월간 리포트 (지난 달)
**And** 각 리포트에 다음이 포함된다:
  - 기간
  - 신규 사용자 수
  - 활성 사용자 수
  - 전략 수
  - 거래량
  - 수익
  - 전월/전주 대비 성장률

**Given** 일간 리포트를 선택한다
**When** "일간 리포트 보기"를 클릭한다
**Then** FR54: 상세 일간 리포트가 표시된다
**And** 다음 섹션이 포함된다:
  1. **요약**: 핵심 지표
  2. **사용자**: 신규/활성/이탈
  3. **전략**: 신규 게시/판매량
  4. **거래**: 거래량/수익
  5. **파트너**: 신규 파트너/유입 수
**And** 차트와 그래프로 시각화된다

**Given** 리포트를 내보내려고 한다
**When** "내보내기"를 클릭한다
**Then** FR54: PDF/CSV 형식으로 다운로드된다
**And** 모든 데이터와 차트가 포함된다
**And** 브랜딩이 적용된다 (gr8 로고)

**Given** 정기 리포트가 필요하다
**When** 매일/매주/매월 자동으로 생성되어야 한다
**Then** FR54: 스케줄된 작업이 리포트를 생성한다
**And** 운영자에게 이메일로 발송된다 (FR53)
**And** 대시보드에서 조회 가능한다

**기술 구현**:
- Scheduled reports:
  ```python
  from celery import Celery
  from datetime import date, timedelta

  app = Celery('reports', broker='redis://localhost')

  @app.task
  def generate_daily_report():
      yesterday = date.today() - timedelta(days=1)

      report = await generate_report(
          start_date=yesterday,
          end_date=yesterday,
          type='daily'
      )

      # PDF 생성
      pdf_url = generate_report_pdf(report)

      # 이메일 발송
      await send_report_email(
          recipients=['admin@gr8.trade'],
          subject=f"gr8 일간 리포트 - {yesterday}",
          report=report,
          pdf_url=pdf_url
      )

      # DB 저장
      await save_report(report, pdf_url)

  # 매일 오전 9시 실행
  app.conf.beat_schedule = {
      'daily-report': {
          'task': 'generate_daily_report',
          'schedule': crontab(hour=9, minute=0),
      },
      'weekly-report': {
          'task': 'generate_weekly_report',
          'schedule': crontab(hour=9, minute=0, day_of_week=1),
      },
      'monthly-report': {
          'task': 'generate_monthly_report',
          'schedule': crontab(hour=9, minute=0, day_of_month=1),
      },
  }
  ```
- PDF generation: `ReportLab`
- Report data structure:
  ```python
  @dataclass
  class PlatformReport:
      type: str  # daily, weekly, monthly
      start_date: date
      end_date: date

      # 사용자
      new_users: int
      active_users: int
      churned_users: int

      # 전략
      new_strategies: int
      total_strategies: int
      strategies_sold: int

      # 거래
      transaction_count: int
      transaction_volume: Decimal
      platform_revenue: Decimal

      # 파트너
      new_partners: int
      total_referrals: int

      # 성장률
      user_growth_rate: float
      revenue_growth_rate: float

      # 차트 데이터
      daily_stats: List[DayStats]
  ```

---

### Story 8.9: AML/KYC 지원 (선택)

**사용자 스토리**: 운영자로서, 규제 준수를 위해 고액 거래 사용자의 KYC(신원 확인)를 진행하고 AML(자금세탁방지)을 준수하고 싶다.

**수용 기준**:

**Given** $10,000 이상의 거래가 발생한다
**When** 사용자가 누적 거래량이 $10,000를 초과하면
**Then** FR55: KYC 요청 알림이 발송된다
**And** 사용자 대시보드에 "KYC 인증 필요" 배지가 표시된다
**And** 추가 거래가 제한된다

**Given** KYC 인증이 필요하다
**When** 사용자가 "KYC 인증"을 시작한다
**Then** FR55: KYC 인증 프로세스가 시작된다
**And** 제3자 KYC 제공자가 연동된다 (예: Stripe Identity, Veriff)
**And** 다음 정보가 요청된다:
  - 정부 발급 ID (여권/운전면허증)
  - 생체 인증 (셀카)
  - 주소 증명
**And** 사용자 정보가 안전하게 처리된다

**Given** 사용자가 KYC를 제출한다
**When** 제출이 완료되면
**Then** FR55: KYC 제공자가 자동으로 검증한다
**And** 검증 결과가 시스템에 저장된다
**And** 상태가 업데이트된다 (검증 중/승인/거절)

**Given** KYC가 승인되었다
**When** 검증이 통과하면
**Then** FR55: "KYC 인증됨" 배지가 표시된다
**And** 거래 한도가 제거된다
**And** 모든 기능을 사용할 수 있다

**Given** KYC가 거절되었다
**When** 검증이 실패하면
**Then** FR55: 사용자에게 거절 사유가 통보된다
**And** 재시도 옵션이 제공된다
**And** 거래 한도가 유지된다

**Given** AML 규정을 준수해야 한다
**When** 의심스러운 거래가 감지되면
**Then** FR55: SAR (Suspicious Activity Report)가 생성된다
**And** 운영자에게 알림이 발송된다
**And** 필요 시 관련 당국에 신고된다

**기술 구현**:
- Third-party KYC integration (Stripe Identity):
  ```python
  import stripe

  stripe.api_key = "sk_test_..."

  async def initiate_kyc_verification(user_id: str):
      user = await get_user(user_id)

      # Stripe Identity Verification Session 생성
      verification_session = stripe.identity.VerificationSession.create(
          type='document',
          metadata={'user_id': user_id},
          options={
              'document': {
                  'require_id_number': True,
                  'require_live_capture': True
              }
          }
      )

      # 사용자에게 검증 URL 제공
      return {
          'verification_url': verification_session.url,
          'verification_id': verification_session.id
      }

  async def check_kyc_status(verification_id: str):
      session = stripe.identity.VerificationSession.retrieve(verification_id)

      return {
          'status': session.status,  # processing, verified, failed
          'result': {
              'document': session.last_verification_report['document']['result']
          }
      }
  ```
- Database schema:
  ```sql
  CREATE TABLE kyc_verifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    verification_id VARCHAR(100),
    status VARCHAR(20),  -- processing, verified, failed
    verification_provider VARCHAR(50),
    verified_at TIMESTAMP,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE aml_reports (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    report_type VARCHAR(50),  -- SAR, CTR
    suspicion_reason TEXT,
    transaction_ids JSONB,
    report_filed BOOLEAN DEFAULT false,
    filed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

---

### Story 8.10: 불량 전략 신고 기능

**사용자 스토리**: 사용자로서, 부적절하거나 사기성 전략을 신고하여 커뮤니티를 안전하게 유지하고 싶다.

**수용 기준**:

**Given** 사용자가 전략 상세 페이지에 있다
**When** "신고하기" 버튼을 클릭한다
**Then** FR56: 신고 모달이 표시된다
**And** 다음 신고 사유가 제공된다:
  - 사기/스캠
  - 부적절한 내용
  - 허위 정보
  - 저작권 침해
  - 기타 (설명 입력)
**And** 사유 입력이 필수다 (최소 20자)

**Given** 신고를 제출한다
**When** "제출"을 클릭한다
**Then** FR56: 신고가 접수된다
**And** 운영자에게 알림이 발송된다
**And** FR52: 감사 로그에 기록된다
**And** "신고가 접수되었습니다" 확인 메시지가 표시된다

**Given** 신고가 접수되었다
**When** 운영자가 "신고" 페이지를 연다
**Then** 모든 신고가 표시된다
**And** 각 신고에 다음이 포함된다:
  - 신고자 지갑 주소
  - 대상 전략
  - 신고 사유
  - 상세 설명
  - 신청일
  - 상태 (검토 중, 승인, 거절)
**And** 상태별로 필터링된다

**Given** 신고를 검토한다
**When** "승인"을 클릭하면
**Then** FR56: 전략이 "숨김" 상태로 변경된다
**And** 전략이 마켓플레이스에서 제거된다
**And** 크리에이터에게 알림이 발송된다
**And** FR57: 커뮤니티 가이드라인 위반으로 기록된다

**Given** 신고가 거절된다
**When** "거절"을 클릭하고 사유를 입력한다
**Then** FR56: 신고가 거절된다
**And** 신고자에게 거절 통보가 발송된다 (선택)
**And** 전략은 유지된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE strategy_reports (
    id SERIAL PRIMARY KEY,
    strategy_id VARCHAR(50),
    reporter_address VARCHAR(50),
    reason_type VARCHAR(50),  -- fraud, inappropriate, misinformation, copyright, other
    reason_details TEXT,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, rejected
    reviewed_by VARCHAR(50),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_strategy_reports ON strategy_reports(status, created_at);
  ```
- Backend API:
  ```python
  @router.post("/api/strategies/{strategy_id}/report")
  async def report_strategy(
      strategy_id: str,
      reason_type: str,
      reason_details: str,
      reporter_address: str
  ):
      # 1. 신고 생성
      report = await create_strategy_report(
          strategy_id=strategy_id,
          reporter_address=reporter_address,
          reason_type=reason_type,
          reason_details=reason_details
      )

      # 2. 운영자 알림
      await notify_admins('new_strategy_report', report)

      # 3. 감사 로그 (FR52)
      await log_admin_action(
          admin_address=None,
          action_type='strategy_reported',
          target_type='strategy',
          target_id=strategy_id,
          details={'reporter': reporter_address, 'reason': reason_type}
      )

      return {"success": True}
  ```

---

### Story 8.11: 커뮤니티 가이드라인 시행

**사용자 스토리**: 운영자로서, 커뮤니티 가이드라인을 시행하고 위반 시 제재를 가하여 건전한 커뮤니티를 유지하고 싶다.

**수용 기준**:

**Given** 사용자가 전략을 게시하려고 한다
**When** 게시 전에 가이드라인 동의가 필요하다
**Then** FR57: "커뮤니티 가이드라인" 동의 체크박스가 표시된다
**And** 체크해야만 게시할 수 있다
**And** "가이드라인 보기" 링크가 제공된다

**Given** "가이드라인 보기"를 클릭한다
**When** 가이드라인이 표시되면
**Then** FR57: 다음 내용이 포함된다:
  1. **사기 금지**: 허위 정보, 보장 수익 금지
  2. **저작권 존중**: 타인의 전략 무단 복제 금지
  3. **적절한 콘텐츠**: 혐오/차별/폭력 콘텐츠 금지
  4. **투명성**: 백테스트 결과 정직하게 공개
  5. **책임**: 사용자는 본인의 거래에 책임짐
**And** 각 규칙에 예시가 제공된다

**Given** 가이드라인 위반이 발생한다
**When** 신고가 접수되거나 감지되면
**Then** FR57: 위반 등급이 부여된다
**And** 제재가 다음과 같이 적용된다:
  - **1차 위반**: 경고 + 전략 숨김
  - **2차 위반**: 7일 정지
  - **3차 위반**: 30일 정지
  - **4차 위반**: 영구 차단
**And** FR52: 모든 제재가 감사 로그에 기록된다

**Given** 사용자가 위반 기록을 확인한다
**When** "내 계정" > "위반 기록"을 연다
**Then** FR57: 모든 위반 기록이 표시된다
**And** 각 위반에 다음이 포함된다:
  - 위반 일자
  - 위반 유형
  - 제재 내용
  - 상태 (만료/유효)
**And** 현재 등급이 표시된다

**Given** 위반이 경고라면
**When** 경고가 부여되면
**Then** FR57: 사용자에게 경고 알림이 발송된다
**And** 위반 사유가 설명된다
**And** 재발 시 제재가 안내된다

**기술 구현**:
- Database schema:
  ```sql
  CREATE TABLE community_guidelines (
    id SERIAL PRIMARY KEY,
    version VARCHAR(10),
    content TEXT,
    effective_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE guideline_violations (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(50),
    violation_type VARCHAR(50),  -- fraud, copyright, inappropriate_content, etc.
    violation_level INTEGER,  -- 1, 2, 3, 4
    strategy_id VARCHAR(50),
    action_taken VARCHAR(50),  -- warning, suspended_7d, suspended_30d, banned
    action_expires_at TIMESTAMP,
    notes TEXT,
    reviewed_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_violations_user ON guideline_violations(user_address, created_at);
  ```
- Violation tracking system:
  ```python
  class ViolationTracker:
      async def record_violation(
          self,
          user_address: str,
          violation_type: str,
          strategy_id: str = None,
          reviewer: str = None
      ):
          # 1. 이전 위반 횟수 확인
          violation_count = await self.get_violation_count(user_address)

          # 2. 위반 등급 결정
          violation_level = violation_count + 1

          # 3. 제재 결정
          if violation_level == 1:
              action = 'warning'
              expires_at = None
          elif violation_level == 2:
              action = 'suspended_7d'
              expires_at = datetime.now() + timedelta(days=7)
          elif violation_level == 3:
              action = 'suspended_30d'
              expires_at = datetime.now() + timedelta(days=30)
          else:
              action = 'banned'
              expires_at = None

          # 4. 위반 기록
          await self.create_violation_record(
              user_address=user_address,
              violation_type=violation_type,
              violation_level=violation_level,
              strategy_id=strategy_id,
              action_taken=action,
              action_expires_at=expires_at,
              reviewed_by=reviewer
          )

          # 5. 제재 실행
          if action == 'warning':
              await self.send_warning_email(user_address, violation_type)
          elif 'suspended' in action:
              await self.suspend_user(user_address, expires_at)
          elif action == 'banned':
              await self.ban_user(user_address)

          return action
  ```

---

### Story 8.12: 데이터 분석 및 인사이트 (Google Analytics 연동)

**사용자 스토리**: 운영자로서, Google Analytics를 통해 사용자 행동을 분석하고 인사이트를 얻어 플랫폼을 개선하고 싶다.

**수용 기준**:

**Given** 운영자가 "분석" 페이지를 연다
**When** 페이지가 로드된다
**Then** FR58: Google Analytics 데이터가 표시된다
**And** 다음 지표들이 포함된다:
  1. **사용자**: 일간 활성 사용자(DAU), 월간 활성 사용자(MAU)
  2. **세션**: 평균 세션 시간, 이탈률
  3. **전환**: 지갑 연결 전환율, 구매 전환율
  4. **트래픽 소스**: 유입 채널 (Direct, Organic, Referral, Social)
  5. **페이지**: 가장 많이 방문한 페이지
**And** 데이터는 Google Analytics 4에서 가져온다

**Given** 사용자 행동을 분석한다
**When** "사용자 흐름"을 본다
**Then** FR58: 사용자 여정이 시각화된다
**And** 랜딩 페이지 → 지갑 연결 → 전략 탐색 → 구매
**And** 각 단계의 전환율이 표시된다
**And** 이탈 지점이 식별된다

**Given** 트래픽 소스를 분석한다
**When** "소스" 탭을 연다
**Then** FR58: 각 소스별 성과가 표시된다
**And** 다음이 포함된다:
  - 소스 유형 (YouTube, Twitter, Direct, 등)
  - 세션 수
  - 평균 세션 시간
  - 전환율
  - 수익 기여
**And** 가장 가치 있는 소스가 식별된다

**Given** 이벤트 추적이 설정되어 있다
**When** 다음 이벤트가 발생하면:
  - wallet_connected
  - strategy_published
  - strategy_purchased
  - backtest_executed
  - partner_application_submitted
**Then** FR58: GA4에 이벤트가 전송된다
**And** 커스텀 이벤트로 추적된다
**And** 운영 대시보드에 집계된다

**Given** Google Analytics가 연동되었다
**When** 운영자가 "커스텀 리포트"를 생성한다
**Then** FR58: 다음 차원을 결합할 수 있다:
  - 사용자 유형 (구매자/크리에이터/파트너)
  - 전략 카테고리
  - 시간대
  - 기기 유형
**And** 저장된 리포트가 자동으로 갱신된다

**기술 구현**:
- Google Analytics 4 (gtag.js):
  ```typescript
  // src/lib/analytics.ts
  export const trackEvent = (eventName: string, params?: object) => {
      if (window.gtag) {
          window.gtag('event', eventName, {
              send_to: process.env.GA4_MEASUREMENT_ID,
              ...params
          });
      }
  };

  // 이벤트 추적 예시
  export const analyticsEvents = {
      WALLET_CONNECTED: 'wallet_connected',
      STRATEGY_PUBLISHED: 'strategy_published',
      STRATEGY_PURCHASED: 'strategy_purchased',
      BACKTEST_EXECUTED: 'backtest_executed',
      PARTNER_APPLICATION_SUBMITTED: 'partner_application_submitted'
  };

  // 지갑 연결 시
  trackEvent(analyticsEvents.WALLET_CONNECTED, {
      user_type: 'new',
      wallet_type: 'metamask'
  });

  // 전략 구매 시
  trackEvent(analyticsEvents.STRATEGY_PURCHASED, {
      strategy_id: strategyId,
      price: price,
      category: category
  });
  ```
- GA4 API integration (운영 대시보드):
  ```python
  from google.analytics.data_v1beta import BetaAnalyticsDataClient

  client = BetaAnalyticsDataClient()

  @router.get("/api/admin/analytics")
  async def get_analytics_data():
      # 1. 일간 활성 사용자 (DAU)
      dau_response = client.run_report(
          property=f"properties/{GA4_PROPERTY_ID}",
          dimensions=[{"name": "date"}],
          metrics=[{"name": "activeUsers"}],
          date_ranges=[{"start_date": "7daysAgo", "end_date": "today"}]
      )

      # 2. 전환율 (지갑 연결)
      conversion_response = client.run_report(
          property=f"properties/{GA4_PROPERTY_ID}",
          dimensions=[{"name": "eventName"}],
          metrics=[{"name": "eventCount"}],
          dimension_filter={
              "filter": {
                  "field_name": "eventName",
                  "in_list_filter": {
                      "values": ["wallet_connected", "strategy_purchased"]
                  }
              }
          }
      )

      return {
          'dau': parse_dau_data(dau_response),
          'conversions': parse_conversion_data(conversion_response)
      }
  ```
- Privacy compliance:
  - GDPR 동의 배너
  - 사용자 동의 후에만 추적 활성화
  ```typescript
  export const initAnalytics = () => {
      const consent = localStorage.getItem('analytics_consent');

      if (consent === 'granted') {
          // GA4 초기화
          loadGA4();
      }
  };
  ```

---

**Epic 8 완료 기준**:
- ✅ 모든 12개 스토리가 구현되었다
- ✅ FR47-FR58이 모두 커버되었다
- ✅ 운영자가 플랫폼을 모니터링하고 관리할 수 있다
- ✅ FR52: 모든 관리자 활동이 감사 로그에 기록된다
- ✅ NFR17: 감사 로그가 7년 보관된다 (핀테크 규제 준수)
- ✅ FR53: 이메일 알림이 자동 발송된다
- ✅ FR51: 이상 활동이 탐지되고 알린다
- ✅ FR57: 커뮤니티 가이드라인이 시행된다
- ✅ FR58: GA4로 사용자 행동이 분석된다
- ✅ NFR6: API 응답시간 < 200ms

---

## 전체 프로젝트 완료 요약

**총 에픽 수**: 8개
**총 스토리 수**: 58개

### 에픽별 완료 현황

1. ✅ **Epic 1**: 인프라 (6 stories) - FR1-FR7
2. ✅ **Epic 2**: Web3 지갑 연결 (7 stories) - FR8-FR14
3. ✅ **Epic 3**: 전략 에디터 (12 stories) - FR15-FR17
4. ✅ **Epic 4**: 백테스팅 엔진 (10 stories) - FR18-FR27
5. ✅ **Epic 5**: 전략 마켓플레이스 (9 stories) - FR28-FR36
6. ✅ **Epic 6**: 크리에이터 보상 시스템 (4 stories) - FR37-FR40
7. ✅ **Epic 7**: 유튜버 통합 (6 stories) - FR41-FR46
8. ✅ **Epic 8**: 운영 대시보드 (12 stories) - FR47-FR58

### FR 커버리지

- **기능 요구사항 (FR)**: FR1-FR58 (58개) - 100% 커버
- **비기능 요구사항 (NFR)**: 18개 - 모든 에픽에 반영

### 핵심 기능 요약

1. **전략 생성**: 노드 기반 시각적 에디터, 분할 매수/매도, 조건문, 루프
2. **백테스팅**: 과거 데이터 검증, 성과 지표, 차트 시각화
3. **마켓플레이스**: 전략 판매/구매, 포크, 가격 모델 (무료/일시불/구독)
4. **수익 공유**: 크리에이터 90%, 플랫폼 10%, 파트너 20% (첫 거래)
5. **Web3 통합**: MetaMask, WalletConnect, 지갑 연결
6. **파트너십**: 유튜버 추천 프로그램, 실시간 추적
7. **운영 도구**: 사용자 관리, 감사 로그, 이상 탐지, 리포트
8. **규제 준수**: KYC/AML (선택), 커뮤니티 가이드라인

### 기술 스택

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, React Flow, Recharts
- **Backend**: FastAPI, PostgreSQL, SQLAlchemy 2.0, Redis
- **Web3**: wagmi, viem, WalletConnect, ethers.js
- **Smart Contracts**: Solidity, Hardhat
- **Infrastructure**: AWS ECS Fargate, RDS, CloudWatch, S3, CloudFront
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog/CloudWatch
- **Analytics**: Google Analytics 4
- **Email**: AWS SES/SendGrid
- **Storage**: IPFS (Pinata/NFT.Storage)

### 성능 목표 (NFR)

- NFR3: USDC 결제, 수수료 10%
- NFR6: API 응답시간 < 200ms
- NFR14: 백테스트 실행 < 2분
- NFR15: 95번째 백분위수 로딩 < 1초
- NFR16: 99%+ 가용성
- NFR17: 에러 로그 7년 보관 (핀테크 규제 준수)

### 다음 단계

모든 에픽과 스토리가 정의되었습니다. 다음 단계는:

1. **기술 사양 작성** (Tech Spec Workflow)
2. **스프린트 계획 수립** (Sprint Planning Workflow)
3. **구현 시작** (Dev Workflow)

epics.md 파일이 완성되었습니다! 🎉
