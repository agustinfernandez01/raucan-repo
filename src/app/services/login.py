import bcrypt
import jwt
from sqlalchemy.orm import Session
from app.models import Usuario
from app.schemas import LoginRequest, LoginResponse
from fastapi import HTTPException, status
from datetime import datetime, timezone, timedelta
import os
import os, re


def normalizar_tel(t: str) -> str:
    return re.sub(r"\D", "", t)  # deja solo dígitos

def normalizar_email(e: str) -> str:
    return e.strip().lower()

def Logueo(db: Session, login_request: LoginRequest) -> LoginResponse:
    email = normalizar_email(login_request.email)

    usuario = (
        db.query(Usuario)
        .filter(Usuario.email == email)
        .first()
    )

    # Seguridad: no revelar qué falló
    if not usuario or not bcrypt.checkpw(
        login_request.password.encode("utf-8"),
        usuario.password_hash.encode("utf-8"),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )

    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET no configurado")

    token = jwt.encode(
        {
            "sub": str(usuario.id),
            "role": usuario.rol,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
            "iat": datetime.now(timezone.utc),
        },
        secret,
        algorithm="HS256",
    )

    return LoginResponse(access_token=token, token_type="bearer")

    

    