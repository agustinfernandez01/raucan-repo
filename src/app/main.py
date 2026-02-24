from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app import models  # noqa: F401 — registrar modelos con Base
<<<<<<< HEAD
from app.routers import carrito, categoria_producto, login, mascota, pedido, productos, usuarios, stock_deposito, deposito
=======
from app.routers import carrito, login, mascota, pedido, productos, usuarios, stock_deposito, deposito, whatsapp
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crear tablas al arrancar. Si la DB no responde, la app igual inicia."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        pass
    yield


app = FastAPI(
    title="Raucan API",
    description="API para venta de comida de animales por kg",
    version="0.1.0",
    lifespan=lifespan,
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
app.include_router(carrito.router, prefix="/carrito", tags=["carrito"])
app.include_router(pedido.router, prefix="/pedidos", tags=["pedidos"])
app.include_router(mascota.router, prefix="/mascotas", tags=["mascotas"])
app.include_router(deposito.router, prefix="/depositos", tags=["depositos"])
app.include_router(stock_deposito.router, prefix="/stock_deposito", tags=["stock_deposito"])
app.include_router(categoria_producto.router, prefix="/categoria_producto", tags=["categoria_producto"])


@app.get("/health")
def health():
    return {"status": "ok"}
