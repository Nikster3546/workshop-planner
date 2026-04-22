from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.db import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    start_after = Column(DateTime, nullable=False)
    end_before = Column(DateTime, nullable=False)

    route = relationship("Route", back_populates="orders")
    schedule_items = relationship("Schedule", back_populates="order",
                                  cascade="all, delete-orphan")