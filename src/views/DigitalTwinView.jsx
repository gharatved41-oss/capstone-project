import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { DigitalTwinMonitor } from "../components/DigitalTwinMonitor";
import {
  Layers,
  Cpu,
  Activity,
  HardDrive,
  Camera,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Server,
  WifiOff,
  ShieldCheck,
  Play
} from "lucide-react";

export const DigitalTwinView = () => {
  const { digitalTwins, assets, snapshotTwin, resetTwin } = useSecurity();
  const [selectedTwinId, setSelectedTwinId] = useState("twin-1");
  const [terminalInput, setTerminalInput] = useState("");

  const activeTwin = digitalTwins.find((t) => t.id === selectedTwinId) || digitalTwins[0];
  const associatedAsset = assets.find((a) => a.id === activeTwin.assetId);

  const handleRunCommand = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    // Simulate running sandbox command
    const cmd = terminalInput;
    setTerminalInput("");
    
    // Add to twin logs
    activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] # ${cmd}`);
    if (cmd === "ps aux") {
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] USER PID %CPU %MEM COMMAND`);
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] root 1 0.0 0.1 /sbin/init`);
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] www-data 14 0.2 1.4 /usr/sbin/apache2 -k start`);
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] appuser 38 1.4 12.1 java -jar orderapp.jar`);
    } else if (cmd.includes("netstat") || cmd.includes("ss")) {
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] tcp LISTEN 0 128 0.0.0.0:80`);
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] tcp LISTEN 0 128 0.0.0.0:8080`);
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] tcp LISTEN 0 128 0.0.0.0:22`);
    } else {
      activeTwin.logs.push(`[${new Date().toTimeString().split(" ")[0]}] command executed in air-gapped container.`);
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", margin: 0 }}>
            Digital Twin Sandbox Engine & Virtual Environments
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Air-gapped virtual replicas mirroring production systems with 98%+ parity. All security validation and fix testing occurs here.
          </p>
        </div>

        {/* Twin Selector Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {digitalTwins.map((t) => (
            <button
              key={t.id}
              className={`btn ${selectedTwinId === t.id ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
              onClick={() => setSelectedTwinId(t.id)}
            >
              <Layers size={14} /> {t.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Twin Telemetry Monitor */}
      <DigitalTwinMonitor twinId={selectedTwinId} />

      {/* Grid: Snapshots Manager + Replicated Sandbox Terminal */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Snapshot & Golden Image Checkpoints */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-header" style={{ marginBottom: 14 }}>
            <h3 className="card-title">
              <Camera size={18} color="var(--cyan)" />
              Digital Twin Snapshots & State Checkpoints
            </h3>
            <button
              className="btn btn-secondary"
              style={{ padding: "4px 10px", fontSize: "0.74rem" }}
              onClick={() => snapshotTwin(activeTwin.id)}
            >
              + Create Snapshot
            </button>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 14 }}>
            Checkpoints allow instant rollback after testing aggressive proof-of-concept vectors or evaluating unstable configuration patches.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeTwin.snapshots.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                No custom snapshots recorded yet. Click "Create Snapshot" to freeze state.
              </div>
            ) : (
              activeTwin.snapshots.map((snap) => (
                <div
                  key={snap.id}
                  style={{
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-highlight)", fontSize: "0.82rem" }}>
                      {snap.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {snap.timestamp} • Size: {snap.size}
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                    onClick={() => resetTwin(activeTwin.id)}
                  >
                    Restore
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sandbox Interactive Console Prompt */}
        <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column" }}>
          <div className="card-header" style={{ marginBottom: 14 }}>
            <h3 className="card-title">
              <Terminal size={18} color="var(--cyan)" />
              Isolated Sandbox Shell Dispatcher
            </h3>
            <span className="badge badge-low">
              AIR-GAP SANDBOX
            </span>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 14 }}>
            Execute non-destructive inspection commands directly inside the containerized micro-VM.
          </p>

          <div
            style={{
              flex: 1,
              background: "#080c16",
              borderRadius: "var(--radius-sm)",
              padding: 12,
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginBottom: 12,
              minHeight: 120,
              maxHeight: 180,
              overflowY: "auto"
            }}
          >
            <div>root@{activeTwin.id}:~# uname -a</div>
            <div style={{ color: "#ffffff" }}>
              Linux {activeTwin.id} 5.4.0-88-generic #99-Ubuntu SMP x86_64 GNU/Linux
            </div>
            <div style={{ marginTop: 6 }}>root@{activeTwin.id}:~# cat /etc/isolation_mode</div>
            <div style={{ color: "var(--emerald)" }}>STRICT_AIRGAP_EGRESS_BLOCKED</div>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleRunCommand} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Try 'ps aux', 'netstat -tuln', or 'cat /etc/issue'..."
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 12px",
                color: "#ffffff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem"
              }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: "8px 14px" }}>
              Run in Twin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
