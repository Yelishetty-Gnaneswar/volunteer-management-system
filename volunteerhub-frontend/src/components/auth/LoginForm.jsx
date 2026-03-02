import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyProfile } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ onForgot }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanEmail = email.trim();

      const res = await api.post("/api/auth/login", {
        emailId: cleanEmail,
        password,
      });

      const sessionId = res.data.sessionId;

      const profile = await getMyProfile(cleanEmail);
      const role = profile.userRole || profile.role;

      if (!role) throw new Error("Role not found");

      // ✅ Centralized login
      login({
        email: cleanEmail,
        role: role,
        sessionId: sessionId
      });

      localStorage.setItem("role", role);
      localStorage.setItem("email", cleanEmail);
      toast.success(`Login successful as ${role}`);

      navigate(
        role === "ORGANIZER"
          ? "/organizer/dashboard"
          : "/volunteer/dashboard",
        { replace: true }
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Invalid credentials");
    }
  };

  const handleForgotClick = (e) => {
    // 🔥 STOP EVERYTHING
    e.preventDefault();
    e.stopPropagation();

    if (onForgot) {
      onForgot(email.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

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

      {/* PASSWORD */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* FORGOT PASSWORD */}
      <div className="text-right">
        <span
          role="button"
          tabIndex={0}
          onMouseDown={handleForgotClick} // 🔥 key fix
          className="text-sm text-indigo-600 cursor-pointer hover:underline"
        >
          Forgot password?
        </span>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
