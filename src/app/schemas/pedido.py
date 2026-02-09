from datetime import datetime

from pydantic import BaseModel, ConfigDict


# --- Detalle del pedido ---


class PedidoDetalleBase(BaseModel):
    producto_id: int
    cantidad_kg: float
    precio_por_kg: float


class PedidoDetalleCreate(PedidoDetalleBase):
    """Schema para un ítem al crear/actualizar pedido."""


class PedidoDetalleResponse(BaseModel):
    """Ítem de un pedido en la respuesta."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    pedido_id: int
    producto_id: int
    cantidad_kg: float
    precio_por_kg: float
    subtotal: float | None


# --- Pedido ---


class PedidoBase(BaseModel):
    usuario_id: int
    estado: str = "pendiente"
    total: float
    direccion_entrega: str | None = None
    mensaje_enviado: str | None = None
    canal_mensaje: str | None = None
    notas_internas: str | None = None


class PedidoCreate(BaseModel):
    """Schema para crear un pedido con sus detalles."""
    usuario_id: int
    direccion_entrega: str | None = None
    mensaje_enviado: str | None = None
    canal_mensaje: str | None = None
    notas_internas: str | None = None
    detalles: list[PedidoDetalleCreate]

    # total se calcula en el servicio a partir de los detalles


class PedidoUpdate(BaseModel):
    """Schema para actualizar un pedido (estado, dirección, etc.)."""
    estado: str | None = None
    direccion_entrega: str | None = None
    mensaje_enviado: str | None = None
    canal_mensaje: str | None = None
    notas_internas: str | None = None


class PedidoResponse(BaseModel):
    """Pedido en la respuesta, sin detalles anidados por defecto."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario_id: int
    estado: str
    total: float
    direccion_entrega: str | None
    mensaje_enviado: str | None
    canal_mensaje: str | None
    notas_internas: str | None
    creado_en: datetime | None = None
    actualizado_en: datetime | None = None


class PedidoConDetallesResponse(PedidoResponse):
    """Pedido con la lista de detalles (para GET por id)."""
    detalles: list[PedidoDetalleResponse] = []
