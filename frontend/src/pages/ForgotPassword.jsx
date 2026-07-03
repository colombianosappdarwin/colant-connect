import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function ForgotPassword({ onLoginClick }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email,
      });

      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
          "Error sending password reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-950 text-center">
          Forgot Password
        </h1>

        <p className="text-slate-600 text-center mt-3">
          Enter your email and we will send you a reset link.
        </p>

        <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;