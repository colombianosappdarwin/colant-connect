import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function ResetPassword({ onLoginClick }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid or missing reset token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      new_password: newPassword.trim(),
      });

      alert("Password updated successfully. You can now log in.");

      if (onLoginClick) {
        onLoginClick();
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Error updating password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-950 text-center">
          Reset Password
        </h1>

        <p className="text-slate-600 text-center mt-3">
          Create a new password for your COLANT Connect account.
        </p>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New password
            </label>

            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        <button
          onClick={onLoginClick}
          className="w-full mt-5 text-blue-800 font-semibold hover:underline"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;