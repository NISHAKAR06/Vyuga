from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

T = TypeVar("T")

class BaseRepository(ABC, Generic[T]):
    """Abstract generic repository interface (Requirement 10)."""
    @abstractmethod
    async def get_by_id(self, id: Any) -> Optional[T]:
        pass

    @abstractmethod
    async def get_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        pass

    @abstractmethod
    async def create(self, entity: T) -> T:
        pass

    @abstractmethod
    async def update(self, entity: T) -> T:
        pass

    @abstractmethod
    async def delete(self, id: Any) -> bool:
        pass

class SQLAlchemyBaseRepository(BaseRepository[T]):
    """Generic SQLAlchemy implementation of BaseRepository."""
    def __init__(self, session: AsyncSession, model_cls: type):
        self.session = session
        self.model_cls = model_cls

    async def get_by_id(self, id: Any) -> Optional[T]:
        result = await self.session.execute(select(self.model_cls).filter(self.model_cls.id == id))
        return result.scalars().first()

    async def get_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        result = await self.session.execute(select(self.model_cls).offset(offset).limit(limit))
        return list(result.scalars().all())

    async def create(self, entity: T) -> T:
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def update(self, entity: T) -> T:
        await self.session.flush()
        return entity

    async def delete(self, id: Any) -> bool:
        obj = await self.get_by_id(id)
        if obj:
            await self.session.delete(obj)
            await self.session.flush()
            return True
        return False
