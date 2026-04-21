import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';
import { IoMdHelpCircleOutline, IoMdClose } from 'react-icons/io';
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="pt-28 px-8">
        <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest">
          User dashboard
        </p>
        <h1 className="text-2xl font-black text-gray-900">
          Welcome back, {user?.username}
        </h1>
      </main>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 w-full max-w-xl flex flex-col items-center">
          
          <div className="flex items-center gap-3 mb-10">
            <HiOutlineHome className="text-5xl text-slate-800" />
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          </div>

          <div className="w-full flex flex-col gap-5 mb-16">
            <button 
              onClick={() => navigate('/view-tickets')}
              className="w-full py-4 bg-[#8da2d4] hover:bg-[#7a8fbf] text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              View Tickets
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-[#1e4eb8] hover:bg-[#163a8a] text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Create New Ticket
            </button>

            <button 
              onClick={() => navigate('/account')}
              className="w-full py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Account Management
            </button>
          </div>

          <button 
            onClick={() => navigate('/ai-chat')}
            className="flex items-center gap-2 px-6 py-2 bg-[#3b66bc] hover:bg-[#2f539b] text-white rounded-lg font-medium transition-all"
          >
            <IoMdHelpCircleOutline className="text-xl" />
            Chat with AI Assistant
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-6xl min-h-[600px] rounded-2xl shadow-2xl p-12 relative flex flex-col">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-3xl text-slate-400 hover:text-slate-600"
            >
              <IoMdClose />
            </button>

            <h2 className="text-3xl font-bold mb-10">Create a new ticket</h2>

            <form className="space-y-10 flex-grow">
              <div>
                <label className="block text-lg font-bold mb-2">Ticket Type:</label>
                <select className="w-full border-b-2 border-slate-900 py-3 focus:outline-none bg-transparent text-slate-500 text-xl">
                  <option>Choose a category</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing</option>
                  <option value="access">Access Request</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Describe your request</label>
                <p className="text-sm text-slate-400 mb-4">
                  Please provide a detailed description of the issue, including any specific error messages, screenshots, or steps taken.
                </p>
                <textarea 
                  rows="8"
                  className="w-full border-b-2 border-slate-900 py-3 focus:outline-none resize-none text-lg"
                  placeholder="Type your request here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 mt-auto pt-10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-4 bg-red-200 hover:bg-red-300 text-slate-800 font-bold rounded-xl text-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-10 py-4 bg-green-200 hover:bg-green-300 text-slate-800 font-bold rounded-xl text-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;