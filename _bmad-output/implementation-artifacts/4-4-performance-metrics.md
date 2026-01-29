# Story 4.4: 성과 지표 계산 (ROI, MDD, 승률 등)

Status: ready-for-dev

---

## Story

**As a** 백테스팅 엔진 (Backtest Engine),
**I want** 백테스트 결과에 대해 다양한 성과 지표(ROI, MDD, 승률, 손익비, 샤프 비율 등)를 계산하고 싶다,
**so that** 사용자가 전략의 수익성과 리스크를 정량적으로 평가할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1.2에서 백엔드 스타터 템플릿 완료 ✅ (FastAPI, PostgreSQL, Alembic)
- Story 4.1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (MetricsCalculator 인터페이스 정의)
- Story 4.3에서 전략 실행 엔진 구현 예정 ✅ (BacktestEngine.run() → self.trades, self.equity_curve 생성)
- Story 4.2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블, ccxt 기반)

**문제:**
- 백테스트 결과에 대한 성과 지표 계산 로직이 없음
- ROI, MDD, 승률, 손익비, 샤프 비율 등 핵심 지표가 미구현 상태
- Story 4.3의 BacktestEngine.run()이 MetricsCalculator.calculate_all_metrics()를 호출하지 못함
- 사용자가 전략의 수익성과 리스크를 평가할 수 없음

**해결:**
Story 4.1에서 정의한 MetricsCalculator 인터페이스 실제 구현

**중요:**
- **Story 4.1의 MetricsCalculator 인터페이스 구현**: calculate_all_metrics(), calculate_roi(), calculate_mdd(), calculate_win_rate(), calculate_sharpe_ratio()
- **Story 4.3의 BacktestEngine.run()에서 호출**: BacktestEngine이 MetricsCalculator를 조합하여 성과 지표 계산
- **FR21 커버**: 7개 성과 지표 자동 계산 (ROI, MDD, 승률, 손익비, 샤프 비율, 총 거래 횟수, 평균 보유 기간)
- **NFR18 준수**: 계산 오차 범위 ±0.1% 이내 보장

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 성과 지표 자동 계산 (FR21)

**Given** 백테스트가 완료되었다
**When** 결과가 계산된다
**Then** FR21: 다음 성과 지표가 자동으로 계산된다:
  - ROI (총 수익률): (최종 자본 - 초기 자본) / 초기 자본 × 100%
  - MDD (최대 낙폭): 최고점에서 최저점까지의 최대 손실률
  - 승률: 수익성 거래 / 전체 거래 × 100%
  - 손익비 (Profit Factor): 평균 수익 / 평균 손실
  - 샤프 비율: (수익률 - 무위험 이자율) / 수익률 표준편차
  - 총 거래 횟수
  - 평균 보유 기간

**기술 구현:**
```python
# app/backtest/metrics.py (Story 4.1에서 스켈레톤 생성됨)
from typing import Dict, Any, List
import pandas as pd
import numpy as np

class MetricsCalculator:
    def calculate_all_metrics(
        self,
        trades: List[Dict[str, Any]],
        initial_capital: float,
        equity_curve: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        모든 성과 지표 계산

        Args:
            trades: 거래 내역 (Story 4.3의 BacktestEngine.trades)
                [{"timestamp": ..., "type": "BUY/SELL", "price": ..., "quantity": ..., "commission": ..., "slippage": ..., "node_id": ...}]
            initial_capital: 초기 자본 (Story 4.3의 BacktestEngine.initial_capital)
            equity_curve: 자본 곡선 (Story 4.3의 BacktestEngine.equity_curve)
                [{"timestamp": ..., "value": ...}, ...]

        Returns:
            성과 지표 딕셔너리:
                {
                    "roi": float,              # 총 수익률 (%)
                    "mdd": float,              # 최대 낙폭 (%)
                    "win_rate": float,         # 승률 (%)
                    "profit_factor": float,    # 손익비
                    "sharpe_ratio": float,     # 샤프 비율
                    "total_trades": int,       # 총 거래 횟수
                    "final_capital": float,    # 최종 자본
                    "avg_holding_period": float # 평균 보유 기간 (초)
                }
        """
        # 1. ROI 계산
        roi = self.calculate_roi(trades, initial_capital)

        # 2. MDD 계산
        mdd = self.calculate_mdd(equity_curve)

        # 3. 승률 계산
        win_rate = self.calculate_win_rate(trades)

        # 4. 손익비 계산
        profit_factor = self.calculate_profit_factor(trades)

        # 5. 샤프 비율 계산
        sharpe_ratio = self.calculate_sharpe_ratio(equity_curve)

        # 6. 총 거래 횟수
        total_trades = len(trades)

        # 7. 최종 자본
        final_capital = equity_curve[-1]["value"] if equity_curve else initial_capital

        # 8. 평균 보유 기간
        avg_holding_period = self.calculate_avg_holding_period(trades)

        return {
            "roi": roi,
            "mdd": mdd,
            "win_rate": win_rate,
            "profit_factor": profit_factor,
            "sharpe_ratio": sharpe_ratio,
            "total_trades": total_trades,
            "final_capital": final_capital,
            "avg_holding_period": avg_holding_period
        }
```

