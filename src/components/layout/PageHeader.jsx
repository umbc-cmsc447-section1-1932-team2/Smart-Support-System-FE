import React from "react";

/**
 * Lightweight page header for dashboard pages
 * Shows welcome message and current context
 * Logout moved to Navbar - no duplication here
 */
const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
