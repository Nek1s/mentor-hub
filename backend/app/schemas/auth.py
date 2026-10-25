from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.core.enums import UserRole


class RegisterRequest(BaseModel):
    """Данные, которые пользователь указывает при создании учётной записи."""

    full_name: str = Field(min_length=2, max_length=120, examples=["Никита Иванов"])
    email: EmailStr = Field(examples=["nikita.ivanov@example.com"])
    password: str = Field(min_length=8, max_length=128, examples=["MyStrongPassword123"])
    goal: str | None = Field(default=None, max_length=2000, examples=["Подготовить портфолио"])


class LoginRequest(BaseModel):
    """Данные для входа: email и исходный пароль."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    """Безопасное представление пользователя: хеш пароля в ответ не попадает."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    student_id: int | None
    created_at: datetime


class TokenPair(BaseModel):
    """Пара JWT, которая выдаётся после регистрации или входа."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class RefreshRequest(BaseModel):
    """Действующий refresh token, которым запрашивается новый access token."""

    refresh_token: str = Field(min_length=1)


class AccessTokenResponse(BaseModel):
    """Новый короткоживущий токен для защищённых API-маршрутов."""

    access_token: str
    token_type: str = "bearer"
