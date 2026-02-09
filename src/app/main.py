from pathlib import Path

from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app import models  # noqa: F401 — registrar modelos con Base
from app.routers import login, productos, usuarios

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
app.include_router(login.router, prefix="/login", tags=["login"])
app.include_router(usuarios.router, prefix="/usuarios", tags=["usuarios"])


@app.get("/health")
def health():
    return {"status": "ok"}
