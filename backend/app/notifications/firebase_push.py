import os
import json
import firebase_admin

from firebase_admin import credentials, messaging


def initialize_firebase():
    if firebase_admin._apps:
        return

    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    if not service_account_json:
        raise Exception("FIREBASE_SERVICE_ACCOUNT_JSON is not configured")

    service_account_info = json.loads(service_account_json)

    cred = credentials.Certificate(service_account_info)

    firebase_admin.initialize_app(cred)


def send_push_notification(token: str, title: str, message: str):
    initialize_firebase()

    firebase_message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=message
        ),
        token=token
    )

    return messaging.send(firebase_message)