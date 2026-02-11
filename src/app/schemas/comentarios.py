from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.schemas.usuarios import UsuarioComent|

#INTERFAZ BASE
class ComentariosBase(BaseModel):
    contenido: str

#RESPUESTA PARA LISTAR TODOS LOS COMENTARIOS
class ComentariosResponse(ComentariosBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario: UsuarioComent

#CREAR REQUEST Y RESPONSE
class ComentariosCreate(ComentariosBase):
    pass

class ComentarioCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario: UsuarioComent
    contenido: str
    creado_en: datetime
    

#ACTUALIZAR REQUEST Y RESPONSE
class ComentariosUpdate(BaseModel):
    contenido: Optional[str] = Field(default=None, min_length=1, max_length=255)

class ComentarioUpdateResponse(ComentariosResponse):
    model_config = ConfigDict(from_attributes=True)
    actualizado_en: datetime



    




