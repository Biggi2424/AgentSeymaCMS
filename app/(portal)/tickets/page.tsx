import Link from "next/link";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export default async function TicketsPage() {
  const db = getDb();
  const user = await getCurrentUser();

  const tickets = await db.ticket.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Tickets</h1>
          <p className="text-sm text-zinc-400">
            MVP-Ansicht mit einer einfachen Ticketliste aus der Datenbank.
          </p>
        </div>
        <button className="rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white">
          Neues Ticket
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priorität</th>
              <th className="px-4 py-3 font-medium">Quelle</th>
              <th className="px-4 py-3 font-medium">Erstellt</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t border-zinc-800/80 text-zinc-200 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    {(ticket.humanId ?? ticket.id).toUpperCase()} ·{" "}
                    {ticket.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="inline-flex rounded-full bg-zinc-800 px-2 py-1 text-[0.7rem] capitalize">
                    {ticket.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="inline-flex rounded-full bg-rose-500/10 px-2 py-1 text-[0.7rem] capitalize text-rose-300">
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs capitalize text-zinc-400">
                  {ticket.source}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">
                  {ticket.createdAt.toLocaleString("de-DE")}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-xs text-zinc-500"
                >
                  Noch keine Tickets für diesen Tenant vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
