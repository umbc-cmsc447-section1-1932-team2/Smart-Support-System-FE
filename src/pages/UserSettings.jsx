import React, { useState } from 'react';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from "../utils/api";

const SettingsSection = ({ title, subtitle, icon: Icon, value, type, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailData, setEmailData] = useState({ newEmail: '', confirmEmail: '', currentPassword: '' });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '', currentPassword: '' });

  const handleInputChange = (e, field, formType) => {
    if (formType === 'email') {
      setEmailData({ ...emailData, [field]: e.target.value });
    } else {
      setPasswordData({ ...passwordData, [field]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'email') {
        if (!emailData.newEmail || !emailData.confirmEmail || !emailData.currentPassword) {
          toast.error("Please fill in all email fields.");
          setLoading(false);
          return;
        }
        if (emailData.newEmail !== emailData.confirmEmail) {
          toast.error("New email addresses do not match.");
          setLoading(false);
          return;
        }

        const response = await apiFetch('/user/profile', 'PATCH', {
          email: emailData.newEmail,
          currentPassword: emailData.currentPassword
        });

        const errorMsg = response?.message || response?.error || response?.data?.message || response?.data?.error;
        const hasErrorStatus = response?.statusCode >= 400 || response?.status >= 400 || response?.success === false;

        if (errorMsg || hasErrorStatus) {
          setLoading(false);
          return;
        }

        toast.success("Email updated successfully!");
        
        const updatedUser = response?.data || response;
        if (onUpdateSuccess && updatedUser) {
          onUpdateSuccess(updatedUser);
        }
        
        setEmailData({ newEmail: '', confirmEmail: '', currentPassword: '' });
      } else {
        if (!passwordData.newPassword || !passwordData.confirmPassword || !passwordData.currentPassword) {
          toast.error("Please fill in all password fields.");
          setLoading(false);
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error("New passwords do not match.");
          setLoading(false);
          return;
        }

        const response = await apiFetch('/user/profile', 'PATCH', {
          newPassword: passwordData.newPassword,
          currentPassword: passwordData.currentPassword
        });

        const errorMsg = response?.message || response?.error || response?.data?.message || response?.data?.error;
        const hasErrorStatus = response?.statusCode >= 400 || response?.status >= 400 || response?.success === false;

        if (errorMsg || hasErrorStatus) {
          setLoading(false);
          return;
        }

        toast.success("Password updated successfully!");
        setPasswordData({ newPassword: '', confirmPassword: '', currentPassword: '' });
      }
      setIsEditing(false);
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="mt-4 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div className="space-y-4 max-w-md">
            
            {type === 'email' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">New Email Address</label>
                  <input 
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => handleInputChange(e, 'newEmail', 'email')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter new email address"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">Confirm New Email Address</label>
                  <input 
                    type="email"
                    value={emailData.confirmEmail}
                    onChange={(e) => handleInputChange(e, 'confirmEmail', 'email')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Confirm new email address"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e4eb8] uppercase mb-1 px-1">Current Password</label>
                  <input 
                    type="password"
                    value={emailData.currentPassword}
                    onChange={(e) => handleInputChange(e, 'currentPassword', 'email')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter current password to verify"
                  />
                </div>
              </>
            )}

            {type === 'password' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">New Password</label>
                  <input 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handleInputChange(e, 'newPassword', 'password')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handleInputChange(e, 'confirmPassword', 'password')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Repeat new password"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#1e4eb8] uppercase mb-1 px-1">Current Password</label>
                  <input 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handleInputChange(e, 'currentPassword', 'password')}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Enter current password to verify"
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#1e4eb8] hover:bg-[#163a8a] text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : `Update ${type === 'email' ? 'Email' : 'Password'}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const AccountSettings = () => {
  const { user, login } = useAuth();

  const handleUserUpdate = (updatedUser) => {
    if (updatedUser) {
      login({ ...user, ...updatedUser });
    }
  };

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
            value={user?.email || "user@gmail.com"}
            type="email"
            onUpdateSuccess={handleUserUpdate}
          />

          <SettingsSection 
            title="Change password"
            subtitle="Keep your account secure by updating your password."
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