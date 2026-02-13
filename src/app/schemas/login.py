from pydantic import BaseModel, EmailStr  # EmailStr requiere email-validator: pip install email-validator

class LoginRequest(BaseModel):
    email: EmailStr
    telefono: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

