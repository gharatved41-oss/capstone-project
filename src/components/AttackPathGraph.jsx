import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  Shield,
  ShieldAlert,
  Server,
  Database,
  Globe,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";

export const AttackPathGraph = () => {
  const { vulnerabilities } = useSecurity();
  const [selectedNode, setSelectedNode] = useState("weakness");
  const [showRemediated, setShowRemediated] = useState(false);

  // Check if Log4Shell is fixed in twin
  const log4j = vulnerabilities.find((v) => v.cve === "CVE-2021-44228");
  const isLog4jFixed = log4j?.twinValidation?.status === "Fixed in Twin" || log4j?.reTestResult?.completed;

  const isMitigated = showRemediated || isLog4jFixed;

  const nodes = [
    {
      id: "internet",
      title: "External Threat Actor",
      subtitle: "Public Internet (0.0.0.0/0)",
      type: "actor",
      x: 80,
      y: 150,
      icon: Globe,
      status: "Active Vector"
    },
    {
      id: "entrypoint",
      title: "Exposed Perimeter Port",
      subtitle: "TCP 8080 (OrderApp) & 80 (HTTP)",
      type: "entry",
      x: 320,
      y: 150,
      icon: Server,
      status: "Reachable"
    },
    {
      id: "weakness",
      title: isMitigated ? "Hardened Log4j 2.17.1" : "CVE-2021-44228 (Log4Shell)",
      subtitle: isMitigated ? "formatMsgNoLookups=true (Shielded)" : "JNDI Remote Code Execution",
      type: "vuln",
      x: 580,
      y: 150,
      icon: isMitigated ? Shield : ShieldAlert,
      status: isMitigated ? "Severed & Verified" : "CRITICAL RISK (9.8)"
    },
    {
      id: "lateral",
      title: "Internal Micro-VPC",
      subtitle: "Subnet 192.168.10.0/24",
      type: "pivot",
      x: 840,
      y: 150,
      icon: Database,
      status: isMitigated ? "Isolated" : "Lateral Pivot Path"
    },
    {
      id: "target",
      title: "Core Financial Database",
      subtitle: "192.168.10.82 (PostgreSQL)",
      type: "target",
      x: 1100,
      y: 150,
      icon: Lock,
      status: isMitigated ? "Protected" : "Crown Jewel at Risk"
    }
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[2];

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div className="card-header" style={{ marginBottom: 20 }}>
        <div>
          <h3 className="card-title">
            <ShieldAlert size={20} color={isMitigated ? "#10b981" : "#ef4444"} />
            Automated Attack Path & Blast Radius Visualization
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Visualizes defensive choke points, attack surfaces, and severed exploit chains verified in the Digital Twin.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Path State:</span>
          <button
            className={`btn ${isMitigated ? "btn-success" : "btn-danger"}`}
            style={{ padding: "6px 14px", fontSize: "0.78rem" }}
            onClick={() => setShowRemediated(!showRemediated)}
          >
            {isMitigated ? (
              <>
                <CheckCircle2 size={14} /> Severed / Remediated State
              </>
            ) : (
              <>
                <AlertTriangle size={14} /> Active Threat Path (Vulnerable)
              </>
            )}
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        style={{
          width: "100%",
          height: 300,
          background: "radial-gradient(ellipse at center, rgba(14, 20, 36, 0.9) 0%, #080c16 100%)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Red Linear Gradient for Attack Path */}
            <linearGradient id="attackPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
            </linearGradient>

            {/* Green Linear Gradient for Remediated Path */}
            <linearGradient id="remediatedPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connecting Lines */}
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null;
            const next = nodes[i + 1];
            const isSeveredAtThisPoint = isMitigated && (i === 1 || i === 2);

            return (
              <g key={`link-${node.id}`}>
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={
                    isSeveredAtThisPoint
                      ? "#334155"
                      : isMitigated
                      ? "url(#remediatedPathGrad)"
                      : "url(#attackPathGrad)"
                  }
                  strokeWidth={isSeveredAtThisPoint ? 2 : 4}
                  strokeDasharray={isSeveredAtThisPoint ? "6 6" : "none"}
                  filter={!isSeveredAtThisPoint ? (isMitigated ? "url(#glow-green)" : "url(#glow-red)") : undefined}
                />

                {/* Animated pulse dot travelling along path if vulnerable */}
                {!isMitigated && (
                  <circle r="4" fill="#ffffff">
                    <animateMotion
                      path={`M ${node.x} ${node.y} L ${next.x} ${next.y}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                      begin={`${i * 0.6}s`}
                    />
                  </circle>
                )}

                {/* Blocked shield icon at severed point */}
                {isSeveredAtThisPoint && (
                  <g transform={`translate(${(node.x + next.x) / 2 - 12}, ${node.y - 12})`}>
                    <circle cx="12" cy="12" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="12" y="16" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
                      ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Node Circles */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            const NodeIcon = node.icon;
            const isThreatNode = node.id === "weakness" && !isMitigated;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow ring */}
                <circle
                  r={isSelected ? 32 : 26}
                  fill={
                    isThreatNode
                      ? "rgba(239, 68, 68, 0.2)"
                      : isMitigated && node.id === "weakness"
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(6, 182, 212, 0.15)"
                  }
                  stroke={
                    isThreatNode
                      ? "#ef4444"
                      : isMitigated && node.id === "weakness"
                      ? "#10b981"
                      : isSelected
                      ? "#38bdf8"
                      : "rgba(255, 255, 255, 0.2)"
                  }
                  strokeWidth={isSelected ? 3 : 1.5}
                />

                {/* Center Core */}
                <circle
                  r="18"
                  fill="#0b0f19"
                  stroke={isThreatNode ? "#ef4444" : isMitigated ? "#10b981" : "#06b6d4"}
                  strokeWidth="1.5"
                />

                {/* Node Title & Subtitle */}
                <text
                  y="-40"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="var(--font-display)"
                  fontWeight="bold"
                >
                  {node.title}
                </text>
                <text
                  y="-26"
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {node.subtitle}
                </text>
                <text
                  y="46"
                  textAnchor="middle"
                  fill={isThreatNode ? "#f87171" : isMitigated ? "#34d399" : "#38bdf8"}
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {node.status}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Details Inspection Bar */}
      <div
        style={{
          marginTop: 16,
          padding: "14px 18px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "rgba(6, 182, 212, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Info size={18} color="var(--cyan)" />
          </div>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-highlight)" }}>
              Selected Component: {activeNodeData.title}
            </span>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
              {activeNodeData.subtitle} • Status:{" "}
              <strong style={{ color: isMitigated ? "#10b981" : "#f87171" }}>{activeNodeData.status}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge badge-cyan">Air-gapped Twin Validated</span>
          <span className={`badge ${isMitigated ? "badge-low" : "badge-critical"}`}>
            {isMitigated ? "Exploit Chain Severed" : "Active Exploit Vector"}
          </span>
        </div>
      </div>
    </div>
  );
};
