from sqlalchemy.orm import Session
from app.models.categoria_producto import CategoriaProducto
from app.schemas.categoria_producto import CategoriaProductoCreate, CategoriaProductoUpdate, CategoriaProductoResponse

def listar_categorias_productos(db: Session) -> list[CategoriaProductoResponse]:
    """Lista todas las categorías de productos."""
    return db.query(CategoriaProducto).all()

def crear_categoria_producto(db: Session, categoria_producto: CategoriaProductoCreate) -> CategoriaProductoResponse:
    """Crea una nueva categoría de producto."""
    if db.query(CategoriaProducto).filter(CategoriaProducto.nombre == categoria_producto.nombre).first():
        raise ValueError("La categoría de producto ya existe")
    nueva_categoria = CategoriaProducto(nombre=categoria_producto.nombre, descripcion=categoria_producto.descripcion)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return CategoriaProductoResponse.model_validate(nueva_categoria)

#ACTUALIZAR CATEGORIA PRODUCTO (TODO)
def actualizar_categoria_producto(db: Session, categoria_producto: CategoriaProductoUpdate) -> CategoriaProductoResponse:
    categoria_existente = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_producto.id).first()
    if categoria_existente is None:
        raise ValueError("La categoría de producto no existe")

    nombre = categoria_producto.nombre.strip()

    # Evitar duplicado de nombre (excluyendo la misma categoría)
    existe_otro = db.query(CategoriaProducto).filter(
        CategoriaProducto.nombre == nombre,
        CategoriaProducto.id != categoria_producto.id
    ).first()
    if existe_otro:
        raise ValueError("Ya existe otra categoría con ese nombre")

    categoria_existente.nombre = nombre
    categoria_existente.descripcion = categoria_producto.descripcion

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Ya existe otra categoría con ese nombre")

    db.refresh(categoria_existente)
    return CategoriaProductoResponse.model_validate(categoria_existente)

def eliminar_categoria_producto(db: Session, categoria_producto_id: int) -> bool:
    """Elimina una categoría de producto."""
    categoria_existente = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_producto_id).first()
    if categoria_existente is None:
        return False
    db.delete(categoria_existente)
    db.commit()
    return True