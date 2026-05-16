import React, { useState, useEffect } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { apiFetch } from "../utils/api";

const VerifyUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await apiFetch('/user/all');
        const userArray = response?.data || (Array.isArray(response) ? response : []);
        
        if (Array.isArray(userArray)) {
          const pendingStaff = userArray.filter(
            user => user.verification === 'UNVERIFIED' && (user.role === 'AGENT' || user.role === 'ADMIN')
          );
          setUsers(pendingStaff);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to load verification queue:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleVerify = async (userId) => {
    const previousUsers = [...users];
    setUsers(users.filter(user => user.id !== userId));
    
    try {
      await apiFetch(`/user/${userId}/verify`, 'PATCH');
      toast.success("Account successfully verified!");
    } catch (error) {
      console.error("Verification backend sync issue:", error);
      setUsers(previousUsers);
      toast.error("Could not verify account.");
    }
  };

  const handleDeny = async (userId) => {
    const previousUsers = [...users];
    setUsers(users.filter(user => user.id !== userId));
    
    try {
      await apiFetch(`/user/${userId}`, 'DELETE');
      toast.success("Registration request denied. Account removed from system.");
    } catch (error) {
      console.error("Account deletion backend sync issue:", error);
      setUsers(previousUsers);
      toast.error("Could not delete account from server.");
    }
  };

  return (
    <div className="w-full flex justify-start"> 
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[90vh] mt-4 ml-4 flex flex-col">
        
        <div className="p-10 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-black text-[#1e293b]">Staff Verification</h1>
            <span className="bg-blue-50 text-[#1e4eb8] text-xs font-black px-3 py-1 rounded-full border border-blue-100">
              {users.length} Pending
            </span>
          </div>
          <hr className="border-slate-100" />
        </div>

        <div className="flex-grow overflow-y-auto px-10 pb-10">
          <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
            <div className="max-h-[55vh] overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center text-sm text-slate-400 font-medium animate-pulse">
                  Loading staff verification queue...
                </div>
              ) : users.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-slate-400 font-bold text-base">All clear!</p>
                  <p className="text-gray-400 text-xs mt-1">No agent or admin applications are currently pending.</p>
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
                          <p className="font-black text-slate-900 text-sm truncate">{user.name || user.username}</p>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-50 text-red-600' 
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5 truncate">{user.email}</p>
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