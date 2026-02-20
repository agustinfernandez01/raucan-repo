from pydantic import BaseModel

class CategoriaProductoBase(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None
