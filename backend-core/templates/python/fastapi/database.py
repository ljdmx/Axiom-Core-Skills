// TEMPLATE_META:START
/*
@template-id: python-db-config
@version: 1.0.0
@description: Async Database Configuration with SQLAlchemy
@dependencies: sqlalchemy, asyncpg
@customization-points: DB_URL
@language: python
@framework: FastAPI
*/
// TEMPLATE_META:END

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "{{DB_URL}}"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
