import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  Shield,
  Layers,
  Server,
  AlertTriangle,
  Play,
  RotateCcw,
  Bell,
  FileText,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Activity
} from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab, onOpenReport, onToggleNotifs, onOpenAddAsset, onOpenDiagnostics }) => {
  const {
    isOrchestrating,
    startOrchestration,
    notifications,
    role,
    setRole,
    workspace,
    setWorkspace,
    securityScore
  } = useSecurity();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const workspaces = [
    "Production Core Infrastructure",
    "Payment Cloud Microservices",
    "R&D Isolated Staging Lab"
  ];

  return (
    <header className="navbar">
      {/* Brand & Logo */}
      <div className="nav-brand" onClick={() => setActiveTab("dashboard")}>
        <div className="nav-logo-icon">
          <Shield size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="nav-brand-title">AutoSecTwin</span>
            <span className="nav-brand-badge">DIGITAL TWIN AI</span>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0, letterSpacing: "0.02em" }}>
            Automated Security Validation Platform
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <Layers size={16} /> Dashboard
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "pipeline" ? "active" : ""}`}
          onClick={() => setActiveTab("pipeline")}
        >
          <Play size={16} /> Orchestrator Pipeline
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "assets" ? "active" : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          <Server size={16} /> Asset Inventory
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "vulnerabilities" ? "active" : ""}`}
          onClick={() => setActiveTab("vulnerabilities")}
        >
          <AlertTriangle size={16} /> Vulnerabilities & AI
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "twin" ? "active" : ""}`}
          onClick={() => setActiveTab("twin")}
        >
          <Layers size={16} /> Digital Twin Engine
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "retest" ? "active" : ""}`}
          onClick={() => setActiveTab("retest")}
        >
          <CheckCircle2 size={16} /> Fix Simulation & Re-Test
        </button>
      </nav>

      {/* Actions & Utilities */}
      <div className="nav-actions">
        {/* Workspace Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
          >
            <span style={{ color: "var(--cyan)", fontWeight: 700 }}>WS:</span> {workspace}
            <ChevronDown size={14} />
          </button>
          {workspaceOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                minWidth: 240,
                zIndex: 200,
                overflow: "hidden"
              }}
            >
              {workspaces.map((ws) => (
                <div
                  key={ws}
                  onClick={() => {
                    setWorkspace(ws);
                    setWorkspaceOpen(false);
                  }}
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    background: ws === workspace ? "rgba(6, 182, 212, 0.1)" : "transparent",
                    color: ws === workspace ? "var(--cyan)" : "var(--text-primary)",
                    borderBottom: "1px solid var(--border-subtle)"
                  }}
                >
                  {ws}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <button
          className="btn btn-secondary"
          style={{ padding: "6px 10px", fontSize: "0.78rem" }}
          onClick={() => setRole(role === "Admin" ? "Analyst" : "Admin")}
          title="Click to toggle Role"
        >
          <UserCheck size={14} color={role === "Admin" ? "#10b981" : "#6366f1"} />
          <span>{role}</span>
        </button>

        {/* Notifications Icon */}
        <button
          className="btn btn-secondary"
          style={{ position: "relative", padding: "8px" }}
          onClick={onToggleNotifs}
          title="Automated Email & System Alerts"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                background: "var(--rose)",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                width: 17,
                height: 17,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)"
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Diagnostics Button */}
        <button
          className="btn btn-secondary"
          style={{ padding: "8px 12px", fontSize: "0.8rem", borderColor: "rgba(6, 182, 212, 0.4)" }}
          onClick={onOpenDiagnostics}
          title="Run Automated Self-Test Diagnostics"
        >
          <Activity size={15} color="var(--cyan)" /> Self-Test
        </button>

        {/* Report Button */}
        <button
          className="btn btn-secondary"
          style={{ padding: "8px 12px", fontSize: "0.8rem" }}
          onClick={onOpenReport}
        >
          <FileText size={16} /> Report
        </button>

        {/* Main One-Click Action */}
        <button
          className={`btn btn-primary ${!isOrchestrating ? "btn-pulse" : ""}`}
          onClick={startOrchestration}
          disabled={isOrchestrating}
          style={{ padding: "8px 16px" }}
        >
          <Play size={16} fill="currentColor" />
          {isOrchestrating ? "Analyzing Pipeline..." : "▶ Start Full Analysis"}
        </button>
      </div>
    </header>
  );
};
