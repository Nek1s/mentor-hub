from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120, examples=["Никита Иванов"])
    email: EmailStr = Field(examples=["nikita.ivanov@example.com"])
    goal: str | None = Field(default=None, max_length=2000, examples=["Подготовить портфолио"])


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    goal: str | None = Field(default=None, max_length=2000)


class StudentRead(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
