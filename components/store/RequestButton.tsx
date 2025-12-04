"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RequestButton({ catalogItemId, agentId }: { catalogItemId: string; agentId?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const request = () => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/store/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalogItemId, agentId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Request fehlgeschlagen");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={request}
        className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        Request
      </button>
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </div>
  );
}
