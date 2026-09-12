// AutoSecTwin Core Data Store
export const INITIAL_ASSETS = [
  {
    id: "asset-1",
    name: "Production Web Gateway (APACHE-PROD-01)",
    ip: "192.168.10.45",
    hostname: "gateway-prod.secops.internal",
    os: "Ubuntu 20.04 LTS (Kernel 5.4.0-88-generic)",
    environment: "AWS EC2 / Virtualized VPC",
    criticality: "Critical",
    openPorts: [
      { port: 80, protocol: "TCP", service: "HTTP (Apache 2.4.49)", state: "Open" },
      { port: 443, protocol: "TCP", service: "HTTPS (TLS 1.3 / Apache)", state: "Open" },
      { port: 22, protocol: "TCP", service: "OpenSSH 8.2p1", state: "Restricted" },
      { port: 8080, protocol: "TCP", service: "OrderProcessingApp (JVM / Log4j)", state: "Open" }
    ],
    services: [
      { name: "Apache HTTP Server", version: "2.4.49", port: 80, status: "Active" },
      { name: "OrderProcessingApp (Spring/JVM)", version: "1.4.2", port: 8080, status: "Active" },
      { name: "OpenSSH Server", version: "8.2p1", port: 22, status: "Active" },
      { name: "Docker Engine", version: "20.10.7", port: 0, status: "Active" }
    ],
    dependencies: ["log4j-core 2.14.1", "OpenSSL 1.1.1f", "OpenJDK 11.0.11", "libapr1 1.7.0"],
    securityConfig: {
      firewall: "UFW Active (Ingress 80, 443, 8080 allowed)",
      selinux: "Permissive",
      appArmor: "Enforcing (Default Profile)",
      networkIsolation: "VPC Subnet 192.168.10.0/24"
    },
    twinId: "twin-1",
    status: "Monitored",
    lastScanned: "2026-09-12 08:30 UTC"
  },
  {
    id: "asset-2",
    name: "Core Financial Database (POSTGRES-SEC-02)",
    ip: "192.168.10.82",
    hostname: "db-primary.secops.internal",
    os: "Debian 11 (Bullseye)",
    environment: "On-Premise Private Datacenter",
    criticality: "High",
    openPorts: [
      { port: 5432, protocol: "TCP", service: "PostgreSQL 13.3", state: "Restricted" },
      { port: 22, protocol: "TCP", service: "OpenSSH 8.4p1", state: "Restricted" },
      { port: 9100, protocol: "TCP", service: "Node-Exporter (Prometheus)", state: "Internal" }
    ],
    services: [
      { name: "PostgreSQL Database Server", version: "13.3", port: 5432, status: "Active" },
      { name: "OpenSSH Server", version: "8.4p1", port: 22, status: "Active" },
      { name: "Node Exporter", version: "1.2.2", port: 9100, status: "Active" }
    ],
    dependencies: ["OpenSSL 1.1.1k", "glibc 2.31", "libpq5 13.3"],
    securityConfig: {
      firewall: "iptables (Strict Whitelist from Web Gateway)",
      selinux: "Disabled",
      appArmor: "Enforcing",
      networkIsolation: "Private Isolated VLAN 40"
    },
    twinId: "twin-2",
    status: "Monitored",
    lastScanned: "2026-09-12 07:15 UTC"
  },
  {
    id: "asset-3",
    name: "Kubernetes Payment Worker (K8S-WORKER-04)",
    ip: "10.244.3.112",
    hostname: "k8s-node4.cloud.internal",
    os: "Red Hat Enterprise Linux 8.4",
    environment: "Hybrid Cloud EKS Cluster",
    criticality: "High",
    openPorts: [
      { port: 6443, protocol: "TCP", service: "Kubelet API", state: "Restricted" },
      { port: 30080, protocol: "TCP", service: "PaymentMicroservice (Spring Boot)", state: "Open" },
      { port: 10250, protocol: "TCP", service: "Kubelet Auth", state: "Internal" }
    ],
    services: [
      { name: "PaymentMicroservice", version: "2.6.5", port: 30080, status: "Active" },
      { name: "Kubelet Agent", version: "1.23.4", port: 6443, status: "Active" },
      { name: "containerd runtime", version: "1.5.9", port: 0, status: "Active" }
    ],
    dependencies: ["Spring Framework 5.3.17", "Java 17-ea", "Tomcat 9.0.60 embedded"],
    securityConfig: {
      firewall: "Calico NetworkPolicy Enforced",
      selinux: "Enforcing",
      appArmor: "Not Applicable",
      networkIsolation: "Pod CIDR 10.244.3.0/24"
    },
    twinId: "twin-3",
    status: "Monitored",
    lastScanned: "2026-09-12 09:00 UTC"
  }
];

