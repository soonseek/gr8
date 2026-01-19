---
story_id: "{{ story_id }}"
parent_story: "{{ parent_story }}"
gap_type: "default"
priority: "medium"
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

**As a** 개발자,
**I want** {{ title }}을(를) 구현하고 싶다,
**So that** {{ parent_story }}에서 필요한 기능을 사용할 수 있다.

## 배경 (Context)

Pre-Implementation Check에서 다음 **누락된 기능**이 발견되었습니다:

{% for gap in gaps %}
- **{{ gap.layer }} 검증:** {{ gap.description }}
  - 기대 위치: {{ gap.expected_location | default("찾을 수 없음") }}
  - 실제 상태: {{ gap.actual_status }}
{% endfor %}

이 Story는 이 누락된 기능을 구현하여 {{ parent_story }}이 원활하게 개발될 수 있도록 합니다.

## 수용 기준 (Acceptance Criteria)

{% for gap in gaps %}
**AC {{ loop.index }}: {{ gap.description }}**

**Given** {{ gap.given | default("필요한 조건") }}
**When** {{ gap.when | default("작업을 수행할 때") }}
**Then** {{ gap.then | default("기대 결과") }}

{% endfor %}
## 기술 구현 (Technical Implementation)

### 구현 세부 사항

{% for gap in gaps %}
#### {{ gap.title }}

**설명:** {{ gap.description }}

**구현 위치:** {{ gap.location | default("TBD") }}

**의존성:**
{% if gap.dependencies %}
{% for dep in gap.dependencies %}
  - {{ dep }}
{% endfor %}
{% else %}
  - 없음
{% endif %}

**구현 가이드:**
```{{ gap.language | default("python") }}
{{ gap.implementation_guide | default("# TODO: Implement this feature") }}
```

{% endfor %}
## 의존성 (Dependencies)

### 기존 Stories
{% for dep in existing_dependencies %}
- ✅ Story {{ dep }}
{% else %}
- 없음
{% endfor %}

### 새로 추가되는 것
{% for new_dep in new_dependencies %}
- ❌ {{ new_dep }}
{% else %}
- 없음
{% endif %}

## 테스트 계획 (Testing Plan)

### Unit Tests
```python
# tests/test_{{ story_id | replace('-', '_') }}.py

import pytest

{% for gap in gaps %}
def test_{{ gap.function_name | default(gap.title | replace(' ', '_') | lower()) }}():
    """{{ gap.description }} 테스트"""
    # TODO: 테스트 작성
    pass

{% endfor %}
```

## 완료 조건 (Definition of Done)

- [ ] 모든 Acceptance Criteria 구현 완료
- [ ] Unit tests 작성 및 통과
{% if requires_integration_tests %}
- [ ] Integration tests 작성 및 통과
{% endif %}
{% if requires_documentation %}
- [ ] 코드/기능 문서 작성 완료
{% endif %}
- [ ] 코드 리뷰 완료

## 참고 (References)

- **검증 리포트:** `_bmad-output/check-reports/{{ parent_story }}-pre-implementation-check.md`
- **상위 Story:** `{{ parent_story }}`
- **생성 일시:** {{ generation_date }}

## 추가 노트 (Additional Notes)

{% for note in additional_notes %}
**{{ note.title }}:** {{ note.content }}
{% endfor %}
