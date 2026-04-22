from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.db import Base

class Step(Base):
    __tablename__ = "steps"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    name = Column(String, nullable=False)
    worker_type = Column(String, nullable=False)
    equipment_type = Column(String, nullable=True)
    duration = Column(Integer, nullable=False)  # минуты

    route = relationship("Route", back_populates="steps")