from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from app.database.database import SessionLocal
from app.auth.service import create_user
from app.auth.service import get_user_by_email
from app.auth.jwt_handler import create_access_token
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import date

router = APIRouter()

pwd_context = CryptContext(
    schemes=["sha256_crypt"],
    deprecated="auto"
)


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    gender: str
    phone: str
    birth_date: date | None = None
    country_origin: str
    city_origin: str
    industry: str
    visa_type: str
    arrival_date: date | None = None
    preferred_language: str = "es"
    profile_photo_url: str = ""


def hash_password(password: str):
    return pwd_context.hash(password)


@router.post("/register")
def register(user: UserRegister):

    db = SessionLocal()

    hashed_password = hash_password(user.password)

    user_data = {
        "full_name": user.full_name,
        "email": user.email,
        "password_hash": hashed_password,
        "gender": user.gender,
        "phone": user.phone,
        "birth_date": user.birth_date,
        "country_origin": user.country_origin,
        "city_origin": user.city_origin,
        "industry": user.industry,
        "visa_type": user.visa_type,
        "arrival_date": user.arrival_date,
        "preferred_language": user.preferred_language,
        "profile_photo_url": user.profile_photo_url
    }

    new_user = create_user(db, user_data)

    return {
        "message": "User registered successfully",
        "user_id": str(new_user.id),
        "email": new_user.email
    }


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    db = SessionLocal()

    db_user = get_user_by_email(
        db,
        form_data.username
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    if not pwd_context.verify(
        form_data.password,
        db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token(
        data={
            "sub": db_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user.email
    }


@router.get("/me")
def get_me(
    email: str = Depends(verify_token)
):

    db = SessionLocal()

    user = get_user_by_email(db, email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "gender": user.gender,
        "phone": user.phone,
        "birth_date": user.birth_date,
        "country_origin": user.country_origin,
        "city_origin": user.city_origin,
        "industry": user.industry,
        "visa_type": user.visa_type,
        "arrival_date": user.arrival_date,
        "preferred_language": user.preferred_language,
        "profile_photo_url": user.profile_photo_url
    }