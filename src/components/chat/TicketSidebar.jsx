import React, { useState } from 'react';
import { Mail, Clock, CheckCircle, ChevronDown, User } from 'lucide-react';
import { apiFetch, BASE_URL } from '../../utils/api';
import { io } from 'socket.io-client';
import {
  STATUS_ORDER,
  STATUS_META,
  getStatusMeta,
} from '../../utils/ticketStatus';

const TicketSidebar = ({ ticket, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatus = ticket?.status || 'OPEN';
  const meta = getStatusMeta(currentStatus);

const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      const res = await apiFetch(`/ticket/${ticket.id}`, 'PATCH', {
        status: newStatus,
      });

      const tempSocket = io(BASE_URL);
      tempSocket.emit('triggerDashboardUpdate');
      tempSocket.disconnect();

      if (res.ok && onStatusUpdate) onStatusUpdate(ticket.id, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      
     
      <div className="p-6 border-b border-slate-200 bg-slate-50/80">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
          Master Case Status
        </h3>
        
        <div className="relative">
          <select
            value={STATUS_META[currentStatus] ? currentStatus : 'OPEN'}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`w-full appearance-none font-bold text-sm px-5 py-4 rounded-xl border-2 outline-none cursor-pointer transition-all shadow-sm ${meta.badgeSoft} ${isUpdating ? 'opacity-50' : 'hover:brightness-95'}`}
          >
            {STATUS_ORDER.map((key) => (
              <option key={key} value={key}>
                {STATUS_META[key].icon} {STATUS_META[key].label}
              </option>
            ))}
          </select>
          
          <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isUpdating ? 'text-slate-300' : 'text-slate-500'}`} size={20} />
        </div>
      </div>

      
      <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center relative">
        <div className="w-16 h-16 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-inner">
          <User size={32} />
        </div>
        <h2 className="font-black text-lg text-slate-800">
          {ticket?.createdBy?.username || 'Customer'}
        </h2>
        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
          Premium Support
        </span>
      </div>

     
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Mail size={12} /> Email Address
          </h3>
          <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 break-all">
            {ticket?.createdBy?.email || 'No email provided'}
          </p>
        </div>
        
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <CheckCircle size={12} /> Original Issue
          </h3>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-sm font-bold text-slate-800">{ticket.title}</p>
            <p className="text-sm text-slate-500 mt-2 italic border-l-2 border-slate-300 pl-3">
              "{ticket.description || 'No description provided.'}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-50 py-3 px-4 rounded-xl border border-slate-100 uppercase tracking-wide">
          <Clock size={14} />
          Opened: {new Date(ticket.createdAt).toLocaleDateString()}
        </div>

      </div>
    </div>
  );
};

export default TicketSidebar;