import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateMyProfile } from "../../api/eventApi";

const ProfileForm = ({ profile, onUpdated }) => {
  const [form, setForm] = useState({
    phone: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);

  // 🔁 Sync form when profile loads/updates
  useEffect(() => {
    if (profile) {
      setForm({
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMyProfile(form);
      toast.success("Profile updated successfully");
      onUpdated?.();
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">
        Edit Profile
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 rounded-lg bg-indigo-600 text-white
                     hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
