---
story_id: "{{ story_id }}"
parent_story: "{{ parent_story }}"
gap_type: "web3_auth"
priority: "high"
auto_generated: true
---

# Story: {{ title }}

> **⚠️ 보완 Story (Gap-Filler)**
>
> 이 Story는 **Pre-Implementation Check**에서 자동으로 생성되었습니다.
>
> **부족한 기능:** {{ gap_description }}
> **상위 Story:** {{ parent_story }}

## 사용자 스토리

**As a** Web3 개발자,
**I want** {{ title }}을(를) 구현하고 싶다,
**So that** {{ parent_story }}에서 안전하게 Web3 인증과 권한 확인을 사용할 수 있다.

## 배경 (Context)

Pre-Implementation Check에서 다음 **누락된 기능**이 발견되었습니다:

{% for gap in gaps %}
- **{{ gap.layer }}**: {{ gap.description }}
  - 기대 위치: {{ gap.expected_location | default("찾을 수 없음") }}
  - 실제 상태: {{ gap.actual_status }}
{% endfor %}

이 Story는 이 누락된 기능들을 구현하여 {{ parent_story }}이 원활하게 개발될 수 있도록 합니다.

## 수용 기준 (Acceptance Criteria)

**Given** 사용자가 Web3 지갑을 연결했을 때
**When** {{ technical_implementation.endpoint | default("/api/secure") }} 요청을 보내면
**Then** JWT 토큰이 생성되고 지갑 주소가 포함된다
**And** 토큰은 24시간 동안 유효하다
**And** 블록체인 서명을 검증한다

**Given** 관리자 권한이 필요할 때
**When** {{ technical_implementation.admin_check | default("admin_middleware") }}를 실행하면
**Then** 사용자의 role을 확인한다
**And** role이 'admin'인 경우만 접근을 허용한다
**And** role이 없거나 'admin'이 아니면 403 Forbidden을 반환한다

**Given** DB에 users 테이블이 필요할 때
**When** migration을 실행하면
**Then** users 테이블에 role 컬럼이 추가된다
**And** role의 타입은 VARCHAR(20)이며 기본값은 'user'다
**And** Enum: 'user', 'admin'

## 기술 구현 (Technical Implementation)

### Backend (FastAPI)

```python
# backend/app/auth/web3_auth.py

from web3 import Web3
from jose import JWTError, jwt
from datetime import datetime, timedelta

# JWT 토큰 생성
def create_web3_token(wallet_address: str) -> str:
    """Web3 지갑 주소로 JWT 토큰 생성"""
    payload = {
        "wallet_address": wallet_address.lower(),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, os.getenv("JWT_SECRET_KEY"), algorithm="HS256")
    return token

# Web3 서명 검증
async def verify_web3_signature(message: str, signature: str, address: str) -> bool:
    """Web3 서명 검증"""
    w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))

    try:
        # 메시지 복구
        recovered_address = w3.eth.account.recover_message(message, signature)

        if recovered_address.lower() != address.lower():
            return False

        return True
    except Exception as e:
        logger.error(f"Signature verification failed: {e}")
        return False
```

```python
# backend/app/middleware/admin_auth.py

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_admin_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """JWT 토큰 검증 및 관리자 권한 확인"""

    # 1. JWT 토큰 디코딩
    token = credentials.credentials
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    # 2. User 조회
    from backend.app.db.models import User
    from backend.app.database import get_db

    async for db in get_db():
        user = await db.query(User).filter(
            User.wallet_address == payload["wallet_address"].lower()
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

    # 3. admin_role 확인 ← 새로 구현 필요!
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    # 4. request.state에 user 저장
    request.state.user = user
    return user

# 데코레이터 형태로도 제공
def require_admin(request: Request):
    """데코레이터용 관리자 확인"""
    return request.state.user.role == "admin"
```

### DB Migration (Alembic)

```python
# alembic/versions/{{ timestamp }}_add_user_role.py

from alembic import op
import sqlalchemy as sa

def upgrade():
    """users 테이블에 role 컬럼 추가"""
    # role 컬럼 추가
    op.add_column(
        'users',
        sa.Column('role', sa.String(20), nullable=False, server_default='user')
    )

    # 기존 사용자들은 모두 'user'로 설정
    op.execute("UPDATE users SET role = 'user' WHERE role IS NULL")

def downgrade():
    """롤백"""
    op.drop_column('users', 'role')
```

### API 사용 예시

```python
# backend/app/api/admin.py

from fastapi import APIRouter, Depends
from backend.app.middleware.admin_auth import verify_admin_token

router = APIRouter()

@router.get("/dashboard")
async def get_admin_dashboard(
    current_user = Depends(verify_admin_token)  # ← 미들웨어 사용
):
    """
    운영자 대시보드 조회

    current_user는 이미 admin_role이 확인된 상태
    """
    return {
        "message": f"Welcome admin {current_user.wallet_address}",
        "data": get_dashboard_data()
    }
```

## 의존성 (Dependencies)

### 기존 Stories 재사용
- ✅ Story 2.2: Web3 지갑 연결 (`useWallet` hook)
- ✅ Story 1.2: FastAPI 백엔드 구조

### 새로 추가되는 것
- ❌ `users.role` 컬럼
- ❌ `verify_admin_token()` 미들웨어
- ❌ `create_web3_token()` 함수
- ❌ Web3 서명 검증 로직

## 완료 조건 (Definition of Done)

- [ ] users 테이블에 role 컬럼 추가 (migration 실행 완료)
- [ ] `verify_admin_token()` 미들웨어 구현 완료
- [ ] JWT 토큰 생성 로직 구현 완료
- [ ] 관리자 권한 확인 테스트 작성
- [ ] API 엔드포인트에 미들웨어 적용 완료
- [ ] 모든 테스트 통과 (unit + integration)

## 참고 (References)

- **부족한 기능 분석:** {{ analysis_report | default("_bmad-output/check-reports/" + parent_story + "-pre-implementation-check.md") }}
- **상위 Story:** `{{ parent_story }}`
- **생성 일시:** {{ generation_date }}
