---
story_id: "{{ story_id }}"
parent_story: "{{ parent_story }}"
gap_type: "database"
priority: "high"
auto_generated: true
---

# Story: {{ title }}

> **⚠️ 보완 Story (Gap-Filler) - Database Schema**
>
> 이 Story는 **Pre-Implementation Check**에서 자동으로 생성되었습니다.
>
> **부족한 기능:** {{ gap_description }}
> **상위 Story:** {{ parent_story }}

## 사용자 스토리

**As a** 개발자,
**I want** {{ title }}을(를) 구현하고 싶다,
**So that** {{ parent_story }}에서 필요한 데이터베이스 스키마를 사용할 수 있다.

## 배경 (Context)

Pre-Implementation Check **Layer 2 검증**에서 다음 **누락된 DB 스키마**가 발견되었습니다:

{% for gap in gaps %}
- **테이블:** {{ gap.table }}
- **누락된 컬럼:** {{ gap.missing_columns | join(", ") }}
- **영향:** {{ gap.impact }}
{% endfor %}

이 Story는 이 누락된 스키마를 추가하여 {{ parent_story }}이 정상적으로 작동하도록 합니다.

## 수용 기준 (Acceptance Criteria)

{% for gap in gaps %}
**Given** {{ gap.table }} 테이블이 필요할 때
**When** 마이그레이션을 실행하면
**Then** {{ gap.table }} 테이블에 다음 컬럼들이 추가된다:
{% for col in gap.missing_columns %}
  - **{{ col.name }}** ({{ col.type }}){% if col.default %}, 기본값: {{ col.default }}{% endif %}{% if col.nullable %}, nullable: true{% endif %}
{% endfor %}

{% endfor %}
{% for gap in gaps %}
**Given** {{ gap.table }} 테이블에 데이터가 있을 때
**When** {{ gap.table }}을 조회하면
**Then** 새로 추가된 컬럼들이 올바르게 반환된다
**And** 기존 데이터는 보존된다

{% endfor %}
## 기술 구현 (Technical Implementation)

### DB Migration (Alembic)

```python
# alembic/versions/{{ timestamp }}_add_{{ story_id | replace('-', '_') }}.py

from alembic import op
import sqlalchemy as sa
from datetime import datetime

{{ gap.table | upper() }}_TABLE = "{{ gap.table }}"

def upgrade():
    """{{ gap.table }} 테이블에 누락된 컬럼 추가"""

{% for gap in gaps %}
    # {{ gap.table }} 테이블
{% for col in gap.missing_columns %}
    op.add_column(
        '{{ gap.table }}',
        sa.Column('{{ col.name }}', {{ col.python_type }}{% if col.nullable %}, nullable=True{% else %}, nullable=False{% endif %}{% if col.default %}, server_default={{ col.default }}{% endif %})
    )
{% endfor %}

    # 기존 데이터 처리 (필요한 경우)
{% if gap.backfill %}
    {{ gap.backfill }}
{% endif %}

{% endfor %}

def downgrade():
    """롤백"""

{% for gap in gaps %}
    # {{ gap.table }} 테이블
{% for col in gap.missing_columns %}
    op.drop_column('{{ gap.table }}', '{{ col.name }}')
{% endfor %}

{% endfor %}
```

### SQLAlchemy 모델 업데이트

```python
# backend/app/db/models.py

from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID

class {{ gap.table | capitalize }}(Base):
    __tablename__ = "{{ gap.table }}"

    # 기존 컬럼들...
    id = Column(Integer, primary_key=True)
    # ... (기존 필드들)

    # 새로 추가된 컬럼들
{% for col in gap.missing_columns %}
    {{ col.name }} = Column({{ col.python_type }}{% if col.nullable %}, nullable=True{% else %}, nullable=False{% endif %}{% if col.default %}, default={{ col.default }}{% endif %})
{% endfor %}
```

## 의존성 (Dependencies)

### 기존 Stories
- ✅ Story 1.2: Backend 스타터 템플릿 (FastAPI, SQLAlchemy)
- ✅ Story {{ gap.source_story | default("1.2") }}: {{ gap.table }} 테이블 기본 구조

### 새로 추가되는 것
- ❌ DB Migration ({{ gap.table }} 테이블 스키마 업데이트)
- ❌ SQLAlchemy 모델 업데이트

## 테스트 계획 (Testing Plan)

### Unit Tests
```python
# tests/test_{{ story_id | replace('-', '_') }}.py

import pytest
from backend.app.db.models import {{ gap.table | capitalize }}

def test_{{ gap.table | lower() }}_new_columns():
    """새로 추가된 컬럼이 존재하는지 테스트"""
    # TODO: 컬럼 존재 확인 테스트 작성
    pass

def test_migration_up_down():
    """Migration 롤백 테스트"""
    # TODO: Migration 업그레이드/다운그레이드 테스트
    pass
```

### Integration Tests
```python
def test_{{ gap.table | lower() }}_crud_with_new_columns():
    """새로운 컬럼으로 CRUD 작업 테스트"""
    # TODO: 전체 CRUD 흐름 테스트
    pass
```

## 완료 조건 (Definition of Done)

- [ ] Migration 파일 작성 완료
- [ ] Migration 테스트 통과 (upgrade & downgrade)
- [ ] SQLAlchemy 모델 업데이트 완료
- [ ] Unit tests 작성 및 통과
- [ ] Integration tests 작성 및 통과
- [ ] 로컬 DB에서 migration 실행 완료
- [ ] 기존 데이터 보존 확인

## 롤백 계획 (Rollback Plan)

만약 이 Story의 구현으로 문제가 발생하면:

1. **Migration 롤백**: `alembic downgrade -1`
2. **코드 롤백**: Git revert
3. **영향 범위**: {{ gap.table }} 테이블만 영향

## 참고 (References)

- **Layer 2 검증 리포트:** `_bmad-output/check-reports/{{ parent_story }}-pre-implementation-check.md`
- **상위 Story:** `{{ parent_story }}`
- **관련 테이블:** {{ gap.table }}
- **생성 일시:** {{ generation_date }}
