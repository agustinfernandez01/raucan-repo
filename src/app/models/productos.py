<<<<<<< HEAD
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
=======
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Float, Integer, String, Text
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Productos(Base):
    """Productos: comida de animales vendida por kg."""

    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
<<<<<<< HEAD
    precio_por_kg = Column(Float, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria_producto.id"), nullable=True)  # perro, gato, snack
=======
    precio_por_kg = Column("precio_por_kg", Float, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria_producto.id"), nullable=False)
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
    activo = Column(Boolean, default=True, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    categoria_rel = relationship("CategoriaProducto", back_populates="productos")
    carrito = relationship("Carrito", back_populates="producto")
    pedido_detalles = relationship("PedidoDetalle", back_populates="producto")
<<<<<<< HEAD
    categoria_producto = relationship("CategoriaProducto", back_populates="productos")
=======

    @property
    def categoria(self) -> str | None:
        """Devuelve el nombre de la categoría para compatibilidad."""
        return self.categoria_rel.nombre if self.categoria_rel else None
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
