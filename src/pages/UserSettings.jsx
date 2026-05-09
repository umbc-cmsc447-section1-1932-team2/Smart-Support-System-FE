import React, { useState } from 'react';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const SettingsSection = ({ title, subtitle, icon: Icon, value, type }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mb-10 px-10">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#1e293b]">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="bg-[#f8faff] rounded-xl p-4 flex items-center justify-between border border-blue-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-400 border border-orange-100">
            <Icon className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
              Active {type}
            </p>
            <p className="text-sm font-bold text-slate-700">{value}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-8 py-2 bg-[#7691d4] hover:bg-[#5f79be] text-white text-sm font-bold rounded-md transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing && (
        <div className="mt-4 p-6 bg-white border border-slate-100 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-4 max-w-md">
            
            {/* EMAIL FORM LOGIC */}
            {type === 'email' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">New Email Address</label>
                  <input 
                    type="text"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter new email address"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">Confirm New Email Address</label>
                  <input 
                    type="text"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Confirm new email address"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e4eb8] uppercase mb-1 px-1">Current Password</label>
                  <input 
                    type="password"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter current password to verify"
                  />
                </div>
              </>
            )}

            {/* PASSWORD FORM LOGIC - UPDATED ORDER */}
            {type === 'password' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">New Password</label>
                  <input 
                    type="password"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">Confirm New Password</label>
                  <input 
                    type="password"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Repeat new password"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e4eb8] uppercase mb-1 px-1">Current Password</label>
                  <input 
                    type="password"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter current password to verify"
                  />
                </div>
              </>
            )}

            <button className="w-full py-3 mt-2 bg-[#1e4eb8] hover:bg-[#163a8a] text-white font-bold rounded-lg text-sm transition-colors">
              Update {type === 'email' ? 'Email' : 'Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AccountSettings = () => {
  return (
    <div className="w-full flex justify-start"> 
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[90vh] mt-4 ml-4">
        
        <div className="p-10 pb-6">
          <h1 className="text-3xl font-black text-[#1e293b] mb-6">Account Settings</h1>
          <hr className="border-slate-100" />
        </div>

        <div className="py-6">
          <SettingsSection 
            title="Change email"
            subtitle="Replace the email address associated with this account."
            icon={HiOutlineMail}
            value="user@gmail.com"
            type="email"
          />

          <SettingsSection 
            title="Change password"
            subtitle="Keep your account secure by updating your password regularly."
            icon={HiOutlineLockClosed}
            value="********"
            type="password"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;