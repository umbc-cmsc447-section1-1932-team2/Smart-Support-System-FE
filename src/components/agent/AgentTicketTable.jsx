import React from "react";
import { Calendar, UserPlus, ArrowRight, Inbox } from "lucide-react";
import { getStatusMeta } from "../../utils/ticketStatus";

const AgentTicketTable = ({
  displayTickets = [],
  isLoading,
  handleClaimTicket,
  onSelectTicket,
  activeTicketId,
}) => {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs text-gray-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-8 py-5 text-xs text-gray-400 uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-8 py-5 text-xs text-gray-400 uppercase tracking-wider text-center">
                Client
              </th>
              <th className="px-8 py-5 text-xs text-gray-400 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-8 py-16 text-center text-gray-400 font-semibold animate-pulse"
                >
                  Syncing with database...
                </td>
              </tr>
            ) : displayTickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Inbox size={48} className="mb-4 opacity-20" />
                    <p className="font-semibold text-lg text-gray-500">
                      No tickets found
                    </p>
                    <p className="text-sm">You're all caught up for now!</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayTickets.map((ticket) => {
                const isActive = activeTicketId === ticket.id;

                return (
                  <tr
                    key={ticket.id}
                    className={`transition-colors group ${
                      isActive
                        ? "bg-blue-50/60 hover:bg-blue-50/80"
                        : "hover:bg-blue-50/30"
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={` transition-colors text-sm ${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-800 group-hover:text-blue-600"
                          }`}
                        >
                          {ticket.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5 font-medium">
                          <Calendar size={12} />
                          {new Date(
                            ticket.createdAt,
                          ).toLocaleDateString()} at{" "}
                          {new Date(ticket.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      {(() => {
                        const meta = getStatusMeta(ticket.status);
                        return (
                          <span
                            className={`text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full border uppercase ${meta.badgeSoft}`}
                          >
                            {meta.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-8 py-5 text-center text-sm  text-gray-600">
                      {ticket.createdBy?.username ||
                        ticket.createdBy?.email ||
                        "Anonymous"}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {ticket.status === "OPEN" ? (
                        <button
                          onClick={() => handleClaimTicket(ticket.id)}
                          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4 py-2 rounded-xl transition-all text-xs shadow-sm active:scale-95"
                        >
                          <UserPlus size={16} /> Claim Ticket
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectTicket(ticket.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs shadow-sm active:scale-95 ${
                            isActive
                              ? "bg-blue-100 text-blue-700 font-black border border-blue-200"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isActive ? "Viewing Chat" : "Enter Chat"}{" "}
                          <ArrowRight
                            size={16}
                            className={
                              isActive ? "rotate-90 transition-transform" : ""
                            }
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentTicketTable;
