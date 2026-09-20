from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


def get_student_or_404(db: Session, student_id: int) -> Student:
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ученик не найден")
    return student


def get_students(db: Session) -> list[Student]:
    return list(db.scalars(select(Student).order_by(Student.id)))


def _ensure_email_is_free(db: Session, email: str, current_id: int | None = None) -> None:
    existing = db.scalar(select(Student).where(Student.email == email))
    if existing is not None and existing.id != current_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ученик с такой почтой уже существует")


def create_student(db: Session, data: StudentCreate) -> Student:
    _ensure_email_is_free(db, str(data.email))
    student = Student(**data.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def update_student(db: Session, student_id: int, data: StudentUpdate) -> Student:
    student = get_student_or_404(db, student_id)
    changes = data.model_dump(exclude_unset=True)
    if "email" in changes:
        _ensure_email_is_free(db, str(changes["email"]), student_id)
    for field, value in changes.items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student_id: int) -> None:
    student = get_student_or_404(db, student_id)
    db.delete(student)
    db.commit()
