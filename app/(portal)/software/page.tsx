type TenantType = "company" | "user";

type PageProps = {
  searchParams?: { tenantType?: string };
};

const companyRows = [
  { name: "Office 365", version: "24.9", rollout: "Ring 1/3", status: "Deploying" },
  { name: "Defender ATP", version: "5.1", rollout: "Alle Agents", status: "Active" },
  { name: "Chrome", version: "130.0", rollout: "Pilot", status: "Pending" },
];

const userRows = [
  { name: "Office 365", version: "24.9", rollout: "installiert", status: "Up to date" },
  { name: "Zoom", version: "6.0", rollout: "installiert", status: "Update verfuegbar" },
  { name: "VS Code", version: "1.94", rollout: "installiert", status: "Up to date" },
];

export default function SoftwarePage({ searchParams }: PageProps) {
  const tenantType: TenantType =
    searchParams?.tenantType === "user" ? "user" : "company";
  const viewLabel = tenantType === "company" ? "Company" : "User";
  const rows = tenantType === "company" ? companyRows : userRows;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">
            Softwareverteilung ({viewLabel} Ansicht)
          </h1>
          <p className="text-sm text-zinc-400">
            {tenantType === "company"
              ? "Pakete, Deployments und Device Groups fuer den gesamten Tenant."
              : "Self-Service Apps und installierter Stand nur fuer deinen Account."}
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Dev Ansicht: {viewLabel}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Pakete</p>
          <p className="text-2xl font-semibold text-zinc-50">
            {tenantType === "company" ? "58" : "12"}
          </p>
          <p className="text-xs text-zinc-500">
            {tenantType === "company" ? "Tenant-weit gepflegt" : "Apps in deinem Self-Service"}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Deployments aktiv</p>
          <p className="text-2xl font-semibold text-zinc-50">
            {tenantType === "company" ? "3" : "1"}
          </p>
          <p className="text-xs text-zinc-500">
            {tenantType === "company" ? "Rings und Staged Rollouts" : "Persoenliche Installation laeuft"}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Updates faellig</p>
          <p className="text-2xl font-semibold text-zinc-50">
            {tenantType === "company" ? "11" : "1"}
          </p>
          <p className="text-xs text-zinc-500">
            {tenantType === "company" ? "Verteilt auf Abteilungen" : "Auf deinem Geraet"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Paket</th>
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 font-medium">
                {tenantType === "company" ? "Rollout" : "Status"}
              </th>
              <th className="px-4 py-3 font-medium">State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((pkg) => (
              <tr
                key={pkg.name}
                className="border-t border-zinc-800/80 text-zinc-200 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-3 font-semibold text-zinc-50">{pkg.name}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{pkg.version}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{pkg.rollout}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-[0.7rem] font-semibold text-emerald-300">
                    {pkg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
