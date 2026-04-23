from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order import OrderCreate, OrderUpdate, OrderOut
from app.repositories import order_repo
from typing import List

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.get("/", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return order_repo.get_all(db)

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_repo.get_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order

@router.post("/", response_model=OrderOut, status_code=201)
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    return order_repo.create(db, data)

@router.put("/{order_id}", response_model=OrderOut)
def update_order(order_id: int, data: OrderUpdate,
                 db: Session = Depends(get_db)):
    order = order_repo.update(db, order_id, data)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    if not order_repo.delete(db, order_id):
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return {"detail": "Заказ удалён"}