export const INITIAL_VULNERABILITIES = [
  {
    id: "vuln-1",
    cve: "CVE-2021-44228",
    title: "Apache Log4j2 JNDI Remote Code Execution (Log4Shell)",
    assetId: "asset-1",
    severity: "CRITICAL",
    cvss: 10.0,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
    category: "Remote Code Execution (RCE)",
    affectedComponent: "OrderProcessingApp (Log4j Core 2.14.1, Port 8080)",
    scannerSource: "Nessus Enterprise Suite v10.4",
    detectedDate: "2026-09-12",
    description: "Apache Log4j2 <=2.14.1 JNDI features used in configuration, log messages, and parameters do not protect against attacker-controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers when message lookup substitution is enabled.",
    
    // AI Analysis Engine Output
    aiAnalysis: {
      exploitabilityProbability: 94,
      falsePositiveProbability: 4,
      compositeRiskScore: 9.8,
      riskLevel: "CRITICAL",
      confidence: 96,
      reasoning: "The target environment satisfies all prerequisites for remote exploitation: Log4j 2.14.1 is actively loaded on classpath, formatMsgNoLookups is unset (default false), user HTTP headers are directly passed to logger.error(), and outbound LDAP/DNS traffic is permitted.",
      factors: [
        { label: "Vulnerable Library Present", status: "confirmed", detail: "log4j-core-2.14.1.jar in /opt/orderapp/lib" },
        { label: "JNDI Lookup Enabled", status: "confirmed", detail: "formatMsgNoLookups flag false by default" },
        { label: "Exposed Log Vector", status: "confirmed", detail: "Header 'X-Api-Version' passed directly to logger" },
        { label: "Egress LDAP/DNS Allowed", status: "confirmed", detail: "Sandbox twin established outbound connection to test mock LDAP" }
      ]
    },

    // Digital Twin Controlled Validation Result
    twinValidation: {
      status: "Confirmed", // Confirmed | Not Reproducible | Requires Conditions | Inconclusive | Pending
      testedInTwinId: "twin-1",
      testTimestamp: "2026-09-12 09:15:22 UTC",
      safeTestPayload: "${jndi:ldap://127.0.0.1:1389/SafeSecTwinProbe}",
      executionProof: "Digital Twin intercepted outbound LDAP lookup query and spawned controlled probe callback. Arbitrary command execution verified in sandboxed container.",
      serviceDisruptionRisk: "High",
      falsePositive: false
    },

    // Blast Radius & Impact Assessment
    impactAssessment: {
      confidentiality: "CRITICAL",
      integrity: "CRITICAL",
      availability: "HIGH",
      privilegeEscalation: "YES (Docker container breakout potential)",
      dataExposure: "High (Database credentials & API tokens readable in environment)",
      overallImpactScore: 9.9
    },

    // AI Remediation Engine
    remediation: {
      title: "Log4j Upgrade to 2.17.1 & Immediate System Property Hardening",
      type: "Configuration & Patch",
      status: "Ready to Apply", // Ready to Apply | Simulating in Twin | Verified | Requires Review
      estimatedRiskReduction: "High (-8.2 Risk Score)",
      sideEffectsRisk: "Very Low",
      steps: [
        "Add -Dlog4j2.formatMsgNoLookups=true to JVM application startup arguments.",
        "Upgrade org.apache.logging.log4j:log4j-core to version 2.17.1 in dependency manager.",
        "Restart OrderProcessingApp service inside the Digital Twin container.",
        "Execute automated re-test to confirm LDAP payload rejection."
      ],
      patchScript: `#!/bin/bash
# AutoSecTwin Automated Remediation Script
echo "[*] Applying JVM hardening property..."
sed -i 's/JAVA_OPTS="/JAVA_OPTS="-Dlog4j2.formatMsgNoLookups=true /' /etc/default/orderapp
echo "[*] Upgrading jar dependency to 2.17.1..."
cp /var/repo/patches/log4j-core-2.17.1.jar /opt/orderapp/lib/
rm -f /opt/orderapp/lib/log4j-core-2.14.1.jar
systemctl restart orderapp.service
echo "[+] Log4j remediation applied in Digital Twin sandbox."`,
      diff: `--- /etc/default/orderapp.orig
+++ /etc/default/orderapp
-JAVA_OPTS="-Xms512m -Xmx1024m"
+JAVA_OPTS="-Xms512m -Xmx1024m -Dlog4j2.formatMsgNoLookups=true"
-LOG4J_VERSION="2.14.1"
+LOG4J_VERSION="2.17.1"`
    },

    // Re-test & Before/After Status
    reTestResult: {
      completed: false,
      beforeStatus: "Confirmed Vulnerable",
      afterStatus: "Pending Test",
      beforeRisk: 9.8,
      afterRisk: null,
      serviceHealthPostFix: "Unknown"
    }
  },
  {
    id: "vuln-2",
    cve: "CVE-2021-41773",
    title: "Apache HTTP Server Path Traversal & Remote Code Execution",
    assetId: "asset-1",
    severity: "CRITICAL",
    cvss: 9.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    category: "Path Traversal",
    affectedComponent: "Apache HTTP Server 2.4.49 (Port 80/443)",
    scannerSource: "OpenVAS Security Scanner",
    detectedDate: "2026-09-12",
    description: "A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49. An attacker could use a path traversal attack to map URLs to files outside the expected document root. If files outside the document root are not protected by 'require all denied', these requests can succeed.",

    aiAnalysis: {
      exploitabilityProbability: 88,
      falsePositiveProbability: 8,
      compositeRiskScore: 9.2,
      riskLevel: "CRITICAL",
      confidence: 92,
      reasoning: "Server banner explicitly exposes Apache 2.4.49. Directory configuration in apache2.conf has '<Directory /> Require all granted' allowing traversal across mapped aliases.",
      factors: [
        { label: "Target Version Vulnerable", status: "confirmed", detail: "Apache 2.4.49 matches exploit payload" },
        { label: "Missing Root Deny Directive", status: "confirmed", detail: "<Directory /> allow directive is misconfigured" },
        { label: "Alias Mapping Active", status: "confirmed", detail: "/icons/ and /cgi-bin/ directives enabled" }
      ]
    },

    twinValidation: {
      status: "Confirmed",
      testedInTwinId: "twin-1",
      testTimestamp: "2026-09-12 09:16:04 UTC",
      safeTestPayload: "GET /icons/.%%32%65/.%%32%65/.%%32%65/etc/issue HTTP/1.1",
      executionProof: "Digital Twin web server returned HTTP 200 with OS banner 'Ubuntu 20.04 LTS'. Arbitrary file disclosure confirmed.",
      serviceDisruptionRisk: "Medium",
      falsePositive: false
    },

    impactAssessment: {
      confidentiality: "CRITICAL (System configuration files readable)",
      integrity: "MEDIUM",
      availability: "LOW",
      privilegeEscalation: "CONDITIONAL",
      dataExposure: "Critical (/etc/shadow readable if permissions lax)",
      overallImpactScore: 9.4
    },

    remediation: {
      title: "Upgrade Apache HTTP Server to 2.4.51+ & Enforce Root Deny Directive",
      type: "Hardening & Package Upgrade",
      status: "Ready to Apply",
      estimatedRiskReduction: "High (-7.8 Risk Score)",
      sideEffectsRisk: "Very Low",
      steps: [
        "Edit /etc/apache2/apache2.conf and set '<Directory /> Require all denied </Directory>'.",
        "Upgrade apache2 package via apt repository to >= 2.4.51.",
        "Perform graceful service reload in Digital Twin sandbox."
      ],
      patchScript: `#!/bin/bash
echo "[*] Hardening apache2.conf..."
sed -i '/<Directory \\/>/,/<\\/Directory>/s/Require all granted/Require all denied/' /etc/apache2/apache2.conf
echo "[*] Updating apache2 binary package..."
apt-get update -qq && apt-get install --only-upgrade apache2 -y -qq
systemctl reload apache2
echo "[+] Apache hardening completed in Digital Twin."`,
      diff: `--- /etc/apache2/apache2.conf.orig
+++ /etc/apache2/apache2.conf
 <Directory />
 	Options FollowSymLinks
-	Require all granted
+	Require all denied
 </Directory>`
    },

    reTestResult: {
      completed: false,
      beforeStatus: "Confirmed Vulnerable",
      afterStatus: "Pending Test",
      beforeRisk: 9.2,
      afterRisk: null,
      serviceHealthPostFix: "Unknown"
    }
  },
  {
    id: "vuln-3",
    cve: "CVE-2022-22965",
    title: "Spring Framework DataBinder Remote Code Execution (Spring4Shell)",
    assetId: "asset-3",
    severity: "HIGH",
    cvss: 8.8,
    cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    category: "Remote Code Execution",
    affectedComponent: "PaymentMicroservice (Spring Framework 5.3.17, Port 30080)",
    scannerSource: "Nmap NSE vulners engine",
    detectedDate: "2026-09-12",
    description: "A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution (RCE) via data binding. The specific exploit requires the application to run on Tomcat as a WAR deployment.",

    aiAnalysis: {
      exploitabilityProbability: 18,
      falsePositiveProbability: 82,
      compositeRiskScore: 3.8,
      riskLevel: "LOW",
      confidence: 91,
      reasoning: "Although Spring Framework 5.3.17 and Java 17 are in use, the service is packaged as an executable standalone Spring Boot JAR with embedded Tomcat, rather than a WAR file deployed on a standalone Tomcat instance. The exploit vector cannot bind AccessLogValve classloader.",
      factors: [
        { label: "Spring Version Matches", status: "confirmed", detail: "5.3.17 is within flagged range" },
        { label: "JDK >= 9 In Use", status: "confirmed", detail: "Target runs Java 17-ea" },
        { label: "Standalone Tomcat WAR Deployment", status: "rejected", detail: "APPLICATION RUNS AS EMBEDDED FAT JAR (NOT WAR)!" },
        { label: "AccessLogValve Write Permission", status: "rejected", detail: "Container filesystem is read-only except /tmp" }
      ]
    },

    twinValidation: {
      status: "Not Reproducible", // False Positive confirmed!
      testedInTwinId: "twin-3",
      testTimestamp: "2026-09-12 09:18:40 UTC",
      safeTestPayload: "POST /payment/process HTTP/1.1 with class.module.classLoader parameters",
      executionProof: "Digital Twin handled request safely. ClassLoader manipulation rejected by Spring Boot runtime without modifying log valves. Confirmed non-exploitable.",
      serviceDisruptionRisk: "None",
      falsePositive: true
    },

    impactAssessment: {
      confidentiality: "LOW",
      integrity: "LOW",
      availability: "LOW",
      privilegeEscalation: "NONE",
      dataExposure: "Minimal",
      overallImpactScore: 2.5
    },

    remediation: {
      title: "Proactive Defense-in-Depth Spring Framework Upgrade",
      type: "Preventive Upgrade",
      status: "Verified",
      estimatedRiskReduction: "Low (Already non-reproducible in twin)",
      sideEffectsRisk: "Minimal",
      steps: [
        "Update pom.xml <spring-framework.version> to 5.3.18 as best practice.",
        "Document Twin non-reproducibility proof in enterprise vulnerability exception register."
      ],
      patchScript: `echo "[*] Vulnerability proven non-reproducible in Digital Twin."`,
      diff: `--- pom.xml.orig
+++ pom.xml
-<spring-framework.version>5.3.17</spring-framework.version>
+<spring-framework.version>5.3.18</spring-framework.version>`
    },

    reTestResult: {
      completed: true,
      beforeStatus: "Flagged by Scanner",
      afterStatus: "Verified False Positive",
      beforeRisk: 3.8,
      afterRisk: 1.2,
      serviceHealthPostFix: "Healthy"
    }
  },
  {
    id: "vuln-4",
    cve: "CVE-2014-0160",
    title: "OpenSSL TLS Heartbeat Extension Memory Disclosure (Heartbleed)",
    assetId: "asset-2",
    severity: "LOW",
    cvss: 3.2,
    cvssVector: "CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
    category: "Information Disclosure",
    affectedComponent: "PostgreSQL TLS Listener (Port 5432)",
    scannerSource: "Nessus Enterprise Suite v10.4",
    detectedDate: "2026-09-12",
    description: "The TLS and DTLS implementations in OpenSSL 1.0.1 before 1.0.1g do not properly handle Heartbeat Extension packets, allowing remote attackers to obtain sensitive information from process memory via crafted packets.",

    aiAnalysis: {
      exploitabilityProbability: 2,
      falsePositiveProbability: 98,
      compositeRiskScore: 1.8,
      riskLevel: "INFO",
      confidence: 99,
      reasoning: "Debian 11 target is running OpenSSL 1.1.1k which is inherently immune to CVE-2014-0160. Scanner flagged this due to an ambiguous TLS handshake fingerprint.",
      factors: [
        { label: "Installed OpenSSL Binary", status: "rejected", detail: "OpenSSL 1.1.1k installed; Heartbleed affects 1.0.1 branch only" },
        { label: "TLS Extension Support", status: "confirmed", detail: "Heartbeat extension is disabled by default in OpenSSL 1.1.x" }
      ]
    },

    twinValidation: {
      status: "Not Reproducible",
      testedInTwinId: "twin-2",
      testTimestamp: "2026-09-12 09:19:10 UTC",
      safeTestPayload: "Safe TLS Heartbeat Request Probe (length 0x0001 with 0x4000 payload length)",
      executionProof: "Digital Twin TLS listener immediately dropped malformed heartbeat packet and recorded error cleanly. Target is completely immune.",
      serviceDisruptionRisk: "None",
      falsePositive: true
    },

    impactAssessment: {
      confidentiality: "NONE",
      integrity: "NONE",
      availability: "NONE",
      privilegeEscalation: "NONE",
      dataExposure: "Zero",
      overallImpactScore: 1.0
    },

    remediation: {
      title: "Vulnerability Exception Log Entry",
      type: "Audit Documentation",
      status: "Verified",
      estimatedRiskReduction: "Zero (Target already protected)",
      sideEffectsRisk: "None",
      steps: ["Record automated Digital Twin verification in compliance audit trail."],
      patchScript: `echo "[+] OpenSSL 1.1.1k immune. Exception approved."`,
      diff: `# Audit record: CVE-2014-0160 Verified False Positive via AutoSecTwin Sandbox`
    },

    reTestResult: {
      completed: true,
      beforeStatus: "Flagged by Scanner",
      afterStatus: "Verified False Positive",
      beforeRisk: 1.8,
      afterRisk: 0.5,
      serviceHealthPostFix: "Healthy"
    }
  }
];

