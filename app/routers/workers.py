from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.worker import WorkerCreate, WorkerUpdate, WorkerOut
from app.repositories import worker_repo
from typing import List

router = APIRouter(prefix="/api/workers", tags=["workers"])

@router.get("/", response_model=List[WorkerOut])
def get_workers(db: Session = Depends(get_db)):
    return worker_repo.get_all(db)

@router.get("/{worker_id}", response_model=WorkerOut)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = worker_repo.get_by_id(db, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Работник не найден")
    return worker

@router.post("/", response_model=WorkerOut, status_code=201)
def create_worker(data: WorkerCreate, db: Session = Depends(get_db)):
    return worker_repo.create(db, data)

@router.put("/{worker_id}", response_model=WorkerOut)
def update_worker(worker_id: int, data: WorkerUpdate,
                  db: Session = Depends(get_db)):
    worker = worker_repo.update(db, worker_id, data)
    if not worker:
        raise HTTPException(status_code=404, detail="Работник не найден")
    return worker

@router.delete("/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    if not worker_repo.delete(db, worker_id):
        raise HTTPException(status_code=404, detail="Работник не найден")
    return {"detail": "Работник удалён"}