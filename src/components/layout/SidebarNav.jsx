import React from "react";

/**
 * Reusable navigation item for sidebars
 * Handles active states, badges, sub-items, and consistent styling
 */
const SidebarNav = ({
  icon: Icon,
  label,
  active = false,
  badge = 0,
  onClick,
  isSubItem = false,
  className = "",
}) => (
  <div
    onClick={onClick}
    className={`
      flex items-center justify-between rounded-xl cursor-pointer 
      transition-all duration-200
      ${isSubItem ? "ml-9 px-3 py-1.5" : "px-4 py-3"}
      ${
        active
          ? "bg-white shadow-md text-[#1e4eb8] font-semibold"
          : "text-slate-500 hover:bg-slate-100 font-medium"
      }
      ${className}
    `}
  >
    <div className="flex items-center gap-3 flex-1">
      <Icon className={isSubItem ? "text-lg" : "text-xl"} />
      <span className={isSubItem ? "text-[14px]" : "text-[15px]"}>{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-blue-100 text-[#1e4eb8] text-[10px] font-black px-2 py-0.5 rounded-full ml-2 shrink-0">
        {badge}
      </span>
    )}
  </div>
);

export default SidebarNav;
