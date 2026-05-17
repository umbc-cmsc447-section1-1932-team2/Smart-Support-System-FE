import React from 'react';

const UserStats = ({ tickets = [] }) => {
  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;
  const pendingCount = tickets.filter(t => t.status === 'PENDING').length;

  const statCards = [
    { label: 'Open Tickets', value: openCount, color: 'text-blue-700' },
    { label: 'Resolved Tickets', value: resolvedCount, color: 'text-gray-700' },
    { label: 'Pending Actions', value: pendingCount, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {statCards.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex  justify-between items-center h-10 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {stat.label}
          </p>
          <p className={`text-3xl font-black ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserStats;