from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentOut
from app.repositories import equipment_repo
from typing import List

router = APIRouter(prefix="/api/equipment", tags=["equipment"])

@router.get("/", response_model=List[EquipmentOut])
def get_equipment(db: Session = Depends(get_db)):
    return equipment_repo.get_all(db)

@router.get("/{equip_id}", response_model=EquipmentOut)
def get_equip(equip_id: int, db: Session = Depends(get_db)):
    equip = equipment_repo.get_by_id(db, equip_id)
    if not equip:
        raise HTTPException(status_code=404, detail="Оборудование не найдено")
    return equip

@router.post("/", response_model=EquipmentOut, status_code=201)
def create_equip(data: EquipmentCreate, db: Session = Depends(get_db)):
    return equipment_repo.create(db, data)

@router.put("/{equip_id}", response_model=EquipmentOut)
def update_equip(equip_id: int, data: EquipmentUpdate,
                 db: Session = Depends(get_db)):
    equip = equipment_repo.update(db, equip_id, data)
    if not equip:
        raise HTTPException(status_code=404, detail="Оборудование не найдено")
    return equip

@router.delete("/{equip_id}")
def delete_equip(equip_id: int, db: Session = Depends(get_db)):
    if not equipment_repo.delete(db, equip_id):
        raise HTTPException(status_code=404, detail="Оборудование не найдено")
    return {"detail": "Оборудование удалено"}
