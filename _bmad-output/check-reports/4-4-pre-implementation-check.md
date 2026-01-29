# Story 4-4 Pre-Implementation Check Report

**Story ID**: 4-4
**Story Title**: 성과 지표 계산 (ROI, MDD, 승률 등) - Performance Metrics Calculation
**Check Date**: 2026-01-29
**Checked By**: Scrum Master Agent (SM)
**Overall Result**: ⚠️ **PASS with Gaps** - 1개 보완 Story 필요 (의존성 라이브러리 설치)

---

## Executive Summary

Story 4-4는 Layer 1(문서 논리)과 Layer 3(의존성 그래프) 검증을 통과했습니다. **Story 4.1에서 MetricsCalculator 인터페이스가 정의**되어 있고, **FR21, FR22, FR23, FR24를 커버**합니다. 그러나 **Layer 2(구현 상태) 검증에서 1개의 Gap이 발견**되었습니다.

### 검증 결과 요약

| Layer | Status | Details |
|-------|--------|---------|
| **Layer 1: 문서 논리 검증** | ✅ **PASS** | FR21-24 커버, 의존성 매핑 정상, AC 완결 |
| **Layer 2: 구현 상태 검증** | ⚠️ **GAPS FOUND** | numpy, pandas 라이브러리 미설치, backtest 폴더 미생성 |
| **Layer 3: 의존성 그래프 분석** | ✅ **PASS** | 순환 의존성 없음, depth=4, fan-out=1 |
| **종합 결과** | ⚠️ **PASS with Gaps** | **1개 보완 Story 필요** (4-4-deps-1) |

---

## Layer 1: 문서 논리 검증 (Document Logic Check)

### ✅ FR 커버리지 확인

**FR21: 사용자는 백테스트 결과를 확인할 수 있다** [Source: PRD.md line 2391]

- **Coverage**: Story 4-4 → ✅ **완전 커버**
- **Verification**: AC 1에서 7개 성과 지표 자동 계산 명시
- **기술 구현**: `MetricsCalculator.calculate_all_metrics()`가 모든 지표 계산

**FR22: 사용자는 백테스트 결과에서 수익률을 볼 수 있다** [Source: PRD.md line 2392]

- **Coverage**: Story 4-4 → ✅ **완전 커버**
- **Verification**: AC 2에서 ROI 계산 명시
- **기술 구현**: `calculate_roi()` 메서드

**FR23: 사용자는 백테스트 결과에서 최대 낙폭(MDD)을 볼 수 있다** [Source: PRD.md line 2393]

- **Coverage**: Story 4-4 → ✅ **완전 커버**
- **Verification**: AC 3에서 MDD 계산 명시
- **기술 구현**: `calculate_mdd()` 메서드

**FR24: 사용자는 백테스트 결과에서 샤프 비율을 볼 수 있다** [Source: PRD.md line 2394]

- **Coverage**: Story 4-4 → ✅ **완전 커버**
- **Verification**: AC 5에서 샤프 비율 계산 명시
- **기술 구현**: `calculate_sharpe_ratio()` 메서드

### ✅ 의존성 매핑 검증

**선행 Stories:**
1. **Story 1-2: 백엔드 스타터 템플릿** ✅ (done)
   - 제공: FastAPI, PostgreSQL, SQLAlchemy 2.0 Async, Alembic

2. **Story 4-1: 백테스팅 엔진 아키텍처 설계** ✅ (check-passed)
   - 제공: MetricsCalculator 인터페이스 정의 (메서드 시그니처)
   - 검증 완료: 4-1-backtest-engine-architecture.md 확인

3. **Story 4-2: 과거 시장 데이터 수집** ✅ (done)
   - 제공: MarketData 모델, market_data 테이블
   - 검증 완료: `gr8-backend/app/models/market_data.py` 존재

4. **Story 3-2: 노드 타입 정의** ✅ (done)
   - 제공: NodeType enum, 전략 JSON 구조
   - 검증 완료: 3-2-node-type-definitions.md 확인

