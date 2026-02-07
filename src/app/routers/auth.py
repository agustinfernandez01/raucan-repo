from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.login import LoginRequest, TokenResponse
from app.services import auth 

router = APIRouter()
# LOGIN
@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = auth.autenticar_usuario(db, data.email, data.password)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )
    token = svc_auth.crear_token(usuario.id)
    return TokenResponse(access_token=token)
