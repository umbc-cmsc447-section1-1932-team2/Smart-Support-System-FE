import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineTicket, 
  HiOutlineInbox, 
  HiOutlineCheckCircle,
  HiOutlineCog,
  HiOutlinePencilAlt
} from 'react-icons/hi';

const NavItem = ({ icon: Icon, label, active, badge, onClick, sub }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between rounded-xl cursor-pointer transition-all ${
      sub ? 'ml-9 px-3 py-1.5' : 'px-4 py-3'
    } ${
      active ? 'bg-white shadow-md text-[#1e4eb8]' : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={sub ? "text-lg" : "text-xl"} />
      <span className={`${sub ? "text-[14px] font-medium" : "text-[15px] font-bold"}`}>
        {label}
      </span>
    </div>
    {badge > 0 && (
      <span className="bg-blue-100 text-[#1e4eb8] text-[10px] font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const AgentSidebar = ({ onCreateTicket, onCloseModal, agentControls, tickets, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDashboard = location.pathname === '/agent-dashboard';

  // Calculate dynamic badges matching your hook configuration
  const openTicketsCount = tickets?.filter(t => t?.status?.toUpperCase() === 'OPEN').length || 0;
  const activeChatsCount = tickets?.filter(t => t?.status === 'IN_PROGRESS' && String(t.assignedToId) === String(currentUser?.id)).length || 0;

  const handleTabSwitch = (tabName) => {
    if (onCloseModal) onCloseModal();
    
    if (isOnDashboard && agentControls) {
      agentControls.clearChat(); 
      agentControls.setCurrentTab(tabName);
    } else {
      // Pass the tab name securely through the URL parameters
      navigate(`/agent-dashboard?tab=${tabName}`);
    }
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col p-4 pt-16 h-screen">
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">
          Navigation
        </p>
        
        <NavItem 
          icon={HiOutlineHome} 
          label="Agent Dashboard" 
          active={isOnDashboard && agentControls?.currentTab === 'QUEUE' && !agentControls?.hasActiveChat}
          onClick={() => handleTabSwitch('QUEUE')} 
        />
        
        <div className="space-y-1">
          <NavItem 
            sub
            icon={HiOutlineTicket} 
            label="Support Queue" 
            active={isOnDashboard && agentControls?.currentTab === 'QUEUE'}
            badge={openTicketsCount}
            onClick={() => handleTabSwitch('QUEUE')} 
          />

          <NavItem 
            sub 
            icon={HiOutlineInbox} 
            label="My Active chats" 
            active={isOnDashboard && agentControls?.currentTab === 'MY_TICKETS'}
            badge={activeChatsCount}
            onClick={() => handleTabSwitch('MY_TICKETS')} 
          />
          
          <NavItem 
            sub 
            icon={HiOutlineCheckCircle} 
            label="My Closed Tickets" 
            active={isOnDashboard && agentControls?.currentTab === 'CLOSED'}
            onClick={() => handleTabSwitch('CLOSED')} 
          />
        </div>

        <div className="pt-2">
          <NavItem 
            icon={HiOutlinePencilAlt} 
            label="Create New Ticket" 
            onClick={onCreateTicket} 
          />
        </div>
      </nav>

      <div className="pt-4 border-t border-slate-200">
        <NavItem 
          icon={HiOutlineCog} 
          label="Account Management" 
          active={location.pathname === '/account'}
          onClick={() => navigate('/account')} 
        />
      </div>
    </aside>
  );
};

export default AgentSidebar;