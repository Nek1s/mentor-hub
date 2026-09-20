from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NoteBase(BaseModel):
    student_id: int = Field(gt=0)
    appointment_id: int | None = Field(default=None, gt=0)
    title: str = Field(min_length=2, max_length=160, examples=["Итоги встречи"])
    content: str = Field(min_length=2, max_length=5000)


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    appointment_id: int | None = Field(default=None, gt=0)
    title: str | None = Field(default=None, min_length=2, max_length=160)
    content: str | None = Field(default=None, min_length=2, max_length=5000)


class NoteRead(NoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
