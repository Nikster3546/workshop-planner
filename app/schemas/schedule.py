from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.worker import WorkerOut
from app.schemas.equipment import EquipmentOut

class ScheduleRunRequest(BaseModel):
    date_from: datetime
    date_to: datetime

class ScheduleItemOut(BaseModel):
    id: int
    order_id: int
    step_id: int
    worker_id: int
    equipment_id: int
    start_time: datetime
    end_time: datetime
    worker: Optional[WorkerOut] = None
    equipment: Optional[EquipmentOut] = None
    model_config = {"from_attributes": True}

class ScheduleRunResult(BaseModel):
    created: int
    skipped: int
    message: str