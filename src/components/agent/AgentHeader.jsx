import React from 'react';
import { Search, LogOut, Bell } from 'lucide-react';

const AgentHeader = ({ currentUser, handleLogout }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {currentUser?.username || 'Agent'}! 👋
        </h2>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Here is what's happening in your support queue today.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ticket ID..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-medium" 
          />
        </div>
        
        <button className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 font-semibold text-sm border border-gray-200 px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AgentHeader;