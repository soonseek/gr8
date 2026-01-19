---
story_id: "{{ story_id }}"
parent_story: "{{ parent_story }}"
gap_type: "api"
priority: "high"
auto_generated: true
---

# Story: {{ title }}

> **⚠️ 보완 Story (Gap-Filler) - API Endpoint**
>
> 이 Story는 **Pre-Implementation Check**에서 자동으로 생성되었습니다.
>
> **부족한 기능:** {{ gap_description }}
> **상위 Story:** {{ parent_story }}

## 사용자 스토리

**As a** 개발자,
**I want** {{ title }}을(를) 구현하고 싶다,
**So that** {{ parent_story }}에서 필요한 API 엔드포인트를 호출할 수 있다.

## 배경 (Context)

Pre-Implementation Check **Layer 1 & Layer 2 검증**에서 다음 **누락된 API**가 발견되었습니다:

{% for gap in gaps %}
- **엔드포인트:** {{ gap.method }} {{ gap.endpoint }}
- **목적:** {{ gap.purpose }}
- **기대 위치:** {{ gap.expected_location | default("찾을 수 없음") }}
- **실제 상태:** {{ gap.actual_status }}
{% endfor %}

이 Story는 이 누락된 API 엔드포인트를 구현하여 {{ parent_story }}이 정상적으로 작동하도록 합니다.

## 수용 기준 (Acceptance Criteria)

{% for gap in gaps %}
**AC {{ loop.index }}: {{ gap.endpoint }} 구현**

**Given** 클라이언트가 {{ gap.method }} {{ gap.endpoint }}를 요청할 때
**When** 요청이 처리되면
**Then** {{ gap.success_response }}
**And** HTTP 상태 코드는 {{ gap.success_status | default(200) }}이다

{% if gap.requires_auth %}
**And** 인증이 필요하며 JWT 토큰을 검증한다
**And** 인증되지 않으면 401 Unauthorized를 반환한다
{% endif %}

{% if gap.requires_admin %}
**And** 관리자 권한이 필요하며 admin_role을 확인한다
**And** 관리자가 아니면 403 Forbidden을 반환한다
{% endif %}

{% endfor %}
## 기술 구현 (Technical Implementation)

### Backend (FastAPI)

```python
# backend/app/api/{{ api_module_name | default("gap_endpoints") }}.py

from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.middleware.admin_auth import verify_admin_token
from backend.app.auth.jwt import get_current_user

router = APIRouter()

{% for gap in gaps %}
@router.{{ gap.method.lower() }}("{{ gap.endpoint }}")
{% if gap.requires_auth %}
async def {{ gap.function_name }}(
    {% if gap.requires_admin %}current_user = Depends(verify_admin_token){% else %}current_user = Depends(get_current_user){% endif %}
):
    """
    {{ gap.description }}

    Returns: {{ gap.returns }}
    """
    try:
        # TODO: {{ gap.function_name }} 구현
        result = {{ gap.implementation_stub | default("pass") }}
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )

{% endif %}
{% endfor %}
```

### 요청/응답 모델

```python
# backend/app/schemas/{{ schema_name }}.py

from pydantic import BaseModel
from typing import Optional

{% for gap in gaps %}
{% if gap.response_model %}
class {{ gap.response_model }}(BaseModel):
    """{{ gap.description }} 응답 모델"""
    # TODO: 응답 필드 정의
    pass

{% endif %}
{% endfor %}
```

## API 명세 (API Specification)

{% for gap in gaps %}
### {{ gap.method }} {{ gap.endpoint }}

**설명:** {{ gap.description }}

**요청:**
- **Method:** {{ gap.method }}
- **URL:** `/api{{ gap.endpoint }}
- **헤더:**
{% if gap.requires_auth %}
  - `Authorization: Bearer <JWT_TOKEN>`
{% endif %}

**응답:**
- **성공:** {{ gap.success_status | default(200) }}
  ```json
  {{ gap.success_response_example | default("{}") }}
  ```
- **실패:**
  - 401 Unauthorized (인증 실패)
{% if gap.requires_admin %}
  - 403 Forbidden (권한 없음)
{% endif %}
  - 500 Internal Server Error

{% endfor %}

## 의존성 (Dependencies)

### 기존 Stories
- ✅ Story 1.2: FastAPI 백엔드 구조
- ✅ Story 2.2: JWT 인증 ({{ '# if gap.requires_auth' }}API 인증 필요{{ '# endif' }})

### 새로 추가되는 것
- ❌ API 라우터: `backend/app/api/{{ api_module_name }}.py`
- ❌ Pydantic 스키마: `backend/app/schemas/{{ schema_name }}.py`

## 테스트 계획 (Testing Plan)

### Integration Tests
```python
# tests/test_{{ story_id | replace('-', '_') }}.py

import pytest
from fastapi.testclient import TestClient

def test_{{ gap.endpoint | replace('/', '_') }}_success(client: TestClient, auth_token: str):
    """{{ gap.description }} 성공 테스트"""
    response = client.{{ gap.method.lower() }}(
        "/api{{ gap.endpoint }}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == {{ gap.success_status | default(200) }}

def test_{{ gap.endpoint | replace('/', '_') }}_unauthorized(client: TestClient):
    """인증 실패 테스트"""
    response = client.{{ gap.method.lower() }}(
        "/api{{ gap.endpoint }}"
    )
    assert response.status_code == 401
```

## 완료 조건 (Definition of Done)

- [ ] API 엔드포인트 구현 완료
{% for gap in gaps %}
- [ ] {{ gap.method }} {{ gap.endpoint }} 테스트 통과
{% endfor %}
- [ ] 인증/권한 체크 구현 완료 (필요한 경우)
- [ ] API 문서 작성 완료
- [ ] Integration tests 통과

## 참고 (References)

- **Layer 1 & 2 검증 리포트:** `_bmad-output/check-reports/{{ parent_story }}-pre-implementation-check.md`
- **상위 Story:** `{{ parent_story }}`
- **FastAPI 문서:** https://fastapi.tiangolo.com/
- **생성 일시:** {{ generation_date }}
