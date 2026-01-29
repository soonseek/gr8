# Story 4.5: 거래 내역 추적 (Trade Tracking)

Status: ready-for-dev

---

## Story

**As a** 백테스팅 엔진 (Backtest Engine),
**I want** 백테스팅 중 발생한 모든 매수/매도 거래의 상세 내역을 기록하고 추적하고 싶다,
**so that** 사용자가 어떤 결정이 내려졌는지 이해하고 거래 내역을 조회할 수 있다.

---

## 배경 (Context)

**현재 상황:**
- Story 1.2에서 백엔드 스타터 템플릿 완료 ✅ (FastAPI, PostgreSQL, Alembic)
- Story 4.1에서 백테스팅 엔진 아키텍처 설계 완료 ✅ (BacktestEngine 인터페이스 정의)
- Story 4.3에서 전략 실행 엔진 구현 예정 ✅ (BacktestEngine._handle_buy/sell_action())
- Story 4.2에서 과거 시장 데이터 수집 완료 ✅ (market_data 테이블)

**문제:**
- 백테스트 중 발생하는 거래 내역의 상세 추적 로직이 미구현 상태
- 매수/매도 거래에 대한 포지션 사이즈, PnL 계산이 없음
- 거래를 유발한 노드 ID 추적이 안 됨
- 당시의 시장 데이터 스냅샷 저장이 안 됨

**해결:**
Story 4.3의 BacktestEngine._handle_buy/sell_action()에서 거래 기록 로직 강화

**중요:**
- **Story 4.3의 BacktestEngine 거래 기록 확장**: self.trades에 더 많은 정보 포함 (포지션 사이즈, PnL, 노드 ID, 시장 데이터 스냅샷)
- **FR22 커버**: 모든 거래 기록, 시간 순서대로 표시, 수익/손실 색상 구분
- **backtest_trades 테이블**: Story 4.6에서 생성 예정 (현재는 메모리 상 self.trades만 관리)

---

## 수용 기준 (Acceptance Criteria)

### AC 1: 매수 거래 기록 강화 (FR22)

**Given** 백테스트가 실행된다
**When** 매수 액션이 발생한다
**Then** FR22: 모든 거래가 기록된다
**And** 각 거래에 다음 정보가 저장된다:
  - 타임스탬프 (밀리초)
  - 거래 유형 (BUY)
  - 가격
  - 수량
  - 수수료 (commission)
  - 슬리피지 (slippage)
  - 포지션 사이즈 (position_size) 🆕
  - 노드 ID (어떤 조건으로 실행되었는지) 🆕
  - 시장 데이터 스냅샷 (market_data) 🆕

**기술 구현:**
```python
# app/backtest/engine.py (Story 4.3에서 이미 스켈레톤 존재)
def _handle_buy_action(self, action: Dict[str, Any], candle: Dict[str, Any]) -> None:
    """
    매수 액션 처리 (Story 4.5에서 확장)

    기존 (Story 4.3):
    - 수수료 계산 (0.1%)
    - 슬리피지 적용 (0.05%)
    - 포지션 업데이트
    - 거래 기록

    추가 (Story 4.5):
    - 포지션 사이즈 계산
    - PnL 초기값 (0) - 매수는 PnL이 없음
    - 노드 ID 기록
    - 시장 데이터 스냅샷 저장

    Args:
        action: {"type": "buy", "amount": 0.1, "price": 50000, "node_id": "action-1"}
        candle: 현재 캔들 데이터 {"timestamp": ..., "open": ..., "high": ..., "low": ..., "close": ..., "volume": ...}
    """
    commission = action["amount"] * action["price"] * self.config["commission"]
    slippage = action["price"] * self.config["slippage"]
    total_cost = action["amount"] * action["price"] + commission + slippage

    if total_cost > self.current_capital:
        raise ValueError("Insufficient capital")

    # 포지션 업데이트 (기존 로직)
    symbol = self.config["symbol"]
    if symbol not in self.position:
        self.position[symbol] = {"quantity": 0, "avg_price": 0}

    old_quantity = self.position[symbol]["quantity"]
    old_avg_price = self.position[symbol]["avg_price"]

    # 평균 단가 재계산
    new_quantity = old_quantity + action["amount"]
    new_avg_price = ((old_quantity * old_avg_price) + (action["amount"] * action["price"])) / new_quantity

    self.position[symbol] = {"quantity": new_quantity, "avg_price": new_avg_price}
    self.current_capital -= total_cost

    # 포지션 사이즈 계산 (Story 4.5 추가)
    position_size = total_cost  # 총 투자 금액

    # 거래 기록 (Story 4.5 확장)
    self.trades.append({
        "timestamp": action.get("timestamp", candle["timestamp"]),  # 액션 또는 캔들 타임스탬프
        "type": "BUY",
        "price": action["price"],
        "quantity": action["amount"],
        "commission": commission,
        "slippage": slippage,
        "position_size": position_size,  # 🆕 Story 4.5 추가
        "pnl": 0.0,  # 🆕 매수는 PnL이 0
        "node_id": action.get("node_id", ""),  # 🆕 Story 4.5 추가
        "market_data": {  # 🆕 Story 4.5 추가 - 시장 데이터 스냅샷
            "timestamp": candle["timestamp"],
            "open": candle["open"],
            "high": candle["high"],
            "low": candle["low"],
            "close": candle["close"],
            "volume": candle["volume"]
        }
    })
```

### AC 2: 매도 거래 기록 강화 (FR22)

**Given** 백테스트가 실행된다
**When** 매도 액션이 발생한다
**Then** FR22: 모든 거래가 기록된다
**And** 각 거래에 PnL(실현 손익)이 계산된다 🆕
**And** PnL이 수수료와 슬리피지를 반영한다

**기술 구현:**
```python
def _handle_sell_action(self, action: Dict[str, Any], candle: Dict[str, Any]) -> None:
    """
    매도 액션 처리 (Story 4.5에서 확장)

    추가 (Story 4.5):
    - PnL 계산 (실현 손익)
    - 포지션 종료
    - 노드 ID 기록
    - 시장 데이터 스냅샷 저장
    """
    symbol = self.config["symbol"]

    if symbol not in self.position or self.position[symbol]["quantity"] <= 0:
        raise ValueError(f"No position to sell for {symbol}")

    # 현재 포지션
    current_position = self.position[symbol]
    quantity = current_position["quantity"]
    avg_price = current_position["avg_price"]

    # 수수료 및 슬리피지
    commission = action["price"] * quantity * self.config["commission"]
    slippage = action["price"] * self.config["slippage"]

    # 매도 수익
    sell_revenue = (action["price"] * quantity) - commission - slippage

    # 매수 비용 (평균 단가 기반)
    buy_cost = avg_price * quantity

    # PnL 계산 (Story 4.5 추가)
    pnl = sell_revenue - buy_cost

    # 현금 업데이트
    self.current_capital += sell_revenue

    # 포지션 종료
    del self.position[symbol]

    # 포지션 사이즈
    position_size = buy_cost  # 원래 투자 금액

    # 거래 기록 (Story 4.5 확장)
    self.trades.append({
        "timestamp": action.get("timestamp", candle["timestamp"]),
        "type": "SELL",
        "price": action["price"],
        "quantity": quantity,
        "commission": commission,
        "slippage": slippage,
        "position_size": position_size,  # 🆕 Story 4.5 추가
        "pnl": pnl,  # 🆕 Story 4.5 추가 - 실현 손익
        "node_id": action.get("node_id", ""),  # 🆕 Story 4.5 추가
        "market_data": {  # 🆕 Story 4.5 추가 - 시장 데이터 스냅샷
            "timestamp": candle["timestamp"],
            "open": candle["open"],
            "high": candle["high"],
            "low": candle["low"],
            "close": candle["close"],
            "volume": candle["volume"]
        }
    })
```

### AC 3: 거래 내역 시간 순서 정렬 (FR22)

**Given** 백테스트가 완료되었다
**When** 사용자가 거래 내역을 조회한다
**Then** FR22: 모든 거래가 시간 순서대로 표시된다
**And** timestamp 기준 오름차순 정렬된다

