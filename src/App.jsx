import React, { useState } from "react";
import { SecurityProvider } from "./context/SecurityContext";
import { Navbar } from "./components/Navbar";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { SecurityChatbot } from "./components/SecurityChatbot";
import { ReportModal } from "./components/ReportModal";
import { AssetModal } from "./components/AssetModal";
import { DiagnosticsModal } from "./components/DiagnosticsModal";

// Views
import { DashboardView } from "./views/DashboardView";
import { PipelineView } from "./views/PipelineView";
import { AssetsView } from "./views/AssetsView";
import { VulnerabilitiesView } from "./views/VulnerabilitiesView";
import { DigitalTwinView } from "./views/DigitalTwinView";
import { ReTestView } from "./views/ReTestView";

export function MainApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reportOpen, setReportOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setReportOpen(true)}
        onToggleNotifs={() => setNotifsOpen(!notifsOpen)}
        onOpenAddAsset={() => setAddAssetOpen(true)}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
      />

      {/* Main View Router */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenAddAsset={() => setAddAssetOpen(true)}
          />
        )}

        {activeTab === "pipeline" && (
          <PipelineView
            setActiveTab={setActiveTab}
            onOpenReport={() => setReportOpen(true)}
          />
        )}

        {activeTab === "assets" && (
          <AssetsView
            onOpenAddAsset={() => setAddAssetOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "vulnerabilities" && (
          <VulnerabilitiesView
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "twin" && (
          <DigitalTwinView />
        )}

        {activeTab === "retest" && (
          <ReTestView />
        )}
      </main>

      {/* Modals & Drawers */}
      <NotificationDrawer
        isOpen={notifsOpen}
        onClose={() => setNotifsOpen(false)}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      <AssetModal
        isOpen={addAssetOpen}
        onClose={() => setAddAssetOpen(false)}
      />

      <DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
      />

      {/* Interactive AI Security Copilot Chatbot */}
      <SecurityChatbot />

      {/* Persistent Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "16px 32px",
          background: "rgba(11, 16, 30, 0.85)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          zIndex: 10
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>AutoSecTwin v2.4</span>
          <span>•</span>
          <span style={{ color: "var(--cyan)" }}>Air-Gapped Sandbox Engine Active</span>
          <span>•</span>
          <span>Controlled PoC Validation Only</span>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <span>Cybersecurity + AI/ML + Digital Twin + Automation</span>
          <span>•</span>
          <span>Authorized Lab Testing Framework</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SecurityProvider>
      <MainApp />
    </SecurityProvider>
  );
}
