from sqlalchemy.orm import Session
from app.models import usuario as models_usuario
from fastapi import HTTPException, status
from datetime import datetime
from app.schemas.usuarios import UsuarioCreate, UsuarioPatch, UsuarioResponse , UsuarioUpdate
from app.services import hash_password

#LISTAR USUARIOS
def getAll_usuarios(db: Session) -> list[UsuarioResponse]:
    """Lista todos los usuarios."""
    return db.query(models_usuario.Usuario).all()

#OBTENER USUARIO POR ID
def get_usuario(db: Session, usuario_id: int) -> UsuarioResponse:
    """Obtiene un usuario por su ID."""
    return db.query(models_usuario.Usuario).filter(models_usuario.Usuario.id == usuario_id).first()

#CREAR USUARIO
def create_usuario(db: Session, usuario: UsuarioCreate):
    # 1) Chequear si existe el email (query eficiente)
    existe = db.query(models_usuario.Usuario).filter(
        models_usuario.Usuario.email == usuario.email
    ).first()

    if existe:
        raise ValueError("Error, usuario ya existe")
    # 2) Crear usuario
    db_usuario = models_usuario.Usuario(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        password_hash=hash_password(usuario.password_hash), 
        telefono=usuario.telefono,
        rol=usuario.rol,
        activo=usuario.activo,
        creado_en=datetime.now(),
    )

    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario


#ACTUALIZAR USUARIO (PARCIAL)
def patch_usuario(db: Session, usuario_id: int, usuario: UsuarioPatch) -> UsuarioResponse:
    db_usuario = db.query(models_usuario.Usuario).filter(models_usuario.Usuario.id == usuario_id).first()
    if not db_usuario:
        raise ValueError("Error, usuario inexistente")

    # chequear si el email ya existe (excluyendo este usuario)
    if usuario.email:
        existe = db.query(models_usuario.Usuario).filter(
            models_usuario.Usuario.email == usuario.email,
            models_usuario.Usuario.id != usuario_id
        ).first()
        if existe:
            raise ValueError("Error, email ya existe")

    # actualizar campos (sin password)
    data = usuario.model_dump(exclude_unset=True, exclude={"password"})
    for key, value in data.items():
        setattr(db_usuario, key, value)

    # hashear password si es necesario
    if usuario.password:
        db_usuario.password_hash = hash_password(usuario.password)

    db_usuario.actualizado_en = datetime.now()
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

#ACTUALIZAR USUARIO (TODO)
def update_usuario(db: Session, usuario_id: int, usuario: UsuarioUpdate) -> UsuarioResponse:
    db_usuario = db.query(models_usuario.Usuario).filter(models_usuario.Usuario.id == usuario_id).first()

    if not db_usuario:
        raise ValueError("Error, usuario inexistente")
    # chequear si el email ya existe
    if usuario.email != db_usuario.email:
        existe = db.query(models_usuario.Usuario).filter(
            models_usuario.Usuario.email == usuario.email,
            models_usuario.Usuario.id != usuario_id
        ).first()
        if existe:
            raise ValueError("Error, email ya existe")
    
    # actualizar usuario
    db_usuario.nombre = usuario.nombre
    db_usuario.apellido = usuario.apellido
    db_usuario.email = usuario.email
    db_usuario.password_hash = hash_password(usuario.password)
    db_usuario.telefono = usuario.telefono
    db_usuario.rol = usuario.rol
    db_usuario.activo = usuario.activo
    db_usuario.actualizado_en = datetime.now()
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

 

#eliminar usuario
def delete_usuario(db: Session, usuario_id: int) -> UsuarioResponse:
    """Elimina un usuario existente."""
    db_usuario = db.query(models_usuario.Usuario).filter(models_usuario.Usuario.id == usuario_id).first()
    if not db_usuario:
        raise ValueError("Usuario no encontrado")
    db.delete(db_usuario)
    db.commit()
    return db_usuario