**기술 구현:**
```python
# Story 4.3의 BacktestEngine.run() 메서드에서 이미 자동 정렬됨
# 캔들을 순차적으로 순회하므로 self.trades는 이미 시간 순서대로 저장됨

# 그러나 명시적으로 정렬 추가 (Story 4.5)
def get_trades_sorted(self) -> List[Dict[str, Any]]:
    """
    시간 순서대로 정렬된 거래 내역 반환

    Returns:
        timestamp 기준 오름차순 정렬된 거래 리스트
    """
    return sorted(self.trades, key=lambda t: t["timestamp"])
```

### AC 4: 수익/손실 색상 구분 (FR22)

**Given** 거래 내역이 있다
**When** 각 거래의 PnL을 확인한다
**Then** 수익(PnL > 0)은 초록색으로 표시된다
**And** 손실(PnL < 0)은 빨간색으로 표시된다

**기술 구현:**
```python
# 백엔드: PnL 계산은 AC 2에서 완료

# 프론트엔드 (Story 4.7 또는 Story 4.8에서 구현 예정):
# {
#   "pnl": 150.5,
#   "pnl_color": "green"  // 또는 CSS 클래스로 분리
# }
```

**백엔드에서 제공할 데이터:**
```python
def _format_trade_for_display(self, trade: Dict[str, Any]) -> Dict[str, Any]:
    """
    프론트엔드 표시용 거래 데이터 포맷

    Args:
        trade: 거래 데이터

    Returns:
        포맷된 거래 데이터 (pnl_color 포함)
    """
    pnl = trade.get("pnl", 0)

    return {
        **trade,
        "pnl_color": "green" if pnl > 0 else "red" if pnl < 0 else "gray"
    }
```

### AC 5: 노드 ID 추적 (거래를 유발한 노드 식별)

**Given** 거래가 발생했다
**When** 어떤 조건으로 실행되었는지 추적한다
**Then** 노드 ID가 기록된다 (예: "action-1", "condition-rsi-2")
**And** 해당 노드가 거래를 유발했음을 알 수 있다

**기술 구현:**
```python
# Story 4.3의 StrategyExecutor.execute_on_candle()에서 이미 node_id 전달

# 거래 기록 예시:
{
    "timestamp": 1640995200000,
    "type": "BUY",
    "price": 50000.0,
    "quantity": 0.1,
    "commission": 5.0,
    "slippage": 2.5,
    "position_size": 5002.5,
    "pnl": 0.0,
    "node_id": "action-buy-1",  # 🆕 Story 4.5 추가
    "market_data": {...}
}
```

### AC 6: 시장 데이터 스냅샷 저장

**Given** 거래가 발생했다
**When** 당시의 시장 상황을 확인한다
**Then** 해당 시점의 시장 데이터가 저장된다 (OHLCV)
**And** 나중에 거래 당시의 시장 상황을 복원할 수 있다

**기술 구현:**
```python
# AC 1, AC 2에서 이미 구현됨

# 시장 데이터 스냅샷 구조:
"market_data": {
    "timestamp": 1640995200000,
    "open": 49950.0,
    "high": 50100.0,
    "low": 49800.0,
    "close": 50000.0,
    "volume": 123.45
}
```

### AC 7: DB 스키마 준비 (Story 4.6 대비)

**Given** 거래 내역 추적이 구현되었다
**When** Story 4.6에서 DB에 저장한다
**Then** backtest_trades 테이블에 매핑된다
**And** 다음 컬럼이 있다:
  - id (SERIAL PRIMARY KEY)
  - backtest_id (INTEGER REFERENCES backtest_results(id))
  - timestamp (BIGINT)
  - trade_type (VARCHAR(10)) -- BUY/SELL
  - price (DECIMAL(20, 8))
  - quantity (DECIMAL(20, 8))
  - fee (DECIMAL(20, 8)) -- commission
  - position_size (DECIMAL(20, 8)) 🆕
  - pnl (DECIMAL(20, 8)) 🆕
  - node_id (VARCHAR(50)) 🆕
  - market_data (JSONB) 🆕

**참고:**
- Story 4.6에서 DB 스키마 생성 및 Alembic migration 작성
- Story 4.5는 메모리 상 self.trades만 관리 (DB 저장 아님)

---

## Tasks / Subtasks

