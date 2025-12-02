type TenantType = "company" | "user";

type PageProps = {
  searchParams?: { tenantType?: string };
};

const tenantProfiles = {
  company: {
    type: "company" as TenantType,
    name: "VDMA (Demo Tenant)",
    id: "tenant-001",
    users: 142,
    devices: 510,
  },
  user: {
    type: "user" as TenantType,
    name: "Privater Account",
    id: "tenant-user-007",
    users: 1,
    devices: 4,
  },
};

const userProfiles = {
  company: {
    name: "Zephron Admin",
    email: "zephron.admin@vdma.example",
    role: "Owner",
    department: "IT Operations",
    privileges: ["Alle Bereiche", "Rollen vergeben", "Abrechnung einsehen"],
  },
  user: {
    name: "Max Mustermann",
    email: "max.private@example.com",
    role: "Einzel-User",
    department: "Privat",
    privileges: ["Eigene Tickets", "Self Service", "Eigenes Geraet"],
  },
};

const roleCatalog = [
  {
    role: "Owner",
    description: "Vertrags- und Tenant-Verantwortlich, sieht alles, verwaltet Abrechnung.",
    scope: "Alle Bereiche, Billing, Rollen/Policies",
  },
  {
    role: "Admin",
    description: "Globale Plattform-Admins fuer Richtlinien, Deployments und Agents.",
    scope: "Policies, Deployments, Agents, Integrationen",
  },
  {
    role: "IT Operations",
    description: "Betriebsteam fuer Monitoring, Rollouts und Troubleshooting.",
    scope: "Monitoring, Deployments, Tickets bearbeiten",
  },
  {
    role: "Support / Helpdesk",
    description: "Arbeitet Tickets ab, kann Remote-Assist und Basis-Aktionen durchfuehren.",
    scope: "Tickets, Remote Assist, begrenzte Actions",
  },
  {
    role: "Security / Compliance",
    description: "Sicherheits- und Audit-Sicht, setzt Policies und prueft Findings.",
    scope: "Security Policies, Alerts, Reports",
  },
  {
    role: "Procurement / Finance",
    description: "Beschaffung, Lizenzen und Budget-Freigaben.",
    scope: "Bestellungen, Kostenstellen, Vertragsdaten",
  },
  {
    role: "Viewer / Auditor",
    description: "Nur Leserechte fuer Reports und Inventar.",
    scope: "Read-only auf Reports und Inventar",
  },
];

const companyKpis = [
  { label: "Offene Tickets", value: "7" },
  { label: "Aktive Deployments", value: "3" },
  { label: "Agents online", value: "32" },
  { label: "Service Requests heute", value: "14" },
];

const userKpis = [
  { label: "Meine Tickets offen", value: "2" },
  { label: "Meine Geraete online", value: "2" },
  { label: "Self-Service Requests", value: "1" },
  { label: "Letzte Aktionen", value: "5" },
];

const focusAreas = {
  company: [
    "Mandantenweiter Blick auf alle Abteilungen und Standorte",
    "Deployments, Policies und Rollen steuerbar nach Abteilung",
    "Compliance und Audit-Trails auf Tenant-Ebene",
  ],
  user: [
    "Eigenes Geraet, Tickets und Self-Service Requests im Fokus",
    "Keine Sicht auf andere Benutzer oder Abteilungen",
    "Empfehlungen zugeschnitten auf den eigenen PC",
  ],
};

export default function DashboardPage({ searchParams }: PageProps) {
  const tenantType: TenantType =
    searchParams?.tenantType === "user" ? "user" : "company";

  const tenant = tenantProfiles[tenantType];
  const currentUser = userProfiles[tenantType];
  const kpis = tenantType === "company" ? companyKpis : userKpis;
  const viewLabel = tenantType === "company" ? "Company" : "User";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-50">
            Dashboard ({viewLabel} Ansicht)
          </h1>
          <p className="text-sm text-zinc-400">
            Uebersicht ueber Tickets, Deployments, Service-Requests und Agents.
            Tenant kann Unternehmen oder Einzel-User sein; die Sicht passt sich entsprechend an.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Dev Ansicht: {viewLabel}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Tenant</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-zinc-50">{tenant.name}</p>
              <p className="text-xs text-zinc-500">ID: {tenant.id}</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              {viewLabel}
            </span>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Mitglieder: {tenant.users} | Geraete: {tenant.devices} | Sichtbare Daten haengen vom Typ ab
            (Company: alle Abteilungen; User: nur eigener Account).
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Aktueller Benutzer</p>
          <p className="mt-2 text-lg font-semibold text-zinc-50">{currentUser.name}</p>
          <p className="text-xs text-zinc-500">{currentUser.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-900">
              Rolle: {currentUser.role}
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-200">
              Dept: {currentUser.department}
            </span>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-zinc-400">
            {currentUser.privileges.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-400">Zugriffsmodell</p>
          <p className="mt-2 text-sm text-zinc-200">
            Spater werden Features pro Rolle freigeschaltet. Beispiel:
          </p>
          <ul className="mt-3 space-y-2 text-xs text-zinc-400">
            {focusAreas[tenantType].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {tenantType === "company" ? (
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">Typische Rollen im Unternehmen</p>
              <p className="text-lg font-semibold text-zinc-50">Rollen-Katalog (Beispiel)</p>
            </div>
            <span className="text-xs text-zinc-500">{roleCatalog.length} Rollen</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {roleCatalog.map((entry) => (
              <div
                key={entry.role}
                className="rounded-xl border border-zinc-800 bg-black/40 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-50">{entry.role}</p>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                    Scope
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-400">{entry.description}</p>
                <p className="mt-2 text-xs text-emerald-300">{entry.scope}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">Mein Zugriff</p>
              <p className="text-lg font-semibold text-zinc-50">Privat-Ansicht</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
              Nur eigene Daten
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
              <p className="text-sm font-semibold text-zinc-50">Meine Tickets</p>
              <p className="mt-1 text-xs text-zinc-400">
                Erstellen, Status einsehen, Kommentare schreiben. Keine Einsicht in andere User.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
              <p className="text-sm font-semibold text-zinc-50">Self Service</p>
              <p className="mt-1 text-xs text-zinc-400">
                Store-Items und Aktionen nur fuer den eigenen Account.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
              <p className="text-sm font-semibold text-zinc-50">Geraete</p>
              <p className="mt-1 text-xs text-zinc-400">
                Sicht auf die eigenen Geraete, Health-Status und Updates.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs text-zinc-400">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-50">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


