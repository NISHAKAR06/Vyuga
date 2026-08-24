from abc import ABC, abstractmethod
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.repositories.base import SQLAlchemyBaseRepository, BaseRepository
from app.models.user import UserModel
from app.models.farmer import FarmerProfileModel, ProcurerProfileModel, AdminProfileModel
from app.models.centre import ProcurementCentreModel, CropModel
from app.models.procurement import ProcurementAnnouncementModel, SlotModel
from app.models.booking import BookingModel
from app.models.payment import PaymentModel, GrievanceModel, NotificationModel, AuditLogModel
from app.domain.enums import BookingStatusEnum, PaymentStatusEnum

class UserRepository(SQLAlchemyBaseRepository[UserModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, UserModel)

    async def get_by_phone(self, phone: str) -> Optional[UserModel]:
        res = await self.session.execute(select(UserModel).filter(UserModel.phone == phone))
        return res.scalars().first()

class FarmerRepository(SQLAlchemyBaseRepository[FarmerProfileModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, FarmerProfileModel)

    async def get_by_user_id(self, user_id: str) -> Optional[FarmerProfileModel]:
        res = await self.session.execute(select(FarmerProfileModel).filter(FarmerProfileModel.user_id == user_id))
        return res.scalars().first()

class BookingRepository(SQLAlchemyBaseRepository[BookingModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, BookingModel)

    async def get_by_centre(self, centre_id: str) -> List[BookingModel]:
        res = await self.session.execute(select(BookingModel).filter(BookingModel.centre_id == centre_id))
        return list(res.scalars().all())

    async def get_by_farmer(self, farmer_id: str) -> List[BookingModel]:
        res = await self.session.execute(select(BookingModel).filter(BookingModel.farmer_id == farmer_id))
        return list(res.scalars().all())

    async def get_next_token_number(self, centre_id: str) -> int:
        res = await self.session.execute(
            select(func.max(BookingModel.token_number)).filter(BookingModel.centre_id == centre_id)
        )
        max_token = res.scalar()
        return (max_token or 40) + 1

class PaymentRepository(SQLAlchemyBaseRepository[PaymentModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, PaymentModel)

    async def get_by_farmer(self, farmer_id: str) -> List[PaymentModel]:
        res = await self.session.execute(select(PaymentModel).filter(PaymentModel.farmer_id == farmer_id))
        return list(res.scalars().all())

class AuditRepository(SQLAlchemyBaseRepository[AuditLogModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, AuditLogModel)

    async def get_latest_hash(self) -> Optional[str]:
        res = await self.session.execute(
            select(AuditLogModel.current_hash).order_by(AuditLogModel.timestamp.desc())
        )
        return res.scalars().first()
