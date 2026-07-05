from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.user_model import User
from app.models.event import Event
from app.gallery.gallery import Gallery
from app.notifications.models import Notification
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


@router.get("/statistics")
def get_admin_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total_users = db.query(User).count()
    total_events = db.query(Event).count()
    total_photos = db.query(Gallery).count()
    total_notifications = db.query(Notification).count()

    users_by_visa = (
        db.query(User.visa_type, func.count(User.id))
        .group_by(User.visa_type)
        .all()
    )

    users_by_industry = (
        db.query(User.industry, func.count(User.id))
        .group_by(User.industry)
        .all()
    )

    users_by_country = (
        db.query(User.country_origin, func.count(User.id))
        .group_by(User.country_origin)
        .all()
    )

    users_by_city = (
        db.query(User.city_origin, func.count(User.id))
        .group_by(User.city_origin)
        .all()
    )

    return {
        "totals": {
            "users": total_users,
            "events": total_events,
            "photos": total_photos,
            "notifications": total_notifications
        },
        "users_by_visa": [
            {"visa_type": visa or "Not specified", "total": total}
            for visa, total in users_by_visa
        ],
        "users_by_industry": [
            {"industry": industry or "Not specified", "total": total}
            for industry, total in users_by_industry
        ],
        "users_by_country": [
            {"country": country or "Not specified", "total": total}
            for country, total in users_by_country
        ],
        "users_by_city": [
            {"city": city or "Not specified", "total": total}
            for city, total in users_by_city
        ]
    }