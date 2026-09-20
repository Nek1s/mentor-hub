from fastapi import APIRouter

from app.api.routes import appointments, mentors, notes, students

api_router = APIRouter()
api_router.include_router(mentors.router)
api_router.include_router(students.router)
api_router.include_router(appointments.router)
api_router.include_router(notes.router)
