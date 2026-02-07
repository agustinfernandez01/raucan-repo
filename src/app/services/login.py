import bcrypt
import jwt
from sqlalchemy.orm import Session
from app.models import Usuario
from app.schemas import LoginRequest, LoginResponse
from fastapi import HTTPException
from datetime import datetime, timezone, timedelta
import os

def Logueo(db: Session, login_request: LoginRequest) -> LoginResponse:
    usuario = db.query(Usuario).filter(Usuario.email == login_request.email).first()

    # Seguridad: no revelar qué falló
    if not usuario or not bcrypt.checkpw(
        login_request.password.encode("utf-8"),
        usuario.password_hash.encode("utf-8"),
    ):
        raise ValueError("Credenciales inválidas")

    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET no configurado")

    token = jwt.encode(
        {
            "sub": str(usuario.id),
            "role": usuario.rol,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        },
        secret,
        algorithm="HS256",
    )

    return LoginResponse(access_token=token, token_type="bearer")

    

    