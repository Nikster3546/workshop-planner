from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.route import RouteCreate, RouteUpdate, RouteOut
from app.repositories import route_repo
from typing import List

router = APIRouter(prefix="/api/routes", tags=["routes"])

@router.get("/", response_model=List[RouteOut])
def get_routes(db: Session = Depends(get_db)):
    return route_repo.get_all(db)

@router.get("/{route_id}", response_model=RouteOut)
def get_route(route_id: int, db: Session = Depends(get_db)):
    route = route_repo.get_by_id(db, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return route

@router.post("/", response_model=RouteOut, status_code=201)
def create_route(data: RouteCreate, db: Session = Depends(get_db)):
    return route_repo.create(db, data)

@router.put("/{route_id}", response_model=RouteOut)
def update_route(route_id: int, data: RouteUpdate,
                 db: Session = Depends(get_db)):
    route = route_repo.update(db, route_id, data)
    if not route:
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return route

@router.delete("/{route_id}")
def delete_route(route_id: int, db: Session = Depends(get_db)):
    if not route_repo.delete(db, route_id):
        raise HTTPException(status_code=404, detail="Маршрут не найден")
    return {"detail": "Маршрут удалён"}