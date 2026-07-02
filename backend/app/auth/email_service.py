import os
import resend


def send_password_reset_email(to_email: str, reset_url: str):
    api_key = os.getenv("RESEND_API_KEY")

    if not api_key:
        raise Exception("RESEND_API_KEY is missing")

    resend.api_key = api_key

    try:
        return resend.Emails.send({
            "from": "COLANT Connect <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Reset your COLANT Connect password",
            "html": f"""
            <h2>COLANT Connect</h2>
            <p>Hello,</p>
            <p>You requested to reset your password.</p>
            <p>
                <a href="{reset_url}">
                    Click here to reset your password
                </a>
            </p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <br>
            <p>COLANT Connect Team</p>
            """
        })
    except Exception as error:
        print("RESEND EMAIL ERROR:", str(error))
        raise