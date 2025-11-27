"use client";

import { useEffect, useRef } from "react";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-landing-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-landing-playfair",
});

export default function LandingPage() {
  const bootloaderRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("zephron-landing-body");
    return () => {
      document.body.classList.remove("zephron-landing-body");
      document.body.classList.remove("hero-text-visible");
    };
  }, []);

  useEffect(() => {
    const bootloader = bootloaderRef.current;
    const logEl = logRef.current;
    const bar = barRef.current;
    const video = videoRef.current;
    const container = pageRef.current;

    if (!bootloader || !logEl || !bar || !container) {
      return;
    }

    logEl.innerHTML = "";
    const lines = [
      "[BOOT] Zephron wird gestartet...",
      "[BOOT] Komponenten werden vorbereitet...",
      "[BOOT] Einstellungen werden geprueft...",
      "[BOOT] Oberflaeche wird geladen...",
      "[OK] Zephron ist bereit.",
    ];

    let index = 0;
    const timers: number[] = [];

    const appendLine = (text: string) => {
      const line = document.createElement("div");
      line.className = "bootloader-log-line";
      line.textContent = text;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    };

    const finishBoot = () => {
      bootloader.classList.add("bootloader-hidden");
      if (video && typeof video.play === "function") {
        video.play().catch(() => {
          // Autoplay kann blockiert sein; dann bleibt das Standbild.
        });
      }
      window.setTimeout(() => {
        document.body.classList.add("hero-text-visible");
      }, 700);
    };

    const nextStep = () => {
      if (index < lines.length) {
        appendLine(lines[index]);
        bar.style.width = `${((index + 1) / lines.length) * 100}%`;
        index += 1;
        timers.push(window.setTimeout(nextStep, 850));
      } else {
        timers.push(window.setTimeout(finishBoot, 600));
      }
    };

    nextStep();

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(".hero, .section, .section-alt"),
    );
    let isScrolling = false;

    const scrollToSection = (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= sections.length) return;
      isScrolling = true;
      window.scrollTo({
        top: targetIndex * window.innerHeight,
        behavior: "smooth",
      });
      window.setTimeout(() => {
        isScrolling = false;
      }, 900);
    };

    const onWheel = (event: WheelEvent) => {
      if (isScrolling || sections.length === 0) return;
      const legacyDelta = (event as unknown as { wheelDelta?: number }).wheelDelta;
      const delta = typeof event.deltaY === "number" ? event.deltaY : legacyDelta ? -legacyDelta : 0;
      if (!delta) return;

      const direction = delta > 0 ? 1 : -1;
      const currentIndex = Math.round(window.scrollY / window.innerHeight);
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      if (targetIndex === currentIndex) return;

      event.preventDefault();
      scrollToSection(targetIndex);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isScrolling || sections.length === 0) return;
      const currentIndex = Math.round(window.scrollY / window.innerHeight);

      if (event.key === "PageDown" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        scrollToSection(Math.min(sections.length - 1, currentIndex + 1));
      } else if (event.key === "PageUp" || event.key === "ArrowUp") {
        event.preventDefault();
        scrollToSection(Math.max(0, currentIndex - 1));
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("hero-text-visible");
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className={`zephron-landing ${inter.variable} ${playfair.variable}`}
    >
      <div ref={bootloaderRef} className="bootloader">
        <div className="bootloader-logo">
          <div className="bootloader-logo-mark">
            <div className="bootloader-logo-dot" />
          </div>
          <span>STARTING ZEPHRON</span>
        </div>
        <div ref={logRef} className="bootloader-log" />
        <div className="bootloader-progress">
          <div ref={barRef} className="bootloader-progress-bar" />
        </div>
        <div className="bootloader-hint">Bitte warten - Zephron wird gestartet...</div>
      </div>

      <div className="page">
        <section className="hero">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://videos.pexels.com/video-files/3130284/3130284-uhd_3840_2160_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-bg" />
          <div className="hero-grain" />
          <div className="hero-aurora" />
          <div className="hero-beam" />
          <div className="hero-inner">
            <div className="hero-center">
              <div className="hero-center-inner">
                <div className="hero-center-kicker">WATCH ANALYZE CONTROL</div>
                <div className="hero-center-title">ZEPHRON</div>
                <p className="hero-center-subtitle">Your powerful agent</p>
                <div className="hero-chip-row">
                  <span className="hero-chip">Signal aware</span>
                  <span className="hero-chip">Action ready</span>
                  <span className="hero-chip">Guardrails on</span>
                </div>
                <p className="hero-footnote">
                  Calm control-room energy: see, understand, act - immer mit Transparenz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-inner">
            <div className="section-center-block">
              <div className="section-kicker">WATCH</div>
              <div className="section-ornament" />
              <h2 className="section-title section-title-large">
                Always watching your Windows fleet.
              </h2>
              <p className="section-text section-lead">
                Zephron never sleeps. Es beobachtet alles, was du freigibst - von einem einzelnen Laptop
                bis zum gesamten Unternehmensnetz: CPU, RAM, Platten, Prozesse, Services, Netzwerk, Logs,
                Events. End-to-end statt 20 Tools: Clients, Server, Firewalls, Drucker, Switches, Cloud
                Services in einer Sicht.
              </p>
              <div className="section-pills-row">
                <div className="section-pill">
                  <span className="section-pill-dot" />
                  Live device models
                </div>
                <div className="section-pill">
                  <span className="section-pill-dot" />
                  Anomaly-aware alerts
                </div>
                <div className="section-pill">
                  <span className="section-pill-dot" />
                  Context for every signal
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-alt">
          <div className="section-alt-inner">
            <div className="section-center-block">
              <div className="section-kicker">ANALYZE</div>
              <div className="section-ornament" />
              <h2 className="section-title section-title-large">
                Seeing is nothing without understanding.
              </h2>
              <p className="section-text section-lead">
                Zephron verwandelt rohe Signale in Entscheidungen: Plain-English Fragen, tiefe Diagnostik,
                Empfehlungen mit Begruendung.
              </p>
              <div className="section-alt-cards">
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Natural language</div>
                  <p>
                    Frag einfach: Warum ist dieser Server langsam? Wo sind wir verwundbar? Was ist mit dem VPN?
                  </p>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Root causes</div>
                  <p>
                    Korrelation aus Metriken, Logs, Topologie und Historie statt Raetseln; von einem PC bis zum ganzen Netz.
                  </p>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Explainable</div>
                  <p>
                    Jede Empfehlung kommt mit einem Warum: gesehenes Muster, Kontext, Trade-offs und Alternativen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-inner">
            <div className="section-center-block">
              <div className="section-kicker">CONTROL</div>
              <div className="section-ornament" />
              <h2 className="section-title section-title-large">
                From insights to action, with guardrails.
              </h2>
              <p className="section-text section-lead">
                Zephron handelt: Apps oeffnen, Policies setzen, Software ausrollen, Skripte starten,
                Konfigurationen reparieren - ausgelöst per Sprache oder Text, immer mit Rueckmeldung.
              </p>
              <div className="section-alt-cards">
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Execution</div>
                  <p>
                    Von Browser oeffnen und Teile bestellen bis Patch-Waves an alle Laptops mit Auto-Rollback.
                  </p>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Guardrails</div>
                  <p>
                    Keine kritische Aktion ohne Checks, nichts im Geheimen, alles geloggt und erklaert; du genehmigst oder delegierst.
                  </p>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Feedback</div>
                  <p>
                    Nach jedem Schritt: Was wurde getan, was hat sich geaendert, was ist als naechstes geplant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <div>&copy; 2025 Agent Zephron - Autonomous Windows Support Platform</div>
            <div style={{ display: "flex", gap: "12px" }}>
              <a href="#" className="link">
                Impressum
              </a>
              <a href="#" className="link">
                Datenschutz
              </a>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        /* Zephron palette locked for calm-control mood:
           Deep blacks (#000/#080/#050) for focus, soft green accent #22c55e + mint #bbf7d0 for "online/trust",
           grain + low-sat neutrals to avoid sterility and keep a quiet control-room feeling. */
        :global(.zephron-landing) {
          --bg: #050505;
          --bg-soft: #101010;
          --accent: #22c55e;
          --accent-soft: #bbf7d0;
          --text: #f5f5f5;
          --muted: #9ca3af;
          --max-width: 1080px;
          font-family: var(--font-landing-inter), system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        :global(body.zephron-landing-body) {
          background: linear-gradient(180deg, #000000 0%, #080808 40%, #050505 100%);
          color: var(--text);
          min-height: 100vh;
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }

        :global(.zephron-landing *) {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :global(.zephron-landing .page) {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        :global(.zephron-landing .hero) {
          position: relative;
          min-height: 100vh;
          height: 100vh;
          overflow: hidden;
          isolation: isolate;
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        :global(.zephron-landing .hero-bg) {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.96)
          );
          transform: scale(1.02);
          z-index: -2;
        }

        :global(.zephron-landing .hero-grain) {
          position: absolute;
          inset: -50px;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.22;
          mix-blend-mode: soft-light;
          z-index: -1;
          pointer-events: none;
        }

        :global(.zephron-landing .hero-aurora) {
          position: absolute;
          inset: 10% 8%;
          background: radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.24), transparent 50%),
            radial-gradient(circle at 70% 55%, rgba(34, 197, 94, 0.18), transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(15, 23, 42, 0.8), transparent 50%);
          filter: blur(32px) saturate(1.1);
          z-index: -1;
        }

        :global(.zephron-landing .hero-beam) {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(34, 197, 94, 0.04) 0%,
            rgba(34, 197, 94, 0.08) 20%,
            rgba(34, 197, 94, 0.02) 50%,
            transparent 70%
          );
          mix-blend-mode: screen;
          opacity: 0.8;
          z-index: -2;
          animation: beamShift 12s ease-in-out infinite alternate;
        }

        :global(.zephron-landing .hero-inner) {
          position: relative;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 20px 20px 40px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        :global(.zephron-landing .hero-video) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -3;
          filter: saturate(1.1) contrast(1.05);
        }

        :global(.zephron-landing .hero-center) {
          min-height: calc(100vh - 90px);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 16px 60px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 1s ease, transform 1s ease;
        }

        :global(body.hero-text-visible .hero-center) {
          opacity: 1;
          transform: translateY(0);
        }

        :global(.zephron-landing .hero-center-inner) {
          max-width: 640px;
          margin: 0 auto;
        }

        :global(.zephron-landing .hero-center-kicker) {
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }

        :global(.zephron-landing .hero-center-title) {
          font-family: var(--font-landing-playfair), "Times New Roman", serif;
          font-size: clamp(34px, 6vw, 52px);
          letter-spacing: 0.38em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        :global(.zephron-landing .hero-center-subtitle) {
          font-size: 14px;
          color: var(--muted);
        }

        :global(.zephron-landing .hero-chip-row) {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px auto 6px;
          justify-content: center;
        }

        :global(.zephron-landing .hero-chip) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(0, 0, 0, 0.55);
          box-shadow: 0 6px 32px rgba(34, 197, 94, 0.24);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text);
          position: relative;
          overflow: hidden;
        }

        :global(.zephron-landing .hero-chip::after) {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%);
          transform: translateX(-120%);
          animation: shimmer 6s ease-in-out infinite;
        }

        :global(.zephron-landing .hero-footnote) {
          margin-top: 10px;
          color: #d1d5db;
          font-size: 12px;
          letter-spacing: 0.08em;
        }

        :global(.zephron-landing .section) {
          position: relative;
          background: radial-gradient(circle at center, #020b06 0, #020202 55%);
          padding: 60px 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
        }

        :global(.zephron-landing .section-alt) {
          position: relative;
          background: radial-gradient(circle at center, #020b06 0, #020202 55%);
          padding: 60px 20px 70px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
        }

        :global(.zephron-landing .section-inner) {
          max-width: var(--max-width);
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        :global(.zephron-landing .section-alt-inner) {
          max-width: var(--max-width);
          margin: 0 auto;
          border-radius: 28px;
          border: 1px solid rgba(34, 197, 94, 0.35);
          padding: 32px 22px 28px;
          background: radial-gradient(circle at top left, #020b06 0, #020202 60%);
          position: relative;
          z-index: 1;
        }

        @media (min-width: 720px) {
          :global(.zephron-landing .section-alt-inner) {
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
            gap: 28px;
          }
        }

        :global(.zephron-landing .section-center-block) {
          text-align: center;
          max-width: 640px;
          margin: 0 auto;
        }

        :global(.zephron-landing .section-kicker) {
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 12px;
        }

        :global(.zephron-landing .section-ornament) {
          width: 120px;
          height: 1px;
          margin: 0 auto 14px;
          background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.8), transparent);
          box-shadow: 0 0 24px rgba(34, 197, 94, 0.3);
          opacity: 0.8;
        }

        :global(.zephron-landing .section-title) {
          font-family: var(--font-landing-playfair), "Times New Roman", serif;
          font-size: 26px;
          margin-bottom: 12px;
        }

        :global(.zephron-landing .section-title-large) {
          font-size: clamp(24px, 4vw, 34px);
        }

        :global(.zephron-landing .section-text) {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }

        :global(.zephron-landing .section-lead) {
          margin-top: 10px;
        }

        :global(.zephron-landing .section-pills-row) {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        :global(.zephron-landing .section-pill) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.5);
          background: rgba(0, 0, 0, 0.85);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-soft);
          box-shadow: 0 8px 30px rgba(34, 197, 94, 0.18);
          position: relative;
          overflow: hidden;
        }

        :global(.zephron-landing .section-pill-dot) {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.9);
        }

        :global(.zephron-landing .section-alt-cards) {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        :global(.zephron-landing .section-alt-card) {
          min-width: 180px;
          max-width: 260px;
          border-radius: 18px;
          border: 1px solid rgba(34, 197, 94, 0.4);
          background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), rgba(0, 0, 0, 0.98));
          padding: 14px 16px 16px;
          font-size: 12px;
          color: var(--muted);
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.6),
            0 12px 40px rgba(34, 197, 94, 0.18);
          position: relative;
          overflow: hidden;
        }

        :global(.zephron-landing .section-alt-card-label) {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 6px;
          color: var(--accent-soft);
        }

        :global(.zephron-landing .section::before),
        :global(.zephron-landing .section-alt::before) {
          content: "";
          position: absolute;
          inset: -40px;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.16;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          60% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes beamShift {
          0% {
            transform: translateX(-6%);
          }
          100% {
            transform: translateX(6%);
          }
        }

        @keyframes floatPulse {
          0% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(34, 197, 94, 0);
          }
          100% {
            transform: translateY(-6px);
            box-shadow: 0 0 26px rgba(34, 197, 94, 0.4);
          }
        }

        :global(.zephron-landing .section-pill:nth-child(1)),
        :global(.zephron-landing .section-alt-card:nth-child(1)) {
          animation: floatPulse 7s ease-in-out infinite alternate;
        }

        :global(.zephron-landing .section-pill:nth-child(2)),
        :global(.zephron-landing .section-alt-card:nth-child(2)) {
          animation: floatPulse 7s ease-in-out 0.9s infinite alternate;
        }

        :global(.zephron-landing .section-pill:nth-child(3)),
        :global(.zephron-landing .section-alt-card:nth-child(3)) {
          animation: floatPulse 7s ease-in-out 1.8s infinite alternate;
        }

        :global(.zephron-landing .footer) {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          background: #050505;
          font-size: 11px;
          color: var(--muted);
        }

        :global(.zephron-landing .footer-inner) {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
        }

        :global(.zephron-landing a.link) {
          color: var(--muted);
          text-decoration: none;
        }

        :global(.zephron-landing a.link:hover) {
          color: var(--text);
        }

        :global(.zephron-landing .bootloader) {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, #020b06 0, #000000 60%);
          color: #e5e7eb;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          font-size: 12px;
          line-height: 1.4;
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }

        :global(.zephron-landing .bootloader-hidden) {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        :global(.zephron-landing .bootloader-logo) {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 11px;
          color: #9ca3af;
        }

        :global(.zephron-landing .bootloader-logo-mark) {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 0%, #22c55e40, #020617f0);
        }

        :global(.zephron-landing .bootloader-logo-dot) {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: conic-gradient(from 210deg, #22c55e, #16a34a, #22c55e);
        }

        :global(.zephron-landing .bootloader-log) {
          width: 100%;
          max-width: 520px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.7);
          background: rgba(0, 0, 0, 0.96);
          box-shadow: 0 0 80px rgba(21, 128, 61, 0.9);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
          color: #bbf7d0;
          max-height: 180px;
          overflow: hidden;
        }

        :global(.zephron-landing .bootloader-log-line) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :global(.zephron-landing .bootloader-progress) {
          margin-top: 16px;
          width: 220px;
          height: 3px;
          border-radius: 999px;
          background: #011409;
          overflow: hidden;
        }

        :global(.zephron-landing .bootloader-progress-bar) {
          height: 100%;
          width: 0;
          background: linear-gradient(to right, #22c55e, #16a34a);
          transition: width 0.35s ease-out;
        }

        :global(.zephron-landing .bootloader-hint) {
          margin-top: 14px;
          font-size: 11px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
