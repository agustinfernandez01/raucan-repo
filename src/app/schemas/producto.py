from pydantic import BaseModel, ConfigDict


class ProductoBase(BaseModel):
    nombre: str
    precio_por_kg: float
    descripcion: str | None = None
    categoria: str | None = None
    imagen_url: str | None = None
    activo: bool = True


class ProductoCreate(ProductoBase):
    """Schema para crear un producto."""


class ProductoUpdate(BaseModel):
    """Schema para actualizar un producto (todos los campos opcionales)."""
    nombre: str | None = None
    precio_por_kg: float | None = None
    descripcion: str | None = None
    categoria: str | None = None
    imagen_url: str | None = None
    activo: bool | None = None


class ProductoResponse(ProductoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
