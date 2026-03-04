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
    email: EmailStr
    telefono: str = Field(min_length=1, max_length=255)

#CREAR USUARIO
class UsuarioCreate(UsuarioBase):
    password: str = Field(min_length=8, max_length=255)

#ACTUALIZAR USUARIO (PARCIAL)
class UsuarioPatch(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=255)
    apellido: Optional[str] = Field(default=None, min_length=1, max_length=255)
    email: Optional[EmailStr] = Field(default=None)
    telefono: Optional[str] = Field(default=None, min_length=1, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=255)

#ACTUALIZAR USUARIO (TODO)
class UsuarioUpdate(UsuarioBase):
    password: str = Field(min_length=8, max_length=255)

#RESPUESTA
class UsuarioResponse(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

#RESPUESTA PARA EL COMENTARIO (tabla comentarios)
class UsuarioComent(BaseModel):
    id: int
    nombre: str
    model_config = ConfigDict(from_attributes=True)


