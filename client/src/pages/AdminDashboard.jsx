import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api("/admin/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Registered Users
        </h2>

        {error && <p className="text-red-600">{error}</p>}

        <p className="mb-4">Total Users: {users.length}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;