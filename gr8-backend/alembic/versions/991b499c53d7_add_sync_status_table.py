"""add sync_status table

Revision ID: 991b499c53d7
Revises: fa7479073441
Create Date: 2026-01-21 09:29:18.757830

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '991b499c53d7'
down_revision: Union[str, Sequence[str], None] = 'fa7479073441'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create sync_status table
    op.create_table(
        'sync_status',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('exchange', sa.String(length=20), nullable=False),
        sa.Column('symbol', sa.String(length=20), nullable=False),
        sa.Column('timeframe', sa.String(length=10), nullable=False),
        sa.Column('last_sync_timestamp', sa.BigInteger(), nullable=False),
        sa.Column('last_sync_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='completed'),
        sa.Column('gaps_filled', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index(op.f('ix_sync_status_exchange'), 'sync_status', ['exchange'], unique=False)
    op.create_index(op.f('ix_sync_status_symbol'), 'sync_status', ['symbol'], unique=False)
    op.create_index(op.f('ix_sync_status_timeframe'), 'sync_status', ['timeframe'], unique=False)
    op.create_index(op.f('ix_sync_status_last_sync_timestamp'), 'sync_status', ['last_sync_timestamp'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop indexes
    op.drop_index(op.f('ix_sync_status_last_sync_timestamp'), table_name='sync_status')
    op.drop_index(op.f('ix_sync_status_timeframe'), table_name='sync_status')
    op.drop_index(op.f('ix_sync_status_symbol'), table_name='sync_status')
    op.drop_index(op.f('ix_sync_status_exchange'), table_name='sync_status')

    # Drop table
    op.drop_table('sync_status')
