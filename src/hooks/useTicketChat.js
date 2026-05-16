import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 

import { io } from 'socket.io-client';

import { apiFetch } from '../utils/api';

export const useTicketChat = (inlineTicketId = null) => {

  const { ticketId: routeTicketId } = useParams();

  const ticketId = inlineTicketId || routeTicketId;

  const [ticket, setTicket] = useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');

  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate(); 

  const socketRef = useRef();

  const scrollRef = useRef();

  const ticketTitleRef = useRef('Case');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleBackNavigation = () => {

    const targetRoute = currentUser.role === 'AGENT' ? '/agent-dashboard' : '/view-tickets';

    navigate(targetRoute, { state: { activeTab: 'MY_TICKETS' } });
  };

  useEffect(() => {

    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages]);

  useEffect(() => {
    if (!ticketId) {

      setTicket(null);

      setMessages([]);

      ticketTitleRef.current = 'Case';
      return;
    }

 const loadTicketData = async () => {
      try {

        const payload = await apiFetch(`/ticket/${ticketId}`);
        
        const activeTicket = payload?.data || payload;

        if (activeTicket) {

          setTicket(activeTicket);

          ticketTitleRef.current = activeTicket.title || 'Case';
          
          const history = activeTicket.messages || [];

          setMessages(history);
        }

      } catch (err) {

        console.error("Failed loading ticket metadata info:", err);
      }
    };


    loadTicketData();

    socketRef.current = io('http://localhost:3000', {
      auth: { token: currentUser.accessToken }
    });

    socketRef.current.emit('joinTicket', { ticketId, userId: currentUser.id });

    socketRef.current.on('newMessage', (msg) => {

      setMessages((prev) => [...prev, msg]);

      if (document.hidden) {
        setUnreadCount((prev) => {
          const nextCount = prev + 1;

          document.title = `🔔 (${nextCount}) New Message`;

          return nextCount;
        }); 
        
        if (Notification.permission === "granted") {

          new Notification(`New message regarding ${ticketTitleRef.current}`, {

            body: msg.content,

            icon: '/logo.png'

          });
        }
      }
    });

    const handleVisibility = () => {
      if (!document.hidden) {

        document.title = "Smart Support System";

        setUnreadCount(0); 
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (socketRef.current) {

        socketRef.current.off('newMessage'); 

        socketRef.current.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    
  }, [ticketId, currentUser.accessToken, currentUser.id]); 

  const handleSend = (e, directTextValue = null) => {

    if (e?.preventDefault) e.preventDefault();
    
    const textToSend = directTextValue !== null ? directTextValue : newMessage;
    if (!textToSend?.trim()) return;

    
    if (!socketRef.current) {

      console.error("Socket instance connection unavailable.");
      return;
    }

    socketRef.current.emit('sendMessage', { 
      ticketId, 

      senderId: currentUser.id, 

      content: textToSend.trim() 

    });
    
    setNewMessage('');
  };

  return { 

    ticketId,

    ticket, 

    messages, 

    newMessage,

    setNewMessage, 

    currentUser, 

    scrollRef, 

    handleSend, 

    handleBackNavigation, 

    unreadCount 
    
  };
};