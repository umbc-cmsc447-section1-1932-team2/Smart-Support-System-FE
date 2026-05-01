import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Buttons";
import Input from "../components/Input";
import { apiFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, data } = await apiFetch("/auth/login", "POST", form);
    
    if (!ok) return;

    // Tell AuthContext we are logged in
    login(data);

    // The Traffic Controller: Route based on role
    if (data.role === "AGENT" || data.role === "ADMIN") {
      navigate("/agent-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm hover:scale-[1.01] hover:shadow-2xl transition-transform">
        <NavLink to="/" className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 mb-2" />
          <h1 className="text-3xl font-black">Login</h1>
        </NavLink>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
          />

          <Link
            to="/forgot-password"
            className="text-sm text-primary font-bold hover:underline self-end"
          >
            Forgot Password?
          </Link>

          <Button type="submit" className="mt-2 w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        <p className="text-center text-sm text-primary mt-6">
          Project by Team 2
        </p>
      </div>
    </div>
  );
}

export default Login;
