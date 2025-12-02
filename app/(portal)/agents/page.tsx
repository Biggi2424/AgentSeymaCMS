type TenantType = "company" | "user";

type PageProps = {
  searchParams?: { tenantType?: string };
};

const companyStats = [
  { label: "Agents online", value: "32" },
  { label: "Agents offline", value: "5" },
  { label: "Pending Updates", value: "11" },
];

const userStats = [
  { label: "Meine Geraete online", value: "2" },
  { label: "Updates faellig", value: "1" },
  { label: "Letzte Aktionen", value: "3" },
];

const fleet = {
  company: [
    { name: "VDMA-LAP-023", owner: "IT Ops", os: "Windows 11", status: "online" },
    { name: "VDMA-LAP-017", owner: "Sales", os: "Windows 10", status: "offline" },
    { name: "VDMA-SRV-004", owner: "Datacenter", os: "Windows Server 2022", status: "online" },
    { name: "VDMA-LAP-031", owner: "Support", os: "Windows 11", status: "online" },
  ],
  user: [
    { name: "MAX-LAPTOP", owner: "Ich", os: "Windows 11", status: "online" },
    { name: "MAX-HOME-PC", owner: "Ich", os: "Windows 10", status: "offline" },
  ],
};

export default function AgentsPage({ searchParams }: PageProps) {
  const tenantType: TenantType =
    searchParams?.tenantType === "user" ? "user" : "company";

  const stats = tenantType === "company" ? companyStats : userStats;
  const devices = fleet[tenantType];
  const viewLabel = tenantType === "company" ? "Company" : "User";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">
            Agents &amp; Geraete ({viewLabel} Ansicht)
          </h1>
          <p className="text-sm text-zinc-400">
            {tenantType === "company"
              ? "Flottenweite Uebersicht mit Abteilungsbezug und Patchstatus."
              : "Nur eigene Geraete mit Health, Updates und Remote Actions."}
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Dev Ansicht: {viewLabel}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <p className="text-xs text-zinc-400">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-50">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Geraet</th>
              <th className="px-4 py-3 font-medium">Owner / Dept</th>
              <th className="px-4 py-3 font-medium">OS</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr
                key={device.name}
                className="border-t border-zinc-800/80 text-zinc-200 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-3 font-semibold text-zinc-50">{device.name}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{device.owner}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{device.os}</td>
                <td className="px-4 py-3 text-xs">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-[0.7rem] font-semibold ${
                      device.status === "online"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-xs text-zinc-500"
                >
                  Keine Geraete fuer diese Ansicht vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
