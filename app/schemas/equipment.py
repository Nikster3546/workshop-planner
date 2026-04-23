from pydantic import BaseModel
from typing import Optional

class EquipmentCreate(BaseModel):
    name: str
    type: str
    status: bool = True

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    status: Optional[bool] = None

class EquipmentOut(BaseModel):
    id: int
    name: str
    type: str
    status: bool
    model_config = {"from_attributes": True}