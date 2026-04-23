from sqlalchemy.orm import Session
from app.models.worker import Worker
from app.schemas.worker import WorkerCreate, WorkerUpdate
from typing import Optional, List

def get_all(db: Session) -> List[Worker]:
    return db.query(Worker).all()

def get_by_id(db: Session, worker_id: int) -> Optional[Worker]:
    return db.query(Worker).filter(Worker.id == worker_id).first()

def create(db: Session, data: WorkerCreate) -> Worker:
    worker = Worker(**data.model_dump())
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker

def update(db: Session, worker_id: int, data: WorkerUpdate) -> Optional[Worker]:
    worker = get_by_id(db, worker_id)
    if not worker:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(worker, key, value)
    db.commit()
    db.refresh(worker)
    return worker

def delete(db: Session, worker_id: int) -> bool:
    worker = get_by_id(db, worker_id)
    if not worker:
        return False
    db.delete(worker)
    db.commit()
    return True