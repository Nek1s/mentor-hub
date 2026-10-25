"""Импорт моделей, необходимый для регистрации всех таблиц в Base.metadata."""

from app.models.appointment import Appointment
from app.models.mentor import Mentor
from app.models.note import Note
from app.models.student import Student
from app.models.user import RefreshSession, User

__all__ = ["Appointment", "Mentor", "Note", "RefreshSession", "Student", "User"]
