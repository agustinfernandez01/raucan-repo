from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import LoginRequest, LoginResponse
from app.services import Logueo  as login_service

router = APIRouter()
# LOGIN
@router.post("/auth", response_model=LoginResponse)
def LoginUser(data: LoginRequest, db: Session = Depends(get_db)):
   try:
      response = login_service(db, data)
      return response
   except ValueError as e:
      raise HTTPException(status_code=401, detail=str(e))

    