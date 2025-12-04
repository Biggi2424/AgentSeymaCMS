"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AgentActions({ agentId }: { agentId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const trigger = (action: "reconnect" | "disable") => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/agents/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Aktion fehlgeschlagen");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => trigger("reconnect")}
        className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs hover:border-emerald-500/40 hover:text-emerald-200 disabled:opacity-60"
      >
        Reconnect agent
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => trigger("disable")}
        className="rounded-full border border-rose-500/30 bg-zinc-900 px-3 py-1 text-xs text-rose-200 hover:border-rose-500/60 disabled:opacity-60"
      >
        Remove device
      </button>
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </div>
  );
}
