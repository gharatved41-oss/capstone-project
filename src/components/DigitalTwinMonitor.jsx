import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  Layers,
  Cpu,
  HardDrive,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Camera,
  RotateCcw,
  Terminal,
  WifiOff,
  Server,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

export const DigitalTwinMonitor = ({ twinId = "twin-1" }) => {
  const { digitalTwins, snapshotTwin, resetTwin } = useSecurity();
  const twin = digitalTwins.find((t) => t.id === twinId) || digitalTwins[0];

  const [filterQuery, setFilterQuery] = useState("");

  if (!twin) return null;

  const filteredLogs = twin.logs.filter((log) =>
    log.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      {/* Header */}
      <div className="card-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Layers size={20} color="var(--cyan)" />
            <h3 className="card-title" style={{ margin: 0 }}>
              {twin.name}
            </h3>
            <span
              className="badge"
              style={{
                background:
                  twin.state === "Ready"
                    ? "rgba(16, 185, 129, 0.15)"
                    : twin.state === "Testing"
                    ? "rgba(6, 182, 212, 0.2)"
                    : "rgba(245, 158, 11, 0.15)",
                color:
                  twin.state === "Ready"
                    ? "#34d399"
                    : twin.state === "Testing"
                    ? "#38bdf8"
                    : "#fbbf24",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              ● {twin.state.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            {twin.sandboxType} • IP: <code>{twin.ipAddress}</code> • Parity:{" "}
            <strong style={{ color: "var(--cyan)" }}>{twin.parityScore}% Match</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            onClick={() => snapshotTwin(twin.id)}
          >
            <Camera size={14} /> Snapshot State
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            onClick={() => resetTwin(twin.id)}
          >
            <RotateCcw size={14} /> Reset to Golden Image
          </button>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 20
        }}
      >
        {/* CPU Usage */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <Cpu size={14} color="var(--cyan)" /> CPU USAGE
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {twin.metrics.cpu}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${twin.metrics.cpu}%`,
                background: twin.metrics.cpu > 70 ? "var(--rose)" : "var(--cyan)"
              }}
            />
          </div>
        </div>

        {/* Memory Allocation */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <Activity size={14} color="var(--indigo)" /> RAM UTILIZATION
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {twin.metrics.memory}% ({twin.metrics.memoryUsedMB}MB)
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${twin.metrics.memory}%`, background: "var(--indigo)" }}
            />
          </div>
        </div>

        {/* Storage Isolation */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <HardDrive size={14} color="var(--emerald)" /> EPHEMERAL DISK
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {twin.metrics.diskUsedGB} / {twin.metrics.diskTotalGB} GB
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(twin.metrics.diskUsedGB / twin.metrics.diskTotalGB) * 100}%`,
                background: "var(--emerald)"
              }}
            />
          </div>
        </div>

        {/* Air-gap Isolation Status */}
        <div
          style={{
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <WifiOff size={16} color="var(--emerald)" />
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
              NETWORK BOUNDARY
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--emerald)" }}>
              Air-Gapped Sandbox
            </div>
          </div>
        </div>
      </div>

      {/* Active Replicated Services in Twin */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 10 }}>
          Replicated Services Running in Twin Sandbox ({twin.services.length}):
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {twin.services.map((svc) => (
            <div
              key={svc.name}
              style={{
                padding: "6px 12px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.78rem"
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: svc.status === "running" ? "var(--emerald)" : "var(--amber)"
                }}
              />
              <span style={{ fontWeight: 600, color: "var(--text-highlight)" }}>{svc.name}</span>
              {svc.port > 0 && <span style={{ color: "var(--text-muted)" }}>:{svc.port}</span>}
              <span style={{ color: "var(--cyan)", fontSize: "0.7rem" }}>({svc.health})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Sandbox Terminal Window */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="terminal-dots">
              <span className="terminal-dot" style={{ background: "#ef4444" }} />
              <span className="terminal-dot" style={{ background: "#f59e0b" }} />
              <span className="terminal-dot" style={{ background: "#10b981" }} />
            </div>
            <span className="terminal-title">
              <Terminal size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              autosectwin-sandbox-console://{twin.id} (pts/1)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="text"
              placeholder="Filter logs..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)"
              }}
            />
          </div>
        </div>

        <div className="terminal-body">
          {filteredLogs.length === 0 ? (
            <div style={{ color: "var(--text-muted)" }}>No log lines matching query.</div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div key={idx} className="terminal-line">
                <span className="terminal-time">&gt;</span>
                <span style={{ wordBreak: "break-all" }}>{log}</span>
              </div>
            ))
          )}
          <div style={{ marginTop: 6 }}>
            <span className="terminal-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
};
