from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class MascotaBase(BaseModel):
    usuario_id: int
    nombre: str
    especie: str | None = None
    raza: str | None = None
    fecha_nacimiento: date | None = None
    peso_kg: float | None = None
    notas: str | None = None
    foto_url: str | None = None


class MascotaCreate(MascotaBase):
    """Schema para crear una mascota."""


class MascotaUpdate(BaseModel):
    """Schema para actualizar una mascota (todos los campos opcionales)."""
    nombre: str | None = None
    especie: str | None = None
    raza: str | None = None
    fecha_nacimiento: date | None = None
    peso_kg: float | None = None
    notas: str | None = None
    foto_url: str | None = None


class MascotaResponse(MascotaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    creado_en: datetime | None = None
    actualizado_en: datetime | None = None
