from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Comentario(Base):
    """Comentario: reseña de producto, consulta o soporte."""

    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=True)
    tipo = Column(String(50), nullable=True)  # resena_producto, consulta, soporte
    contenido = Column(Text, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="comentarios")
    producto = relationship("Producto", back_populates="comentarios")
    pedido = relationship("Pedido", back_populates="comentarios")
