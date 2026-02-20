from pydantic import BaseModel, EmailStr, Field
from pydantic import ConfigDict
from datetime import datetime
from typing import Optional

#INTERFAZ BASE
class UsuarioBase(BaseModel):
    """Schema para crear un usuario."""
    # datos personales
    nombre: str = Field(min_length=1, max_length=255)
    apellido: str = Field(min_length=1, max_length=255)

    # datos de contacto
    email: EmailStr = Field(pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    telefono: str = Field(min_length=1, max_length=255)

    # datos de seguridad
    rol: str = Field(min_length=1, max_length=255)
    activo: bool = Field(default=True)

#CREAR USUARIO
class UsuarioCreate(UsuarioBase):
    password_hash: str = Field(min_length=8, max_length=255)
    creado_en: datetime = Field(default=datetime.now())

#ACTUALIZAR USUARIO (PARCIAL)
class UsuarioPatch(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=255)
    apellido: Optional[str] = Field(default=None, min_length=1, max_length=255)
    email: Optional[EmailStr] = Field(default=None, pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    telefono: Optional[str] = Field(default=None, min_length=1, max_length=255)
    rol: Optional[str] = Field(default=None, min_length=1, max_length=255)
    activo: Optional[bool] = Field(default=None)    
    actualizado_en: Optional[datetime] = Field(default=datetime.now())
    password: Optional[str] = Field(default=None, min_length=8, max_length=255)

#ACTUALIZAR USUARIO (TODO)
class UsuarioUpdate(UsuarioBase):
    password: str = Field(min_length=8, max_length=255)
    actualizado_en: datetime = Field(default=datetime.now())

#RESPUESTA
class UsuarioResponse(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

#RESPUESTA PARA EL COMENTARIO (tabla comentarios)
class UsuarioComent(BaseModel):
    id: int
    nombre: str
    model_config = ConfigDict(from_attributes=True)


