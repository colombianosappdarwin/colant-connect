import { useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import backgroundImage from "./assets/Colant.png";

function Login({ onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("es");

  const texts = {
    es: {
      title: "COLANT",
      subtitle: "Colombianos en Australia",
      email: "Correo electrónico",
      password: "Contraseña",
      login: "Iniciar Sesión",
      noAccount: "¿No tienes cuenta?",
      register: "Regístrate abajo",
      success: "Login correcto",
      error: "Correo o contraseña incorrectos",
    },
    en: {
      title: "COLANT",
      subtitle: "Colombians in Australia",
      email: "Email",
      password: "Password",
      login: "Sign In",
      noAccount: "Don't have an account?",
      register: "Create an account below",
      success: "Login successful",
      error: "Incorrect email or password",
    },
  };

  const t = texts[language];

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("language", language);

      alert(t.success);
      window.location.reload();
    } catch (error) {
      alert(t.error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
      style={{
        backgroundImage: `linear-gradient(
          rgba(255,255,255,0.10),
          rgba(255,255,255,0.20)
        ), url(${backgroundImage})`,
      }}
    >
      <div className="w-full max-w-sm bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50">
        <div className="flex justify-end mb-6 gap-2">
          <button
            type="button"
            onClick={() => setLanguage("es")}
            className={`px-3 py-1 rounded-lg font-bold ${
              language === "es"
                ? "bg-yellow-400 text-black"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            ES
          </button>

          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded-lg font-bold ${
              language === "en"
                ? "bg-yellow-400 text-black"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            EN
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-950">
            {t.title}
          </h1>

          <p className="text-blue-900 mt-2">
            {t.subtitle}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white text-black border border-slate-300 outline-none"
          />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white text-black border border-slate-300 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-2xl shadow-lg transition"
          >
            {t.login}
          </button>
        </form>

        <p className="text-center text-blue-950 mt-8">
          {t.noAccount}
        </p>

        <button
          type="button"
          onClick={onRegisterClick}
          className="w-full text-center text-blue-700 font-bold hover:text-blue-900 transition"
        >
          {t.register}
        </button>
      </div>
    </div>
  );
}

export default Login;