# Backend (Python)

## Instalar Python en esta carpeta

### 1. Abrir terminal en la carpeta `src`

```bash
cd c:\Users\agust\raucan-repo\src
```

### 2. Crear el entorno virtual

```bash
python -m venv venv
```

### 3. Activar el entorno (PowerShell)

```bash
.\venv\Scripts\Activate
```

Verás `(venv)` al inicio de la línea → el entorno está activo.

### 4. Instalar dependencias (cuando las tengas en requirements.txt)

```bash
pip install -r requirements.txt
```

### 5. Desactivar el entorno (cuando termines)

```bash
deactivate
```

---

**Resumen:** cada vez que quieras trabajar en el backend, entra a `src`, activa con `.\venv\Scripts\Activate` y listo.
