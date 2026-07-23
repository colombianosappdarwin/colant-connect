import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function VerifyEmail({
  initialEmail = "",
  onLoginClick,
  language = "es",
  changeLanguage,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const texts = {
    es: {
      title: "Verifica tu correo",
      subtitle:
        "Ingresa el código de verificación que enviamos a tu correo electrónico.",
      email: "Correo electrónico",
      verificationCode: "Código de verificación",
      emailPlaceholder: "tu@correo.com",
      codePlaceholder: "123456",
      verify: "Verificar correo",
      verifying: "Verificando...",
      back: "Volver al inicio de sesión",
      required:
        "Ingresa tu correo electrónico y el código de verificación.",
      success: "Correo verificado correctamente.",
      error:
        "No se pudo verificar el correo. Revisa el código e inténtalo nuevamente.",
    },

    en: {
      title: "Verify your email",
      subtitle:
        "Enter the verification code we sent to your email address.",
      email: "Email address",
      verificationCode: "Verification code",
      emailPlaceholder: "your@email.com",
      codePlaceholder: "123456",
      verify: "Verify email",
      verifying: "Verifying...",
      back: "Back to sign in",
      required:
        "Enter your email address and verification code.",
      success: "Your email was verified successfully.",
      error:
        "Your email could not be verified. Check the code and try again.",
    },
  };

  const t = texts[language] || texts.es;

  const selectLanguage = (newLanguage) => {
    localStorage.setItem("language", newLanguage);

    if (changeLanguage) {
      changeLanguage(newLanguage);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!normalizedEmail || !normalizedCode) {
      alert(t.required);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/verify-email`,
        {
          email: normalizedEmail,
          code: normalizedCode,
        }
      );

      alert(response.data?.message || t.success);
      setCode("");

      if (onLoginClick) {
        onLoginClick();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(
        error.response?.data || error
      );

      alert(
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : t.error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
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

        <h1 className="text-center text-3xl font-extrabold text-blue-950">
          {t.title}
        </h1>

        <p className="mt-3 text-center text-slate-600">
          {t.subtitle}
        </p>

        <form
          onSubmit={handleVerify}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {t.email}
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {t.verificationCode}
            </label>

            <input
              type="text"
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value.replace(/\D/g, "")
                )
              }
              placeholder={t.codePlaceholder}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="w-full rounded-xl border px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-800 py-3 font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t.verifying : t.verify}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="mt-5 w-full font-semibold text-blue-800 hover:underline"
        >
          {t.back}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;