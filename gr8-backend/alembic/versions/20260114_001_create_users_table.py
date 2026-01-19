"""Create users table with role column

Revision ID: 001
Revises:
Create Date: 2026-01-14

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create users table with role column"""

    # users 테이블 생성
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('wallet_address', sa.String(42), nullable=False),
        sa.Column('role', sa.String(20), server_default='user', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('wallet_address')
    )

    # role 컬럼에 CHECK 제약조건 추가 ('user' 또는 'admin'만 허용)
    op.create_check_constraint(
        'check_role',
        'users',
        "role IN ('user', 'admin')"
    )

    # 인덱스 생성
    op.create_index('ix_users_wallet_address', 'users', ['wallet_address'])
    op.create_index('ix_users_role', 'users', ['role'])


def downgrade():
    """Rollback: Drop users table"""

    # 인덱스 삭제
    op.drop_index('ix_users_role', table_name='users')
    op.drop_index('ix_users_wallet_address', table_name='users')

    # 테이블 삭제
    op.drop_table('users')
