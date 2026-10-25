from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AccessTokenResponse, LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest, TokenPair, UserRead
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


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh_access_token(
    data: RefreshRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> AccessTokenResponse:
    """Обновляет access token по действующему refresh token."""

    return auth_service.refresh_access_token(db, data.refresh_token, settings)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    data: LogoutRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> Response:
    """Завершает текущую сессию и запрещает дальнейшее обновление access token."""

    auth_service.logout_user(db, data.refresh_token, settings)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserRead:
    """Возвращает данные пользователя, которому принадлежит access token."""

    return current_user