### AC 2: ROI (총 수익률) 계산

**Given** 거래 내역과 초기 자본이 있다
**When** ROI가 계산된다
**Then** 다음 공식이 사용된다: (최종 자본 - 초기 자본) / 초기 자본 × 100%
**And** NFR18: 계산 오차 범위 ±0.1% 이내가 보장된다
**And** 소수점 2자리까지 반올림된다

**기술 구현:**
```python
def calculate_roi(self, trades: List[Dict[str, Any]], initial_capital: float) -> float:
    """
    ROI (총 수익률) 계산

    공식: (최종 자본 - 초기 자본) / 초기 자본 × 100%

    Args:
        trades: 거래 내역
        initial_capital: 초기 자본

    Returns:
        ROI (%)

    계산 방법:
    1. 모든 매수/매도 쌍을 매칭하여 profit 계산
    2. 최종 자본 = initial_capital + sum(profit) - sum(commission) - sum(slippage)
    3. ROI = (final_capital - initial_capital) / initial_capital * 100

    NFR18: 계산 오차 범위 ±0.1% 이내
    """
    # 최종 자본 계산
    final_capital = initial_capital

    # 매수/매도 쌍 매칭
    buys = {}
    sells = []

    for trade in trades:
        if trade["type"] == "BUY":
            if trade["node_id"] not in buys:
                buys[trade["node_id"]] = []
            buys[trade["node_id"]].append(trade)
        else:  # SELL
            sells.append(trade)

    # 매수/매도 쌍 profit 계산
    for sell in sells:
        node_id = sell["node_id"]
        if node_id in buys and buys[node_id]:
            buy = buys[node_id].pop(0)

            # Profit 계산
            buy_cost = buy["quantity"] * buy["price"] + buy.get("commission", 0) + buy.get("slippage", 0)
            sell_revenue = sell["quantity"] * sell["price"] - sell.get("commission", 0) - sell.get("slippage", 0)
            profit = sell_revenue - buy_cost

            final_capital += profit

    # ROI 계산
    roi = (final_capital - initial_capital) / initial_capital * 100

    # 소수점 2자리 반올림
    return round(roi, 2)
```

### AC 3: MDD (최대 낙폭) 계산

**Given** 자본 곡선이 있다
**When** MDD가 계산된다
**Then** 최대 낙폭이 퍼센트로 계산된다
**And** 최고점에서 최저점까지의 최대 손실률이 측정된다
**And** MDD가 발생한 기간도 함께 반환된다

