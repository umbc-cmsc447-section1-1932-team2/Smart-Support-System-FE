import React from 'react';
import { Inbox, Ticket, CheckCircle2 } from 'lucide-react';
import logo from "../../assets/logo.png";

const AgentSidebar = ({ currentTab, setCurrentTab, tickets, currentUser }) => {
  const getSidebarStyle = (tabName) => currentTab === tabName 
    ? "flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 shadow-sm font-bold rounded-xl cursor-pointer border border-blue-100 transition-all"
    : "flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl cursor-pointer hover:bg-gray-50 hover:text-blue-600 transition-all duration-200";

  const openTicketsCount = tickets.filter(t => t?.status?.toUpperCase() === 'OPEN').length;
  const activeChatsCount = tickets.filter(t => t?.status === 'IN_PROGRESS' && String(t.assignedToId) === String(currentUser.id)).length;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col z-20">
      <div className="flex items-center gap-3 p-8 border-b border-gray-100">
        <img src={logo} alt="Logo" className="w-10 drop-shadow-sm" />
        <div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight leading-none">SMART</h1>
          <p className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">AGENT COMMAND</p>
        </div>
      </div>

      <div className="p-6 flex-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Workspace</p>
        <nav className="flex flex-col gap-2">
          <div onClick={() => setCurrentTab('QUEUE')} className={getSidebarStyle('QUEUE')}>
            <Inbox size={20} /> Support Queue
            {openTicketsCount > 0 && (
              <span className="ml-auto bg-blue-600 text-white py-0.5 px-2.5 rounded-full text-xs font-black shadow-sm animate-pulse">
                {openTicketsCount}
              </span>
            )}
          </div>

          <div onClick={() => setCurrentTab('MY_TICKETS')} className={getSidebarStyle('MY_TICKETS')}>
            <Ticket size={20} /> My Active Chats
            <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs font-bold">
              {activeChatsCount}
            </span>
          </div>

          <div onClick={() => setCurrentTab('CLOSED')} className={getSidebarStyle('CLOSED')}>
            <CheckCircle2 size={20} /> My Closed Tickets
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AgentSidebar;