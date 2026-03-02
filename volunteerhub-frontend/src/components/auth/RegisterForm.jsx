import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [role, setRole] = useState("VOLUNTEER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/user/register", {
        name: name,                // ✅ ADDED
        emailId: email,
        password: password,
        phoneNo: phoneNo,
        address: address,
        userRole: role,
      });

      toast.success("Account created successfully. Please login.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">

      {/* Role Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRole("VOLUNTEER")}
          className={`flex-1 py-2 rounded-lg ${role === "VOLUNTEER"
            ? "bg-blue-100 text-blue-600 font-semibold"
            : "border"
            }`}
        >
          Volunteer
        </button>

        <button
          type="button"
          onClick={() => setRole("ORGANIZER")}
          className={`flex-1 py-2 rounded-lg ${role === "ORGANIZER"
            ? "bg-green-100 text-green-600 font-semibold"
            : "border"
            }`}
        >
          Organizer
        </button>
      </div>
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter your full name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
