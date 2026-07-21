import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function ResetPassword({
  onLoginClick,
  language = "es",
  changeLanguage,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const texts = {
    es: {
      title: "Restablecer contraseña",
      subtitle:
        "Crea una nueva contraseña para tu cuenta de COLANT Connect.",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      newPasswordPlaceholder: "Escribe tu nueva contraseña",
      confirmPasswordPlaceholder: "Confirma tu nueva contraseña",
      save: "Guardar nueva contraseña",
      saving: "Guardando...",
      back: "Volver al inicio de sesión",
      invalidToken:
        "El enlace de recuperación no es válido o no contiene un token.",
      required:
        "Escribe y confirma tu nueva contraseña.",
      mismatch:
        "Las contraseñas no coinciden.",
      success:
        "La contraseña se actualizó correctamente. Ya puedes iniciar sesión.",
      error:
        "No se pudo actualizar la contraseña. Inténtalo nuevamente.",
    },
    en: {
      title: "Reset password",
      subtitle:
        "Create a new password for your COLANT Connect account.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      newPasswordPlaceholder: "Enter your new password",
      confirmPasswordPlaceholder: "Confirm your new password",
      save: "Save new password",
      saving: "Saving...",
      back: "Back to sign in",
      invalidToken:
        "The recovery link is invalid or does not contain a token.",
      required:
        "Enter and confirm your new password.",
      mismatch:
        "The passwords do not match.",
      success:
        "Your password was updated successfully. You can now sign in.",
      error:
        "Your password could not be updated. Please try again.",
    },
  };

  const t = texts[language] || texts.es;

  const selectLanguage = (newLanguage) => {
    localStorage.setItem("language", newLanguage);

    if (changeLanguage) {
      changeLanguage(newLanguage);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!token) {
      alert(t.invalidToken);
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert(t.required);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(t.mismatch);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          token,
          new_password: newPassword,
        }
      );

      alert(response.data?.message || t.success);

      setNewPassword("");
      setConfirmPassword("");

      if (onLoginClick) {
        onLoginClick();
      } else {
        window.location.href = "/";
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

  const handleBackToLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      window.location.href = "/";
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
          onSubmit={handleResetPassword}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {t.newPassword}
            </label>

            <input
              type="password"
              placeholder={t.newPasswordPlaceholder}
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              autoComplete="new-password"
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {t.confirmPassword}
            </label>

            <input
              type="password"
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-800 py-3 font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t.saving : t.save}
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

export default ResetPassword;