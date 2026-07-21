import AboutCards from "./AboutCards";

function AboutColant({ language = "es" }) {
  const texts = {
    es: {
      badge: "SOBRE COLANT",
      title:
        "Conectando a Colombia y Australia en el Territorio del Norte",
      paragraph1:
        "COLANT es la principal organización que representa a la comunidad colombiana en el Territorio del Norte de Australia, desarrollando eventos culturales, programas comunitarios y alianzas estratégicas que promueven la inclusión, el bienestar y las oportunidades para todos.",
      paragraph2:
        "Desde grandes festivales hasta iniciativas deportivas, juveniles, artísticas y comunitarias, creamos espacios donde la cultura, la conexión y las oportunidades se unen para fortalecer nuestra comunidad.",
    },

    en: {
      badge: "ABOUT COLANT",
      title:
        "Connecting Colombia and Australia in the Northern Territory",
      paragraph1:
        "COLANT is the leading organisation representing the Colombian community in the Northern Territory, delivering cultural events, community programs and strategic partnerships that promote inclusion, wellbeing and opportunity.",
      paragraph2:
        "From major festivals to youth, sport, arts and community initiatives, we create spaces where culture, connection and opportunity come together.",
    },
  };

  const t = texts[language] || texts.es;

  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-xl">
        <img
          src="https://res.cloudinary.com/dtlmi9fgx/image/upload/v1782721897/image_ww1w3i.png"
          alt="COLANT Community"
          className="h-60 w-full object-cover"
        />

        <div className="p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-700">
            {t.badge}
          </p>

          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-slate-900">
            {t.title}
          </h2>

          <p className="mb-4 text-[15px] leading-7 text-slate-600">
            {t.paragraph1}
          </p>

          <p className="text-[15px] leading-7 text-slate-600">
            {t.paragraph2}
          </p>
        </div>
      </div>

      <AboutCards language={language} />
    </section>
  );
}

export default AboutColant;