**의존성 체인:**
```
1-2 (Backend Starter) → 4-2 (Market Data) → 4-1 (Architecture) → 4-4 (Metrics) ✅
                                     ↓
                              4-3 (Execution Engine) - 선행 조건 권장
```

**참고**: Story 4-4는 Story 4-3(전략 실행 엔진)의 결과(self.trades, self.equity_curve)를 활용하지만, Mock 데이터로 독립 개발 가능

### ✅ Acceptance Criteria 완결성 확인

**Story 4-4 AC 검증:**
- AC 1: 성과 지표 자동 계산 (FR21) → ✅ 명확함 (7개 지표 정의됨)
- AC 2: ROI 계산 → ✅ 명확함 (공식, 오차 범위 ±0.1%)
- AC 3: MDD 계산 → ✅ 명확함 (peak tracking 알고리즘)
- AC 4: 승률 및 손익비 계산 → ✅ 명확함 (매수/매도 쌍 매칭)
- AC 5: 샤프 비율 계산 → ✅ 명확함 (무위험 이자율 연 3%, 연율화)
- AC 6: 평균 보유 기간 계산 → ✅ 명확함 (매수~매도 시간 차이)
- AC 7: BacktestEngine과의 통합 → ✅ 명확함 (MetricsCalculator 인스턴스화 및 호출)

**결과**: 모든 AC가 명확하고 검증 가능함

---

## Layer 2: 구현 상태 검증 (Implementation State Check)

### ✅ 백엔드 스타터 템플릿 확인 (Story 1.2)

**FastAPI 및 PostgreSQL 설정 확인:**
- ✅ `gr8-backend/app/core/database.py` 존재 (SQLAlchemy AsyncSession)
- ✅ `gr8-backend/app/main.py` 존재 (FastAPI app)
- ✅ Alembic 설정 완료

### ✅ Story 4.1 아키텍처 인터페이스 확인

**MetricsCalculator 인터페이스 정의** [Source: 4-1-backtest-engine-architecture.md line 390-470]:
```python
class MetricsCalculator:
    def calculate_all_metrics(
        self,
        trades: List[Dict[str, Any]],
        initial_capital: float,
        equity_curve: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        모든 성과 지표 계산

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_roi(self, trades: List[Dict], initial_capital: float) -> float:
        """ROI 계산"""
        pass

    def calculate_mdd(self, equity_curve: List[Dict]) -> float:
        """MDD 계산"""
        pass

    def calculate_win_rate(self, trades: List[Dict]) -> float:
        """승률 계산"""
        pass

    def calculate_sharpe_ratio(self, equity_curve: List[Dict]) -> float:
        """샤프 비율 계산"""
        pass
```
- ✅ 인터페이스 정의 완료
- ⚠️ 실제 구현 필요 (Story 4-4에서 구현 예정)

### ⚠️ Gap 1: Python 데이터 분석 라이브러리 미설치

**문제:**
- Story 4-4에서 **pandas, numpy**가 필수적으로 필요함
- 샤프 비율 계산에 numpy의 std(), mean() 함수 필요
- 수익률 계산에 pandas 활용 가능

**검증 결과:**
```bash
$ cat gr8-backend/requirements.txt | grep -E "(numpy|pandas)"
# (결과 없음)
```
- ❌ **numpy 미설치**
- ❌ **pandas 미설치**

**영향:**
- `calculate_sharpe_ratio()` 메서드에서 `np.std()`, `np.mean()` 사용 불가
- `calculate_mdd()`에서 peak tracking에 numpy 활용 어려움
- 성능 저하 (순수 Python 대비 pandas/numpy가 10-100x 빠름)

**해결:**
- Story 4-4에서 **numpy >= 1.24.0**, **pandas >= 2.0.0** 추가 필요

**보완 Story 생성 필요: 4-4-deps-1**

### ⚠️ 추가 구현 필요

