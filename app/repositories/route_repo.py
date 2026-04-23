from sqlalchemy.orm import Session
from app.models.route import Route
from app.models.step import Step
from app.schemas.route import RouteCreate, RouteUpdate
from typing import Optional, List

def get_all(db: Session) -> List[Route]:
    return db.query(Route).all()

def get_by_id(db: Session, route_id: int) -> Optional[Route]:
    return db.query(Route).filter(Route.id == route_id).first()

def create(db: Session, data: RouteCreate) -> Route:
    route = Route(name=data.name)
    db.add(route)
    db.flush()  # получаем route.id до коммита
    for step_data in data.steps:
        step = Step(route_id=route.id, **step_data.model_dump())
        db.add(step)
    db.commit()
    db.refresh(route)
    return route

def update(db: Session, route_id: int, data: RouteUpdate) -> Optional[Route]:
    route = get_by_id(db, route_id)
    if not route:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(route, key, value)
    db.commit()
    db.refresh(route)
    return route

def delete(db: Session, route_id: int) -> bool:
    route = get_by_id(db, route_id)
    if not route:
        return False
    db.delete(route)
    db.commit()
    return True