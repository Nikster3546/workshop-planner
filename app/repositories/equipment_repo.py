from sqlalchemy.orm import Session
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate
from typing import Optional, List

def get_all(db: Session) -> List[Equipment]:
    return db.query(Equipment).all()

def get_by_id(db: Session, equip_id: int) -> Optional[Equipment]:
    return db.query(Equipment).filter(Equipment.id == equip_id).first()

def create(db: Session, data: EquipmentCreate) -> Equipment:
    equip = Equipment(**data.model_dump())
    db.add(equip)
    db.commit()
    db.refresh(equip)
    return equip

def update(db: Session, equip_id: int, data: EquipmentUpdate) -> Optional[Equipment]:
    equip = get_by_id(db, equip_id)
    if not equip:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(equip, key, value)
    db.commit()
    db.refresh(equip)
    return equip

def delete(db: Session, equip_id: int) -> bool:
    equip = get_by_id(db, equip_id)
    if not equip:
        return False
    db.delete(equip)
    db.commit()
    return True