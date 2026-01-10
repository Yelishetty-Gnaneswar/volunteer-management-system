import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/* ================= FORGOT PASSWORD FORM ================= */
const ForgotPasswordForm = ({ setMode }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      toast.error("Email and new password are required");
      return;
    }

    try {
      setLoading(true);

      console.log("Reset password request:", email);

      // ✅ CORRECT ENDPOINT
      const res = await api.post("/api/auth/reset-password", {
        emailId: email.trim(),
        newPassword: newPassword.trim(),
      });

      console.log("Reset response:", res.data);

      toast.success(
        typeof res.data === "string"
          ? res.data
          : "Password reset successful"
      );

      setMode("login");
    } catch (err) {
      console.error("Reset error:", err);

      toast.error(
        err.response?.data ||
          err.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-5">
      {/* EMAIL */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* NEW PASSWORD */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      {/* RESET BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      {/* BACK TO LOGIN */}
      <div className="text-center">
        <span
          onClick={() => setMode("login")}
          className="text-sm text-indigo-600 cursor-pointer hover:underline"
        >
          Back to Login
        </span>
      </div>
    </form>
  );
};

/* ================= AUTH CARD ================= */
const AuthCard = ({ mode, setMode }) => {
  return (
    <>
      {mode === "login" && (
        <LoginForm onForgot={() => setMode("forgot")} />
      )}

      {mode === "register" && <RegisterForm />}

      {mode === "forgot" && (
        <ForgotPasswordForm setMode={setMode} />
      )}
    </>
  );
};

export default AuthCard;
