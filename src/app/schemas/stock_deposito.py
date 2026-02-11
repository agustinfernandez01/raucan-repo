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
    cantidad_producto: float


#RESPUESTA
class StockDepositoResponse(StockDepositoBase):
    id: int
    actualizado_en: datetime | None
    producto: ProductoSimple
    deposito: DepositoSimple
    model_config = ConfigDict(from_attributes=True)

#CREAR
class StockDepositoCreate(StockDepositoBase):
    id_producto: int
    id_deposito: int

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