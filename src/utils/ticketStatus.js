// Single source of truth for ticket-status display and the dropdown.
// Keep colors in lockstep with the theme: blue is primary (in progress),
// amber = needs attention, purple = blocked on customer,
// emerald = resolved/success, slate = archived/closed.

export const STATUS_META = {
  OPEN: {
    label: "Open",
    icon: "🟠",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    badgeSoft: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: "🔵",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    badgeSoft: "bg-blue-50 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
  },
  WAITING_ON_CUSTOMER: {
    label: "Waiting on Customer",
    icon: "🟣",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    badgeSoft: "bg-purple-50 text-purple-800 border-purple-200",
    dot: "bg-purple-500",
  },
  RESOLVED: {
    label: "Resolved",
    icon: "🟢",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    badgeSoft: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  CLOSED: {
    label: "Closed",
    icon: "⚫",
    badge: "bg-slate-200 text-slate-700 border-slate-300",
    badgeSoft: "bg-slate-100 text-slate-700 border-slate-300",
    dot: "bg-slate-400",
  },
};

// Legacy backwards-compat: existing rows may still use CLOSED_NOT_RESOLVED.
STATUS_META.CLOSED_NOT_RESOLVED = STATUS_META.CLOSED;

// Order matters — drives both ChatHeader and TicketSidebar dropdowns.
export const STATUS_ORDER = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_ON_CUSTOMER",
  "RESOLVED",
  "CLOSED",
];

const FALLBACK = {
  label: "Unknown",
  icon: "•",
  badge: "bg-gray-100 text-gray-700 border-gray-200",
  badgeSoft: "bg-gray-50 text-gray-700 border-gray-200",
  dot: "bg-gray-400",
};

export const getStatusMeta = (status) =>
  STATUS_META[status?.toUpperCase?.()] || FALLBACK;
