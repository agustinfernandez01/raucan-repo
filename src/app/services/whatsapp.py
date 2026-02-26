"""
Servicio para enviar mensajes de WhatsApp usando Meta Cloud API.

Importante:
- WHATSAPP_PHONE_NUMBER_ID (en .env) = número de TU negocio (quien envía). Es fijo.
- El destinatario ("to") = número del CLIENTE. Es dinámico: usuario.telefono al crear el pedido.
Cada pedido se envía al teléfono de la persona que lo realizó (la que está logueada y registrada).
"""
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_API_URL = f"https://graph.facebook.com/v22.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"

# Nombre exacto de la plantilla en Meta (Spanish ARG) - "pedido_confirmado"
WHATSAPP_TEMPLATE_PEDIDO = os.getenv("WHATSAPP_TEMPLATE_PEDIDO", "pedido_confirmado")


def _get_headers():
    """Headers para la API de WhatsApp."""
    return {
        "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


def formatear_telefono(telefono: str) -> str:
    """
    Formatea el teléfono al formato internacional requerido por WhatsApp.
    Ejemplo: "1123456789" -> "541123456789" (Argentina)
    """
    telefono = telefono.strip().replace(" ", "").replace("-", "").replace("+", "")
    
    # Si ya tiene código de país (54 para Argentina)
    if telefono.startswith("54"):
        return telefono
    
    # Si empieza con 0, quitarlo y agregar 54
    if telefono.startswith("0"):
        telefono = telefono[1:]
    
    # Agregar código de Argentina
    return f"54{telefono}"


def enviar_mensaje_texto(telefono: str, mensaje: str) -> dict:
    """
    Envía un mensaje de texto simple.
    NOTA: Solo funciona si el usuario te escribió en las últimas 24 horas.
    
    Args:
        telefono: Número de teléfono del destinatario
        mensaje: Texto del mensaje
        
    Returns:
        Respuesta de la API
    """
    telefono_formateado = formatear_telefono(telefono)
    
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": telefono_formateado,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": mensaje
        }
    }
    
    with httpx.Client() as client:
        response = client.post(
            WHATSAPP_API_URL,
            headers=_get_headers(),
            json=payload,
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()


def enviar_template_hello_world(telefono: str) -> dict:
    """
    Envía la plantilla hello_world pre-aprobada.
    Esta es la única forma de iniciar conversación con un número de prueba.
    
    Args:
        telefono: Número de teléfono del destinatario
        
    Returns:
        Respuesta de la API
    """
    telefono_formateado = formatear_telefono(telefono)
    
    payload = {
        "messaging_product": "whatsapp",
        "to": telefono_formateado,
        "type": "template",
        "template": {
            "name": "hello_world",
            "language": {
                "code": "en_US"
            }
        }
    }
    
    with httpx.Client() as client:
        response = client.post(
            WHATSAPP_API_URL,
            headers=_get_headers(),
            json=payload,
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()


def enviar_template_con_variables(
    telefono: str,
    nombre_plantilla: str,
    variables_cuerpo: list[str],
    idioma: str = "es_AR",
) -> dict:
    """
    Envía una plantilla aprobada con variables en el cuerpo.
    El destinatario es el teléfono del cliente (cada pedido = el usuario que lo hizo).
    
    Args:
        telefono: Número del cliente (ej. el que tiene en registro).
        nombre_plantilla: Nombre exacto de la plantilla en Meta (ej. "pedido_confirmado").
        variables_cuerpo: Lista de textos en el orden que tiene tu plantilla (ej. [nombre, nro_pedido, total]).
        idioma: Código de idioma de la plantilla (es_AR, es, en_US, etc.).
    
    Returns:
        Respuesta de la API.
    """
    telefono_formateado = formatear_telefono(telefono)
    parameters = [{"type": "text", "text": str(v)} for v in variables_cuerpo]
    
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": telefono_formateado,
        "type": "template",
        "template": {
            "name": nombre_plantilla,
            "language": {"code": idioma},
            "components": [
                {"type": "body", "parameters": parameters}
            ]
        }
    }
    
    with httpx.Client() as client:
        response = client.post(
            WHATSAPP_API_URL,
            headers=_get_headers(),
            json=payload,
            timeout=30.0
        )
        if response.status_code >= 400:
            try:
                err_body = response.json()
            except Exception:
                err_body = response.text
            print(f"[WhatsApp API {response.status_code}] {err_body}")
        response.raise_for_status()
        return response.json()


def _formatear_telefono_para_display(telefono: str) -> str:
    """Formato legible para mostrar en el mensaje (ej. 381 123-4567)."""
    t = telefono.strip().replace(" ", "").replace("-", "").replace("+", "")
    if t.startswith("54") and len(t) > 2:
        t = t[2:]
    if len(t) >= 10:
        return f"{t[:3]} {t[3:6]}-{t[6:]}"  # 381 123-4567
    return telefono.strip()


def enviar_template_resumen_pedido(
    telefono: str,
    pedido_id: int,
    nombre_cliente: str,
    telefono_display: str,
    direccion: str,
    total_formateado: str,
    productos_texto: str,
) -> dict:
    """
    Envía la plantilla "resumen de pedido" con:
    {{1}} Pedido #, {{2}} Nombre, {{3}} Teléfono, {{4}} Dirección, {{5}} Total, {{6}} Tu pedido (lista de productos).
    Los botones Efectivo / Transferencia van en la plantilla en Meta; no se envían por API.
    """
    variables_cuerpo = [
        str(pedido_id),
        nombre_cliente,
        telefono_display,
        direccion or "—",
        total_formateado,
        productos_texto.strip() or "—",
    ]
    return enviar_template_con_variables(
        telefono=telefono,
        nombre_plantilla=WHATSAPP_TEMPLATE_PEDIDO,
        variables_cuerpo=variables_cuerpo,
    )


def enviar_template_pedido_confirmado(
    telefono: str,
    nombre_cliente: str,
    pedido_id: int,
    total: float,
) -> dict:
    """
    Envía plantilla simple (3 variables). Para la plantilla completa con dirección y productos
    usá enviar_template_resumen_pedido().
    """
    total_str = f"${total:,.2f}".replace(",", " ").replace(".", ",")
    variables_cuerpo = [nombre_cliente, str(pedido_id), total_str]
    return enviar_template_con_variables(
        telefono=telefono,
        nombre_plantilla=WHATSAPP_TEMPLATE_PEDIDO,
        variables_cuerpo=variables_cuerpo,
    )


def enviar_mensaje_botones_pago(
    telefono: str,
    pedido_id: int,
    total: float,
    productos_resumen: str
) -> dict:
    """
    Envía un mensaje interactivo con botones para elegir método de pago.
    
    Args:
        telefono: Número de teléfono del destinatario
        pedido_id: ID del pedido
        total: Monto total del pedido
        productos_resumen: Resumen de los productos (ej: "2kg Pollo, 1kg Carne")
        
    Returns:
        Respuesta de la API
    """
    telefono_formateado = formatear_telefono(telefono)
    
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": telefono_formateado,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "text",
                "text": "🐾 Raucan - Pedido Confirmado"
            },
            "body": {
                "text": f"¡Hola! Tu pedido #{pedido_id} está confirmado.\n\n"
                        f"📦 *Productos:*\n{productos_resumen}\n\n"
                        f"💰 *Total:* ${total:,.2f}\n\n"
                        f"¿Cómo preferís abonar?"
            },
            "footer": {
                "text": "Gracias por elegirnos 🐕"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": f"pago_efectivo_{pedido_id}",
                            "title": "💵 Efectivo"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": f"pago_transferencia_{pedido_id}",
                            "title": "🏦 Transferencia"
                        }
                    }
                ]
            }
        }
    }
    
    with httpx.Client() as client:
        response = client.post(
            WHATSAPP_API_URL,
            headers=_get_headers(),
            json=payload,
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()


def enviar_confirmacion_pago(telefono: str, pedido_id: int, metodo_pago: str) -> dict:
    """
    Envía confirmación de que se registró el método de pago.
    """
    telefono_formateado = formatear_telefono(telefono)
    
    emoji = "💵" if metodo_pago == "efectivo" else "🏦"
    
    mensaje = (
        f"✅ *¡Perfecto!*\n\n"
        f"Tu pedido #{pedido_id} quedó registrado para pago con {emoji} *{metodo_pago.capitalize()}*.\n\n"
        f"Te avisaremos cuando esté listo para entrega. ¡Gracias!"
    )
    
    return enviar_mensaje_texto(telefono, mensaje)
