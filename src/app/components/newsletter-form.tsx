"use client";

import { useState } from "react";

type NewsletterFormProps = {
  className?: string;
};

export function NewsletterForm({ className = "" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Subscription failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`w-full sm:max-w-md ${className}`}>
        <p className="rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-[#f0b08d]">
          You are on the list. New essays will land in your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full sm:max-w-md ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-h-12 flex-1 rounded-md border border-white/20 bg-white/5 px-4 text-sm text-[#fffaf2] placeholder:text-white/50 outline-none focus:border-[#f0b08d]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex min-h-12 items-center justify-center rounded-md bg-[#f0b08d] px-5 text-sm font-semibold text-[#1e1d1a] transition hover:bg-[#ffc2a3] disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-3 text-sm leading-6 text-red-300">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="mt-3 text-sm leading-6 text-white/75">
        New essays land straight in your inbox. No spam, unsubscribe anytime.
      </p>
    </form>
  );
}