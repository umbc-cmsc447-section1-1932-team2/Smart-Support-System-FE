import React, { useState, useEffect } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const VerifyUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const pendingCount = users.length;

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const mockUsers = [
          { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'AGENT', dateJoined: '5/16/2026 at 02:15 PM' },
          { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'USER', dateJoined: '5/16/2026 at 01:10 AM' },
          { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'AGENT', dateJoined: '5/15/2026 at 11:45 PM' },
        ];
        setUsers(mockUsers);
      } catch (error) {
        toast.error("Failed to load pending verification queue.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleVerify = async (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Account successfully verified!");
    } catch (error) {
      toast.error("Could not verify account.");
    }
  };

  const handleDeny = async (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Registration request denied.");
    } catch (error) {
      toast.error("Could not deny account request.");
    }
  };

  return (
    <div className="w-full flex justify-start"> 
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[90vh] mt-4 ml-4 flex flex-col">
        
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-black text-[#1e293b]">Account Verification</h1>
            <span className="bg-blue-50 text-[#1e4eb8] text-xs font-black px-3 py-1 rounded-full border border-blue-100">
              {pendingCount} Pending
            </span>
          </div>
          <hr className="border-slate-100" />
        </div>

        <div className="flex-grow overflow-y-auto px-10 pb-10">
          <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
            <div className="max-h-[55vh] overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center text-sm text-slate-400 font-medium animate-pulse">
                  Loading pending queue...
                </div>
              ) : users.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-slate-400 font-bold text-base">All clear!</p>
                  <p className="text-gray-400 text-xs mt-1">No user registrations are currently pending verification.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between px-8 py-6 transition-colors hover:bg-slate-50/30"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <HiOutlineUserCircle className="text-4xl text-slate-300 flex-shrink-0" />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 text-sm truncate">{user.name}</p>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-50 text-red-600' 
                              : user.role === 'AGENT'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5 truncate">{user.email}</p>
                        <p className="text-gray-400 text-[10px] mt-1">
                          Registered: {user.dateJoined}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button 
                        onClick={() => handleVerify(user.id)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDeny(user.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyUsers;