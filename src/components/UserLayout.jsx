import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar";
import UserSidebar from "./UserSidebar";
import AgentSidebar from "./AgentSidebar";
import AdminSidebar from "./AdminSidebar";
import CreateTicketModal from "./CreateTicketModal";

const UserLayout = ({ children, data, agentControls, tickets, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const renderSidebar = () => {
  switch (user?.role) {
    case 'ADMIN':
      return <AdminSidebar onCreateTicket={toggleModal} 
      onCloseModal={() => setIsModalOpen(false)}
      agentControls={agentControls}
      tickets={tickets}
      currentUser={currentUser}/>;
    case 'AGENT':
      return <AgentSidebar onCreateTicket={toggleModal}
      agentControls={agentControls}
      tickets={tickets}
      currentUser={currentUser}/>;
    case 'USER':
    default:
      return <UserSidebar 
          onCreateTicket={toggleModal} 
          onCloseModal={() => setIsModalOpen(false)}
          agentControls={agentControls}
          tickets={tickets}
          currentUser={currentUser}
        />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <div className="z-20">
        <Navbar />
      </div>

      <div className="flex flex-grow overflow-hidden">
        {renderSidebar()}

        <main className="flex-grow overflow-y-auto pt-24 px-6 md:px-10">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { onCreateTicket: toggleModal });
            }
            return child;
          })}
        </main>
      </div>

      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default UserLayout;