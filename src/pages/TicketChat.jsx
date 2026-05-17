import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTicketChat } from "../hooks/useTicketChat";
import { apiFetch } from "../utils/api";
import { getStatusMeta } from "../utils/ticketStatus";
import ChatHeader from "../components/chat/ChatHeader";
import MessageFeed from "../components/chat/MessageFeed";
import ChatInput from "../components/chat/ChatInput";

const TicketChat = () => {
  const navigate = useNavigate();
  const {
    ticketId,
    ticket,
    messages,
    newMessage,
    setNewMessage,
    currentUser,
    scrollRef,
    handleSend,
    handleBackNavigation,
    updateTicketLocal,
  } = useTicketChat();

  const handleStatusUpdate = (_id, status) => updateTicketLocal({ status });
  const [timeSince, setTimeSince] = useState("");
  const [queueTickets, setQueueTickets] = useState([]);

  const isAgent =
    currentUser?.role === "AGENT" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const fetchQueue = async () => {
      const endpoint = isAgent ? "/ticket" : "/ticket/me";
      const res = await apiFetch(endpoint);
      let list = Array.isArray(res?.data)
        ? res.data
        : res?.data?.tickets || [];
      if (isAgent) {
        list = list.filter(
          (t) =>
            t?.status === "IN_PROGRESS" &&
            String(t.assignedToId) === String(currentUser?.id),
        );
      }
      setQueueTickets(list);
    };
    fetchQueue();

    const onTicketCreated = () => fetchQueue();
    window.addEventListener("ticket:created", onTicketCreated);
    return () =>
      window.removeEventListener("ticket:created", onTicketCreated);
  }, [currentUser?.id, isAgent]);

  const getTimeSince = (dateString) => {
    const now = new Date();
    const updated = new Date(dateString);

    const diffMs = now - updated;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
      return `${weeks}w ${days % 7}d`;
    }

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }

    return `${seconds}s`;
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeSince(getTimeSince(ticket?.updatedAt));
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [ticket?.updatedAt]);

  return (
    <div className="z-100 flex h-screen bg-[#F3F4F6] overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
        <img src={logo} alt="Watermark" className="w-1/3 max-w-sm grayscale" />
      </div>

      {/* Column 1: Ticket Queue Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-10">
        <div className="p-6 border-b border-gray-100 font-bold text-gray-900 flex items-center justify-between">
          <span>{isAgent ? "Support Queue" : "My Tickets"}</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {queueTickets.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {queueTickets.length === 0 ? (
            <p className="text-xs text-gray-400 text-center p-4">
              No tickets yet
            </p>
          ) : (
            queueTickets.map((t) => {
              const isActive = String(t.id) === String(ticketId);
              const meta = getStatusMeta(t.status);
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(`/chat/${t.id}`)}
                  className={`w-full text-left p-3 rounded-lg transition-all relative overflow-hidden ${
                    isActive
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                  )}
                  <p
                    className={`text-sm font-semibold truncate ${
                      isActive ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {t.title}
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeSoft}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-white z-10">
        <ChatHeader
          ticket={ticket}
          ticketId={ticketId}
          onBack={handleBackNavigation}
          onStatusUpdate={handleStatusUpdate}
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
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Ticket Context
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase">
                Email
              </span>
              <span className="text-sm font-medium text-gray-800 truncate">
                {ticket?.createdBy?.email || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase">
                Account Type
              </span>
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 w-fit mt-1 uppercase tracking-tighter">
                Premium Support
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <span className="mt-2 text-[10px] text-gray-500 font-bold uppercase">
                  Title
                </span>
                <p className="text-sm font-semibold text-gray-700">
                  {ticket?.title}
                </p>
                <span className="mt-2 text-[10px] text-gray-500 font-bold uppercase font-mono ">
                  Description
                </span>
                <p className="text-sm text-slate-500 mt-2 italic border-l-2 border-slate-300 pl-3">
                  {ticket?.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-auto border-t pt-6 border-gray-200">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Response Time
          </h3>
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-[10px] text-gray-500 mb-1">Time since Update:</p>
            <p className="text-xl font-black text-gray-800">{timeSince}</p>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default TicketChat;
