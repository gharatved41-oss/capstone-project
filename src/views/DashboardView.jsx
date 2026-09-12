import React from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Activity,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowUpRight
} from "lucide-react";
import { AttackPathGraph } from "../components/AttackPathGraph";
import { BeforeAfterComparison } from "../components/BeforeAfterComparison";
import { DigitalTwinMonitor } from "../components/DigitalTwinMonitor";

export const DashboardView = ({ setActiveTab, onOpenAddAsset }) => {
  const {
    assets,
    vulnerabilities,
    digitalTwins,
    securityScore,
    isOrchestrating,
    startOrchestration,
    orchestratorCompleted
  } = useSecurity();

  const confirmedVulns = vulnerabilities.filter((v) => v.twinValidation.status === "Confirmed");
  const fixedVulns = vulnerabilities.filter((v) => v.twinValidation.status === "Fixed in Twin" || v.reTestResult?.completed);
  const falsePositives = vulnerabilities.filter((v) => v.twinValidation.falsePositive);
  const criticalVulns = vulnerabilities.filter((v) => v.severity === "CRITICAL");

  return (
    <div>
      {/* Hero Banner with Headline One-Click Call to Action */}
      <div className="hero-banner">
        <div className="hero-content">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }} className="badge badge-cyan">
              <Layers size={14} /> ONE-CLICK CLOSED-LOOP VALIDATION
            </div>
            <h1 className="hero-title">
              AutoSecTwin Autonomous Security Validation
            </h1>
            <p className="hero-subtitle">
              Orchestrates asset discovery, scanner ingestion, AI-based exploitability risk scoring, air-gapped Digital Twin replication, controlled safe testing, patch simulation, and automated re-verification.
            </p>
          </div>

          <div className="hero-actions">
            <button
              className={`btn btn-primary ${!isOrchestrating ? "btn-pulse" : ""}`}
              style={{ padding: "14px 28px", fontSize: "1rem", fontWeight: 700 }}
              onClick={startOrchestration}
              disabled={isOrchestrating}
            >
              <Play size={20} fill="currentColor" />
              {isOrchestrating ? "Running Automated Pipeline..." : "▶ START AUTOMATED SECURITY ANALYSIS"}
            </button>
            <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Executes all 10 automated lifecycle stages in isolated sandboxes
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        {/* Monitored Assets */}
        <div className="kpi-card" onClick={() => setActiveTab("assets")} style={{ cursor: "pointer" }}>
          <div className="kpi-header">
            <span className="kpi-label">Monitored Assets</span>
            <div className="kpi-icon-wrapper">
              <Server size={18} color="var(--cyan)" />
            </div>
          </div>
          <div className="kpi-value">{assets.length}</div>
          <div className="kpi-subtext">
            <span style={{ color: "var(--emerald)" }}>● 100% Active</span> • Replicas Online
          </div>
        </div>

        {/* Total Detected Vulns */}
        <div className="kpi-card" onClick={() => setActiveTab("vulnerabilities")} style={{ cursor: "pointer" }}>
          <div className="kpi-header">
            <span className="kpi-label">Detected Findings</span>
            <div className="kpi-icon-wrapper">
              <AlertTriangle size={18} color="var(--rose)" />
            </div>
          </div>
          <div className="kpi-value">{vulnerabilities.length}</div>
          <div className="kpi-subtext">
            <span style={{ color: "var(--rose)" }}>{criticalVulns.length} Critical</span> (Nessus/OpenVAS)
          </div>
        </div>

        {/* Confirmed in Twin */}
        <div className="kpi-card" onClick={() => setActiveTab("vulnerabilities")} style={{ cursor: "pointer" }}>
          <div className="kpi-header">
            <span className="kpi-label">Confirmed in Twin</span>
            <div className="kpi-icon-wrapper">
              <ShieldAlert size={18} color="#ef4444" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "#ef4444" }}>
            {confirmedVulns.length}
          </div>
          <div className="kpi-subtext">
            Real exploit verified safely in sandbox
          </div>
        </div>

        {/* False Positives Filtered */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">False Positives Filtered</span>
            <div className="kpi-icon-wrapper">
              <ShieldCheck size={18} color="var(--cyan)" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "var(--cyan)" }}>
            {falsePositives.length}
          </div>
          <div className="kpi-subtext">
            Mitigated by fat JAR / immune OpenSSL
          </div>
        </div>

        {/* Verified Remediations */}
        <div className="kpi-card" onClick={() => setActiveTab("retest")} style={{ cursor: "pointer" }}>
          <div className="kpi-header">
            <span className="kpi-label">Remediated in Twin</span>
            <div className="kpi-icon-wrapper">
              <CheckCircle2 size={18} color="var(--emerald)" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "var(--emerald)" }}>
            {fixedVulns.length}
          </div>
          <div className="kpi-subtext">
            <span style={{ color: "var(--emerald)" }}>✓ Zero Service Regressions</span>
          </div>
        </div>

        {/* Overall Posture Score */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Security Posture</span>
            <div className="kpi-icon-wrapper">
              <TrendingUp size={18} color="var(--emerald)" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "var(--emerald)" }}>
            {securityScore}<span style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>/100</span>
          </div>
          <div className="kpi-subtext">
            Improved from 46/100 via AutoSecTwin
          </div>
        </div>
      </div>

      {/* Interactive Visual Attack Path */}
      <AttackPathGraph />

      {/* Before vs After Verification Matrix */}
      <BeforeAfterComparison />

      {/* Active Digital Twin Sandbox Telemetry */}
      <DigitalTwinMonitor twinId="twin-1" />
    </div>
  );
};
