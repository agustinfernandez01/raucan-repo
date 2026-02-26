from pydantic import BaseModel, ConfigDict, model_validator

class ProductoBase(BaseModel):
    nombre: str
    precio_por_kg: float
    descripcion: str | None = None
    categoria_id: int
    activo: bool = True


class ProductoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    precio_por_kg: float
    descripcion: str | None = None
    categoria_id: int | None = None
    categoria: str | None = None
    activo: bool = True

    @model_validator(mode='before')
    @classmethod
    def from_orm_with_categoria(cls, data):
        """Rellena 'categoria' desde la relación categoria_producto si viene un ORM."""
        if hasattr(data, 'categoria_producto'):
            cat = getattr(data, 'categoria_producto', None)
            nombre_cat = cat.nombre if cat else None
            return {
                'id': data.id,
                'nombre': data.nombre,
                'precio_por_kg': data.precio_por_kg,
                'descripcion': data.descripcion,
                'categoria_id': getattr(data, 'categoria_id', None),
                'categoria': nombre_cat,
                'activo': getattr(data, 'activo', True),
            }
        return data


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
    categoria_id: int | None = None
    activo: bool | None = None


class ProductoSimple(BaseModel):
    id: int
    nombre: str
    model_config = ConfigDict(from_attributes=True)
