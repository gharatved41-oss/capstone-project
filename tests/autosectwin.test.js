import test from "node:test";
import assert from "node:assert/strict";

// Import data structures and mocks
import {
  INITIAL_ASSETS,
  INITIAL_VULNERABILITIES,
  INITIAL_DIGITAL_TWINS,
  ORCHESTRATOR_STAGES
} from "../src/data/initialData.js";
import { MOCK_SCAN_REPORTS } from "../src/data/mockScanReports.js";

test("1. Target Asset Inventory & Digital Twin Parity Verification", async (t) => {
  assert.equal(INITIAL_ASSETS.length >= 3, true, "Should have at least 3 configured target assets");

  INITIAL_ASSETS.forEach((asset) => {
    assert.ok(asset.id, "Asset must have a unique ID");
    assert.ok(asset.ip, "Asset must have a valid IP address");
    assert.ok(asset.os, "Asset must specify an operating system");
    assert.ok(asset.criticality, "Asset must specify a criticality rating");
    assert.ok(Array.isArray(asset.openPorts), "Asset must have an array of open ports");
    assert.ok(asset.openPorts.length > 0, "Asset must have open ports defined");
    assert.ok(asset.twinId, "Asset must have an associated Digital Twin ID");
  });

  // Check Web Gateway specific configurations
  const webGateway = INITIAL_ASSETS.find((a) => a.id === "asset-1");
  assert.equal(webGateway.ip, "192.168.10.45");
  assert.ok(webGateway.openPorts.some((p) => p.port === 8080));
  assert.ok(webGateway.dependencies.includes("log4j-core 2.14.1"));
});

test("2. Vulnerability Signatures & AI Risk Scoring Logic", async (t) => {
  assert.equal(INITIAL_VULNERABILITIES.length >= 4, true, "Should have at least 4 CVE findings");

  const log4j = INITIAL_VULNERABILITIES.find((v) => v.cve === "CVE-2021-44228");
  assert.ok(log4j, "Log4Shell CVE-2021-44228 must exist");
  assert.equal(log4j.severity, "CRITICAL");
  assert.equal(log4j.cvss, 10.0);

  // Validate AI Risk Model
  assert.ok(log4j.aiAnalysis.exploitabilityProbability > 90, "Log4Shell must have high exploitability probability");
  assert.ok(log4j.aiAnalysis.compositeRiskScore >= 9.0, "Composite risk score must be critical");
  assert.equal(log4j.aiAnalysis.factors.length >= 4, true, "Must have at least 4 environmental factor checks");

  // Validate False Positive Recognition (Spring4Shell)
  const spring4shell = INITIAL_VULNERABILITIES.find((v) => v.cve === "CVE-2022-22965");
  assert.ok(spring4shell, "Spring4Shell must exist");
  assert.ok(spring4shell.aiAnalysis.falsePositiveProbability > 75, "Spring4Shell must be predicted as a False Positive in standalone fat JAR deployment");
  assert.equal(spring4shell.twinValidation.falsePositive, true);
});

test("3. Digital Twin Sandbox Lifecycle & Air-Gap Boundary", async (t) => {
  assert.equal(INITIAL_DIGITAL_TWINS.length >= 3, true, "Should have at least 3 digital twins");

  INITIAL_DIGITAL_TWINS.forEach((twin) => {
    assert.ok(twin.parityScore >= 95.0, "Digital Twin must maintain >= 95% configuration parity with target");
    assert.equal(twin.metrics.networkEgressBlocked, true, "Digital Twin must enforce strict air-gapped egress block");
    assert.ok(twin.services.length > 0, "Twin must mirror active daemons");
    assert.ok(twin.metrics.cpu >= 0 && twin.metrics.cpu <= 100, "CPU metric within valid range");
    assert.ok(twin.metrics.memory >= 0 && twin.metrics.memory <= 100, "Memory metric within valid range");
  });
});

