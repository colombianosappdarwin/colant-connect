from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from app.database.database import SessionLocal
from app.auth.service import create_user, get_user_by_email
from app.auth.jwt_handler import (
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token
)
from app.auth.email_service import (
    send_password_reset_email,
    send_verification_code_email
)
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import date, datetime, timedelta, timezone
import random

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


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class FCMTokenRequest(BaseModel):
    fcm_token: str


class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    gender: str | None = None
    phone: str | None = None
    birth_date: date | None = None
    country_origin: str | None = None
    city_origin: str | None = None
    industry: str | None = None
    visa_type: str | None = None
    arrival_date: date | None = None
    preferred_language: str | None = None
    profile_photo_url: str | None = None


def user_to_dict(user):
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
        "profile_photo_url": user.profile_photo_url,
        "role": user.role,
        "is_active": user.is_active,
        "email_verified": user.email_verified,
        "last_login": user.last_login,
        "created_at": user.created_at,
        "fcm_token": user.fcm_token
    }


def hash_password(password: str):
    return pwd_context.hash(password.strip())


@router.post("/register")
def register(user: UserRegister):
    db = SessionLocal()

    clean_email = user.email.strip().lower()

    existing_user = get_user_by_email(db, clean_email)

    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)

    verification_code = str(random.randint(100000, 999999))
    verification_expires = datetime.now(timezone.utc) + timedelta(minutes=10)

    user_data = {
        "full_name": user.full_name,
        "email": clean_email,
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
        "profile_photo_url": user.profile_photo_url,
        "email_verified": False,
        "verification_code": verification_code,
        "verification_code_expires": verification_expires
    }

    new_user = create_user(db, user_data)

    send_verification_code_email(
        to_email=new_user.email,
        code=verification_code
    )

    db.close()

    return {
        "message": "User registered successfully. Verification code sent.",
        "user_id": str(new_user.id),
        "email": new_user.email,
        "email_verified": new_user.email_verified
    }


@router.post("/verify-email")
def verify_email(request: VerifyEmailRequest):
    db = SessionLocal()

    user = get_user_by_email(db, request.email)

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if user.email_verified:
        db.close()
        return {"message": "Email already verified"}

    if not user.verification_code:
        db.close()
        raise HTTPException(status_code=400, detail="No verification code found")

    if user.verification_code != request.code:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if (
        user.verification_code_expires
        and user.verification_code_expires < datetime.now(timezone.utc)
    ):
        db.close()
        raise HTTPException(status_code=400, detail="Verification code expired")

    user.email_verified = True
    user.verification_code = None
    user.verification_code_expires = None

    db.commit()
    db.close()

    return {"message": "Email verified successfully"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()

    clean_email = form_data.username.strip().lower()
    clean_password = form_data.password.strip()

    db_user = get_user_by_email(db, clean_email)

    if not db_user:
        db.close()
        raise HTTPException(status_code=401, detail="Invalid email")

    if not db_user.is_active:
        db.close()
        raise HTTPException(status_code=403, detail="User account is blocked")

    if not db_user.email_verified:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in."
        )

    if not pwd_context.verify(clean_password, db_user.password_hash):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid password")

    db_user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(data={"sub": db_user.email})

    email = db_user.email
    role = db_user.role

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": email,
        "role": role
    }


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    db = SessionLocal()

    clean_email = request.email.strip().lower()
    user = get_user_by_email(db, clean_email)

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="No account found with this email"
        )

    if not user.is_active:
        db.close()
        raise HTTPException(status_code=403, detail="User account is blocked")

    reset_token = create_password_reset_token(user.email)

    reset_url = (
        "https://cooperative-acceptance-production-1b19.up.railway.app"
        f"/reset-password?token={reset_token}"
    )

    send_password_reset_email(
        to_email=user.email,
        reset_url=reset_url
    )

    db.close()

    return {"message": "Password reset email sent successfully"}


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    email = verify_password_reset_token(request.token)

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )

    db = SessionLocal()

    user = get_user_by_email(db, email)

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        db.close()
        raise HTTPException(status_code=403, detail="User account is blocked")

    clean_password = request.new_password.strip()

    user.password_hash = hash_password(clean_password)
    db.commit()
    db.refresh(user)

    if not pwd_context.verify(clean_password, user.password_hash):
        db.close()
        raise HTTPException(
            status_code=500,
            detail="Password was not saved correctly"
        )

    db.close()

    return {"message": "Password updated successfully"}


@router.post("/save-fcm-token")
def save_fcm_token(
    request: FCMTokenRequest,
    email: str = Depends(verify_token)
):
    db = SessionLocal()

    user = get_user_by_email(db, email)

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    user.fcm_token = request.fcm_token

    db.commit()
    db.close()

    return {
        "message": "FCM token saved successfully"
    }


@router.get("/me")
def get_me(email: str = Depends(verify_token)):
    db = SessionLocal()

    user = get_user_by_email(db, email)

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        db.close()
        raise HTTPException(status_code=403, detail="User account is blocked")

    result = user_to_dict(user)

    db.close()

    return result


@router.put("/me")
def update_me(
    request: UserProfileUpdate,
    email: str = Depends(verify_token)
):
    db = SessionLocal()

    user = get_user_by_email(db, email)

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        db.close()
        raise HTTPException(status_code=403, detail="User account is blocked")

    data = request.dict(exclude_unset=True)

    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.commit()
    db.refresh(user)

    result = user_to_dict(user)

    db.close()

    return result
