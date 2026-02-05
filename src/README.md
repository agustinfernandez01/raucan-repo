# API (Backend) — carpeta `src/`

Backend en Python con FastAPI: rutas, servicios y conexión a la DB para la venta de comida de animales por kg.

## Estructura

```
src/
├── app/
│   ├── main.py       # Entrada, CORS, registro de routers
│   ├── db.py         # Conexión a la base de datos (SQLAlchemy)
│   ├── routers/      # Rutas (endpoints por recurso)
│   │   └── productos.py
│   ├── services/     # Lógica de negocio (productos, pedidos, etc.)
│   │   └── productos.py
│   ├── models/       # Modelos ORM (tablas)
│   │   └── producto.py
│   └── schemas/      # Schemas Pydantic (request/response)
│       └── producto.py
├── requirements.txt
└── .env              # DATABASE_URL (opcional; por defecto SQLite)
```

## Cómo correr

Desde la raíz del repo:

```bash
cd src
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000  
- Docs: http://127.0.0.1:8000/docs  

## Base de datos

- Por defecto usa **SQLite** (`sqlite:///./local.db`) y crea el archivo en `src/`.
- Para usar **PostgreSQL** (u otra), creá `.env` en `src/` con:
  `DATABASE_URL=postgresql://user:pass@host:5432/nombre_db`  
  e instalá el driver (ej. `psycopg2-binary`).
