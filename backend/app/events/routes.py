@router.put("/{event_id}")
def update_event(
    event_id: str,
    event: EventCreate,
    db: Session = Depends(get_db)
):
    event_uuid = UUID(event_id)

    db_event = db.query(Event).filter(
        Event.id == event_uuid
    ).first()

    if not db_event:
        return {
            "error": "Event not found"
        }

    db_event.title = event.title
    db_event.description = event.description
    db_event.location = event.location
    db_event.event_date = event.event_date

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
        return {
            "error": "Event not found"
        }

    db.delete(db_event)
    db.commit()

    return {
        "message": "Event deleted successfully"
    }