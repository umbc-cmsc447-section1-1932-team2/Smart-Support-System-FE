import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Home, CheckCircle2, Inbox, Ticket, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png"; 

const TicketDashboard = () => {
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState('ALL'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); 

  const initialTickets = [
    { id: 1, date: "Mar 5", sortDate: "2026-03-05", title: "Unable to authenticate SSH token...", status: "CLOSED", completed: "Mar 8" },
    { id: 2, date: "Mar 3", sortDate: "2026-03-03", title: "New user needs onboarding access", status: "OPEN", completed: "—" },
    { id: 3, date: "Mar 1", sortDate: "2026-03-01T14:00", title: "Desktop workstation defaults to incorrect browser", status: "CLOSED", completed: "Mar 4" },
    { id: 4, date: "Mar 1", sortDate: "2026-03-01T09:00", title: "Monitor has dead pixel line down right edge", status: "OPEN", completed: "—" },
  ];

  const filteredTickets = initialTickets.filter(ticket => {
    if (currentTab === 'ALL') return true;
    return ticket.status === currentTab;
  });

  const displayTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.sortDate);
    const dateB = new Date(b.sortDate);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB; 
  });

  const handleLogout = () => navigate("/login");

  const getSidebarStyle = (tabName) => {
    return currentTab === tabName 
      ? "flex items-center gap-3 px-4 py-3 text-primary bg-white shadow-sm font-semibold rounded-xl cursor-pointer border border-gray-100 transition-all"
      : "flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl cursor-pointer hover:bg-white hover:text-primary hover:shadow-sm hover:scale-105 transition-all duration-300";
  };

  return (
    <div className="min-h-screen flex bg-offwhite">
      
      <aside className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 p-8 border-b border-gray-100">
          <img src={logo} alt="Smart Support Logo" className="w-10" />
          <div>
            <h1 className="text-xl font-bold text-primary leading-none">SMART</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mt-0.5">SUPPORT SYSTEM</p>
          </div>
        </div>

        <div className="p-6 flex-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 ml-2">Navigation</div>
          <nav className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl cursor-pointer hover:bg-white hover:text-primary hover:shadow-sm hover:scale-105 transition-all duration-300">
              <Home size={20} /> Dashboard
            </div>
            
            <div onClick={() => setCurrentTab('ALL')} className={getSidebarStyle('ALL')}>
              <Ticket size={20} /> View All Tickets
            </div>
            <div onClick={() => setCurrentTab('OPEN')} className={getSidebarStyle('OPEN')}>
              <Inbox size={20} /> Open Tickets
            </div>
            <div onClick={() => setCurrentTab('CLOSED')} className={getSidebarStyle('CLOSED')}>
              <CheckCircle2 size={20} /> Closed Tickets
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-10 overflow-y-auto h-screen">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="Search Tickets in progress" className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" />
            </div>
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 font-medium whitespace-nowrap">
                <Filter size={18} /> Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button onClick={() => { setSortOrder('newest'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortOrder === 'newest' ? 'bg-primary/5 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>Newest First</button>
                  <button onClick={() => { setSortOrder('oldest'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortOrder === 'oldest' ? 'bg-primary/5 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>Oldest First</button>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 border border-gray-200 px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 font-medium whitespace-nowrap">
            <LogOut size={18} /> Log Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              {currentTab === 'ALL' ? 'All Tickets' : `${currentTab} Tickets`}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 uppercase">Total Tickets</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{displayTickets.length}</span>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="text-gray-500 text-xs font-semibold uppercase bg-gray-50/50">
              <tr>
                <th className="px-8 py-4">Date Created</th>
                <th className="px-8 py-4">Ticket Title</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Date Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5 text-sm text-gray-500"><span className="flex items-center gap-2"><Calendar size={14}/> {ticket.date}</span></td>
                  <td className="px-8 py-5 font-medium text-gray-800 group-hover:text-primary transition-colors">{ticket.title}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${
                      ticket.status === 'CLOSED' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-sm text-gray-500">
                    <span className="flex justify-end items-center gap-2">
                      {ticket.completed !== "—" && <Calendar size={14}/>} {ticket.completed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {displayTickets.length === 0 && (
             <div className="p-10 text-center text-gray-500 font-medium">No {currentTab.toLowerCase()} tickets found.</div>
          )}
        </div>

        <div className="mt-6 flex justify-start">
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl shadow hover:bg-blue-800 hover:shadow-md hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm">
            <Plus size={20} /> Create New Ticket
          </button>
        </div>

        <p className="text-center text-sm text-primary font-semibold mt-auto pt-8 pb-4">
          Project by Team 2
        </p>
      </main>
    </div>
  );
};

export default TicketDashboard;