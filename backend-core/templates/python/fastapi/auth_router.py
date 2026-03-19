// TEMPLATE_META:START
/*
@template-id: python-auth-router
@version: 1.0.0
@description: OAuth2 Authentication Router with JWT
@dependencies: python-jose, passlib, fastapi
@customization-points: SECRET_KEY
@language: python
@framework: FastAPI
*/
// TEMPLATE_META:END

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt

router = APIRouter()

SECRET_KEY = "{{SECRET_KEY}}"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Verify user logic here
    # user = authenticate_user(form_data.username, form_data.password)
    # if not user: raise HTTPException(...)
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}
