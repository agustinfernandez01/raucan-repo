# Esquema de base de datos — Raucan

Flujo del negocio: el cliente arma el pedido en la web; al confirmar se **envía un mensaje** (ej. WhatsApp) al administrador **y** se **guarda el pedido** en la base. Así el admin no pierde el contacto y además queda registrada la venta.

---

## 1. Login / Sesiones

Registro de inicios de sesión y/o sesiones activas (tokens).

| Campo        | Tipo        | Descripción |
|-------------|-------------|-------------|
| `id`        | PK          | Identificador |
| `usuario_id`| FK → Usuario| Usuario que inició sesión |
| `token`     | string      | Token o identificador de sesión (para validar requests) |
| `expirado_en`| datetime   | Cuándo deja de ser válida la sesión |
| `creado_en` | datetime   | Momento del login |
| `ip`        | string (opc)| IP desde la que se conectó (auditoría) |

**Por qué:** Saber quién está logueado, invalidar sesiones y tener trazabilidad de accesos.

**Sugerencia:** Si usás JWT u otro mecanismo stateless, esta tabla puede usarse solo para “logout” (guardar tokens revocados hasta que expiren) o para auditoría. Si usás sesiones en servidor, cada fila es una sesión activa.

---

## 2. Usuario

Clientes (y eventualmente admin) que usan la app.

| Campo           | Tipo        | Descripción |
|-----------------|-------------|-------------|
| `id`            | PK          | Identificador |
| `email`         | string, único | Para login y contacto |
| `password_hash` | string      | Contraseña hasheada (nunca en texto plano) |
| `nombre`        | string      | Nombre |
| `apellido`      | string (opc)| Apellido |
| `telefono`      | string      | Para contacto y envío del mensaje del pedido |
| `telefono_whatsapp` | string (opc)| Mismo u otro número para WhatsApp |
| `direccion`     | string (opc)| Dirección de entrega por defecto |
| `activo`        | boolean     | Si está habilitado para comprar / login (default true) |
| `rol`           | string (opc)| Ej: `cliente`, `admin` — para futura vista admin |
| `creado_en`     | datetime    | Alta del usuario |
| `actualizado_en`| datetime    | Última modificación |

**Por qué `telefono` / `telefono_whatsapp`:** Para armar el mensaje del pedido (ej. “Cliente X, teléfono Y, pidió…”) y para que el admin pueda responder por WhatsApp sin perder el contacto.

**Sugerencia:** Si el mensaje se envía siempre por WhatsApp, podés usar un solo campo `telefono` y asumir que es el de WhatsApp. Si más adelante sumás email o otro canal, tener `telefono_whatsapp` aparte ayuda.

---

## 3. Mascota

Mascotas del usuario (opcional para recomendaciones o historial por mascota).

| Campo        | Tipo        | Descripción |
|-------------|-------------|-------------|
| `id`        | PK          | Identificador |
| `usuario_id`| FK → Usuario| Dueño |
| `nombre`    | string      | Nombre de la mascota |
| `tipo`      | string      | Ej: perro, gato |
| `raza`      | string (opc)| Raza |
| `edad`      | string (opc)| Ej: “2 años” o “cachorro” |
| `peso_kg`    | float (opc) | Peso en kg (útil para porciones por kg) |
| `alergias_observaciones` | text (opc) | Dietas especiales, alergias |
| `creado_en` | datetime    | Alta |

**Por qué:** Personalizar recomendaciones (“comida para perros”), recordar pesos o necesidades y, a futuro, historial de compras por mascota.

**Sugerencia:** Si al inicio no lo usás, podés crear la tabla y dejarla casi vacía; cuando quieras recomendar por tipo de animal, ya tenés el dato.

---

## 4. Productos

Catálogo de comida por kg (ya tenés parte de esto en código).

| Campo          | Tipo        | Descripción |
|----------------|-------------|-------------|
| `id`           | PK          | Identificador |
| `nombre`       | string      | Nombre del producto |
| `descripcion`  | text (opc)  | Detalle, ingredientes |
| `precio_por_kg`| decimal     | Precio por kilogramo |
| `categoria`    | string (opc)| Ej: perro, gato, snack — para filtrar en la web |
| `imagen_url`   | string (opc)| Ruta o URL de la imagen |
| `activo`       | boolean     | Si se muestra y se puede comprar (default true) |
| `creado_en`    | datetime    | Alta |
| `actualizado_en` | datetime  | Última modificación |

**Por qué `categoria`:** Filtrar en el front (“solo perros”, “solo gatos”) y ordenar el catálogo.

**Sugerencia:** Si crece el catálogo, podés tener una tabla `Categoria` (id, nombre) y en Producto un `categoria_id` FK; por ahora un string alcanza.

---

## 5. Carrito

Items que el usuario va sumando antes de confirmar el pedido. No “impacta” al admin hasta que se confirma y se envía el mensaje + se graba el pedido.

| Campo          | Tipo        | Descripción |
|----------------|-------------|-------------|
| `id`           | PK          | Identificador |
| `usuario_id`   | FK → Usuario| Dueño del carrito |
| `producto_id`  | FK → Productos | Producto |
| `cantidad_kg`  | decimal     | Kilogramos elegidos |
| `precio_por_kg`| decimal (opc)| Precio al momento de agregar (snapshot; si no, se toma de Producto al confirmar) |
| `creado_en`    | datetime    | Cuándo se agregó |

**Por qué `cantidad_kg`:** La venta es por kg; el carrito guarda “cuántos kg” de cada producto.

