from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.db import Base

class Schedule(Base):
    __tablename__ = "schedule"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    step_id = Column(Integer, ForeignKey("steps.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    order = relationship("Order", back_populates="schedule_items")
    step = relationship("Step")
    worker = relationship("Worker")
    equipment = relationship("Equipment")