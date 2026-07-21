@router.get("/statistics")
def get_admin_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_admin(current_user)

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
        .all()
    )

    users_by_industry = (
        db.query(
            User.industry,
            func.count(User.id)
        )
        .group_by(User.industry)
        .all()
    )

    users_by_country = (
        db.query(
            User.country_origin,
            func.count(User.id)
        )
        .group_by(User.country_origin)
        .all()
    )

    users_by_city = (
        db.query(
            User.city_origin,
            func.count(User.id)
        )
        .group_by(User.city_origin)
        .all()
    )

    user_growth = (
        db.query(
            func.date_trunc("month", User.created_at).label("month"),
            func.count(User.id).label("total")
        )
        .group_by(
            func.date_trunc("month", User.created_at)
        )
        .order_by(
            func.date_trunc("month", User.created_at)
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
        ]
    }