# Story 4-4-deps-1: Python 데이터 분석 라이브러리 설치 (numpy, pandas)

Status: ready-for-dev

---

## Story

**As a** 백엔드 개발자 (Backend Developer),
**I want** Python 데이터 분석 라이브러리(numpy, pandas)를 설치하고 싶다,
**so that** Story 4-4의 MetricsCalculator에서 성과 지표를 효율적으로 계산할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 4-4에서 MetricsCalculator 구현 예정
- numpy의 std(), mean() 함수가 샤프 비율 계산에 필수적
- pandas의 DataFrame이 equity_curve 처리에 유용

**문제:**
- requirements.txt에 numpy, pandas 미포함
- Story 4-4 개발 차단

**해결:**
numpy >= 1.24.0, pandas >= 2.0.0 설치

**중요:**
- **Story 4-4의 선행 조건**: 이 Story가 완료되어야 Story 4-4 개발 가능
- **버전 제약**: numpy >= 1.24.0 (Python 3.11 지원), pandas >= 2.0.0 (PyArrow backend)

---

## 수용 기준 (Acceptance Criteria)

### AC 1: requirements.txt에 라이브러리 추가

**Given** requirements.txt가 있다
**When** 개발자가 numpy, pandas를 추가한다
**Then** numpy >= 1.24.0이 추가된다
**And** pandas >= 2.0.0이 추가된다
**And** dependencies 섹션에 명시된다

**기술 구현:**
```txt
# gr8-backend/requirements.txt

# Data Analysis Libraries (for Story 4-4: Performance Metrics)
numpy >= 1.24.0  # For std(), mean(), array operations in Sharpe ratio calculation
pandas >= 2.0.0  # For DataFrame operations in equity curve processing
```

### AC 2: 라이브러리 설치

**Given** requirements.txt가 수정되었다
**When** 개발자가 pip install을 실행한다
**Then** pip install numpy pandas가 성공한다
**And** 버전 확인: `python -c "import numpy; print(numpy.__version__)"`이 1.24.0 이상을 출력한다
**And** 버전 확인: `python -c "import pandas; print(pandas.__version__)"`이 2.0.0 이상을 출력한다

**기술 구현:**
```bash
# 설치
pip install numpy pandas

# 버전 확인
python -c "import numpy; print(f'numpy {numpy.__version__}')"
python -c "import pandas; print(f'pandas {pandas.__version__}')"

# 예상 출력:
# numpy 1.26.4
# pandas 2.2.1
```

### AC 3: Import 테스트

**Given** numpy, pandas가 설치되었다
**When** Python에서 import를 실행한다
**Then** import numpy가 성공한다
**And** import pandas가 성공한다
**And** numpy.array() 생성이 가능한다
**And** pandas.DataFrame() 생성이 가능한다

**기술 구현:**
```python
# import_test.py
import numpy as np
import pandas as pd

# NumPy 테스트
arr = np.array([1, 2, 3, 4, 5])
print(f"NumPy array: {arr}")
print(f"Mean: {np.mean(arr)}")
print(f"Std: {np.std(arr)}")

# Pandas 테스트
df = pd.DataFrame({
    'timestamp': [1, 2, 3],
    'value': [100, 110, 105]
})
print(f"\nPandas DataFrame:\n{df}")

# 예상 출력:
# NumPy array: [1 2 3 4 5]
# Mean: 3.0
# Std: 1.4142135623730951
#
# Pandas DataFrame:
#    timestamp  value
# 0          1    100
# 1          2    110
# 2          3    105
```

---

## Tasks / Subtasks

### Task 1: requirements.txt 수정 (AC: #1)
- [ ] Subtask 1.1: numpy >= 1.24.0 추가 (dependencies 섹션)
- [ ] Subtask 1.2: pandas >= 2.0.0 추가 (dependencies 섹션)
- [ ] Subtask 1.3: 주석 추가 (Story 4-4 참조 명시)

### Task 2: 라이브러리 설치 (AC: #2)
- [ ] Subtask 2.1: pip install numpy pandas 실행
- [ ] Subtask 2.2: numpy 버전 확인 (1.24.0 이상)
- [ ] Subtask 2.3: pandas 버전 확인 (2.0.0 이상)

### Task 3: Import 테스트 (AC: #3)
- [ ] Subtask 3.1: Python REPL에서 import numpy 테스트
- [ ] Subtask 3.2: Python REPL에서 import pandas 테스트
- [ ] Subtask 3.3: numpy.array() 생성 테스트
- [ ] Subtask 3.4: pandas.DataFrame() 생성 테스트

