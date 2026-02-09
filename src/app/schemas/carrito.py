from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CarritoBase(BaseModel):
    usuario_id: int
    producto_id: int
    cantidad_kg: float
    precio_por_kg: float | None = None


class CarritoCreate(BaseModel):
    """Schema para agregar un ítem al carrito."""
    usuario_id: int
    producto_id: int
    cantidad_kg: float
    precio_por_kg: float | None = None


class CarritoUpdate(BaseModel):
    """Schema para actualizar cantidad (y opcionalmente precio snapshot)."""
    cantidad_kg: float | None = None
    precio_por_kg: float | None = None


class ProductoEnCarrito(BaseModel):
    """Datos mínimos del producto para mostrar en el carrito."""
    id: int
    nombre: str
    precio_por_kg: float

    model_config = ConfigDict(from_attributes=True)


class CarritoResponse(BaseModel):
    """Ítem del carrito."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario_id: int
    producto_id: int
    cantidad_kg: float
    precio_por_kg: float | None
    creado_en: datetime | None = None
