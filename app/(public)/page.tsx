"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const highlights = [
  { title: "Tickets & LLM-Automation", body: "LLM erkennt Intents, plant To-Dos und erstellt Tickets mit Quellen aus Agent Seyma." },
  { title: "Softwareverteilung", body: "MSI/EXE/Skripte, Ring-Rollouts, Status pro Geraet und Agent-Rueckmeldungen." },
  { title: "Service Store", body: "Self-Service fuer User mit Approvals, Deployments oder Tickets - alles tenantfaehig." },
  { title: "Agents & Telemetrie", body: "Status, Events, Logs, Remote Actions. Cloud + lokale Hands des Agents." },
];

const modules = [
  { label: "Control Room", desc: "Zentrale UI fuer Multi-Tenant Ops." },
  { label: "API First", desc: "REST + Webhooks; vorbereitet fuer WebSockets." },
  { label: "Security", desc: "Entra ID / OIDC, Roles, Audit, Mandanten-Isolation." },
  { label: "Deploy", desc: "Packages, Device Groups, Ring-Rollouts." },
  { label: "Tickets", desc: "Lifecycle, Kommentare, Attachments, Quelle Portal/Agent." },
  { label: "Store", desc: "Services & Apps verknuepft mit Deployments oder Tickets." },
];

export default function LandingPage() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-slate-100">
      {booting && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
          <div className="text-center space-y-4 animate-pulse">
            <p className="text-xs tracking-[0.28em] text-slate-400 uppercase">
              Initializing Seyma Cloud...
            </p>
            <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(80%); }
          100% { transform: translateX(120%); }
        }
      `}</style>

      <header className="sticky top-0 z-20 bg-black/50 backdrop-blur border-b border-slate-800/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold tracking-[0.26em]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
            SEYMA CLOUD
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a className="hover:text-slate-100" href="#modules">Module</a>
            <a className="hover:text-slate-100" href="#features">Features</a>
            <a className="hover:text-slate-100" href="#security">Security</a>
            <Link
              href="/login"
              className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-900 hover:bg-white"
            >
              Launch Portal
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="grid min-h-screen gap-10 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">VIKI-Mode, aber legal</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Seyma Cloud. Dein Control Room fuer Tickets, Deployments, Stores und Agents.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              Bootloader, Portal, API: Alles fuer Multi-Tenant Ops. Seyma kombiniert LLM-Planung, Ticketing,
              Softwareverteilung, Service Store und Agent-Telemetrie - in einem dunklen, aufgeraeumten Interface.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2 font-semibold text-slate-900 shadow-[0_0_40px_rgba(52,211,153,0.4)] hover:bg-emerald-300"
              >
                Launch Seyma Cloud
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900/50"
              >
                See the Stack
              </a>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="rounded-full border border-slate-800 px-3 py-1">Next.js + R3F</span>
              <span className="rounded-full border border-slate-800 px-3 py-1">Multi-Tenant</span>
              <span className="rounded-full border border-slate-800 px-3 py-1">LLM-Orchestration</span>
              <span className="rounded-full border border-slate-800 px-3 py-1">Deploy & Tickets</span>
            </div>
            <div className="pt-6 text-xs uppercase tracking-[0.28em] text-slate-500">
              Scroll down
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Boot Console</span>
              <span className="text-emerald-400">online</span>
            </div>
            <div className="mt-4 space-y-2 text-[0.8rem] font-mono text-slate-300">
              <p>&gt; load module: tickets-engine... <span className="text-emerald-400">ok</span></p>
              <p>&gt; load module: deployment-orchestrator... <span className="text-emerald-400">ok</span></p>
              <p>&gt; attach: agent-telemetry... <span className="text-emerald-400">ok</span></p>
              <p>&gt; ready: seyma cloud control-room</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-black/50 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Live Stats (Demo Tenant)</span>
                <span>Latency: 42ms</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">Tickets offen</p>
                  <p className="text-2xl font-semibold text-white">7</p>
                </div>
                <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">Rollouts aktiv</p>
                  <p className="text-2xl font-semibold text-white">3</p>
                </div>
                <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">Agents online</p>
                  <p className="text-2xl font-semibold text-white">32</p>
                </div>
                <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">Requests heute</p>
                  <p className="text-2xl font-semibold text-white">48</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Module im Ueberblick</h2>
            <span className="text-xs text-slate-400">Portal + API + Agent</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {modules.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Was du bekommst</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-xs text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section id="security" className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-950/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-white">Security / Compliance</h2>
            <span className="rounded-full border border-emerald-500/40 px-3 py-1 text-xs text-emerald-300">Mandantenfaehig</span>
          </div>
          <ul className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            <li>Entra ID / OpenID Connect, Roles & Audit Trails</li>
            <li>Postgres mit Tenant-Isolation; Agent-Key-Scopes</li>
            <li>Object Storage fuer Logs/Attachments</li>
            <li>Optionale WebSockets fuer Live-Events</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-indigo-500/10 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Ready</p>
          <h3 className="text-2xl font-semibold text-white">Starte den Seyma Control Room</h3>
          <p className="max-w-2xl text-sm text-slate-300">
            Launch direkt ins Portal oder sprich mit der API - Tickets, Deployments, Agents und Store sind nur einen Klick entfernt.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2 font-semibold text-slate-900 hover:bg-emerald-300"
            >
              Launch Portal
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900/50"
            >
              Mehr erfahren
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/70 bg-black/60 py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
          <span>© {new Date().getFullYear()} Seyma Cloud.</span>
          <div className="flex gap-4">
            <Link href="/imprint" className="hover:text-slate-300">
              Impressum
            </Link>
            <Link href="/privacy" className="hover:text-slate-300">
              Datenschutz
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Kontakt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
