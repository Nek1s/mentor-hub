from datetime import datetime

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import ensure_student_owner, get_current_student_id, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.appointment import AppointmentCreate, AppointmentRead, AppointmentUpdate
from app.services import appointments as appointment_service

router = APIRouter(prefix="/appointments", tags=["Встречи"])


@router.get("", response_model=list[AppointmentRead])
def read_appointments(
    mentor_id: int | None = Query(default=None, gt=0),
    student_id: int = Depends(get_current_student_id),
    db: Session = Depends(get_db),
) -> list[AppointmentRead]:
    return appointment_service.get_appointments(db, student_id, mentor_id)


@router.get("/{appointment_id}", response_model=AppointmentRead)
def read_appointment(
    appointment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> AppointmentRead:
    appointment = appointment_service.get_appointment_or_404(db, appointment_id)
    ensure_student_owner(current_user, appointment.student_id)
    return appointment


@router.post("", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
def create_appointment(
    data: AppointmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> AppointmentRead:
    ensure_student_owner(current_user, data.student_id)
    return appointment_service.create_appointment(db, data)


@router.patch("/{appointment_id}", response_model=AppointmentRead)
def edit_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AppointmentRead:
    appointment = appointment_service.get_appointment_or_404(db, appointment_id)
    ensure_student_owner(current_user, appointment.student_id)
    if data.student_id is not None:
        ensure_student_owner(current_user, data.student_id)
    return appointment_service.update_appointment(db, appointment_id, data)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_appointment(
    appointment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Response:
    appointment = appointment_service.get_appointment_or_404(db, appointment_id)
    ensure_student_owner(current_user, appointment.student_id)
    appointment_service.delete_appointment(db, appointment_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
