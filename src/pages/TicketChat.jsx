import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, ArrowLeft, CheckCircle, Clock, User, Info } from 'lucide-react';
import { apiFetch } from '../utils/api';


const TicketChat = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ticket, setTicket] = useState(null);
  const socketRef = useRef();
  const scrollRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


  const handleBackNavigation = () => {
    if (currentUser.role === 'AGENT') {
      navigate('/agent-dashboard', { state: { activeTab: 'MY_TICKETS' } });
    } else {
      navigate('/view-tickets', { state: { activeTab: 'MY_TICKETS' } });
    }
  };

  useEffect(() => {
    // Fetch ticket details and history first
    const loadData = async () => {
      const res = await apiFetch(`/ticket/${ticketId}`);
      if (res.ok) {
        setTicket(res.data);
        setMessages(res.data.messages || []);
      }
    };
    loadData();

    // Initialize Socket Connection with Auth Token
    socketRef.current = io('http://localhost:3000', {
      auth: { token: currentUser.accessToken }
    });

    // Join the private ticket room
    socketRef.current.emit('joinTicket', { ticketId, userId: currentUser.id });

    // Listen for new messages
    socketRef.current.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, [ticketId, currentUser.id, currentUser.accessToken]);

  // scroll to bottom whenever a message is sent
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Matches Gateway: { ticketId, senderId, content }
    socketRef.current.emit('sendMessage', {
      ticketId,
      senderId: currentUser.id,
      content: newMessage
    });

    setNewMessage('');
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
            onClick={handleBackNavigation} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {ticket?.createdBy?.username || 'Client'}
              </h2>
              <span className="text-[10px] text-blue-500 font-mono font-bold uppercase tracking-tighter">
                Ticket ID: {ticketId?.slice(0, 8)}...
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl hover:bg-green-600 hover:text-white transition-all font-bold text-xs uppercase">
            <CheckCircle size={16} /> Mark Resolved
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] group`}>
                  <p className={`text-[10px] mb-1 font-semibold text-gray-400 ${isMe ? 'text-right' : 'text-left'}`}>
                    {isMe ? 'You (Agent)' : (msg.sender?.username || 'Client')}
                  </p>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className={`text-[9px] mt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t">
          <div className="flex gap-3 items-center bg-gray-100 p-2 rounded-2xl border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your response..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3"
            />
            <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* --- RIGHT SIDEBAR: CONTEXT PANE --- */}
      <aside className="w-80 bg-white border-l hidden xl:flex flex-col p-8 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Info size={18} className="text-blue-600" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Case Details</h3>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h4 className="font-bold text-gray-800 text-sm mb-2">{ticket?.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              "{ticket?.description}"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock size={16} />
            <span className="text-xs font-medium">Created: {new Date(ticket?.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <User size={16} />
            <span className="text-xs font-medium">Customer: {ticket?.createdBy?.email}</span>
          </div>
        </div>

        <div className="mt-auto border-t pt-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Status Control</p>
          <select className="w-full bg-gray-50 border-gray-200 rounded-xl text-xs font-bold p-3 outline-none focus:border-blue-500">
            <option>IN_PROGRESS</option>
            <option>PENDING_CUSTOMER</option>
            <option>RESOLVED</option>
          </select>
        </div>
      </aside>
    </div>
  );
};

export default TicketChat;