from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.gallery.gallery import Gallery

router = APIRouter(
    prefix="",
    tags=["Gallery"]
)


@router.post("/{event_id}")
def add_photo(
    event_id: str,
    image_url: str,
    db: Session = Depends(get_db)
):

    photo = Gallery(
        image_url=image_url,
        event_id=event_id
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return photo


@router.get("/{event_id}")
def get_gallery(
    event_id: str,
    db: Session = Depends(get_db)
):

    photos = db.query(Gallery).filter(
        Gallery.event_id == event_id
    ).all()

    return photos