import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckCircle2, Inbox, Ticket, LogOut, ChevronDown, UserPlus, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png"; 
import { apiFetch } from '../utils/api'; 
import { useNavigate, useLocation } from 'react-router-dom';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Initialize it

  const [currentTab, setCurrentTab] = useState(location.state?.activeTab || 'QUEUE');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); 
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


  window.apiFetch = apiFetch;
useEffect(() => {
  const fetchTickets = async () => {
    setIsLoading(true);
    
    // tab state to the exact backend routes we just created
    let endpoint = '';
    if (currentTab === 'QUEUE') {
      endpoint = '/ticket/queue';    
    } else if (currentTab === 'MY_TICKETS') {
      endpoint = '/ticket/assigned'; 
    } else {
      endpoint = '/ticket';          
    }

    const res = await apiFetch(endpoint);
    
    if (res.ok) {
      setTickets(res.data);
    }
    
    setIsLoading(false);
  };

  fetchTickets();
}, [currentTab]); 

const filteredTickets = tickets.filter(ticket => {
  if (!ticket) return false;
  
  const status = ticket.status?.toUpperCase(); 

  if (currentTab === 'QUEUE') {
    return status === 'OPEN';
  }
  
 if (currentTab === 'MY_TICKETS') {
  return (
    status === 'IN_PROGRESS' && 
    String(ticket.assignedToId) === String(currentUser.id) // make both to String
  );
}

  // my closed tickets Tab
  if (currentTab === 'CLOSED') {
    return (
      (status === 'RESOLVED' || status === 'CLOSED_NOT_RESOLVED') && 
      String(ticket.assignedToId) === String(currentUser.id)
    );
  }

  return true;
});

  const displayTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB; 
  });

const handleClaimTicket = async (ticketId) => {

  //test things
  console.log("🛠️ Attempting Claim...");
  console.log("Agent ID from LocalStorage:", currentUser.id);
  console.log("Ticket ID being claimed:", ticketId);

  if (!currentUser.id) {
    console.error("Error: No Agent ID found in LocalStorage");
    return;
  }

  const response = await apiFetch(`/ticket/${ticketId}`, 'PATCH', {
    status: 'IN_PROGRESS',
    assignedToId: currentUser.id
  });

  if (response.ok) {
    console.log("Backend updated successfully!");
    
    // update local state so it moves tabs instantly
    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { ...t, status: 'IN_PROGRESS', assignedToId: currentUser.id } 
        : t
    ));
    
    setCurrentTab('MY_TICKETS');
  } else {
    console.error("Backend rejected the claim:", response);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate("/login");
  };

  const getSidebarStyle = (tabName) => {
    return currentTab === tabName 
      ? "flex items-center gap-3 px-4 py-3 text-blue-600 bg-white shadow-sm font-semibold rounded-xl cursor-pointer border border-gray-100 transition-all"
      : "flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl cursor-pointer hover:bg-white hover:text-blue-600 hover:shadow-sm hover:scale-105 transition-all duration-300";
  };

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'RESOLVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CLOSED_NOT_RESOLVED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 p-8 border-b border-gray-100">
          <img src={logo} alt="Logo" className="w-10" />
          <div>
            <h1 className="text-xl font-bold text-blue-600 leading-none">SMART</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mt-0.5">AGENT COMMAND</p>
          </div>
        </div>

        <div className="p-6 flex-1">
          <nav className="flex flex-col gap-2">
            <div onClick={() => setCurrentTab('QUEUE')} className={getSidebarStyle('QUEUE')}>
              <Inbox size={20} /> Support Queue
              <span className="ml-auto bg-blue-50 text-blue-600 py-0.5 px-2 rounded-full text-xs font-bold">
                {tickets.filter(t => t?.status?.toUpperCase() === 'OPEN').length}
              </span>
            </div>

            <div onClick={() => setCurrentTab('MY_TICKETS')} className={getSidebarStyle('MY_TICKETS')}>
              <Ticket size={20} /> My Active Chats
              <span className="ml-auto bg-blue-50 text-blue-600 py-0.5 px-2 rounded-full text-xs font-bold">
                {tickets.filter(t => t?.status === 'IN_PROGRESS' && String(t.assignedToId) === String(currentUser.id)).length}
              </span>
            </div>

            <div onClick={() => setCurrentTab('CLOSED')} className={getSidebarStyle('CLOSED')}>
              <CheckCircle2 size={20} /> My Closed Tickets
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-10 overflow-y-auto h-screen">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="Search Tickets..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl" />
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 border border-gray-200 px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} /> Log Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-xs font-semibold uppercase bg-gray-50/50">
              <tr>
                <th className="px-8 py-4">Date Created</th>
                <th className="px-8 py-4">Ticket Details</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Reported By</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="5" className="px-8 py-10 text-center animate-pulse">Loading dashboard...</td></tr>
              ) : displayTickets.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-10 text-center text-gray-400">No tickets found in this workspace.</td></tr>
              ) : (
                displayTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14}/> {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {ticket.title}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic" title={ticket.description}>
                          "{ticket.description}"
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${getStatusBadge(ticket.status)}`}>
                        {ticket.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center text-sm font-medium text-gray-600">
                      {ticket.createdBy?.username || ticket.createdBy?.email || 'Anonymous'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end">
                        {ticket.status === 'OPEN' ? (
                          <button onClick={() => handleClaimTicket(ticket.id)} className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-all font-semibold text-sm">
                            <UserPlus size={16} /> Claim
                          </button>
                        ) : (
                          <button onClick={() => navigate(`/chat/${ticket.id}`)} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-all font-semibold text-sm">
                            Enter Chat <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="text-center text-sm text-blue-600 font-semibold mt-auto pt-8 pb-4">Project by Team 2</p>
      </main>
    </div>
  );
};

export default AgentDashboard;