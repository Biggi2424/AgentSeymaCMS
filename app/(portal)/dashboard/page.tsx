export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-50">Dashboard</h1>
      <p className="text-sm text-zinc-400">
        Uebersicht ueber Tickets, Deployments, Service-Requests und Agents.
        Diese Seite zeigt im MVP nur Dummy-Kacheln.
      </p>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Offene Tickets</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">7</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Aktive Deployments</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">3</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Agents online</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">32</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Service Requests heute</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">14</p>
        </div>
      </div>
    </div>
  );
}
