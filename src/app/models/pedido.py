from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Pedido(Base):
    """Pedido confirmado: se envía mensaje al admin y se guarda aquí."""

    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    estado = Column(String(50), nullable=False, default="pendiente")  # pendiente, confirmado, enviado, entregado, cancelado
    metodo_pago = Column(String(50), nullable=True)  # efectivo, transferencia
    total = Column(Float, nullable=False)
    direccion_entrega = Column(Text, nullable=True)
    mensaje_enviado = Column(Text, nullable=True)  # texto del mensaje al admin
    canal_mensaje = Column(String(50), nullable=True)  # whatsapp, email
    notas_internas = Column(Text, nullable=True)
    whatsapp_message_id = Column(String(100), nullable=True)  # ID del mensaje de WhatsApp enviado
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())
    metodo_pago = Column(String(50), nullable=False)
    whatsapp_message_id = Column(String(50), nullable=False)

    usuario = relationship("Usuario", back_populates="pedidos")
    detalles = relationship("PedidoDetalle", back_populates="pedido", cascade="all, delete-orphan")


class PedidoDetalle(Base):
    """Ítem de un pedido: producto, cantidad en kg y precio al momento."""

    __tablename__ = "pedido_detalle"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad_kg = Column(Float, nullable=False)
    precio_por_kg = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=True)  # cantidad_kg * precio_por_kg

    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Productos", back_populates="pedido_detalles")
