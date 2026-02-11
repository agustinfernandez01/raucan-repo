from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class Deposito(BaseModel):
    id : int
    nombre: str
    descripcion: str
    direccion: str
    ubicacion: str
    estado: bool

class DepositoResponse(Deposito):
    pass

class DepositoCreate(Deposito):
    pass

#Actualizacion Total
class DepositoUpdate(Deposito):
    actualizado_en: datetime

#Actualizacion Parcial
class DepositoPatch(BaseModel):
    id : Optional[int] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    direccion: Optional[str] = None
    ubicacion: Optional[str] = None
    estado: Optional[bool] = None
    actualizado_en: Optional[datetime] = None

class DepositoSimple(BaseModel):
    id: int
    nombre: str
    ConfigDict(from_attributes=True)