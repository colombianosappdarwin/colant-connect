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
        profile_photo_url=user_data["profile_photo_url"]
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_email(db: Session, email: str):

    return db.query(User).filter(
        User.email == email
    ).first()