from sqlalchemy import Column, Integer, String, Boolean
from app.models.db import Base

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(Boolean, default=True)