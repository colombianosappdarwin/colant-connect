import { useState } from "react";
import axios from "axios";

function Register({ onLoginClick }) {
  const [language, setLanguage] = useState("es");

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
    preferred_language: "es",
    profile_photo_url: "",
  });

  const texts = {
    es: {
      title: "Registro voluntario",
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
      language: "Idioma preferido",
      register: "Registrar usuario",
      back: "← Volver al Login",
      success: "Usuario registrado correctamente",
      error: "Error al registrar usuario",
      male: "Masculino",
      female: "Femenino",
      spanish: "Español",
      english: "English",
    },
    en: {
      title: "Voluntary Registration",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      gender: "Gender",
      phone: "Mobile Number",
      birthDate: "Date of Birth",
      country: "Country of Origin",
      city: "City of Origin",
      industry: "What industry do you work in?",
      visa: "Visa Type",
      arrival: "Arrival Date in Darwin",
      language: "Preferred Language",
      register: "Create Account",
      back: "← Back to Login",
      success: "User registered successfully",
      error: "Error creating account",
      male: "Male",
      female: "Female",
      spanish: "Spanish",
      english: "English",
    },
  };

  const t = texts[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(t.success);

      setFormData({
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
        preferred_language: "es",
        profile_photo_url: "",
      });

      if (onLoginClick) {
        onLoginClick();
      }
    } catch (error) {
      console.log(error);
      alert(t.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={onLoginClick}
          className="mb-4 text-blue-700 font-bold"
        >
          {t.back}
        </button>

        <div className="flex justify-end mb-4 gap-2">
          <button
            type="button"
            onClick={() => {
              setLanguage("es");
              setFormData({ ...formData, preferred_language: "es" });
            }}
            className={`px-3 py-1 rounded-lg font-bold ${
              language === "es"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            ES
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage("en");
              setFormData({ ...formData, preferred_language: "en" });
            }}
            className={`px-3 py-1 rounded-lg font-bold ${
              language === "en"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            EN
          </button>
        </div>

        <h2 className="text-3xl font-extrabold text-blue-950 mb-2">
          {t.title}
        </h2>

        <p className="text-sm text-gray-600 mb-5">
          COLANT Connect · Colombianos en Australia
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="full_name"
            placeholder={t.fullName}
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
            required
          >
            <option value="">{t.gender}</option>
            <option value="M">{t.male}</option>
            <option value="F">{t.female}</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t.password}
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
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
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <input
            type="text"
            name="country_origin"
            placeholder={t.country}
            value={formData.country_origin}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <input
            type="text"
            name="city_origin"
            placeholder={t.city}
            value={formData.city_origin}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <input
            type="text"
            name="phone"
            placeholder={t.phone}
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <label className="block text-sm text-gray-600">
            {t.arrival}
          </label>

          <input
            type="date"
            name="arrival_date"
            value={formData.arrival_date}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <input
            type="text"
            name="industry"
            placeholder={t.industry}
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <input
            type="text"
            name="visa_type"
            placeholder={t.visa}
            value={formData.visa_type}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          />

          <select
            name="preferred_language"
            value={formData.preferred_language}
            onChange={handleChange}
            className="w-full p-3 bg-white rounded-xl border border-gray-300 outline-none"
          >
            <option value="es">{t.spanish}</option>
            <option value="en">{t.english}</option>
          </select>

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded-xl font-bold transition"
          >
            {t.register}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;