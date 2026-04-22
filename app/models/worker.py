from sqlalchemy import Column, Integer, String, Boolean
from app.models.db import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    skill = Column(String, nullable=True)
    status = Column(Boolean, default=True)