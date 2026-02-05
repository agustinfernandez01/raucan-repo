# Raucan

Proyecto para venta de **comida de animales por kg**: frontend (React + Vite + TypeScript) y backend/API (Python + FastAPI).

## Estructura del repositorio

```
raucan-repo/
├── client/          # Frontend (React + Vite + TS)
│   └── src/
│       ├── components/   # Componentes reutilizables
│       ├── pages/       # Páginas/vistas
│       ├── services/    # Llamadas a la API (api.ts)
│       ├── hooks/       # Hooks de React
│       └── types/       # Tipos TypeScript (Producto, etc.)
├── src/             # Backend + API (Python + FastAPI)
│   └── app/
│       ├── main.py      # Entrada, CORS, rutas
│       ├── db.py        # Conexión a la base de datos
│       ├── routers/     # Rutas (endpoints por recurso)
│       ├── services/    # Lógica de negocio
│       ├── models/      # Modelos de base de datos (ORM)
│       └── schemas/     # Schemas Pydantic
└── README.md
```

- **Front**: todo lo que ve el usuario (catálogo, carrito, pedidos).
- **Back + API**: en `src/`; rutas, servicios y conexión a la DB.

## Cómo correr en local

**Backend (API):**
```bash
cd src
pip install -r requirements.txt
uvicorn app.main:app --reload
```
→ API: http://127.0.0.1:8000 | Docs: http://127.0.0.1:8000/docs

**Frontend:**
```bash
cd client
npm install
npm run dev
```
→ App: http://localhost:5173

## Git y CD

- **Git**: un solo repo; `client/` y `api/` se versionan juntos. Hacé `git add`, `commit` y `push` como siempre.
- **CD (deploy)**: según tu plataforma, podés:
  - Configurar un pipeline por carpeta (ej. `client/` → Vercel/Netlify, `src/` → Railway/Fly.io), o
  - Un solo pipeline que construya y despliegue ambos desde la raíz.

Variables útiles en front: `VITE_API_URL` apuntando a la URL pública de la API en producción.

> **Nota:** La API está en `src/`. La carpeta `api/` que se creó antes puede borrarse; el backend oficial es `src/`.
