"""
Admin 계정 생성 스크립트

사용법:
1. 백엔드 루트 디렉토리에서 실행
2. python scripts/create_admin.py <WALLET_ADDRESS>

예시:
    python scripts/create_admin.py 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1

이 스크립트는:
- 지갑 주소로 admin 계정을 생성하거나 역할을 admin으로 업데이트합니다
- 데이터베이스에 직접 접근하여 "Chicken-egg" 문제를 해결합니다
"""

import sys
import asyncio
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from app.core.database import get_db_session
from app.models.user import User


async def create_admin_user(wallet_address: str):
    """
    지갑 주소로 admin 사용자를 생성하거나 역할을 admin으로 업데이트합니다.

    Args:
        wallet_address: 이더리움 지갑 주소 (0x로 시작)
    """
    # 지갑 주소 검증 및 포맷팅
    if not wallet_address.startswith('0x'):
        print("❌ 오류: 지갑 주소는 '0x'로 시작해야 합니다.")
        return False

    wallet_address = wallet_address.lower()

    async with get_db_session() as db:
        try:
            # 기존 사용자 확인
            result = await db.execute(
                select(User).where(User.wallet_address == wallet_address)
            )
            user = result.scalar_one_or_none()

            if user:
                # 기존 사용자 역할 업데이트
                if user.role == 'admin':
                    print(f"ℹ️  사용자 '{wallet_address}'는 이미 admin 역할입니다.")
                    return True

                user.role = 'admin'
                await db.commit()
                print(f"✅ 기존 사용자 '{wallet_address}'의 역할을 admin으로 업데이트했습니다.")
                return True
            else:
                # 새 admin 사용자 생성
                new_admin = User(
                    wallet_address=wallet_address,
                    role='admin'
                )
                db.add(new_admin)
                await db.commit()
                print(f"✅ 새 admin 사용자 '{wallet_address}'를 생성했습니다.")
                return True

        except Exception as e:
            await db.rollback()
            print(f"❌ 오류 발생: {e}")
            return False


async def list_all_users():
    """모든 사용자 목록을 출력합니다 (디버깅용)."""
    async with get_db_session() as db:
        try:
            result = await db.execute(select(User))
            users = result.scalars().all()

            if not users:
                print("📭 데이터베이스에 사용자가 없습니다.")
                return

            print("\n📋 모든 사용자 목록:")
            print("-" * 80)
            for user in users:
                role_badge = "👑" if user.role == "admin" else "👤"
                print(f"{role_badge} {user.wallet_address} - Role: {user.role}")
            print("-" * 80)

        except Exception as e:
            print(f"❌ 사용자 목록 조회 오류: {e}")


async def main():
    """메인 함수"""
    print("=" * 80)
    print("🔧 Admin 계정 생성 도구")
    print("=" * 80)

    if len(sys.argv) < 2:
        print("\n사용법:")
        print("  python scripts/create_admin.py <WALLET_ADDRESS>")
        print("\n예시:")
        print("  python scripts/create_admin.py 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1")
        print("\n옵션:")
        print("  --list    모든 사용자 목록 표시")

        # 사용자 목록 표시
        if len(sys.argv) == 2 and sys.argv[1] == '--list':
            await list_all_users()
        return

    wallet_address = sys.argv[1]

    print(f"\n🎯 대상 지갑 주소: {wallet_address}")
    print("⚙️  데이터베이스 접속 중...\n")

    success = await create_admin_user(wallet_address)

    if success:
        print("\n" + "=" * 80)
        print("✅ Admin 계정 설정 완료!")
        print("=" * 80)
        print("\n📝 다음 단계:")
        print("1. 프론트엔드에서 해당 지갑 주소로 로그인하세요")
        print("2. /admin 페이지에 접속하여 대시보드를 확인하세요")
        print("3. Mock 데이터가 표시되어야 합니다")
        print("\n💡 팁:")
        print("- 현재 로그인한 지갑 주소를 admin으로 설정하려면:")
        print(f"  python scripts/create_admin.py <YOUR_WALLET_ADDRESS>")
    else:
        print("\n❌ Admin 계정 설정 실패")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
