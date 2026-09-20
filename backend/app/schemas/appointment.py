from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.enums import AppointmentStatus


class AppointmentBase(BaseModel):
    student_id: int = Field(gt=0)
    mentor_id: int = Field(gt=0)
    scheduled_at: datetime
    duration_minutes: int = Field(default=45, ge=15, le=240)
    status: AppointmentStatus = AppointmentStatus.REQUESTED
    topic: str = Field(min_length=3, max_length=200, examples=["Разбор портфолио"])

class AppointmentCreate(AppointmentBase):
    @field_validator("scheduled_at")
    @classmethod
    def date_must_have_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None:
            raise ValueError("Время встречи должно содержать часовой пояс, например +03:00")
        return value


class AppointmentUpdate(BaseModel):
    student_id: int | None = Field(default=None, gt=0)
    mentor_id: int | None = Field(default=None, gt=0)
    scheduled_at: datetime | None = None
    duration_minutes: int | None = Field(default=None, ge=15, le=240)
    status: AppointmentStatus | None = None
    topic: str | None = Field(default=None, min_length=3, max_length=200)

    @field_validator("scheduled_at")
    @classmethod
    def date_must_have_timezone(cls, value: datetime | None) -> datetime | None:
        if value is not None and value.tzinfo is None:
            raise ValueError("Время встречи должно содержать часовой пояс, например +03:00")
        return value


class AppointmentRead(AppointmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
