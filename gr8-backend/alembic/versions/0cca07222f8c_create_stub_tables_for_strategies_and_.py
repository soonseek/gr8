"""create stub tables for strategies and transactions

Revision ID: 0cca07222f8c
Revises: 6e42ffb6023e
Create Date: 2026-01-19 10:51:48.616422

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0cca07222f8c'
down_revision: Union[str, Sequence[str], None] = '6e42ffb6023e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create stub tables for strategies and revenue_transactions."""

    # 1. Create strategies table
    op.create_table(
        'strategies',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('creator_address', sa.String(50), nullable=False),
        sa.Column('name', sa.String(200), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_published', sa.Boolean(), server_default='false', default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['creator_address'], ['users.wallet_address'], ondelete='RESTRICT')
    )
    op.create_index('idx_strategies_creator', 'strategies', ['creator_address', 'created_at'])

    # 2. Create revenue_transactions table
    op.create_table(
        'revenue_transactions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('strategy_id', sa.String(50), nullable=True),
        sa.Column('creator_address', sa.String(50), nullable=False),
        sa.Column('buyer_address', sa.String(50), nullable=False),
        sa.Column('amount', sa.Numeric(20, 8), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['creator_address'], ['users.wallet_address'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['buyer_address'], ['users.wallet_address'], ondelete='RESTRICT')
    )
    op.create_index('idx_revenue_creator', 'revenue_transactions', ['creator_address', 'created_at'])
    op.create_index('idx_revenue_buyer', 'revenue_transactions', ['buyer_address', 'created_at'])
    op.create_index('idx_revenue_strategy', 'revenue_transactions', ['strategy_id', 'created_at'])


def downgrade() -> None:
    """Drop stub tables for strategies and revenue_transactions."""

    # 1. Drop revenue_transactions table (reverse order)
    op.drop_index('idx_revenue_strategy', table_name='revenue_transactions')
    op.drop_index('idx_revenue_buyer', table_name='revenue_transactions')
    op.drop_index('idx_revenue_creator', table_name='revenue_transactions')
    op.drop_table('revenue_transactions')

    # 2. Drop strategies table
    op.drop_index('idx_strategies_creator', table_name='strategies')
    op.drop_table('strategies')
