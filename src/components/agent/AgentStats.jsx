import React from 'react';
import { Zap, Clock, CheckCircle } from 'lucide-react';

const AgentStats = ({ tickets, currentUser }) => {
  const globalOpen = tickets.filter(t => t?.status === 'OPEN').length;
  const myActive = tickets.filter(t => t?.status === 'IN_PROGRESS' && String(t.assignedToId) === String(currentUser.id)).length;
  const myResolved = tickets.filter(t => (t?.status === 'RESOLVED' || t?.status === 'CLOSED_NOT_RESOLVED') && String(t.assignedToId) === String(currentUser.id)).length;

  const StatCard = ({ icon: Icon, label, value, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        icon={Zap} 
        label="Global Queue" 
        value={globalOpen} 
        colorClass="text-blue-600" 
        bgClass="bg-blue-50" 
      />
      <StatCard 
        icon={Clock} 
        label="My Active Chats" 
        value={myActive} 
        colorClass="text-yellow-600" 
        bgClass="bg-yellow-50" 
      />
      <StatCard 
        icon={CheckCircle} 
        label="My Resolved" 
        value={myResolved} 
        colorClass="text-green-600" 
        bgClass="bg-green-50" 
      />
    </div>
  );
};

export default AgentStats;