from sqlalchemy.orm import Session
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate
from typing import Optional, List

def get_all(db: Session) -> List[Order]:
    return db.query(Order).all()

def get_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def create(db: Session, data: OrderCreate) -> Order:
    order = Order(**data.model_dump())
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def update(db: Session, order_id: int, data: OrderUpdate) -> Optional[Order]:
    order = get_by_id(db, order_id)
    if not order:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(order, key, value)
    db.commit()
    db.refresh(order)
    return order

def delete(db: Session, order_id: int) -> bool:
    order = get_by_id(db, order_id)
    if not order:
        return False
    db.delete(order)
    db.commit()
    return True