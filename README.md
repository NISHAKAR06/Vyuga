# AGRIPROCURE — FASTAPI BACKEND & AGRI-PROCUREMENT PLATFORM

Production-quality FastAPI backend built using **Object-Oriented Programming (OOP), SOLID principles, and Clean Architecture** supporting the React + TypeScript frontend.

---

## 🌟 Key Architectural Highlights

### 1. Object-Oriented Programming (OOP)
The backend genuine leverages OOP principles:
- **Encapsulation**: Domain Entities (`UserEntity`, `FarmerProfileEntity`, `BookingEntity`) and Value Objects (`Money`, `Quantity`, `GeoLocation`, `TimeWindow`).
- **Abstraction**: `DemandForecastEngine`, `SchedulingEngine`, `QualityAssessmentEngine`, `FraudDetectionEngine`, `PaymentPredictionEngine`, `NotificationProvider`.
- **Inheritance & Polymorphism**: Strategy implementations (`RuleBasedDemandForecastEngine`, `RuleBasedFraudEngine`) and Notification Providers (`AppNotificationProvider`, `SMSNotificationProvider`, `WhatsAppNotificationProvider`, `IVRNotificationProvider`).
- **Dependency Injection**: FastAPI DI injecting repositories, services, strategies, and security context.

### 2. SOLID Principles
- **S (Single Responsibility Principle)**: Modular services (`AuthService`, `BookingService`, `QualityService`, `WeighmentService`, `PaymentService`, `AuditService`).
- **O (Open/Closed Principle)**: Intelligence engines and notification providers extensible without modifying core services.
- **L (Liskov Substitution Principle)**: Replaceable strategies satisfying abstract engine contracts.
- **I (Interface Segregation Principle)**: Segregated interfaces for forecasting, scheduling, quality, fraud, and payments rather than a monolithic engine.
- **D (Dependency Inversion Principle)**: Services depend on abstract repositories and strategy interfaces rather than concrete database ORM or ML models.

### 3. Design Patterns
1. **Repository Pattern**: `BaseRepository[T]` and specialized repositories (`BookingRepository`, `PaymentRepository`, `AuditRepository`).
2. **Service Layer Pattern**: Decoupled route handlers and domain logic.
3. **Strategy Pattern**: Replaceable intelligence layer (Demand forecasting, smart scheduling, queue intelligence, quality inspection, fraud detection, payment prediction, rerouting).
4. **Factory Pattern**: `NotificationProviderFactory`.
5. **State Machine / State Pattern**: `BookingStateMachine`, `PaymentStateMachine`, `ProcurementStateMachine` enforcing valid state transitions and throwing HTTP 409 Conflict on invalid jumps.
6. **Observer / Event-Driven Pattern**: `DomainEvent` bus with `AuditSubscriber` and `NotificationSubscriber`.
7. **Tamper-Evident Cryptographic Audit Trail**: SHA-256 hash chaining (`previous_hash` + `current_hash`) for immutable procurement logs.

---

## 🛡️ Role-Based Access Control & Security Policies

- **Role-Based Access Control (RBAC)**: `FARMER`, `PROCURER`, `ADMIN`.
- **Centre Isolation (Requirement 15)**: Procurers belong to exactly one procurement centre. Requests to unassigned centres are rejected with `HTTP 403 CENTRE_ACCESS_DENIED`.
- **Farmer Ownership Policy (Requirement 16)**: Farmers cannot access private data of other farmers (`HTTP 403 FARMER_OWNERSHIP_DENIED`).
- **State Machine Protection**: Disallows invalid state transitions (`HTTP 409 INVALID_STATE_TRANSITION`).

---

## 🚀 Quick Start with Docker Compose

```bash
# 1. Clone repository & start services
docker compose up -d --build

# 2. Run database seed script
docker compose exec api python -m app.seed

# 3. Run Pytest unit and security tests
docker compose exec api pytest
```

---

## 🛠️ Local Development Setup

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger API Documentation will be available at: `http://localhost:8000/api/v1/docs`

### Frontend (React + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## 🧪 Demo Users & Roles

| Role | Phone | Name | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **FARMER** | `+91 98421 76540` | R. Murugesan | Thiruvaiyaru, Thanjavur (3.5 Acres) |
| **PROCURER** | `+91 94432 10987` | K. Senthil Nathan | Centre A – Thanjavur Mandi |
| **ADMIN** | `+91 94440 99881` | Dr. V. Rajeshwari IAS | State Secretariat, Chennai |

---

## 📁 Repository Structure

```
Vyuga/
├── docker-compose.yml
├── README.md
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── app/
│   │   ├── main.py
│   │   ├── seed.py
│   │   ├── core/ (config, security, database, permissions, exceptions, logging)
│   │   ├── domain/ (entities, enums, value_objects, state_machine)
│   │   ├── schemas/ (Pydantic v2 schemas)
│   │   ├── models/ (SQLAlchemy 2.x ORM models)
│   │   ├── repositories/ (Base & specialized repositories)
│   │   ├── services/ (Auth, Booking, Quality, Weighment, Payment, Audit services)
│   │   ├── intelligence/ (Strategy Pattern engines)
│   │   ├── events/ (Domain events & EventPublisher)
│   │   ├── infrastructure/ (Notification providers & factory)
│   │   └── api/ (v1 Routers & WebSockets)
│   └── tests/ (Pytest suite)
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── services/api.ts (FastAPI client service)
        ├── components/
        │   ├── layout/ (Header, Sidebar, MobileNav)
        │   ├── ui/ (Badge, Modal, KPICard, Stepper, ToastContainer, Tooltip)
        │   ├── visualizers/ (QueueVisualizer, SimpleCharts)
        │   └── modals/ (CreateSlotModal, ProfileModal, ReceiptModal)
        ├── pages/ (admin, auth, farmer, officer)
        └── data/ (mockData.ts)
```