### Task 1: 매수 거래 기록 강화 (AC: #1)
- [ ] Subtask 1.1: `_handle_buy_action()` 메서드에 position_size 계산 추가
- [ ] Subtask 1.2: `_handle_buy_action()` 메서드에 pnl 필드 추가 (값: 0)
- [ ] Subtask 1.3: `_handle_buy_action()` 메서드에 node_id 기록 추가
- [ ] Subtask 1.4: `_handle_buy_action()` 메서드에 market_data 스냅샷 추가
- [ ] Subtask 1.5: 매수 거래 기록 테스트

### Task 2: 매도 거래 기록 강화 (AC: #2)
- [ ] Subtask 2.1: `_handle_sell_action()` 메서드에 position_size 계산 추가
- [ ] Subtask 2.2: `_handle_sell_action()` 메서드에 pnl 계산 추가 (sell_revenue - buy_cost)
- [ ] Subtask 2.3: `_handle_sell_action()` 메서드에 node_id 기록 추가
- [ ] Subtask 2.4: `_handle_sell_action()` 메서드에 market_data 스냅샷 추가
- [ ] Subtask 2.5: 매도 거래 기록 테스트

### Task 3: 거래 내역 정렬 및 조회 (AC: #3)
- [ ] Subtask 3.1: `get_trades_sorted()` 메서드 구현
- [ ] Subtask 3.2: timestamp 기준 오름차순 정렬 로직 구현
- [ ] Subtask 3.3: 정렬된 거래 내역 반환 테스트

### Task 4: 수익/손실 색상 분류 (AC: #4)
- [ ] Subtask 4.1: `_format_trade_for_display()` 헬퍼 메서드 구현
- [ ] Subtask 4.2: pnl > 0 → "green", pnl < 0 → "red", pnl = 0 → "gray" 로직 구현
- [ ] Subtask 4.3: 색상 분류 테스트

### Task 5: 노드 ID 및 시장 데이터 추적 검증 (AC: #5, #6)
- [ ] Subtask 5.1: node_id가 모든 거래에 기록되는지 확인
- [ ] Subtask 5.2: market_data 스냅샷이 모든 거래에 저장되는지 확인
- [ ] Subtask 5.3: 시장 데이터 스냅샷 구조 검증 (OHLCV)

### Task 6: Story 4.6과의 호환성 확인 (AC: #7)
- [ ] Subtask 6.1: self.trades 구조가 backtest_trades 테이블 스키마와 매핑되는지 확인
- [ ] Subtask 6.2: Story 4.6을 위한 데이터 인터페이스 정의
- [ ] Subtask 6.3: DB 저장 시 JSONB 변환 로직 계획

### Task 7: 단위 테스트 작성
- [ ] Subtask 7.1: `tests/unit/test_trade_tracking.py` 생성
- [ ] Subtask 7.2: 매수 거래 기록 테스트 (position_size, pnl=0, node_id, market_data)
- [ ] Subtask 7.3: 매도 거래 기록 테스트 (position_size, pnl 계산, node_id, market_data)
- [ ] Subtask 7.4: PnL 계산 정확성 테스트 (수수료, 슬리피지 반영)
- [ ] Subtask 7.5: 정렬 및 색상 분류 테스트
- [ ] Subtask 7.6: pytest 실행 및 커버리지 확인 (> 80%)

---

## Dev Notes

### 🎯 목표

이 Story는 **백테스팅 중 발생하는 거래 내역의 상세 추적 로직을 강화**합니다. 완료되면:
- **self.trades 확장**: position_size, pnl, node_id, market_data 필드 추가
- **FR22 만족**: 모든 거래 기록, 시간 순서대로 표시, 수익/손실 색상 구분
- **Story 4.6 준비**: backtest_trades 테이블에 저장할 데이터 구조 확정

### 📚 Story 4.3 (전략 실행 엔진)에서 배운 패턴

**BacktestEngine의 거래 기록 (기존 구현)** [Source: 4-3-strategy-execution-engine.md]:
```python
# Story 4.3에서 이미 구현된 기본 거래 기록
self.trades.append({
    "timestamp": action["timestamp"],
    "type": "BUY",
    "price": action["price"],
    "quantity": action["amount"],
    "commission": commission,
    "slippage": slippage,
    "node_id": action["node_id"]
})
```

