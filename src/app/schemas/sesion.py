from pydantic import BaseModel
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expiracion_en: datetime


class SesionResponse(BaseModel):
    id: int
    usuario_id: int
    creado_en: datetime
    expiracion_en: datetime
    revocado: bool

    class Config:
        from_attributes = True