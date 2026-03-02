import { useEffect, useState } from "react";
import api from "../../api/axios";              // ✅ FIXED
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    emailId: "",
    userRole: "",
    name: "",
    phoneNo: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  /* ===== BACK BUTTON HANDLER ===== */
  const goBack = () => {
    const role = localStorage.getItem("role");

    if (role === "ORGANIZER" || role === "ORGANISER") {
      navigate("/organizer/dashboard");
    } else {
      navigate("/volunteer/dashboard");
    }
  };

  /* ===== LOAD PROFILE ===== */
  const loadProfile = async () => {
    try {
      const res = await api.get("/api/profile");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  /* ===== UPDATE PROFILE ===== */
  const saveProfile = async () => {
    try {
      setLoading(true);
      await api.put("/api/profile", profile);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">

        {/* HEADER + BACK */}
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            Profile Information
          </h2>
          <p className="text-gray-500 text-sm">
            Your details are securely stored and reusable across sessions
          </p>
        </div>

        {/* EMAIL & ROLE */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input
              value={profile.emailId}
              disabled
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Role</label>
            <input
              value={profile.userRole}
              disabled
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* NAME */}
        <div>
          <label className="text-sm font-semibold text-gray-600">Full Name</label>
          <input
            value={profile.name || ""}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-semibold text-gray-600">
            Mobile Number
          </label>
          <input
            value={profile.phoneNo || ""}
            onChange={(e) =>
              setProfile({ ...profile, phoneNo: e.target.value })
            }
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Enter mobile number"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm font-semibold text-gray-600">Address</label>
          <textarea
            value={profile.address || ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="w-full mt-1 p-3 border rounded-lg"
            rows="3"
            placeholder="Enter your address"
          />
        </div>

        {/* SAVE */}
        <div className="flex justify-end">
          <button
            onClick={saveProfile}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
