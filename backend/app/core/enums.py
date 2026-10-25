from enum import Enum


class AppointmentStatus(str, Enum):
    REQUESTED = "requested"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class UserRole(str, Enum):
    """Роли пользователей, которые могут понадобиться для разграничения доступа."""

    STUDENT = "student"
    MENTOR = "mentor"
