from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.usuarios import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.services import usuarios as svc_usuarios

router = APIRouter()

#obtener usuario por id
@router.get("/get-usuarios", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = svc_usuarios.getAll_usuarios(db)
    if not usuarios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron usuarios")
    return usuarios

#crear usuario
@router.post("/post-usuario", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    nuevo_usuario = svc_usuarios.crear_usuario(db, usuario)
    if not nuevo_usuario:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear usuario")
    return nuevo_usuario

#actualizar usuario
@router.put("/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(usuario_id: int, usuario: UsuarioUpdate, db: Session = Depends(get_db)):
    try:
        usuario = svc_usuarios.actualizar_usuario(db, usuario_id, usuario)
        return usuario
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    if not usuario:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al actualizar usuario")
    return usuario  

