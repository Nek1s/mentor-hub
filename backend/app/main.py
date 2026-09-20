from contextlib import asynccontextmanager

from fastapi import FastAPI

import app.models  # noqa: F401  # Импорт регистрирует SQLAlchemy-модели в Base.metadata.
from app.api.router import api_router
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    description="API учебного сервиса наставничества MentorHub.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["Служебные маршруты"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
