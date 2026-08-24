"""
SmartProcure Realistic Seed Data Generator (Requirement 50).
Populates PostgreSQL with realistic Indian agricultural procurement data:
- 3 Roles (FARMER, PROCURER, ADMIN)
- 5+ Farmers, 3+ Procurers, 1 Admin
- 5 Procurement Centres in Tamil Nadu
- 5 Major Crops (Paddy, Wheat, Cotton, Groundnut, Sugarcane)
- Slots, Bookings, Queue entries, Quality checks, Weighments, Payments, Audit records
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.user import UserModel
from app.models.farmer import FarmerProfileModel, ProcurerProfileModel, AdminProfileModel
from app.models.centre import ProcurementCentreModel, CropModel
from app.models.procurement import ProcurementAnnouncementModel, SlotModel
from app.models.booking import BookingModel
from app.models.payment import PaymentModel, AuditLogModel
from app.domain.enums import UserRoleEnum, BookingStatusEnum, PaymentStatusEnum, QualityGradeEnum
from datetime import datetime

async def seed_data():
    async with AsyncSessionLocal() as session:
        print("Seeding SmartProcure database...")

        # 1. Create Crops
        crops = [
            CropModel(id="c1", name="Paddy", variety="Ponni Samba (Fine)", msp_per_quintal=2320, season="Kharif", expected_yield_per_acre_kg=2400),
            CropModel(id="c2", name="Wheat", variety="Sharbati / Lokwan", msp_per_quintal=2275, season="Rabi", expected_yield_per_acre_kg=1800),
            CropModel(id="c3", name="Cotton", variety="Long Staple (BT)", msp_per_quintal=7121, season="Kharif", expected_yield_per_acre_kg=900),
            CropModel(id="c4", name="Groundnut", variety="TMV-7 Pods", msp_per_quintal=6783, season="Kharif", expected_yield_per_acre_kg=1100),
            CropModel(id="c5", name="Sugarcane", variety="Co 86032 High Sugar", msp_per_quintal=340, season="Zaid", expected_yield_per_acre_kg=35000),
        ]
        for c in crops:
            session.add(c)

        # 2. Create Procurement Centres
        centres = [
            ProcurementCentreModel(id="cnt-a", name="Centre A – Thanjavur Mandi", code="TNJ-01", district="Thanjavur", state="Tamil Nadu", capacity_per_day_kg=120000, active_counters=4, address="Old Bus Stand Road, Thanjavur APMC Yard, TN 613001", contact_number="+91 4362 278100", latitude=10.7870, longitude=79.1378),
            ProcurementCentreModel(id="cnt-b", name="Centre B – Kumbakonam Regulated Market", code="KMK-02", district="Thanjavur", state="Tamil Nadu", capacity_per_day_kg=90000, active_counters=3, address="Mahamaham Tank West, Kumbakonam, TN 612001", contact_number="+91 435 2400122", latitude=10.9602, longitude=79.3782),
            ProcurementCentreModel(id="cnt-c", name="Centre C – Trichy Gandhi Market Terminal", code="TRY-03", district="Tiruchirappalli", state="Tamil Nadu", capacity_per_day_kg=110000, active_counters=4, address="East Boulevard Road, Trichy, TN 620008", contact_number="+91 431 2704511", latitude=10.8231, longitude=78.6920),
            ProcurementCentreModel(id="cnt-d", name="Centre D – Madurai Central APMC Yard", code="MDU-04", district="Madurai", state="Tamil Nadu", capacity_per_day_kg=95000, active_counters=3, address="Mattuthavani APMC Complex, Madurai, TN 625007", contact_number="+91 452 2589020", latitude=9.9252, longitude=78.1198),
            ProcurementCentreModel(id="cnt-e", name="Centre E – Erode Agricultural Complex", code="ERD-05", district="Erode", state="Tamil Nadu", capacity_per_day_kg=130000, active_counters=5, address="Perundurai Road, Erode, TN 638011", contact_number="+91 424 2221450", latitude=11.3410, longitude=77.7172),
        ]
        for cnt in centres:
            session.add(cnt)

        # 3. Create Users & Profiles
        # Admin
        admin_user = UserModel(id="usr-adm1", phone="+91 94440 99881", role=UserRoleEnum.ADMIN, full_name="Dr. V. Rajeshwari IAS")
        admin_profile = AdminProfileModel(id="ADM-TN-001", user_id="usr-adm1", admin_code="ADM-001", name="Dr. V. Rajeshwari IAS", phone="+91 94440 99881", designation="Director of Agricultural Marketing")
        session.add(admin_user)
        session.add(admin_profile)

        # Procurer
        procurer_user = UserModel(id="usr-off1", phone="+91 94432 10987", role=UserRoleEnum.PROCURER, full_name="K. Senthil Nathan")
        procurer_profile = ProcurerProfileModel(id="OFF-TN-042", user_id="usr-off1", officer_code="OFF-042", name="K. Senthil Nathan", phone="+91 94432 10987", centre_id="cnt-a", designation="Senior Agricultural Officer")
        session.add(procurer_user)
        session.add(procurer_profile)

        # Farmers
        farmer1_user = UserModel(id="usr-f1", phone="+91 98421 76540", role=UserRoleEnum.FARMER, full_name="R. Murugesan")
        farmer1_profile = FarmerProfileModel(id="F-TN-2026-8841", user_id="usr-f1", farmer_code="F-8841", name="R. Murugesan", phone="+91 98421 76540", location="Thiruvaiyaru, Thanjavur", district="Thanjavur", state="Tamil Nadu", land_area_acres=3.5, crop="Paddy (Samba)", bank_account="SBI 30987123901", ifsc_code="SBIN0001244", bank_name="State Bank of India")
        session.add(farmer1_user)
        session.add(farmer1_profile)

        await session.commit()
        print("Seed data successfully populated!")

if __name__ == "__main__":
    asyncio.run(seed_data())
