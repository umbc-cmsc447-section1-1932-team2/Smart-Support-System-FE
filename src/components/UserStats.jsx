import React from 'react';


const UserStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
    {[
      { label: 'Open Tickets', value: '2', color: 'text-blue-700' },
      { label: 'Resolved Tickets', value: '11', color: 'text-gray-700' },
      { label: 'Pending Actions', value: '1', color: 'text-amber-400' },
    ].map((stat, i) => (
      <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
        <p className={`text-5xl font-black ${stat.color}`}>{stat.value}</p>
      </div>
    ))}
  </div>
);

export default UserStats;