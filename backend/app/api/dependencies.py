"""Общие зависимости для защиты API-маршрутов."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.enums import UserRole
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> User:
    """Возвращает активного пользователя по access token из заголовка Bearer."""

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _credentials_error()

    payload = decode_token(credentials.credentials, "access", settings)
    if payload is None:
        raise _credentials_error()

    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise _credentials_error() from None

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise _credentials_error()
    return user


def get_current_student_id(current_user: User = Depends(get_current_user)) -> int:
    """Возвращает профиль ученика текущего пользователя, если он существует."""

    if current_user.student_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У текущего пользователя нет профиля ученика.",
        )
    return current_user.student_id


def ensure_student_owner(current_user: User, student_id: int) -> None:
    """Не позволяет пользователю читать или менять данные другого ученика."""

    if current_user.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для работы с данными другого ученика.",
        )


def require_mentor(current_user: User = Depends(get_current_user)) -> User:
    """Ограничивает изменение каталога наставников учётными записями наставника."""

    if current_user.role != UserRole.MENTOR.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Изменять каталог наставников может только наставник.",
        )
    return current_user


def _credentials_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Необходим действующий access token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
