from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schedule import ScheduleItemOut, ScheduleRunRequest, ScheduleRunResult
from app.repositories import schedule_repo
from app.services.scheduler import run_scheduler
from typing import List

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@router.get("/", response_model=List[ScheduleItemOut])
def get_schedule(db: Session = Depends(get_db)):
    return schedule_repo.get_all(db)

@router.post("/run", response_model=ScheduleRunResult)
def run_schedule(data: ScheduleRunRequest, db: Session = Depends(get_db)):
    result = run_scheduler(db)
    return ScheduleRunResult(
        created=result["created"],
        skipped=result["skipped"],
        message=f"Запланировано заказов: {result['created']}, пропущено: {result['skipped']}"
    )

@router.delete("/")
def clear_schedule(db: Session = Depends(get_db)):
    count = schedule_repo.clear_all(db)
    return {"deleted_count": count, "detail": "Расписание очищено"}