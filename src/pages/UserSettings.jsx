import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import { getNotifPrefs, setNotifPrefs } from "../utils/notifPrefs";

const SectionCard = ({ title, subtitle, icon: Icon, currentValue, children }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mb-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
            <Icon className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
              Current
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">
              {currentValue || "—"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing((v) => !v)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-md transition-colors shrink-0 ml-3"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing && (
        <div className="mt-3 p-5 bg-white border border-slate-100 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-200">
          {children({ close: () => setIsEditing(false) })}
        </div>
      )}
    </div>
  );
};

const Field = ({ label, ...rest }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 px-1">
      {label}
    </label>
    <input
      {...rest}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
    />
  </div>
);

const SubmitButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-lg text-sm transition-colors"
  >
    {loading ? "Saving…" : children}
  </button>
);

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const useProfilePatch = () => {
  const { updateUser } = useAuth();
  return async (body) => {
    const res = await apiFetch("/user/profile", "PATCH", body);
    if (res.ok && res.data) {
      const { id, email, username, phone, role, verification } = res.data;
      updateUser({ id, email, username, phone, role, verification });
    }
    return res;
  };
};

const EmailForm = ({ close, currentEmail }) => {
  const patch = useProfilePatch();
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return toast.error("Enter a valid email address");
    if (email !== confirm) return toast.error("Emails don't match");
    if (email === currentEmail) return toast.error("That's your current email");

    setLoading(true);
    const res = await patch({ email });
    setLoading(false);
    if (res.ok) {
      toast.success("Email updated");
      close();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <Field
        label="New email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Field
        label="Confirm new email"
        type="email"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repeat new email"
        required
      />
      <SubmitButton loading={loading}>Update email</SubmitButton>
    </form>
  );
};

const PhoneForm = ({ close, currentPhone }) => {
  const patch = useProfilePatch();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = phone.trim();
    if (trimmed.length < 7) return toast.error("Enter a valid phone number");
    if (trimmed === currentPhone) return toast.error("That's your current phone");

    setLoading(true);
    const res = await patch({ phone: trimmed });
    setLoading(false);
    if (res.ok) {
      toast.success("Phone updated");
      close();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <Field
        label="New phone number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+1 555 123 4567"
        autoComplete="tel"
        required
      />
      <SubmitButton loading={loading}>Update phone</SubmitButton>
    </form>
  );
};

const PasswordForm = ({ close }) => {
  const patch = useProfilePatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (newPassword !== confirm) return toast.error("Passwords don't match");
    if (!currentPassword) return toast.error("Current password is required");

    setLoading(true);
    const res = await patch({ currentPassword, newPassword });
    setLoading(false);
    if (res.ok) {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      close();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <Field
        label="New password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="At least 6 characters"
        autoComplete="new-password"
        required
      />
      <Field
        label="Confirm new password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repeat new password"
        autoComplete="new-password"
        required
      />
      <Field
        label="Current password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter your current password"
        autoComplete="current-password"
        required
      />
      <SubmitButton loading={loading}>Update password</SubmitButton>
    </form>
  );
};

const Toggle = ({ checked, onChange, label, sub }) => (
  <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
    <div className="min-w-0">
      <p className="text-sm font-bold text-slate-700">{label}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
    <span
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </span>
  </label>
);

const NotificationSettings = () => {
  const [prefs, setPrefs] = useState(getNotifPrefs);

  useEffect(() => {
    const handler = (e) => setPrefs(e.detail);
    window.addEventListener("notif-prefs:changed", handler);
    return () => window.removeEventListener("notif-prefs:changed", handler);
  }, []);

  const update = async (key, value) => {
    if (
      key === "os" &&
      value &&
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      const result = await Notification.requestPermission().catch(() => "denied");
      if (result !== "granted") {
        toast.error("Browser denied notification permission");
        return;
      }
    }
    setNotifPrefs({ [key]: value });
  };

  return (
    <div className="mb-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
        <p className="text-xs text-slate-400">
          Choose how you want to be alerted about new messages.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 divide-y divide-slate-200">
        <Toggle
          checked={prefs.toast}
          onChange={(v) => update("toast", v)}
          label="In-app toasts"
          sub="Show a small banner when a new message arrives while you're using the app."
        />
        <Toggle
          checked={prefs.os}
          onChange={(v) => update("os", v)}
          label="Desktop notifications"
          sub="Pop up a system notification when the tab is in the background."
        />
      </div>
    </div>
  );
};

const VerificationBadge = ({ verification }) => {
  if (verification === "VERIFIED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
        <HiOutlineShieldCheck className="text-sm" /> Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-amber-100 text-amber-700 border border-amber-200">
      Pending verification
    </span>
  );
};

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex justify-start">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[90vh] mt-4 ml-4">
        <div className="p-10 pb-6 border-b border-slate-100">
          <h1 className="text-3xl font-black text-slate-800 mb-4">
            Account Settings
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">
                {user?.username || "User"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  {user?.role || "USER"}
                </span>
                {user?.verification && (
                  <VerificationBadge verification={user.verification} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 pt-8">
          <SectionCard
            title="Email address"
            subtitle="Used for sign-in and account communications."
            icon={HiOutlineMail}
            currentValue={user?.email}
          >
            {({ close }) => (
              <EmailForm close={close} currentEmail={user?.email} />
            )}
          </SectionCard>

          <SectionCard
            title="Phone number"
            subtitle="Optional. Used for contact only — never displayed publicly."
            icon={HiOutlinePhone}
            currentValue={user?.phone}
          >
            {({ close }) => (
              <PhoneForm close={close} currentPhone={user?.phone} />
            )}
          </SectionCard>

          <SectionCard
            title="Password"
            subtitle="Keep your account secure by updating your password regularly."
            icon={HiOutlineLockClosed}
            currentValue="••••••••"
          >
            {({ close }) => <PasswordForm close={close} />}
          </SectionCard>

          <NotificationSettings />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