**Story 4.5에서 확장할 필드:**
- `position_size` 🆕: 포지션 사이즈 (총 투자 금액)
- `pnl` 🆕: 실현 손익 (매도만, 매수는 0)
- `market_data` 🆕: 시장 데이터 스냅샷 (OHLCV)

### 🏗️ 핵심 구현 전략

**1. 포지션 사이즈 계산**
```python
# 매수: 총 투자 금액
position_size = (quantity * price) + commission + slippage

# 매도: 원래 투자 금액 (평균 단가 * 수량)
position_size = avg_price * quantity
```

**2. PnL 계산**
```python
# 매도 시 PnL 계산
buy_cost = avg_price * quantity  # 평균 단가 * 수량
sell_revenue = (price * quantity) - commission - slippage
pnl = sell_revenue - buy_cost
```

**3. 노드 ID 추적**
```python
# StrategyExecutor.execute_on_candle()에서 반환된 액션
action = {
    "type": "buy",
    "amount": 0.1,
    "price": 50000,
    "node_id": "action-buy-1"  # 🆕 이미 Story 4.3에서 전달됨
}
```

**4. 시장 데이터 스냅샷**
```python
# 현재 캔들 데이터를 그대로 저장
market_data = {
    "timestamp": candle["timestamp"],
    "open": candle["open"],
    "high": candle["high"],
    "low": candle["low"],
    "close": candle["close"],
    "volume": candle["volume"]
}
```

### 🔗 Story 4.6 (백테스트 결과 저장)과의 연관성

**Story 4.6에서 생성할 backtest_trades 테이블:**
```sql
CREATE TABLE backtest_trades (
  id SERIAL PRIMARY KEY,
  backtest_id INTEGER REFERENCES backtest_results(id),
  timestamp BIGINT,
  trade_type VARCHAR(10),  -- BUY/SELL
  price DECIMAL(20, 8),
  quantity DECIMAL(20, 8),
  fee DECIMAL(20, 8),  -- commission
  position_size DECIMAL(20, 8),  -- 🆕 Story 4.5 추가
  pnl DECIMAL(20, 8),  -- 🆕 Story 4.5 추가
  node_id VARCHAR(50),  -- 🆕 Story 4.5 추가
  market_data JSONB  -- 🆕 Story 4.5 추가
);
CREATE INDEX idx_backtest_trades_query ON backtest_trades(backtest_id, timestamp);
```

**Story 4.5 → Story 4.6 데이터 흐름:**
```
Story 4.5:
  self.trades = [
    {
      "timestamp": ...,
      "type": "BUY",
      "price": ...,
      "quantity": ...,
      "commission": ...,
      "slippage": ...,
      "position_size": ...,  # 🆕
      "pnl": ...,  # 🆕
      "node_id": ...,  # 🆕
      "market_data": {...}  # 🆕
    }
  ]

Story 4.6:
  BacktestStorage.save_result()
    → self.trades를 backtest_trades 테이블에 저장
    → market_data는 JSONB로 저장
```

### ⚠️ 중요 고려사항

**1. 구현 범위:**
- ✅ self.trades 확장 (position_size, pnl, node_id, market_data)
- ✅ _handle_buy/sell_action() 메서드 수정
- ✅ PnL 계산 로직 구현
- ❌ DB 저장 안 함 (Story 4.6에서 구현)
- ❌ 프론트엔드 표시 안 함 (Story 4.7 또는 Story 4.8에서 구현)

**2. Story 4.3과의 통합:**
- Story 4.3의 BacktestEngine._handle_buy/sell_action() 메서드 수정
- 기존 필드 유지 (timestamp, type, price, quantity, commission, slippage, node_id)
- 새로운 필드 추가 (position_size, pnl, market_data)

**3. PnL 계산 정확성:**
- 수수료와 슬리피지를 모두 반영
- 평균 단가 기반 계산 (FIFO 또는 평균 단가)
- 매수는 PnL = 0 (실현되지 않음)
- 매도는 PnL = sell_revenue - buy_cost

