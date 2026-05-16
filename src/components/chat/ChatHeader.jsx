import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const ChatHeader = ({ ticket, ticketId, onBack, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentStatus = ticket?.status || 'OPEN';

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await apiFetch(`/ticket/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (onStatusUpdate) onStatusUpdate(ticketId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusColors = {
    OPEN: 'bg-amber-100 text-amber-800 border-amber-200',

    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',

    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CLOSED: 'bg-slate-200 text-slate-600 border-slate-300',
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

        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
          {ticket?.createdBy?.username?.charAt(0).toUpperCase() || 'C'}

        </div>
        <div>
          <h1 className="font-bold text-slate-800 leading-tight">
            {ticket?.createdBy?.username || 'Customer'}
          </h1>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">

            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Active in chat
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status:</span>
        <select
          value={currentStatus}
          onChange={handleStatusChange}

          disabled={isUpdating}

          className={`appearance-none font-bold text-xs px-4 py-2 pr-8 rounded-lg border outline-none cursor-pointer transition-all ${statusColors[currentStatus]} ${isUpdating ? 'opacity-50' : 'hover:brightness-95'}`}
        >
          <option value="OPEN">🟠 Open</option>

          <option value="IN_PROGRESS">🔵 In Progress</option>

          <option value="RESOLVED">🟢 Resolved</option>

          <option value="CLOSED">⚫ Closed</option>

        </select>
      </div>
    </div>
  );
};

export default ChatHeader;