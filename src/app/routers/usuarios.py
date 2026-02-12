from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
#db
from app.db import get_db
#users schemas
from app.schemas.usuarios import UsuarioCreate, UsuarioUpdate, UsuarioResponse, UsuarioPatch
#users services
from app.services import usuarios as svc_usuarios

router = APIRouter()

#obtener usuarios
@router.get("/get", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    listado_usuarios = svc_usuarios.getAll_usuarios(db)
    if not listado_usuarios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron usuarios")
    return listado_usuarios

#obtener usuario por id
@router.get("/get/{usuario_id}", response_model=UsuarioResponse)
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = svc_usuarios.get_usuario(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return usuario

#crear usuario
@router.post("/post", response_model=UsuarioResponse) 
def new_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    nuevo_usuario = svc_usuarios.create_usuario(db, usuario)
    if not nuevo_usuario:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear usuario")
    return nuevo_usuario

#actualizar usuario completamente
@router.put("/put/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(usuario_id: int, usuario: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario_actualizado = svc_usuarios.update_usuario(db, usuario_id, usuario)
    if not usuario_actualizado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al actualizar usuario")
    return usuario_actualizado

#actualizar usuario parcialmente
@router.patch("/patch/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario_parcial(usuario_id: int, usuario: UsuarioPatch, db: Session = Depends(get_db)):
    usuario_actualizado_p = svc_usuarios.patch_usuario(db, usuario_id, usuario)
    if not usuario_actualizado_p:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al actualizar usuario")
    return usuario_actualizado_p

#eliminar usuario
@router.delete("/delete/{usuario_id}", response_model=UsuarioResponse)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario_eliminado = svc_usuarios.delete_usuario(db, usuario_id)
    if not usuario_eliminado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al eliminar usuario")
    return usuario_eliminado