### Task 4: 단위 테스트 작성 (선택사항)
- [ ] Subtask 4.1: tests/integration/test_numpy_pandas.py 생성
- [ ] Subtask 4.2: numpy array 연산 테스트 (mean, std)
- [ ] Subtask 4.3: pandas DataFrame 생성 테스트
- [ ] Subtask 4.4: pytest 실행 및 통과 확인

---

## Dev Notes

### 🎯 목표

이 Story는 **Python 데이터 분석 라이브러리를 설치**합니다. 완료되면:
- **Story 4-4 개발 가능**: MetricsCalculator에서 numpy, pandas 활용 가능
- **성능 향상**: numpy, pandas는 순수 Python 대비 10-100x 빠름
- **표준 라이브러리**: 데이터 분석 표준 도구 활용

### 📚 라이브러리 버전 선정 이유

**numpy >= 1.24.0:**
- Python 3.11 지원 (성능 향상)
- numpy.float64 타입 안정화
- SIMD 지원 개선

**pandas >= 2.0.0:**
- PyArrow backend 지원 (메모리 효율 50% 개선)
- Apache Arrow 호환
- Copy-on-Write 메커니즘 (버그 감소)

### 🔗 Story 4-4와의 연관성

**Story 4-4의 MetricsCalculator가 numpy/pandas를 활용하는 곳:**

1. **calculate_roi()**: pandas로 profit 계산 (DataFrame.groupby())
2. **calculate_mdd()**: numpy로 peak tracking (np.maximum.accumulate())
3. **calculate_win_rate()**: numpy로 boolean indexing (profits > 0)
4. **calculate_profit_factor()**: numpy로 평균 계산 (np.mean(winning_trades))
5. **calculate_sharpe_ratio()**: numpy로 수익률 계산 (np.std(), np.mean())

**예시:**
```python
# Story 4-4의 MetricsCalculator
import numpy as np
import pandas as pd

def calculate_sharpe_ratio(self, equity_curve):
    values = [point["value"] for point in equity_curve]

    # numpy 활용
    returns = np.diff(values) / values[:-1]
    avg_return = np.mean(returns)
    std_return = np.std(returns)

    # ... 샤프 비율 계산
    sharpe_ratio = (avg_return - risk_free_rate) / std_return
    return sharpe_ratio * np.sqrt(252)  # 연율화
```

### ⚠️ 중요 고려사항

**1. 의존성 충돌 방지:**
- numpy, pandas는 다른 라이브러리와의 의존성 충돌 가능성 낮음
- 그러나 버전 고정 (>=)으로 유연성 확보

**2. 가상 환경 사용:**
- venv 또는 conda 환경에서 설치 권장
- 전역 Python 환경 오염 방지

**3. 개발/프로덕션 환경 일치:**
- requirements.txt를 버전 관리하여 개발/프로덕션 환경 일치
- Docker 이미지 빌드 시 requirements.txt 활용

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1.2: 백엔드 스타터 템플릿 (FastAPI, PostgreSQL, requirements.txt 존재)

**후속 Stories (이 Story의 결과 활용):**
- Story 4-4: 성과 지표 계산 (MetricsCalculator 실제 구현)
- Story 4-3: 전략 실행 엔진 (선택사항 - Story 4-4와 독립적)

**파일 수정 목록:**
1. `gr8-backend/requirements.txt` - ✅ 수정 (numpy, pandas 추가)
2. `tests/integration/test_numpy_pandas.py` - 🆕 새로 생성 (선택사항)

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
1. Story 4-4 Pre-Implementation Check에서 Gap 발견
2. Gap 해결을 위한 보완 Story 생성
3. 3개 AC 정의 (requirements.txt 추가, 설치, import 테스트)
4. 4개 Task/13개 Subtask 정의
5. Dev Notes 작성 (라이브러리 버전 선정 이유, Story 4-4와의 연관성)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- numpy >= 1.24.0 설치
- pandas >= 2.0.0 설치
- Story 4-4의 선행 조건 충족

📋 **다음 단계:**
- Story 4-4-deps-1 개발 시작 (numpy, pandas 설치)
- Story 4-4 개발 시작 (MetricsCalculator 실제 구현)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-4-deps-1.md` - This story file

**Backend Files to Modify (est. 1 file)**
- `gr8-backend/requirements.txt` - ✅ 수정 (numpy >= 1.24.0, pandas >= 2.0.0 추가)

**Test Files (optional, est. 1 file)**
- `tests/integration/test_numpy_pandas.py` - 🆕 새로 생성 (import 테스트)

**Total:** 1-2 files to create/modify