export const INITIAL_DIGITAL_TWINS = [
  {
    id: "twin-1",
    assetId: "asset-1",
    name: "DigitalTwin-APACHE-PROD-01 (Isolated Replica)",
    state: "Ready", // Provisioning | Ready | Running | Testing | Snapshot | Remediated | Destroyed
    sandboxType: "Containerized Micro-VM (Docker + cgroups v2)",
    parityScore: 98.6,
    networkMode: "Air-Gapped Virtual Bridge (172.28.0.0/16)",
    ipAddress: "172.28.0.45",
    metrics: {
      cpu: 18,
      memory: 44, // %
      memoryUsedMB: 1792,
      memoryTotalMB: 4096,
      diskUsedGB: 6.4,
      diskTotalGB: 20,
      activeServicesCount: 4,
      networkEgressBlocked: true
    },
    services: [
      { name: "apache2 (Twin)", status: "running", port: 80, health: "100% responsive" },
      { name: "orderapp (JVM Twin)", status: "running", port: 8080, health: "100% responsive" },
      { name: "sshd (Twin)", status: "running", port: 22, health: "restricted" },
      { name: "sec-probe-agent", status: "listening", port: 9999, health: "monitoring" }
    ],
    snapshots: [
      { id: "snap-01", name: "Initial Golden Image", timestamp: "2026-09-12 08:35:00 UTC", size: "1.2 GB" },
      { id: "snap-02", name: "Pre-Remediation Checkpoint", timestamp: "2026-09-12 09:10:00 UTC", size: "1.3 GB" }
    ],
    logs: [
      "[08:35:01] Digital Twin container twin-apache-prod initialized from asset-1 image manifest.",
      "[08:35:03] Applying network isolation rules: Outbound internet access DROP, internal telemetry bridge ACCEPT.",
      "[08:35:05] Services started: apache2 (pid 14), orderapp-jvm (pid 38), sshd (pid 45).",
      "[08:35:07] Parity checker: 98.6% configuration similarity confirmed against production target 192.168.10.45.",
      "[09:15:20] Ready for non-destructive controlled validation testing."
    ]
  },
  {
    id: "twin-2",
    assetId: "asset-2",
    name: "DigitalTwin-POSTGRES-SEC-02 (Isolated Replica)",
    state: "Ready",
    sandboxType: "KVM Hardware-assisted Micro-VM",
    parityScore: 99.2,
    networkMode: "Isolated Virtual Switch",
    ipAddress: "172.28.0.82",
    metrics: {
      cpu: 8,
      memory: 32,
      memoryUsedMB: 2560,
      memoryTotalMB: 8192,
      diskUsedGB: 12.1,
      diskTotalGB: 40,
      activeServicesCount: 3,
      networkEgressBlocked: true
    },
    services: [
      { name: "postgresql (Twin)", status: "running", port: 5432, health: "healthy" },
      { name: "sshd (Twin)", status: "running", port: 22, health: "healthy" }
    ],
    snapshots: [
      { id: "snap-db-01", name: "Clean DB State", timestamp: "2026-09-12 07:20:00 UTC", size: "2.8 GB" }
    ],
    logs: [
      "[07:20:00] Digital Twin initialized for PostgreSQL node.",
      "[07:20:04] Isolated storage volume mounted with synthetic database schemas (zero PII data).",
      "[07:20:08] Parity score: 99.2% match. Sandbox ready."
    ]
  },
  {
    id: "twin-3",
    assetId: "asset-3",
    name: "DigitalTwin-K8S-WORKER-04 (Isolated Pod Sandbox)",
    state: "Ready",
    sandboxType: "Kind Isolated Kube Node",
    parityScore: 97.4,
    networkMode: "Kube-router Airgap NetworkPolicy",
    ipAddress: "172.28.0.112",
    metrics: {
      cpu: 12,
      memory: 28,
      memoryUsedMB: 1146,
      memoryTotalMB: 4096,
      diskUsedGB: 4.2,
      diskTotalGB: 20,
      activeServicesCount: 2,
      networkEgressBlocked: true
    },
    services: [
      { name: "PaymentMicroservice (Twin)", status: "running", port: 30080, health: "healthy" }
    ],
    snapshots: [],
    logs: [
      "[09:00:00] Worker pod sandbox launched in twin cluster namespace 'autosectwin-sandbox'.",
      "[09:00:03] Sealed container network policy applied. Ready."
    ]
  }
];

