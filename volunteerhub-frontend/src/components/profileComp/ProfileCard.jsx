const ProfileCard = ({ profile }) => {
  if (!profile) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      className="relative bg-white rounded-2xl p-6
                 border border-gray-100
                 shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)]
                 transition-all duration-300
                 hover:-translate-y-1"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl
                   bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"
      />

      <h2 className="text-xl font-semibold mb-4">
        Account Information
      </h2>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{profile.emailId}</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-medium">{profile.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
