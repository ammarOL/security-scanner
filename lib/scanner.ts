import net from "node:net";
import type { ScanResult } from "@/lib/types";

const COMMON_PORTS = [21, 22, 80, 443, 3306];
const SUBDOMAIN_PREFIXES = ["api.", "dev.", "mail.", "test."];

let lastScan: ScanResult | null = null;

function toUrl(target: string): URL {
  const trimmed = target.trim();
  if (!trimmed) {
    throw new Error("Target is required");
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return new URL(trimmed);
  }
  return new URL(`http://${trimmed}`);
}

async function scanPort(host: string, port: number, timeoutMs: number) {
  return new Promise<boolean>((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const done = (open: boolean) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(open);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));

    socket.connect(port, host);
  });
}

async function scanPorts(host: string) {
  const checks = await Promise.all(
    COMMON_PORTS.map(async (port) => ({
      port,
      open: await scanPort(host, port, 500),
    }))
  );
  return checks.filter((item) => item.open).map((item) => item.port);
}

function findSubdomains(host: string) {
  return SUBDOMAIN_PREFIXES.map((prefix) => `${prefix}${host}`);
}

async function testSqlInjection(targetUrl: URL) {
  const url = new URL(targetUrl.toString());
  url.searchParams.set("id", "' OR 1=1 --");

  const res = await fetch(url);
  const body = await res.text();
  const flagged = res.status >= 500 || body.toLowerCase().includes("sql");
  return flagged ? "Possible SQL Injection" : "No obvious SQLi";
}

async function testXss(targetUrl: URL) {
  const payload = "<script>alert(1)</script>";
  const url = new URL(targetUrl.toString());
  url.searchParams.set("q", payload);

  const res = await fetch(url);
  const body = await res.text();
  return body.includes(payload) ? "Possible XSS" : "No XSS";
}

export async function runScan(target: string): Promise<ScanResult> {
  const url = toUrl(target);
  const host = url.hostname;

  const [ports, sqli, xss] = await Promise.all([
    scanPorts(host),
    testSqlInjection(url),
    testXss(url),
  ]);

  const result: ScanResult = {
    ports,
    subdomains: findSubdomains(host),
    sqli,
    xss,
  };

  lastScan = result;
  return result;
}

export function getLastScan() {
  return lastScan;
}
