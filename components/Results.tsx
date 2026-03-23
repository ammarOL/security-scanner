"use client";

import type { ScanResult } from "@/lib/types";

type ResultsProps = {
  results: ScanResult;
};

function statusBadge(label: string, kind: "safe" | "danger") {
  return <span className={`badge ${kind}`}>{label}</span>;
}

export default function Results({ results }: ResultsProps) {
  const portsOpen = results.ports.length > 0;
  const sqliVuln = results.sqli.toLowerCase().includes("possible");
  const xssVuln = results.xss.toLowerCase().includes("possible");

  return (
    <section className="card">
      <h3 className="section-title">Results</h3>
      <div className="grid">
        <div className="card">
          <h4 className="section-title">Open Ports</h4>
          {portsOpen
            ? statusBadge("Exposure detected", "danger")
            : statusBadge("No common ports open", "safe")}
          {portsOpen ? (
            <ul className="list">
              {results.ports.map((port) => (
                <li key={port}>{port}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No common ports responded within 500ms.</p>
          )}
        </div>
        <div className="card">
          <h4 className="section-title">Subdomains</h4>
          {results.subdomains.length ? (
            <ul className="list">
              {results.subdomains.map((sub) => (
                <li key={sub}>{sub}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No generated subdomains.</p>
          )}
        </div>
        <div className="card">
          <h4 className="section-title">SQL Injection</h4>
          {sqliVuln
            ? statusBadge(results.sqli, "danger")
            : statusBadge(results.sqli, "safe")}
          <p className="muted">Simple error and keyword check.</p>
        </div>
        <div className="card">
          <h4 className="section-title">XSS</h4>
          {xssVuln
            ? statusBadge(results.xss, "danger")
            : statusBadge(results.xss, "safe")}
          <p className="muted">Reflected payload detection.</p>
        </div>
      </div>
    </section>
  );
}
