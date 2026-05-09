import React, { useState } from 'react';
import Navbar from "./Navbar";
import Sidebar from "./UserSidebar";
import CreateTicketModal from "./CreateTicketModal";

const UserLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <div className="z-20">
        <Navbar />
      </div>

      <div className="flex flex-grow overflow-hidden">
        <Sidebar onCreateTicket={toggleModal} />

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