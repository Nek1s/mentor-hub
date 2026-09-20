from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate
from app.services.appointments import get_appointment_or_404
from app.services.students import get_student_or_404


def get_note_or_404(db: Session, note_id: int) -> Note:
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заметка не найдена")
    return note


def get_notes(db: Session, student_id: int | None = None) -> list[Note]:
    statement = select(Note).order_by(Note.updated_at.desc())
    if student_id is not None:
        statement = statement.where(Note.student_id == student_id)
    return list(db.scalars(statement))


def _validate_note_relations(db: Session, student_id: int, appointment_id: int | None) -> None:
    get_student_or_404(db, student_id)
    if appointment_id is None:
        return
    appointment = get_appointment_or_404(db, appointment_id)
    if appointment.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Нельзя прикрепить к заметке встречу другого ученика",
        )


def create_note(db: Session, data: NoteCreate) -> Note:
    _validate_note_relations(db, data.student_id, data.appointment_id)
    note = Note(**data.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, note_id: int, data: NoteUpdate) -> Note:
    note = get_note_or_404(db, note_id)
    changes = data.model_dump(exclude_unset=True)
    if "appointment_id" in changes:
        _validate_note_relations(db, note.student_id, changes["appointment_id"])
    for field, value in changes.items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note_id: int) -> None:
    note = get_note_or_404(db, note_id)
    db.delete(note)
    db.commit()
