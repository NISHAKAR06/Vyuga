from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import AgriProcureError
from app.schemas.common import ApiResponseEnvelope, ErrorDetail

# Import Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.centres import router as centres_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.queue import router as queue_router
from app.api.v1.quality import router as quality_router
from app.api.v1.payments import router as payments_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.ws import router as ws_router, manager as ws_manager
from app.api.v1.queue_intelligence import router as queue_intelligence_router

from contextlib import asynccontextmanager
from app.core.database import engine, Base
# Import models to ensure registered on metadata
import app.models.user
import app.models.farmer
import app.models.centre
import app.models.procurement
import app.models.booking
import app.models.payment

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables verified/initialized successfully.")
    except Exception as e:
        logger.warning(f"Database table initialization notice: {e}")

    # Start Queue Intelligence background worker
    from app.workers.queue_monitor import get_queue_monitor
    monitor = get_queue_monitor()
    monitor.set_ws_manager(ws_manager)
    await monitor.start()
    logger.info("Queue Intelligence Monitor started.")

    yield

    # Shutdown
    await monitor.stop()
    logger.info("Queue Intelligence Monitor stopped.")

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Custom Domain Exception Handler
@app.exception_handler(AgriProcureError)
async def agriprocure_exception_handler(request: Request, exc: AgriProcureError):
    logger.warning(f"Domain Error [{exc.code}]: {exc.message} on {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content=ApiResponseEnvelope(
            success=False,
            error=ErrorDetail(code=exc.code, message=exc.message, details=exc.details)
        ).model_dump()
    )

# Include API Routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(centres_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)
app.include_router(queue_router, prefix=settings.API_V1_STR)
app.include_router(quality_router, prefix=settings.API_V1_STR)
app.include_router(payments_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(ws_router, prefix=settings.API_V1_STR)
app.include_router(queue_intelligence_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "AgriProcure FastAPI Backend API v1 is active", "docs": "/api/v1/docs"}
