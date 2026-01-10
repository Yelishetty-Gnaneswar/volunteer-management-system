import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ResetPasswordForm = ({ onBackToLogin }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/reset-password", {
        oldPassword,
        newPassword,
      });

      toast.success("Password updated successfully");
      onBackToLogin?.();

    } catch (err) {
      toast.error(err.response?.data || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-semibold transition ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

      <p
        onClick={onBackToLogin}
        className="text-center text-sm text-blue-600 cursor-pointer hover:underline"
      >
        ← Back to Login
      </p>
    </form>
  );
};

export default ResetPasswordForm;
