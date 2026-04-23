from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.repositories import user_repo
from app.services.auth_service import (
    verify_password,
    create_access_token,
    decode_token
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = user_repo.get_by_login(db, login=data.login)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль"
        )
    token = create_access_token({"sub": user.login})
    return TokenResponse(access_token=token)


@router.post("/logout")
def logout():
    return {"success": True, "message": "Выход выполнен"}


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    login = decode_token(token)
    if not login:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен недействителен"
        )
    user = user_repo.get_by_login(db, login=login)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден"
        )
    return user
