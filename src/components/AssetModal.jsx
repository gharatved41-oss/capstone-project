import React, { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { X, Server, Plus, Check } from "lucide-react";

export const AssetModal = ({ isOpen, onClose }) => {
  const { addAsset } = useSecurity();

  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    hostname: "",
    os: "Ubuntu 22.04 LTS",
    environment: "AWS EC2 / Cloud VPC",
    criticality: "High",
    portsStr: "80:HTTP, 443:HTTPS, 22:SSH"
  });

  if (!isOpen) return null;

  const loadPreset = (type) => {
    if (type === "k8s") {
      setFormData({
        name: "EKS Microservices Worker (NODE-09)",
        ip: "10.244.5.18",
        hostname: "eks-worker-09.cloud.internal",
        os: "Amazon Linux 2 (Kernel 5.10)",
        environment: "AWS EKS / Container Cluster",
        criticality: "High",
        portsStr: "6443:Kubelet, 30080:Ingress, 10250:Metrics"
      });
    } else if (type === "redis") {
      setFormData({
        name: "Session Cache Cluster (REDIS-PROD-01)",
        ip: "192.168.10.99",
        hostname: "redis-cache.secops.internal",
        os: "Alpine Linux 3.16",
        environment: "Internal Private Subnet",
        criticality: "Critical",
        portsStr: "6379:Redis, 22:SSH"
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip) return;

    const ports = formData.portsStr.split(",").map((p) => {
      const parts = p.trim().split(":");
      return {
        port: parseInt(parts[0]) || 80,
        protocol: "TCP",
        service: parts[1] || "Unknown Service",
        state: "Open"
      };
    });

    const services = ports.map((p) => ({
      name: p.service,
      version: "1.0",
      port: p.port,
      status: "Active"
    }));

    addAsset({
      name: formData.name,
      ip: formData.ip,
      hostname: formData.hostname || `${formData.name.toLowerCase().replace(/\s+/g, "-")}.internal`,
      os: formData.os,
      environment: formData.environment,
      criticality: formData.criticality,
      openPorts: ports,
      services: services,
      dependencies: ["glibc 2.31", "OpenSSL 1.1.1"],
      securityConfig: {
        firewall: "UFW Active",
        selinux: "Permissive",
        appArmor: "Enabled"
      }
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Server size={20} color="var(--cyan)" />
            <h3 style={{ margin: 0, fontSize: "1.05rem" }}>Register Target Asset & Provision Digital Twin</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Presets */}
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Quick Presets:</span>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: "4px 10px", fontSize: "0.72rem" }}
                  onClick={() => loadPreset("k8s")}
                >
                  Kubernetes Worker Node
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: "4px 10px", fontSize: "0.72rem" }}
                  onClick={() => loadPreset("redis")}
                >
                  Redis Cache Server
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Asset Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auth Gateway Node"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-sm)",
                    color: "#ffffff"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Target IP Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.10.120"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-sm)",
                    color: "#ffffff"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Operating System
                </label>
                <input
                  type="text"
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-sm)",
                    color: "#ffffff"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Criticality Level
                </label>
                <select
                  value={formData.criticality}
                  onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "#141d33",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-sm)",
                    color: "#ffffff"
                  }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 6 }}>
                Open Ports & Services (comma separated port:service)
              </label>
              <input
                type="text"
                placeholder="80:HTTP, 443:HTTPS, 22:SSH"
                value={formData.portsStr}
                onChange={(e) => setFormData({ ...formData, portsStr: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-sm)",
                  color: "#ffffff"
                }}
              />
            </div>

            <div
              style={{
                padding: "12px",
                background: "rgba(6, 182, 212, 0.06)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.75rem",
                color: "var(--cyan)"
              }}
            >
              ℹ️ AutoSecTwin will automatically synthesize an isolated Digital Twin replica with configuration parity for safe testing.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Register Asset & Create Twin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
