import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
} from "react-icons/hi";
import SidebarNav from "./layout/SidebarNav";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col p-4 pt-16 h-screen">
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">
          Navigation
        </p>

        <SidebarNav
          icon={HiOutlineHome}
          label="Admin Dashboard"
          active={location.pathname === "/agent-dashboard"}
          onClick={() => navigate("/agent-dashboard")}
        />

        <SidebarNav
          icon={HiOutlineUserAdd}
          label="Verify New Users"
          active={location.pathname === "/verify-users"}
          onClick={() => navigate("/verify-users")}
        />

        <SidebarNav
          icon={HiOutlineUserGroup}
          label="View Existing Users"
          active={location.pathname === "/existing-users"}
          onClick={() => navigate("/existing-users")}
        />
      </nav>
    </aside>
  );
};

export default AdminSidebar;