**4. 시장 데이터 스냅샷:**
- 현재 캔들의 OHLCV 데이터를 그대로 저장
- JSON 타입 (Python dict)
- Story 4.6에서 JSONB로 DB에 저장

**5. 노드 ID 추적:**
- StrategyExecutor.execute_on_candle()에서 이미 node_id 전달됨
- action 딕셔너리의 node_id 필드 사용
- 어떤 노드가 거래를 유발했는지 추적 가능

**6. 테스트:**
- 단위 테스트: BacktestEngine의 거래 기록 로직
- Mock 사용: StrategyExecutor, 캔들 데이터
- 커버리지 > 80% 목표
- PnL 계산 정확성 검증 (소수점 2자리)

### 🔗 의존성 및 후속 작업

**의존 Stories:**
- ✅ Story 1.2: 백엔드 스타터 템플릿 (FastAPI, PostgreSQL)
- ✅ Story 4.1: 백테스팅 엔진 아키텍처 설계 (BacktestEngine 인터페이스)
- ✅ Story 4.2: 과거 시장 데이터 수집 (market_data 테이블)
- ✅ Story 3.2: 노드 타입 정의 (NodeType enum)

**선행 Stories:**
- ⚠️ Story 4.3: 전략 실행 엔진 구현 (BacktestEngine._handle_buy/sell_action() 기존 구현)
  - Story 4.5는 Story 4.3의 메서드를 확장
  - Story 4.3이 먼저 개발되어야 함을 권장

**후속 Stories (이 Story의 결과 활용):**
- Story 4.6: 백테스트 결과 저장 (self.trades를 backtest_trades 테이블에 저장)
- Story 4.7: 백테스트 결과 시각화 UI (거래 내역 표시, 수익/손실 색상 구분)
- Story 4.8: 백테스트 실행 및 파라미터 설정 UI (거래 내역 조회, 페이지네이션)

**파일 생성/수정 목록:**
1. `app/backtest/engine.py` - ✅ 수정 (_handle_buy/sell_action() 메서드 확장, get_trades_sorted(), _format_trade_for_display() 추가)
2. `tests/unit/test_trade_tracking.py` - 🆕 새로 생성 (단위 테스트)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

None

### Completion Notes List

**Story 생성 완료 (2026-01-29):**

✅ **완료된 작업:**
1. Epic 4 및 Story 4.5 요구사항 분석 (epics.md)
2. Story 4.3 전략 실행 엔진 문서 분석 (기존 거래 기록 구조)
3. Story 4.6 백테스트 결과 저장 문서 분석 (backtest_trades 테이블 스키마)
4. 7개 AC 정의 (매수/매도 거래 기록 강화, 정렬, 색상 구분, 노드 ID 추적, 시장 데이터 스냅샷, DB 스키마 준비)
5. 7개 Task/33개 Subtask 정의
6. Dev Notes 작성 (PnL 계산, position_size, Story 4.6과의 연관성)

📊 **Story 상태:** ready-for-dev (즉시 개발 가능)

🎯 **핵심 구현 목표:**
- self.trades 확장 (position_size, pnl, node_id, market_data)
- FR22 만족 (모든 거래 기록, 시간 순서대로 표시, 수익/손실 색상 구분)
- Story 4.3의 BacktestEngine._handle_buy/sell_action() 메서드 수정
- Story 4.6을 위한 데이터 구조 확정

📋 **다음 단계:**
- Story 4.5 개발 시작 (거래 내역 추적 강화)
- Story 4.6: 결과 저장 (self.trades를 backtest_trades 테이블에 저장)
- Story 4.7: 결과 시각화 UI (거래 내역 표시, 색상 구분)

---

## File List

**Story Files (1 file)**
- `_bmad-output/implementation-artifacts/4-5-trade-tracking.md` - This story file

**Backend Files to Create/Modify (est. 2 files)**
- `app/backtest/engine.py` - ✅ 수정 (_handle_buy/sell_action() 확장, get_trades_sorted(), _format_trade_for_display() 추가)
- `tests/unit/test_trade_tracking.py` - 🆕 새로 생성 (단위 테스트: PnL 계산, position_size, node_id, market_data)

**Total:** 2 files to create/modify
