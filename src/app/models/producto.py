from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Producto(Base):
    """Producto: comida de animales vendida por kg."""

    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio_por_kg = Column(Float, nullable=False)
    categoria = Column(String(100), nullable=True)  # perro, gato, snack
    imagen_url = Column(String(500), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    carrito = relationship("Carrito", back_populates="producto")
    depositos = relationship("Deposito", back_populates="producto")
    pedido_detalles = relationship("PedidoDetalle", back_populates="producto")
    comentarios = relationship("Comentario", back_populates="producto")