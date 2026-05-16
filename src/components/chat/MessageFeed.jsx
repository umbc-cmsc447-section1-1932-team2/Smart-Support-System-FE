import React from 'react';
import smartLogo from '../../assets/logo.png';

const MessageFeed = ({ messages, currentUser, scrollRef }) => {
  return (
    <div 
      className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative" 
      ref={scrollRef}
    >
      
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.035] pointer-events-none select-none mix-blend-multiply"
        style={{ 
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><g fill='%232563eb' font-family='sans-serif'><image href='${smartLogo}' x='30' y='40' width='60' height='60'/><text x='110' y='85' font-size='32' font-weight='900' letter-spacing='-1'>SMART</text><text x='110' y='110' font-size='10' font-weight='700' fill='%2364748b' letter-spacing='3'>AGENT COMMAND</text></g></svg>")`,
          backgroundSize: '400px 250px'
        }}
      />
      
      <div className="relative z-10 space-y-6"> 
        {messages.map((msg) => {
          const isAgent = msg.senderId === currentUser.id;
          return (
            <div 
              key={msg.id} 
              className={`flex ${isAgent ? 'justify-end' : 'justify-start'} animate-[slideInUp_0.4s_ease-out]`}
            >
              <div 
                className={`px-5 py-3 rounded-2xl max-w-[80%] text-sm font-medium shadow-sm transition-all ${
                  isAgent 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-blue-500/20' 
                    : 'bg-white border-l-4 border-l-blue-500 text-slate-700 rounded-tl-sm shadow-slate-100'
                }`}
              >
                {msg.content}
                <span className={`block text-[10px] mt-1 ${isAgent ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageFeed;