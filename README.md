# AutoSecTwin – Automated Security Validation Platform

> **A One-Click Closed-Loop Automated Security Assessment Platform** leveraging **AI/ML Risk Scoring**, **Air-Gapped Digital Twins**, **Controlled Proof-of-Concept Validation**, and **Automated Re-Testing**.

---

## 📌 Problem Statement

Traditional vulnerability scanners flag theoretical vulnerabilities based on package banners and static rules. However, scanners often cannot determine whether those vulnerabilities are truly exploitable in a specific target environment, generating excessive false alarms.

Conversely, testing exploits directly on production systems poses severe risks of service disruption, data corruption, or catastrophic outages.

**AutoSecTwin** bridges this gap: it automatically clones authorized target environments into isolated, air-gapped **Digital Twins**, executes controlled non-destructive validation probes strictly within the virtual sandbox, utilizes **Explainable AI (XAI)** to filter false positives and prioritize true risks, simulates remediation patches, and runs automated re-tests to verify vulnerability eradication and system stability.

---

## 🚀 Key Modules & Architecture

```
USER CLICKS ONE BUTTON
          ↓
Collect Target Environment Information
          ↓
Run Authorized Vulnerability Assessment / Ingest Scanner Feeds
          ↓
AI Risk Analysis & Exploitability Prediction
          ↓
Prioritize Vulnerabilities
          ↓
Create / Prepare Digital Twin Sandbox
          ↓
Run Controlled Validation in Isolated Twin
          ↓
Analyze Validation Results & Blast Radius
          ↓
Generate AI Remediation Suggestions
          ↓
Apply Proposed Fixes in Twin Sandbox
          ↓
Re-Test the Twin
          ↓
Compare Before vs After (Score: 46 → 92)
          ↓
Generate Final Executive & Technical Report
          ↓
Send Real-Time Alert / Email Notifications
```

### Core Features

1. **One-Click Orchestration Pipeline**: 10 autonomous sequential stages with a live streaming terminal and progress metrics.
2. **Target Asset Management**: Manages target IPs, OS kernels, open ports, software dependencies, and synchronized twin replicas.
3. **Multi-Scanner Ingestion**: Support for Tenable Nessus, Greenbone OpenVAS, and Nmap vulnerability schemas.
4. **Explainable AI (XAI) Risk Engine**:
   $$\text{Risk Score} = \text{Severity} + \text{Exploitability Probability} + \text{Criticality} + \text{Impact}$$
   Provides condition-based justifications (e.g. why Log4j is confirmed while Spring4Shell in fat JARs is a false positive).
5. **Air-Gapped Digital Twin Engine**: Micro-VM sandbox with 98.6% parity, real-time CPU/RAM telemetry, strict egress blocking, snapshot checkpoints, and interactive shell dispatch.
6. **AI Remediation & Fix Simulator**: Generates code/config diffs, simulates patch application inside the twin, and checks for service regressions.
7. **Automated Re-Testing & Verification**: Verifies status transitions (`Confirmed` $\rightarrow$ `Fixed`) and tracks posture improvement.
8. **Attack Path Visualization**: Interactive visual SVG threat graph with live toggle between active threat paths and severed remediated states.
9. **Executive Reporting & Export**: Printable HTML/PDF report generator and raw JSON audit export.
10. **Embedded AI Security Copilot**: Context-aware chatbot assisting analysts with CVE mechanics and patch trade-offs.

---

## 🛠️ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
```bash
git clone https://github.com/gharatved41-oss/capstone-project.git
cd capstone-project
npm install
```

### Running Locally
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Running Automated Test Suite
To run the automated verification suite across all 8 platform subsystems:
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## 🧪 Test Coverage & Validation

The project includes an automated test suite (`tests/autosectwin.test.js`) verifying:
- Target Asset Inventory & Digital Twin Parity
- Vulnerability Signatures & Multi-factor AI Risk Scoring Logic
- Digital Twin Sandbox Lifecycle & Egress Air-Gap Boundary
- Controlled Safe Validation Engine Results
- AI Remediation Engine & Configuration Patch Verification
- Automated Re-Testing State Transitions & Posture Improvement ($46 \rightarrow 92$)
- Scanner Integration & Ingestion Pipeline
- 10-Stage Orchestrator Specification Integrity

---

## 📜 License
This project is developed as an academic Capstone Project for authorized security validation and educational demonstration.