**폴더 구조:**
- ⚠️ `gr8-backend/app/backtest/` 디렉토리가 **아직 생성되지 않음**
- ⚠️ `gr8-backend/app/backtest/metrics.py` **아직 없음** (스켈레톤만 Story 4.1에 정의됨)

**이유:**
- Story 4-1은 **아키텍처 설계**만 수행 (check-passed)
- 실제 폴더 생성은 Story 4-3에서 수행 예정
- Story 4-4는 Story 4-3과 독립적으로 개발 가능하지만, backtest 폴더가 필요함

**해결:**
- Story 4-4 시작 시 `app/backtest/` 폴더 생성 필요
- 또는 Story 4-3에서 먼저 폴더 생성 후 Story 4-4 개발

---

## Layer 3: 의존성 그래프 분석 (Dependency Graph Analysis)

### ✅ 순환 의존성 감지

**의존성 그래프:**
```
Story 1-2 (Backend Starter: FastAPI, PostgreSQL)
    ↓
Story 4-2 (Market Data: MarketData 모델)
    ↓
Story 3-2 (Node Types: NodeType enum)
    ↓
Story 4-1 (Backtest Architecture: MetricsCalculator 인터페이스)
    ↓
Story 4-4 (Performance Metrics) ← 현재 Story
    ↓
Story 4-6 (Backtest Storage) - 후속
```

**분석 결과:**
- ✅ **순환 의존성 없음**: 모든 의존성이 단방향 (하향식)
- ✅ **Topological sort 가능**

### ✅ 의존성 깊이 분석

**Depth Calculation:**
- 4-4 → 4-1 (depth: 1)
- 4-4 → 4-2 (depth: 2)
- 4-4 → 1-2 (depth: 3)

**Result**: Max depth = 3
- ✅ **우수**: depth ≤ 3 (권장 범위 충족)

### ✅ Fan-out 분석

**Fan-out (하위 의존성 수):**
- 4-4의 직접 의존성: 4-6 (1개) ✅
- 4-4는 Story 4.6 (BacktestStorage)의 선행 조건

**Result**: Max fan-out = 1
- ✅ **우수**: fan-out ≤ 4

---

## 발견된 Gaps 및 보완 Stories

### ⚠️ Gap 1: Python 데이터 분석 라이브러리 미설치 (Layer 2)

**문제:**
- Story 4-4에서 **pandas, numpy**가 필수적임
- requirements.txt에 미포함

**영향 받는 AC:**
- AC 2: ROI 계산 (pandas 활용 가능)
- AC 3: MDD 계산 (numpy의 peak tracking)
- AC 5: 샤프 비율 계산 (numpy의 std(), mean())

**해결:**
**Story 4-4-deps-1: Python 데이터 분석 라이브러리 설치**

```yaml
story_id: 4-4-deps-1
title: Python 데이터 분석 라이브러리 설치 (numpy, pandas)
type: gap-filler
parent_story: 4-4
priority: P0 (blocking)

acceptance_criteria:
  - AC 1: numpy >= 1.24.0이 requirements.txt에 추가됨
  - AC 2: pandas >= 2.0.0이 requirements.txt에 추가됨
  - AC 3: pip install numpy pandas 성공
  - AC 4: Python에서 import numpy, import pandas 성공

tasks:
  - Task 1: requirements.txt에 라이브러리 추가
    - Subtask 1.1: numpy >= 1.24.0 추가
    - Subtask 1.2: pandas >= 2.0.0 추가
  - Task 2: 라이브러리 설치
    - Subtask 2.1: pip install numpy pandas 실행
    - Subtask 2.2: 버전 확인 (numpy.__version__, pandas.__version__)
  - Task 3: 단위 테스트 (선택사항)
    - Subtask 3.1: tests/integration/test_numpy_pandas.py 생성
    - Subtask 3.2: numpy array 연산 테스트
    - Subtask 3.3: pandas DataFrame 생성 테스트

estimated_effort: 30분
blocking: true (Story 4-4 개발 차단)
```

**의존성:**
- Story 4-4-deps-1이 완료되어야 Story 4-4 개발 가능

