import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-xl backdrop-blur">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold text-zinc-50">Login</h1>
        <p className="text-xs text-zinc-400">
          Im MVP kannst du das Portal ohne echte Auth testen. Spaeter kommt
          Entra ID / OpenID Connect hinzu.
        </p>
      </div>
      <form className="space-y-4 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-300">
            E-Mail
          </label>
          <input
            type="email"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-300">
            Passwort
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
        >
          Dummy-Login (weiter zum Dashboard)
        </button>
      </form>
      <p className="text-center text-xs text-zinc-500">
        <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300">
          Direkt zum Demo-Portal
        </Link>
      </p>
    </div>
  );
}
