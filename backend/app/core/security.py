"""Вспомогательные функции для паролей и JWT-токенов."""

from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

import jwt
from pwdlib import PasswordHash

from app.core.config import Settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Возвращает стойкий хеш пароля без сохранения исходного значения."""

    return password_hash.hash(password)


def verify_password(password: str, password_hash_value: str) -> bool:
    """Проверяет пароль относительно ранее сохранённого хеша."""

    return password_hash.verify(password, password_hash_value)


def create_access_token(user_id: int, settings: Settings) -> str:
    """Создаёт короткоживущий JWT для доступа к защищённым маршрутам."""

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(user_id), "type": "access", "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(user_id: int, settings: Settings) -> tuple[str, str, datetime]:
    """Создаёт refresh JWT и возвращает его идентификатор и срок действия для БД."""

    token_id = str(uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    payload = {"sub": str(user_id), "type": "refresh", "jti": token_id, "exp": expires_at}
    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return token, token_id, expires_at


def decode_token(token: str, expected_type: str, settings: Settings) -> dict[str, Any] | None:
    """Проверяет подпись и срок JWT, затем убеждается в назначении токена."""

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.InvalidTokenError:
        return None

    if payload.get("type") != expected_type or not payload.get("sub"):
        return None
    return payload