---

## 검증 결과 및 다음 단계

### 📊 최종 결과

| 항목 | 결과 | 비고 |
|------|------|------|
| **Layer 1: 문서 논리** | ✅ PASS | FR21-24 커버, 의존성 매핑 완료, AC 완결 |
| **Layer 2: 구현 상태** | ⚠️ **GAPS FOUND** | numpy, pandas 라이브러리 미설치, backtest 폴더 미생성 |
| **Layer 3: 의존성 그래프** | ✅ PASS | 순환 없음, depth=3, fan-out=1 |
| **종합 결과** | ⚠️ **PASS with Gaps** | **1개 보완 Story 필요** (4-4-deps-1) |

### 🎯 권장사항

**즉시 실행 (P0) - Blocking:**
1. ⚠️ **Story 4-4-deps-1 생성 및 완료**: numpy, pandas 라이브러리 설치
   - `numpy >= 1.24.0` 추가
   - `pandas >= 2.0.0` 추가
   - pip install 실행
   - import 테스트

2. ⚠️ **`app/backtest/` 폴더 생성** (Story 4-3 또는 Story 4-4 시작 시):
   ```bash
   mkdir -p gr8-backend/app/backtest
   touch gr8-backend/app/backtest/__init__.py
   ```

3. ⚠️ **Story 4-4 개발 시작** (4-4-deps-1 완료 후):
   - `app/backtest/metrics.py` 구현
   - MetricsCalculator.calculate_all_metrics() 구현
   - 7개 성과 지표 계산 로직 구현

**선택사항 (P1):**
1. **Story 4-3 먼저 개발**: 전략 실행 엔진 구현 → self.trades, self.equity_curve 생성 → Story 4-4 개발 시 실 데이터 활용 가능
2. **Mock 데이터로 Story 4-4 먼저 개발**: Story 4-3과 독립적으로 개발 가능 (Mock trades, equity_curve로 단위 테스트)

### 📝 Story 상태 전이

**현재 상태**: ready-for-dev
**권장 상태 전이**:
```
ready-for-dev → check (보완 Story 필요)
```

**보완 Story 완료 후:**
```
4-4-deps-1: done → 4-4: check-passed → in-progress (개발 시작 가능)
```

---

## 부록: 검증 방법 및 도구

### 사용된 검증 명령어

```bash
# 1. FR 커버리지 확인
grep -n "FR21\|FR22\|FR23\|FR24" _bmad-output/planning-artifacts/prd.md

# 2. numpy, pandas 설치 확인
cat gr8-backend/requirements.txt | grep -E "(numpy|pandas)"

# 3. backtest 폴더 확인
ls -la gr8-backend/app/backtest/

# 4. Story 4-1 인터페이스 확인
cat _bmad-output/implementation-artifacts/4-1-backtest-engine-architecture.md

# 5. Story 4-4 확인
cat _bmad-output/implementation-artifacts/4-4-performance-metrics.md
```

### 참고 문서

- **Story 4-4**: `_bmad-output/implementation-artifacts/4-4-performance-metrics.md`
- **Story 4-1**: `_bmad-output/implementation-artifacts/4-1-backtest-engine-architecture.md`
- **project-context**: `_bmad-output/project-context.md`
- **architecture**: `_bmad-output/planning-artifacts/architecture.md`
- **epics**: `_bmad-output/planning-artifacts/epics.md`

---

**보고서 생성일**: 2026-01-29
**검증자**: Scrum Master Agent (BMad Method)
**승인 상태**: Pending User Approval

---

## 🎯 보완 Story 상세: 4-4-deps-1

### Story 4-4-deps-1: Python 데이터 분석 라이브러리 설치

**Status:** ready-for-dev

**Story:**

**As a** 백엔드 개발자 (Backend Developer),
**I want** Python 데이터 분석 라이브러리(numpy, pandas)를 설치하고 싶다,
**so that** Story 4-4의 MetricsCalculator에서 성과 지표를 효율적으로 계산할 수 있다.

