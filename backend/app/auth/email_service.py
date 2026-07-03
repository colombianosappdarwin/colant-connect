import os
import resend


def send_password_reset_email(to_email: str, reset_url: str):

    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("FROM_EMAIL")

    if not api_key:
        raise Exception("RESEND_API_KEY is missing")

    if not from_email:
        raise Exception("FROM_EMAIL is missing")

    resend.api_key = api_key

    try:
        return resend.Emails.send({
            "from": f"COLANT Connect <{from_email}>",
            "to": [to_email],
            "subject": "Reset your COLANT Connect password",
            "html": f"""
            <h2>COLANT Connect</h2>

            <p>Hello,</p>

            <p>You requested to reset your password.</p>

            <p>
                <a href="{reset_url}">
                    Reset Password
                </a>
            </p>

            <p>If you did not request this email, you can safely ignore it.</p>

            <br>

            <p>COLANT Connect Team</p>
            """
        })

    except Exception as error:
        print("RESEND EMAIL ERROR:", str(error))
        raise


# =====================================================
# EMAIL VERIFICATION
# =====================================================

def send_verification_code_email(to_email: str, code: str):

    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("FROM_EMAIL")

    if not api_key:
        raise Exception("RESEND_API_KEY is missing")

    if not from_email:
        raise Exception("FROM_EMAIL is missing")

    resend.api_key = api_key

    try:
        return resend.Emails.send({
            "from": f"COLANT Connect <{from_email}>",
            "to": [to_email],
            "subject": "Verify your COLANT Connect account",
            "html": f"""
            <h2>Welcome to COLANT Connect</h2>

            <p>Thank you for registering.</p>

            <p>Your verification code is:</p>

            <h1>{code}</h1>

            <p>This code will expire in 10 minutes.</p>

            <p>If you did not create this account, simply ignore this email.</p>

            <br>

            <p>COLANT Connect Team</p>
            """
        })

    except Exception as error:
        print("RESEND EMAIL ERROR:", str(error))
        raise