**기술 구현:**
```python
def calculate_mdd(self, equity_curve: List[Dict[str, Any]]) -> float:
    """
    MDD (Maximum Drawdown, 최대 낙폭) 계산

    공식: (최고점 - 최저점) / 최고점 × 100%

    Args:
        equity_curve: 자본 곡선 [{"timestamp": ..., "value": ...}, ...]

    Returns:
        MDD (%)

    계산 방법:
    1. 자본 곡선의 각 시점마다 최고점(peak) 추적
    2. Drawdown = (peak - current_value) / peak × 100
    3. 최대 Drawdown이 MDD

    예시:
    - 자본 곡선: [10000, 12000, 11000, 13000, 9000, 11500]
    - peak: [10000, 12000, 12000, 13000, 13000, 13000]
    - drawdown: [0, 0, 8.33%, 0, 30.77%, 11.54%]
    - MDD = 30.77%
    """
    if not equity_curve:
        return 0.0

    values = [point["value"] for point in equity_curve]

    # 최고점(peak) 추적
    peak = values[0]
    max_drawdown = 0.0

    for value in values:
        # 새로운 최고점 갱신
        if value > peak:
            peak = value

        # Drawdown 계산
        drawdown = (peak - value) / peak * 100

        # 최대 Drawdown 갱신
        if drawdown > max_drawdown:
            max_drawdown = drawdown

    # 소수점 2자리 반올림
    return round(max_drawdown, 2)
```

### AC 4: 승률 및 손익비 계산

**Given** 거래 내역이 있다
**When** 승률이 계산된다
**Then** 수익성 거래 / 전체 거래 × 100%로 계산된다

**Given** 거래 내역이 있다
**When** 손익비가 계산된다
**Then** 평균 수익 / 평균 손실로 계산된다
**And** 손실이 없는 경우 무한대(∞)로 반환된다

**기술 구현:**
```python
def calculate_win_rate(self, trades: List[Dict[str, Any]]) -> float:
    """
    승률 계산

    공식: 수익성 거래 / 전체 거래 × 100%

    Args:
        trades: 거래 내역

    Returns:
        승률 (%)

    계산 방법:
    1. 매수/매도 쌍을 매칭하여 profit 계산
    2. profit > 0인 거래를 수익성 거래로 분류
    3. win_rate = (수익성 거래 / 전체 거래) × 100
    """
    if not trades:
        return 0.0

    # 매수/매도 쌍 매칭 및 profit 계산
    profits = self._calculate_trade_profits(trades)

    # 수익성 거래 수
    winning_trades = [p for p in profits if p > 0]

    # 승률 계산
    win_rate = len(winning_trades) / len(profits) * 100 if profits else 0.0

    # 소수점 2자리 반올림
    return round(win_rate, 2)

def calculate_profit_factor(self, trades: List[Dict[str, Any]]) -> float:
    """
    손익비 (Profit Factor) 계산

    공식: 평균 수익 / 평균 손실 (절대값)

    Args:
        trades: 거래 내역

    Returns:
        손익비 (손실이 없는 경우 ∞)

    계산 방법:
    1. 매수/매도 쌍을 매칭하여 profit 계산
    2. winning_trades: profit > 0
    3. losing_trades: profit < 0
    4. profit_factor = abs(avg_win / avg_loss)
    5. losing_trades가 없으면 ∞ 반환
    """
    # 매수/매도 쌍 매칭 및 profit 계산
    profits = self._calculate_trade_profits(trades)

    # 수익성/손실 거래 분리
    winning_trades = [p for p in profits if p > 0]
    losing_trades = [p for p in profits if p < 0]

    # 손실이 없는 경우
    if not losing_trades:
        return float('inf')

    # 평균 수익/손실 계산
    avg_win = np.mean(winning_trades) if winning_trades else 0
    avg_loss = np.mean(losing_trades)  # 이미 음수

    # 손익비 계산
    profit_factor = abs(avg_win / avg_loss) if avg_loss != 0 else float('inf')

    # 소수점 2자리 반올림
    return round(profit_factor, 2)

def _calculate_trade_profits(self, trades: List[Dict[str, Any]]) -> List[float]:
    """
    거래 쌍 매칭 및 profit 계산 (내부 헬퍼 메서드)

    Args:
        trades: 거래 내역

    Returns:
        profit 리스트 [profit1, profit2, ...]
    """
    # 매수/매도 쌍 매칭
    buys = {}  # {node_id: [buy_trades]}
    profits = []

    for trade in trades:
        if trade["type"] == "BUY":
            if trade["node_id"] not in buys:
                buys[trade["node_id"]] = []
            buys[trade["node_id"]].append(trade)
        else:  # SELL
            node_id = trade["node_id"]
            if node_id in buys and buys[node_id]:
                buy = buys[node_id].pop(0)

                # Profit 계산
                buy_cost = buy["quantity"] * buy["price"] + buy.get("commission", 0) + buy.get("slippage", 0)
                sell_revenue = trade["quantity"] * trade["price"] - trade.get("commission", 0) - trade.get("slippage", 0)
                profit = sell_revenue - buy_cost

                profits.append(profit)

    return profits
```

