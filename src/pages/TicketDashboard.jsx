import React from 'react';
import { Search, Filter, Plus, Calendar, Home, CheckCircle2, Inbox, Ticket, LogOut, ChevronDown, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png"; 
import CreateTicketModal from '../components/CreateTicketModal';
import { useTicketDashboard } from '../hooks/useTicketDashboard';

const TicketDashboard = () => {
  const {
    currentTab, setCurrentTab,
    isFilterOpen, setIsFilterOpen,
    sortOrder, setSortOrder,
    isModalOpen, setIsModalOpen,
    displayTickets,
    myTickets,
    isLoading,
    handleLogout,
    navigate
  } = useTicketDashboard();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const URLTab = params.get('tab');
    if (URLTab && URLTab !== currentTab) {
      setCurrentTab(URLTab);
    }
  }, [window.location.search, currentTab, setCurrentTab]);

  const agentControls = {
    currentTab,
    setCurrentTab,
    ticketCount: myTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
    clearChat: () => {} // Fallback empty handler since user views map to page links directly
  };

  const getSidebarStyle = (tabName) => currentTab === tabName 
    ? "flex items-center gap-3 px-4 py-3 text-primary bg-white shadow-sm font-semibold rounded-xl cursor-pointer border border-gray-100 transition-all"
    : "flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl cursor-pointer hover:bg-white hover:text-primary hover:shadow-sm hover:scale-105 transition-all duration-300";

  const getStatusBadge = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'RESOLVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CLOSED_NOT_RESOLVED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex bg-offwhite">
      {/* Sidebar Section */}
      <aside className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 p-8 border-b border-gray-100">
          <img src={logo} alt="Smart Support Logo" className="w-10" />
          <div>
            <h1 className="text-xl font-bold text-primary leading-none">SMART</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider mt-0.5">SUPPORT SYSTEM</p>
          </div>
        </div>

        <div className="p-6 flex-1">
          <nav className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl cursor-pointer hover:bg-white hover:text-primary transition-all">
              <Home size={20} /> Dashboard
            </div>
            
            <div onClick={() => setCurrentTab('ALL')} className={getSidebarStyle('ALL')}>
              <Ticket size={20} /> View All Tickets
            </div>
            <div onClick={() => setCurrentTab('OPEN')} className={getSidebarStyle('OPEN')}>
              <Inbox size={20} /> Open Tickets
              <span className="ml-auto bg-primary/10 text-primary py-0.5 px-2 rounded-full text-xs font-bold">
                {myTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}
              </span>
            </div>
            <div onClick={() => setCurrentTab('CLOSED')} className={getSidebarStyle('CLOSED')}>
              <CheckCircle2 size={20} /> Closed Tickets
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-10 overflow-y-auto h-screen">
        {/* Navbar area logic */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="Search Tickets..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl" />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all font-medium whitespace-nowrap">
                <Filter size={18} /> Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-2">
                  <button onClick={() => { setSortOrder('newest'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm ${sortOrder === 'newest' ? 'bg-primary/5 text-primary font-bold' : ''}`}>Newest First</button>
                  <button onClick={() => { setSortOrder('oldest'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm ${sortOrder === 'oldest' ? 'bg-primary/5 text-primary font-bold' : ''}`}>Oldest First</button>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 border border-gray-200 px-5 py-2.5 rounded-xl bg-white hover:text-red-600 transition-all">
            <LogOut size={18} /> Log Out
          </button>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-xs font-semibold uppercase bg-gray-50/50">
              <tr>
                <th className="px-8 py-4">Date Created</th>
                <th className="px-8 py-4">Ticket Title</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="4" className="px-8 py-10 text-center animate-pulse">Loading tickets...</td></tr>
              ) : displayTickets.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-10 text-center text-gray-500">No tickets found.</td></tr>
              ) : (
                displayTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5 text-sm text-gray-500">
                      <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-5 font-medium text-gray-800">{ticket.title}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => navigate(`/chat/${ticket.id}`)} className="text-primary hover:text-blue-800 bg-primary/5 px-4 py-2 rounded-lg font-semibold text-sm">
                        View Chat <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-start">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl shadow transition-all font-semibold text-sm hover:scale-105 active:scale-95">
            <Plus size={20} /> Create New Ticket
          </button>
        </div>
      </main>

      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TicketDashboard;