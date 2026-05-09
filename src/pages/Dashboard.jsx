import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import logo from "../assets/logo.png";
import UserStats from "../components/UserStats";
import { useAuth } from "../context/AuthContext";

const Dashboard = ({ onCreateTicket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <div className="flex flex-grow overflow-hidden">

        <main className="flex-grow overflow-y-auto pt-4 px-6 md:px-10">
          <div className="max-w-5xl ml-0">
            {/* Header section */}
            <div className="mb-12">
              <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">User dashboard</p>
              <h1 className="text-3xl font-black text-slate-900 mt-1">
                Welcome back, {user?.username || 'User'}!
              </h1>
            </div>

            <UserStats />

            {/* Main Action Card */}
            <div className="bg-white p-20 pt-20 pb-16 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full flex flex-col items-center mt-8 transition-all duration-700 ease-in-out hover:shadow-2xl hover:shadow-slate-300/40 hover:border-slate-200">
              
              {/* Main Action Buttons */}
              <div className="w-full max-w-2xl flex flex-col gap-5 mb-12">
                <button 
                  onClick={() => navigate('/view-tickets')}
                  className="w-full py-5 bg-[#93a5cf] hover:bg-[#8294bd] text-white font-bold rounded-2xl transition-all shadow-sm text-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                >
                  View Tickets
                </button>

                <button 
                  onClick={onCreateTicket}
                  className="w-full py-5 bg-[#1e4eb8] hover:bg-[#163a8a] text-white font-bold rounded-2xl transition-all shadow-md text-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                >
                  Create New Ticket
                </button>

                <button 
                  onClick={() => navigate('/account')}
                  className="w-full py-5 bg-[#3e4e68] hover:bg-[#2d3a4d] text-white font-bold rounded-2xl transition-all shadow-sm text-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                >
                  Account Management
                </button>
              </div>

              {/* AI Chat Button */}
              <button 
                onClick={() => navigate('/ai-chat')}
                className="flex items-center gap-2 px-8 py-3 bg-[#4469b0] hover:bg-[#355491] text-white rounded-xl font-bold transition-all shadow-sm hover:scale-[1.05] active:scale-[0.95] mb-20"
              >
                <div className="animate-pulse flex items-center gap-2">
                    <IoMdHelpCircleOutline className="text-2xl" />
                    Chat with AI Assistant
                </div>
              </button>

              {/* Logo */}
              <div className="flex items-center gap-5 mt-auto">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain" 
                />
                <div className="leading-none">
                  <p className="font-black text-[#1e4eb8] text-3xl uppercase tracking-tight">
                    Smart
                  </p>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-[0.25em] mt-1">
                    Support System
                  </p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;