import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Buttons";
import logo from "../assets/logo.png";

function SignUp() {
  const [role, setRole] = useState("USER");

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-[500px] flex flex-col items-center">
          
          {/* 1. LOGO SECTION */}
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} className="h-10" alt="Logo" />
            <div className="leading-tight text-left">
              <p className="font-black text-[#2557b4] text-sm uppercase leading-none">Smart</p>
              <p className="text-[9px] text-gray-400 uppercase font-medium">Support System</p>
            </div>
          </div>

          {/* 2. SIGN UP TITLE */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sign Up</h1>

          {/* 3. ROLE SELECTOR */}
          <div className="flex w-full border border-gray-900 rounded-full p-1 mb-8">
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-colors ${
                role === "ADMIN" ? "bg-[#2557b4] text-white" : "text-gray-900"
              }`}
            >
              ADMIN
            </button>

            <button
              type="button"
              onClick={() => setRole("AGENT")}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-colors ${
                role === "AGENT" ? "bg-[#2557b4] text-white" : "text-gray-900"
              }`}
            >
              AGENT
            </button>

            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-colors ${
                role === "USER" ? "bg-[#2557b4] text-white" : "text-gray-900"
              }`}
            >
              USER
            </button>
          </div>

          {/* Form Fields */}

        </div>
      </main>

      <footer className="py-4 text-center text-sm text-primary border-t border-gray-200">
        Project by Team 2
      </footer>
    </div>
  );
}

export default SignUp;