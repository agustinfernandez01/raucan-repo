from app.schemas.comentarios import ComentariosResponse,
ComentariosCreate, ComentarioCreateResponse, 
ComentariosUpdate, ComentarioUpdateResponse, 

from app.models.comentarios import Comentarios, Usuario
from sqlalchemy.orm import Session

#listar todos los comentarios (GET)
def listar_comentarios(db: Session) -> list[ComentariosResponse]:
    response = db.query(Comentarios).options(joinedload(Comentarios.usuario)).all()
    if not response:
        raise ValueError("No se encontraron comentarios")
    return response

#obtener un comentario por su id (GET)
def obtener_comentario_por_id(db: Session, id: int) -> ComentariosResponse:
    response = db.query(Comentarios).options(joinedload(Comentarios.usuario)).filter(Comentarios.id == id).first()
    if not response:
        raise ValueError("No se encontró el comentario")
    return response

#crear un nuevo comentario (POST)
def crear_comentario(
    db: Session,
    id_usuario: int,
    comentario: ComentariosCreate
) -> ComentarioCreateResponse:
    
    #chequear si el usuario existe
    usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if not usuario:
        raise ValueError("Usuario no encontrado")

    #crear el comentario
    nuevo_comentario = Comentarios(
        id_usuario=id_usuario,
        contenido=comentario.contenido,
        creado_en=datetime.utcnow()
    )

    #guardar el comentario en la base de datos
    db.add(nuevo_comentario)
    db.commit()
    db.refresh(nuevo_comentario)

    return nuevo_comentario

#actualizar un comentario (PUT)q
def actualizar_comentario(db: Session, id: int, comentario: ComentariosUpdate) -> ComentarioUpdateResponse:
    comentario_por_actualizar = (
        db.query(Comentarios)
        .options(joinedload(Comentarios.usuario))
        .filter(Comentarios.id == id)
        .first()
    )

    # comprobar que el comentario existe
    if not comentario_por_actualizar:
        raise ValueError("Comentario inexistente")

    comentario_por_actualizar.contenido = comentario.contenido
    comentario_por_actualizar.actualizado_en = datetime.utcnow()

    db.commit()
    db.refresh(comentario_por_actualizar)

    return comentario_por_actualizar

#eliminar un comentario (DELETE)
def eliminar_comentario(db: Session, id: int) -> dict:
    comentario_por_eliminar = db.query(Comentarios).filter(Comentarios.id == id).first()
    if not comentario_por_eliminar:
        raise ValueError("Comentario inexistente")
    db.delete(comentario_por_eliminar)
    db.commit()
    return {"mensaje": "Comentario eliminado correctamente"}

    






