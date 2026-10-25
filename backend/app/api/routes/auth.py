from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenPair
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["Аутентификация"])


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> TokenPair:
    """Регистрирует ученика и сразу возвращает access и refresh токены."""

    return auth_service.register_user(db, data, settings)


@router.post("/login", response_model=TokenPair)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> TokenPair:
    """Выполняет вход пользователя по email и паролю."""

    return auth_service.login_user(db, data, settings)
