// Mock Scanner Import Feeds
export const MOCK_SCAN_REPORTS = [
  {
    id: "scan-nessus-01",
    scannerName: "Tenable Nessus Enterprise v10.4",
    scanDate: "2026-09-12 08:15:00",
    target: "192.168.10.45",
    targetHost: "gateway-prod.secops.internal",
    totalFindings: 4,
    criticalCount: 2,
    highCount: 1,
    mediumCount: 1,
    findings: [
      {
        cve: "CVE-2021-44228",
        pluginId: "155998",
        name: "Apache Log4j Remote Code Execution (Log4Shell)",
        cvss: 10.0,
        severity: "CRITICAL",
        port: 8080,
        protocol: "tcp",
        synopsis: "The remote Java application is affected by a remote code execution vulnerability.",
        description: "Apache Log4j versions 2.0 to 2.14.1 allow remote attackers to execute arbitrary code via a crafted LDAP JNDI reference string."
      },
      {
        cve: "CVE-2021-41773",
        pluginId: "153856",
        name: "Apache HTTP Server 2.4.49 Path Traversal",
        cvss: 9.8,
        severity: "CRITICAL",
        port: 80,
        protocol: "tcp",
        synopsis: "The remote web server is vulnerable to path traversal attacks.",
        description: "Apache HTTP Server 2.4.49 path normalization bypass allows reading files outside DocumentRoot."
      },
      {
        cve: "CVE-2020-1938",
        pluginId: "134107",
        name: "Apache Tomcat AJP 'Ghostcat' File Read",
        cvss: 7.5,
        severity: "HIGH",
        port: 8009,
        protocol: "tcp",
        synopsis: "When using Apache JServ Protocol (AJP), Tomcat treats connections with higher trust.",
        description: "Reading or inclusion of files inside webapps directory."
      }
    ]
  },
  {
    id: "scan-openvas-02",
    scannerName: "Greenbone OpenVAS Community Feed",
    scanDate: "2026-09-12 07:45:00",
    target: "192.168.10.82",
    targetHost: "db-primary.secops.internal",
    totalFindings: 2,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 1,
    findings: [
      {
        cve: "CVE-2014-0160",
        pluginId: "103982",
        name: "OpenSSL TLS Heartbeat Information Disclosure",
        cvss: 5.0,
        severity: "MEDIUM",
        port: 5432,
        protocol: "tcp",
        synopsis: "The TLS listener may leak memory buffers via malformed heartbeat packets.",
        description: "Heuristic port scan matched OpenSSL TLS extension pattern on PostgreSQL service."
      }
    ]
  },
  {
    id: "scan-nmap-03",
    scannerName: "Nmap NSE Script Engine (vulners & nmap-vuln)",
    scanDate: "2026-09-12 08:50:00",
    target: "10.244.3.112",
    targetHost: "k8s-node4.cloud.internal",
    totalFindings: 3,
    criticalCount: 0,
    highCount: 1,
    mediumCount: 2,
    findings: [
      {
        cve: "CVE-2022-22965",
        pluginId: "nse-spring-rce",
        name: "Spring Framework Remote Code Execution (Spring4Shell)",
        cvss: 8.8,
        severity: "HIGH",
        port: 30080,
        protocol: "tcp",
        synopsis: "Spring Web application framework data binder vulnerability.",
        description: "Detected Spring Boot application banner on port 30080 matching version pattern 5.3.17."
      }
    ]
  }
];
