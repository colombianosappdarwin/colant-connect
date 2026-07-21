import { useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import backgroundImage from "./assets/Colant.png";
import { initializePushNotifications } from "./services/pushNotifications";

function Login({
  onRegisterClick,
  onLoginSuccess,
  language = "es",
  changeLanguage,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const texts = {
    es: {
      title: "COLANT",
      subtitle: "Colombianos en Australia",
      betaVersion: "Versión Beta v1.1",
      email: "Correo electrónico",
      password: "Contraseña",
      login: "Iniciar sesión",
      loggingIn: "Ingresando...",
      forgot: "¿Olvidaste tu contraseña?",
      sendReset: "Enviar recuperación",
      sendingReset: "Enviando...",
      backLogin: "Volver al inicio de sesión",
      noAccount: "¿No tienes una cuenta?",
      register: "Crear una cuenta",
      incorrectCredentials: "Correo o contraseña incorrectos.",
      emailRequired: "Ingresa tu correo electrónico.",
      resetSuccess:
        "La solicitud de recuperación fue enviada. Revisa tu correo electrónico.",
      resetError: "No se pudo enviar la solicitud de recuperación.",
      pushError:
        "La sesión inició correctamente, pero no se pudieron activar las notificaciones.",
    },
    en: {
      title: "COLANT",
      subtitle: "Colombians in Australia",
      betaVersion: "Beta Version v1.1",
      email: "Email address",
      password: "Password",
      login: "Sign in",
      loggingIn: "Signing in...",
      forgot: "Forgot your password?",
      sendReset: "Send reset request",
      sendingReset: "Sending...",
      backLogin: "Back to sign in",
      noAccount: "Don't have an account?",
      register: "Create an account",
      incorrectCredentials: "Incorrect email or password.",
      emailRequired: "Enter your email address.",
      resetSuccess:
        "The recovery request was sent. Check your email.",
      resetError: "The recovery request could not be sent.",
      pushError:
        "You signed in successfully, but notifications could not be enabled.",
    },
  };

  const t = texts[language] || texts.es;

  const selectLanguage = (newLanguage) => {
    localStorage.setItem("language", newLanguage);

    if (changeLanguage) {
      changeLanguage(newLanguage);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", email.trim().toLowerCase());
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

      const jwtToken = response.data.access_token;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("email", response.data.email || email.trim());
      localStorage.setItem("language", language);

      try {
        await initializePushNotifications();
      } catch (pushError) {
        console.error("Push notification error:", pushError);
      }

      const profileResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (onLoginSuccess) {
        onLoginSuccess(profileResponse.data);
      }
    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : t.incorrectCredentials
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      alert(t.emailRequired);
      return;
    }

    try {
      setResetLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        {
          email: email.trim().toLowerCase(),
        }
      );

      alert(response.data?.message || t.resetSuccess);
      setForgotMode(false);
    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : t.resetError
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: `linear-gradient(
          rgba(255, 255, 255, 0.10),
          rgba(255, 255, 255, 0.20)
        ), url(${backgroundImage})`,
      }}
    >
      <div className="w-full max-w-sm rounded-3xl border border-white/50 bg-white/85 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => selectLanguage("es")}
            className={`rounded-lg px-3 py-1 font-bold ${
              language === "es"
                ? "bg-yellow-400 text-black"
                : "bg-slate-200 text-slate-700"
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
                : "bg-slate-200 text-slate-700"
            }`}
          >
            EN
          </button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-950">
            {t.title}
          </h1>

          <p className="mt-2 text-blue-900">{t.subtitle}</p>

          <div className="mt-3 inline-flex items-center rounded-full border border-yellow-400 bg-yellow-100 px-4 py-1">
            <span className="text-sm font-bold text-yellow-800">
              {t.betaVersion}
            </span>
          </div>
        </div>

        {!forgotMode ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-black outline-none"
              required
            />

            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-black outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-yellow-400 py-4 font-bold text-black shadow-lg transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.loggingIn : t.login}
            </button>

            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="w-full text-center font-bold text-blue-700 transition hover:text-blue-900"
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
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-black outline-none"
              required
            />

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full rounded-2xl bg-yellow-400 py-4 font-bold text-black shadow-lg transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetLoading ? t.sendingReset : t.sendReset}
            </button>

            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full text-center font-bold text-blue-700 transition hover:text-blue-900"
            >
              {t.backLogin}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-blue-950">
          {t.noAccount}
        </p>

        <button
          type="button"
          onClick={onRegisterClick}
          className="w-full text-center font-bold text-blue-700 transition hover:text-blue-900"
        >
          {t.register}
        </button>
      </div>
    </div>
  );
}

export default Login;