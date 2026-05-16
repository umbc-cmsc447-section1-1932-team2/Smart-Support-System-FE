import React from 'react';
import { useAgentDashboard } from '../hooks/useAgentDashboard';
import { useTicketChat } from '../hooks/useTicketChat';

// Core Dashboard Components
import AgentSidebar from '../components/agent/AgentSidebar';
import AgentHeader from '../components/agent/AgentHeader';
import AgentStats from '../components/agent/AgentStats';
import AgentTicketTable from '../components/agent/AgentTicketTable';

// Chat & Context Components
import ChatHeader from '../components/chat/ChatHeader';
import MessageFeed from '../components/chat/MessageFeed';
import ChatInput from '../components/chat/ChatInput';
import TicketSidebar from '../components/chat/TicketSidebar';

const AgentDashboard = () => {
  const { 
    currentTab, setCurrentTab, displayTickets, isLoading, 
    tickets, currentUser, handleClaimTicket, handleLogout,
    selectedTicketId, setSelectedTicketId 
  } = useAgentDashboard();

  const chatProps = useTicketChat(selectedTicketId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans">
      
      {/* =========================================
          GLOBAL: FAR LEFT NAVIGATION
          ========================================= */}
      <AgentSidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        tickets={tickets} 
        currentUser={currentUser} 
        isCollapsed={!!selectedTicketId} 
      />

      {/* =========================================
          DYNAMIC MAIN AREA
          ========================================= */}
      {!selectedTicketId ? (
        
        // 🌟 STATE 1: FULL DASHBOARD (No chat active)
        <main className="flex-1 flex flex-col p-8 overflow-y-auto animate-in fade-in duration-500">
          <AgentHeader currentUser={currentUser} handleLogout={handleLogout} />
          
          <div className="mb-6">
            <AgentStats tickets={tickets} currentUser={currentUser} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <AgentTicketTable 
              displayTickets={displayTickets} 
              isLoading={isLoading} 
              handleClaimTicket={handleClaimTicket} 
              onSelectTicket={(id) => setSelectedTicketId(id)} 
              activeTicketId={selectedTicketId}
            />
          </div>
        </main>

      ) : (

        // 🌟 STATE 2: 3-PANE HELPDESK WORKSPACE (Chat active)
        <div className="flex-1 flex overflow-hidden animate-in slide-in-from-right-8 duration-300">
          
          {/* PANE 1: Compact Ticket Queue (Left) */}
          {/* We map your real displayTickets here so you don't lose context! */}
          <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between">
                Support Queue
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {displayTickets.length}
                </span>
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {displayTickets.map((t) => {
                const isActive = selectedTicketId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all relative group overflow-hidden ${
                      isActive 
                        ? 'bg-blue-50/80 border border-blue-200 shadow-sm' 
                        : 'bg-transparent hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isActive ? 'bg-blue-600 scale-y-100' : 'bg-slate-300 scale-y-0 group-hover:scale-y-100'}`} />
                    <span className={`block text-sm font-bold truncate mb-1 ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                      {t.createdBy?.username || 'Customer'}
                    </span>
                    <p className="text-xs text-slate-500 font-medium truncate">{t.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PANE 2: Chat Theater (Center) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50 relative">
            <div className="shrink-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm z-10">
              <ChatHeader 
                ticket={chatProps.ticket} 
                ticketId={selectedTicketId} 
                onBack={() => setSelectedTicketId(null)} // Clicking back clears ID and returns to State 1
              />
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
               <MessageFeed 
                 messages={chatProps.messages} 
                 currentUser={currentUser} 
                 scrollRef={chatProps.scrollRef} 
               />
            </div>
            
            <div className="shrink-0 bg-white/90 backdrop-blur-sm border-t border-slate-200">
              <ChatInput 
                newMessage={chatProps.newMessage} 
                setNewMessage={chatProps.setNewMessage} 
                onSend={chatProps.handleSend} 
              />
            </div>
          </div>

          {/* PANE 3: Action Context (Right) */}
          <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
            {/* Your existing TicketSidebar drops perfectly in here! */}
            <TicketSidebar ticket={chatProps.ticket} />
          </div>

        </div>
      )}

    </div>
  );
};

export default AgentDashboard;