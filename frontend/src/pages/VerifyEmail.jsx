import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function VerifyEmail({ initialEmail = "", onLoginClick }) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      alert("Please enter your email and verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/verify-email`,
        {
          email,
          code,
        }
      );

      alert(response.data.message);

      setCode("");

      if (onLoginClick) {
        onLoginClick();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Error verifying email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl font-extrabold text-blue-950 text-center">
          Verify your email
        </h1>

        <p className="text-slate-600 text-center mt-3">
          Enter the verification code sent to your email.
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Verification code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 text-center text-xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

        </form>

        <button
          type="button"
          onClick={() => {
            if (onLoginClick) {
              onLoginClick();
            } else {
              window.location.reload();
            }
          }}
          className="w-full mt-5 text-blue-800 font-semibold hover:underline"
        >
          Back to login
        </button>

      </div>
    </div>
  );
}

export default VerifyEmail;
