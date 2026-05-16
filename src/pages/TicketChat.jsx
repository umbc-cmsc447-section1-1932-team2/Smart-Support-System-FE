import React from 'react';
import logo from "../assets/logo.png"; 
import { useTicketChat } from '../hooks/useTicketChat';
import ChatHeader from '../components/chat/ChatHeader';
import MessageFeed from '../components/chat/MessageFeed';
import ChatInput from '../components/chat/ChatInput';

const TicketChat = () => {
  // 1. Destructure everything from the custom hook controller
  const { 
    ticketId, 
    ticket, 
    messages, 
    newMessage, 
    setNewMessage, 
    currentUser, 
    scrollRef, 
    handleSend, 
    handleBackNavigation 
  } = useTicketChat();

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden relative">
      
      {/* Optional: The professional watermark asset layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
        <img src={logo} alt="Watermark" className="w-1/3 max-w-sm grayscale" />
      </div>

      {/* Column 1: Navigation / Filter Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-10">
        <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
          Support Queue
        </div>
        {/* List of other assigned tickets can be mapped here */}
      </aside>

      {/* Column 2: Chat Hub Area */}
      <main className="flex-1 flex flex-col bg-white z-10">
        <ChatHeader 
          ticket={ticket} 
          ticketId={ticketId} 
          onBack={handleBackNavigation} 
        />
        <MessageFeed 
          messages={messages} 
          currentUser={currentUser} 
          scrollRef={scrollRef} 
        />
        <ChatInput 
          newMessage={newMessage} 
          setNewMessage={setNewMessage} 
          onSend={handleSend} 
        />
      </main>

      {/* Column 3: The "Human Fact-Sheet" Information Context Panel */}
      <aside className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col p-6 overflow-y-auto z-10">
        <section className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Context</h3>
          <div className="space-y-4">
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 font-bold uppercase">Email</span>
               <span className="text-sm font-medium text-gray-800 truncate">{ticket?.createdBy?.email || 'N/A'}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 font-bold uppercase">Account Tier</span>
               <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 w-fit mt-1 uppercase tracking-tighter">
                 Premium Support
               </span>
             </div>
          </div>
        </section>

        <section className="mt-auto border-t pt-6 border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Response Time</h3>
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
             <p className="text-[10px] text-gray-500 mb-1">Time since last customer message:</p>
             <p className="text-xl font-black text-gray-800">14m 22s</p>
          </div>
        </section>
      </aside>

    </div>
  );
};

export default TicketChat;