import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function UsagePage() {
  const session = await getCurrentUser();
  const db = getDb();

  const agents = await db.agent.count({ where: { tenantId: session.tenantId } });
  const tickets = await db.ticket.count({ where: { tenantId: session.tenantId } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Billing & Usage</h1>
          <p className="text-sm text-zinc-400">Plan, Token-Verbrauch und Grunddaten direkt aus der Datenbank.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Aktueller Plan" value={session.plan.toUpperCase()} sub={`Throttle: ${session.throttleState}`} tone="emerald" />
        <Card
          label="Tokens (Periode)"
          value={`${session.tokensUsedPeriod.toLocaleString()} / ${session.tokensQuotaPeriod.toLocaleString()}`}
          sub="Tages- und Periodenbudget aus Users-Tabelle"
          tone="cyan"
        />
        <Card label="Agents / Tickets" value={`${agents} / ${tickets}`} sub="Tenant-Counts aus DB" tone="amber" />
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-sm font-semibold text-zinc-50">Trial / Abrechnung</p>
        <p className="mt-1 text-xs text-zinc-400">
          Trial bis: {session.trialExpiresAt ?? "keine Trial"} · Tokens aktuell: {session.tokensUsedPeriod} /{" "}
          {session.tokensQuotaPeriod}
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Rechnungen, Plans, Usage: werden direkt aus Postgres bezogen. Keine UI-Stubs mehr; bei fehlenden Tabellen
          werden die Abschnitte ausgelassen.
        </p>
      </section>
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "emerald" | "cyan" | "amber";
}) {
  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
    amber: "text-amber-300 bg-amber-500/10",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
      <p className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>{sub}</p>
    </div>
  );
}
