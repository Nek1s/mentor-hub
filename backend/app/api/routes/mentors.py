from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.mentor import MentorCreate, MentorRead, MentorUpdate
from app.services import mentors as mentor_service

router = APIRouter(prefix="/mentors", tags=["Наставники"])


@router.get("", response_model=list[MentorRead])
def read_mentors(db: Session = Depends(get_db)) -> list[MentorRead]:
    return mentor_service.get_mentors(db)


@router.get("/{mentor_id}", response_model=MentorRead)
def read_mentor(mentor_id: int, db: Session = Depends(get_db)) -> MentorRead:
    return mentor_service.get_mentor_or_404(db, mentor_id)


@router.post("", response_model=MentorRead, status_code=status.HTTP_201_CREATED)
def create_mentor(data: MentorCreate, db: Session = Depends(get_db)) -> MentorRead:
    return mentor_service.create_mentor(db, data)


@router.patch("/{mentor_id}", response_model=MentorRead)
def edit_mentor(mentor_id: int, data: MentorUpdate, db: Session = Depends(get_db)) -> MentorRead:
    return mentor_service.update_mentor(db, mentor_id, data)


@router.delete("/{mentor_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_mentor(mentor_id: int, db: Session = Depends(get_db)) -> Response:
    mentor_service.delete_mentor(db, mentor_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