export const ORCHESTRATOR_STAGES = [
  {
    id: 1,
    name: "Environment Profiling",
    description: "Collect target OS, installed software, open ports, and configurations.",
    actionTitle: "Collecting Target Environment Data",
    icon: "Server"
  },
  {
    id: 2,
    name: "Vulnerability Scan Ingestion",
    description: "Ingest and normalize CVE findings from Nessus, OpenVAS, or Nmap scanners.",
    actionTitle: "Processing Scanner Reports & CVE Signatures",
    icon: "Search"
  },
  {
    id: 3,
    name: "AI Risk Analysis",
    description: "Evaluate exploitability likelihood, false positive probability, and impact.",
    actionTitle: "Running AI/ML Risk Scoring & Exploitability Models",
    icon: "Brain"
  },
  {
    id: 4,
    name: "Prioritization Matrix",
    description: "Rank vulnerabilities based on asset criticality, probability, and blast radius.",
    actionTitle: "Ranking Vulnerability Priorities",
    icon: "BarChart3"
  },
  {
    id: 5,
    name: "Digital Twin Preparation",
    description: "Provision air-gapped clone of the target environment with configuration parity.",
    actionTitle: "Creating & Isolating Digital Twin Sandbox",
    icon: "Layers"
  },
  {
    id: 6,
    name: "Controlled Twin Validation",
    description: "Execute safe non-destructive test vectors inside the isolated sandbox.",
    actionTitle: "Running Controlled Exploitation in Digital Twin",
    icon: "ShieldAlert"
  },
  {
    id: 7,
    name: "Impact Assessment",
    description: "Determine data exposure, privilege escalation, and service disruption risks.",
    actionTitle: "Evaluating CIA Triad & Blast Radius Impact",
    icon: "AlertTriangle"
  },
  {
    id: 8,
    name: "AI Remediation Generation",
    description: "Formulate actionable configuration patches, scripts, and upgrade paths.",
    actionTitle: "Generating AI-Powered Remediation Fixes",
    icon: "Sparkles"
  },
  {
    id: 9,
    name: "Fix Simulation in Twin",
    description: "Safely deploy suggested remediation patches into the virtual sandbox.",
    actionTitle: "Simulating Fix Deployment Inside Digital Twin",
    icon: "PlayCircle"
  },
  {
    id: 10,
    name: "Automated Re-Testing & Report",
    description: "Re-run validation to verify fix efficacy and produce final executive report.",
    actionTitle: "Re-Testing Twin, Verifying Status & Publishing Report",
    icon: "CheckCircle2"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    timestamp: "2026-09-12 09:15:30 UTC",
    type: "critical", // critical | success | warning | info
    title: "Critical Vulnerability Confirmed in Digital Twin",
    message: "CVE-2021-44228 (Log4Shell) successfully confirmed in isolated DigitalTwin-APACHE-PROD-01. Outbound LDAP probe callback intercepted.",
    read: false,
    assetId: "asset-1"
  },
  {
    id: "notif-2",
    timestamp: "2026-09-12 09:16:10 UTC",
    type: "critical",
    title: "Path Traversal Confirmed in Digital Twin",
    message: "CVE-2021-41773 confirmed in twin: arbitrary file reading enabled by misconfigured root directory permissions.",
    read: false,
    assetId: "asset-1"
  },
  {
    id: "notif-3",
    timestamp: "2026-09-12 09:18:45 UTC",
    type: "info",
    title: "False Positive Disproven in Digital Twin",
    message: "CVE-2022-22965 (Spring4Shell) flagged by scanner was proven non-reproducible in the twin sandbox due to fat JAR architecture.",
    read: true,
    assetId: "asset-3"
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: "chat-1",
    sender: "bot",
    timestamp: "09:20",
    text: "Hello! I am your AutoSecTwin Security Copilot. I analyze your target assets, monitor Digital Twin sandbox executions, explain AI exploitability findings, and evaluate remediation patches. How can I assist your security audit today?"
  }
];
