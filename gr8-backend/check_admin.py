"""Check current users and their roles."""
import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.user import User


async def main():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()

        print(f"Total users: {len(users)}")
        print("\nUsers:")
        for u in users:
            print(f"  {u.wallet_address[:10]}... | role: {u.role}")


if __name__ == "__main__":
    asyncio.run(main())
