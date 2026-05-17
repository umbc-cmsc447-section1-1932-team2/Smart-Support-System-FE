import React from "react";
import { useAgentDashboard } from "../hooks/useAgentDashboard";
import { useTicketChat } from "../hooks/useTicketChat";

import PageHeader from "../components/layout/PageHeader";
import AgentStats from "../components/agent/AgentStats";
import AgentTicketTable from "../components/agent/AgentTicketTable";

import ChatHeader from "../components/chat/ChatHeader";
import MessageFeed from "../components/chat/MessageFeed";
import ChatInput from "../components/chat/ChatInput";
import TicketSidebar from "../components/chat/TicketSidebar";
import { getStatusMeta } from "../utils/ticketStatus";

const STATUS_TABS = [
  { key: "QUEUE", label: "Support Queue" },
  { key: "MY_TICKETS", label: "My Active Chats" },
  { key: "CLOSED", label: "Closed" },
];

const AgentDashboard = ({ onCreateTicket }) => {
  const {
    currentTab,
    setCurrentTab,
    displayTickets,
    isLoading,
    tickets,
    currentUser,
    handleClaimTicket,
    selectedTicketId,
    setSelectedTicketId,
    updateTicketInList,
  } = useAgentDashboard();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const URLTab = params.get("tab");
    if (URLTab && URLTab !== currentTab) {
      setCurrentTab(URLTab);
    }
  }, [window.location.search, currentTab, setCurrentTab]);

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("app:chat-mode", { detail: !!selectedTicketId }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("app:chat-mode", { detail: false }),
      );
    };
  }, [selectedTicketId]);

  const chatProps = useTicketChat(selectedTicketId);

  const handleStatusUpdate = (id, status) => {
    chatProps.updateTicketLocal({ status });
    updateTicketInList(id, { status });
  };

  const queueCount = tickets.filter(
    (t) => t?.status?.toUpperCase() === "OPEN",
  ).length;
  const activeChatsCount = tickets.filter(
    (t) =>
      t?.status === "IN_PROGRESS" &&
      String(t.assignedToId) === String(currentUser?.id),
  ).length;
  const closedCount = tickets.filter(
    (t) =>
      (t?.status === "RESOLVED" ||
        t?.status === "CLOSED" ||
        t?.status === "CLOSED_NOT_RESOLVED") &&
      String(t.assignedToId) === String(currentUser?.id),
  ).length;
  const tabBadges = {
    QUEUE: queueCount,
    MY_TICKETS: activeChatsCount,
    CLOSED: closedCount,
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F8FAFC] font-sans">
      {!selectedTicketId ? (
        <main className="flex-1 flex flex-col p-8 overflow-y-auto animate-in fade-in duration-500">
          <PageHeader
            title={`Welcome back, ${currentUser?.username || "Agent"}!`}
            subtitle="Here's what's happening in your support queue today."
          />

          <div className="mb-6">
            <AgentStats tickets={tickets} currentUser={currentUser} />
          </div>

          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {STATUS_TABS.map((tab) => {
                const isActive = currentTab === tab.key;
                const badge = tabBadges[tab.key];
                return (
                  <button
                    key={tab.key}
                    onClick={() => setCurrentTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm  transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    {badge > 0 && (
                      <span
                        className={`px-1.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={onCreateTicket}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              + Create New Ticket
            </button>
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
          <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <div className="h-20 px-5 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center shadow-sm">
              <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between w-full">
                Support Queue
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {displayTickets.length}
                </span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {displayTickets.map((t) => {
                const isActive = selectedTicketId === t.id;
                const meta = getStatusMeta(t.status);
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all relative group overflow-hidden ${
                      isActive
                        ? "bg-blue-50/80 border border-blue-200 shadow-sm"
                        : "bg-transparent hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isActive ? "bg-blue-600 scale-y-100" : "bg-slate-300 scale-y-0 group-hover:scale-y-100"}`}
                    />
                    <span
                      className={`block text-sm font-bold truncate mb-1 ${isActive ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {t.createdBy?.username || "Customer"}
                    </span>
                    <p className="text-xs text-slate-500 truncate mb-1.5">
                      {t.title}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeSoft}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50 relative">
            <div className="shrink-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm z-10">
              <ChatHeader
                ticket={chatProps.ticket}
                ticketId={selectedTicketId}
                onBack={() => setSelectedTicketId(null)} // Clicking back clears ID and returns to State 1
                onStatusUpdate={handleStatusUpdate}
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
            <TicketSidebar
              ticket={chatProps.ticket}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
