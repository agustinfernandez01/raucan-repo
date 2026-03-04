from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.productos import ProductoSimple
from app.schemas.deposito import DepositoSimple
from pydantic import ConfigDict

#INTERFAZ BASE
class StockDepositoBase(BaseModel):
    id: int
    nombre: str
    descripcion: str
    producto: ProductoSimple
    deposito: DepositoSimple
    nombre : str
    descripcion : str
    cantidad_producto : int 
    actualizado_en : datetime


#RESPUESTA
class StockDepositoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str
    producto: ProductoSimple
    deposito: DepositoSimple
    nombre : str
    cantidad_producto : int 
   

#CREAR
class StockDepositoCreate(BaseModel):
    nombre: str
    descripcion: str
    id_producto: int
    id_deposito: int
    cantidad_producto: int


#ACTUALIZAR Parcial
class StockDepositoPatch(BaseModel):
    id_producto: ProductoSimple | None = None
    id_deposito: DepositoSimple | None = None
    cantidad_producto: int | None = None
    nombre: str | None = None
    descripcion: str | None = None

#ACTUALIZAR Total
class StockDepositoUpdate(StockDepositoBase):
    pass

#ELIMINAR
class StockDepositoDelete(BaseModel):
    pass 