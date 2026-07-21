from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user_model import User
from app.models.event import Event
from app.gallery.gallery import Gallery
from app.models.notification import Notification
from app.core.security import get_current_user
from app.admin.pdf_report import generate_statistics_pdf


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def require_admin(current_user: User):
    role = (current_user.role or "").strip().lower()

    if role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Administrator access required. Current role: {role}"
        )


def build_statistics_data(db: Session):
    total_users = db.query(User).count()
    total_events = db.query(Event).count()
    total_photos = db.query(Gallery).count()
    total_notifications = db.query(Notification).count()

    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_photos": total_photos,
        "total_notifications": total_notifications
    }


def build_users_report(db: Session):
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        {
            "full_name": getattr(user, "full_name", "") or "Not specified",
            "email": getattr(user, "email", "") or "Not specified",
            "phone": getattr(user, "phone", "") or "Not specified",
            "country_origin":
                getattr(user, "country_origin", "") or "Not specified",
            "city_origin":
                getattr(user, "city_origin", "") or "Not specified",
            "visa_type":
                getattr(user, "visa_type", "") or "Not specified",
            "industry":
                getattr(user, "industry", "") or "Not specified",
            "preferred_language":
                getattr(user, "preferred_language", "") or "Not specified",
            "role":
                getattr(user, "role", "") or "user",
            "created_at": (
                user.created_at.strftime("%d %b %Y")
                if getattr(user, "created_at", None)
                else "Not specified"
            )
        }
        for user in users
    ]


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
    users = build_users_report(db)

    report_data = {
        **statistics,
        "users": users
    }

    pdf_buffer = generate_statistics_pdf(report_data)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                'attachment; filename="colant-connect-complete-report.pdf"'
        }
    )