**Sugerencia:** Podés no guardar `precio_por_kg` y calcular siempre con el precio actual del producto; si querés historial fiel (“lo que vio el cliente al agregar”), conviene guardarlo. Para el mensaje y el pedido guardado, usar el precio al confirmar evita diferencias.

---

## 6. Depósito

Stock disponible por producto (inventario).

| Campo        | Tipo        | Descripción |
|-------------|-------------|-------------|
| `id`        | PK          | Identificador |
| `producto_id` | FK → Productos | Producto |
| `cantidad_kg` | decimal    | Stock en kilogramos |
| `ubicacion` | string (opc)| Ej: “Estante A”, “Sucursal Centro” — si tenés más de un depósito |
| `actualizado_en` | datetime | Última modificación de stock |

**Por qué:** Saber si hay stock antes de confirmar el pedido y, a futuro, descontar al confirmar o al preparar. Si solo hay un depósito, una fila por producto; si hay varios, una fila por (producto, ubicación).

**Sugerencia:** Si más adelante tenés varios almacenes, podés tener tabla `Deposito` (id, nombre) y esta tabla pasar a ser “stock por depósito y producto” (deposito_id, producto_id, cantidad_kg).

---

## 7. Pedidos

Cada pedido confirmado: se envía el mensaje al admin y se guarda esto.

| Campo             | Tipo        | Descripción |
|-------------------|-------------|-------------|
| `id`              | PK          | Identificador (ej. número de pedido) |
| `usuario_id`      | FK → Usuario| Cliente |
| `estado`          | string      | Ej: pendiente, confirmado, enviado, entregado, cancelado |
| `total`           | decimal     | Monto total del pedido |
| `direccion_entrega` | text (opc) | Dirección para este pedido (o la del usuario) |
| `mensaje_enviado` | text (opc)  | Texto del mensaje que se mandó al admin (WhatsApp, etc.) — para trazabilidad |
| `canal_mensaje`   | string (opc)| Ej: whatsapp, email — por si usás más de un canal |
| `notas_internas`  | text (opc)  | Notas del admin (no las ve el cliente) |
| `creado_en`       | datetime    | Fecha/hora del pedido |
| `actualizado_en`  | datetime    | Último cambio (ej. cambio de estado) |

**Por qué `mensaje_enviado` y `canal_mensaje`:** Saber qué se le dijo al admin y por dónde; útil si hay reclamos o si querés reenviar el mismo mensaje.

**Detalle del pedido (tabla asociada):** Para no repetir datos, se usa una tabla **PedidoDetalle** (o ítems del pedido):

| Campo         | Tipo        | Descripción |
|---------------|-------------|-------------|
| `id`          | PK          | Identificador |
| `pedido_id`   | FK → Pedidos| Pedido al que pertenece |
| `producto_id` | FK → Productos | Producto |
| `cantidad_kg` | decimal     | Kilogramos pedidos |
| `precio_por_kg` | decimal    | Precio en ese momento (histórico) |
| `subtotal`    | decimal (opc)| cantidad_kg × precio_por_kg |

**Por qué guardar `precio_por_kg` y `subtotal`:** El precio del producto puede cambiar después; el pedido debe quedar con el valor al momento de la compra.

---

## 8. Comentarios (opcional)

Para reseñas de productos o consultas/soporte.

| Campo        | Tipo        | Descripción |
|-------------|-------------|-------------|
| `id`        | PK          | Identificador |
| `usuario_id`| FK → Usuario| Quien comenta |
| `producto_id` | FK (opc) → Productos | Si es comentario sobre un producto |
| `pedido_id` | FK (opc) → Pedidos | Si es comentario sobre un pedido |
| `tipo`      | string (opc)| Ej: resena_producto, consulta, soporte |
| `contenido` | text        | Texto del comentario |
| `creado_en` | datetime    | Fecha del comentario |

**Por qué:** Confianza (reseñas) y soporte (consultas); si no lo usás al inicio, podés agregarlo después.

---

## Resumen de relaciones

- **Usuario** → tiene muchas Mascota, Carrito, Pedido, Comentario, Sesión.
- **Carrito** → por usuario y producto; cantidad en kg.
- **Pedido** → un usuario; **PedidoDetalle** → varios ítems (producto, cantidad_kg, precio).
- **Depósito** → stock por producto (y opcionalmente por ubicación).
- **Comentario** → usuario; opcionalmente producto o pedido.

---

## Qué más podrías agregar (y por qué)

| Idea | Motivo |
|------|--------|
| **Tabla `Categoria`** (id, nombre) y `producto.categoria_id` | Si crece el catálogo y querés filtrar/ordenar por categoría de forma estable. |
| **Campo `codigo` o `sku` en Producto** | Para identificar productos en el depósito y en el mensaje (“Código X, 2 kg”). |
| **Tabla `MensajeEnviado`** (pedido_id, canal, destinatario, enviado_en, exito) | Auditoría: qué mensaje se mandó, a qué número, si falló el envío. |
| **Estados de pedido en tabla `EstadoPedido`** (id, nombre) | Mantener estados consistentes en la app y en reportes. |
| **Campo `observaciones` en Pedido** | Lo que el cliente escribe al hacer el pedido (“entregar por la tarde”). |
| **Timestamps en todas las tablas** (`creado_en`, `actualizado_en`) | Auditoría y saber cuándo cambió algo. |

Si querés, el siguiente paso puede ser bajar esto a **modelos SQLAlchemy** en tu proyecto (en `src/app/models/`) y crear las tablas en la DB.
