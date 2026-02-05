from pydantic import BaseModel, ConfigDict


class ProductoBase(BaseModel):
    nombre: str
    precio_por_kg: float


class ProductoResponse(ProductoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