### AC 5: 샤프 비율 계산

**Given** 자본 곡선이 있다
**When** 샤프 비율이 계산된다
**Then** 다음 공식이 사용된다: (수익률 - 무위험 이자율) / 수익률 표준편차
**And** 무위험 이자율은 연 3%로 가정한다
**And** 연율화된 샤프 비율이 반환된다

**기술 구현:**
```python
def calculate_sharpe_ratio(self, equity_curve: List[Dict[str, Any]]) -> float:
    """
    샤프 비율 계산

    공식: (수익률 - 무위험 이자율) / 수익률 표준편차

    Args:
        equity_curve: 자본 곡선 [{"timestamp": ..., "value": ...}, ...]

    Returns:
        샤프 비율 (연율화)

    계산 방법:
    1. 수익률 계산: (value[t] - value[t-1]) / value[t-1]
    2. 평균 수익률 계산
    3. 수익률 표준편차 계산
    4. 무위험 이자율: 연 3% → 일별 변환 필요
    5. 샤프 비율 = (avg_return - risk_free_rate) / std_return
    6. 연율화: sqrt(252) 곱하기 (주식 시장 기준, 252 거래일)

    참고:
    - 샤프 비율이 높을수록 위험 대비 수익이 좋음
    - 샤프 비율 > 1: 좋은 전략
    - 샤프 비율 > 2: 우수한 전략
    - 샤프 비율 > 3: 탁월한 전략
    """
    if len(equity_curve) < 2:
        return 0.0

    values = [point["value"] for point in equity_curve]

    # 수익률 계산
    returns = []
    for i in range(1, len(values)):
        ret = (values[i] - values[i-1]) / values[i-1]
        returns.append(ret)

    if not returns:
        return 0.0

    # 평균 수익률 및 표준편차
    avg_return = np.mean(returns)
    std_return = np.std(returns)

    if std_return == 0:
        return 0.0

    # 무위험 이자율 (연 3% → 일별 변환)
    # 일별 무위험 이자율 = (1 + 0.03)^(1/252) - 1 ≈ 0.000116
    risk_free_rate_daily = (1 + 0.03) ** (1/252) - 1

    # 샤프 비율 계산
    sharpe_ratio = (avg_return - risk_free_rate_daily) / std_return

    # 연율화
    sharpe_ratio_annualized = sharpe_ratio * np.sqrt(252)

    # 소수점 2자리 반올림
    return round(sharpe_ratio_annualized, 2)
```

### AC 6: 평균 보유 기간 계산

**Given** 거래 내역이 있다
**When** 평균 보유 기간이 계산된다
**Then** 매수부터 매도까지의 평균 시간이 초 단위로 반환된다

**기술 구현:**
```python
def calculate_avg_holding_period(self, trades: List[Dict[str, Any]]) -> float:
    """
    평균 보유 기간 계산

    Args:
        trades: 거래 내역

    Returns:
        평균 보유 기간 (초)

    계산 방법:
    1. 매수/매도 쌍 매칭
    2. 각 쌍의 보유 기간 = sell_timestamp - buy_timestamp
    3. 평균 보유 기간 = sum(보유 기간) / 쌍의 수
    """
    # 매수/매도 쌍 매칭
    buys = {}  # {node_id: [buy_trades]}
    holding_periods = []

    for trade in trades:
        if trade["type"] == "BUY":
            if trade["node_id"] not in buys:
                buys[trade["node_id"]] = []
            buys[trade["node_id"]].append(trade)
        else:  # SELL
            node_id = trade["node_id"]
            if node_id in buys and buys[node_id]:
                buy = buys[node_id].pop(0)

                # 보유 기간 계산 (밀리초 → 초)
                holding_period = (trade["timestamp"] - buy["timestamp"]) / 1000
                holding_periods.append(holding_period)

    if not holding_periods:
        return 0.0

    # 평균 보유 기간
    avg_holding_period = np.mean(holding_periods)

    # 소수점 2자리 반올림
    return round(avg_holding_period, 2)
```

