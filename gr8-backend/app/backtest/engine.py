"""
Backtest Engine Core

Executes trading strategies against historical data
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from datetime import datetime


class BacktestEngine:
    """
    Core backtesting engine that executes strategies on historical data
    """

    def __init__(self, initial_capital: float = 10000.0):
        self.initial_capital = initial_capital
        self.current_capital = initial_capital
        self.position = 0.0  # Current position size
        self.entry_price = 0.0
        self.trades: List[Dict[str, Any]] = []
        self.equity_curve: List[float] = []

    def execute(
        self,
        strategy: Dict[str, Any],
        market_data: pd.DataFrame,
    ) -> Dict[str, Any]:
        """
        Execute strategy on market data

        Args:
            strategy: Strategy configuration (nodes + edges)
            market_data: Historical OHLCV data

        Returns:
            Backtest results with metrics
        """
        self.reset()

        # Iterate through each candle
        for idx, row in market_data.iterrows():
            timestamp = row['timestamp']
            price = row['close']

            # Execute strategy logic (simplified for MVP)
            # TODO: Implement full node graph execution
            signal = self._evaluate_strategy(strategy, row, idx, market_data)

            if signal == 'BUY' and self.position == 0:
                self._execute_buy(timestamp, price, self.current_capital * 0.95)
            elif signal == 'SELL' and self.position > 0:
                self._execute_sell(timestamp, price)

            # Update equity curve
            current_value = self.current_capital
            if self.position > 0:
                current_value += self.position * price
            self.equity_curve.append(current_value)

        # Close any open positions
        if self.position > 0:
            last_price = market_data.iloc[-1]['close']
            last_timestamp = market_data.iloc[-1]['timestamp']
            self._execute_sell(last_timestamp, last_price)

        return self._calculate_results()

    def _evaluate_strategy(
        self,
        strategy: Dict[str, Any],
        current_row: pd.Series,
        idx: int,
        market_data: pd.DataFrame,
    ) -> Optional[str]:
        """
        Evaluate strategy nodes and return signal

        For MVP: Simplified RSI-based logic
        """
        # Calculate RSI (simplified)
        if idx < 14:
            return None

        prices = market_data['close'].iloc[max(0, idx - 14):idx + 1].values
        rsi = self._calculate_rsi(prices, period=14)

        if rsi < 30:
            return 'BUY'
        elif rsi > 70:
            return 'SELL'

        return None

    def _calculate_rsi(self, prices: np.ndarray, period: int = 14) -> float:
        """
        Calculate RSI (Relative Strength Index)
        """
        if len(prices) < period + 1:
            return 50.0

        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)

        avg_gain = np.mean(gains[-period:])
        avg_loss = np.mean(losses[-period:])

        if avg_loss == 0:
            return 100.0

        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

        return rsi

    def _execute_buy(self, timestamp: int, price: float, amount: float):
        """
        Execute buy order
        """
        fee = amount * 0.001  # 0.1% fee
        cost = amount + fee

        if cost > self.current_capital:
            return  # Not enough capital

        quantity = amount / price
        self.position += quantity
        self.entry_price = price
        self.current_capital -= cost

        self.trades.append({
            'timestamp': timestamp,
            'type': 'BUY',
            'price': price,
            'quantity': quantity,
            'amount': amount,
            'fee': fee,
            'capital': self.current_capital,
        })

    def _execute_sell(self, timestamp: int, price: float):
        """
        Execute sell order
        """
        if self.position == 0:
            return

        amount = self.position * price
        fee = amount * 0.001  # 0.1% fee
        proceeds = amount - fee

        pnl = (price - self.entry_price) * self.position

        self.current_capital += proceeds
        self.position = 0
        self.entry_price = 0

        self.trades.append({
            'timestamp': timestamp,
            'type': 'SELL',
            'price': price,
            'quantity': self.position,
            'amount': amount,
            'fee': fee,
            'pnl': pnl,
            'capital': self.current_capital,
        })

    def _calculate_results(self) -> Dict[str, Any]:
        """
        Calculate performance metrics
        """
        if len(self.trades) == 0:
            return {
                'total_return': 0.0,
                'roi': 0.0,
                'max_drawdown': 0.0,
                'sharpe_ratio': 0.0,
                'total_trades': 0,
                'win_rate': 0.0,
                'profit_factor': 0.0,
                'trades': [],
                'equity_curve': self.equity_curve,
            }

        final_capital = self.current_capital
        total_return = final_capital - self.initial_capital
        roi = (total_return / self.initial_capital) * 100

        # Calculate max drawdown
        equity_array = np.array(self.equity_curve)
        running_max = np.maximum.accumulate(equity_array)
        drawdown = (equity_array - running_max) / running_max
        max_drawdown = np.min(drawdown) * 100 if len(drawdown) > 0 else 0.0

        # Win rate
        winning_trades = [t for t in self.trades if t.get('pnl', 0) > 0]
        win_rate = (len(winning_trades) / len(self.trades)) * 100 if len(self.trades) > 0 else 0.0

        # Profit factor
        total_profit = sum([t.get('pnl', 0) for t in self.trades if t.get('pnl', 0) > 0])
        total_loss = abs(sum([t.get('pnl', 0) for t in self.trades if t.get('pnl', 0) < 0]))
        profit_factor = total_profit / total_loss if total_loss > 0 else 0.0

        # Sharpe ratio (simplified)
        if len(self.equity_curve) > 1:
            returns = np.diff(equity_array) / equity_array[:-1]
            sharpe_ratio = np.mean(returns) / np.std(returns) * np.sqrt(252) if np.std(returns) > 0 else 0.0
        else:
            sharpe_ratio = 0.0

        return {
            'initial_capital': self.initial_capital,
            'final_capital': final_capital,
            'total_return': total_return,
            'roi': roi,
            'max_drawdown': max_drawdown,
            'sharpe_ratio': sharpe_ratio,
            'total_trades': len(self.trades),
            'win_rate': win_rate,
            'profit_factor': profit_factor,
            'trades': self.trades,
            'equity_curve': self.equity_curve,
        }

    def reset(self):
        """
        Reset engine state
        """
        self.current_capital = self.initial_capital
        self.position = 0.0
        self.entry_price = 0.0
        self.trades = []
        self.equity_curve = []
