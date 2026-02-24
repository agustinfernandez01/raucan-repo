from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Float, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Producto(Base):
    """Producto: comida de animales vendida por kg."""

    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio_por_kg = Column("precio_por_kg", Float, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria_producto.id"), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    categoria_rel = relationship("CategoriaProducto", back_populates="productos")
    carrito = relationship("Carrito", back_populates="producto")
    pedido_detalles = relationship("PedidoDetalle", back_populates="producto")

    @property
    def categoria(self) -> str | None:
        """Devuelve el nombre de la categoría para compatibilidad."""
        return self.categoria_rel.nombre if self.categoria_rel else None