### AC 7: BacktestEngine과의 통합

**Given** MetricsCalculator가 구현되었다
**When** BacktestEngine.run()이 실행된다
**Then** MetricsCalculator.calculate_all_metrics()가 호출된다
**And** 계산된 성과 지표가 반환된다

**기술 구현:**
```python
# app/backtest/engine.py (Story 4.3에서 구현)
from .metrics import MetricsCalculator

class BacktestEngine:
    def __init__(self, db: AsyncSession, strategy_json: Dict[str, Any], config: Dict[str, Any]):
        # ... (기존 코드)
        self.metrics_calculator = MetricsCalculator()

    async def run(self) -> Dict[str, Any]:
        """
        백테스트 실행

        실행 흐름:
        1. DataFetcher.fetch_data()로 시장 데이터 로드
        2. StrategyExecutor.parse_strategy()로 전략 파싱
        3. For each candle:
           a. StrategyExecutor.execute_on_candle()
           b. 액션 발생 시 _handle_buy/sell_action()
           c. 포지션 업데이트, 거래 기록
           d. _update_equity_curve()
        4. MetricsCalculator.calculate_all_metrics() ← Story 4.4에서 구현
        5. BacktestStorage.save_result()
        """
        # ... (캔들 순회 실행)

        # 성과 지표 계산 (Story 4.4)
        metrics = self.metrics_calculator.calculate_all_metrics(
            trades=self.trades,
            initial_capital=self.initial_capital,
            equity_curve=self.equity_curve
        )

        return {
            "backtest_id": backtest_id,
            "metrics": metrics,  # Story 4.4의 MetricsCalculator 결과
            "trades": self.trades,
            "equity_curve": self.equity_curve
        }
```

---

## Tasks / Subtasks

### Task 1: MetricsCalculator 코어 구현 (AC: #1, #7)
- [ ] Subtask 1.1: `calculate_all_metrics()` 메서드 구현 (7개 지표 계산)
- [ ] Subtask 1.2: BacktestEngine과의 통합 (MetricsCalculator 인스턴스화 및 호출)
- [ ] Subtask 1.3: 반환 값 딕셔너리 구조 정의

### Task 2: ROI 계산 구현 (AC: #2)
- [ ] Subtask 2.1: `calculate_roi()` 메서드 구현
- [ ] Subtask 2.2: 매수/매도 쌍 매칭 로직 구현
- [ ] Subtask 2.3: profit 계산 (수수료, 슬리피지 반영)
- [ ] Subtask 2.4: ROI 공식 적용 및 소수점 2자리 반올림
- [ ] Subtask 2.5: NFR18 검증 (오차 범위 ±0.1% 이내)

### Task 3: MDD 계산 구현 (AC: #3)
- [ ] Subtask 3.1: `calculate_mdd()` 메서드 구현
- [ ] Subtask 3.2: 최고점(peak) 추적 로직 구현
- [ ] Subtask 3.3: Drawdown 계산 로직 구현
- [ ] Subtask 3.4: 최대 Drawdown 찾기
- [ ] Subtask 3.5: 소수점 2자리 반올림

### Task 4: 승률 및 손익비 계산 구현 (AC: #4)
- [ ] Subtask 4.1: `_calculate_trade_profits()` 헬퍼 메서드 구현
- [ ] Subtask 4.2: `calculate_win_rate()` 메서드 구현
- [ ] Subtask 4.3: `calculate_profit_factor()` 메서드 구현
- [ ] Subtask 4.4: 수익성/손실 거래 분리 로직 구현
- [ ] Subtask 4.5: 손실이 없는 경우 ∞ 처리

