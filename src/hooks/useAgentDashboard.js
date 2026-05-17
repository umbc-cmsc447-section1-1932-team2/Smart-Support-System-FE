import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { apiFetch, BASE_URL } from "../utils/api";

export const useAgentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [currentTab, setCurrentTab] = useState(
    location.state?.activeTab || "MY_TICKETS",
  );
  const [sortOrder, setSortOrder] = useState("newest");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const tabRef = useRef(currentTab);
  useEffect(() => {
    tabRef.current = currentTab;
  }, [currentTab]);

  const fetchDashboardTickets = async () => {
    setIsLoading(true);

    const res = await apiFetch("/ticket");
    if (res.ok) {
      setTickets(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardTickets();
  }, []);

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      auth: { token: currentUser.accessToken },
    });

    setSocket(newSocket);

    newSocket.on("refreshData", () => {
      fetchDashboardTickets(tabRef.current);
    });

    newSocket.on("newTicketAlert", (newTicket) => {
      setTickets((prev) =>
        prev.find((t) => t.id === newTicket.id) ? prev : [newTicket, ...prev],
      );
    });

    newSocket.on("ticketClaimed", ({ ticketId, agentId }) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: "IN_PROGRESS", assignedToId: agentId }
            : t,
        ),
      );
    });

    return () => {
      newSocket.off("refreshData");
      newSocket.off("newTicketAlert");

      newSocket.off("ticketClaimed");

      newSocket.disconnect();
    };
  }, [currentUser.accessToken]);

  const displayTickets = useMemo(() => {
    return tickets

      .filter((ticket) => {
        if (!ticket) return false;

        const status = ticket.status?.toUpperCase();
        if (currentTab === "QUEUE") return status === "OPEN";

        if (currentTab === "MY_TICKETS")
          return (
            status === "IN_PROGRESS" &&
            String(ticket.assignedToId) === String(currentUser.id)
          );

        if (currentTab === "CLOSED") {
          return (
            (status === "RESOLVED" ||
              status === "CLOSED" ||
              status === "CLOSED_NOT_RESOLVED") &&
            String(ticket.assignedToId) === String(currentUser.id)
          );
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);

        const dateB = new Date(b.createdAt || 0);

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [tickets, currentTab, sortOrder, currentUser.id]);

  const handleClaimTicket = async (ticketId) => {
    try {
      await apiFetch(`/ticket/${ticketId}/assign`, "PATCH", {
        agentId: currentUser.id,
      });

      const tempSocket = io(BASE_URL);

      tempSocket.emit("triggerDashboardUpdate");

      tempSocket.disconnect();
    } catch (error) {
      console.error("Error claiming ticket:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  const updateTicketInList = (ticketId, partial) => {
    setTickets((prev) =>
      prev.map((t) =>
        String(t.id) === String(ticketId) ? { ...t, ...partial } : t,
      ),
    );
  };

  return {
    currentTab,

    setCurrentTab,

    displayTickets,

    isLoading,

    tickets,

    currentUser,

    handleClaimTicket,

    handleLogout,

    selectedTicketId,

    setSelectedTicketId,

    updateTicketInList,
  };
};
