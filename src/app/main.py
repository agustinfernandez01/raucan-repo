from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app import models  # noqa: F401 — registrar modelos con Base
from app.routers import productos

# Crear tablas si no existen (al arrancar)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Raucan API",
    description="API para venta de comida de animales por kg",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos.router, prefix="/productos", tags=["productos"])


@app.get("/health")
def health():
    return {"status": "ok"}
