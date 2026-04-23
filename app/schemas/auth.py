from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    login: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class TokenData(BaseModel):
    login: Optional[str] = None


