from fastapi import APIRouter

from app.api.routes import appointments, auth, mentors, notes, students

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(mentors.router)
api_router.include_router(students.router)
api_router.include_router(appointments.router)
api_router.include_router(notes.router)