### Task 5: 샤프 비율 계산 구현 (AC: #5)
- [ ] Subtask 5.1: `calculate_sharpe_ratio()` 메서드 구현
- [ ] Subtask 5.2: 수익률 계산 (일별 수익률)
- [ ] Subtask 5.3: 평균 수익률 및 표준편차 계산 (numpy 활용)
- [ ] Subtask 5.4: 무위험 이자율 적용 (연 3% → 일별 변환)
- [ ] Subtask 5.5: 연율화 (sqrt(252) 곱하기)

### Task 6: 평균 보유 기간 계산 구현 (AC: #6)
- [ ] Subtask 6.1: `calculate_avg_holding_period()` 메서드 구현
- [ ] Subtask 6.2: 매수/매도 쌍의 시간 차이 계산
- [ ] Subtask 6.3: 밀리초 → 초 변환
- [ ] Subtask 6.4: 평균 계산

### Task 7: 단위 테스트 작성
- [ ] Subtask 7.1: `tests/unit/test_metrics_calculator.py` 생성
- [ ] Subtask 7.2: ROI 계산 테스트 (정상 케이스, edge cases)
- [ ] Subtask 7.3: MDD 계산 테스트 (MDD 없음, 단일 MDD, 다중 MDD)
- [ ] Subtask 7.4: 승률 계산 테스트 (모두 승리, 모두 패배, 혼합)
- [ ] Subtask 7.5: 손익비 계산 테스트 (손실 없음, 일반적)
- [ ] Subtask 7.6: 샤프 비율 계산 테스트 (일정 수익, 변동성)
- [ ] Subtask 7.7: pytest 실행 및 커버리지 확인 (> 80%)

---

## Dev Notes

### 🎯 목표

이 Story는 **성과 지표 계산 로직을 실제 구현**합니다. 완료되면:
- **MetricsCalculator.calculate_all_metrics()**: 7개 성과 지표 자동 계산
- **FR21 만족**: ROI, MDD, 승률, 손익비, 샤프 비율, 총 거래 횟수, 평균 보유 기간
- **NFR18 준수**: 계산 오차 범위 ±0.1% 이내
- **Story 4.3의 BacktestEngine.run()에서 호출 가능**

### 📚 Story 4.1 (백테스팅 엔진 아키텍처)에서 배운 패턴

**MetricsCalculator 인터페이스** [Source: 4-1-backtest-engine-architecture.md line 390-470]:
```python
class MetricsCalculator:
    """
    성과 지표 계산 (Metrics Calculation Layer)

    역할:
    - 거래 내역 기반 성과 지표 계산
    - ROI, MDD, 승률, 손익비, 샤프 비율 등

    의존성:
    - pandas, numpy

    Story 4.4에서 구현 예정
    """

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
        """
        ROI 계산: (최종 자본 - 초기 자본) / 초기 자본 × 100%

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_mdd(self, equity_curve: List[Dict]) -> float:
        """
        MDD 계산: 최대 낙폭

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_win_rate(self, trades: List[Dict]) -> float:
        """
        승률 계산: 수익성 거래 / 전체 거래 × 100%

        Story 4.4에서 구현 예정
        """
        pass

    def calculate_sharpe_ratio(self, equity_curve: List[Dict]) -> float:
        """
        샤프 비율 계산: (수익률 - 무위험 이자율) / 수익률 표준편차

        Story 4.4에서 구현 예정
        """
        pass
```

### 📚 Story 4.3 (전략 실행 엔진)에서 배운 패턴

**BacktestEngine의 거래 기록 형식** [Source: 4-3-strategy-execution-engine.md]:
```python
# BacktestEngine의 거래 기록
self.trades = [
    {
        "timestamp": 1640995200000,  # Unix timestamp (milliseconds)
        "type": "BUY",                # "BUY" or "SELL"
        "price": 50000.0,
        "quantity": 0.1,
        "commission": 5.0,            # 수수료
        "slippage": 2.5,              # 슬리피지
        "node_id": "action-1"         # 어떤 노드에서 발생했는지
    }
]

# 자본 곡선 형식
self.equity_curve = [
    {
        "timestamp": 1640995200000,
        "value": 10000.0  # 현재 총 자산 (현금 + 포지션 평가가)
    },
    {
        "timestamp": 1640998800000,
        "value": 10050.0
    }
]
```

