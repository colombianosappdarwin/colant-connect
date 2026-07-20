from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.auth.email_service import send_mass_notification_email
from app.database.database import get_db
from app.models.notification import Notification
from app.models.user_model import User
from app.notifications.firebase_push import send_push_notification


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# =========================================================
# SCHEMAS
# =========================================================

class NotificationCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    message: str = Field(..., min_length=2)

    category: str = "general"
    priority: str = "normal"

    type: str = "general"
    related_event_id: Optional[UUID] = None

    send_in_app: bool = True
    send_push: bool = True
    send_email: bool = True

    status: str = "draft"
    is_active: bool = True


class NotificationUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150
    )

    message: Optional[str] = Field(
        default=None,
        min_length=2
    )

    category: Optional[str] = None
    priority: Optional[str] = None

    type: Optional[str] = None
    related_event_id: Optional[UUID] = None

    send_in_app: Optional[bool] = None
    send_push: Optional[bool] = None
    send_email: Optional[bool] = None

    status: Optional[str] = None
    is_active: Optional[bool] = None


class NotificationSendRequest(BaseModel):
    send_push: bool = True
    send_email: bool = True


class NotificationStatusRequest(BaseModel):
    is_active: bool


class NotificationReminderRequest(BaseModel):
    send_push: bool = True
    send_email: bool = True


# =========================================================
# HELPERS
# =========================================================

def get_notification_or_404(
    notification_id: UUID,
    db: Session
) -> Notification:
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return notification


def get_active_users(db: Session):
    return db.query(User).filter(
        User.is_active.is_(True)
    ).all()


def get_users_with_push_token(users):
    return [
        user
        for user in users
        if getattr(user, "fcm_token", None)
        and user.fcm_token.strip()
    ]


def get_users_with_email(users):
    return [
        user
        for user in users
        if getattr(user, "email", None)
        and user.email.strip()
    ]


# =========================================================
# CREATE
# Guarda la notificación, pero NO la envía.
# =========================================================

