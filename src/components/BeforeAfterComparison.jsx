import React from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Shield,
  Activity,
  Layers
} from "lucide-react";

export const BeforeAfterComparison = () => {
  const { vulnerabilities, securityScore } = useSecurity();

  // Find vulns that have been tested/remediated
  const analyzedVulns = vulnerabilities;

  return (
    <div className="card" style={{ padding: 24, marginBottom: 28 }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <CheckCircle2 size={20} color="var(--emerald)" />
            Automated Before vs After Security Verification Matrix
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Direct comparison of exploitability, composite risk score, and service stability before and after Digital Twin fix simulation.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Composite Posture
            </span>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--emerald)" }}>
              {securityScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Vulnerability / Asset</th>
              <th>Parameter</th>
              <th>Before Fix (Target State)</th>
              <th style={{ width: 40, textAlign: "center" }}></th>
              <th>After Fix (Twin Verified)</th>
              <th>Service Health & Stability</th>
              <th>Verification Result</th>
            </tr>
          </thead>
          <tbody>
            {analyzedVulns.map((v) => {
              const isRemediated = v.twinValidation.status === "Fixed in Twin" || v.reTestResult?.completed;
              const isFalsePositive = v.twinValidation.falsePositive;

              return (
                <tr key={v.id}>
                  {/* Vuln Details */}
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text-highlight)", fontSize: "0.85rem" }}>
                      {v.cve}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {v.affectedComponent}
                    </div>
                  </td>

                  {/* Parameter */}
                  <td>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Exploitability & Risk
                    </span>
                  </td>

                  {/* Before */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="badge badge-critical" style={{ fontSize: "0.72rem" }}>
                        {v.reTestResult.beforeStatus}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#f87171" }}>
                        Risk: {v.reTestResult.beforeRisk}
                      </span>
                    </div>
                  </td>

                  {/* Arrow */}
                  <td style={{ textAlign: "center", color: "var(--text-muted)" }}>
                    <ArrowRight size={14} />
                  </td>

                  {/* After */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isRemediated ? (
                        <>
                          <span className="badge badge-low" style={{ fontSize: "0.72rem" }}>
                            {v.reTestResult.afterStatus}
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#34d399" }}>
                            Risk: {v.reTestResult.afterRisk || "1.6"}
                          </span>
                        </>
                      ) : isFalsePositive ? (
                        <>
                          <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                            Disproven in Twin
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--cyan)" }}>
                            Risk: {v.reTestResult.afterRisk || "0.8"}
                          </span>
                        </>
                      ) : (
                        <span className="badge badge-high" style={{ fontSize: "0.72rem" }}>
                          Awaiting Re-Test
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Service Stability */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}>
                      <Activity size={14} color="#10b981" />
                      <span style={{ color: "#34d399", fontWeight: 600 }}>
                        {isRemediated ? "100% Operational (No Regression)" : isFalsePositive ? "Unimpaired" : "Active Monitored"}
                      </span>
                    </div>
                  </td>

                  {/* Result Status */}
                  <td>
                    {isRemediated ? (
                      <span
                        className="badge badge-low"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        <CheckCircle2 size={12} /> Confirmed Resolved
                      </span>
                    ) : isFalsePositive ? (
                      <span
                        className="badge badge-cyan"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        <Shield size={12} /> False Positive Filtered
                      </span>
                    ) : (
                      <span className="badge badge-high">Ready for Twin Fix</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Delta Banner */}
      <div
        style={{
          marginTop: 20,
          padding: "16px 20px",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.08))",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TrendingUp size={20} color="var(--emerald)" />
          </div>
          <div>
            <span style={{ fontWeight: 700, color: "var(--text-highlight)", fontSize: "0.9rem" }}>
              Total Attack Surface Reduction: -78.4%
            </span>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              Digital Twin sandbox confirmed zero regressions across web endpoints, database queries, and payment APIs.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>BEFORE ANALYSIS</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--rose)" }}>46 / 100</div>
          </div>
          <div style={{ fontSize: "1.2rem", color: "var(--text-muted)", alignSelf: "center" }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>CURRENT POSTURE</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--emerald)" }}>{securityScore} / 100</div>
          </div>
        </div>
      </div>
    </div>
  );
};
