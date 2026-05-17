import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Inbox,
  Ticket,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTicketDashboard } from "../hooks/useTicketDashboard";
import PageHeader from "../components/layout/PageHeader";
import { getStatusMeta } from "../utils/ticketStatus";

/**
 * Ticket Dashboard - User view of their tickets
 * - Uses main UserLayout sidebar for navigation (no internal sidebar)
 * - Shows ticket list with search and sort functionality
 * - Logout moved to navbar (no duplication)
 * - Modal management handled by UserLayout parent
 */
const TicketDashboard = ({ onCreateTicket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [localSortOrder, setLocalSortOrder] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { currentTab, setCurrentTab, displayTickets, myTickets, isLoading } =
    useTicketDashboard();

  // Sync URL params with current tab
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const URLTab = params.get("tab");
    if (URLTab && URLTab !== currentTab) {
      setCurrentTab(URLTab);
    }
  }, [window.location.search, currentTab, setCurrentTab]);


  const filteredTickets = displayTickets.filter(
    (ticket) =>
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return localSortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const getTabLabel = () => {
    switch (currentTab) {
      case "ALL":
        return "All Tickets";
      case "OPEN":
        return "Open Tickets";
      case "CLOSED":
        return "Closed Tickets";
      default:
        return "Tickets";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <PageHeader
          title={getTabLabel()}
          subtitle={`${sortedTickets.length} ticket${sortedTickets.length !== 1 ? "s" : ""} found`}
        />

        {/* Toolbar: Search & Sort */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm font-medium"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all font-medium whitespace-nowrap"
            >
              <Filter size={18} /> Sort:{" "}
              {localSortOrder === "newest" ? "Newest" : "Oldest"}
              <ChevronDown
                size={14}
                className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-2">
                <button
                  onClick={() => {
                    setLocalSortOrder("newest");
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${localSortOrder === "newest" ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-gray-50"}`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setLocalSortOrder("oldest");
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${localSortOrder === "oldest" ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-gray-50"}`}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-xs font-semibold uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4">Date Created</th>
                <th className="px-8 py-4">Ticket Title</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 overflow-y-auto">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-10 text-center animate-pulse text-gray-500"
                  >
                    Loading tickets...
                  </td>
                </tr>
              ) : sortedTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-10 text-center text-gray-500 font-medium"
                  >
                    {searchQuery
                      ? "No tickets match your search."
                      : "No tickets found."}
                  </td>
                </tr>
              ) : (
                sortedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium text-gray-800 max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className="px-8 py-5 text-center">
                      {(() => {
                        const meta = getStatusMeta(ticket.status);
                        return (
                          <span
                            className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${meta.badge}`}
                          >
                            {meta.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => navigate(`/chat/${ticket.id}`)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ml-auto transition-all"
                      >
                        View <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TicketDashboard;