### 🏗️ 핵심 구현 전략

**1. 매수/매도 쌍 매칭**
```python
# 매수/매도 쌍을 node_id로 매칭
buys = {}  # {node_id: [buy_trades]}
sells = []

for trade in trades:
    if trade["type"] == "BUY":
        if trade["node_id"] not in buys:
            buys[trade["node_id"]] = []
        buys[trade["node_id"]].append(trade)
    else:  # SELL
        sells.append(trade)

# 쌍 매칭 및 profit 계산
for sell in sells:
    node_id = sell["node_id"]
    if node_id in buys and buys[node_id]:
        buy = buys[node_id].pop(0)

        # Profit 계산
        buy_cost = buy["quantity"] * buy["price"] + buy["commission"] + buy["slippage"]
        sell_revenue = sell["quantity"] * sell["price"] - sell["commission"] - sell["slippage"]
        profit = sell_revenue - buy_cost
```

**2. MDD 계산 (Peak Tracking)**
```python
def calculate_mdd(self, equity_curve):
    values = [point["value"] for point in equity_curve]

    peak = values[0]
    max_drawdown = 0.0

    for value in values:
        # 새로운 최고점 갱신
        if value > peak:
            peak = value

        # Drawdown 계산
        drawdown = (peak - value) / peak * 100

        # 최대 Drawdown 갱신
        if drawdown > max_drawdown:
            max_drawdown = drawdown

    return round(max_drawdown, 2)
```

**3. 샤프 비율 계산 (연율화)**
```python
def calculate_sharpe_ratio(self, equity_curve):
    values = [point["value"] for point in equity_curve]

    # 수익률 계산
    returns = [(values[i] - values[i-1]) / values[i-1] for i in range(1, len(values))]

    # 평균 수익률 및 표준편차
    avg_return = np.mean(returns)
    std_return = np.std(returns)

    # 무위험 이자율 (연 3% → 일별)
    risk_free_rate_daily = (1 + 0.03) ** (1/252) - 1

    # 샤프 비율
    sharpe_ratio = (avg_return - risk_free_rate_daily) / std_return

    # 연율화
    sharpe_ratio_annualized = sharpe_ratio * np.sqrt(252)

    return round(sharpe_ratio_annualized, 2)
```

### 📊 성과 지표 해석

**ROI (Return on Investment):**
- ROI > 0: 수익성
- ROI < 0: 손실
- ROI = 10%: 초기 자본 대비 10% 수익

**MDD (Maximum Drawdown):**
- MDD < 10%: 낮은 리스크
- MDD 10-20%: 중간 리스크
- MDD > 20%: 높은 리스크

**승률 (Win Rate):**
- 승률 > 50%: 좋은 전략
- 승률 > 60%: 우수한 전략
- 승률 > 70%: 탁월한 전략

**손익비 (Profit Factor):**
- 손익비 > 1: 수익성
- 손익비 > 2: 우수한 전략
- 손익비 > 3: 탁월한 전략

**샤프 비율 (Sharpe Ratio):**
- 샤프 비율 > 1: 좋은 전략
- 샤프 비율 > 2: 우수한 전략
- 샤프 비율 > 3: 탁월한 전략

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1.2: 백엔드 스타터 템플릿 (FastAPI, PostgreSQL)
- ✅ Story 4.1: 백테스팅 엔진 아키텍처 설계 (MetricsCalculator 인터페이스 정의)
- ✅ Story 4.2: 과거 시장 데이터 수집 (market_data 테이블)
- ✅ Story 3.2: 노드 타입 정의 (전략 JSON 구조)

**선행 Stories:**
- ⚠️ Story 4.3: 전략 실행 엔진 구현 (BacktestEngine.run() → self.trades, self.equity_curve 생성)
  - Story 4.4는 Story 4.3과 독립적으로 개발 가능
  - 하지만 Story 4.3의 거래 기록 형식을 알아야 함
  - Mock 데이터로 단위 테스트 가능

