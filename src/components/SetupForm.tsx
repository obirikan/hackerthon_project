"use client";

import { useState } from "react";
import { registerTeam } from "@/lib/api";
import { MERCHANT_SLUG, TEAM_NAME, TEAM_SLUG } from "@/lib/constants";

const SLUG_PATTERN = /^[a-z0-9-]{2,40}$/;

export function SetupForm() {
  const [slug, setSlug] = useState(TEAM_SLUG);
  const [name, setName] = useState(TEAM_NAME);
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!SLUG_PATTERN.test(slug)) {
      setStatus("error");
      setMessage("Slug must be 2–40 lowercase letters, digits, or hyphens.");
      return;
    }
    setStatus("loading");
    try {
      await registerTeam({
        slug,
        name,
        merchant_id: MERCHANT_SLUG,
        contact: contact || undefined,
      });
      setStatus("ok");
      setMessage(`Team "${slug}" registered successfully.`);
      localStorage.setItem("sylvara-team-ready", "1");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (msg.includes("already registered") || msg.includes("taken")) {
        setStatus("ok");
        setMessage(`Team "${slug}" is already registered — you're good to go.`);
        localStorage.setItem("sylvara-team-ready", "1");
      } else {
        setStatus("error");
        setMessage(msg);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
      <div>
        <label className="section-label mb-2 block">Team slug</label>
        <input
          className="input-field"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          pattern="[a-z0-9-]{2,40}"
          required
        />
      </div>
      <div>
        <label className="section-label mb-2 block">Team name</label>
        <input
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="section-label mb-2 block">Contact (optional)</label>
        <input
          className="input-field"
          type="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <p className="text-xs text-brand-silver/50">
        Merchant: {MERCHANT_SLUG} · Attached to all baskets & campaigns
      </p>
      {message && (
        <p
          className={`text-sm ${status === "error" ? "text-red-300" : "text-brand-silver"}`}
          role="alert"
        >
          {message}
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Registering…" : "Register team"}
      </button>
    </form>
  );
}
