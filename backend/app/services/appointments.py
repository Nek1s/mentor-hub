from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.enums import AppointmentStatus
from app.models.appointment import Appointment
from app.models.mentor import Mentor
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.services.mentors import get_mentor_or_404
from app.services.students import get_student_or_404


def get_appointment_or_404(db: Session, appointment_id: int) -> Appointment:
    appointment = db.get(Appointment, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Встреча не найдена")
    return appointment


def get_appointments(db: Session, student_id: int | None = None, mentor_id: int | None = None) -> list[Appointment]:
    statement = select(Appointment).order_by(Appointment.scheduled_at)
    if student_id is not None:
        statement = statement.where(Appointment.student_id == student_id)
    if mentor_id is not None:
        statement = statement.where(Appointment.mentor_id == mentor_id)
    return list(db.scalars(statement))


def _validate_relations(db: Session, student_id: int, mentor_id: int) -> Mentor:
    get_student_or_404(db, student_id)
    mentor = get_mentor_or_404(db, mentor_id)
    if not mentor.is_active:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Нельзя записаться к неактивному наставнику",
        )
    return mentor


def _ensure_slot_is_free(db: Session, mentor_id: int, scheduled_at: object, ignored_id: int | None = None) -> None:
    statement = select(Appointment).where(
        Appointment.mentor_id == mentor_id,
        Appointment.scheduled_at == scheduled_at,
        Appointment.status != AppointmentStatus.CANCELLED.value,
    )
    if ignored_id is not None:
        statement = statement.where(Appointment.id != ignored_id)
    if db.scalar(statement) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Этот временной слот наставника уже занят",
        )


def create_appointment(db: Session, data: AppointmentCreate) -> Appointment:
    _validate_relations(db, data.student_id, data.mentor_id)
    if data.status != AppointmentStatus.CANCELLED:
        _ensure_slot_is_free(db, data.mentor_id, data.scheduled_at)
    appointment = Appointment(**data.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def update_appointment(db: Session, appointment_id: int, data: AppointmentUpdate) -> Appointment:
    appointment = get_appointment_or_404(db, appointment_id)
    changes = data.model_dump(exclude_unset=True)
    next_student_id = changes.get("student_id", appointment.student_id)
    next_mentor_id = changes.get("mentor_id", appointment.mentor_id)
    next_scheduled_at = changes.get("scheduled_at", appointment.scheduled_at)
    next_status = changes.get("status", appointment.status)

    _validate_relations(db, next_student_id, next_mentor_id)
    if next_status != AppointmentStatus.CANCELLED:
        _ensure_slot_is_free(db, next_mentor_id, next_scheduled_at, appointment_id)

    for field, value in changes.items():
        setattr(appointment, field, value)
    db.commit()
    db.refresh(appointment)
    return appointment


def delete_appointment(db: Session, appointment_id: int) -> None:
    appointment = get_appointment_or_404(db, appointment_id)
    db.delete(appointment)
    db.commit()
