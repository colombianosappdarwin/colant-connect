function SettingsAdmin({ language = "es" }) {
  const translations = {
    es: {
      title: "Configuración",
      description: "Administra la configuración de la plataforma.",
    },

    en: {
      title: "Settings",
      description: "Manage platform configuration.",
    },
  };

  const t = translations[language] || translations.es;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-extrabold text-blue-950">
        {t.title}
      </h1>

      <p className="mb-6 text-slate-600">
        {t.description}
      </p>
    </div>
  );
}

export default SettingsAdmin;