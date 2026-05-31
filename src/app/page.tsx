"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Count-up ──────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", prefix = "", duration = 2200 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav>
      <a className="nav-logo" href="#home">KB</a>
      <ul className="nav-links">
        {[["OSS","#oss"],["Experience","#experience"],["Case Studies","#case-studies"],["Systems","#systems"],["Writing","#writing"],["Contact","#contact"]].map(([l,h])=>(
          <li key={l}><a href={h}>{l}</a></li>
        ))}
      </ul>
    </nav>
  );
}

// ── Event Stream (hero right) ─────────────────────────────────────────────────
function EventStream() {
  const events = [
    { label: "FAULT INJECTED",    color: "#EF4444", icon: "⚡" },
    { label: "ANOMALY DETECTED",  color: "#F59E0B", icon: "◉" },
    { label: "REPRODUCED",        color: "#818CF8", icon: "↩" },
    { label: "ROOT CAUSE FOUND",  color: "#38BDF8", icon: "🔍" },
    { label: "RELEASE BLOCKED",   color: "#22C55E", icon: "🛡" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % events.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden", animation: "glow-blue 4s ease infinite" }}>
      {/* Terminal bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: 8, letterSpacing: ".08em" }}>reliability-pipeline.go</span>
        <span style={{ marginLeft: "auto" }} className="pill pill-green"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", animation: "pulse-dot 1.4s infinite" }} />LIVE</span>
      </div>

      {events.map((ev, i) => (
        <div key={i}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8,
            background: active === i ? `${ev.color}14` : "transparent",
            border: `1px solid ${active === i ? ev.color + "44" : "transparent"}`,
            transition: "all 0.4s ease",
          }}>
            <span style={{ fontSize: 15, width: 22, textAlign: "center", flexShrink: 0 }}>{ev.icon}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: active === i ? ev.color : "var(--text-muted)", letterSpacing: ".1em", transition: "color .4s" }}>{ev.label}</span>
            {active === i && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: ev.color, animation: "pulse-dot 1s infinite" }} />}
          </div>
          {i < events.length - 1 && (
            <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
              <div style={{ width: 1, height: 10, background: active > i ? events[i+1].color + "66" : "var(--border)", transition: "background .5s" }} />
            </div>
          )}
        </div>
      ))}

      {/* Mini proof strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        {[["4","Temporal PRs"],["0.0%","Dup Commits"],["1,500+","Fault Scenarios"],["Meta PE","Fellow"]].map(([v,l])=>(
          <div key={l} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--blue)", lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 4, letterSpacing: ".06em" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 58, position: "relative", overflow: "hidden" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.55 }} />
      {/* Radial glow */}
      <div style={{ position: "absolute", top: "15%", left: "20%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,.06) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,.04) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "58% 42%", gap: 48, alignItems: "center", minHeight: "calc(100vh - 58px)", paddingBottom: 60 }}>

          {/* LEFT */}
          <div style={{ animation: "slide-up .9s ease both" }}>
            <div style={{ marginBottom: 24 }}>
              <span className="pill pill-blue">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--blue)", animation: "pulse-dot 1.5s infinite" }} />
                Available for roles
              </span>
            </div>

            {/* GIANT headline */}
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 8vw, 110px)",
              fontWeight: 800,
              lineHeight: .95,
              letterSpacing: "-.03em",
              color: "var(--text-primary)",
              marginBottom: 32,
            }}>
              BUILDING<br />
              SYSTEMS<br />
              THAT FAIL<br />
              <span style={{ color: "var(--red)" }}>LOUDLY</span>.
            </h1>

            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: ".12em", marginBottom: 12, textTransform: "uppercase" }}>
              Kriti Behl — Correctness, Reliability & Infrastructure Engineer
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
              {["Distributed Systems","Reliability Engineering","AI Infrastructure","Open Source Go"].map(t => (
                <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", padding: "3px 9px", border: "1px solid var(--border)", borderRadius: 4 }}>{t}</span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="#case-studies" className="btn btn-primary">Explore My Work →</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-outline">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn btn-outline">LinkedIn</a>
            </div>

            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                MS CS @ University of Florida · 4 merged Temporal Go SDK PRs · Meta PE Fellow
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ animation: "fade-in 1.3s ease both" }}>
            <EventStream />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SYSTEMS PROOF WALL ────────────────────────────────────────────────────────
function ProofWall() {
  const stats = [
    { target: 4,      suffix: "",     prefix: "",  label: "Merged OSS PRs",      sub: "Temporal Go SDK",           color: "var(--blue)" },
    { target: 1500,   suffix: "+",    prefix: "",  label: "Fault Scenarios",     sub: "Faultline validation",      color: "var(--indigo)" },
    { target: 10000,  suffix: "+",    prefix: "",  label: "Trace Validations",   sub: "DetTrace diagnostics",      color: "var(--green)" },
    { target: 100000, suffix: "+",    prefix: "",  label: "HSM Records / Run",   sub: "Thales backend",            color: "var(--amber)" },
    { target: 0,      suffix: ".0%",  prefix: "",  label: "Duplicate Commits",   sub: "Correctness proof",         color: "var(--green)", override: "0.0%" },
    { target: 608,    suffix: "%",    prefix: "+", label: "p95 Regression Blocked", sub: "KubePulse release gate", color: "var(--red)" },
  ];

  return (
    <section style={{ background: "var(--bg-section)", padding: "72px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: "center", display: "flex" }}>External Verification</div>
          <h2 className="section-title" style={{ textAlign: "center", fontSize: "clamp(32px,4vw,44px)" }}>Systems Proof Wall</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {stats.map((s, i) => (
            <div key={i} className="reveal" style={{
              padding: "44px 36px",
              background: i % 2 === 0 ? "var(--card)" : "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: i === 0 ? "12px 0 0 0" : i === 2 ? "0 12px 0 0" : i === 3 ? "0 0 0 12px" : i === 5 ? "0 0 12px 0" : "0",
              position: "relative", overflow: "hidden",
              animationDelay: `${i * .08}s`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px,6vw,72px)",
                fontWeight: 800,
                color: s.color,
                lineHeight: 1,
                marginBottom: 10,
              }}>
                {s.override ? s.override : <CountUp target={s.target} suffix={s.suffix} prefix={s.prefix} />}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".06em" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── OPEN SOURCE ───────────────────────────────────────────────────────────────
function OpenSourceSection() {
  const prs = [
    { num: "#2298", title: "Async future chaining", desc: "Fixed ready futures that could still block callers in async execution paths.", tags: ["async","futures","Go"] },
    { num: "#2212", title: "Workflow mock context propagation", desc: "Made mock execution observe correctly propagated headers.", tags: ["mocks","context","headers"] },
    { num: "#2200", title: "Child workflow goroutine leak", desc: "Closed blocked doneChannel path; added regression test.", tags: ["goroutines","leak","concurrency"] },
    { num: "#2248", title: "Poller type assignment", desc: "Restored sticky/non-sticky task poller distinction.", tags: ["poller","task-queue"] },
  ];

  return (
    <section id="oss">
      <div className="container">
        <div className="reveal">
          <div className="section-label">External Contribution</div>
          <h2 className="section-title">Open Source Impact</h2>
          <p className="section-subtitle" style={{ marginBottom: 52 }}>Maintainer-reviewed fixes in production workflow infrastructure.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* Left: context */}
          <div className="reveal">
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(129,140,248,.12)", border: "1px solid rgba(129,140,248,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚙</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20 }}>Temporal Go SDK</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>temporalio/sdk-go</div>
                </div>
                <span className="badge-merged" style={{ marginLeft: "auto", fontSize: 11, padding: "4px 12px" }}>4 MERGED</span>
              </div>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                4 merged PRs across async execution, workflow mocks, goroutine safety, and poller behavior — all reviewed by Temporal core maintainers.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Go","Goroutines","Workflow Mocks","Async Execution","Concurrency"].map(t=>(
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 3 }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: "rgba(56,189,248,.08)", border: "1px solid rgba(56,189,248,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>☁</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>Azure SDK for Go</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>Azure/azure-sdk-for-go</div>
                </div>
                <span className="pill pill-blue" style={{ marginLeft: "auto" }}>2 IN REVIEW</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Transport error surfacing","W3C Trace Context propagation"].map(p=>(
                  <span key={p} style={{ fontSize: 12, color: "var(--text-muted)", padding: "4px 10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: PR wall */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {prs.map((pr, i) => (
              <div key={i} style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px",
                transition: "border-color .2s, transform .2s", cursor: "default",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(129,140,248,.4)"; e.currentTarget.style.transform="translateX(4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateX(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--indigo)", fontWeight: 700 }}>temporal {pr.num}</span>
                  <span className="badge-merged">● MERGED</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", marginBottom: 5 }}>{pr.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{pr.desc}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {pr.tags.map(t=><span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", padding: "1px 6px", border: "1px solid var(--border)", borderRadius: 3 }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── EXPERIENCE (timeline) ─────────────────────────────────────────────────────
function ExperienceSection() {
  const jobs = [
    {
      year: "2026", company: "Meta Production Engineering Fellowship", role: "SRE Track · MLH Fellowship",
      color: "var(--indigo)", status: "FELLOWSHIP",
      bullets: ["Production infrastructure, Linux reliability engineering, incident response, and platform operations."],
      tags: ["SRE","Linux","Production Engineering","Incident Response"],
    },
    {
      year: "2025–Now", company: "Cheenti Digital LLC", role: "Software Engineer",
      color: "var(--green)", status: "ACTIVE",
      bullets: [
        "Built FastAPI/Redis workflow tooling processing 3,000+ weekly reporting events across AI-assisted SEO and analytics workflows.",
        "Developed AI output validation with Pydantic/JSON Schema checks, audit logs, retry-state tracking, and human-review gates.",
      ],
      tags: ["FastAPI","Redis","Python","Pydantic","AI Validation"],
    },
    {
      year: "Jun–Aug 2025", company: "Thales Group", role: "DevSecOps Intern",
      color: "var(--blue)", status: "COMPLETED",
      metric: { value: "100k+", label: "state-transition records/run" },
      bullets: [
        "Built Python/PostgreSQL backend processing ~100k HSM state-transition records per run.",
        "Replaced frontend state computation with deterministic backend state engine exposing queue depth, utilization, idle/recovery, and efficiency metrics.",
      ],
      tags: ["Python","PostgreSQL","HSM","State Machines","DevSecOps"],
    },
  ];

  return (
    <section id="experience" style={{ background: "var(--bg-section)" }}>
      <div className="container">
        <div className="reveal">
          <div className="section-label">Where I've Shipped</div>
          <h2 className="section-title">Experience</h2>
        </div>

        <div style={{ position: "relative", marginTop: 56, paddingLeft: 32 }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 1, background: "linear-gradient(to bottom, var(--blue), var(--indigo), transparent)" }} />

          {jobs.map((job, i) => (
            <div key={i} className="reveal" style={{ position: "relative", marginBottom: 36, animationDelay: `${i*.1}s` }}>
              {/* Dot */}
              <div style={{ position: "absolute", left: -36, top: 24, width: 10, height: 10, borderRadius: "50%", background: job.color, border: `2px solid var(--bg-section)`, boxShadow: `0 0 12px ${job.color}88` }} />
              {/* Year */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".1em", marginBottom: 10 }}>{job.year}</div>

              <div className="card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22 }}>{job.company}</div>
                      <span className="pill" style={{ background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}33`, fontSize: 9, letterSpacing: ".08em" }}>{job.status}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>{job.role}</div>
                  </div>
                  {job.metric && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(56,189,248,.06)", border: "1px solid rgba(56,189,248,.12)", borderRadius: 8, padding: "10px 16px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--blue)" }}>{job.metric.value}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", maxWidth: 100, lineHeight: 1.4 }}>{job.metric.label}</span>
                    </div>
                  )}
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {job.bullets.map((b,bi)=>(
                    <li key={bi} style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      <span style={{ color: job.color, flexShrink: 0, marginTop: 3 }}>→</span>{b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {job.tags.map(t=><span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 3 }}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAULTLINE ─────────────────────────────────────────────────────────────────
function FaultlineViz() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 900); return () => clearInterval(id); }, []);
  const validStep = tick % 6;
  const staleBlocked = tick % 6 === 5;

  const validSteps = ["Worker claims job","Lease assigned","Fencing token issued","Worker commits","PostgreSQL validates"];
  const staleSteps = ["Stale worker active","Lease expired","Token invalidated","Stale write attempt"];

  return (
    <div>
      {/* Benchmark bar */}
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", marginBottom: 12 }}>DUPLICATE COMMITS — NAIVE vs FAULTLINE</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Naive system</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--red)" }}>8.3%</span>
          </div>
          <div style={{ height: 8, background: "var(--border)", borderRadius: 4 }}>
            <div style={{ width: "83%", height: "100%", background: "var(--red)", borderRadius: 4 }} />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Faultline</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", fontWeight: 700 }}>0.0%</span>
          </div>
          <div style={{ height: 8, background: "var(--border)", borderRadius: 4 }}>
            <div style={{ width: "1%", height: "100%", background: "var(--green)", borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* Live paths */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--green)", letterSpacing: ".12em", marginBottom: 12 }}>▶ VALID PATH</div>
          {validSteps.map((s,i)=>(
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", borderRadius: 5, background: validStep > i ? "rgba(34,197,94,.07)" : "transparent", transition: "background .3s" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: validStep > i ? "var(--green)" : "var(--border)", transition: "background .3s", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: validStep > i ? "var(--text-secondary)" : "var(--text-muted)" }}>{s}</span>
              </div>
              {i < validSteps.length - 1 && <div style={{ width: 1, height: 5, background: "var(--border)", margin: "0 0 0 11px" }} />}
            </div>
          ))}
          <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: 5, background: validStep >= 5 ? "rgba(34,197,94,.12)" : "rgba(34,197,94,.03)", border: `1px solid ${validStep >= 5 ? "rgba(34,197,94,.35)" : "rgba(34,197,94,.1)"}`, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", textAlign: "center", fontWeight: 700, transition: "all .3s" }}>ACCEPTED</div>
        </div>

        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--red)", letterSpacing: ".12em", marginBottom: 12 }}>✕ STALE WORKER</div>
          {staleSteps.map((s,i)=>(
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", borderRadius: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(239,68,68,.4)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{s}</span>
              </div>
              {i < staleSteps.length - 1 && <div style={{ width: 1, height: 5, background: "var(--border)", margin: "0 0 0 11px" }} />}
            </div>
          ))}
          <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: 5, background: staleBlocked ? "rgba(239,68,68,.15)" : "rgba(239,68,68,.04)", border: `1px solid ${staleBlocked ? "rgba(239,68,68,.5)" : "rgba(239,68,68,.15)"}`, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--red)", textAlign: "center", fontWeight: 700, animation: staleBlocked ? "glow-red 1s infinite" : "none", transition: "all .3s" }}>WRITE REJECTED</div>
        </div>
      </div>
    </div>
  );
}

// ── KUBEPULSE VIZ ─────────────────────────────────────────────────────────────
function KubePulseViz() {
  const [phase, setPhase] = useState<"ok"|"spiking"|"blocked">("ok");
  useEffect(() => {
    const sequence = () => {
      setPhase("ok");
      setTimeout(() => setPhase("spiking"), 1500);
      setTimeout(() => setPhase("blocked"), 3000);
      setTimeout(sequence, 6000);
    };
    sequence();
  }, []);

  // Sparkline data
  const baseline = [12,14,13,15,14,13,16,14,15,13,14];
  const spike =    [12,14,13,15,14,13,16,54,89,96,102];

  const points = (data: number[], w: number, h: number) =>
    data.map((v,i) => `${(i/(data.length-1))*w},${h - (v/110)*h}`).join(" ");

  return (
    <div>
      {/* Big decision badge */}
      <div style={{
        background: phase === "blocked" ? "rgba(239,68,68,.08)" : phase === "spiking" ? "rgba(245,158,11,.06)" : "rgba(34,197,94,.06)",
        border: `1px solid ${phase === "blocked" ? "rgba(239,68,68,.4)" : phase === "spiking" ? "rgba(245,158,11,.3)" : "rgba(34,197,94,.2)"}`,
        borderRadius: 12, padding: "20px", marginBottom: 14, textAlign: "center",
        animation: phase === "blocked" ? "glow-red 2s infinite" : "none",
        transition: "all .5s",
      }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>RELEASE #428</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 800, color: phase === "blocked" ? "var(--red)" : phase === "spiking" ? "var(--amber)" : "var(--green)", lineHeight: 1, transition: "color .5s" }}>
          {phase === "blocked" ? "BLOCK" : phase === "spiking" ? "WARN" : "SHIP"}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
          {phase === "blocked" ? "safe_to_operate=false" : phase === "spiking" ? "p95 drift detected" : "all signals nominal"}
        </div>
      </div>

      {/* Latency graph */}
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>p95 LATENCY (ms)</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: phase === "blocked" ? "var(--red)" : "var(--text-muted)" }}>
            {phase === "blocked" ? "+608% ↑" : phase === "spiking" ? "rising…" : "nominal"}
          </span>
        </div>
        <svg viewBox="0 0 200 48" style={{ width: "100%", height: 48 }}>
          <polyline points={points(baseline, 200, 48)} fill="none" stroke="rgba(34,197,94,.4)" strokeWidth="1.5" />
          {phase !== "ok" && <polyline points={points(spike, 200, 48)} fill="none" stroke={phase === "blocked" ? "var(--red)" : "var(--amber)"} strokeWidth="2" style={{ transition: "stroke 0.5s" }} />}
        </svg>
      </div>

      {/* Health grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Readiness Probe", value: "GREEN", color: "var(--green)" },
          { label: "Latency p95", value: phase === "blocked" ? "+608% ↑" : phase === "spiking" ? "RISING" : "OK", color: phase !== "ok" ? "var(--red)" : "var(--green)" },
          { label: "Dep Health", value: phase === "blocked" ? "DEGRADED" : "OK", color: phase === "blocked" ? "var(--amber)" : "var(--green)" },
          { label: "Gate Decision", value: phase === "blocked" ? "BLOCK" : phase === "spiking" ? "WARN" : "SHIP", color: phase === "blocked" ? "var(--red)" : phase === "spiking" ? "var(--amber)" : "var(--green)" },
        ].map(h=>(
          <div key={h.label} style={{ background: "var(--bg)", border: `1px solid ${h.color === "var(--red)" ? "rgba(239,68,68,.25)" : "var(--border)"}`, borderRadius: 7, padding: "10px 12px", transition: "border-color .4s" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: ".08em", marginBottom: 3 }}>{h.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: h.color, transition: "color .4s" }}>{h.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FAIREVAL VIZ ──────────────────────────────────────────────────────────────
function FairEvalViz() {
  const models = [
    { name: "Claude 3.5", score: 0.91, d: "SHIP" },
    { name: "GPT-4o",     score: 0.85, d: "SHIP" },
    { name: "Gemini Flash", score: 0.68, d: "BLOCK" },
  ];
  const risks = ["Hallucination Risk","Instruction Failure","Groundedness","Safety Gate","Regression p=0.0"];

  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", marginBottom: 12 }}>EVALUATION LEADERBOARD</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {models.map(m=>(
          <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--bg)", border: `1px solid ${m.d === "BLOCK" ? "rgba(239,68,68,.3)" : "var(--border)"}`, borderRadius: 8, animation: m.d === "BLOCK" ? "glow-red 3s infinite" : "none" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, width: 110, color: "var(--text-primary)" }}>{m.name}</span>
            <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 3 }}>
              <div style={{ width: `${m.score*100}%`, height: "100%", borderRadius: 3, background: m.d === "BLOCK" ? "var(--red)" : "var(--green)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, width: 34, color: m.d === "BLOCK" ? "var(--red)" : "var(--green)", fontWeight: 700 }}>{m.score.toFixed(2)}</span>
            <span className={m.d === "BLOCK" ? "badge-block" : "badge-ship"} style={{ fontSize: 9, padding: "2px 7px" }}>{m.d}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", marginBottom: 10 }}>RESPONSIBLE AI GATE</div>
        {risks.map(r=>(
          <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{r}</span>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.includes("Risk") || r.includes("Failure") ? "var(--red)" : "var(--green)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AGENTGRID VIZ ─────────────────────────────────────────────────────────────
function AgentGridViz() {
  const [active, setActive] = useState(0);
  const nodes = ["Request","Retrieve context","Agent decision","Tool call","Eval gate","Route outcome"];
  const routes = [
    { c: "Context retrieved", a: "→ SHIP", col: "var(--green)" },
    { c: "Missing context",   a: "→ HOLD", col: "var(--amber)" },
    { c: "Unsafe answer",     a: "→ ESCALATE", col: "var(--red)" },
    { c: "Tool failure",      a: "→ RETRY", col: "var(--blue)" },
  ];
  useEffect(() => { const id = setInterval(() => setActive(a=>(a+1)%nodes.length), 1000); return () => clearInterval(id); }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", marginBottom: 10 }}>WORKFLOW GRAPH</div>
        {nodes.map((n,i)=>(
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, background: active===i ? "rgba(56,189,248,.08)" : "transparent", border: `1px solid ${active===i ? "rgba(56,189,248,.3)" : "transparent"}`, transition: "all .3s" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: active===i ? "var(--blue)" : "var(--border)", boxShadow: active===i ? "0 0 8px var(--blue)" : "none", transition: "all .3s", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: active===i ? "var(--text-primary)" : "var(--text-muted)", transition: "color .3s" }}>{n}</span>
            </div>
            {i < nodes.length-1 && <div style={{ width: 1, height: 5, background: "var(--border)", margin: "1px 0 1px 13px" }} />}
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".1em", marginBottom: 10 }}>ROUTING</div>
        {routes.map(r=>(
          <div key={r.c} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 5, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)" }}>{r.c}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: r.col }}>{r.a}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--green)" }}>48</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>passing tests</div>
        </div>
      </div>
    </div>
  );
}

// ── CASE STUDY CARD ───────────────────────────────────────────────────────────
function CaseStudy({ num, name, tagline, pill, pillClass, problem, built, metrics, tags, viz, accent }:
  { num: string; name: string; tagline: string; pill: string; pillClass: string; problem: string; built: string; metrics: {v:string;l:string}[]; tags: string[]; viz: React.ReactNode; accent: string }) {
  return (
    <div className="reveal" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", marginBottom: 28, position: "relative" }}>
      {/* Top accent line */}
      <div style={{ height: 3, background: accent }} />

      <div style={{ padding: "28px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: "-.02em" }}>{name}</h3>
            <span className={`pill ${pillClass}`} style={{ fontSize: 10 }}>{pill}</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>{tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {metrics.map(m=>(
            <div key={m.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1 }}>{m.v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: ".06em", marginTop: 3 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* Left: prose */}
        <div style={{ padding: "28px 32px", borderRight: "1px solid var(--border)" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--red)", letterSpacing: ".12em", marginBottom: 8 }}>PROBLEM</div>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75 }}>{problem}</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--blue)", letterSpacing: ".12em", marginBottom: 8 }}>BUILT</div>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75 }}>{built}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
            {tags.map(t=><span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 3 }}>{t}</span>)}
          </div>
        </div>
        {/* Right: viz */}
        <div style={{ padding: "28px 32px" }}>{viz}</div>
      </div>
    </div>
  );
}

function CaseStudiesSection() {
  return (
    <section id="case-studies">
      <div className="container">
        <div className="reveal">
          <div className="section-label">Product-Quality Engineering</div>
          <h2 className="section-title">Engineering Case Studies</h2>
          <p className="section-subtitle" style={{ marginBottom: 56 }}>Each system proves one thesis: correctness and reliability aren't accidents.</p>
        </div>

        <CaseStudy
          num="01" name="Faultline" tagline="Distributed correctness under failure"
          pill="CASE STUDY 01" pillClass="pill-green"
          problem="Stale workers can commit outdated results after lease takeover, causing duplicate work and data corruption in distributed job queues."
          built="PostgreSQL-backed fencing-token execution system with fault injection, reconciliation, invariant validation, and Prometheus observability."
          metrics={[{v:"0.0%",l:"Dup Commits"},{v:"1,500+",l:"Fault Scenarios"},{v:"0",l:"Invariants Violated"}]}
          tags={["Distributed Systems","PostgreSQL","Concurrency","Fault Injection","Fencing Tokens","Prometheus","Go"]}
          accent="var(--green)"
          viz={<FaultlineViz />}
        />

        <CaseStudy
          num="02" name="KubePulse" tagline="Release gates for systems that look healthy but are not"
          pill="CASE STUDY 02" pillClass="pill-amber"
          problem="Kubernetes readiness probes can stay green while latency spikes, dependencies degrade, and users experience real failures."
          built="Release-safety gate using latency drift, dependency health scoring, network diagnostics, and automated SHIP/BLOCK decisions."
          metrics={[{v:"+608%",l:"p95 Blocked"},{v:"+333%",l:"p95 Drift Caught"},{v:"false",l:"safe_to_operate"}]}
          tags={["Kubernetes","SRE","Release Safety","CI/CD","Canary Analysis","Prometheus"]}
          accent="var(--amber)"
          viz={<KubePulseViz />}
        />

        <CaseStudy
          num="03" name="FairEval" tagline="AI release governance for silent model regressions"
          pill="CASE STUDY 03" pillClass="pill-indigo"
          problem="GenAI regressions often ship silently: unsupported claims, hallucinated facts, safety failures, and latency regressions."
          built="LLM evaluation and release-governance platform with RAG groundedness, Responsible AI gates, statistical regression checks, and SHIP/BLOCK decisions."
          metrics={[{v:"BLOCK",l:"Gemini Flash"},{v:"p=0.0",l:"Regression Signal"},{v:"RAI",l:"Gate Active"}]}
          tags={["AI Evaluation","ML Infrastructure","Responsible AI","RAG","Statistical Testing","Python"]}
          accent="var(--indigo)"
          viz={<FairEvalViz />}
        />

        <CaseStudy
          num="04" name="AgentGrid" tagline="Agent workflows that route, validate, and escalate"
          pill="CASE STUDY 04" pillClass="pill-blue"
          problem="AI workflows fail when retrieval misses, tool calls break, or unsupported answers ship without escalation."
          built="Agent workflow platform with retrieval, tool calls, evaluation gates, decision routing, and escalation paths across 48 test scenarios."
          metrics={[{v:"48",l:"Passing Tests"},{v:"0",l:"Unsafe Ships"},{v:"4",l:"Route Types"}]}
          tags={["LangGraph","RAG","Tool Calling","Workflow Orchestration","Evaluation","Python"]}
          accent="var(--blue)"
          viz={<AgentGridViz />}
        />
      </div>
    </section>
  );
}

// ── SYSTEMS DEPTH ─────────────────────────────────────────────────────────────
function SystemsSection() {
  const cards = [
    { name: "DetTrace", tagline: "Replay diagnostics and first-divergence isolation", color: "var(--blue)",
      proof: [{v:"Index 3",l:"Divergence Isolated"},{v:"1.0",l:"Replay Confidence"}],
      tags: ["C++17","Replay","Concurrency","Diagnostics"] },
    { name: "AccelSim-Lite", tagline: "C++ runtime and bottleneck validation", color: "var(--indigo)",
      proof: [{v:"25.65×",l:"Pointer Slowdown"},{v:"2.4×",l:"Mem Degradation"}],
      tags: ["C++17","CMake","GoogleTest","Cache Locality"] },
    { name: "AutoOps-Insight", tagline: "CI failure intelligence and incident clustering", color: "var(--amber)",
      proof: [{v:"102",l:"Incidents Tracked"},{v:"0.91",l:"Failure Confidence"}],
      tags: ["FastAPI","PostgreSQL","SQL Analytics"] },
  ];

  return (
    <section id="systems" style={{ background: "var(--bg-section)" }}>
      <div className="container">
        <div className="reveal">
          <div className="section-label">Systems Depth</div>
          <h2 className="section-title">Deep Systems Work</h2>
          <p className="section-subtitle" style={{ marginBottom: 52 }}>Supporting work demonstrating systems depth below the flagship case studies.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {cards.map((c,i)=>(
            <div key={i} className="reveal card" style={{ animationDelay: `${i*.1}s` }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: c.color, marginBottom: 16 }} />
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>{c.tagline}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {c.proof.map(p=>(
                  <div key={p.l} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 7, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: c.color }}>{p.v}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{p.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {c.tags.map(t=><span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", padding: "2px 6px", border: "1px solid var(--border)", borderRadius: 3 }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SURFACE AREA ──────────────────────────────────────────────────────────────
function SurfaceAreaSection() {
  const [hov, setHov] = useState<number|null>(null);
  const clusters = [
    { name: "Distributed Systems", color: "var(--blue)",   items: ["Faultline","Temporal OSS","PostgreSQL","Workflow Correctness"] },
    { name: "Reliability Eng",     color: "var(--green)",  items: ["KubePulse","AutoOps","Prometheus","Release Gates"] },
    { name: "AI Infrastructure",   color: "var(--indigo)", items: ["FairEval","AgentGrid","RAG Evaluation","Responsible AI"] },
    { name: "Systems & Runtime",   color: "var(--amber)",  items: ["DetTrace","AccelSim-Lite","C++17","Runtime Validation"] },
    { name: "Cloud & Platform",    color: "var(--blue)",   items: ["Cloud Run","Kubernetes","Terraform","CI/CD"] },
    { name: "Networking",          color: "var(--green)",  items: ["NetRouteLab","DNS","TCP","TLS"] },
    { name: "Hardware-Adjacent",   color: "var(--amber)",  items: ["HSM Analytics","UART/SPI/I2C","Instrument Validation"] },
    { name: "Open Source",         color: "var(--indigo)", items: ["Temporal","Azure SDK","Go"] },
  ];

  return (
    <section id="surface">
      <div className="container">
        <div className="reveal">
          <div className="section-label">Breadth with Identity</div>
          <h2 className="section-title">Engineering Surface Area</h2>
          <p className="section-subtitle" style={{ marginBottom: 52 }}>One identity, broad systems coverage.</p>
        </div>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "16px 40px", background: "var(--card)", border: "1px solid rgba(56,189,248,.4)", borderRadius: 12, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--blue)", animation: "glow-blue 3s infinite" }}>
            Correctness Under Failure
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {clusters.map((c,i)=>(
            <div key={i} className="reveal card" style={{ cursor: "default", borderColor: hov===i ? c.color+"55" : "var(--border)", animationDelay: `${i*.06}s` }}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: c.color, letterSpacing: ".08em", marginBottom: 12 }}>{c.name}</div>
              {c.items.map(it=>(
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)", marginBottom: 5 }}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.color, flexShrink: 0 }} />{it}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ────────────────────────────────────────────────────────────────────
function SkillsSection() {
  const groups = [
    { label: "Build",   color: "var(--blue)",   skills: ["Python","Go","FastAPI","PostgreSQL","Redis","REST","React","TypeScript"] },
    { label: "Validate",color: "var(--green)",  skills: ["pytest","GoogleTest","CI Gates","Schema Checks","Fault Injection","Pydantic"] },
    { label: "Observe", color: "var(--amber)",  skills: ["Prometheus","Grafana","OpenTelemetry","Logs","Traces","Alerting"] },
    { label: "Operate", color: "var(--indigo)", skills: ["Docker","Kubernetes","Terraform","GitHub Actions","Cloud Run","Linux"] },
    { label: "Reason",  color: "var(--red)",    skills: ["Distributed Systems","Release Safety","AI Evaluation","Failure Modes"] },
    { label: "Systems", color: "var(--blue)",   skills: ["C++17","CMake","Deterministic Replay","Perf Analysis","Cache Locality"] },
  ];

  return (
    <section style={{ background: "var(--bg-section)" }}>
      <div className="container">
        <div className="reveal">
          <div className="section-label">Technical Breadth</div>
          <h2 className="section-title">Skills Map</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 48 }}>
          {groups.map((g,i)=>(
            <div key={i} className="reveal card" style={{ animationDelay: `${i*.07}s` }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: g.color, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 2, background: g.color, display: "inline-block", borderRadius: 1 }} />{g.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {g.skills.map(s=>(
                  <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", padding: "4px 10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, cursor: "default", transition: "all .2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=g.color;e.currentTarget.style.color=g.color;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-secondary)";}}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WRITING ───────────────────────────────────────────────────────────────────
function WritingSection() {
  const articles = [
    { title: "How I Built a Distributed Job Queue That Stays Correct Under Crashes", takeaway: "Exactly-once-style correctness needs fencing, validation, and failure injection.", tag: "Distributed Systems", color: "var(--blue)" },
    { title: "Detecting Silent Regressions in GenAI Systems at Scale", takeaway: "AI evaluation should behave like release-safety infrastructure.", tag: "AI Infrastructure", color: "var(--indigo)" },
    { title: "I Thought I Built Observability. Then an Incident Proved I Didn't.", takeaway: "Green dashboards are not the same as operational truth.", tag: "SRE / Observability", color: "var(--amber)" },
  ];

  return (
    <section id="writing">
      <div className="container">
        <div className="reveal">
          <div className="section-label">Engineering Writing</div>
          <h2 className="section-title">Writing</h2>
          <p className="section-subtitle" style={{ marginBottom: 52 }}>Technical articles from production experience.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {articles.map((a,i)=>(
            <div key={i} className="reveal card" style={{ cursor: "pointer", position: "relative", overflow: "hidden", animationDelay: `${i*.1}s`, transition: "all .25s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color+"55";e.currentTarget.style.transform="translateY(-5px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.color }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: a.color, letterSpacing: ".1em", display: "block", marginBottom: 12 }}>{a.tag}</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 12 }}>{a.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 16 }}>Takeaway: {a.takeaway}</p>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: a.color }}>Read →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LOGO WALL ─────────────────────────────────────────────────────────────────
function LogoWall() {
  const logos = ["Temporal","Azure","Meta","MLH","Rewriting the Code","McKinsey","University of Florida","Thales","GitHub","Hugging Face"];
  return (
    <section style={{ background: "var(--bg-section)", padding: "64px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="section-label" style={{ justifyContent: "center", display: "flex" }}>Trusted Networks</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          {logos.map(l=>(
            <div key={l} style={{
              padding: "10px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
              fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
              color: "var(--text-muted)", letterSpacing: ".06em",
              transition: "all .2s", cursor: "default",
            }}
              onMouseEnter={e=>{e.currentTarget.style.color="var(--blue)";e.currentTarget.style.borderColor="rgba(56,189,248,.3)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="var(--text-muted)";e.currentTarget.style.borderColor="var(--border)";}}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROGRAMS ──────────────────────────────────────────────────────────────────
function ProgramsSection() {
  const items = [
    { name: "Meta Production Engineering Fellowship", sub: "MLH · SRE Track · 2026", icon: "◈", color: "var(--indigo)" },
    { name: "Rewriting the Code", sub: "Women in Tech · 2026", icon: "◇", color: "var(--blue)" },
    { name: "McKinsey Forward", sub: "Selected Participant · 2026", icon: "◆", color: "var(--amber)" },
    { name: "University of Florida", sub: "M.S. Computer Science · GPA 3.8", icon: "◉", color: "var(--green)" },
  ];
  return (
    <section>
      <div className="container">
        <div className="reveal">
          <div className="section-label">Affiliations</div>
          <h2 className="section-title">Programs &amp; Communities</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 48 }}>
          {items.map((p,i)=>(
            <div key={i} className="reveal card" style={{ textAlign: "center", animationDelay: `${i*.08}s` }}>
              <div style={{ fontSize: 28, marginBottom: 12, color: p.color }}>{p.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="reveal">
          <div className="section-label" style={{ justifyContent: "center", display: "flex" }}>Available Now</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 28, letterSpacing: "-.025em" }}>
            I build systems that{" "}<span style={{ color: "var(--red)" }}>fail loudly</span>,<br />
            recover{" "}<span style={{ color: "var(--green)" }}>safely</span>,<br />
            and block{" "}<span style={{ color: "var(--amber)" }}>bad releases</span>{" "}before users are impacted.
          </h2>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
            <a href="#case-studies" className="btn btn-primary">Explore My Work →</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-outline">GitHub</a>
            <a href="mailto:kriti@example.com" className="btn btn-outline">Email Me</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn btn-outline">LinkedIn</a>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 80, paddingTop: 28, borderTop: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".1em" }}>
        KRITI BEHL · CORRECTNESS, RELIABILITY &amp; INFRASTRUCTURE ENGINEER
      </div>
    </section>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function Page() {
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <ProofWall />
        <div className="line-divider" />
        <OpenSourceSection />
        <div className="line-divider" />
        <ExperienceSection />
        <div className="line-divider" />
        <CaseStudiesSection />
        <div className="line-divider" />
        <SystemsSection />
        <div className="line-divider" />
        <SurfaceAreaSection />
        <div className="line-divider" />
        <SkillsSection />
        <div className="line-divider" />
        <WritingSection />
        <LogoWall />
        <ProgramsSection />
        <ContactSection />
      </main>
    </>
  );
}