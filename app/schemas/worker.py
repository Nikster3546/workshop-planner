from pydantic import BaseModel
from typing import Optional

class WorkerCreate(BaseModel):
    name: str
    skill: Optional[str] = None
    status: bool = True

class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    skill: Optional[str] = None
    status: Optional[bool] = None

class WorkerOut(BaseModel):
    id: int
    name: str
    skill: Optional[str]
    status: bool
    model_config = {"from_attributes": True}