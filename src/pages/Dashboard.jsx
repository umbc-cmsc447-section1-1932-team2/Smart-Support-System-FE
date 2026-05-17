import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api";
import PageHeader from "../components/layout/PageHeader";
import { useAuth } from "../context/AuthContext";
import UserStats from "../components/UserStats";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { getStatusMeta } from "../utils/ticketStatus";

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Open" },
  { key: "CLOSED", label: "Closed" },
];

const matchesTab = (status, tab) => {
  if (tab === "ALL") return true;
  if (tab === "OPEN")
    return (
      status === "OPEN" ||
      status === "IN_PROGRESS" ||
      status === "WAITING_ON_CUSTOMER"
    );
  if (tab === "CLOSED")
    return (
      status === "RESOLVED" ||
      status === "CLOSED_NOT_RESOLVED" ||
      status === "CLOSED"
    );
  return true;
};

const Dashboard = ({ onCreateTicket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/ticket/me");
      const ticketArray = Array.isArray(response)
        ? response
        : response.tickets || response.data || [];
      setTickets(ticketArray);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchUserTickets();
  }, [user, fetchUserTickets]);

  useEffect(() => {
    const onTicketCreated = () => fetchUserTickets();
    window.addEventListener("ticket:created", onTicketCreated);
    return () => window.removeEventListener("ticket:created", onTicketCreated);
  }, [fetchUserTickets]);
  const filteredTickets = (tickets ?? []).filter(
    (ticket) =>
      matchesTab(ticket.status, currentTab) &&
      (ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const sortedTickets = [...filteredTickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <div className="flex flex-col ">
      <main className="pt-4 px-6 md:px-10 pb-6  h-[85vh]">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            title={`Welcome back, ${user?.username || "User"}!`}
            subtitle="Here's an overview of your support tickets"
          />

          <div className="mb-5 ">
            <UserStats tickets={tickets} />
          </div>

          <div className="">
            <div className="flex items-center gap-2 mb-3">
              {STATUS_TABS.map((tab) => {
                const isActive = currentTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setCurrentTab(tab.key)}
                    className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search tickets by title or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl rounded-b-none  outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="bg-white rounded-2xl rounded-t-none shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[40vh] max-h-86 mb-4">
              <div className="bg-gray-50/50 border-b border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500 text-xs font-semibold uppercase">
                      <th className="px-8 py-4 text-left">Date Created</th>
                      <th className="px-8 py-4 text-left">Ticket Title</th>
                      <th className="px-8 py-4 text-center">Status</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="overflow-y-auto flex-1">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-50">
                    {isLoading ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-12 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : sortedTickets.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-8 py-12 text-center text-gray-500 font-medium"
                        >
                          {searchQuery ? "No tickets match your search" : ""}
                        </td>
                      </tr>
                    ) : (
                      sortedTickets.map((ticket) => {
                        const statusInfo = getStatusMeta(ticket.status);
                        return (
                          <tr
                            key={ticket.id}
                            className="hover:bg-gray-50/50"
                          >
                            <td className="px-8 text-sm text-gray-500 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date(
                                  ticket.createdAt,
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-8 py-5 transition-colors text-sm text-gray-800 max-w-xs truncate">
                              {ticket.title}
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
                              >
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button
                                onClick={() => navigate(`/chat/${ticket.id}`)}
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-800 bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg font-extralight text-sm transition-all"
                              >
                                View
                                <ArrowRight size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {!isLoading && tickets.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <p>Create your first ticket to get started!</p>
                </div>
              )}
            </div>
            <div className="flex justify-start">
              <button
                onClick={onCreateTicket}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extralight rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                + Create New Ticket
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