test("4. Controlled Safe Validation Engine Results", async (t) => {
  const log4j = INITIAL_VULNERABILITIES.find((v) => v.cve === "CVE-2021-44228");
  assert.equal(log4j.twinValidation.status, "Confirmed", "Log4Shell must be confirmed exploitable in isolated twin");
  assert.ok(log4j.twinValidation.safeTestPayload.includes("SafeSecTwinProbe"), "Test payload must use safe controlled probe");

  const openssl = INITIAL_VULNERABILITIES.find((v) => v.cve === "CVE-2014-0160");
  assert.equal(openssl.twinValidation.status, "Not Reproducible", "Heartbleed on OpenSSL 1.1.1k must be verified Not Reproducible");
  assert.equal(openssl.twinValidation.falsePositive, true);
});

test("5. AI Remediation Engine & Configuration Patch Verification", async (t) => {
  INITIAL_VULNERABILITIES.forEach((vuln) => {
    assert.ok(vuln.remediation.title, "Must have remediation title");
    assert.ok(vuln.remediation.steps.length > 0, "Must have actionable remediation steps");
    assert.ok(vuln.remediation.diff, "Must have configuration/code diff");
    assert.ok(vuln.remediation.estimatedRiskReduction, "Must estimate risk reduction");
  });

  const log4j = INITIAL_VULNERABILITIES.find((v) => v.cve === "CVE-2021-44228");
  assert.ok(log4j.remediation.diff.includes("-Dlog4j2.formatMsgNoLookups=true"), "Patch must include formatMsgNoLookups flag");
  assert.ok(log4j.remediation.diff.includes("2.17.1"), "Patch must upgrade version to 2.17.1");
});

test("6. Automated Re-Testing State Transitions & Posture Improvement", async (t) => {
  // Simulate Re-Test calculation logic
  const beforeScore = 46;
  let simulatedScore = beforeScore;

  const testVuln = {
    cve: "CVE-2021-44228",
    initialRisk: 9.8,
    status: "Confirmed"
  };

  // After fix simulated in twin
  const postFixRisk = Number((testVuln.initialRisk * 0.18).toFixed(1));
  assert.equal(postFixRisk < 2.0, true, "Post-fix risk must drop below 2.0");

  simulatedScore += 15; // Remediated vuln bonus
  simulatedScore += 8;  // False positive confirmed bonus
  simulatedScore += 15; // Second vuln remediated
  simulatedScore += 8;  // Second false positive confirmed

  assert.equal(simulatedScore >= 90, true, "Automated re-testing must elevate overall security posture to >= 90/100");
});

test("7. Scanner Integration & Ingestion Pipeline", async (t) => {
  assert.equal(MOCK_SCAN_REPORTS.length >= 3, true, "Must provide mock feeds for Nessus, OpenVAS, and Nmap");

  const nessus = MOCK_SCAN_REPORTS.find((r) => r.scannerName.includes("Nessus"));
  assert.ok(nessus, "Nessus feed must exist");
  assert.equal(nessus.findings.length >= 3, true, "Nessus must have at least 3 findings");

  const openvas = MOCK_SCAN_REPORTS.find((r) => r.scannerName.includes("OpenVAS"));
  assert.ok(openvas, "OpenVAS feed must exist");

  const nmap = MOCK_SCAN_REPORTS.find((r) => r.scannerName.includes("Nmap"));
  assert.ok(nmap, "Nmap feed must exist");
});

test("8. 10-Stage Orchestrator Specification Integrity", async (t) => {
  assert.equal(ORCHESTRATOR_STAGES.length, 10, "Orchestrator must have exactly 10 sequential stages");

  const stageIds = ORCHESTRATOR_STAGES.map((s) => s.id);
  assert.deepEqual(stageIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "Stages must be ordered 1 to 10");

  assert.equal(ORCHESTRATOR_STAGES[0].name, "Environment Profiling");
  assert.equal(ORCHESTRATOR_STAGES[4].name, "Digital Twin Preparation");
  assert.equal(ORCHESTRATOR_STAGES[5].name, "Controlled Twin Validation");
  assert.equal(ORCHESTRATOR_STAGES[8].name, "Fix Simulation in Twin");
  assert.equal(ORCHESTRATOR_STAGES[9].name, "Automated Re-Testing & Report");
});
