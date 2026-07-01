from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.businesses.business_model import Business

router = APIRouter(
    prefix="",
    tags=["Businesses"]
)


@router.post("/")
def create_business(
    event_id: str,
    business_name: str,
    category: str,
    description: str,
    stand_location: str = "",
    image_url: str = "",
    db: Session = Depends(get_db)
):

    business = Business(
        event_id=event_id,
        business_name=business_name,
        category=category,
        description=description,
        stand_location=stand_location,
        image_url=image_url
    )

    db.add(business)
    db.commit()
    db.refresh(business)

    return business


@router.get("/")
def get_businesses(
    db: Session = Depends(get_db)
):

    return db.query(Business).all()


@router.get("/event/{event_id}")
def get_businesses_by_event(
    event_id: str,
    db: Session = Depends(get_db)
):

    businesses = db.query(Business).filter(
        Business.event_id == event_id
    ).all()

    return businesses