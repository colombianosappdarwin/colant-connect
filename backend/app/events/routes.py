from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID

from app.database.database import get_db
from app.models.event import Event
from app.events.attendee_model import EventAttendee
from app.core.security import verify_token
from app.models.user_model import User
from app.cloudinary_service import upload_image

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.get("/")
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()


@router.post("/")
def create_event(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    event_date: datetime = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url = ""

    if image:
        image_url = upload_image(image)

    new_event = Event(
        title=title,
        description=description,
        location=location,
        event_date=event_date,
        image_url=image_url,
        created_at=datetime.utcnow()
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


@router.put("/{event_id}")
def update_event(
    event_id: str,
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    event_date: datetime = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    event_uuid = UUID(event_id)

    db_event = db.query(Event).filter(
        Event.id == event_uuid
    ).first()

    if not db_event:
        return {"error": "Event not found"}

    db_event.title = title
    db_event.description = description
    db_event.location = location
    db_event.event_date = event_date

    if image:
        db_event.image_url = upload_image(image)

    db.commit()
    db.refresh(db_event)

    return db_event


@router.delete("/{event_id}")
def delete_event(
    event_id: str,
    db: Session = Depends(get_db)
):
    event_uuid = UUID(event_id)

    db_event = db.query(Event).filter(
        Event.id == event_uuid
    ).first()

    if not db_event:
        return {"error": "Event not found"}

    db.delete(db_event)
    db.commit()

    return {"message": "Event deleted successfully"}


@router.post("/{event_id}/join")
def join_event(
    event_id: str,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return {"error": "User not found"}

    event_uuid = UUID(event_id)

    event = db.query(Event).filter(
        Event.id == event_uuid
    ).first()

    if not event:
        return {"error": "Event not found"}

    existing = db.query(EventAttendee).filter(
        EventAttendee.user_id == user.id,
        EventAttendee.event_id == event_uuid
    ).first()

    if existing:
        return {"message": "Already joined"}

    attendee = EventAttendee(
        user_id=user.id,
        event_id=event_uuid
    )

    db.add(attendee)
    db.commit()

    return {"message": "Joined successfully"}


@router.get("/{event_id}/attendees")
def get_event_attendees(
    event_id: str,
    db: Session = Depends(get_db)
):
    event_uuid = UUID(event_id)

    attendees = db.query(EventAttendee).filter(
        EventAttendee.event_id == event_uuid
    ).all()

    result = []

    for attendee in attendees:
        user = db.query(User).filter(
            User.id == attendee.user_id
        ).first()

        if user:
            result.append({
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "city_origin": user.city_origin,
                "industry": user.industry,
                "visa_type": user.visa_type
            })

    return {
        "event_id": event_id,
        "count": len(result),
        "attendees": result
    }