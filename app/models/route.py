from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.db import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    steps = relationship("Step", back_populates="route",
                         cascade="all, delete-orphan", order_by="Step.id")
    orders = relationship("Order", back_populates="route")