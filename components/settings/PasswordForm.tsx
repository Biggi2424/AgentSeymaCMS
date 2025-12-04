"use client";

import { FormEvent, useState, useTransition } from "react";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Passwort konnte nicht geändert werden");
        return;
      }
      setSuccess("Passwort aktualisiert");
      setCurrentPassword("");
      setNewPassword("");
    });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-sm font-semibold text-zinc-50">Passwort ändern</p>
      <p className="text-xs text-zinc-400">Aktuelles Passwort wird verifiziert, neues wird gehasht gespeichert.</p>
      <div className="mt-3 space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-zinc-400" htmlFor="currentPassword">
            Aktuelles Passwort
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-zinc-400" htmlFor="newPassword">
            Neues Passwort (min. 8 Zeichen)
          </label>
          <input
            id="newPassword"
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-300">{success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        Passwort ändern
      </button>
    </form>
  );
}
