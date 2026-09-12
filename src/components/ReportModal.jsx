import React from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity
} from "lucide-react";

export const ReportModal = ({ isOpen, onClose }) => {
  const { assets, vulnerabilities, digitalTwins, securityScore, workspace } = useSecurity();

  if (!isOpen) return null;

  const downloadJSON = () => {
    const reportData = {
      title: "AutoSecTwin Automated Security Assessment Report",
      generatedAt: new Date().toISOString(),
      workspace,
      securityScore,
      assets,
      vulnerabilities,
      digitalTwins: digitalTwins.map((t) => ({
        id: t.id,
        name: t.name,
        state: t.state,
        parityScore: t.parityScore,
        metrics: t.metrics
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AutoSecTwin_Security_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const confirmedVulns = vulnerabilities.filter((v) => v.twinValidation.status === "Confirmed");
  const fixedVulns = vulnerabilities.filter((v) => v.twinValidation.status === "Fixed in Twin" || v.reTestResult.completed);
  const falsePositives = vulnerabilities.filter((v) => v.twinValidation.falsePositive);

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 960 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={22} color="var(--cyan)" />
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                AutoSecTwin Automated Security Assessment Report
              </h3>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Executive & Technical Audit Summary • Digital Twin Validated
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={handlePrint}
              style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              className="btn btn-secondary"
              onClick={downloadJSON}
              style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            >
              <Download size={14} /> Export JSON
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="modal-body" style={{ background: "#0b0f1a" }}>
          {/* Executive Header Banner */}
          <div
            style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.08))",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-md)",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--cyan)", fontWeight: 700, textTransform: "uppercase" }}>
                Executive Assessment Summary
              </div>
              <h2 style={{ fontSize: "1.3rem", margin: "4px 0" }}>
                Workspace: {workspace}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                Generated: {new Date().toUTCString()} • Engine: AutoSecTwin AI Orchestrator v2.4
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Post-Remediation Security Score
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--emerald)", lineHeight: 1 }}>
                {securityScore} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ 100</span>
              </div>
            </div>
          </div>

          {/* Key Findings Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              marginBottom: 24
            }}
          >
            <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>TOTAL FINDINGS</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{vulnerabilities.length}</div>
            </div>
            <div style={{ padding: "12px", background: "rgba(239,68,68,0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ fontSize: "0.7rem", color: "#f87171" }}>CONFIRMED EXPLOITABLE</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ef4444" }}>{confirmedVulns.length}</div>
            </div>
            <div style={{ padding: "12px", background: "rgba(16,185,129,0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div style={{ fontSize: "0.7rem", color: "#34d399" }}>REMEDIATED & VERIFIED</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981" }}>{fixedVulns.length}</div>
            </div>
            <div style={{ padding: "12px", background: "rgba(6,182,212,0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--cyan)" }}>FALSE POSITIVES FILTERED</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--cyan)" }}>{falsePositives.length}</div>
            </div>
          </div>

          {/* Detailed Vulnerability Section */}
          <h4 style={{ fontSize: "0.95rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={18} color="var(--cyan)" />
            Validated Findings & Remediation Records
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {vulnerabilities.map((v) => (
              <div
                key={v.id}
                style={{
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-highlight)", marginRight: 8 }}>
                      {v.cve}: {v.title}
                    </span>
                    <span className={`badge ${v.severity === "CRITICAL" ? "badge-critical" : "badge-high"}`}>
                      {v.severity} • CVSS {v.cvss}
                    </span>
                  </div>

                  <span
                    className={`badge ${
                      v.twinValidation.status === "Fixed in Twin"
                        ? "badge-low"
                        : v.twinValidation.falsePositive
                        ? "badge-cyan"
                        : "badge-critical"
                    }`}
                  >
                    {v.twinValidation.status}
                  </span>
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 10 }}>
                  {v.description}
                </p>

                {/* AI & Twin Evidence */}
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.75rem",
                    borderLeft: "3px solid var(--cyan)",
                    marginBottom: 10
                  }}
                >
                  <strong style={{ color: "var(--cyan)" }}>Digital Twin Validation Proof: </strong>
                  <span>{v.twinValidation.executionProof}</span>
                </div>

                {/* Remediation Summary */}
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-secondary)" }}>Remediation: </strong>
                  {v.remediation.title} ({v.remediation.status})
                </div>
              </div>
            ))}
          </div>

          {/* Compliance & Attestation Signoff */}
          <div
            style={{
              marginTop: 24,
              padding: "16px",
              borderTop: "1px solid var(--border-subtle)",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>
              Attestation: All security validation and remediation testing occurred in isolated air-gapped Digital Twin environments. Production availability was unaffected.
            </span>
            <span style={{ fontFamily: "var(--font-mono)" }}>
              SHA-256: 8f4b9e...2a7c
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Report
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Full Audit Document
          </button>
        </div>
      </div>
    </div>
  );
};
