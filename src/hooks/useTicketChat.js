import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const useTicketChat = (ticketId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newSocket = io("http://localhost:3000", {
      auth: { token: user.accessToken }
    });
    setSocket(newSocket);

    newSocket.emit('joinTicket', { ticketId });

    newSocket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect();
  }, [ticketId]);

  const sendMessage = (text, senderId) => {
    if (socket && text) {
      socket.emit('sendMessage', { ticketId, senderId, content: text });
    }
  };

  return { messages, sendMessage };
};