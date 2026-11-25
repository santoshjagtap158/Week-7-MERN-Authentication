import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, accessToken, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [name, setName] = useState(user?.name || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await api("/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      });

      setMessage(data.message || "Profile updated successfully");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <p className="mb-3">Email: {user?.email}</p>
        <p className="mb-5">Role: {user?.role}</p>

        <form onSubmit={handleUpdate}>
          <label className="block mb-2 font-medium">Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <button className="bg-blue-600 text-white px-5 py-2 rounded">
            Update Profile
          </button>
        </form>

        {message && <p className="mt-4 text-green-700">{message}</p>}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-5 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;