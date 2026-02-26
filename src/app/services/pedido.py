from sqlalchemy.orm import Session

from app.models import pedido as models_pedido
from app.models.productos import Productos
from app.schemas.pedido import (
    PedidoCreate,
    PedidoDetalleCreate,
    PedidoDetalleUpdate,
    PedidoUpdate,
)
from app.services import whatsapp as svc_whatsapp
from app.services import usuarios as svc_usuarios


def listar(db: Session, usuario_id: int | None = None):
    """
    Lista pedidos. Si se pasa usuario_id, filtra por ese usuario.
    Si no, devuelve todos (útil para admin).
    """
    q = db.query(models_pedido.Pedido)
    if usuario_id is not None:
        q = q.filter(models_pedido.Pedido.usuario_id == usuario_id)
    return q.order_by(models_pedido.Pedido.creado_en.desc()).all()


def obtener_por_id(db: Session, pedido_id: int):
    """Obtiene un pedido por id (con detalles). Retorna None si no existe."""
    return (
        db.query(models_pedido.Pedido)
        .filter(models_pedido.Pedido.id == pedido_id)
        .first()
    )


def crear(db: Session, datos: PedidoCreate, enviar_whatsapp: bool = True):
    """
    Crea un pedido con sus detalles. Calcula total y subtotales
    a partir de cantidad_kg * precio_por_kg de cada ítem.
    Opcionalmente envía mensaje de WhatsApp al cliente.
    """
    total = 0.0
    for d in datos.detalles:
        total += d.cantidad_kg * d.precio_por_kg

    pedido = models_pedido.Pedido(
        usuario_id=datos.usuario_id,
        estado="pendiente",
        total=round(total, 2),
        direccion_entrega=datos.direccion_entrega,
        mensaje_enviado=datos.mensaje_enviado,
        canal_mensaje=datos.canal_mensaje,
        notas_internas=datos.notas_internas,
    )
    db.add(pedido)
    db.flush()  # para tener pedido.id antes de crear detalles

    productos_resumen = []
    for d in datos.detalles:
        subtotal = round(d.cantidad_kg * d.precio_por_kg, 2)
        detalle = models_pedido.PedidoDetalle(
            pedido_id=pedido.id,
            producto_id=d.producto_id,
            cantidad_kg=d.cantidad_kg,
            precio_por_kg=d.precio_por_kg,
            subtotal=subtotal,
        )
        db.add(detalle)
        productos_resumen.append(f"• {d.cantidad_kg} kg (${subtotal:,.2f})")

    db.commit()
    db.refresh(pedido)

    # Enviar WhatsApp al cliente que hizo el pedido (su teléfono = usuario.telefono)
    if enviar_whatsapp:
        try:
            usuario = svc_usuarios.get_usuario(db, pedido.usuario_id)
            if usuario and usuario.telefono:
                resumen_texto = "\n".join(productos_resumen)
                nombre_cliente = (usuario.nombre or "").strip() or "Cliente"
                telefono_display = svc_whatsapp._formatear_telefono_para_display(usuario.telefono)
                direccion = (pedido.direccion_entrega or "").strip() or ""
                total_formateado = f"${pedido.total:,.0f}".replace(",", ".")  # ej. $24.500

                # Lista de productos con nombre para la plantilla (ej. "Pack 5kg BARF para perro: $24.500")
                product_ids = [d.producto_id for d in pedido.detalles]
                id_a_nombre = {}
                if product_ids:
                    for p in db.query(Productos).filter(Productos.id.in_(product_ids)).all():
                        id_a_nombre[p.id] = p.nombre
                lineas_productos = []
                for d in pedido.detalles:
                    nombre_prod = id_a_nombre.get(d.producto_id) or f"Producto {d.producto_id}"
                    subtotal_str = f"${(d.subtotal or 0):,.0f}".replace(",", ".")
                    lineas_productos.append(f"{nombre_prod}: {subtotal_str}")
                productos_texto = "\n".join(lineas_productos)

                # Enviar plantilla "resumen de pedido" (Pedido #, Nombre, Teléfono, Dirección, Total, Tu pedido + botones Efectivo/Transferencia)
                try:
                    resultado = svc_whatsapp.enviar_template_resumen_pedido(
                        telefono=usuario.telefono,
                        pedido_id=pedido.id,
                        nombre_cliente=nombre_cliente,
                        telefono_display=telefono_display,
                        direccion=direccion,
                        total_formateado=total_formateado,
                        productos_texto=productos_texto,
                    )
                    if resultado and "messages" in resultado:
                        wa_msg_id = resultado["messages"][0].get("id")
                        pedido.whatsapp_message_id = wa_msg_id
                        pedido.canal_mensaje = "whatsapp"
                        db.commit()
                        db.refresh(pedido)
                except Exception as template_err:
                    err_msg = str(template_err)
                    if "401" in err_msg or "Unauthorized" in err_msg:
                        print("WhatsApp 401: revisá WHATSAPP_ACCESS_TOKEN en .env (token válido, no vencido, con permiso whatsapp_business_messaging).")
                    elif "131030" in err_msg or "not in allowed list" in err_msg.lower():
                        print("WhatsApp 131030: el número del cliente no está en la lista de autorizados. En desarrollo solo podés enviar a números agregados en Meta for Developers → Tu app → WhatsApp → Números de teléfono de prueba.")
                    else:
                        print(f"Template pedido_confirmado error (nombre/orden de variables en Meta): {template_err}")
                    # Respaldo: mensaje de texto
                    mensaje = (
                        f"🐾 *Raucan - Pedido #{pedido.id} Confirmado*\n\n"
                        f"📦 *Productos:*\n{resumen_texto}\n\n"
                        f"💰 *Total:* ${pedido.total:,.2f}\n\n"
                        f"¿Cómo preferís abonar? Respondé 1 Efectivo / 2 Transferencia. ¡Gracias! 🐕"
                    )
                    resultado = svc_whatsapp.enviar_mensaje_texto(
                        telefono=usuario.telefono,
                        mensaje=mensaje
                    )
                    if resultado and "messages" in resultado:
                        pedido.whatsapp_message_id = resultado["messages"][0].get("id")
                        pedido.canal_mensaje = "whatsapp"
                        db.commit()
                        db.refresh(pedido)
        except Exception as e:
            print(f"Error enviando WhatsApp: {e}")

    return pedido


