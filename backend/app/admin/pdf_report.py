from io import BytesIO
from datetime import datetime
from html import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


PRIMARY_COLOR = colors.HexColor("#172554")
SECONDARY_COLOR = colors.HexColor("#1E3A8A")
LIGHT_BLUE = colors.HexColor("#EFF6FF")
LIGHT_GREY = colors.HexColor("#F8FAFC")
BORDER_COLOR = colors.HexColor("#CBD5E1")
TEXT_COLOR = colors.HexColor("#0F172A")
MUTED_COLOR = colors.HexColor("#64748B")


def _safe_text(value, default="Not specified"):
    """
    Converts any value into safe text for ReportLab.
    Prevents errors caused by special HTML characters.
    """
    if value is None:
        return default

    text = str(value).strip()

    if not text:
        return default

    return escape(text)


def _draw_page_footer(canvas, document):
    """
    Adds footer and page number to every PDF page.
    """
    canvas.saveState()

    page_width, _ = landscape(A4)
    page_number = canvas.getPageNumber()

    canvas.setStrokeColor(BORDER_COLOR)
    canvas.setLineWidth(0.5)
    canvas.line(
        document.leftMargin,
        1.05 * cm,
        page_width - document.rightMargin,
        1.05 * cm,
    )

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED_COLOR)

    canvas.drawString(
        document.leftMargin,
        0.65 * cm,
        "COLANT Connect · Community Platform · Darwin, Australia",
    )

    canvas.drawRightString(
        page_width - document.rightMargin,
        0.65 * cm,
        f"Page {page_number}",
    )

    canvas.restoreState()


def _create_summary_table(statistics: dict):
    """
    Creates the four main statistics cards inside the PDF.
    """
    summary_data = [
        [
            "Registered Users",
            "Events",
            "Gallery Photos",
            "Notifications",
        ],
        [
            str(statistics.get("total_users", 0)),
            str(statistics.get("total_events", 0)),
            str(statistics.get("total_photos", 0)),
            str(statistics.get("total_notifications", 0)),
        ],
    ]

    table = Table(
        summary_data,
        colWidths=[6.2 * cm, 6.2 * cm, 6.2 * cm, 6.2 * cm],
        rowHeights=[1.1 * cm, 1.5 * cm],
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    SECONDARY_COLOR,
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "BACKGROUND",
                    (0, 1),
                    (-1, 1),
                    LIGHT_BLUE,
                ),
                (
                    "TEXTCOLOR",
                    (0, 1),
                    (-1, 1),
                    PRIMARY_COLOR,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, 0),
                    9,
                ),
                (
                    "FONTSIZE",
                    (0, 1),
                    (-1, 1),
                    18,
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#BFDBFE"),
                ),
            ]
        )
    )

    return table


def _create_users_table(users: list[dict], styles):
    """
    Creates the complete registered users table.
    The header is automatically repeated on every page.
    """
    header_style = ParagraphStyle(
        name="UsersTableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7,
        leading=9,
        alignment=TA_CENTER,
        textColor=colors.white,
    )

    cell_style = ParagraphStyle(
        name="UsersTableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=6.5,
        leading=8,
        alignment=TA_LEFT,
        textColor=TEXT_COLOR,
    )

    centered_cell_style = ParagraphStyle(
        name="UsersCenteredCell",
        parent=cell_style,
        alignment=TA_CENTER,
    )

    headers = [
        "Name",
        "Email",
        "Phone",
        "Country",
        "City",
        "Visa",
        "Industry",
        "Language",
        "Role",
        "Registered",
    ]

    table_data = [
        [
            Paragraph(header, header_style)
            for header in headers
        ]
    ]

    if not users:
        table_data.append(
            [
                Paragraph(
                    "No registered users were found.",
                    cell_style,
                )
            ]
            + [""] * 9
        )
    else:
        for user in users:
            table_data.append(
                [
                    Paragraph(
                        _safe_text(user.get("full_name")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("email")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("phone")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("country_origin")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("city_origin")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("visa_type")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("industry")),
                        cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("preferred_language")),
                        centered_cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("role"), "user"),
                        centered_cell_style,
                    ),
                    Paragraph(
                        _safe_text(user.get("created_at")),
                        centered_cell_style,
                    ),
                ]
            )

    table = Table(
        table_data,
        colWidths=[
            3.2 * cm,
            4.4 * cm,
            2.7 * cm,
            2.5 * cm,
            2.5 * cm,
            2.8 * cm,
            3.2 * cm,
            2.0 * cm,
            1.8 * cm,
            2.3 * cm,
        ],
        repeatRows=1,
        hAlign="LEFT",
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    SECONDARY_COLOR,
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        LIGHT_GREY,
                    ],
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.35,
                    BORDER_COLOR,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    4,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    4,
                ),
            ]
        )
    )

    return table


def generate_statistics_pdf(statistics: dict) -> BytesIO:
    """
    Generates the complete COLANT Connect administrative PDF report.

    Expected structure:

    {
        "total_users": 0,
        "total_events": 0,
        "total_photos": 0,
        "total_notifications": 0,
        "users": [...]
    }
    """
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=1.2 * cm,
        leftMargin=1.2 * cm,
        topMargin=1.3 * cm,
        bottomMargin=1.4 * cm,
        title="COLANT Connect Complete Administrative Report",
        author="COLANT Connect",
        subject="Administrative statistics and registered users report",
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        alignment=TA_CENTER,
        textColor=PRIMARY_COLOR,
        spaceAfter=6,
    )

    subtitle_style = ParagraphStyle(
        name="ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        alignment=TA_CENTER,
        textColor=MUTED_COLOR,
        spaceAfter=4,
    )

    date_style = ParagraphStyle(
        name="ReportDate",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=MUTED_COLOR,
        spaceAfter=20,
    )

    section_title_style = ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        alignment=TA_LEFT,
        textColor=TEXT_COLOR,
        spaceBefore=4,
        spaceAfter=10,
    )

    description_style = ParagraphStyle(
        name="Description",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        alignment=TA_LEFT,
        textColor=MUTED_COLOR,
        spaceAfter=12,
    )

    story = []

    generated_at = datetime.now().strftime(
        "%d %B %Y · %I:%M %p"
    )

    users = statistics.get("users", [])

    story.append(
        Paragraph(
            "COLANT Connect",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "Complete Administrative Report",
            subtitle_style,
        )
    )

    story.append(
        Paragraph(
            f"Generated on {generated_at}",
            date_style,
        )
    )

    story.append(
        Paragraph(
            "General Summary",
            section_title_style,
        )
    )

    story.append(
        Paragraph(
            (
                "This report contains the current platform totals "
                "and the complete list of registered users."
            ),
            description_style,
        )
    )

    story.append(
        _create_summary_table(statistics)
    )

    story.append(Spacer(1, 18))

    story.append(
        Paragraph(
            f"Registered Users ({len(users)})",
            section_title_style,
        )
    )

    story.append(
        Paragraph(
            (
                "The following table contains the information currently "
                "stored for each registered COLANT Connect user."
            ),
            description_style,
        )
    )

    story.append(
        _create_users_table(
            users,
            styles,
        )
    )

    document.build(
        story,
        onFirstPage=_draw_page_footer,
        onLaterPages=_draw_page_footer,
    )

    buffer.seek(0)

    return buffer