"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Tickets" },
  { href: "/software", label: "Softwareverteilung" },
  { href: "/store", label: "Service Store" },
  { href: "/agents", label: "Agents & Geräte" },
  { href: "/settings", label: "Einstellungen" },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="hidden w-60 flex-col border-r border-zinc-800 bg-black/60 px-4 py-6 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-semibold tracking-[0.24em] text-zinc-300">
            ZEPHRON CLOUD
          </span>
        </Link>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                  active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 bg-black/60 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-400">
              Tenant
            </span>
            <span className="text-sm font-semibold text-zinc-100">
              VDMA (Demo Tenant)
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <p className="font-medium text-zinc-100">zephron.admin@vdma.example</p>
              <p className="text-xs text-zinc-500">Owner</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-emerald-950">
              ZA
            </div>
          </div>
        </header>
        <main className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-4 py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
