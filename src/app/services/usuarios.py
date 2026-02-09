from sqlalchemy.orm import Session
from app.models import usuario as models_usuario
from fastapi import HTTPException, status
from datetime import datetime
from app.schemas.usuarios import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.services import hash_password

#listar usuarios
def getAll_usuarios(db: Session) -> list[UsuarioResponse]:
    """Lista todos los usuarios."""
    return db.query(models_usuario.Usuario).all()

#obtener usuario
def get_usuario(db: Session, usuario_id: int) -> UsuarioResponse:
    """Obtiene un usuario por su ID."""
    return db.query(models_usuario.Usuario).filter(models_usuario.Usuario.id == usuario_id).first()

#crear usuario
def crear_usuario(db: Session, usuario: UsuarioCreate):
    # 1) Chequear si existe el email (query eficiente)
    existe = db.query(models_usuario.Usuario).filter(
        models_usuario.Usuario.email == usuario.email
    ).first()

    if existe:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El email ya está en uso"
        )
    # 2) Crear usuario
    db_usuario = models_usuario.Usuario(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        password_hash=hash_password(usuario.password),  # asumiendo que UsuarioCreate tiene password
        telefono=usuario.telefono,
        direccion=usuario.direccion,
        rol=usuario.rol,
        activo=usuario.activo,
        creado_en=datetime.now(),
    )

    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

#actualizar usuario
def actualizar_usuario(db: Session, usuario_id: int, usuario: UsuarioUpdate) -> UsuarioResponse:
    """Actualiza un usuario existente."""
    db_usuario = db.query(models_usuario.Usuario).filter(models_usuario.Usuario.id == usuario_id).first()
    if not db_usuario:
        return None
    db_usuario.nombre = usuario.nombre
    db_usuario.apellido = usuario.apellido
    db_usuario.email = usuario.email
    db_usuario.password_hash = usuario.password_hash
    db_usuario.telefono = usuario.telefono
    db_usuario.direccion = usuario.direccion
    db_usuario.rol = usuario.rol
    db_usuario.activo = usuario.activo
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

    