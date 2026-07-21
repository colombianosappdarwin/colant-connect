from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user_model import User
from app.models.event import Event
from app.gallery.gallery import Gallery
from app.models.notification import Notification
from app.admin.pdf_report import generate_statistics_pdf

# Cambia este import por el que ya uses en tu proyecto
from app.core.security import get_current_user


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def require_admin(current_user: User):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required"
        )


def build_statistics_data(db: Session):
    total_users = db.query(User).count()
    total_events = db.query(Event).count()
    total_photos = db.query(Gallery).count()
    total_notifications = db.query(Notification).count()

    users_by_visa = (
        db.query(
            User.visa_type,
            func.count(User.id)
        )
        .group_by(User.visa_type)
        .order_by(func.count(User.id).desc())
        .all()
    )

    users_by_industry = (
        db.query(
            User.industry,
            func.count(User.id)
        )
        .group_by(User.industry)
        .order_by(func.count(User.id).desc())
        .all()
    )

    users_by_country = (
        db.query(
            User.country_origin,
            func.count(User.id)
        )
        .group_by(User.country_origin)
        .order_by(func.count(User.id).desc())
        .all()
    )

    users_by_city = (
        db.query(
            User.city_origin,
            func.count(User.id)
        )
        .group_by(User.city_origin)
        .order_by(func.count(User.id).desc())
        .all()
    )

    user_growth = (
        db.query(
            func.date_trunc(
                "month",
                User.created_at
            ).label("month"),
            func.count(User.id).label("total")
        )
        .group_by(
            func.date_trunc(
                "month",
                User.created_at
            )
        )
        .order_by(
            func.date_trunc(
                "month",
                User.created_at
            )
        )
        .all()
    )

    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_photos": total_photos,
        "total_notifications": total_notifications,

        "users_by_visa": [
            {
                "visa_type": visa or "Not specified",
                "total": total
            }
            for visa, total in users_by_visa
        ],

        "users_by_industry": [
            {
                "industry": industry or "Not specified",
                "total": total
            }
            for industry, total in users_by_industry
        ],

        "users_by_country": [
            {
                "country": country or "Not specified",
                "total": total
            }
            for country, total in users_by_country
        ],

        "users_by_city": [
            {
                "city": city or "Not specified",
                "total": total
            }
            for city, total in users_by_city
        ],

        "user_growth": [
            {
                "month": month.strftime("%b %Y"),
                "total": total
            }
            for month, total in user_growth
            if month is not None
        ]
    }


@router.get("/statistics")
def get_admin_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_admin(current_user)
    return build_statistics_data(db)


@router.get("/statistics/pdf")
def download_statistics_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_admin(current_user)

    statistics = build_statistics_data(db)
    pdf_buffer = generate_statistics_pdf(statistics)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                'attachment; filename="colant-connect-statistics.pdf"'
        }
    )