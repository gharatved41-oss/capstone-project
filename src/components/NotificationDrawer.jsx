import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  Bell,
  X,
  AlertOctagon,
  CheckCircle2,
  Info,
  Mail,
  Check
} from "lucide-react";

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useSecurity();
  const [filter, setFilter] = useState("all");

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === "critical") return n.type === "critical";
    if (filter === "success") return n.type === "success";
    return true;
  });

  return (
    <div className="notif-drawer">
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(0, 0, 0, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bell size={18} color="var(--cyan)" />
          <h3 style={{ fontSize: "0.95rem", margin: 0 }}>Automated Alerts & Email Dispatches</h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Dispatch Simulation Banner */}
      <div
        style={{
          padding: "8px 16px",
          background: "rgba(6, 182, 212, 0.08)",
          borderBottom: "1px solid var(--border-subtle)",
          fontSize: "0.75rem",
          color: "var(--cyan)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <Mail size={14} />
        <span>SMTP Bridge: Real-time alerts relayed to secops@autosectwin.local</span>
      </div>

      {/* Filter Tabs & Actions */}
      <div
        style={{
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(255, 255, 255, 0.01)"
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setFilter("all")}
            className={`badge ${filter === "all" ? "badge-cyan" : ""}`}
            style={{ cursor: "pointer", border: "none", background: filter === "all" ? "var(--cyan)" : "transparent", color: filter === "all" ? "#000" : "var(--text-secondary)" }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`badge ${filter === "critical" ? "badge-critical" : ""}`}
            style={{ cursor: "pointer", border: "none" }}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter("success")}
            className={`badge ${filter === "success" ? "badge-low" : ""}`}
            style={{ cursor: "pointer", border: "none" }}
          >
            Verified
          </button>
        </div>

        <button
          onClick={markAllNotificationsRead}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "0.72rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <Check size={12} /> Mark read
        </button>
      </div>

      {/* Notification List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>
            <p>No notifications in this filter.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: 10,
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                background: item.read ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.06)",
                border: item.read ? "1px solid var(--border-subtle)" : "1px solid rgba(6, 182, 212, 0.3)",
                boxShadow: item.read ? "none" : "0 0 10px rgba(6, 182, 212, 0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                {item.type === "critical" ? (
                  <AlertOctagon size={18} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                ) : item.type === "success" ? (
                  <CheckCircle2 size={18} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                ) : (
                  <Info size={18} color="#06b6d4" style={{ marginTop: 2, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {item.timestamp}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
