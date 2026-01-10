import { useState } from "react";
import AuthCard from "../components/auth/AuthCard";
import { ShieldCheck } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState("login");

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-500 to-emerald-500 px-4">

      {/* OUTER WHITE CARD */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* BLUE SECTION */}
        <div className="bg-indigo-600 px-8 pt-10 pb-12 text-center">

          {/* BRAND */}
          <h1 className="text-3xl font-extrabold text-white">
            Volunteer<span className="text-gray-200">Hub</span>
          </h1>

          {/* ICON */}
          <div className="bg-white/20 p-3 rounded-full inline-flex mt-6 mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-extrabold text-white">
            {isForgot
              ? "Reset Password"
              : isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h2>

          <p className="text-indigo-100 text-sm mt-1">
            {isForgot
              ? "Set a new password for your account"
              : isRegister
              ? "Join VolunteerHub today"
              : "Sign in to continue your journey"}
          </p>

          {/* LOGIN / REGISTER TABS (HIDDEN FOR FORGOT) */}
          {!isForgot && (
            <div className="mt-6 w-full bg-white/20 rounded-xl p-1 flex">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                  ${
                    isLogin
                      ? "bg-white text-indigo-600 shadow"
                      : "text-white/80 hover:text-white"
                  }`}
              >
                Login
              </button>

              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                  ${
                    isRegister
                      ? "bg-white text-indigo-600 shadow"
                      : "text-white/80 hover:text-white"
                  }`}
              >
                Register
              </button>
            </div>
          )}

          {/* AUTH FORM CARD */}
          <div className="mt-10 bg-white rounded-2xl p-8 shadow-xl">
            <AuthCard mode={mode} setMode={setMode} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-400 py-4">
          © 2026 VolunteerHub. All rights reserved.
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