def actualizar(db: Session, pedido_id: int, datos: PedidoUpdate):
    """Actualiza estado y datos de un pedido. No modifica detalles."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(pedido, key, value)
    db.commit()
    db.refresh(pedido)
    return pedido


def eliminar(db: Session, pedido_id: int) -> bool:
    """Elimina un pedido (y sus detalles por cascade). Retorna True si existía."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return False
    db.delete(pedido)
    db.commit()
    return True


# --- Detalle del pedido ---


def _recalcular_total_pedido(db: Session, pedido: models_pedido.Pedido) -> None:
    """Recalcula pedido.total con la suma de subtotales de sus detalles."""
    total = sum(
        (d.subtotal or (d.cantidad_kg * d.precio_por_kg))
        for d in pedido.detalles
    )
    pedido.total = round(total, 2)


def listar_detalles(db: Session, pedido_id: int):
    """Lista los detalles de un pedido. Retorna lista vacía si el pedido no existe."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return None
    return list(pedido.detalles)


def obtener_detalle_por_id(db: Session, pedido_id: int, detalle_id: int):
    """Obtiene un detalle por pedido_id y detalle_id. Retorna None si no existe."""
    return (
        db.query(models_pedido.PedidoDetalle)
        .filter(
            models_pedido.PedidoDetalle.pedido_id == pedido_id,
            models_pedido.PedidoDetalle.id == detalle_id,
        )
        .first()
    )


def agregar_detalle(db: Session, pedido_id: int, datos: PedidoDetalleCreate):
    """Agrega un ítem al pedido y recalcula el total. Retorna el detalle o None si el pedido no existe."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return None
    subtotal = round(datos.cantidad_kg * datos.precio_por_kg, 2)
    detalle = models_pedido.PedidoDetalle(
        pedido_id=pedido_id,
        producto_id=datos.producto_id,
        cantidad_kg=datos.cantidad_kg,
        precio_por_kg=datos.precio_por_kg,
        subtotal=subtotal,
    )
    db.add(detalle)
    db.flush()
    _recalcular_total_pedido(db, pedido)
    db.commit()
    db.refresh(detalle)
    return detalle


def actualizar_detalle(
    db: Session, pedido_id: int, detalle_id: int, datos: PedidoDetalleUpdate
):
    """Actualiza cantidad/precio de un detalle, recalcula subtotal y total del pedido."""
    detalle = obtener_detalle_por_id(db, pedido_id, detalle_id)
    if detalle is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(detalle, key, value)
    detalle.subtotal = round(detalle.cantidad_kg * detalle.precio_por_kg, 2)
    pedido = obtener_por_id(db, pedido_id)
    _recalcular_total_pedido(db, pedido)
    db.commit()
    db.refresh(detalle)
    return detalle


def eliminar_detalle(db: Session, pedido_id: int, detalle_id: int) -> bool:
    """Elimina un detalle y recalcula el total del pedido. Retorna True si existía."""
    detalle = obtener_detalle_por_id(db, pedido_id, detalle_id)
    if detalle is None:
        return False
    pedido = obtener_por_id(db, pedido_id)
    db.delete(detalle)
    _recalcular_total_pedido(db, pedido)
    db.commit()
    return True
