import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import { apiFetch } from "../utils/api";
import { getNotifPrefs } from "../utils/notifPrefs";

export const useTicketChat = (inlineTicketId = null) => {
  const { ticketId: routeTicketId } = useParams();

  const ticketId = inlineTicketId || routeTicketId;

  const [ticket, setTicket] = useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  const socketRef = useRef();

  const scrollRef = useRef();

  const ticketTitleRef = useRef("Case");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleBackNavigation = () => {
    const isAgent =
      currentUser.role === "AGENT" || currentUser.role === "ADMIN";
    const targetRoute = isAgent ? "/agent-dashboard" : "/dashboard";

    navigate(targetRoute, { state: { activeTab: "MY_TICKETS" } });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);

      setMessages([]);

      ticketTitleRef.current = "Case";
      return;
    }

    const loadTicketData = async () => {
      try {
        const payload = await apiFetch(`/ticket/${ticketId}`);

        const activeTicket = payload?.data || payload;

        if (activeTicket) {
          setTicket(activeTicket);

          ticketTitleRef.current = activeTicket.title || "Case";

          const history = activeTicket.messages || [];

          setMessages(history);
        }
      } catch (err) {
        console.error("Failed loading ticket metadata info:", err);
      }
    };

    loadTicketData();

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default" &&
      getNotifPrefs().os
    ) {
      Notification.requestPermission().catch(() => {});
    }

    socketRef.current = io(BASE_URL, {
      auth: { token: currentUser.accessToken },
    });

    socketRef.current.emit("joinTicket", { ticketId, userId: currentUser.id });

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);

      const isOwnMessage = String(msg.senderId) === String(currentUser.id);
      if (isOwnMessage) return;

      const senderLabel =
        msg.sender?.username ||
        (currentUser.role === "USER" ? "Support" : "Customer");
      const preview =
        msg.content?.length > 60
          ? `${msg.content.slice(0, 60)}…`
          : msg.content || "";

      const prefs = getNotifPrefs();

      if (document.hidden) {
        setUnreadCount((prev) => {
          const nextCount = prev + 1;
          document.title = `🔔 (${nextCount}) New Message`;
          return nextCount;
        });

        if (
          prefs.os &&
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          new Notification(`New message — ${ticketTitleRef.current}`, {
            body: msg.content,
            icon: "/logo.png",
          });
        }
      } else if (prefs.toast) {
        toast(`${senderLabel}: ${preview}`, {
          icon: "💬",
          duration: 4000,
        });
      }
    });

    const handleVisibility = () => {
      if (!document.hidden) {
        document.title = "Smart Support System";

        setUnreadCount(0);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage");

        socketRef.current.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [ticketId, currentUser.accessToken, currentUser.id]);

  const updateTicketLocal = (partial) => {
    setTicket((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const handleSend = (e, directTextValue = null) => {
    if (e?.preventDefault) e.preventDefault();

    const textToSend = directTextValue !== null ? directTextValue : newMessage;
    if (!textToSend?.trim()) return;

    if (!socketRef.current) {
      console.error("Socket instance connection unavailable.");
      return;
    }

    socketRef.current.emit("sendMessage", {
      ticketId,

      senderId: currentUser.id,

      content: textToSend.trim(),
    });

    setNewMessage("");
  };

  return {
    ticketId,

    ticket,

    messages,

    newMessage,

    setNewMessage,

    currentUser,

    scrollRef,

    handleSend,

    handleBackNavigation,

    unreadCount,

    updateTicketLocal,
  };
};
