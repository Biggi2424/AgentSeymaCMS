import { PasswordForm } from "@/components/settings/PasswordForm";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getCurrentUser();
  const viewLabel = session.tenantType === "company" ? "Company" : "User";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Settings ({viewLabel})</h1>
          <p className="text-sm text-zinc-400">Profil und Passwort werden direkt in der users-Tabelle aktualisiert.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileForm initialName={session.displayName} />
        <PasswordForm />
      </div>
    </div>
  );
}
