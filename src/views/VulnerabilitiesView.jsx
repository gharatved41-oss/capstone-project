import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { MOCK_SCAN_REPORTS } from "../data/mockScanReports";
import {
  AlertTriangle,
  Upload,
  Brain,
  ShieldCheck,
  ShieldAlert,
  Play,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity
} from "lucide-react";

export const VulnerabilitiesView = ({ setActiveTab }) => {
  const {
    vulnerabilities,
    selectedVulnId,
    setSelectedVulnId,
    runValidationForVuln,
    importScanReport,
    assets
  } = useSecurity();

  const [expandedXAI, setExpandedXAI] = useState("vuln-1");
  const [validatingId, setValidatingId] = useState(null);
  const [selectedScannerFeed, setSelectedScannerFeed] = useState(null);

  const activeVuln = vulnerabilities.find((v) => v.id === selectedVulnId) || vulnerabilities[0];
  const activeAsset = assets.find((a) => a.id === activeVuln.assetId);

  const handleValidate = async (id) => {
    setValidatingId(id);
    await runValidationForVuln(id);
    setValidatingId(null);
  };

  return (
    <div>
      {/* Header & Scanner Import Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 16
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.35rem", margin: 0 }}>
            Vulnerability Analysis & Explainable AI (XAI)
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Ingest scanner reports, evaluate multi-factor AI exploitability, and trigger safe isolated Digital Twin validation.
          </p>
        </div>

        {/* Scanner Ingestion Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Ingest Feeds:</span>
          {MOCK_SCAN_REPORTS.map((report) => (
            <button
              key={report.id}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              onClick={() => importScanReport(report)}
            >
              <Upload size={13} /> {report.scannerName.split(" ")[0]} ({report.totalFindings})
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Left = Vulnerabilities List, Right = AI Deep Dive & XAI Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.1fr", gap: 24 }}>
        {/* Vulnerability Cards List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {vulnerabilities.map((vuln) => {
            const isSelected = vuln.id === activeVuln.id;
            const isValidating = validatingId === vuln.id;
            const isConfirmed = vuln.twinValidation.status === "Confirmed";
            const isFixed = vuln.twinValidation.status === "Fixed in Twin" || vuln.reTestResult?.completed;
            const isFalsePos = vuln.twinValidation.falsePositive;

            return (
              <div
                key={vuln.id}
                className="card"
                onClick={() => setSelectedVulnId(vuln.id)}
                style={{
                  padding: 18,
                  cursor: "pointer",
                  borderColor: isSelected ? "var(--cyan)" : undefined,
                  boxShadow: isSelected ? "0 0 16px rgba(6, 182, 212, 0.2)" : undefined
                }}
              >
                {/* Card Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-highlight)" }}>
                        {vuln.cve}
                      </span>
                      <span
                        className={`badge ${
                          vuln.severity === "CRITICAL"
                            ? "badge-critical"
                            : vuln.severity === "HIGH"
                            ? "badge-high"
                            : "badge-medium"
                        }`}
                      >
                        {vuln.severity} • CVSS {vuln.cvss}
                      </span>
                      <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
                        {vuln.category}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      {vuln.title}
                    </div>
                  </div>

                  {/* Twin Validation Status Badge */}
                  <span
                    className={`badge ${
                      isFixed
                        ? "badge-low"
                        : isConfirmed
                        ? "badge-critical"
                        : isFalsePos
                        ? "badge-cyan"
                        : "badge-high"
                    }`}
                    style={{ fontSize: "0.74rem" }}
                  >
                    {isFixed ? "✓ FIXED IN TWIN" : isConfirmed ? "● CONFIRMED IN TWIN" : isFalsePos ? "○ FALSE POSITIVE" : "PENDING VALIDATION"}
                  </span>
                </div>

                {/* Affected Target */}
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 12 }}>
                  Component: <code>{vuln.affectedComponent}</code> • Scanner: {vuln.scannerSource}
                </div>

                {/* AI Exploitability Gauge & Composite Risk Bar */}
                <div
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: 12,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 4 }}>
                      <span style={{ color: "var(--text-muted)" }}>EXPLOITABILITY PROBABILITY</span>
                      <strong style={{ color: vuln.aiAnalysis.exploitabilityProbability > 50 ? "#f87171" : "#34d399" }}>
                        {vuln.aiAnalysis.exploitabilityProbability}%
                      </strong>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${vuln.aiAnalysis.exploitabilityProbability}%`,
                          background: vuln.aiAnalysis.exploitabilityProbability > 50 ? "var(--rose)" : "var(--emerald)"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 4 }}>
                      <span style={{ color: "var(--text-muted)" }}>COMPOSITE AI RISK SCORE</span>
                      <strong style={{ color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>
                        {vuln.aiAnalysis.compositeRiskScore} / 10
                      </strong>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${(vuln.aiAnalysis.compositeRiskScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 10px", fontSize: "0.72rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedXAI(expandedXAI === vuln.id ? null : vuln.id);
                      setSelectedVulnId(vuln.id);
                    }}
                  >
                    <Brain size={12} color="var(--cyan)" />
                    {expandedXAI === vuln.id ? "Hide Explainable AI" : "Explain AI Reasoning"}
                  </button>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className={`btn ${isConfirmed ? "btn-secondary" : "btn-primary"}`}
                      style={{ padding: "5px 12px", fontSize: "0.75rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValidate(vuln.id);
                      }}
                      disabled={isValidating}
                    >
                      <Play size={12} fill="currentColor" />
                      {isValidating ? "Validating in Twin..." : "Safe Test in Digital Twin"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: Selected Vulnerability Explainable AI (XAI) Deep Dive */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="card-header" style={{ marginBottom: 16 }}>
              <div>
                <div className="badge badge-cyan" style={{ marginBottom: 4 }}>
                  EXPLAINABLE AI (XAI) REASONING ENGINE
                </div>
                <h3 style={{ fontSize: "1.15rem", margin: "4px 0 0 0" }}>
                  {activeVuln.cve}
                </h3>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>AI CONFIDENCE</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--cyan)" }}>
                  {activeVuln.aiAnalysis.confidence}%
                </div>
              </div>
            </div>

            {/* AI Natural Language Explanation */}
            <div
              style={{
                padding: "14px 16px",
                background: "rgba(6, 182, 212, 0.06)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "var(--radius-md)",
                marginBottom: 18,
                fontSize: "0.82rem",
                lineHeight: 1.5,
                color: "#e2e8f0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--cyan)", marginBottom: 4 }}>
                <Sparkles size={14} /> AI Decision Justification:
              </div>
              {activeVuln.aiAnalysis.reasoning}
            </div>

            {/* Condition Factor Checklist */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 10 }}>
                Exploitation Prerequisites & Environmental Factors:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeVuln.aiAnalysis.factors.map((factor, idx) => {
                  const isPositive = factor.status === "confirmed";
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10
                      }}
                    >
                      {isPositive ? (
                        <CheckCircle2 size={16} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                      ) : (
                        <ShieldCheck size={16} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                          {factor.label}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {factor.detail}
                        </div>
                      </div>
                      <span
                        className={`badge ${isPositive ? "badge-critical" : "badge-low"}`}
                        style={{ fontSize: "0.68rem" }}
                      >
                        {isPositive ? "CONDITION PRESENT" : "MITIGATED / ABSENT"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controlled Twin Validation Proof Window */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Terminal size={14} color="var(--cyan)" />
                Controlled Sandbox Validation Proof:
              </h4>
              <div
                style={{
                  background: "#080c16",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem"
                }}
              >
                <div style={{ color: "var(--cyan)", marginBottom: 4 }}>
                  &gt; Payload: {activeVuln.twinValidation.safeTestPayload}
                </div>
                <div style={{ color: "#94a3b8", lineHeight: 1.4 }}>
                  {activeVuln.twinValidation.executionProof}
                </div>
                <div style={{ marginTop: 6, fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  Verified inside {activeVuln.twinValidation.testedInTwinId} at {activeVuln.twinValidation.testTimestamp}
                </div>
              </div>
            </div>

            {/* Blast Radius & Impact Assessment Radar */}
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
                Blast Radius Impact Analysis:
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  fontSize: "0.75rem"
                }}
              >
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Confidentiality Impact:</span>
                  <div style={{ fontWeight: 700, color: "#f87171" }}>{activeVuln.impactAssessment.confidentiality}</div>
                </div>
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Integrity Impact:</span>
                  <div style={{ fontWeight: 700, color: "#f87171" }}>{activeVuln.impactAssessment.integrity}</div>
                </div>
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Privilege Escalation:</span>
                  <div style={{ fontWeight: 700, color: "var(--cyan)" }}>{activeVuln.impactAssessment.privilegeEscalation}</div>
                </div>
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Service Disruption:</span>
                  <div style={{ fontWeight: 700, color: "var(--amber)" }}>{activeVuln.twinValidation.serviceDisruptionRisk}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
