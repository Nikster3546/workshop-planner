from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional

def get_by_login(db: Session, login: str) -> Optional[User]:
    return db.query(User).filter(User.login == login).first()

def create_user(db: Session, login: str, hashed_password: str) -> User:
    user = User(login=login, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
