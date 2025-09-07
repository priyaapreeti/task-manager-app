"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Signup failed");
      }
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "72px auto", padding: 24 }} className="bg-amber-100 rounded-lg shadow-md">
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Create your account</h1>
      <form onSubmit={onSubmit}>
        {error && (
          <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>
        )}

        <label htmlFor="name" style={{ display: "block", fontWeight: 600 }}>Name</label>
        <input
          id="name"
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6, marginTop: 6, marginBottom: 14 }}
        />

        <label htmlFor="email" style={{ display: "block", fontWeight: 600 }}>Email</label>
        <input
          id="email"
          className="input"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6, marginTop: 6, marginBottom: 14 }}
        />

        <label htmlFor="password" style={{ display: "block", fontWeight: 600 }}>Password</label>
        <input
          id="password"
          className="input"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6, marginTop: 6, marginBottom: 14 }}
        />

        <button
          className="btn"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "none",
            background: loading ? "#9ca3af" : "#111827",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
