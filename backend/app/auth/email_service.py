import html
import os

import resend


def _configure_resend() -> str:
    """
    Configura Resend y devuelve el correo remitente.
    """

    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("FROM_EMAIL")

    if not api_key:
        raise Exception("RESEND_API_KEY is missing")

    if not from_email:
        raise Exception("FROM_EMAIL is missing")

    resend.api_key = api_key

    return from_email


# =====================================================
# PASSWORD RESET
# =====================================================

def send_password_reset_email(
    to_email: str,
    reset_url: str
):
    from_email = _configure_resend()

    try:
        return resend.Emails.send({
            "from": f"COLANT Connect <{from_email}>",
            "to": [to_email],
            "subject": "Reset your COLANT Connect password",
            "html": f"""
            <div style="
                max-width: 620px;
                margin: 0 auto;
                padding: 32px;
                font-family: Arial, Helvetica, sans-serif;
                color: #1e293b;
                background-color: #ffffff;
            ">
                <div style="
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                ">
                    <h2 style="
                        margin-top: 0;
                        color: #172554;
                    ">
                        COLANT Connect
                    </h2>

                    <p>Hello,</p>

                    <p>
                        You requested to reset your COLANT Connect password.
                    </p>

                    <div style="margin: 30px 0;">
                        <a
                            href="{reset_url}"
                            style="
                                display: inline-block;
                                padding: 14px 22px;
                                color: #ffffff;
                                background-color: #1d4ed8;
                                border-radius: 10px;
                                text-decoration: none;
                                font-weight: bold;
                            "
                        >
                            Reset Password
                        </a>
                    </div>

                    <p>
                        If you did not request this email, you can safely
                        ignore it.
                    </p>

                    <p style="
                        margin-top: 32px;
                        color: #64748b;
                        font-size: 14px;
                    ">
                        COLANT Connect Team
                    </p>
                </div>
            </div>
            """
        })

    except Exception as error:
        print("RESEND PASSWORD RESET EMAIL ERROR:", str(error))
        raise


# =====================================================
# EMAIL VERIFICATION
# =====================================================

def send_verification_code_email(
    to_email: str,
    code: str
):
    from_email = _configure_resend()

    safe_code = html.escape(str(code))

    try:
        return resend.Emails.send({
            "from": f"COLANT Connect <{from_email}>",
            "to": [to_email],
            "subject": "Verify your COLANT Connect account",
            "html": f"""
            <div style="
                max-width: 620px;
                margin: 0 auto;
                padding: 32px;
                font-family: Arial, Helvetica, sans-serif;
                color: #1e293b;
                background-color: #ffffff;
            ">
                <div style="
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                ">
                    <h2 style="
                        margin-top: 0;
                        color: #172554;
                    ">
                        Welcome to COLANT Connect
                    </h2>

                    <p>Thank you for registering.</p>

                    <p>Your verification code is:</p>

                    <div style="
                        margin: 24px 0;
                        padding: 18px;
                        text-align: center;
                        background-color: #eff6ff;
                        border-radius: 12px;
                    ">
                        <span style="
                            font-size: 34px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #1d4ed8;
                        ">
                            {safe_code}
                        </span>
                    </div>

                    <p>This code will expire in 10 minutes.</p>

                    <p>
                        If you did not create this account, simply ignore
                        this email.
                    </p>

                    <p style="
                        margin-top: 32px;
                        color: #64748b;
                        font-size: 14px;
                    ">
                        COLANT Connect Team
                    </p>
                </div>
            </div>
            """
        })

    except Exception as error:
        print("RESEND VERIFICATION EMAIL ERROR:", str(error))
        raise


# =====================================================
# MASS NOTIFICATION EMAIL
# =====================================================

def send_mass_notification_email(
    recipients: list[str],
    title: str,
    message: str,
    is_reminder: bool = False
) -> dict:
    """
    Envía una notificación por correo a cada destinatario.

    Se envía un correo individual por usuario para no exponer
    las direcciones de otros miembros de la comunidad.
    """

    from_email = _configure_resend()

    clean_recipients = list({
        email.strip().lower()
        for email in recipients
        if email and email.strip()
    })

    safe_title = html.escape(title.strip())
    safe_message = html.escape(message.strip()).replace("\n", "<br>")

    subject_prefix = "Reminder: " if is_reminder else ""
    email_label = "Reminder" if is_reminder else "Community notification"

    sent = 0
    failed = 0
    errors = []

    for to_email in clean_recipients:
        try:
            resend.Emails.send({
                "from": f"COLANT Connect <{from_email}>",
                "to": [to_email],
                "subject": f"{subject_prefix}{title.strip()}",
                "html": f"""
                <div style="
                    max-width: 640px;
                    margin: 0 auto;
                    padding: 32px 20px;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #1e293b;
                    background-color: #f8fafc;
                ">
                    <div style="
                        overflow: hidden;
                        background-color: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 20px;
                    ">
                        <div style="
                            padding: 26px 30px;
                            background-color: #172554;
                            color: #ffffff;
                        ">
                            <div style="
                                margin-bottom: 8px;
                                font-size: 13px;
                                font-weight: bold;
                                letter-spacing: 1px;
                                text-transform: uppercase;
                                opacity: 0.8;
                            ">
                                {email_label}
                            </div>

                            <h1 style="
                                margin: 0;
                                font-size: 25px;
                            ">
                                COLANT Connect
                            </h1>
                        </div>

                        <div style="padding: 30px;">
                            <h2 style="
                                margin-top: 0;
                                margin-bottom: 18px;
                                color: #172554;
                                font-size: 24px;
                            ">
                                {safe_title}
                            </h2>

                            <div style="
                                font-size: 16px;
                                line-height: 1.7;
                                color: #334155;
                            ">
                                {safe_message}
                            </div>

                            <div style="
                                margin-top: 30px;
                                padding-top: 22px;
                                border-top: 1px solid #e2e8f0;
                            ">
                                <p style="
                                    margin: 0;
                                    color: #64748b;
                                    font-size: 14px;
                                    line-height: 1.6;
                                ">
                                    Thank you for being part of the Colombian
                                    community in Australia.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p style="
                        margin-top: 18px;
                        text-align: center;
                        color: #94a3b8;
                        font-size: 12px;
                    ">
                        This message was sent by COLANT Connect.
                    </p>
                </div>
                """
            })

            sent += 1

        except Exception as error:
            failed += 1

            errors.append({
                "email": to_email,
                "error": str(error)
            })

            print(
                f"RESEND MASS NOTIFICATION ERROR "
                f"({to_email}): {str(error)}"
            )

    return {
        "recipients_found": len(clean_recipients),
        "sent": sent,
        "failed": failed,
        "errors": errors
    }