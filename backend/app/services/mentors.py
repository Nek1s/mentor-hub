from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.mentor import Mentor
from app.schemas.mentor import MentorCreate, MentorUpdate


def get_mentor_or_404(db: Session, mentor_id: int) -> Mentor:
    mentor = db.get(Mentor, mentor_id)
    if mentor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Наставник не найден")
    return mentor


def get_mentors(db: Session) -> list[Mentor]:
    return list(db.scalars(select(Mentor).order_by(Mentor.id)))


def create_mentor(db: Session, data: MentorCreate) -> Mentor:
    mentor = Mentor(**data.model_dump())
    db.add(mentor)
    db.commit()
    db.refresh(mentor)
    return mentor


def update_mentor(db: Session, mentor_id: int, data: MentorUpdate) -> Mentor:
    mentor = get_mentor_or_404(db, mentor_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(mentor, field, value)
    db.commit()
    db.refresh(mentor)
    return mentor


def delete_mentor(db: Session, mentor_id: int) -> None:
    mentor = get_mentor_or_404(db, mentor_id)
    has_appointments = db.scalar(select(Appointment.id).where(Appointment.mentor_id == mentor_id).limit(1))
    if has_appointments is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Нельзя удалить наставника, у которого есть встречи. Сначала удалите или перенесите встречи.",
        )
    db.delete(mentor)
    db.commit()
