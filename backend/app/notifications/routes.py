from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from app.database.database import get_db
from app.models.notification import Notification
from app.models.user_model import User
from app.notifications.firebase_push import send_push_notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "general"
    related_event_id: Optional[UUID] = None
    is_active: bool = True


@router.post("/")
def create_notification(data: NotificationCreate, db: Session = Depends(get_db)):
    notification = Notification(
        title=data.title,
        message=data.message,
        type=data.type,
        related_event_id=data.related_event_id,
        is_active=data.is_active
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    users = db.query(User).filter(
        User.fcm_token.isnot(None)
    ).all()

    sent_count = 0

    for user in users:
        try:
            send_push_notification(
                token=user.fcm_token,
                title=data.title,
                message=data.message
            )
            sent_count += 1
        except Exception as error:
            print("Error sending push:", error)

    return {
        "notification": notification,
        "push_sent": sent_count
    }


@router.get("/")
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).filter(
        Notification.is_active == True
    ).order_by(
        Notification.created_at.desc()
    ).all()


@router.put("/{notification_id}")
def update_notification(
    notification_id: UUID,
    data: NotificationCreate,
    db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.title = data.title
    notification.message = data.message
    notification.type = data.type
    notification.related_event_id = data.related_event_id
    notification.is_active = data.is_active

    db.commit()
    db.refresh(notification)

    return notification


@router.delete("/{notification_id}")
def delete_notification(notification_id: UUID, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    db.delete(notification)
    db.commit()

    return {"message": "Notification deleted successfully"}