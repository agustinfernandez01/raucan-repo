"""
Servicio para enviar mensajes de WhatsApp usando Meta Cloud API.
"""
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_API_URL = f"https://graph.facebook.com/v22.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"


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
