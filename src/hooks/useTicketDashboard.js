import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export const useTicketDashboard = () => {

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState('ALL');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState('newest');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tickets, setTickets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchMyTickets = useCallback(async () => {
    setIsLoading(true);
    const response = await apiFetch('/ticket/me');
    if (response.ok && response.data) {
      setTickets(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  useEffect(() => {
    const onTicketCreated = () => fetchMyTickets();
    window.addEventListener('ticket:created', onTicketCreated);
    return () => window.removeEventListener('ticket:created', onTicketCreated);
  }, [fetchMyTickets]);

  const myTickets = useMemo(() => {

    return tickets.filter(t => String(t.createdById) === String(currentUser.id));
  }, [tickets, currentUser.id]);

  const displayTickets = useMemo(() => {
    return myTickets

      .filter(ticket => {
        if (currentTab === 'ALL') return true;

        if (currentTab === 'OPEN') {

          return (
            ticket.status === 'OPEN' ||
            ticket.status === 'IN_PROGRESS' ||
            ticket.status === 'WAITING_ON_CUSTOMER'
          );
        }

        if (currentTab === 'CLOSED') {

          return (
            ticket.status === 'RESOLVED' ||
            ticket.status === 'CLOSED_NOT_RESOLVED' ||
            ticket.status === 'CLOSED'
          );
        }
        return true;
      })
      .sort((a, b) => {

        const dateA = new Date(a.createdAt);

        const dateB = new Date(b.createdAt);

        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB; 
      });
  }, [myTickets, currentTab, sortOrder]);

  const handleLogout = () => {

    localStorage.removeItem('user');

    navigate("/login");
  };

  return {
    currentTab, setCurrentTab,

    isFilterOpen, setIsFilterOpen,

    sortOrder, setSortOrder,

    isModalOpen, setIsModalOpen,

    displayTickets,

    selectedTicketId,

    setSelectedTicketId,

    myTickets,

    isLoading,

    handleLogout,

    navigate

  };
};