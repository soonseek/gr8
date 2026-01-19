"""add user status columns

Revision ID: 6e42ffb6023e
Revises: c8232cefcb89
Create Date: 2026-01-19 10:36:03.926472

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e42ffb6023e'
down_revision: Union[str, Sequence[str], None] = 'c8232cefcb89'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add user status management columns to users table."""

    # 1. Add status management columns
    op.add_column('users', sa.Column('status', sa.String(20), nullable=False, server_default='active'))
    op.add_column('users', sa.Column('ens_domain', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('suspension_reason', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('suspended_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('banned_at', sa.DateTime(), nullable=True))

    # 2. Add aggregated data columns
    op.add_column('users', sa.Column('total_purchases', sa.Numeric(20, 8), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('total_sales', sa.Numeric(20, 8), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('strategy_count', sa.Integer(), nullable=False, server_default='0'))

    # 3. Add composite index for status-based queries
    op.create_index('idx_users_status', 'users', ['status', 'created_at'])

    # 4. Add index for wallet_address (if not exists from base table)
    # Note: wallet_address already has unique index from base table, skipping


def downgrade() -> None:
    """Remove user status management columns from users table."""

    # 1. Drop indexes
    op.drop_index('idx_users_status', table_name='users')

    # 2. Drop columns (in reverse order of addition)
    op.drop_column('users', 'strategy_count')
    op.drop_column('users', 'total_sales')
    op.drop_column('users', 'total_purchases')
    op.drop_column('users', 'banned_at')
    op.drop_column('users', 'suspended_at')
    op.drop_column('users', 'suspension_reason')
    op.drop_column('users', 'ens_domain')
    op.drop_column('users', 'status')
