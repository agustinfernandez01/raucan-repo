from sqlalchemy.orm import Session

from app.models import mascota as models_mascota
from app.schemas.mascota import MascotaCreate, MascotaUpdate


def listar_mascota(db: Session, usuario_id: int | None = None):
    """
    Lista mascotas. Si se pasa usuario_id, solo las de ese usuario.
    Si no, todas (útil para admin).
    """
    q = db.query(models_mascota.Mascota)
    if usuario_id is not None:
        q = q.filter(models_mascota.Mascota.usuario_id == usuario_id)
    return q.all()


def obtener_mascota_id(db: Session, mascota_id: int):
    """Obtiene una mascota por id. Retorna None si no existe."""
    return (
        db.query(models_mascota.Mascota)
        .filter(models_mascota.Mascota.id == mascota_id)
        .first()
    )


def crear_mascota(db: Session, datos: MascotaCreate):
    """Crea una nueva mascota."""
    mascota = models_mascota.Mascota(**datos.model_dump())
    db.add(mascota)
    db.commit()
    db.refresh(mascota)
    return mascota


def actualizar_mascota(db: Session, mascota_id: int, datos: MascotaUpdate):
    """Actualiza una mascota. Retorna la mascota actualizada o None si no existe."""
    mascota = obtener_mascota_id(db, mascota_id)
    if mascota is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(mascota, key, value)
    db.commit()
    db.refresh(mascota)
    return mascota


def eliminar_mascota(db: Session, mascota_id: int) -> bool:
    """Elimina una mascota. Retorna True si existía, False si no."""
    mascota = obtener_mascota_id(db, mascota_id)
    if mascota is None:
        return False
    db.delete(mascota)
    db.commit()
    return True