**배경:**

**현재 상황:**
- Story 4-4에서 MetricsCalculator 구현 예정
- numpy의 std(), mean() 함수가 샤프 비율 계산에 필수적
- pandas의 DataFrame이 equity_curve 처리에 유용

**문제:**
- requirements.txt에 numpy, pandas 미포함
- Story 4-4 개발 차단

**해결:**
numpy >= 1.24.0, pandas >= 2.0.0 설치

**수용 기준:**

### AC 1: requirements.txt에 라이브러리 추가

**Given** requirements.txt가 있다
**When** 개발자가 numpy, pandas를 추가한다
**Then** numpy >= 1.24.0이 추가된다
**And** pandas >= 2.0.0이 추가된다

**기술 구현:**
```txt
# gr8-backend/requirements.txt
numpy >= 1.24.0
pandas >= 2.0.0
```

### AC 2: 라이브러리 설치

**Given** requirements.txt가 수정되었다
**When** 개발자가 pip install을 실행한다
**Then** pip install numpy pandas가 성공한다
**And** 버전 확인: python -c "import numpy; print(numpy.__version__)"이 1.24.0 이상을 출력한다
**And** 버전 확인: python -c "import pandas; print(pandas.__version__)"이 2.0.0 이상을 출력한다

### AC 3: Import 테스트

**Given** numpy, pandas가 설치되었다
**When** Python에서 import를 실행한다
**Then** import numpy가 성공한다
**And** import pandas가 성공한다

**Tasks / Subtasks:**

- [ ] Task 1: requirements.txt 수정
  - [ ] Subtask 1.1: numpy >= 1.24.0 추가
  - [ ] Subtask 1.2: pandas >= 2.0.0 추가
- [ ] Task 2: 라이브러리 설치
  - [ ] Subtask 2.1: pip install numpy pandas 실행
  - [ ] Subtask 2.2: numpy 버전 확인
  - [ ] Subtask 2.3: pandas 버전 확인
- [ ] Task 3: Import 테스트
  - [ ] Subtask 3.1: Python REPL에서 import numpy 테스트
  - [ ] Subtask 3.2: Python REPL에서 import pandas 테스트

**Dev Notes:**

**라이브러리 버전 선정 이유:**
- **numpy >= 1.24.0**: Python 3.11 지원, 성능 향상
- **pandas >= 2.0.0**: PyArrow backend 지원, 성능 향상, Apache Arrow 호환

**의존성:**
- Story 4-4의 선행 조건
- 개발 시간: 30분 예상

**파일 수정 목록:**
1. `gr8-backend/requirements.txt` - 수정 (numpy, pandas 추가)

**Dev Agent Record:**

**Agent Model Used:** Claude Sonnet 4.5

**Completion Notes List:**
- Story 4-4-deps-1 생성 완료 (2026-01-29)
- Story 4-4의 blocking gap 해결
- numpy, pandas 설치 후 Story 4-4 개발 가능

---

## 🎯 향후 개발 순서

1. **Story 4-4-deps-1** (P0 - Blocking)
   - numpy, pandas 설치
   - 예상 시간: 30분

2. **Story 4-3** (P1 - 권장)
   - 전략 실행 엔진 구현
   - self.trades, self.equity_curve 생성
   - 예상 시간: 4-6시간

3. **Story 4-4** (P1 - 권장)
   - MetricsCalculator 실제 구현
   - Story 4-3의 결과 활용
   - 예상 시간: 2-3시간

**또는:**

1. **Story 4-4-deps-1** (P0 - Blocking)
   - numpy, pandas 설치
   - 예상 시간: 30분

2. **Story 4-4** (P1 - 독립 개발 가능)
   - MetricsCalculator 실제 구현
   - Mock 데이터로 단위 테스트
   - 예상 시간: 2-3시간

3. **Story 4-3** (P1)
   - 전략 실행 엔진 구현
   - Story 4-4의 MetricsCalculator 활용
   - 예상 시간: 4-6시간
