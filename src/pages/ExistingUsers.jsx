import React, { useState, useEffect, useMemo } from 'react';
import { HiOutlineUser, HiOutlineUserGroup, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { apiFetch } from "../utils/api";

const ExistingUsers = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('USER');
  const [isDeletingId, setIsDeletingId] = useState(null);

  useEffect(() => {
    const fetchAllAccounts = async () => {
      try {
        const response = await apiFetch('/user/all');
        const accountArray = response?.data || (Array.isArray(response) ? response : []);
        
        if (Array.isArray(accountArray)) {
          setAccounts(accountArray);
        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Could not load account profiles.");
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAccounts();
  }, []);

  const groupedData = useMemo(() => {
    return {
      USER: accounts.filter(acc => acc?.role?.toUpperCase() === 'USER'),
      AGENT: accounts.filter(acc => acc?.role?.toUpperCase() === 'AGENT'),
      ADMIN: accounts.filter(acc => acc?.role?.toUpperCase() === 'ADMIN'),
    };
  }, [accounts]);

  const currentList = groupedData[activeTab] || [];

  const handleDeleteConfirm = async () => {
    if (!isDeletingId) return;

    const previousAccounts = [...accounts];
    setAccounts(accounts.filter(acc => String(acc.id || acc._id) !== isDeletingId));
    const targetId = isDeletingId;
    setIsDeletingId(null);

    try {
      await apiFetch(`/user/${targetId}`, 'DELETE');
      toast.success("Account permanently removed from system database.");
    } catch (error) {
      console.error(error);
      setAccounts(previousAccounts);
      toast.error("Could not delete account profile from database server.");
    }
  };

  const getTabStyle = (tabName) => activeTab === tabName
    ? "flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-[#1e4eb8] border border-blue-100 font-bold rounded-xl shadow-sm transition-all text-sm"
    : "flex items-center gap-2 px-5 py-2.5 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition-all text-sm cursor-pointer";

  return (
    <div className="w-full flex justify-start animate-in fade-in duration-500"> 
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[60vh] mt-4 ml-4 flex flex-col">
        
        <div className="p-10 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-[#1e293b]">Existing Users</h1>
              <span className="bg-blue-50 text-[#1e4eb8] text-xs font-black px-3 py-1 rounded-full border border-blue-100">
                {accounts.length} profiles found
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 self-start md:self-auto">
              <button onClick={() => setActiveTab('USER')} className={getTabStyle('USER')}>
                <HiOutlineUser className="text-base" /> Users ({groupedData.USER.length})
              </button>
              <button onClick={() => setActiveTab('AGENT')} className={getTabStyle('AGENT')}>
                <HiOutlineUserGroup className="text-base" /> Agents ({groupedData.AGENT.length})
              </button>
              <button onClick={() => setActiveTab('ADMIN')} className={getTabStyle('ADMIN')}>
                <HiOutlineShieldCheck className="text-base" /> Admins ({groupedData.ADMIN.length})
              </button>
            </div>
          </div>
          <hr className="border-slate-100" />
        </div>

        <div className="flex-grow overflow-y-auto px-10 pb-10">
          <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="p-16 text-center text-sm text-slate-400 font-medium animate-pulse">
                  Loading directory...
                </div>
              ) : currentList.length === 0 ? (
                <div className="p-20 text-center">
                  <p className="text-slate-400 font-bold text-base">No active profiles</p>
                  <p className="text-gray-400 text-xs mt-1">There are no accounts assigned to the {activeTab.toLowerCase()} profile.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider sticky top-0 bg-white z-10">
                      <th className="px-8 py-4">Profile</th>
                      {activeTab !== 'USER' && <th className="px-8 py-4">Status</th>}
                      <th className="px-8 py-4">Email Address</th>
                      <th className="px-8 py-4 text-right">Remove Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentList.map((account) => {
                      const idString = String(account.id || account._id || '');
                      const isVerified = account.verification?.toUpperCase() === 'VERIFIED';
                      
                      return (
                        <tr key={idString} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <span className="font-black text-slate-800 text-sm">
                              {account.name || account.username}
                            </span>
                          </td>
                          {activeTab !== 'USER' && (
                            <td className="px-8 py-5">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isVerified 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {account.verification || 'UNVERIFIED'}
                              </span>
                            </td>
                          )}
                          <td className="px-8 py-5 text-xs font-medium text-slate-500">
                            {account.email}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => setIsDeletingId(idString)}
                              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>

      {isDeletingId && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 max-w-sm w-full mx-4 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Account Record?</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
              Are you sure you want to delete this user account?
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-sm transition-all"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExistingUsers;