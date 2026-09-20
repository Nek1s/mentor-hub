from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.student import StudentCreate, StudentRead, StudentUpdate
from app.services import students as student_service

router = APIRouter(prefix="/students", tags=["Ученики"])


@router.get("", response_model=list[StudentRead])
def read_students(db: Session = Depends(get_db)) -> list[StudentRead]:
    return student_service.get_students(db)


@router.get("/{student_id}", response_model=StudentRead)
def read_student(student_id: int, db: Session = Depends(get_db)) -> StudentRead:
    return student_service.get_student_or_404(db, student_id)


@router.post("", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
def create_student(data: StudentCreate, db: Session = Depends(get_db)) -> StudentRead:
    return student_service.create_student(db, data)


@router.patch("/{student_id}", response_model=StudentRead)
def edit_student(student_id: int, data: StudentUpdate, db: Session = Depends(get_db)) -> StudentRead:
    return student_service.update_student(db, student_id, data)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_student(student_id: int, db: Session = Depends(get_db)) -> Response:
    student_service.delete_student(db, student_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
