import bcrypt
import jwt
from sqlalchemy.orm import Session

from app.models import Usuario

from app.schemas.login import LoginRequest
from app.schemas.login import TokenResponse

def autenticar_usuario(db: Session, email: str, password: str) -> TokenResponse:
    # verifica si el mail existe
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return None
    # verifica si la contraseña es correcta
    if not bcrypt.checkpw(password.encode('utf-8'), usuario.password.encode('utf-8')):
        return None
    # genera el token (jwt)
    token = jwt.encode(
        {
            "sub": usuario.id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)
        },
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )
    return TokenResponse(access_token=token,token_type="bearer")