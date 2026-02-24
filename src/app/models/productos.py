from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Productos(Base):
    """Productos: comida de animales vendida por kg."""

    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio_por_kg = Column(Float, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categoria_producto.id"), nullable=True)  # perro, gato, snack
    activo = Column(Boolean, default=True, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    categoria_rel = relationship("CategoriaProducto", back_populates="productos")
    carrito = relationship("Carrito", back_populates="producto")
    pedido_detalles = relationship("PedidoDetalle", back_populates="producto")
    categoria_producto = relationship("CategoriaProducto", back_populates="productos")
