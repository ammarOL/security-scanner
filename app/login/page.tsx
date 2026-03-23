"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "scanner-auth";
const VALID_EMAIL = "admin@test.com";
const VALID_PASSWORD = "1234";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_KEY) === "true";
    if (authed) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      router.replace("/dashboard");
      return;
    }

    setError("Invalid credentials");
  };

  return (
    <main className="page">
      <section className="shell">
        <header className="header">
          <h1 className="title">Cybersecurity Scanner</h1>
          <p className="subtitle">Sign in to run quick checks.</p>
        </header>
        <form className="card" onSubmit={handleSubmit}>
          <div className="row">
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button className="button" type="submit">
              Login
            </button>
          </div>
          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
