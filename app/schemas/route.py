from pydantic import BaseModel
from typing import List, Optional

class StepCreate(BaseModel):
    name: str
    worker_type: str
    equipment_type: Optional[str] = None
    duration: int

class StepOut(StepCreate):
    id: int
    route_id: int
    model_config = {"from_attributes": True}

class RouteCreate(BaseModel):
    name: str
    steps: List[StepCreate] = []

class RouteUpdate(BaseModel):
    name: Optional[str] = None

class RouteOut(BaseModel):
    id: int
    name: str
    steps: List[StepOut] = []
    model_config = {"from_attributes": True}