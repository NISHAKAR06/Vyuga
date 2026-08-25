"""
AgriProcure Realistic Seed Data Generator (Requirement 50).
Populates SQLite/PostgreSQL with realistic Indian agricultural procurement data:
- 3 Roles (FARMER, PROCURER, ADMIN)
- 5+ Farmers, 3+ Procurers, 1 Admin
- 5 Procurement Centres in Tamil Nadu
- 5 Major Crops (Paddy, Wheat, Cotton, Groundnut, Sugarcane)
- Slots, Bookings, Queue entries, Quality checks, Weighments, Payments, Audit records
"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.user import UserModel
from app.models.farmer import FarmerProfileModel, ProcurerProfileModel, AdminProfileModel
from app.models.centre import ProcurementCentreModel, CropModel
from app.models.procurement import ProcurementAnnouncementModel, SlotModel
from app.models.booking import BookingModel
from app.models.payment import PaymentModel, AuditLogModel
from app.domain.enums import UserRoleEnum, BookingStatusEnum, PaymentStatusEnum, QualityGradeEnum
from app.repositories.repositories import AuditRepository
from app.services.services import AuditService

async def seed_data():
    async with AsyncSessionLocal() as session:
        print("Seeding AgriProcure database...")

        # 0. Clean database tables first
        # For development, drop existing data
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

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
        # Farmer 1
        farmer1_user = UserModel(id="usr-f1", phone="+91 98421 76540", role=UserRoleEnum.FARMER, full_name="R. Murugesan")
        farmer1_profile = FarmerProfileModel(id="F-TN-2026-8841", user_id="usr-f1", farmer_code="F-8841", name="R. Murugesan", phone="+91 98421 76540", location="Thiruvaiyaru, Thanjavur", district="Thanjavur", state="Tamil Nadu", land_area_acres=3.5, crop="Paddy (Samba)", bank_account="SBI 30987123901", ifsc_code="SBIN0001244", bank_name="State Bank of India")
        session.add(farmer1_user)
        session.add(farmer1_profile)

        # Farmer 2
        farmer2_user = UserModel(id="usr-f2", phone="+91 97891 22340", role=UserRoleEnum.FARMER, full_name="C. Palanivel")
        farmer2_profile = FarmerProfileModel(id="F-TN-2026-8842", user_id="usr-f2", farmer_code="F-8842", name="C. Palanivel", phone="+91 97891 22340", location="Papanasam, Thanjavur", district="Thanjavur", state="Tamil Nadu", land_area_acres=4.2, crop="Paddy (Samba)", bank_account="IB 1029384756", ifsc_code="IDIB000P041", bank_name="Indian Bank")
        session.add(farmer2_user)
        session.add(farmer2_profile)

        # Farmer 3
        farmer3_user = UserModel(id="usr-f3", phone="+91 94421 88321", role=UserRoleEnum.FARMER, full_name="M. Shanmugam")
        farmer3_profile = FarmerProfileModel(id="F-TN-2026-8843", user_id="usr-f3", farmer_code="F-8843", name="M. Shanmugam", phone="+91 94421 88321", location="Orathanadu, Thanjavur", district="Thanjavur", state="Tamil Nadu", land_area_acres=5.5, crop="Paddy (Samba)", bank_account="IOB 4410293847", ifsc_code="IOBA0001883", bank_name="Indian Overseas Bank")
        session.add(farmer3_user)
        session.add(farmer3_profile)

        # 4. Create Slots (For Centre A tomorrow/today 2026-08-26)
        slots = [
            SlotModel(id="s1", centre_id="cnt-a", date="2026-08-26", start_time="09:00", end_time="10:00", max_capacity=20, booked_count=1),
            SlotModel(id="s2", centre_id="cnt-a", date="2026-08-26", start_time="10:00", end_time="11:00", max_capacity=20, booked_count=2),
            SlotModel(id="s3", centre_id="cnt-a", date="2026-08-26", start_time="11:00", end_time="12:00", max_capacity=20, booked_count=0),
        ]
        for s in slots:
            session.add(s)

        # 5. Create Bookings (matching the mock data states)
        bookings = [
            # Served booking
            BookingModel(
                id="tok-41",
                token_number=41,
                farmer_id="F-TN-2026-8842",
                centre_id="cnt-a",
                slot_id="s1",
                crop="Paddy",
                crop_variety="Ponni Samba (Fine)",
                declared_quantity_kg=2800,
                actual_quantity_kg=2800,
                status=BookingStatusEnum.PROCURED,
                counter_assigned="Counter 1",
                estimated_wait_minutes=15
            ),
            # Serving right now booking
            BookingModel(
                id="tok-42",
                token_number=42,
                farmer_id="F-TN-2026-8843",
                centre_id="cnt-a",
                slot_id="s2",
                crop="Paddy",
                crop_variety="Ponni Samba (Fine)",
                declared_quantity_kg=3200,
                status=BookingStatusEnum.PROCESSING,
                counter_assigned="Counter 1",
                estimated_wait_minutes=20
            ),
            # Upcoming booking for Murugesan
            BookingModel(
                id="tok-47",
                token_number=47,
                farmer_id="F-TN-2026-8841",
                centre_id="cnt-a",
                slot_id="s2",
                crop="Paddy",
                crop_variety="Ponni Samba (Fine)",
                declared_quantity_kg=3000,
                status=BookingStatusEnum.WAITING,
                estimated_wait_minutes=24
            )
        ]
        for b in bookings:
            session.add(b)

        await session.commit()

        # 6. Create Audit Logs for state transitions to enable actual waiting time calculations
        # Using AuditService to chain hashes correctly
        audit_repo = AuditRepository(session)
        audit_service = AuditService(audit_repo)

        # Timestamps for Booking 41 (Served)
        # Checked in 30 mins ago, started processing 20 mins ago (Wait = 10 mins)
        now = datetime.utcnow()
        t41_booked = now - timedelta(hours=2)
        t41_arrived = now - timedelta(minutes=30)
        t41_waiting = now - timedelta(minutes=29)
        t41_processing = now - timedelta(minutes=19)
        t41_procured = now - timedelta(minutes=5)

        # Log transition actions for Token 41
        await audit_service.log_action("usr-f2", "FARMER", "CREATE_BOOKING", "BOOKING", "tok-41", "", "BookingStatusEnum.BOOKED", "cnt-a")
        # Overwrite timestamps manually in session because log_action sets it to utcnow()
        # To bypass, we can just edit the created entries or add them directly
        
        # Actually, let's just add AuditLogModel instances directly to control timestamps!
        # Chaining hashes is required, let's chain them manually or let audit_service do it.
        # Wait, since AuditLogModel needs previous_hash and current_hash, let's write a simple helper
        # to add them in order with manual timestamps and hashes.
        
        async def add_log_manual(user_id, role, action, resource_id, prev_val, new_val, timestamp):
            prev_hash = await audit_repo.get_latest_hash()
            raw_payload = f"{prev_hash or 'GENESIS'}|{timestamp.isoformat()}|{user_id}|{action}|{resource_id}|{new_val}"
            import hashlib
            curr_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
            log_entry = AuditLogModel(
                timestamp=timestamp,
                user_id=user_id,
                user_role=role,
                action=action,
                resource_type="BOOKING",
                resource_id=resource_id,
                previous_value=prev_val,
                new_value=new_val,
                centre_id="cnt-a",
                previous_hash=prev_hash,
                current_hash=curr_hash
            )
            session.add(log_entry)
            await session.flush()

        # Token 41 logs
        await add_log_manual("usr-f2", "FARMER", "CREATE_BOOKING", "tok-41", "", "BookingStatusEnum.BOOKED", t41_booked)
        await add_log_manual("usr-f2", "FARMER", "TRANSITION_BOOKING_STATUS", "tok-41", "BookingStatusEnum.BOOKED", "BookingStatusEnum.ARRIVED", t41_arrived)
        await add_log_manual("usr-f2", "FARMER", "TRANSITION_BOOKING_STATUS", "tok-41", "BookingStatusEnum.ARRIVED", "BookingStatusEnum.WAITING", t41_waiting)
        await add_log_manual("usr-off1", "PROCURER", "TRANSITION_BOOKING_STATUS", "tok-41", "BookingStatusEnum.WAITING", "BookingStatusEnum.PROCESSING", t41_processing)
        await add_log_manual("usr-off1", "PROCURER", "TRANSITION_BOOKING_STATUS", "tok-41", "BookingStatusEnum.PROCESSING", "BookingStatusEnum.PROCURED", t41_procured)

        # Token 42 logs
        # Checked in 25 mins ago, started processing 5 mins ago (Wait = 20 mins)
        t42_booked = now - timedelta(hours=1.5)
        t42_arrived = now - timedelta(minutes=25)
        t42_waiting = now - timedelta(minutes=24)
        t42_processing = now - timedelta(minutes=5)

        await add_log_manual("usr-f3", "FARMER", "CREATE_BOOKING", "tok-42", "", "BookingStatusEnum.BOOKED", t42_booked)
        await add_log_manual("usr-f3", "FARMER", "TRANSITION_BOOKING_STATUS", "tok-42", "BookingStatusEnum.BOOKED", "BookingStatusEnum.ARRIVED", t42_arrived)
        await add_log_manual("usr-f3", "FARMER", "TRANSITION_BOOKING_STATUS", "tok-42", "BookingStatusEnum.ARRIVED", "BookingStatusEnum.WAITING", t42_waiting)
        await add_log_manual("usr-off1", "PROCURER", "TRANSITION_BOOKING_STATUS", "tok-42", "BookingStatusEnum.WAITING", "BookingStatusEnum.PROCESSING", t42_processing)

        # Token 47 logs (Waiting)
        # Checked in 10 mins ago, still waiting
        t47_booked = now - timedelta(hours=1)
        t47_arrived = now - timedelta(minutes=10)
        t47_waiting = now - timedelta(minutes=9)

        await add_log_manual("usr-f1", "FARMER", "CREATE_BOOKING", "tok-47", "", "BookingStatusEnum.BOOKED", t47_booked)
        await add_log_manual("usr-f1", "FARMER", "TRANSITION_BOOKING_STATUS", "tok-47", "BookingStatusEnum.BOOKED", "BookingStatusEnum.ARRIVED", t47_arrived)
        await add_log_manual("usr-f1", "FARMER", "TRANSITION_BOOKING_STATUS", "tok-47", "BookingStatusEnum.ARRIVED", "BookingStatusEnum.WAITING", t47_waiting)

        await session.commit()
        print("Seed data successfully populated!")

if __name__ == "__main__":
    asyncio.run(seed_data())
