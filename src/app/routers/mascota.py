import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.mascota import MascotaCreate, MascotaResponse, MascotaUpdate
from app.services import mascota as svc_mascota

router = APIRouter()

# Carpeta donde se guardan las fotos de mascotas (src/uploads/mascotas)
UPLOADS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "mascotas"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.get("/", response_model=list[MascotaResponse])
def listar_mascotas(
    usuario_id: int | None = Query(None, description="Filtrar por usuario"),
    db: Session = Depends(get_db),
):
    """Lista mascotas. Sin usuario_id: todas; con usuario_id: solo las de ese usuario."""
    return svc_mascota.listar_mascota(db, usuario_id=usuario_id)


@router.get("/{mascota_id}", response_model=MascotaResponse)
def obtener_mascota(mascota_id: int, db: Session = Depends(get_db)):
    """Obtiene una mascota por id."""
    mascota = svc_mascota.obtener_mascota_id(db, mascota_id)
    if mascota is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return mascota


@router.post("/", response_model=MascotaResponse, status_code=201)
def crear_mascota(datos: MascotaCreate, db: Session = Depends(get_db)):
    """Crea una nueva mascota."""
    return svc_mascota.crear_mascota(db, datos)


@router.patch("/{mascota_id}", response_model=MascotaResponse)
def actualizar_mascota(
    mascota_id: int, datos: MascotaUpdate, db: Session = Depends(get_db)
):
    """Actualiza una mascota (campos opcionales)."""
    mascota = svc_mascota.actualizar_mascota(db, mascota_id, datos)
    if mascota is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return mascota


@router.delete("/{mascota_id}", status_code=204)
def eliminar_mascota(mascota_id: int, db: Session = Depends(get_db)):
    """Elimina una mascota."""
    if not svc_mascota.eliminar_mascota(db, mascota_id):
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return None


@router.patch("/{mascota_id}/foto", response_model=MascotaResponse)
def subir_foto_mascota(
    mascota_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Sube una foto para la mascota. Acepta imagen (jpg, png, gif, webp), máx 5 MB."""
    mascota = svc_mascota.obtener_mascota_id(db, mascota_id)
    if mascota is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")

    # Validar extensión
    sufijo = Path(file.filename or "").suffix.lower()
    if sufijo not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Formato no permitido. Usá: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Leer contenido y validar tamaño
    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="La imagen no puede superar 5 MB",
        )

    # Guardar archivo
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    nombre_archivo = f"{uuid.uuid4()}{sufijo}"
    ruta_archivo = UPLOADS_DIR / nombre_archivo
    ruta_archivo.write_bytes(content)

    # URL que usará el frontend (sin host: /uploads/mascotas/xxx.jpg)
    foto_url = f"/uploads/mascotas/{nombre_archivo}"
    mascota_actualizada = svc_mascota.actualizar_mascota(
        db, mascota_id, MascotaUpdate(foto_url=foto_url)
    )
    return mascota_actualizada
