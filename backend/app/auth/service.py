from sqlalchemy.orm import Session
from app.models.user_model import User


def create_user(db: Session, user_data: dict):

    user = User(
        full_name=user_data["full_name"],
        email=user_data["email"],
        password_hash=user_data["password_hash"],
        gender=user_data["gender"],
        phone=user_data["phone"],
        birth_date=user_data["birth_date"],
        country_origin=user_data["country_origin"],
        city_origin=user_data["city_origin"],
        industry=user_data["industry"],
        visa_type=user_data["visa_type"],
        arrival_date=user_data["arrival_date"],
        preferred_language=user_data["preferred_language"],
        profile_photo_url=user_data["profile_photo_url"],

        # Security
        role=user_data.get("role", "user"),
        is_active=user_data.get("is_active", True),
        email_verified=user_data.get("email_verified", False),
        verification_code=user_data.get("verification_code"),
        verification_code_expires=user_data.get("verification_code_expires")
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_email(db: Session, email: str):

    return db.query(User).filter(
        User.email == email
    ).first()