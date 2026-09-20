from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MentorBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120, examples=["Артем Ребриков"])
    specialization: str = Field(min_length=2, max_length=120, examples=["Frontend-разработка"])
    company: str | None = Field(default=None, max_length=120, examples=["Учебный проект"])
    bio: str | None = Field(default=None, max_length=2000)
    is_active: bool = True


class MentorCreate(MentorBase):
    pass


class MentorUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    specialization: str | None = Field(default=None, min_length=2, max_length=120)
    company: str | None = Field(default=None, max_length=120)
    bio: str | None = Field(default=None, max_length=2000)
    is_active: bool | None = None


class MentorRead(MentorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
