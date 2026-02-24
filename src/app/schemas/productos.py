<<<<<<< HEAD
from pydantic import BaseModel, ConfigDict
from app.schemas.categoria_producto import CategoriaProductoSimple
=======
from pydantic import BaseModel, ConfigDict, computed_field

>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16

class ProductoBase(BaseModel):
    nombre: str
    precio_por_kg: float
    descripcion: str | None = None
<<<<<<< HEAD
    categoria_producto: CategoriaProductoSimple | None = None
    imagen_url: str | None = None
=======
    categoria_id: int
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
    activo: bool = True


class ProductoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    precio_por_kg: float
    descripcion: str | None = None
    categoria_id: int
    categoria: str | None = None
    activo: bool = True


class ProductoCreate(ProductoBase):
    """Schema para crear un producto."""


class ProductoUpdate(ProductoBase):
    """Schema para actualizar un producto (todos los campos obligatorios)."""
    pass


class ProductoPatch(BaseModel):
    """Schema para actualizar un producto (todos los campos opcionales)."""
    nombre: str | None = None
    precio_por_kg: float | None = None
    descripcion: str | None = None
<<<<<<< HEAD
    categoria_producto: CategoriaProductoSimple | None = None
    imagen_url: str | None = None
=======
    categoria_id: int | None = None
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
    activo: bool | None = None


class ProductoSimple(BaseModel):
    id: int
    nombre: str
    model_config = ConfigDict(from_attributes=True)
