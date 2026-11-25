import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Week 7 App</h1>

      <div className="flex gap-5 items-center">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>

        {user && <Link to="/profile">Profile</Link>}

        {user?.role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;