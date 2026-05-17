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

const Sidebar = ({ onCreateTicket, onCloseModal, agentControls }) => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const isOnDashboard = location.pathname === '/view-tickets' || location.pathname === '/dashboard';

  const handleTabSwitch = (tabName) => {
    if (onCloseModal) onCloseModal();
    
    if (isOnDashboard && agentControls) {
      agentControls.setCurrentTab(tabName);
    } else {
      
      navigate(`/view-tickets?tab=${tabName}`);
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
          label="Dashboard" 
          active={isOnDashboard && agentControls?.currentTab === 'ALL'}
          onClick={() => {
            if (onCloseModal) onCloseModal();
            navigate('/dashboard');
          }} 
        />
        
        <NavItem 
          icon={HiOutlineTicket} 
          label="View All Tickets" 
          active={isOnDashboard && agentControls?.currentTab === 'ALL'}
          onClick={() => handleTabSwitch('ALL')} 
        />

        <div className="space-y-1">
          <NavItem 
            sub 
            icon={HiOutlineInbox} 
            label="Open Tickets" 
            active={isOnDashboard && agentControls?.currentTab === 'OPEN'}
            badge={isOnDashboard ? agentControls?.ticketCount : 0} 
            onClick={() => handleTabSwitch('OPEN')} 
          />
          <NavItem 
            sub 
            icon={HiOutlineCheckCircle} 
            label="Closed Tickets" 
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
          label="Account Settings" 
          active={location.pathname === '/account'}
          onClick={() => navigate('/account')} 
        />
      </div>
    </aside>
  );
};

export default Sidebar;