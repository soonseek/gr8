"""add_indexes_to_user_table

Revision ID: c8232cefcb89
Revises: 001
Create Date: 2026-01-16 10:59:59.202592

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c8232cefcb89'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    """Add indexes to created_at and updated_at columns for query optimization"""

    # created_at 인덱스 추가 (활성 사용자 쿼리 최적화: User.created_at >= active_since)
    op.create_index('ix_users_created_at', 'users', ['created_at'])

    # updated_at 인덱스 추가 (정렬 및 최근 활동 쿼리 최적화)
    op.create_index('ix_users_updated_at', 'users', ['updated_at'])


def downgrade():
    """Rollback: Drop created_at and updated_at indexes"""

    # 인덱스 삭제
    op.drop_index('ix_users_updated_at', table_name='users')
    op.drop_index('ix_users_created_at', table_name='users')
