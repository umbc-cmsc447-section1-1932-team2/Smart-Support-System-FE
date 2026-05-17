import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Buttons";
import Input from "../components/Input";
import { apiFetch } from "../utils/api";
import logo from "../assets/logo.png";

const ROLES = ["ADMIN", "AGENT", "USER"];

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email !== form.verifyEmail)
      return toast.error("Emails do not match");
    if (form.password !== form.verifyPassword)
      return toast.error("Passwords do not match");

    const { ok } = await apiFetch("/user/signup", "POST", {
      username: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password,
      role,
    });

    if (!ok) return;
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl hover:scale-[1.01] hover:shadow-2xl transition-transform">
        <NavLink to="/" className="flex flex-col items-center mb-4">
          <img src={logo} alt="Logo" className="w-16 mb-2" />
          <h1 className="text-3xl font-black">Sign Up</h1>
        </NavLink>

        <div className="flex border-2 border-gray-200 rounded-full p-1 mb-5">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-1.5 text-sm font-bold rounded-full transition-all ${
                role === r ? "bg-primary text-white" : "text-gray-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={update}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={update}
              required
            />
          </div>
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob}
            onChange={update}
            min="1960-01-01"
            max="2020-12-31"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Please enter a valid email address."
            />
            <Input
              label="Verify Email"
              name="verifyEmail"
              type="email"
              value={form.verifyEmail}
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
              minLength={6}
              pattern="^(?=.*[0-9]).{6,}$"
              title="Password must be at least 6 characters long and contain at least one number."
            />
            <Input
              label="Verify Password"
              name="verifyPassword"
              type="password"
              value={form.verifyPassword}
              onChange={update}
              required
            />
          </div>
          <Button type="submit" className="mt-2 w-full">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>

        <p className="text-center text-sm text-primary mt-6">
          Project by Team 2
        </p>
      </div>
    </div>
  );
}

export default SignUp;
