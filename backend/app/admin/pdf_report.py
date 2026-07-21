from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
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


def _create_distribution_table(title: str, data: list[dict]):
    elements = []

    title_style = ParagraphStyle(
        name="SectionTitle",
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=10,
    )

    elements.append(Paragraph(title, title_style))

    table_data = [["Category", "Total"]]

    if data:
        for item in data:
            label = (
                item.get("label")
                or item.get("name")
                or item.get("visa")
                or item.get("country")
                or item.get("city")
                or item.get("industry")
                or "Not specified"
            )

            total = item.get("total", 0)

            table_data.append([str(label), str(total)])
    else:
        table_data.append(["No data available", "0"])

    table = Table(
        table_data,
        colWidths=[13 * cm, 3 * cm],
        repeatRows=1,
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1E3A8A"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
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
                    (-1, -1),
                    "Helvetica",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "ALIGN",
                    (1, 0),
                    (1, -1),
                    "CENTER",
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
                        colors.HexColor("#F1F5F9"),
                    ],
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#CBD5E1"),
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    elements.append(table)
    elements.append(Spacer(1, 18))

    return elements


def generate_statistics_pdf(statistics: dict) -> BytesIO:
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title="COLANT Connect Statistics Report",
        author="COLANT Connect",
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        name="ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#172554"),
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        name="ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=20,
    )

    summary_title_style = ParagraphStyle(
        name="SummaryTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=10,
    )

    story = []

    generated_at = datetime.now().strftime("%d %B %Y - %I:%M %p")

    story.append(Paragraph("COLANT Connect", title_style))
    story.append(
        Paragraph(
            "Administration Statistics Report",
            subtitle_style,
        )
    )
    story.append(
        Paragraph(
            f"Generated on: {generated_at}",
            subtitle_style,
        )
    )

    story.append(Paragraph("General Summary", summary_title_style))

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

    summary_table = Table(
        summary_data,
        colWidths=[4 * cm, 4 * cm, 4 * cm, 4 * cm],
    )

    summary_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1E3A8A"),
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
                    colors.HexColor("#EFF6FF"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 1),
                    (-1, 1),
                    colors.HexColor("#172554"),
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
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
            ]
        )
    )

    story.append(summary_table)
    story.append(Spacer(1, 24))

    story.extend(
        _create_distribution_table(
            "Users by Visa Type",
            statistics.get("users_by_visa", []),
        )
    )

    story.extend(
        _create_distribution_table(
            "Users by Country",
            statistics.get("users_by_country", []),
        )
    )

    story.append(PageBreak())

    story.extend(
        _create_distribution_table(
            "Users by City",
            statistics.get("users_by_city", []),
        )
    )

    story.extend(
        _create_distribution_table(
            "Users by Industry",
            statistics.get("users_by_industry", []),
        )
    )

    document.build(story)

    buffer.seek(0)

    return buffer