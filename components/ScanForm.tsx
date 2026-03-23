"use client";

import { useState } from "react";

type ScanFormProps = {
  onScan: (target: string) => Promise<void> | void;
  loading: boolean;
};

export default function ScanForm({ onScan, loading }: ScanFormProps) {
  const [target, setTarget] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onScan(target);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="row">
        <input
          className="input"
          placeholder="Target domain or URL"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>
    </form>
  );
}
