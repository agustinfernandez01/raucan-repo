"""
Router para webhook de WhatsApp (recibir respuestas de botones).
"""
import os
import re
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.services import pedido as svc_pedido
from app.services import usuarios as svc_usuarios
from app.services import whatsapp as svc_whatsapp
from app.schemas.pedido import PedidoUpdate

router = APIRouter()

# Token de verificación para el webhook (configurar en Meta)
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "raucan_webhook_verify_2024")


@router.get("/webhook")
async def verify_webhook(request: Request):
    """
    Verificación del webhook de WhatsApp (Meta envía esto al configurar).
    """
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return int(challenge)
    
    raise HTTPException(status_code=403, detail="Verificación fallida")


@router.post("/webhook")
async def receive_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Recibe notificaciones de WhatsApp (mensajes, respuestas de botones, etc).
    """
    try:
        body = await request.json()
    except Exception:
        return {"status": "ok"}

    # Extraer el mensaje/respuesta del payload
    try:
        entry = body.get("entry", [])
        if not entry:
            return {"status": "ok"}
        
        changes = entry[0].get("changes", [])
        if not changes:
            return {"status": "ok"}
        
        value = changes[0].get("value", {})
        messages = value.get("messages", [])
        
        if not messages:
            return {"status": "ok"}
        
        message = messages[0]
        
        # Procesar respuesta de botón interactivo
        if message.get("type") == "interactive":
            interactive = message.get("interactive", {})
            button_reply = interactive.get("button_reply", {})
            button_id = button_reply.get("id", "")
            
            # Extraer pedido_id y método de pago del ID del botón
            # Formato: "pago_efectivo_123" o "pago_transferencia_123"
            match = re.match(r"pago_(efectivo|transferencia)_(\d+)", button_id)
            if match:
                metodo_pago = match.group(1)
                pedido_id = int(match.group(2))
                
                # Actualizar el pedido con el método de pago
                pedido = svc_pedido.obtener_por_id(db, pedido_id)
                if pedido:
                    # Actualizar método de pago y estado
                    svc_pedido.actualizar(db, pedido_id, PedidoUpdate(
                        metodo_pago=metodo_pago,
                        estado="confirmado"
                    ))
                    
                    # Obtener teléfono del usuario para enviar confirmación
                    usuario = svc_usuarios.get_usuario(db, pedido.usuario_id)
                    if usuario and usuario.telefono:
                        try:
                            svc_whatsapp.enviar_confirmacion_pago(
                                usuario.telefono,
                                pedido_id,
                                metodo_pago
                            )
                        except Exception as e:
                            print(f"Error enviando confirmación WhatsApp: {e}")
        
        # Procesar mensaje de texto normal (respuestas "1" o "2")
        elif message.get("type") == "text":
            text_body = message.get("text", {}).get("body", "").strip()
            from_number = message.get("from", "")
            print(f"Mensaje de {from_number}: {text_body}")
            
            # Buscar el último pedido pendiente de este usuario por teléfono
            if text_body in ("1", "2"):
                metodo_pago = "efectivo" if text_body == "1" else "transferencia"
                
                # Buscar usuario por teléfono
                usuario = svc_usuarios.get_usuario_por_telefono(db, from_number)
                if usuario:
                    # Buscar último pedido pendiente del usuario
                    pedidos = svc_pedido.listar(db, usuario_id=usuario.id)
                    pedido_pendiente = next(
                        (p for p in pedidos if p.estado == "pendiente" and not p.metodo_pago),
                        None
                    )
                    
                    if pedido_pendiente:
                        svc_pedido.actualizar(db, pedido_pendiente.id, PedidoUpdate(
                            metodo_pago=metodo_pago,
                            estado="confirmado"
                        ))
                        
                        try:
                            svc_whatsapp.enviar_confirmacion_pago(
                                usuario.telefono,
                                pedido_pendiente.id,
                                metodo_pago
                            )
                        except Exception as e:
                            print(f"Error enviando confirmación WhatsApp: {e}")

    except Exception as e:
        print(f"Error procesando webhook: {e}")
    
    return {"status": "ok"}


@router.post("/enviar-prueba/{telefono}")
async def enviar_mensaje_prueba(telefono: str):
    """
    Endpoint de prueba para enviar un mensaje de WhatsApp.
    Solo para desarrollo.
    """
    try:
        resultado = svc_whatsapp.enviar_mensaje_texto(
            telefono,
            "🐾 ¡Hola! Este es un mensaje de prueba de Raucan."
        )
        return {"success": True, "resultado": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
