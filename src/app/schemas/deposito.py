from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class Deposito(BaseModel):
    id: int
    nombre: str
    descripcion: str
    direccion: str
    ubicacion: str
    estado: bool

class DepositoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str
    direccion: str
    ubicacion: str
    estado: bool


class DepositoCreate(BaseModel):
    nombre: str
    descripcion: str
    direccion: str
    ubicacion: str
    estado: bool

#Actualizacion Total
class DepositoUpdate(BaseModel):
    nombre: Optional[str]
    descripcion: Optional[str]
    direccion: Optional[str] 
    ubicacion: Optional[str] 
    estado: Optional[bool] 
    actualizado_en: Optional[datetime] 

#Actualizacion Parcial
class DepositoPatch(BaseModel):
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