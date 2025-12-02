type TenantType = "company" | "user";

type PageProps = {
  searchParams?: { tenantType?: string };
};

export default function SettingsPage({ searchParams }: PageProps) {
  const tenantType: TenantType =
    searchParams?.tenantType === "user" ? "user" : "company";
  const viewLabel = tenantType === "company" ? "Company" : "User";

  const companySettings = [
    "Branding (Logo, Farben) fuer alle Nutzer",
    "Rollen und Berechtigungen verwalten",
    "Integrationen (SSO, Ticketing, CMDB)",
    "Rechnungsadresse und Abrechnung",
  ];

  const userSettings = [
    "Profil (Name, Kontakt) und Benachrichtigungen",
    "Passwort / SSO-Bindung",
    "Geraete-Verknuepfungen",
    "Self-Service Defaults",
  ];

  const items = tenantType === "company" ? companySettings : userSettings;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">
            Einstellungen ({viewLabel} Ansicht)
          </h1>
          <p className="text-sm text-zinc-400">
            {tenantType === "company"
              ? "Tenant-Einstellungen, Branding und Rollenverwaltung."
              : "Persoenliche Einstellungen fuer deinen Account."}
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Dev Ansicht: {viewLabel}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs text-zinc-400">
          {tenantType === "company" ? "Tenant-weit" : "Nur fuer dich"}
        </p>
        <p className="text-lg font-semibold text-zinc-50">Konfigurationsbereiche</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-300"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
