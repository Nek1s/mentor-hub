from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.note import NoteCreate, NoteRead, NoteUpdate
from app.services import notes as note_service

router = APIRouter(prefix="/notes", tags=["Заметки"])


@router.get("", response_model=list[NoteRead])
def read_notes(student_id: int | None = Query(default=None, gt=0), db: Session = Depends(get_db)) -> list[NoteRead]:
    return note_service.get_notes(db, student_id)


@router.get("/{note_id}", response_model=NoteRead)
def read_note(note_id: int, db: Session = Depends(get_db)) -> NoteRead:
    return note_service.get_note_or_404(db, note_id)


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(data: NoteCreate, db: Session = Depends(get_db)) -> NoteRead:
    return note_service.create_note(db, data)


@router.patch("/{note_id}", response_model=NoteRead)
def edit_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db)) -> NoteRead:
    return note_service.update_note(db, note_id, data)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_note(note_id: int, db: Session = Depends(get_db)) -> Response:
    note_service.delete_note(db, note_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
