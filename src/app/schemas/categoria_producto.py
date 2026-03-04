from pydantic import BaseModel, ConfigDict

class CategoriaProductoBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class CategoriaProductoCreate(CategoriaProductoBase):
    pass

class CategoriaProductoUpdate(CategoriaProductoBase):
    pass

class CategoriaProductoResponse(CategoriaProductoBase):
    class Config:
        from_attributes = True

class CategoriaProductoSimple(CategoriaProductoBase):
    nombre: str
    descripcion: str | None = None
    model_config = ConfigDict(from_attributes=True)

