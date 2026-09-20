from datetime import datetime

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.appointment import AppointmentCreate, AppointmentRead, AppointmentUpdate
from app.services import appointments as appointment_service

router = APIRouter(prefix="/appointments", tags=["Встречи"])


@router.get("", response_model=list[AppointmentRead])
def read_appointments(
    student_id: int | None = Query(default=None, gt=0),
    mentor_id: int | None = Query(default=None, gt=0),
    db: Session = Depends(get_db),
) -> list[AppointmentRead]:
    return appointment_service.get_appointments(db, student_id, mentor_id)


@router.get("/{appointment_id}", response_model=AppointmentRead)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)) -> AppointmentRead:
    return appointment_service.get_appointment_or_404(db, appointment_id)


@router.post("", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)) -> AppointmentRead:
    return appointment_service.create_appointment(db, data)


@router.patch("/{appointment_id}", response_model=AppointmentRead)
def edit_appointment(appointment_id: int, data: AppointmentUpdate, db: Session = Depends(get_db)) -> AppointmentRead:
    return appointment_service.update_appointment(db, appointment_id, data)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_appointment(appointment_id: int, db: Session = Depends(get_db)) -> Response:
    appointment_service.delete_appointment(db, appointment_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
