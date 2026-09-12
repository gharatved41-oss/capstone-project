import React from "react";
import { useSecurity } from "../context/SecurityContext";
import { ORCHESTRATOR_STAGES } from "../data/initialData";
import {
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  Clock,
  Terminal,
  Activity,
  Server,
  Search,
  Brain,
  BarChart3,
  Layers,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  PlayCircle,
  FileText,
  ChevronRight
} from "lucide-react";

export const PipelineView = ({ setActiveTab, onOpenReport }) => {
  const {
    isOrchestrating,
    orchestratorStage,
    stageStatuses,
    orchestratorLogs,
    orchestratorCompleted,
    startOrchestration,
    stopOrchestration,
    resetOrchestration,
    vulnerabilities,
    assets
  } = useSecurity();

  const iconMap = {
    Server: Server,
    Search: Search,
    Brain: Brain,
    BarChart3: BarChart3,
    Layers: Layers,
    ShieldAlert: ShieldAlert,
    AlertTriangle: AlertTriangle,
    Sparkles: Sparkles,
    PlayCircle: PlayCircle,
    CheckCircle2: CheckCircle2
  };

  const completedStagesCount = Object.values(stageStatuses).filter((s) => s === "completed").length;
  const progressPercent = (completedStagesCount / 10) * 100;

  return (
    <div>
      {/* Header & Controls */}
      <div
        className="card"
        style={{
          padding: 24,
          marginBottom: 24,
          background: "linear-gradient(135deg, rgba(14, 20, 36, 0.95), rgba(20, 29, 51, 0.9))"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: 6 }}>
              AUTOMATION ORCHESTRATOR ENGINE
            </div>
            <h2 style={{ fontSize: "1.4rem", margin: 0 }}>
              One-Click Automated Security Assessment Pipeline
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
              Executes end-to-end closed-loop validation across 10 autonomous stages in isolated Digital Twin environments.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {!isOrchestrating ? (
              <button
                className="btn btn-primary btn-pulse"
                style={{ padding: "10px 22px", fontSize: "0.9rem" }}
                onClick={startOrchestration}
              >
                <Play size={16} fill="currentColor" />
                {orchestratorCompleted ? "Re-Run Full Analysis" : "▶ Start Full Analysis"}
              </button>
            ) : (
              <button
                className="btn btn-danger"
                style={{ padding: "10px 20px", fontSize: "0.9rem" }}
                onClick={stopOrchestration}
              >
                <Square size={16} fill="currentColor" /> Halt Pipeline
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={resetOrchestration}
              style={{ padding: "10px 14px" }}
              title="Reset Orchestrator"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              {isOrchestrating
                ? `Pipeline Running: Stage ${orchestratorStage} of 10 in progress...`
                : orchestratorCompleted
                ? "✓ 10/10 Stages Successfully Executed"
                : "Standby — Press Start to execute 1-click orchestration"}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--cyan)", fontWeight: 700 }}>
              {completedStagesCount * 10}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: 10 }}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Completion Summary Card (Displayed when complete) */}
      {orchestratorCompleted && (
        <div
          style={{
            padding: 24,
            marginBottom: 24,
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12))",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <CheckCircle2 size={24} color="#10b981" />
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "#ffffff" }}>
                  🎉 ANALYSIS & VERIFICATION COMPLETED
                </h3>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                All 10 stages finished. Controlled tests ran safely in Digital Twins; verified remediations reduced composite threat surface.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab("retest")}
              >
                View Full Results <ChevronRight size={14} />
              </button>
              <button
                className="btn btn-primary"
                onClick={onOpenReport}
              >
                <FileText size={16} /> Download Report
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              marginTop: 18
            }}
          >
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>TOTAL FINDINGS</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{vulnerabilities.length}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "#f87171" }}>HIGH/CRITICAL RISK</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>3</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "#38bdf8" }}>CONFIRMED IN TWIN</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--cyan)" }}>2</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "#34d399" }}>FALSE POSITIVES FILTERED</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#10b981" }}>2</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "#a7f3d0" }}>FIXES RE-TESTED & VERIFIED</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#34d399" }}>2</div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Left = 10 Stages Timeline, Right = Live Terminal Stream */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
        {/* Stages Timeline List */}
        <div className="stage-timeline">
          {ORCHESTRATOR_STAGES.map((st) => {
            const status = stageStatuses[st.id] || "pending";
            const isCurrent = orchestratorStage === st.id;
            const Icon = iconMap[st.icon] || Server;

            return (
              <div
                key={st.id}
                className={`stage-item ${status === "completed" ? "completed" : isCurrent ? "running" : ""}`}
              >
                <div className="stage-number">
                  {status === "completed" ? (
                    <CheckCircle2 size={18} />
                  ) : isCurrent ? (
                    <Activity size={16} />
                  ) : (
                    st.id
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "0.92rem", margin: 0, color: "var(--text-highlight)" }}>
                      Stage {st.id}: {st.name}
                    </h4>
                    <span
                      className={`badge ${
                        status === "completed"
                          ? "badge-low"
                          : isCurrent
                          ? "badge-cyan"
                          : "badge-medium"
                      }`}
                      style={{ fontSize: "0.68rem" }}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "3px 0 0 0" }}>
                    {st.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Terminal & Logs Stream */}
        <div>
          <div className="terminal-window" style={{ height: "100%", maxHeight: 680, display: "flex", flexDirection: "column" }}>
            <div className="terminal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="terminal-dots">
                  <span className="terminal-dot" style={{ background: "#ef4444" }} />
                  <span className="terminal-dot" style={{ background: "#f59e0b" }} />
                  <span className="terminal-dot" style={{ background: "#10b981" }} />
                </div>
                <span className="terminal-title">
                  <Terminal size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                  autosectwin-orchestrator-stdout.log
                </span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>
                {isOrchestrating ? "● STREAMING" : "IDLE"}
              </span>
            </div>

            <div className="terminal-body" style={{ flex: 1, maxHeight: 620, padding: 16 }}>
              {orchestratorLogs.map((log, idx) => (
                <div key={idx} className="terminal-line" style={{ marginBottom: 6 }}>
                  <span className="terminal-time">[{log.time}]</span>
                  <span
                    style={{
                      color: log.text.includes("CONFIRMED")
                        ? "#f87171"
                        : log.text.includes("VERIFIED") || log.text.includes("Completed")
                        ? "#34d399"
                        : log.text.includes("Stage")
                        ? "#38bdf8"
                        : "#cbd5e1"
                    }}
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <span className="terminal-cursor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
