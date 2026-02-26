from sqlalchemy.orm import Session
from app.models.categoria_producto import CategoriaProducto
from app.schemas.categoria_producto import CategoriaProductoCreate, CategoriaProductoUpdate, CategoriaProductoResponse

def listar_categorias_productos(db: Session) -> list[CategoriaProductoResponse]:
    """Lista todas las categorías de productos."""
    return db.query(CategoriaProducto).all()


def obtener_categoria_producto(db: Session, categoria_producto_id: int) -> CategoriaProductoResponse | None:
    """Obtiene una categoría de producto por su ID. Retorna None si no existe."""
    return db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_producto_id).first()


def crear_categoria_producto(db: Session, categoria_producto: CategoriaProductoCreate) -> CategoriaProductoResponse:
    """Crea una nueva categoría de producto."""
    nueva_categoria = CategoriaProducto(nombre=categoria_producto.nombre, descripcion=categoria_producto.descripcion)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

#ACTUALIZAR CATEGORIA PRODUCTO (TODO)
def actualizar_categoria_producto(db: Session, categoria_producto: CategoriaProductoUpdate) -> CategoriaProductoResponse:
    """Actualiza una categoría de producto."""
    categoria_existente = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_producto.id).first()
    if categoria_existente is None:
        raise ValueError("La categoría de producto no existe")
    categoria_existente.nombre = categoria_producto.nombre
    categoria_existente.descripcion = categoria_producto.descripcion
    db.commit()
    db.refresh(categoria_existente)
    return categoria_existente

def eliminar_categoria_producto(db: Session, categoria_producto_id: int) -> bool:
    """Elimina una categoría de producto."""
    categoria_existente = db.query(CategoriaProducto).filter(CategoriaProducto.id == categoria_producto_id).first()
    if categoria_existente is None:
        return False
    db.delete(categoria_existente)
    db.commit()
    return True