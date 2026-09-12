import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { BeforeAfterComparison } from "../components/BeforeAfterComparison";
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Shield,
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

export const ReTestView = () => {
  const {
    vulnerabilities,
    applyFixToTwin,
    runAutomatedReTest,
    selectedVulnId,
    setSelectedVulnId
  } = useSecurity();

  const [simulatingId, setSimulatingId] = useState(null);
  const [reTestingId, setReTestingId] = useState(null);

  const activeVuln = vulnerabilities.find((v) => v.id === selectedVulnId) || vulnerabilities[0];

  const handleApplyFix = async (id) => {
    setSimulatingId(id);
    await applyFixToTwin(id);
    setSimulatingId(null);
  };

  const handleReTest = async (id) => {
    setReTestingId(id);
    await runAutomatedReTest(id);
    setReTestingId(null);
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.35rem", margin: 0 }}>
          AI Remediation Assistant & Automated Re-Testing
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
          Synthesize AI hardening patches, simulate them safely in the isolated Digital Twin, verify service stability, and automatically re-test to confirm vulnerability eradication.
        </p>
      </div>

      {/* Before vs After Summary Matrix */}
      <BeforeAfterComparison />

      {/* Remediation & Re-Testing Workbench */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
        {/* Left: AI Remediation Recipe & Patch Diffs */}
        <div className="card" style={{ padding: 22 }}>
          <div className="card-header" style={{ marginBottom: 14 }}>
            <div>
              <div className="badge badge-cyan" style={{ marginBottom: 4 }}>
                <Sparkles size={12} /> AI-POWERED REMEDIATION PLAN
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "4px 0 0 0" }}>
                {activeVuln.cve}: {activeVuln.remediation.title}
              </h3>
            </div>

            <span
              className={`badge ${
                activeVuln.remediation.status === "Verified in Twin"
                  ? "badge-low"
                  : activeVuln.remediation.status.includes("Applied")
                  ? "badge-cyan"
                  : "badge-high"
              }`}
            >
              {activeVuln.remediation.status}
            </span>
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 16 }}>
            Expected Risk Reduction: <strong style={{ color: "var(--emerald)" }}>{activeVuln.remediation.estimatedRiskReduction}</strong> • Side Effects Risk: <strong style={{ color: "var(--cyan)" }}>{activeVuln.remediation.sideEffectsRisk}</strong>
          </p>

          {/* Actionable Step Checklist */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
              Automated Remediation Steps:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {activeVuln.remediation.steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.78rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(6,182,212,0.15)",
                      color: "var(--cyan)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Diff Viewer */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <FileCode size={14} color="var(--cyan)" />
              Proposed Configuration & Code Patch Diff:
            </h4>
            <div className="diff-view">
              {activeVuln.remediation.diff.split("\n").map((line, idx) => {
                if (line.startsWith("+")) {
                  return <span key={idx} className="diff-line-add">{line}</span>;
                } else if (line.startsWith("-")) {
                  return <span key={idx} className="diff-line-del">{line}</span>;
                }
                return <span key={idx} style={{ color: "#94a3b8", display: "block" }}>{line}</span>;
              })}
            </div>
          </div>

          {/* Remediation Action Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              className="btn btn-secondary"
              onClick={() => handleApplyFix(activeVuln.id)}
              disabled={simulatingId === activeVuln.id}
            >
              <Play size={14} />
              {simulatingId === activeVuln.id ? "Deploying Patch in Twin..." : "▶ Apply Fix in Digital Twin"}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => handleReTest(activeVuln.id)}
              disabled={reTestingId === activeVuln.id}
            >
              <CheckCircle2 size={14} />
              {reTestingId === activeVuln.id ? "Running Automated Re-Test..." : "✓ Run Automated Re-Test"}
            </button>
          </div>
        </div>

        {/* Right: Vulnerabilities Ready for Simulation & Re-Testing */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-header" style={{ marginBottom: 14 }}>
            <h3 className="card-title">
              <Layers size={18} color="var(--cyan)" />
              Findings in Verification Pipeline
            </h3>
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 14 }}>
            Select any finding below to load its AI remediation recipe, simulate the patch inside the Digital Twin, and execute automated re-validation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {vulnerabilities.map((v) => {
              const isSelected = v.id === activeVuln.id;
              const isFixed = v.twinValidation.status === "Fixed in Twin" || v.reTestResult?.completed;
              const isFalsePositive = v.twinValidation.falsePositive;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVulnId(v.id)}
                  style={{
                    padding: "14px",
                    background: isSelected ? "rgba(6, 182, 212, 0.08)" : "rgba(255,255,255,0.02)",
                    border: isSelected ? "1px solid var(--cyan)" : "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong style={{ fontSize: "0.9rem", color: "var(--text-highlight)" }}>{v.cve}</strong>
                      <span className={`badge ${v.severity === "CRITICAL" ? "badge-critical" : "badge-high"}`}>
                        {v.severity}
                      </span>
                    </div>

                    <span
                      className={`badge ${
                        isFixed
                          ? "badge-low"
                          : isFalsePositive
                          ? "badge-cyan"
                          : "badge-high"
                      }`}
                    >
                      {isFixed ? "✓ VERIFIED FIXED" : isFalsePositive ? "○ FALSE POSITIVE" : "NEEDS RE-TEST"}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginBottom: 8 }}>
                    {v.title}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    <span>Twin: {v.twinValidation.testedInTwinId}</span>
                    <span style={{ color: isFixed ? "var(--emerald)" : "var(--cyan)", fontWeight: 600 }}>
                      Risk: {v.reTestResult.beforeRisk} → {v.reTestResult.afterRisk || "?"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
