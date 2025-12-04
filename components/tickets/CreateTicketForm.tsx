"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, FormEvent } from "react";

export function CreateTicketForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "critical">("normal");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, source: "portal" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Ticket konnte nicht erstellt werden.");
        return;
      }
      setTitle("");
      setDescription("");
      setPriority("normal");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
    >
      <input
        required
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="min-w-[160px] flex-1 bg-transparent px-2 py-1 text-sm text-zinc-100 outline-none"
      />
      <input
        required
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-w-[220px] flex-1 bg-transparent px-2 py-1 text-sm text-zinc-100 outline-none"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs"
      >
        <option value="low">low</option>
        <option value="normal">normal</option>
        <option value="high">high</option>
        <option value="critical">critical</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        Neues Ticket
      </button>
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </form>
  );
}
