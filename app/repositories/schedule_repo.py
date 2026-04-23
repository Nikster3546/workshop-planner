from sqlalchemy.orm import Session
from app.models.schedule import Schedule
from typing import List

def get_all(db: Session) -> List[Schedule]:
    return db.query(Schedule).all()

def create_item(db: Session, data: dict) -> Schedule:
    item = Schedule(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def clear_all(db: Session) -> int:
    count = db.query(Schedule).count()
    db.query(Schedule).delete()
    db.commit()
    return count