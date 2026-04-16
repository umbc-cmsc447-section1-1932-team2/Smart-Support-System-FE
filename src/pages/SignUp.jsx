import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Buttons";
import logo from "../assets/logo.png";

// A small sub-component to keep the main code clean
const InputField = ({ label, type = "text" }) => (
  <div className="w-full mb-4">
    <label className="block text-sm font-bold text-gray-900 mb-1 ml-1 text-left">
      {label}
    </label>
    <input
      type={type}
      className="w-full bg-[#f3f4f6] border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
    />
  </div>
);

function SignUp() {
  const [role, setRole] = useState("USER");

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-[500px] flex flex-col items-center">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} className="h-10" alt="Logo" />
            <div className="leading-tight text-left">
              <p className="font-black text-[#2557b4] text-sm uppercase leading-none">Smart</p>
              <p className="text-[9px] text-gray-400 uppercase font-medium">Support System</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sign Up</h1>

          {/* Role Toggle */}
          <div className="flex w-full border border-gray-900 rounded-full p-1 mb-8">
            {["ADMIN", "AGENT", "USER"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                  role === r ? "bg-[#2557b4] text-white shadow-md" : "text-gray-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* THE NECESSARY FIELDS */}
          <div className="w-full">
            <InputField label="First Name" />
            <InputField label="Last Name" />
            <InputField label="Date of Birth" type="date" />
            <InputField label="Email" type="email" />
            <InputField label="Verify Email" type="email" />
            <InputField label="Password" type="password" />
            <InputField label="Verify Password" type="password" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full mt-8">
            <Button variant="filled" className="flex-1 py-3 rounded-full">Sign Up</Button>
            <Button variant="filled" className="flex-1 py-3 rounded-full">Cancel</Button>
          </div>

          <p className="mt-8 text-[10px] text-blue-600 font-medium uppercase tracking-widest">
            Project by Team 2
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignUp;