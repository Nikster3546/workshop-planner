from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.route import RouteOut

class OrderCreate(BaseModel):
    name: str
    route_id: int
    start_after: datetime
    end_before: datetime

class OrderUpdate(BaseModel):
    name: Optional[str] = None
    route_id: Optional[int] = None
    start_after: Optional[datetime] = None
    end_before: Optional[datetime] = None

class OrderOut(BaseModel):
    id: int
    name: str
    route_id: int
    start_after: datetime
    end_before: datetime
    route: Optional[RouteOut] = None
    model_config = {"from_attributes": True}