import { useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import backgroundImage from "./assets/Colant.png";

function Login({ onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("es");
  const [forgotMode, setForgotMode] = useState(false);

  const texts = {
    es: {
      title: "COLANT",
      subtitle: "Colombianos en Australia",
      email: "Correo electrónico",
      password: "Contraseña",
      login: "Iniciar Sesión",
      forgot: "¿Olvidaste tu contraseña?",
      sendReset: "Enviar recuperación",
      backLogin: "Volver al inicio de sesión",
      noAccount: "¿No tienes cuenta?",
      register: "Regístrate abajo",
      success: "Login correcto",
      error: "Correo o contraseña incorrectos",
      resetSuccess: "Solicitud de recuperación enviada",
      resetError: "Error enviando recuperación",
    },
    en: {
      title: "COLANT",
      subtitle: "Colombians in Australia",
      email: "Email",
      password: "Password",
      login: "Sign In",
      forgot: "Forgot your password?",
      sendReset: "Send reset request",
      backLogin: "Back to login",
      noAccount: "Don't have an account?",
      register: "Create an account below",
      success: "Login successful",
      error: "Incorrect email or password",
      resetSuccess: "Recovery request sent",
      resetError: "Error sending recovery request",
    },
  };

  const t = texts[language];

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", email.trim().toLowerCase());
      formData.append("password", password.trim());

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
      console.error(error.response?.data || error);
      alert(
        error.response?.data?.detail || t.error
      );
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert(t.email);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        {
          email: email.trim().toLowerCase(),
        }
      );

      alert(response.data.message || t.resetSuccess);
      setForgotMode(false);
    } catch (error) {
      console.error(error.response?.data || error);
      alert(
        error.response?.data?.detail || t.resetError
      );
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

        {!forgotMode ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white text-black border border-slate-300 outline-none"
              required
            />

            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white text-black border border-slate-300 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-2xl shadow-lg transition"
            >
              {t.login}
            </button>

            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="w-full text-center text-blue-700 font-bold hover:text-blue-900 transition"
            >
              {t.forgot}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white text-black border border-slate-300 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-2xl shadow-lg transition"
            >
              {t.sendReset}
            </button>

            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full text-center text-blue-700 font-bold hover:text-blue-900 transition"
            >
              {t.backLogin}
            </button>
          </form>
        )}

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