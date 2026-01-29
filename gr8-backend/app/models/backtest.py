"""
Backtest Models

Database models for storing backtest results
"""

from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class BacktestResult(Base):
    """
    Stores backtest execution results
    """
    __tablename__ = "backtest_results"

    id = Column(String, primary_key=True)
    user_wallet = Column(String, nullable=False, index=True)
    strategy_name = Column(String, nullable=True)
    strategy_data = Column(JSON, nullable=False)  # Full strategy JSON (nodes + edges)
    
    # Backtest configuration
    exchange = Column(String, nullable=False)
    symbol = Column(String, nullable=False)
    timeframe = Column(String, nullable=False)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    initial_capital = Column(Float, nullable=False)
    
    # Performance metrics
    final_capital = Column(Float, nullable=False)
    total_return = Column(Float, nullable=False)
    roi = Column(Float, nullable=False)
    max_drawdown = Column(Float, nullable=False)
    sharpe_ratio = Column(Float, nullable=False)
    total_trades = Column(Integer, nullable=False)
    win_rate = Column(Float, nullable=False)
    profit_factor = Column(Float, nullable=False)
    
    # Results data
    trades = Column(JSON, nullable=False)  # All trade records
    equity_curve = Column(JSON, nullable=False)  # Equity curve data
    
    # Metadata
    execution_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<BacktestResult(id={self.id}, roi={self.roi}%, trades={self.total_trades})>"
