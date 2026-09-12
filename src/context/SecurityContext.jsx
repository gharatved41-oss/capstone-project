import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  INITIAL_ASSETS,
  INITIAL_VULNERABILITIES,
  INITIAL_DIGITAL_TWINS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES,
  ORCHESTRATOR_STAGES
} from "../data/initialData";
import { MOCK_SCAN_REPORTS } from "../data/mockScanReports";

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  // State
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState("asset-1");
  const [vulnerabilities, setVulnerabilities] = useState(INITIAL_VULNERABILITIES);
  const [selectedVulnId, setSelectedVulnId] = useState("vuln-1");
  const [digitalTwins, setDigitalTwins] = useState(INITIAL_DIGITAL_TWINS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [role, setRole] = useState("Admin"); // "Admin" | "Analyst"
  const [workspace, setWorkspace] = useState("Production Core Infrastructure");

  // Orchestrator Pipeline State
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestratorStage, setOrchestratorStage] = useState(0); // 0 = idle, 1-10 = running
  const [stageStatuses, setStageStatuses] = useState({
    1: "pending",
    2: "pending",
    3: "pending",
    4: "pending",
    5: "pending",
    6: "pending",
    7: "pending",
    8: "pending",
    9: "pending",
    10: "pending"
  });
  const [orchestratorLogs, setOrchestratorLogs] = useState([
    { time: "08:30:00", text: "AutoSecTwin engine initialized. System standing by." }
  ]);
  const [orchestratorCompleted, setOrchestratorCompleted] = useState(false);

  const orchestrationAbortRef = useRef(false);

  // Helper: Append log
  const addLog = (text) => {
    const time = new Date().toTimeString().split(" ")[0];
    setOrchestratorLogs((prev) => [...prev, { time, text }]);
  };

  // Helper: Add notification
  const addNotification = (notif) => {
    const time = new Date().toTimeString().split(" ")[0] + " UTC";
    const newNotif = {
      id: "notif-" + Date.now(),
      timestamp: time,
      read: false,
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Twin lifecycle helpers
  const addTwinLog = (twinId, logText) => {
    const time = new Date().toTimeString().split(" ")[0];
    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId ? { ...t, logs: [...t.logs, `[${time}] ${logText}`] } : t
      )
    );
  };

  const updateTwinMetrics = (twinId, updates) => {
    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId ? { ...t, metrics: { ...t.metrics, ...updates } } : t
      )
    );
  };

  const snapshotTwin = (twinId) => {
    const time = new Date().toTimeString().split(" ")[0] + " UTC";
    const snapId = "snap-" + Date.now().toString().slice(-4);
    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId
          ? {
              ...t,
              state: "Snapshot",
              snapshots: [
                ...t.snapshots,
                { id: snapId, name: `Checkpoint ${snapId}`, timestamp: time, size: "1.4 GB" }
              ]
            }
          : t
      )
    );
    addTwinLog(twinId, `Snapshot checkpoint created: ${snapId}`);
    addNotification({
      type: "info",
      title: "Digital Twin Snapshot Created",
      message: `Twin ${twinId} state preserved at checkpoint ${snapId}.`
    });
  };

  const resetTwin = (twinId) => {
    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId
          ? {
              ...t,
              state: "Ready",
              metrics: { ...t.metrics, cpu: 14, memory: 40 }
            }
          : t
      )
    );
    addTwinLog(twinId, `Reset twin sandbox to baseline golden image.`);
    addNotification({
      type: "warning",
      title: "Digital Twin Reset",
      message: `Twin sandbox restored to baseline clean state.`
    });
  };

  // Run Controlled Safe Validation on an individual vulnerability
  const runValidationForVuln = async (vulnId) => {
    const vuln = vulnerabilities.find((v) => v.id === vulnId);
    if (!vuln) return;

    addLog(`[Controlled Validation] Starting safe probe for ${vuln.cve} in isolated twin...`);
    addTwinLog(vuln.twinValidation.testedInTwinId, `Controlled probe received: ${vuln.twinValidation.safeTestPayload}`);

    // Update twin state to Testing
    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === vuln.twinValidation.testedInTwinId ? { ...t, state: "Testing" } : t
      )
    );

    await new Promise((r) => setTimeout(r, 1400));

    // Determine result based on existing vuln definition
    const isExploitable = vuln.aiAnalysis.exploitabilityProbability > 50;
    const finalStatus = isExploitable ? "Confirmed" : "Not Reproducible";

    setVulnerabilities((prev) =>
      prev.map((v) =>
        v.id === vulnId
          ? {
              ...v,
              twinValidation: {
                ...v.twinValidation,
                status: finalStatus,
                testTimestamp: new Date().toTimeString().split(" ")[0] + " UTC"
              }
            }
          : v
      )
    );

    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === vuln.twinValidation.testedInTwinId ? { ...t, state: "Ready" } : t
      )
    );

    if (isExploitable) {
      addNotification({
        type: "critical",
        title: `Vulnerability Confirmed in Twin: ${vuln.cve}`,
        message: `Controlled validation confirmed exploitability in isolated environment without touching production.`
      });
      addLog(`[Controlled Validation] ${vuln.cve} CONFIRMED exploitable in Digital Twin.`);
    } else {
      addNotification({
        type: "success",
        title: `False Positive Verified: ${vuln.cve}`,
        message: `Digital Twin proved the target is immune or mitigating conditions prevent exploitation.`
      });
      addLog(`[Controlled Validation] ${vuln.cve} validated NOT REPRODUCIBLE (False Positive).`);
    }
  };

  // Apply Fix in Digital Twin
  const applyFixToTwin = async (vulnId) => {
    const vuln = vulnerabilities.find((v) => v.id === vulnId);
    if (!vuln) return;

    const twinId = vuln.twinValidation.testedInTwinId || "twin-1";
    addLog(`[Fix Simulation] Deploying patch script for ${vuln.cve} into ${twinId}...`);
    addTwinLog(twinId, `Executing remediation script: ${vuln.remediation.title}`);

    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId ? { ...t, state: "Remediating" } : t
      )
    );

    await new Promise((r) => setTimeout(r, 1500));

    addTwinLog(twinId, `Patch script executed successfully. Restarting service daemon...`);
    addTwinLog(twinId, `Service daemon healthy. Regression checks: 0 service errors.`);

    setVulnerabilities((prev) =>
      prev.map((v) =>
        v.id === vulnId
          ? {
              ...v,
              remediation: { ...v.remediation, status: "Applied in Twin (Ready for Re-Test)" }
            }
          : v
      )
    );

    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId ? { ...t, state: "Ready" } : t
      )
    );

    addNotification({
      type: "info",
      title: `Fix Simulated in Twin: ${vuln.cve}`,
      message: `Patch deployed in Digital Twin sandbox. Service remains 100% operational. Ready for automated re-test.`
    });
    addLog(`[Fix Simulation] Fix applied to Twin. Service health verified.`);
  };

  // Automated Re-Test of Vulnerability in Patched Twin
  const runAutomatedReTest = async (vulnId) => {
    const vuln = vulnerabilities.find((v) => v.id === vulnId);
    if (!vuln) return;

    const twinId = vuln.twinValidation.testedInTwinId || "twin-1";
    addLog(`[Automated Re-Test] Re-evaluating ${vuln.cve} against patched Twin ${twinId}...`);
    addTwinLog(twinId, `Re-running controlled test payload: ${vuln.twinValidation.safeTestPayload}`);

    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId ? { ...t, state: "Testing" } : t
      )
    );

    await new Promise((r) => setTimeout(r, 1600));

    addTwinLog(twinId, `[VERIFICATION PASSED] Target rejected exploit vector. Vulnerability no longer detected!`);

    const newRisk = Math.max(1.2, (vuln.aiAnalysis.compositeRiskScore * 0.18).toFixed(1));

    setVulnerabilities((prev) =>
      prev.map((v) =>
        v.id === vulnId
          ? {
              ...v,
              twinValidation: {
                ...v.twinValidation,
                status: "Fixed in Twin"
              },
              remediation: {
                ...v.remediation,
                status: "Verified in Twin"
              },
              reTestResult: {
                completed: true,
                beforeStatus: "Confirmed Vulnerable",
                afterStatus: "Verified Fixed",
                beforeRisk: vuln.aiAnalysis.compositeRiskScore,
                afterRisk: Number(newRisk),
                serviceHealthPostFix: "100% Stable (Zero Downtime)"
              }
            }
          : v
      )
    );

    setDigitalTwins((prev) =>
      prev.map((t) =>
        t.id === twinId ? { ...t, state: "Ready" } : t
      )
    );

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch (_) {}

    addNotification({
      type: "success",
      title: `✓ Remediation Verified: ${vuln.cve}`,
      message: `Automated re-test confirmed ${vuln.cve} is completely removed. Risk reduced from ${vuln.aiAnalysis.compositeRiskScore} to ${newRisk}.`
    });
    addLog(`[Automated Re-Test] ${vuln.cve} verified REMOVED. Post-fix risk: ${newRisk}/10.`);
  };

  // Full 10-Stage One-Click Orchestration Pipeline
  const startOrchestration = async () => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);
    orchestrationAbortRef.current = false;
    setOrchestratorCompleted(false);

    // Reset stage statuses
    const resetStatuses = {};
    for (let i = 1; i <= 10; i++) resetStatuses[i] = "pending";
    setStageStatuses(resetStatuses);

    addLog("=== 🚀 Starting AutoSecTwin One-Click Automated Pipeline ===");
    addNotification({
      type: "info",
      title: "One-Click Security Analysis Started",
      message: "Orchestrating asset discovery, AI risk models, Digital Twin validation, remediation, and re-testing."
    });

    const runStage = async (stageNum, logMsg, duration = 1200) => {
      if (orchestrationAbortRef.current) return false;
      setOrchestratorStage(stageNum);
      setStageStatuses((prev) => ({ ...prev, [stageNum]: "running" }));
      addLog(`[Stage ${stageNum}/10] ${logMsg}...`);
      await new Promise((r) => setTimeout(r, duration));
      if (orchestrationAbortRef.current) return false;
      setStageStatuses((prev) => ({ ...prev, [stageNum]: "completed" }));
      return true;
    };

    // Stage 1: Asset Information Collection
    const s1 = await runStage(1, "Collecting Target Environment & Asset Configuration (IP, Ports, Services)");
    if (!s1) return;

    // Stage 2: Scanner Ingestion
    const s2 = await runStage(2, "Parsing Scanner Feeds & Ingesting CVE Signatures (Nessus, OpenVAS, Nmap)");
    if (!s2) return;

    // Stage 3: AI Risk Analysis
    const s3 = await runStage(3, "Evaluating AI/ML Exploitability Probabilities & False-Positive Likelihoods");
    if (!s3) return;

    // Stage 4: Prioritization Matrix
    const s4 = await runStage(4, "Ranking Vulnerabilities by Criticality, Exposure & Composite Risk Score");
    if (!s4) return;

    // Stage 5: Digital Twin Preparation
    const s5 = await runStage(5, "Provisioning Isolated Digital Twin Sandboxes with 98%+ Parity");
    if (!s5) return;
    setDigitalTwins((prev) =>
      prev.map((t) => ({ ...t, state: "Testing", metrics: { ...t.metrics, cpu: 34, memory: 52 } }))
    );

    // Stage 6: Controlled Twin Validation
    const s6 = await runStage(6, "Executing Non-Destructive Proof-of-Concept Validation in Twin Sandboxes", 1600);
    if (!s6) return;
    addLog("✓ CVE-2021-44228: Confirmed exploitable in Twin (LDAP probe callback captured).");
    addLog("✓ CVE-2021-41773: Confirmed path traversal (/etc/issue exposed in Twin).");
    addLog("✗ CVE-2022-22965: Non-reproducible (Spring Boot fat JAR mitigates exploit vector).");
    addLog("✗ CVE-2014-0160: Non-reproducible (Target runs immune OpenSSL 1.1.1k).");

    // Stage 7: Impact Assessment
    const s7 = await runStage(7, "Calculating Confidentiality, Integrity, Availability & Privilege Blast Radius");
    if (!s7) return;

    // Stage 8: AI Remediation Engine
    const s8 = await runStage(8, "Generating AI-Powered Patches, JVM Flags & Configuration Diffs");
    if (!s8) return;

    // Stage 9: Fix Simulation in Twin
    const s9 = await runStage(9, "Simulating Patch Deployment Inside Digital Twin & Checking Side Effects", 1500);
    if (!s9) return;

    // Stage 10: Automated Re-Testing & Verification
    const s10 = await runStage(10, "Running Automated Re-Test, Verifying Remediation & Generating Final Report", 1600);
    if (!s10) return;

    // Complete all fixes on top vulns
    setVulnerabilities((prev) =>
      prev.map((v) => {
        if (v.id === "vuln-1") {
          return {
            ...v,
            twinValidation: { ...v.twinValidation, status: "Fixed in Twin" },
            remediation: { ...v.remediation, status: "Verified in Twin" },
            reTestResult: {
              completed: true,
              beforeStatus: "Confirmed Vulnerable",
              afterStatus: "Verified Fixed",
              beforeRisk: 9.8,
              afterRisk: 1.6,
              serviceHealthPostFix: "100% Stable"
            }
          };
        }
        if (v.id === "vuln-2") {
          return {
            ...v,
            twinValidation: { ...v.twinValidation, status: "Fixed in Twin" },
            remediation: { ...v.remediation, status: "Verified in Twin" },
            reTestResult: {
              completed: true,
              beforeStatus: "Confirmed Vulnerable",
              afterStatus: "Verified Fixed",
              beforeRisk: 9.2,
              afterRisk: 1.4,
              serviceHealthPostFix: "100% Stable"
            }
          };
        }
        return v;
      })
    );

    setDigitalTwins((prev) =>
      prev.map((t) => ({ ...t, state: "Ready", metrics: { ...t.metrics, cpu: 16, memory: 42 } }))
    );

    setIsOrchestrating(false);
    setOrchestratorCompleted(true);
    addLog("=== 🎉 AutoSecTwin Analysis Successfully Completed! ===");

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (_) {}

    addNotification({
      type: "success",
      title: "🎉 One-Click Security Analysis Completed",
      message: "2 critical vulnerabilities confirmed & successfully remediated in Twin. 2 false positives eliminated. Security score increased to 92/100."
    });
  };

  const stopOrchestration = () => {
    orchestrationAbortRef.current = true;
    setIsOrchestrating(false);
    addLog("🛑 One-Click Orchestration halted by user.");
    addNotification({
      type: "warning",
      title: "Orchestration Paused",
      message: "Pipeline stopped at user request."
    });
  };

  const resetOrchestration = () => {
    setIsOrchestrating(false);
    setOrchestratorStage(0);
    setOrchestratorCompleted(false);
    const resetStatuses = {};
    for (let i = 1; i <= 10; i++) resetStatuses[i] = "pending";
    setStageStatuses(resetStatuses);
    addLog("Pipeline reset to initial standby state.");
  };

  // Import Scan Report
  const importScanReport = (report) => {
    addLog(`[Scanner Integration] Ingesting report: ${report.scannerName} for ${report.target}...`);
    
    // Add new vulnerabilities if not already present
    const newVulns = report.findings.map((f, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      cve: f.cve,
      title: f.name,
      assetId: assets.find((a) => a.ip === report.target)?.id || "asset-1",
      severity: f.severity,
      cvss: f.cvss,
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      category: f.name.includes("RCE") ? "Remote Code Execution" : "Path Traversal",
      affectedComponent: `Port ${f.port} (${f.protocol})`,
      scannerSource: report.scannerName,
      detectedDate: new Date().toISOString().split("T")[0],
      description: f.description,
      aiAnalysis: {
        exploitabilityProbability: f.cvss >= 9 ? 85 : 40,
        falsePositiveProbability: f.cvss >= 9 ? 15 : 60,
        compositeRiskScore: f.cvss,
        riskLevel: f.severity,
        confidence: 88,
        reasoning: "Automated AI risk evaluation based on imported scanner telemetry.",
        factors: [
          { label: "Scanner Confidence", status: "confirmed", detail: `High fidelity plugin ${f.pluginId}` },
          { label: "Environment Check", status: "confirmed", detail: `Port ${f.port} open on target ${report.target}` }
        ]
      },
      twinValidation: {
        status: "Pending",
        testedInTwinId: "twin-1",
        testTimestamp: "Pending",
        safeTestPayload: "AutoSecTwin safe probe payload",
        executionProof: "Awaiting execution in Digital Twin sandbox",
        serviceDisruptionRisk: "Low",
        falsePositive: false
      },
      impactAssessment: {
        confidentiality: f.cvss >= 9 ? "HIGH" : "LOW",
        integrity: f.cvss >= 9 ? "HIGH" : "LOW",
        availability: "MEDIUM",
        privilegeEscalation: "CONDITIONAL",
        dataExposure: "Medium",
        overallImpactScore: f.cvss
      },
      remediation: {
        title: `Remediate ${f.cve} via Patch & Service Configuration`,
        type: "Software Patch",
        status: "Ready to Apply",
        estimatedRiskReduction: "Significant",
        sideEffectsRisk: "Low",
        steps: [`Apply vendor security update for ${f.cve}.`, "Re-test inside Digital Twin."],
        patchScript: `echo "[*] Upgrading target package for ${f.cve}..."`,
        diff: `+ Apply patch for ${f.cve}`
      },
      reTestResult: {
        completed: false,
        beforeStatus: "Flagged by Scanner",
        afterStatus: "Pending Test",
        beforeRisk: f.cvss,
        afterRisk: null,
        serviceHealthPostFix: "Unknown"
      }
    }));

    setVulnerabilities((prev) => [...newVulns, ...prev]);
    addNotification({
      type: "success",
      title: "Scan Report Ingested",
      message: `Imported ${report.totalFindings} findings from ${report.scannerName}.`
    });
  };

  // Add Asset
  const addAsset = (newAsset) => {
    const assetId = "asset-" + (assets.length + 1);
    const twinId = "twin-" + (assets.length + 1);
    const createdAsset = {
      id: assetId,
      twinId,
      status: "Monitored",
      lastScanned: "Just now",
      ...newAsset
    };
    const createdTwin = {
      id: twinId,
      assetId,
      name: `DigitalTwin-${newAsset.name}-Replica`,
      state: "Ready",
      sandboxType: "Containerized Micro-VM",
      parityScore: 98.0,
      networkMode: "Air-Gapped Virtual Bridge",
      ipAddress: `172.28.${assets.length + 1}.10`,
      metrics: {
        cpu: 10,
        memory: 30,
        memoryUsedMB: 1200,
        memoryTotalMB: 4096,
        diskUsedGB: 5.0,
        diskTotalGB: 20,
        activeServicesCount: newAsset.services?.length || 2,
        networkEgressBlocked: true
      },
      services: newAsset.services || [],
      snapshots: [],
      logs: [`[${new Date().toTimeString().split(" ")[0]}] Twin sandbox provisioned for ${newAsset.name}`]
    };

    setAssets((prev) => [...prev, createdAsset]);
    setDigitalTwins((prev) => [...prev, createdTwin]);
    addNotification({
      type: "info",
      title: "Target Asset Registered",
      message: `${newAsset.name} added. Associated Digital Twin sandbox initialized.`
    });
  };

  // AI Security Copilot Chat
  const sendChatMessage = (userText) => {
    const userMsg = {
      id: "chat-" + Date.now(),
      sender: "user",
      timestamp: new Date().toTimeString().split(" ")[0].slice(0, 5),
      text: userText
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Smart context-aware AI response
    setTimeout(() => {
      let botResponse = "";
      const lower = userText.toLowerCase();

      if (lower.includes("log4j") || lower.includes("log4shell") || lower.includes("44228")) {
        botResponse = "CVE-2021-44228 (Log4Shell) is confirmed in DigitalTwin-APACHE-PROD-01. The exploit works because formatMsgNoLookups is false and user headers reach the logger. My recommended remediation is setting '-Dlog4j2.formatMsgNoLookups=true' and upgrading to Log4j 2.17.1. Testing in the twin confirms 0 API regressions.";
      } else if (lower.includes("spring") || lower.includes("spring4shell") || lower.includes("22965")) {
        botResponse = "Regarding CVE-2022-22965 (Spring4Shell): The scanner flagged this, but our Digital Twin controlled validation revealed it is a FALSE POSITIVE. The application is packaged as an executable standalone Spring Boot fat JAR, not a Tomcat WAR. No active exploit is possible in this environment.";
      } else if (lower.includes("twin") || lower.includes("digital twin") || lower.includes("sandbox")) {
        botResponse = "AutoSecTwin Digital Twins are air-gapped containerized replicas mirroring OS, kernel versions, active daemons, and configs at >98% parity. All exploit probes and remediation scripts run exclusively in the twin, guaranteeing zero downtime or risk to production systems.";
      } else if (lower.includes("remediation") || lower.includes("fix") || lower.includes("patch")) {
        botResponse = "Before deploying any fix to production, AutoSecTwin lets you click 'Apply Fix in Twin'. We deploy the patch script into the sandbox, inspect service health, and run an automated re-test to verify the vulnerability is 100% neutralized.";
      } else if (lower.includes("risk") || lower.includes("score")) {
        botResponse = "Our AI multi-factor risk formula computes: Risk = Base Severity + Exploitability Probability + Asset Criticality + Impact. Because Digital Twin testing filters out false positives, your true actionable risk is far more accurate than raw scanner outputs.";
      } else {
        botResponse = `Understood. Currently tracking ${vulnerabilities.length} vulnerabilities across ${assets.length} monitored assets. You can click '▶ Start Automated Security Analysis' to orchestrate the entire 10-stage lifecycle, or ask me about specific CVEs like Log4Shell or Spring4Shell.`;
      }

      const botMsg = {
        id: "chat-" + (Date.now() + 1),
        sender: "bot",
        timestamp: new Date().toTimeString().split(" ")[0].slice(0, 5),
        text: botResponse
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // Dynamic Overall Security Posture Score (0 - 100)
  const calculateSecurityScore = () => {
    let score = 46;
    vulnerabilities.forEach((v) => {
      if (v.twinValidation.status === "Fixed in Twin" || v.reTestResult?.completed) {
        score += 15;
      } else if (v.twinValidation.falsePositive) {
        score += 8;
      }
    });
    return Math.min(score, 94);
  };

  return (
    <SecurityContext.Provider
      value={{
        assets,
        setAssets,
        selectedAssetId,
        setSelectedAssetId,
        addAsset,
        vulnerabilities,
        setVulnerabilities,
        selectedVulnId,
        setSelectedVulnId,
        digitalTwins,
        setDigitalTwins,
        notifications,
        markAllNotificationsRead,
        chatMessages,
        sendChatMessage,
        role,
        setRole,
        workspace,
        setWorkspace,
        // Orchestrator
        isOrchestrating,
        orchestratorStage,
        stageStatuses,
        orchestratorLogs,
        orchestratorCompleted,
        startOrchestration,
        stopOrchestration,
        resetOrchestration,
        // Twin & Testing actions
        snapshotTwin,
        resetTwin,
        runValidationForVuln,
        applyFixToTwin,
        runAutomatedReTest,
        importScanReport,
        securityScore: calculateSecurityScore()
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
