import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "../../utils/api";
import {
  STATUS_ORDER,
  STATUS_META,
  getStatusMeta,
} from "../../utils/ticketStatus";

const ChatHeader = ({ ticket, ticketId, onBack, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentStatus = ticket?.status || "OPEN";
  const meta = getStatusMeta(currentStatus);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      const res = await apiFetch(`/ticket/${ticketId}`, "PATCH", {
        status: newStatus,
      });
      if (res.ok && onStatusUpdate) onStatusUpdate(ticketId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
          {ticket?.createdBy?.username?.charAt(0).toUpperCase() || "C"}
        </div>
        <div>
          <h1 className="font-bold text-slate-800 leading-tight">
            {ticket?.createdBy?.username || "Customer"}
          </h1>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Active in chat
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Status:
        </span>
        <select
          value={STATUS_META[currentStatus] ? currentStatus : "OPEN"}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className={`appearance-none font-bold text-xs px-4 py-2 pr-8 rounded-lg border outline-none cursor-pointer transition-all ${meta.badge} ${
            isUpdating ? "opacity-50" : "hover:brightness-95"
          }`}
        >
          {STATUS_ORDER.map((key) => (
            <option key={key} value={key}>
              {STATUS_META[key].icon} {STATUS_META[key].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChatHeader;
