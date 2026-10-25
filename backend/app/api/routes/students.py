from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import ensure_student_owner, get_current_student_id, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.student import StudentCreate, StudentRead, StudentUpdate
from app.services import students as student_service

router = APIRouter(prefix="/students", tags=["Ученики"])


@router.get("", response_model=list[StudentRead])
def read_students(
    student_id: int = Depends(get_current_student_id), db: Session = Depends(get_db)
) -> list[StudentRead]:
    """Возвращает только профиль текущего ученика."""

    return [student_service.get_student_or_404(db, student_id)]


@router.get("/{student_id}", response_model=StudentRead)
def read_student(
    student_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> StudentRead:
    ensure_student_owner(current_user, student_id)
    return student_service.get_student_or_404(db, student_id)


@router.post("", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
def create_student(
    data: StudentCreate, current_user: User = Depends(get_current_user)
) -> StudentRead:
    """Профиль ученика создаётся вместе с учётной записью через /auth/register."""

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Создайте профиль ученика через маршрут /auth/register.",
    )


@router.patch("/{student_id}", response_model=StudentRead)
def edit_student(
    student_id: int,
    data: StudentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudentRead:
    ensure_student_owner(current_user, student_id)
    return student_service.update_student(db, student_id, data)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_student(
    student_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Response:
    ensure_student_owner(current_user, student_id)
    student_service.delete_student(db, student_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
