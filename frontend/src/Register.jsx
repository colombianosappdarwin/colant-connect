import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./config";

function Register({
  onLoginClick,
  onRegisterSuccess,
  language = "es",
  changeLanguage,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    birth_date: "",
    country_origin: "",
    city_origin: "",
    industry: "",
    visa_type: "",
    arrival_date: "",
    preferred_language: language === "en" ? "en" : "es",
    profile_photo_url: "",
  });

  const texts = {
    es: {
      title: "Registro voluntario",
      subtitle: "COLANT Connect · Colombianos en Australia",
      fullName: "Nombre completo",
      email: "Correo electrónico",
      password: "Contraseña",
      gender: "Sexo",
      phone: "Número de celular",
      birthDate: "Fecha de nacimiento",
      country: "País de origen",
      city: "Ciudad de origen",
      industry: "¿En qué industria trabajas?",
      visa: "Tipo de visa",
      arrival: "Fecha de llegada a Darwin",
      preferredLanguage: "Idioma preferido",
      register: "Registrar usuario",
      back: "← Volver al inicio de sesión",
      success:
        "Usuario registrado correctamente. Revisa tu correo electrónico.",
      error: "No se pudo registrar el usuario.",
      male: "Masculino",
      female: "Femenino",
      other: "Otro",
      preferNotToSay: "Prefiero no decirlo",
      spanish: "Español",
      english: "Inglés",
      loading: "Registrando...",
    },
    en: {
      title: "Voluntary Registration",
      subtitle: "COLANT Connect · Colombians in Australia",
      fullName: "Full name",
      email: "Email address",
      password: "Password",
      gender: "Gender",
      phone: "Mobile number",
      birthDate: "Date of birth",
      country: "Country of origin",
      city: "City of origin",
      industry: "What industry do you work in?",
      visa: "Visa type",
      arrival: "Arrival date in Darwin",
      preferredLanguage: "Preferred language",
      register: "Create account",
      back: "← Back to sign in",
      success:
        "Your account was created successfully. Check your email.",
      error: "The account could not be created.",
      male: "Male",
      female: "Female",
      other: "Other",
      preferNotToSay: "Prefer not to say",
      spanish: "Spanish",
      english: "English",
      loading: "Creating account...",
    },
  };

  const t = texts[language] || texts.es;

  useEffect(() => {
    setFormData((currentData) => ({
      ...currentData,
      preferred_language: language === "en" ? "en" : "es",
    }));
  }, [language]);

  const selectLanguage = (newLanguage) => {
    localStorage.setItem("language", newLanguage);

    setFormData((currentData) => ({
      ...currentData,
      preferred_language: newLanguage,
    }));

    if (changeLanguage) {
      changeLanguage(newLanguage);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (
      name === "preferred_language" &&
      (value === "es" || value === "en")
    ) {
      selectLanguage(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        country_origin: formData.country_origin.trim(),
        city_origin: formData.city_origin.trim(),
        industry: formData.industry.trim(),
        visa_type: formData.visa_type.trim(),
        birth_date: formData.birth_date || null,
        arrival_date: formData.arrival_date || null,
      };

      await axios.post(`${API_URL}/auth/register`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(t.success);

      if (onRegisterSuccess) {
        onRegisterSuccess(payload.email);
      }
    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : t.error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onLoginClick}
          className="mb-4 font-bold text-blue-700"
        >
          {t.back}
        </button>

        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => selectLanguage("es")}
            className={`rounded-lg px-3 py-1 font-bold ${
              language === "es"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            ES
          </button>

          <button
            type="button"
            onClick={() => selectLanguage("en")}
            className={`rounded-lg px-3 py-1 font-bold ${
              language === "en"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            EN
          </button>
        </div>

        <h2 className="mb-2 text-3xl font-extrabold text-blue-950">
          {t.title}
        </h2>

        <p className="mb-5 text-sm text-gray-600">
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="full_name"
            placeholder={t.fullName}
            value={formData.full_name}
            onChange={handleChange}
            autoComplete="name"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
            required
          >
            <option value="">{t.gender}</option>
            <option value="M">{t.male}</option>
            <option value="F">{t.female}</option>
            <option value="O">{t.other}</option>
            <option value="N">{t.preferNotToSay}</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t.password}
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
            required
          />

          <label className="block text-sm text-gray-600">
            {t.birthDate}
          </label>

          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <input
            type="text"
            name="country_origin"
            placeholder={t.country}
            value={formData.country_origin}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <input
            type="text"
            name="city_origin"
            placeholder={t.city}
            value={formData.city_origin}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <input
            type="tel"
            name="phone"
            placeholder={t.phone}
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <label className="block text-sm text-gray-600">
            {t.arrival}
          </label>

          <input
            type="date"
            name="arrival_date"
            value={formData.arrival_date}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <input
            type="text"
            name="industry"
            placeholder={t.industry}
            value={formData.industry}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <input
            type="text"
            name="visa_type"
            placeholder={t.visa}
            value={formData.visa_type}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          />

          <label className="block text-sm text-gray-600">
            {t.preferredLanguage}
          </label>

          <select
            name="preferred_language"
            value={formData.preferred_language}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none"
          >
            <option value="es">{t.spanish}</option>
            <option value="en">{t.english}</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t.loading : t.register}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;