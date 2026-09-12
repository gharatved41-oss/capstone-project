import React from "react";
import { useSecurity } from "../context/SecurityContext";
import {
  Server,
  Plus,
  Shield,
  Activity,
  Layers,
  Lock,
  ExternalLink,
  ChevronRight,
  HardDrive
} from "lucide-react";

export const AssetsView = ({ onOpenAddAsset, setActiveTab }) => {
  const { assets, selectedAssetId, setSelectedAssetId, vulnerabilities, digitalTwins } = useSecurity();

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const activeTwin = digitalTwins.find((t) => t.id === activeAsset.twinId);
  const assetVulns = vulnerabilities.filter((v) => v.assetId === activeAsset.id);

  return (
    <div>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.35rem", margin: 0 }}>
            Authorized Target Asset Inventory
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Manage authorized infrastructure targets and synchronize high-fidelity Digital Twin replicas.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddAsset}>
          <Plus size={16} /> Register New Target Asset
        </button>
      </div>

      {/* Main Grid: Left = Inventory Table, Right = Detailed Profile Drawer */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
        {/* Assets Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: "0.95rem", margin: 0 }}>
              Registered Systems ({assets.length})
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Target Host</th>
                  <th>IP Address</th>
                  <th>Operating System</th>
                  <th>Criticality</th>
                  <th>Twin Replica</th>
                  <th>Findings</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  const isSelected = asset.id === activeAsset.id;
                  const countVulns = vulnerabilities.filter((v) => v.assetId === asset.id).length;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      style={{
                        cursor: "pointer",
                        background: isSelected ? "rgba(6, 182, 212, 0.08)" : undefined
                      }}
                    >
                      <td>
                        <div style={{ fontWeight: 700, color: isSelected ? "var(--cyan)" : "var(--text-highlight)", display: "flex", alignItems: "center", gap: 8 }}>
                          <Server size={14} color={isSelected ? "var(--cyan)" : "var(--text-secondary)"} />
                          {asset.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {asset.hostname}
                        </div>
                      </td>

                      <td>
                        <code style={{ fontSize: "0.8rem", color: "var(--cyan)" }}>{asset.ip}</code>
                      </td>

                      <td style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {asset.os}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            asset.criticality === "Critical"
                              ? "badge-critical"
                              : asset.criticality === "High"
                              ? "badge-high"
                              : "badge-medium"
                          }`}
                        >
                          {asset.criticality}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-low" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Layers size={11} /> 98%+ Parity
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-cyan">
                          {countVulns} Issues
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Asset Detailed Drawer */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-header" style={{ marginBottom: 16 }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: 4 }}>
                TARGET SPECIFICATIONS
              </span>
              <h3 style={{ fontSize: "1.1rem", margin: "4px 0 0 0" }}>
                {activeAsset.name}
              </h3>
            </div>
            <span className="badge badge-low">
              ● {activeAsset.status}
            </span>
          </div>

          {/* Quick Specs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              padding: 12,
              background: "rgba(0,0,0,0.25)",
              borderRadius: "var(--radius-md)",
              marginBottom: 16,
              fontSize: "0.78rem"
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)" }}>IP Address:</span>
              <div style={{ fontWeight: 700, color: "var(--cyan)" }}>{activeAsset.ip}</div>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Hostname:</span>
              <div style={{ fontWeight: 600 }}>{activeAsset.hostname}</div>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Environment:</span>
              <div>{activeAsset.environment}</div>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Operating System:</span>
              <div>{activeAsset.os}</div>
            </div>
          </div>

          {/* Open Ports & Services */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
              Open Ports & Detected Services:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {activeAsset.openPorts.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 12px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.78rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)", fontWeight: 700 }}>
                      :{p.port}
                    </span>
                    <span style={{ color: "var(--text-highlight)" }}>{p.service}</span>
                  </div>
                  <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>
                    {p.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies & Packages */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
              Software Classpath & Dependencies:
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {activeAsset.dependencies.map((dep, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 8px",
                    background: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.74rem",
                    color: "#c7d2fe",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Twin Status */}
          {activeTwin && (
            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-md)",
                background: "rgba(6, 182, 212, 0.05)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                marginBottom: 16
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--cyan)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Layers size={14} /> Synchronized Digital Twin: {activeTwin.id}
                </span>
                <span className="badge badge-low">{activeTwin.state}</span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: 0 }}>
                {activeTwin.sandboxType} • {activeTwin.parityScore}% Parity Match • Air-gapped network isolated.
              </p>
            </div>
          )}

          {/* Findings linked */}
          <div>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 8 }}>
              Detected Vulnerabilities ({assetVulns.length}):
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {assetVulns.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setActiveTab("vulnerabilities")}
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-highlight)" }}>
                    {v.cve}
                  </span>
                  <span className={`badge ${v.severity === "CRITICAL" ? "badge-critical" : "badge-high"}`}>
                    {v.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
