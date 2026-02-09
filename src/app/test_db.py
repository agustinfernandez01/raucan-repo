from db import create_engine
from db import DATABASE_URL
import os

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        print("Conexión exitosa a la base de datos")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")

