from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.student import Student
from app.models.user import RefreshSession, User
from app.schemas.auth import AccessTokenResponse, LoginRequest, RegisterRequest, TokenPair


def register_user(db: Session, data: RegisterRequest, settings: Settings) -> TokenPair:
    """Создаёт ученика и учётную запись, затем выдаёт первую пару токенов."""

    existing_user = db.scalar(select(User).where(User.email == data.email))
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже зарегистрирован.",
        )

    existing_student = db.scalar(select(Student).where(Student.email == data.email))
    if existing_student is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ученик с таким email уже существует. Используйте другой email.",
        )

    student = Student(full_name=data.full_name, email=data.email, goal=data.goal)
    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        student=student,
    )
    db.add(user)
    db.flush()

    tokens = _create_token_pair(db, user, settings)
    db.commit()
    db.refresh(user)
    return TokenPair(**tokens, user=user)


def login_user(db: Session, data: LoginRequest, settings: Settings) -> TokenPair:
    """Проверяет пароль и создаёт новую refresh-сессию для успешного входа."""

    user = db.scalar(select(User).where(User.email == data.email))
    if user is None or not user.is_active or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    tokens = _create_token_pair(db, user, settings)
    db.commit()
    return TokenPair(**tokens, user=user)


def refresh_access_token(db: Session, refresh_token: str, settings: Settings) -> AccessTokenResponse:
    """Выдаёт новый access token только для существующей и неотозванной сессии."""

    payload = decode_token(refresh_token, "refresh", settings)
    if payload is None or not isinstance(payload.get("jti"), str):
        raise _invalid_refresh_token()

    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise _invalid_refresh_token() from None

    refresh_session = db.scalar(
        select(RefreshSession).where(
            RefreshSession.token_id == payload["jti"],
            RefreshSession.user_id == user_id,
        )
    )
    if refresh_session is None or refresh_session.revoked_at is not None:
        raise _invalid_refresh_token()

    expires_at = refresh_session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc):
        raise _invalid_refresh_token()

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise _invalid_refresh_token()

    return AccessTokenResponse(access_token=create_access_token(user.id, settings))


def _create_token_pair(db: Session, user: User, settings: Settings) -> dict[str, str]:
    """Выпускает JWT и сохраняет серверную запись refresh-сессии."""

    access_token = create_access_token(user.id, settings)
    refresh_token, token_id, expires_at = create_refresh_token(user.id, settings)
    db.add(RefreshSession(token_id=token_id, user_id=user.id, expires_at=expires_at))

    return {"access_token": access_token, "refresh_token": refresh_token}


def _invalid_refresh_token() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Refresh token недействителен, истёк или был отозван.",
        headers={"WWW-Authenticate": "Bearer"},
    )
