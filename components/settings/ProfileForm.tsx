"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Update failed");
        return;
      }
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-sm font-semibold text-zinc-50">Profil</p>
      <p className="text-xs text-zinc-400">Name wird direkt in users.display_name geschrieben.</p>
      <div className="mt-3 space-y-2">
        <label className="text-xs text-zinc-400" htmlFor="displayName">
          Display Name
        </label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />
      </div>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        Speichern
      </button>
    </form>
  );
}