@router.post("/")
def create_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db)
):
    notification = Notification(
        title=data.title.strip(),
        message=data.message.strip(),

        category=data.category,
        priority=data.priority,

        type=data.type,
        related_event_id=data.related_event_id,

        send_in_app=data.send_in_app,
        send_push=data.send_push,
        send_email=data.send_email,

        status=data.status,
        is_active=data.is_active
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return {
        "message": "Notification saved successfully",
        "notification": notification
    }


# =========================================================
# GET ACTIVE NOTIFICATIONS
# Para usuarios dentro de la aplicación.
# =========================================================

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db)
):
    notifications = db.query(Notification).filter(
        Notification.is_active.is_(True),
        Notification.send_in_app.is_(True)
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return notifications


# =========================================================
# GET ALL
# Historial administrativo.
# =========================================================

@router.get("/admin/all")
def get_all_notifications(
    db: Session = Depends(get_db)
):
    notifications = db.query(Notification).order_by(
        Notification.created_at.desc()
    ).all()

    return notifications


# =========================================================
# GET ONE
# =========================================================

@router.get("/{notification_id}")
def get_notification(
    notification_id: UUID,
    db: Session = Depends(get_db)
):
    return get_notification_or_404(
        notification_id,
        db
    )


# =========================================================
# UPDATE
# Guarda los cambios sin enviar nuevamente.
# =========================================================

@router.put("/{notification_id}")
def update_notification(
    notification_id: UUID,
    data: NotificationUpdate,
    db: Session = Depends(get_db)
):
    notification = get_notification_or_404(
        notification_id,
        db
    )

    update_data = data.model_dump(
        exclude_unset=True
    )

    if "title" in update_data:
        notification.title = update_data[
            "title"
        ].strip()

    if "message" in update_data:
        notification.message = update_data[
            "message"
        ].strip()

    if "category" in update_data:
        notification.category = update_data[
            "category"
        ]

    if "priority" in update_data:
        notification.priority = update_data[
            "priority"
        ]

    if "type" in update_data:
        notification.type = update_data[
            "type"
        ]

    if "related_event_id" in update_data:
        notification.related_event_id = update_data[
            "related_event_id"
        ]

    if "send_in_app" in update_data:
        notification.send_in_app = update_data[
            "send_in_app"
        ]

    if "send_push" in update_data:
        notification.send_push = update_data[
            "send_push"
        ]

    if "send_email" in update_data:
        notification.send_email = update_data[
            "send_email"
        ]

    if "status" in update_data:
        notification.status = update_data[
            "status"
        ]

    if "is_active" in update_data:
        notification.is_active = update_data[
            "is_active"
        ]

    db.commit()
    db.refresh(notification)

    return {
        "message": "Notification updated successfully",
        "notification": notification
    }


# =========================================================
# MANUAL MASS SEND
# Solo se ejecuta cuando el administrador presiona Enviar.
# =========================================================

@router.post("/{notification_id}/send")
def send_notification_manually(
    notification_id: UUID,
    options: NotificationSendRequest,
    db: Session = Depends(get_db)
):
    notification = get_notification_or_404(
        notification_id,
        db
    )

    users = get_active_users(db)

    push_sent = 0
    push_failed = 0

    email_sent = 0
    email_failed = 0

    errors = []

    # -----------------------------------------------------
    # PUSH
    # -----------------------------------------------------

    if options.send_push:
        users_with_token = get_users_with_push_token(
            users
        )

        for user in users_with_token:
            try:
                send_push_notification(
                    token=user.fcm_token,
                    title=notification.title,
                    message=notification.message
                )

                push_sent += 1

            except Exception as error:
                push_failed += 1

                errors.append({
                    "channel": "push",
                    "email": getattr(
                        user,
                        "email",
                        None
                    ),
                    "error": str(error)
                })

    # -----------------------------------------------------
    # EMAIL
    # -----------------------------------------------------

    if options.send_email:
        users_with_email = get_users_with_email(
            users
        )

        recipients = [
            user.email
            for user in users_with_email
        ]

        email_result = send_mass_notification_email(
            recipients=recipients,
            title=notification.title,
            message=notification.message,
            is_reminder=False
        )

        email_sent = email_result.get(
            "sent",
            0
        )

        email_failed = email_result.get(
            "failed",
            0
        )

        for email_error in email_result.get(
            "errors",
            []
        ):
            errors.append({
                "channel": "email",
                "email": email_error.get(
                    "email"
                ),
                "error": email_error.get(
                    "error"
                )
            })

    # -----------------------------------------------------
    # SAVE DELIVERY RESULTS
    # -----------------------------------------------------

    notification.send_push = options.send_push
    notification.send_email = options.send_email

    notification.total_users = len(users)

    notification.push_sent = push_sent
    notification.push_failed = push_failed

    notification.email_sent = email_sent
    notification.email_failed = email_failed

    notification.sent_at = datetime.now(
        timezone.utc
    )

    if push_failed > 0 or email_failed > 0:
        if push_sent > 0 or email_sent > 0:
            notification.status = "partially_sent"
        else:
            notification.status = "failed"
    else:
        notification.status = "sent"

    notification.is_active = True

    db.commit()
    db.refresh(notification)

    return {
        "message": "Manual notification delivery completed",

        "notification_id": str(
            notification.id
        ),

        "status": notification.status,

        "users_found": len(users),

        "push_requested": options.send_push,
        "push_sent": push_sent,
        "push_failed": push_failed,

        "email_requested": options.send_email,
        "email_sent": email_sent,
        "email_failed": email_failed,

        "errors": errors
    }


# =========================================================
# MANUAL REMINDER
# Se ejecuta cuando el administrador presiona Recordatorio.
# =========================================================

@router.post("/{notification_id}/reminder")
def send_notification_reminder(
    notification_id: UUID,
    options: NotificationReminderRequest,
    db: Session = Depends(get_db)
):
    notification = get_notification_or_404(
        notification_id,
        db
    )

    users = get_active_users(db)

    push_sent = 0
    push_failed = 0

    email_sent = 0
    email_failed = 0

    errors = []

    reminder_title = (
        f"Reminder: {notification.title}"
    )

    # -----------------------------------------------------
    # PUSH REMINDER
    # -----------------------------------------------------

    if options.send_push:
        users_with_token = get_users_with_push_token(
            users
        )

        for user in users_with_token:
            try:
                send_push_notification(
                    token=user.fcm_token,
                    title=reminder_title,
                    message=notification.message
                )

                push_sent += 1

            except Exception as error:
                push_failed += 1

                errors.append({
                    "channel": "push",
                    "email": getattr(
                        user,
                        "email",
                        None
                    ),
                    "error": str(error)
                })

    # -----------------------------------------------------
    # EMAIL REMINDER
    # -----------------------------------------------------

    if options.send_email:
        users_with_email = get_users_with_email(
            users
        )

        recipients = [
            user.email
            for user in users_with_email
        ]

        email_result = send_mass_notification_email(
            recipients=recipients,
            title=notification.title,
            message=notification.message,
            is_reminder=True
        )

        email_sent = email_result.get(
            "sent",
            0
        )

        email_failed = email_result.get(
            "failed",
            0
        )

        for email_error in email_result.get(
            "errors",
            []
        ):
            errors.append({
                "channel": "email",
                "email": email_error.get(
                    "email"
                ),
                "error": email_error.get(
                    "error"
                )
            })

    notification.reminder_sent_at = datetime.now(
        timezone.utc
    )

    db.commit()
    db.refresh(notification)

    return {
        "message": "Manual reminder completed",

        "notification_id": str(
            notification.id
        ),

        "users_found": len(users),

        "push_requested": options.send_push,
        "push_sent": push_sent,
        "push_failed": push_failed,

        "email_requested": options.send_email,
        "email_sent": email_sent,
        "email_failed": email_failed,

        "errors": errors
    }


# =========================================================
# ACTIVATE / DEACTIVATE
# Muestra u oculta la notificación en la aplicación.
# =========================================================

@router.patch("/{notification_id}/status")
def change_notification_status(
    notification_id: UUID,
    data: NotificationStatusRequest,
    db: Session = Depends(get_db)
):
    notification = get_notification_or_404(
        notification_id,
        db
    )

    notification.is_active = data.is_active

    db.commit()
    db.refresh(notification)

    return {
        "message": (
            "Notification activated successfully"
            if data.is_active
            else "Notification deactivated successfully"
        ),
        "notification": notification
    }


# =========================================================
# DELETE
# =========================================================

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: UUID,
    db: Session = Depends(get_db)
):
    notification = get_notification_or_404(
        notification_id,
        db
    )

    db.delete(notification)
    db.commit()

    return {
        "message": "Notification deleted successfully"
    }