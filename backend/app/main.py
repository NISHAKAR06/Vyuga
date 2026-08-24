from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import SmartProcureError
from app.schemas.common import ApiResponseEnvelope, ErrorDetail

# Import Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.centres import router as centres_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.queue import router as queue_router
from app.api.v1.quality import router as quality_router
from app.api.v1.payments import router as payments_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.ws import router as ws_router

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Custom Domain Exception Handler (Requirement 46 & 47)
@app.exception_handler(SmartProcureError)
async def smartprocure_exception_handler(request: Request, exc: SmartProcureError):
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

@app.get("/")
async def root():
    return {"message": "SmartProcure FastAPI Backend API v1 is active", "docs": "/api/v1/docs"}
