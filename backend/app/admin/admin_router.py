from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
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
    tags=["Admin"],
)


class UserRoleUpdate(BaseModel):
    role: Literal[
        "user",
        "staff",
        "admin",
        "super_admin",
    ]


def require_admin(current_user: User):
    role = (current_user.role or "").strip().lower()

    if role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Administrator access required. "
                f"Current role: {role}"
            ),
        )


def get_user_or_404(
    db: Session,
    user_id: UUID,
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user


def serialize_user(user: User):
    return {
        "id": str(user.id),
        "full_name": user.full_name or "",
        "email": user.email or "",
        "phone": user.phone or "",
        "gender": user.gender or "",
        "birth_date": (
            user.birth_date.isoformat()
            if user.birth_date
            else None
        ),
        "country_origin": user.country_origin or "",
        "city_origin": user.city_origin or "",
        "industry": user.industry or "",
        "visa_type": user.visa_type or "",
        "arrival_date": (
            user.arrival_date.isoformat()
            if user.arrival_date
            else None
        ),
        "preferred_language":
            user.preferred_language or "es",
        "profile_photo_url":
            user.profile_photo_url or "",
        "role": user.role or "user",
        "is_active": bool(user.is_active),
        "email_verified": bool(user.email_verified),
        "two_factor_enabled":
            bool(user.two_factor_enabled),
        "last_login": (
            user.last_login.isoformat()
            if user.last_login
            else None
        ),
        "created_at": (
            user.created_at.isoformat()
            if user.created_at
            else None
        ),
        "updated_at": (
            user.updated_at.isoformat()
            if user.updated_at
            else None
        ),
    }


def build_statistics_data(db: Session):
    total_users = db.query(User).count()
    total_events = db.query(Event).count()
    total_photos = db.query(Gallery).count()
    total_notifications = db.query(Notification).count()

    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_photos": total_photos,
        "total_notifications": total_notifications,
    }


def build_users_report(db: Session):
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        {
            "full_name":
                user.full_name or "Not specified",
            "email":
                user.email or "Not specified",
            "phone":
                user.phone or "Not specified",
            "country_origin":
                user.country_origin or "Not specified",
            "city_origin":
                user.city_origin or "Not specified",
            "visa_type":
                user.visa_type or "Not specified",
            "industry":
                user.industry or "Not specified",
            "preferred_language":
                user.preferred_language or "Not specified",
            "role":
                user.role or "user",
            "created_at": (
                user.created_at.strftime("%d %b %Y")
                if user.created_at
                else "Not specified"
            ),
        }
        for user in users
    ]


@router.get("/users")
def get_admin_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        serialize_user(user)
        for user in users
    ]


@router.put("/users/{user_id}/role")
def update_admin_user_role(
    user_id: UUID,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    target_user = get_user_or_404(
        db,
        user_id,
    )

    current_role = (
        current_user.role or ""
    ).strip().lower()

    target_role = (
        target_user.role or "user"
    ).strip().lower()

    if (
        payload.role == "super_admin"
        and current_role != "super_admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only a super administrator can assign "
                "the super administrator role."
            ),
        )

    if (
        target_role == "super_admin"
        and current_role != "super_admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only a super administrator can modify "
                "another super administrator."
            ),
        )

    target_user.role = payload.role

    db.commit()
    db.refresh(target_user)

    return {
        "message":
            "User role updated successfully.",
        "user":
            serialize_user(target_user),
    }


@router.put("/users/{user_id}/block")
def block_admin_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    target_user = get_user_or_404(
        db,
        user_id,
    )

    if target_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "You cannot block your own "
                "administrator account."
            ),
        )

    current_role = (
        current_user.role or ""
    ).strip().lower()

    target_role = (
        target_user.role or "user"
    ).strip().lower()

    if (
        target_role == "super_admin"
        and current_role != "super_admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only a super administrator can block "
                "another super administrator."
            ),
        )

    target_user.is_active = False

    db.commit()
    db.refresh(target_user)

    return {
        "message":
            "User blocked successfully.",
        "user":
            serialize_user(target_user),
    }


@router.put("/users/{user_id}/activate")
def activate_admin_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    target_user = get_user_or_404(
        db,
        user_id,
    )

    current_role = (
        current_user.role or ""
    ).strip().lower()

    target_role = (
        target_user.role or "user"
    ).strip().lower()

    if (
        target_role == "super_admin"
        and current_role != "super_admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only a super administrator can activate "
                "another super administrator."
            ),
        )

    target_user.is_active = True

    db.commit()
    db.refresh(target_user)

    return {
        "message":
            "User activated successfully.",
        "user":
            serialize_user(target_user),
    }


@router.get("/statistics")
def get_admin_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    return build_statistics_data(db)


@router.get("/statistics/pdf")
def download_statistics_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)

    statistics = build_statistics_data(db)
    users = build_users_report(db)

    report_data = {
        **statistics,
        "users": users,
    }

    pdf_buffer = generate_statistics_pdf(
        report_data
    )

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                'attachment; filename="'
                'colant-connect-complete-report.pdf"'
            )
        },
    )