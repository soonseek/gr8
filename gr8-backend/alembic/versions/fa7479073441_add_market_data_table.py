"""add market_data table

Revision ID: fa7479073441
Revises: 0cca07222f8c
Create Date: 2026-01-20 11:04:12.898916

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fa7479073441'
down_revision: Union[str, Sequence[str], None] = '0cca07222f8c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: Create market_data table with indexes"""

    # Create market_data table
    op.create_table(
        'market_data',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('exchange', sa.String(20), nullable=False),
        sa.Column('symbol', sa.String(20), nullable=False),
        sa.Column('timeframe', sa.String(10), nullable=False),
        sa.Column('timestamp', sa.BigInteger(), nullable=False),
        sa.Column('open', sa.DECIMAL(20, 8), nullable=False),
        sa.Column('high', sa.DECIMAL(20, 8), nullable=False),
        sa.Column('low', sa.DECIMAL(20, 8), nullable=False),
        sa.Column('close', sa.DECIMAL(20, 8), nullable=False),
        sa.Column('volume', sa.DECIMAL(30, 8), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('exchange', 'symbol', 'timeframe', 'timestamp', name='uq_market_data_lookup')
    )

    # Create indexes for query performance
    op.create_index('ix_market_data_exchange', 'market_data', ['exchange'])
    op.create_index('ix_market_data_symbol', 'market_data', ['symbol'])
    op.create_index('ix_market_data_timeframe', 'market_data', ['timeframe'])
    op.create_index('ix_market_data_timestamp', 'market_data', ['timestamp'])

    # Create composite index for lookup pattern (AC 1 requirement)
    op.create_index(
        'idx_market_data_lookup',
        'market_data',
        ['exchange', 'symbol', 'timeframe', 'timestamp'],
        unique=True
    )

    # Create composite index for date range queries (AC 1 requirement)
    op.create_index(
        'idx_market_data_date_range',
        'market_data',
        ['symbol', 'timeframe', 'timestamp']
    )


def downgrade() -> None:
    """Downgrade schema: Drop market_data table and indexes"""

    # Drop indexes first
    op.drop_index('idx_market_data_date_range', table_name='market_data')
    op.drop_index('idx_market_data_lookup', table_name='market_data')
    op.drop_index('ix_market_data_timestamp', table_name='market_data')
    op.drop_index('ix_market_data_timeframe', table_name='market_data')
    op.drop_index('ix_market_data_symbol', table_name='market_data')
    op.drop_index('ix_market_data_exchange', table_name='market_data')

    # Drop table
    op.drop_table('market_data')