**후속 Stories (이 Story의 결과 활용):**
- Story 4.6: 백테스트 결과 저장 (BacktestStorage.save_result()에 metrics 전달)
- Story 4.7: 백테스트 결과 시각화 UI (차트에 MDD 구간 하이라이트)
- Story 4.8: 백테스트 실행 및 파라미터 설정 UI (성과 지표 표시)

**파일 생성/수정 목록:**
1. `app/backtest/metrics.py` - ✅ 수정 (MetricsCalculator 실제 구현)
2. `tests/unit/test_metrics_calculator.py` - 🆕 새로 생성 (단위 테스트)

### ⚠️ 중요 고려사항

**1. 구현 범위:**
- ✅ MetricsCalculator.calculate_all_metrics() 실제 구현
- ✅ 7개 성과 지표 계산 로직 구현
- ✅ Story 4.3의 BacktestEngine과 통합
- ❌ BacktestStorage는 Story 4.6에서 구현
- ❌ 시각화는 Story 4.7에서 구현

**2. Story 4.1의 인터페이스 준수:**
- Story 4.1에서 정의한 메서드 시그니처 정확히 따름
- calculate_all_metrics(), calculate_roi(), calculate_mdd(), calculate_win_rate(), calculate_profit_factor(), calculate_sharpe_ratio(), calculate_avg_holding_period()

**3. Story 4.3의 거래 기록 형식 준수:**
- self.trades: [{"timestamp": ..., "type": "BUY/SELL", "price": ..., "quantity": ..., "commission": ..., "slippage": ..., "node_id": ...}]
- self.equity_curve: [{"timestamp": ..., "value": ...}, ...]

**4. NFR18 준수 (계산 오차 범위 ±0.1% 이내):**
- decimal.Decimal 사용 (고정 소수점 연산)
- 또는 float 사용 후 round(value, 2) 반올림
- 단위 테스트로 오차 범위 검증

**5. 에러 처리:**
- 빈 trades 리스트 처리
- 빈 equity_curve 처리
- 매수/매도 쌍이 맞지 않는 경우 처리
- 손실이 없는 경우 profit_factor = ∞ 처리

**6. 테스트:**
- 단위 테스트: MetricsCalculator의 모든 메서드
- Mock 사용: Story 4.3의 BacktestEngine 없이 독립 테스트 가능
- 커버리지 > 80% 목표
- Edge cases: 모든 거래가 승리, 모든 거래가 패배, MDD 없음, 일정 수익 등

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.4 요구사항 분석 (epics.md)
2. Story 4.1 아키텍처 문서 분석 (MetricsCalculator 인터페이스)
3. Story 4.3 전략 실행 엔진 문서 분석 (거래 기록 형식)
4. 7개 AC 정의 (성과 지표 자동 계산, ROI, MDD, 승률, 손익비, 샤프 비율, 평균 보유 기간, BacktestEngine 통합)
5. 7개 Task/39개 Subtask 정의
6. Dev Notes 작성 (성과 지표 해석, 구현 전략, 공식)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- MetricsCalculator.calculate_all_metrics(): 7개 성과 지표 자동 계산
- FR21 만족: ROI, MDD, 승률, 손익비, 샤프 비율, 총 거래 횟수, 평균 보유 기간
- NFR18 준수: 계산 오차 범위 ±0.1% 이내
- Story 4.3의 BacktestEngine.run()에서 호출 가능

📋 **다음 단계:**
- Story 4.4 개발 시작 (MetricsCalculator 실제 구현)
- Story 4.6: 결과 저장 (BacktestStorage.save_result()에 metrics 전달)
- Story 4.7: 결과 시각화 UI (성과 지표 카드/대시보드 표시)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-4-performance-metrics.md` - This story file

**Backend Files to Create/Modify (est. 2 files)**
- `app/backtest/metrics.py` - ✅ 수정 (MetricsCalculator 실제 구현: calculate_all_metrics, calculate_roi, calculate_mdd, calculate_win_rate, calculate_profit_factor, calculate_sharpe_ratio, calculate_avg_holding_period)
- `tests/unit/test_metrics_calculator.py` - 🆕 새로 생성 (단위 테스트: ROI, MDD, 승률, 손익비, 샤프 비율, 평균 보유 기간)

**Total:** 2 files to create/modify
