import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;