function AboutCards({ language = "es" }) {
  const sections =
    language === "es"
      ? [
          {
            title: "Nuestra Misión",
            image:
              "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722537/our_mision_ehd3ot.webp",
            text:
              "En COLANT trabajamos para construir una comunidad acogedora que promueva la diversidad, la inclusión y el respeto por todas las personas. Nuestra misión es celebrar y promover la riqueza de la cultura colombiana mientras fortalecemos los lazos entre Colombia y Australia.",
          },
          {
            title: "Nuestra Historia",
            image:
              "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722537/our_history_r4gqqe.webp",
            text:
              "COLANT fue fundada en Darwin el 20 de julio de 2024 durante la celebración del Día de la Independencia de Colombia. Nació gracias a un grupo de colombianos comprometidos con generar un impacto positivo y fortalecer la comunidad en el Territorio del Norte.",
          },
          {
            title: "Nuestras Actividades",
            image:
              "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722545/Our_activities_olykuv.webp",
            text:
              "Promovemos el intercambio cultural, el bienestar y el crecimiento de nuestra comunidad mediante eventos culturales, actividades deportivas, programas educativos, iniciativas sociales y proyectos de integración comunitaria.",
          },
        ]
      : [
          {
            title: "Our Mission",
            image:
              "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722537/our_mision_ehd3ot.webp",
            text:
              "At COLANT, we strive to create a welcoming community that promotes diversity, inclusivity and respect for everyone. Our mission is to celebrate Colombian culture while strengthening the relationship between Colombia and Australia.",
          },
          {
            title: "Our History",
            image:
              "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722537/our_history_r4gqqe.webp",
            text:
              "Founded in Darwin on 20 July 2024 during Colombia's Independence Day celebration, COLANT began with a group of people committed to creating a stronger and more connected Colombian community in the Northern Territory.",
          },
          {
            title: "Our Activities",
            image:
              "https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782722545/Our_activities_olykuv.webp",
            text:
              "We promote cultural exchange, wellbeing and community growth through festivals, sporting events, educational programs, social initiatives and community engagement activities.",
          },
        ];

  return (
    <div className="mt-6 grid gap-5">
      {sections.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-lg"
        >
          <div className="mb-5 flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover shadow-md"
            />

            <div>
              <h3 className="text-2xl font-extrabold text-blue-950">
                {item.title}
              </h3>

              <p className="text-sm font-semibold text-blue-700">
                {language === "es"
                  ? "Asociación Colombo-Australiana"
                  : "Colombian-Australian Association"}
              </p>
            </div>
          </div>

          <p className="text-[15px] leading-7 text-slate-600">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AboutCards;