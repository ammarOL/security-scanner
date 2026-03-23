"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScanForm from "@/components/ScanForm";
import Results from "@/components/Results";
import type { ScanResult } from "@/lib/types";

const AUTH_KEY = "scanner-auth";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_KEY) === "true";
    if (!authed) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  const handleScan = async (target: string) => {
    if (!target.trim()) {
      setError("Target is required");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "Scan failed");
      }

      const data = (await res.json()) as ScanResult;
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  if (!checked) {
    return (
      <main className="page">
        <section className="shell">
          <p className="loading">Checking session...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="shell">
        <header className="header">
          <h1 className="title">Scanner Dashboard</h1>
          <p className="subtitle">Run quick security checks against a target.</p>
        </header>
        <ScanForm onScan={handleScan} loading={loading} />
        {error ? <p className="error">{error}</p> : null}
        {loading && !results ? (
          <p className="loading">Scanning target...</p>
        ) : null}
        {results ? <Results results={results} /> : null}
      </section>
    </main>
  );
}
