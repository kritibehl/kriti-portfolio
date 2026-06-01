"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [consoleLine, setConsoleLine] = useState(0);

  const consoleLines = [
    { text: "› FAULT INJECTED",         color: "#f59e0b" },
    { text: "› ANOMALY DETECTED",        color: "#ef4444" },
    { text: "› REPRODUCING...",          color: "#60a5fa" },
    { text: "› STALE WRITE REJECTED",    color: "#ef4444" },
    { text: "✓ RELEASE BLOCKED",         color: "#22c55e" },
    { text: "› INVARIANT CHECK PASSED",  color: "#22c55e" },
    { text: "› FENCING TOKEN VALID",     color: "#60a5fa" },
    { text: "✓ 0.0% DUPLICATE COMMITS",  color: "#22c55e" },
    { text: "› PROBE HEALTHY — IGNORED", color: "#f59e0b" },
    { text: "› p95 LATENCY +608%",       color: "#ef4444" },
    { text: "✓ SAFE_TO_OPERATE: FALSE",  color: "#ef4444" },
    { text: "✓ BLOCK RELEASE #428",      color: "#22c55e" },
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      setConsoleLine(l => (l + 1) % consoleLines.length);
    }, 1400);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pref = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function countUp(el: HTMLElement, target: number, dur = 2400) {
      if (pref) { el.textContent = target.toLocaleString(); return; }
      const s = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - s) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        countUp(el, Number(el.dataset.target));
        cObs.unobserve(el);
      });
    }, { threshold: 0.3 });
    root.querySelectorAll(".count-up").forEach((el) => cObs.observe(el));

    const rObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("vis");
        rObs.unobserve(e.target);
      });
    }, { threshold: 0.04 });
    root.querySelectorAll(".rev").forEach((el) => {
      if (pref) el.classList.add("vis");
      else rObs.observe(el);
    });

    return () => { cObs.disconnect(); rObs.disconnect(); };
  }, []);

  const filters = [
    { id: "all",      label: "All" },
    { id: "backend",  label: "Backend" },
    { id: "sre",      label: "SRE" },
    { id: "ai",       label: "AI Evaluation" },
    { id: "systems",  label: "Systems" },
  ];

  const projects = [
    {
      id: "faultline", flagship: true, lanes: ["backend", "sre"],
      title: "Faultline",
      tagline: "Distributed correctness under failure",
      problem: "Stale workers commit outdated results after lease takeover — lease expiry stops new claims, not a worker already holding a reference from writing late.",
      built: "PostgreSQL fencing-token validation via UNIQUE(job_id, fencing_token), fault-injection proxy, reconciler, 29-assertion drill suite, k6 load tests, 11 Prometheus metrics.",
      verified: "0.0% duplicate commits under 5–20% injected fault rate · 1,500+ failure scenarios · 0 invariant violations · naive baseline: 1.0–2.5%",
      tags: ["PostgreSQL","Go","Python","k6","Observability","Correctness"],
      metrics: [
        { val: "0.0%",   label: "Duplicate Commits",   color: "green" },
        { val: "1,500+", label: "Fault Scenarios",      color: "blue" },
        { val: "0",      label: "Invariant Violations", color: "green" },
      ],
      links: [["GitHub ↗","https://github.com/kritibehl/faultline"]],
      visual: "faultline",
    },
    {
      id: "kubepulse", flagship: true, lanes: ["sre", "backend"],
      title: "KubePulse",
      tagline: "Release gates for systems that look healthy but are not",
      problem: "Readiness probes report green while p95 latency spikes 600%, error rates rise, and dependency cascades degrade real traffic silently.",
      built: "Baseline-vs-degraded engine, SLO gate, probe integrity check, DNS/TCP/TLS diagnostics, dependency risk scoring, rollback recommendations — CI/CD integrable.",
      verified: "+608% p95 AMD MI300X blocked · +333% p95 drift caught with probes green · safe_to_operate=false · 0 false-safe decisions",
      tags: ["Kubernetes","CI/CD","Python","Terraform","DNS/TLS","Rollback"],
      metrics: [
        { val: "+608%", label: "p95 Regression Blocked", color: "red" },
        { val: "+333%", label: "p95 Drift Detected",     color: "amber" },
        { val: "BLOCK", label: "Safe to Operate",        color: "red" },
      ],
      links: [["GitHub ↗","https://github.com/kritibehl/KubePulse"]],
      visual: "kubepulse",
    },
    {
      id: "faireval", flagship: true, lanes: ["ai"],
      title: "FairEval",
      tagline: "AI release governance for silent model regressions",
      problem: "Most GenAI failures are silent: hallucinated facts, groundedness regressions, and latency spikes can ship unless evaluation is treated like release infrastructure.",
      built: "FastAPI eval APIs + React dashboards with RAI gates, RAG groundedness metrics, Welch t-test + chi-squared significance testing, hardware-aware serving gate, CI release gate.",
      verified: "Gemini Flash: 0.367 avg / 40% pass → BLOCK · AMD serving: p95 +47.1% → BLOCK despite quality pass · p=0.0 statistical significance · Zenodo report published",
      tags: ["PyTorch","FastAPI","React","RAG eval","Responsible AI","Statistical gating"],
      metrics: [
        { val: "p=0.0",  label: "Statistical Significance", color: "green" },
        { val: "BLOCK",  label: "AMD Serving Gate",          color: "red" },
        { val: "40%",    label: "Pass Rate → Blocked",       color: "amber" },
      ],
      links: [
        ["GitHub ↗","https://github.com/kritibehl/FairEval-Suite"],
        ["Live Demo ↗","https://huggingface.co/spaces/kriti0608/FairEval-Suite"],
        ["Zenodo ↗","https://doi.org/10.5281/zenodo.17625268"],
      ],
      visual: "faireval",
    },
    {
      id: "agentgrid", flagship: false, lanes: ["ai", "backend"],
      title: "AgentGrid + AutoOps",
      tagline: "Agent workflows that route, validate, and escalate",
      problem: "Most AI demos stop at generation. This handles what happens when AI is wrong — no structure, no escalation, no incident record.",
      built: "RAG retrieval → LangGraph workflow → MCP-style tool execution → eval gate → ship/hold/escalate → AutoOps incident ingestion. Live on Cloud Run.",
      verified: "30 passing tests · 9 ship / 10 hold / 6 escalate · 258ms p95 eval latency · 0.88 tool-call success rate · 0 unsafe shipments",
      tags: ["FastAPI","LangGraph","AI agents","Eval gates","Cloud Run"],
      metrics: [
        { val: "0",      label: "Unsafe Shipments",   color: "green" },
        { val: "0.88",   label: "Tool-Call Success",  color: "blue" },
        { val: "258ms",  label: "p95 Eval Latency",   color: "blue" },
      ],
      links: [
        ["Live Demo ↗","https://agentgrid-seven.vercel.app/"],
        ["AgentGrid ↗","https://github.com/kritibehl/agentgrid-demo"],
        ["AutoOps ↗","https://github.com/kritibehl/AutoOps-Insight"],
      ],
      visual: "agentgrid",
    },
    {
      id: "dettrace", flagship: false, lanes: ["systems"],
      title: "DetTrace",
      tagline: "Replay diagnostics — first divergence before any visible failure",
      problem: "Concurrency failures refuse to reproduce. Add a log and the bug disappears. By the time you have data, the interleaving is gone.",
      built: "C++17 deterministic replay engine, Swift actor-isolated analysis, visual trace timeline, SPI/UART/I2C-style replay diagnostics, replay explorer CLI.",
      verified: "GPIO interrupt race: first divergence at index 3 · Timer missed tick: index 1 · 1.0 confidence on repeated patterns · 10,000+ trace validations",
      tags: ["C++17","Swift","CMake","Deterministic replay","Trace analysis"],
      metrics: [
        { val: "1.0",    label: "Incident Confidence",    color: "green" },
        { val: "Idx 3",  label: "First Divergence",        color: "blue" },
        { val: "10k+",   label: "Trace Validations",       color: "blue" },
      ],
      links: [["GitHub ↗","https://github.com/kritibehl/dettrace"]],
      visual: "dettrace",
    },
    {
      id: "accelsim", flagship: false, lanes: ["systems"],
      title: "AccelSim-Lite",
      tagline: "C++ runtime bottleneck classification and regression gating",
      problem: "Profilers say slow. They don't say which stage is stalling — or whether adding compute helps vs. the bottleneck being memory bandwidth.",
      built: "C++17 six-stage pipeline simulator with named stall classification per cycle: WaitingDependency, NoMemoryPort, NoComputeUnit. Benchmark dashboard + runtime regression gates.",
      verified: "Pointer-heavy traversal: 25.65× slower than contiguous scan · memory_heavy: 2.4× throughput degradation · regression gate: PASS",
      tags: ["C++17","CMake","GoogleTest","Linux","Cache locality"],
      metrics: [
        { val: "25.65×", label: "Cache Miss Penalty",    color: "red" },
        { val: "2.4×",   label: "Throughput Degradation",color: "amber" },
        { val: "PASS",   label: "Regression Gate",        color: "green" },
      ],
      links: [["GitHub ↗","https://github.com/kritibehl/accelsim-lite"]],
      visual: "accelsim",
    },
  ];

  const visible = activeFilter === "all"
    ? projects
    : projects.filter(p => p.lanes.includes(activeFilter));

  // ── SVG VISUALS ──────────────────────────────────────────────────────────
  const visuals: Record<string, React.ReactNode> = {

    faultline: (
      <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <defs>
          <marker id="fl-arr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7Z" fill="rgba(96,165,250,0.8)"/>
          </marker>
          <marker id="fl-arr-red" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7Z" fill="rgba(239,68,68,0.8)"/>
          </marker>
          <marker id="fl-arr-grn" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7Z" fill="rgba(34,197,94,0.8)"/>
          </marker>
        </defs>
        <rect width="700" height="260" fill="rgba(5,7,13,0.95)" rx="12"/>
        {/* Header */}
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">FAULTLINE · DISTRIBUTED CORRECTNESS ARCHITECTURE</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

        {/* Dispatcher node */}
        <rect x="20" y="56" width="100" height="38" rx="6" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5"/>
        <text x="70" y="72" fill="#60a5fa" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Dispatcher</text>
        <text x="70" y="86" fill="rgba(96,165,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">job scheduler</text>

        {/* Worker A — valid path */}
        <rect x="175" y="40" width="100" height="38" rx="6" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.45)" strokeWidth="1.5"/>
        <text x="225" y="57" fill="#22c55e" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Worker A</text>
        <text x="225" y="71" fill="rgba(34,197,94,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">active · valid lease</text>

        {/* Worker B — stale */}
        <rect x="175" y="96" width="100" height="38" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" strokeDasharray="5,3"/>
        <text x="225" y="113" fill="#ef4444" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Worker B</text>
        <text x="225" y="127" fill="rgba(239,68,68,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">stale · old token</text>

        {/* Lease + Fencing Token */}
        <rect x="340" y="56" width="120" height="38" rx="6" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.45)" strokeWidth="1.5"/>
        <text x="400" y="72" fill="#a78bfa" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Fencing Token</text>
        <text x="400" y="86" fill="rgba(167,139,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">token=42</text>

        {/* PostgreSQL */}
        <rect x="520" y="40" width="110" height="90" rx="6" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5"/>
        <text x="575" y="68" fill="#60a5fa" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">PostgreSQL</text>
        <text x="575" y="82" fill="rgba(96,165,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">UNIQUE(job_id,</text>
        <text x="575" y="94" fill="rgba(96,165,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">fencing_token)</text>
        {/* WRITE REJECTED badge */}
        <rect x="530" y="100" width="90" height="20" rx="4" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.6)" strokeWidth="1"/>
        <text x="575" y="114" fill="#ef4444" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">WRITE REJECTED</text>

        {/* Arrows — valid path */}
        <line x1="120" y1="70" x2="173" y2="62" stroke="rgba(96,165,250,0.7)" strokeWidth="1.5" markerEnd="url(#fl-arr)"/>
        <line x1="275" y1="59" x2="338" y2="68" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" markerEnd="url(#fl-arr-grn)"/>
        <line x1="460" y1="64" x2="518" y2="70" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" markerEnd="url(#fl-arr-grn)"/>

        {/* Arrows — stale path */}
        <line x1="120" y1="74" x2="173" y2="110" stroke="rgba(239,68,68,0.45)" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#fl-arr-red)"/>
        <line x1="275" y1="115" x2="518" y2="115" stroke="rgba(239,68,68,0.45)" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#fl-arr-red)"/>

        {/* Legend */}
        <line x1="20" y1="155" x2="50" y2="155" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5"/>
        <text x="56" y="159" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="'JetBrains Mono',monospace">valid commit path</text>
        <line x1="160" y1="155" x2="190" y2="155" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="4,2"/>
        <text x="196" y="159" fill="rgba(239,68,68,0.6)" fontSize="8" fontFamily="'JetBrains Mono',monospace">stale write → rejected</text>

        {/* Metrics bottom bar */}
        {[
          { val: "0.0%",   label: "DUPLICATE COMMITS", x: 20,  col: "#22c55e" },
          { val: "1,500+", label: "FAULT SCENARIOS",   x: 240, col: "#60a5fa" },
          { val: "0",      label: "INVARIANT VIOLATIONS", x: 460, col: "#22c55e" },
        ].map(m => (
          <g key={m.label}>
            <text x={m.x} y="196" fill={m.col} fontSize="22" fontWeight="900" fontFamily="'JetBrains Mono',monospace">{m.val}</text>
            <text x={m.x} y="214" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">{m.label}</text>
          </g>
        ))}

        {/* Bottom chart: naive vs faultline */}
        <text x="20" y="240" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="'JetBrains Mono',monospace">Naive baseline: 1.0–2.5% duplicate rate</text>
        <rect x="240" y="230" width="200" height="7" rx="2" fill="rgba(239,68,68,0.2)"/>
        <rect x="240" y="230" width="40" height="7" rx="2" fill="rgba(239,68,68,0.6)"/>
        <text x="448" y="238" fill="rgba(239,68,68,0.7)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">2.5%</text>

        <text x="20" y="255" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="'JetBrains Mono',monospace">Faultline: 0.0% duplicate rate</text>
        <rect x="240" y="246" width="200" height="7" rx="2" fill="rgba(34,197,94,0.1)"/>
        <rect x="240" y="246" width="2" height="7" rx="1" fill="rgba(34,197,94,0.8)"/>
        <text x="448" y="254" fill="rgba(34,197,94,0.8)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">0.0%</text>
      </svg>
    ),

    kubepulse: (
      <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="260" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">KUBEPULSE · RELEASE DECISION DASHBOARD</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

        {/* BLOCK banner */}
        <rect x="20" y="44" width="660" height="46" rx="8" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.55)" strokeWidth="1.5"/>
        <circle cx="42" cy="67" r="7" fill="#ef4444">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x="56" y="61" fill="#ef4444" fontSize="11" fontWeight="900" fontFamily="'JetBrains Mono',monospace">RELEASE #428 — BLOCKED</text>
        <text x="56" y="80" fill="rgba(239,68,68,0.65)" fontSize="8.5" fontFamily="'JetBrains Mono',monospace">safe_to_operate: false · decision: BLOCK · reason: latency regression + dependency degraded</text>

        {/* Pipeline steps */}
        {[
          { label: "Deploy",    sub: "canary push",     x: 20,  c: "#60a5fa", status: "" },
          { label: "Probes",    sub: "GREEN ✓",         x: 155, c: "#22c55e", status: "" },
          { label: "p95 SLO",  sub: "+333% BREACH",    x: 290, c: "#ef4444", status: "FAIL" },
          { label: "Deps",     sub: "DEGRADED",         x: 425, c: "#f59e0b", status: "WARN" },
          { label: "Decision", sub: "BLOCK",            x: 560, c: "#ef4444", status: "BLOCK" },
        ].map((s, i) => (
          <g key={s.label}>
            <rect x={s.x} y="104" width="110" height="42" rx="6"
              fill={s.status === "BLOCK" ? "rgba(239,68,68,0.15)" : s.status === "FAIL" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)"}
              stroke={s.c} strokeWidth="1.2"/>
            <text x={s.x+55} y="121" fill={s.c} fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{s.label}</text>
            <text x={s.x+55} y="136" fill={s.c} fontSize="8" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" opacity="0.7">{s.sub}</text>
            {i < 4 && <line x1={s.x+110} y1="125" x2={s.x+135} y2="125" stroke={i >= 2 ? "#ef4444" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" opacity="0.7"/>}
          </g>
        ))}

        {/* Metric bars */}
        {[
          { label: "p95 Latency",   val: "+333%", pct: 88, col: "#ef4444" },
          { label: "p95 AMD MI300X",val: "+608%", pct: 100,col: "#ef4444" },
          { label: "Error Rate",    val: "+80%",  pct: 45, col: "#f59e0b" },
          { label: "Dep Health",    val: "DEG",   pct: 30, col: "#f59e0b" },
          { label: "Throughput",    val: "-38%",  pct: 22, col: "#22c55e" },
        ].map((m, i) => (
          <g key={m.label} transform={`translate(20,${164 + i * 18})`}>
            <text x="0" y="12" fill="rgba(255,255,255,0.35)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">{m.label}</text>
            <rect x="130" y="3" width="460" height="8" rx="2" fill="rgba(255,255,255,0.05)"/>
            <rect x="130" y="3" width={m.pct / 100 * 460} height="8" rx="2" fill={m.col} opacity="0.65"/>
            <text x="600" y="12" fill={m.col} fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{m.val}</text>
          </g>
        ))}
      </svg>
    ),

    faireval: (
      <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="260" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">FAIREVAL · AI RELEASE GATE DASHBOARD</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

        {/* Pipeline */}
        {[
          { label: "Baseline",  x: 20,  c: "#60a5fa" },
          { label: "Candidate", x: 155, c: "#a78bfa" },
          { label: "Eval",      x: 290, c: "#f59e0b" },
          { label: "RAI Gate",  x: 425, c: "#f59e0b" },
          { label: "SHIP/BLOCK",x: 560, c: "#ef4444" },
        ].map((s, i) => (
          <g key={s.label}>
            <rect x={s.x} y="44" width="110" height="34" rx="5" fill="rgba(255,255,255,0.035)" stroke={s.c} strokeWidth="1.2"/>
            <text x={s.x+55} y="65" fill={s.c} fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{s.label}</text>
            {i < 4 && <line x1={s.x+110} y1="61" x2={s.x+135} y2="61" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>}
          </g>
        ))}

        {/* Leaderboard */}
        <text x="20" y="104" fill="rgba(255,255,255,0.18)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">MODEL · EVAL SCORE · RAI · DECISION</text>
        {[
          { model: "Claude 3.5 Sonnet", score: 0.91, pass: true,  col: "#22c55e", rai: "PASS" },
          { model: "GPT-4o",            score: 0.85, pass: true,  col: "#22c55e", rai: "PASS" },
          { model: "Gemini Pro",        score: 0.52, pass: false, col: "#f59e0b", rai: "REVIEW" },
          { model: "Gemini Flash",      score: 0.367,pass: false, col: "#ef4444", rai: "BLOCK" },
        ].map((m, i) => (
          <g key={m.model} transform={`translate(20,${112 + i * 30})`}>
            <rect x="0" y="0" width="660" height="26" rx="4"
              fill={m.rai === "BLOCK" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.025)"}
              stroke={m.rai === "BLOCK" ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)"} strokeWidth="1"/>
            <text x="12" y="17" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600" fontFamily="'JetBrains Mono',monospace">{m.model}</text>
            {/* score bar */}
            <rect x="220" y="8" width="300" height="8" rx="2" fill="rgba(255,255,255,0.06)"/>
            <rect x="220" y="8" width={m.score * 300} height="8" rx="2" fill={m.col} opacity="0.6"/>
            <text x="528" y="17" fill="rgba(255,255,255,0.4)" fontSize="8.5" fontFamily="'JetBrains Mono',monospace">{m.score.toFixed(3)}</text>
            <rect x="570" y="4" width="78" height="18" rx="4"
              fill={m.rai === "BLOCK" ? "rgba(239,68,68,0.2)" : m.rai === "REVIEW" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.12)"}
              stroke={m.col} strokeWidth="1"/>
            <text x="609" y="16" fill={m.col} fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{m.rai}</text>
          </g>
        ))}

        {/* BLOCKED card */}
        <rect x="20" y="238" width="660" height="16" rx="4" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.35)" strokeWidth="1"/>
        <text x="350" y="249" fill="#ef4444" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">BLOCKED BY RELEASE GATE · REASON: HALLUCINATION + GROUNDEDNESS REGRESSION + RAI RISK · p=0.0</text>
      </svg>
    ),

    agentgrid: (
      <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <defs>
          <marker id="ag-arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6Z" fill="rgba(96,165,250,0.8)"/>
          </marker>
        </defs>
        <rect width="700" height="260" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">AGENTGRID · AGENTIC WORKFLOW ENGINE</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

        {/* Main workflow */}
        {[
          { label: "Request",      x: 20,  y: 100, c: "#60a5fa" },
          { label: "Retrieve\nContext", x: 145, y: 100, c: "#a78bfa" },
          { label: "Agent\nDecision",  x: 270, y: 100, c: "#60a5fa" },
          { label: "Tool\nExecute",   x: 395, y: 100, c: "#22c55e" },
          { label: "Eval\nGate",      x: 520, y: 100, c: "#f59e0b" },
        ].map((n, i) => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width="100" height="44" rx="6" fill="rgba(255,255,255,0.04)" stroke={n.c} strokeWidth="1.2"/>
            {n.label.split("\n").map((line, li) => (
              <text key={li} x={n.x + 50} y={n.y + 18 + li * 14} fill={n.c} fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{line}</text>
            ))}
            {i < 4 && <line x1={n.x + 100} y1={n.y + 22} x2={n.x + 125} y2={n.y + 22} stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" markerEnd="url(#ag-arr)"/>}
          </g>
        ))}

        {/* Outcomes */}
        {[
          { label: "SHIP",     y: 56,  c: "#22c55e", desc: "9 decisions" },
          { label: "HOLD",     y: 84,  c: "#f59e0b", desc: "10 decisions" },
          { label: "ESCALATE", y: 112, c: "#ef4444", desc: "6 decisions" },
          { label: "RETRY",    y: 140, c: "#60a5fa", desc: "on tool fail" },
        ].map(o => (
          <g key={o.label}>
            <rect x="640" y={o.y} width="50" height="20" rx="4"
              fill={o.c === "#22c55e" ? "rgba(34,197,94,0.15)" : o.c === "#ef4444" ? "rgba(239,68,68,0.12)" : o.c === "#f59e0b" ? "rgba(245,158,11,0.12)" : "rgba(96,165,250,0.1)"}
              stroke={o.c} strokeWidth="1"/>
            <text x="665" y={o.y + 14} fill={o.c} fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{o.label}</text>
            <line x1="620" y1="122" x2="638" y2={o.y + 10} stroke={o.c} strokeWidth="0.8" opacity="0.4" strokeDasharray="3,2"/>
          </g>
        ))}

        {/* Metrics */}
        {[
          { val: "30", label: "PASSING TESTS", x: 20,  c: "#22c55e" },
          { val: "0",  label: "UNSAFE SHIPS",  x: 180, c: "#22c55e" },
          { val: "0.88",label:"TOOL SUCCESS",  x: 330, c: "#60a5fa" },
          { val: "258ms",label:"p95 LATENCY",  x: 490, c: "#60a5fa" },
        ].map(m => (
          <g key={m.label}>
            <text x={m.x} y="196" fill={m.c} fontSize="24" fontWeight="900" fontFamily="'JetBrains Mono',monospace">{m.val}</text>
            <text x={m.x} y="214" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">{m.label}</text>
          </g>
        ))}

        <text x="20" y="248" fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="'JetBrains Mono',monospace">RAG retrieval → LangGraph → MCP-style tool execution → eval gate → AutoOps incident · Live on Cloud Run</text>
      </svg>
    ),

    dettrace: (
      <svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="220" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">DETTRACE · REPLAY TIMELINE · FIRST DIVERGENCE ISOLATION</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

        {/* Expected trace */}
        <text x="20" y="58" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">EXPECTED TRACE</text>
        <line x1="20" y1="72" x2="660" y2="72" stroke="rgba(34,197,94,0.2)" strokeWidth="1.5"/>
        {[50, 150, 250, 350, 450, 550, 640].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="72" r="5" fill="rgba(34,197,94,0.5)" stroke="rgba(34,197,94,0.8)" strokeWidth="1"/>
            <text x={x} y="88" fill="rgba(34,197,94,0.45)" fontSize="7" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">evt-{i}</text>
          </g>
        ))}

        {/* Actual trace */}
        <text x="20" y="112" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">ACTUAL TRACE</text>
        <line x1="20" y1="126" x2="660" y2="126" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
        {[50, 150, 250].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="126" r="5" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            <text x={x} y="142" fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">evt-{i}</text>
          </g>
        ))}
        {/* Divergence at idx 3 */}
        <circle cx="350" cy="126" r="8" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="2">
          <animate attributeName="r" values="8;11;8" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <text x="350" y="142" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="900">evt-3</text>

        {/* Divergence annotation */}
        <line x1="350" y1="84" x2="350" y2="116" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" strokeDasharray="4,2"/>
        <rect x="290" y="55" width="120" height="26" rx="5" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
        <text x="350" y="66" fill="#ef4444" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">FIRST DIVERGENCE</text>
        <text x="350" y="77" fill="rgba(239,68,68,0.7)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">index 3 · interrupt race</text>

        {[450, 550, 640].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="126" r="5" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.35)" strokeWidth="1"/>
            <text x={x} y="142" fill="rgba(239,68,68,0.3)" fontSize="7" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">evt-{4+i}</text>
          </g>
        ))}

        <rect x="20" y="162" width="660" height="20" rx="4" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)"/>
        <text x="350" y="175" fill="#22c55e" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">NON-REPRODUCIBLE → DETERMINISTIC ROOT CAUSE · 1.0 CONFIDENCE · 10,000+ TRACE VALIDATIONS</text>
        <text x="20" y="205" fill="rgba(255,255,255,0.18)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">GPIO interrupt race isolated at index 3 · C++17 deterministic replay engine · Swift actor-isolated analysis</text>
      </svg>
    ),

    accelsim: (
      <svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="220" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">ACCELSIM-LITE · PIPELINE BOTTLENECK ANALYSIS</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

        {["Fetch","Decode","Execute","Memory","Writeback"].map((s, i) => (
          <g key={s}>
            <rect x={20 + i * 132} y="48" width="110" height="36" rx="6"
              fill={i === 3 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)"}
              stroke={i === 3 ? "#ef4444" : "rgba(255,255,255,0.1)"} strokeWidth={i===3?1.5:1}/>
            <text x={20 + i * 132 + 55} y="70" fill={i === 3 ? "#ef4444" : "rgba(255,255,255,0.4)"} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{s}</text>
            {i < 4 && <line x1={20 + i*132+110} y1="66" x2={20 + i*132+132} y2="66" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>}
          </g>
        ))}
        <text x="350" y="104" fill="#ef4444" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">↑ BOTTLENECK: NoMemoryPort · WaitingDependency · MEMORY BOUND</text>

        {[
          { label: "Contiguous scan",        pct: 95, val: "1.0×",   c: "#22c55e" },
          { label: "Pointer-heavy traversal", pct: 15, val: "25.65× slower", c: "#ef4444" },
          { label: "memory_heavy benchmark",  pct: 42, val: "2.4× degraded", c: "#f59e0b" },
        ].map((b, i) => (
          <g key={b.label} transform={`translate(20,${120 + i * 28})`}>
            <text x="0" y="14" fill="rgba(255,255,255,0.45)" fontSize="8.5" fontFamily="'JetBrains Mono',monospace">{b.label}</text>
            <rect x="200" y="4" width="380" height="10" rx="2" fill="rgba(255,255,255,0.05)"/>
            <rect x="200" y="4" width={b.pct / 100 * 380} height="10" rx="2" fill={b.c} opacity="0.65"/>
            <text x="590" y="14" fill={b.c} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{b.val}</text>
          </g>
        ))}

        <rect x="20" y="204" width="660" height="12" rx="3" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)"/>
        <text x="350" y="213" fill="#22c55e" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">RUNTIME REGRESSION GATE: PASS · C++17 six-stage pipeline · named stall classification</text>
      </svg>
    ),
  };

  return (
    <div ref={rootRef} className="page">

      {/* ── NAV ──────────────────────────────────── */}
      <nav className="top-nav rev">
        <span className="nav-logo">KB</span>
        <div className="nav-links">
          <a href="#proof"    className="nav-link">Proof</a>
          <a href="#oss"      className="nav-link">Open Source</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-link nav-resume">Resume ↗</a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero rev" id="hero">
        <div className="hero-split">

          {/* Left */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              Open to roles · New grad Dec 2025 · US work authorized
            </div>

            <h1 className="hero-headline">
              <span className="hl-building">BUILDING SYSTEMS</span>
              <span className="hl-that">THAT FAIL LOUDLY,</span>
              <span className="hl-recover">RECOVER SAFELY,</span>
              <span className="hl-block">AND BLOCK BAD RELEASES.</span>
            </h1>

            <p className="hero-subline">
              Kriti Behl &mdash; Correctness, Reliability &amp; Infrastructure Engineer
            </p>

            <div className="hero-btns">
              <a href="#projects" className="btn btn-primary">Explore Work →</a>
              <a href="https://github.com/kritibehl" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/kriti-behl" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">LinkedIn ↗</a>
              <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">Email</a>
            </div>
          </div>

          {/* Right — live console */}
          <div className="hero-right">
            <div className="console-panel">
              <div className="console-header">
                <span className="con-dot con-red"/>
                <span className="con-dot con-yellow"/>
                <span className="con-dot con-green"/>
                <span className="console-title">reliability-pipeline · live</span>
              </div>
              <div className="console-body">
                <div className="console-static">
                  <span className="con-muted">$ </span>run faultline --fault-rate=15% --scenarios=1500<br/>
                  <span style={{color:"#22c55e"}}>✓</span> scheduler initialized<br/>
                  <span style={{color:"#22c55e"}}>✓</span> fault proxy ready<br/>
                  <span style={{color:"#22c55e"}}>✓</span> fencing tokens active<br/>
                  <span className="con-muted">─────────────────────</span><br/>
                </div>
                {consoleLines.map((l, i) => (
                  <div
                    key={i}
                    className={`console-line${i === consoleLine ? " console-active" : i === (consoleLine - 1 + consoleLines.length) % consoleLines.length ? " console-prev" : " console-hidden"}`}
                    style={{ color: l.color }}
                  >
                    {l.text}
                  </div>
                ))}
                <div className="console-cursor">█</div>
              </div>
            </div>

            {/* 4 proof cards */}
            <div className="hero-proof-cards">
              {[
                { val: "4",      label: "Temporal PRs Merged",     color: "blue" },
                { val: "0.0%",   label: "Duplicate Commits",        color: "green" },
                { val: "1,500+", label: "Fault Scenarios",          color: "blue" },
                { val: "Meta PE",label: "Fellow · 2026",            color: "violet" },
              ].map(c => (
                <div key={c.val} className={`hpc hpc-${c.color}`}>
                  <div className="hpc-val">{c.val}</div>
                  <div className="hpc-label">{c.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── TRUSTED NETWORK ──────────────────────── */}
      <div className="trusted-strip rev">
        <div className="ts-label">Trusted Networks &amp; Contributions</div>
        <div className="ts-logos">
          {[
            { name: "Temporal",          sub: "4 merged PRs" },
            { name: "Azure SDK",         sub: "2 PRs under review" },
            { name: "Thales",            sub: "100k+ HSM records/run" },
            { name: "Meta × MLH",        sub: "PE Fellow · 2026" },
            { name: "University of Florida", sub: "MS CS · GPA 3.8" },
            { name: "Rewriting the Code",sub: "Women in Tech" },
            { name: "McKinsey Forward",  sub: "Selected · 2026" },
            { name: "Hugging Face",      sub: "FairEval published" },
          ].map(l => (
            <div key={l.name} className="ts-logo-card">
              <div className="ts-logo-name">{l.name}</div>
              <div className="ts-logo-sub">{l.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SYSTEMS PROOF WALL ───────────────────── */}
      <section className="section rev" id="proof">
        <div className="sec-header">
          <span className="sec-label">Systems Proof Wall</span>
          <h2 className="sec-title">Not Claims. Proof.</h2>
        </div>
        <div className="proof-wall">
          {[
            { target: 4,      suffix: "",      label: "Merged Temporal Go SDK PRs", sub: "Maintainer-reviewed production runtime",   color: "blue",   href: "https://github.com/temporalio/sdk-go/pulls?q=is%3Apr+author%3Akritibehl" },
            { target: 1500,   suffix: "+",     label: "Fault Scenarios",             sub: "Injected under 5–20% fault rate",           color: "blue",   href: "https://github.com/kritibehl/faultline" },
            { target: 10000,  suffix: "+",     label: "Trace Validations",           sub: "FairEval + AgentGrid eval infrastructure",  color: "blue",   href: "https://github.com/kritibehl/FairEval-Suite" },
            { target: 100000, suffix: "+",     label: "HSM Records / Run",           sub: "payShield 10K · Luna HSM · Thales",          color: "violet", href: "https://github.com/kritibehl" },
            { target: 0,      suffix: ".0%",   label: "Duplicate Commits",           sub: "Faultline · fencing-token correctness",      color: "green",  href: "https://github.com/kritibehl/faultline" },
            { target: 608,    suffix: "%",     label: "p95 Regression Blocked",      sub: "AMD MI300X · KubePulse release gate",        color: "red",    href: "https://github.com/kritibehl/KubePulse" },
          ].map(p => (
            <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className={`pw-card pw-${p.color}`}>
              <div className="pw-num">
                <span className="count-up" data-target={p.target}>0</span>
                <span className="pw-suffix">{p.suffix}</span>
              </div>
              <div className="pw-label">{p.label}</div>
              <div className="pw-sub">{p.sub}</div>
              <div className="pw-cta">View proof ↗</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── OPEN SOURCE ──────────────────────────── */}
      <section className="section rev" id="oss">
        <div className="sec-header">
          <span className="sec-label">01 · Open Source Impact</span>
          <h2 className="sec-title">Temporal Go SDK · 4 Merged PRs</h2>
          <p className="sec-sub">Maintainer-reviewed contributions to a production workflow runtime. Not toy fixes — each addresses a correctness, goroutine-safety, or poller-behavior bug.</p>
          <div className="oss-view-all">
            <a href="https://github.com/temporalio/sdk-go/pulls?q=is%3Apr+author%3Akritibehl" target="_blank" rel="noopener noreferrer" className="oss-view-link">View all Temporal PRs ↗</a>
            <a href="https://github.com/Azure/azure-sdk-for-go/pulls?q=is%3Apr+author%3Akritibehl" target="_blank" rel="noopener noreferrer" className="oss-view-link">View all Azure PRs ↗</a>
          </div>
        </div>
        <div className="oss-list">
          {[
            { repo:"Temporal", num:"#2298", href:"https://github.com/temporalio/sdk-go/pull/2298", title:"Fixed async future chaining where ready futures could still block callers", desc:"Resolved a bug where already-resolved futures could still cause callers to block, breaking async execution guarantees.", merged:true },
            { repo:"Temporal", num:"#2212", href:"https://github.com/temporalio/sdk-go/pull/2212", title:"Fixed OnWorkflow mock to observe propagated context headers", desc:"Applied workflow context propagation to mock execution so OnWorkflow matchers see the same headers as real execution.", merged:true },
            { repo:"Temporal", num:"#2200", href:"https://github.com/temporalio/sdk-go/pull/2200", title:"Fixed goroutine leak in child-workflow test environment", desc:"Child workflows could block on an unclosed doneChannel. Added idempotent closure with sync.Once and a regression test.", merged:true },
            { repo:"Temporal", num:"#2248", href:"https://github.com/temporalio/sdk-go/pull/2248", title:"Restored workflow poller type assignment in scalable task pollers", desc:"Wired poller type assignment into scalable task pollers, restoring sticky vs non-sticky distinction used by poller balancing.", merged:true },
            { repo:"Azure",    num:"#26051", href:"https://github.com/Azure/azure-sdk-for-go/pull/26051", title:"Surfaced silently dropped transport errors in azcore retry policy", desc:"Composed realClose() failures with request errors using errors.Join so callers can inspect retry-path failures.", merged:false },
            { repo:"Azure",    num:"#26106", href:"https://github.com/Azure/azure-sdk-for-go/pull/26106", title:"Implemented W3C Trace Context propagation in azcore HTTP tracing", desc:"Added traceparent and tracestate propagation via OpenTelemetry propagators and validated header injection with tests.", merged:false },
          ].map(pr => (
            <a key={pr.num} href={pr.href} target="_blank" rel="noopener noreferrer" className={`oss-row ${pr.repo.toLowerCase()}`}>
              <div className={`oss-badge${pr.repo === "Azure" ? " oss-badge-az" : ""}`}>{pr.repo} {pr.num}</div>
              <div className="oss-content">
                <div className="oss-title">{pr.title}</div>
                <div className="oss-desc">{pr.desc}</div>
              </div>
              <div className={pr.merged ? "oss-merged" : "oss-review"}>{pr.merged ? "✓ Merged" : "⟳ In Review"}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────── */}
      <section className="section rev" id="experience">
        <div className="sec-header">
          <span className="sec-label">02 · Experience</span>
          <h2 className="sec-title">Experience</h2>
        </div>
        <div className="exp-list">
          {[
            {
              role: "Software Engineer", dates: "Feb 2026 – Present",
              co: "Cheenti Digital LLC · Remote", current: true,
              bullets: [
                "Built FastAPI/Redis-backed workflow tooling processing 3,000+ weekly reporting events across AI-assisted SEO and analytics workflows, covering 5 signal types and 8 recurring issue categories",
                "Developed AI output validation with 20+ Pydantic/JSON Schema checks, audit logs, retry-state tracking, approval-status handling, and human-review gates",
                "Instrumented reporting workflows with structured logs, validation traces, and operational review artifacts",
              ],
            },
            {
              role: "DevSecOps Intern", dates: "Jun – Aug 2025",
              co: "Thales Group · Plantation, FL", current: false,
              bullets: [
                "Built Python backend processing ~100k state-transition records per run; computed per-resource utilization, queue depth, and efficiency across HSM resource pools (payShield 10K, Luna HSM)",
                "Replaced frontend JavaScript state computation with deterministic backend state engine; REST endpoints exposing real-time HSM state, queue depth, idle/recovery counts from PostgreSQL event logs",
                "Implemented configurable time-window efficiency analysis (24h–N days) via delta-based evaluation; built internal dashboard for DevOps teams",
              ],
            },
            {
              role: "Graduate Assistant", dates: "Dec 2024 – Dec 2025",
              co: "University of Florida · Gainesville, FL", current: false,
              bullets: [
                "Operated and improved production scheduling system used by ~600–800 weekly users; diagnosed live failures and restored correctness during active usage",
              ],
            },
          ].map(e => (
            <div key={e.role + e.co} className={`exp-card${e.current ? " current" : ""}`}>
              <div className="exp-top">
                <div>
                  <div className="exp-role">
                    {e.role}
                    {e.current && <span className="exp-badge">Current</span>}
                  </div>
                  <div className="exp-co">{e.co}</div>
                </div>
                <div className="exp-dates">{e.dates}</div>
              </div>
              <ul className="exp-buls">{e.bullets.map(b => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW I THINK ──────────────────────────── */}
      <section className="section rev" id="how">
        <div className="sec-header">
          <span className="sec-label">Methodology</span>
          <h2 className="sec-title">How I Build Failure-Aware Systems</h2>
        </div>
        <div className="how-steps">
          {[
            { n: "01", q: "What breaks?",                  a: "Define the failure mode before writing a line of code. Stale writes. Silent regressions. Goroutine leaks. Unhealthy probes that lie." },
            { n: "02", q: "How do we detect it?",          a: "Instrument for the failure, not the happy path. Fencing tokens, SLO gates, eval pipelines, trace timelines — designed to surface signal." },
            { n: "03", q: "What evidence proves it?",      a: "Run it under real injected failures. 1,500+ fault scenarios, 10k+ trace validations, p95 latency under load — not unit tests on mocks." },
            { n: "04", q: "What decision should the system make?", a: "Not an alert. A decision. BLOCK the release. REJECT the stale write. ESCALATE the unsafe answer. Automated, with audit trail." },
            { n: "05", q: "How does an engineer debug it later?", a: "Deterministic replay. First-divergence isolation. Prometheus metrics. Named stall classification. Leave a trail that doesn't require recreating the incident." },
          ].map(s => (
            <div key={s.n} className="how-step">
              <div className="how-n">{s.n}</div>
              <div className="how-content">
                <div className="how-q">{s.q}</div>
                <div className="how-a">{s.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────── */}
      <section className="section" id="projects">
        <div className="sec-header rev">
          <span className="sec-label">03 · Engineering Systems</span>
          <h2 className="sec-title">Flagship Case Studies</h2>
          <p className="sec-sub">Problem → What I built → Verified numbers. Each project is a proof artifact, not a demo.</p>
        </div>

        {/* Filters */}
        <div className="filter-tabs rev">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-tab${activeFilter === f.id ? " active" : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >{f.label}</button>
          ))}
        </div>

        {/* Flagship */}
        {(activeFilter === "all" || visible.some(p => p.flagship)) && (
          <div className="proj-group-label rev">Flagship</div>
        )}

        <div className="proj-flagship-list">
          {visible.filter(p => p.flagship).map(p => (
            <div key={p.id} className="proj-flagship rev">
              {/* Visual */}
              <div className="proj-visual">{visuals[p.visual]}</div>

              {/* Header */}
              <div className="pf-header">
                <div>
                  <h3 className="pf-title">{p.title}</h3>
                  <div className="pf-tagline">{p.tagline}</div>
                </div>
                <div className="pf-tags">{p.tags.slice(0,5).map(t => <span key={t} className="pf-tag">{t}</span>)}</div>
              </div>

              {/* Metrics */}
              <div className="pf-metrics">
                {p.metrics.map(m => (
                  <div key={m.label} className={`pf-metric pf-m-${m.color}`}>
                    <div className="pfm-val">{m.val}</div>
                    <div className="pfm-label">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Detail table */}
              <div className="pcb">
                <div className="pcb-row"><span className="pcb-l">Problem</span><span className="pcb-t">{p.problem}</span></div>
                <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">{p.built}</span></div>
                <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">{p.verified}</span></div>
              </div>

              {/* Links */}
              <div className="pf-links">
                {(p.links as [string, string][]).map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="pcf-link-btn">{label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Supporting */}
        {visible.some(p => !p.flagship) && (
          <>
            <div className="proj-group-label rev" style={{marginTop:"40px"}}>Supporting Systems</div>
            <div className="proj-support-grid">
              {visible.filter(p => !p.flagship).map(p => (
                <div key={p.id} className="proj-support rev">
                  <div className="proj-visual-sm">{visuals[p.visual]}</div>
                  <h3 className="ps-title">{p.title}</h3>
                  <div className="ps-tagline">{p.tagline}</div>
                  <div className="pf-metrics" style={{marginBottom:"12px"}}>
                    {p.metrics.map(m => (
                      <div key={m.label} className={`pf-metric pf-m-${m.color}`} style={{padding:"10px 8px"}}>
                        <div className="pfm-val" style={{fontSize:"1rem"}}>{m.val}</div>
                        <div className="pfm-label">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pcb">
                    <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">{p.built}</span></div>
                    <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">{p.verified}</span></div>
                  </div>
                  <div className="pf-links" style={{marginTop:"12px"}}>
                    {(p.links as [string, string][]).map(([label, href]) => (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="pcf-link-btn">{label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── SKILLS ───────────────────────────────── */}
      <section className="section rev" id="skills">
        <div className="sec-header">
          <span className="sec-label">04 · Stack</span>
          <h2 className="sec-title">Skills &amp; Stack</h2>
        </div>
        <div className="skills-grid">
          {[
            { cat:"Languages",            items:["Python","Go","C++17","SQL","Java"] },
            { cat:"AI Evaluation",        items:["RAI gates","RAG groundedness","Hallucination checks","Tool-call validation","Latency governance"] },
            { cat:"Backend & Platform",   items:["FastAPI","PostgreSQL","Redis","LangGraph","SQLAlchemy","Node.js"] },
            { cat:"Reliability / SRE",    items:["Prometheus","OpenTelemetry","Jaeger","k6","Release gates","SLO validation"] },
            { cat:"Cloud / Infra",        items:["Docker","GitHub Actions","Cloud Run","Kubernetes","Terraform","Chaos testing"] },
            { cat:"Systems",              items:["C++17","CMake","GoogleTest","Deterministic replay","Cache/locality"] },
          ].map(s => (
            <div key={s.cat} className="skill-card">
              <div className="sk-cat">{s.cat}</div>
              <div className="sk-chips">{s.items.map(i => <span key={i} className="sk-chip">{i}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────── */}
      <section className="section rev" id="programs">
        <div className="sec-header">
          <span className="sec-label">05 · Programs</span>
          <h2 className="sec-title">Programs &amp; Communities</h2>
        </div>
        <div className="programs-grid">
          {[
            { org: "Meta / MLH Fellowship", title: "Meta Production Engineering Fellowship", detail: "SRE Track · 2026", desc: "Production infrastructure, Linux reliability engineering, and platform operations.", accent: "#1877f2" },
            { org: "University of Florida", title: "M.S. Computer Science", detail: "GPA 3.8 / 4.0 · Graduating Dec 2025", desc: "Distributed Systems · Networks · Algorithms · Security · NLP", accent: "#3b82f6" },
            { org: "McKinsey Forward",      title: "McKinsey Forward Program", detail: "Selected Participant · 2026", desc: "Business and leadership development for high-potential early-career professionals.", accent: "#22c55e" },
            { org: "Rewriting the Code",    title: "Rewriting the Code", detail: "Women in Tech Community", desc: "Selective tech community supporting women in software engineering.", accent: "#a78bfa" },
          ].map(p => (
            <div key={p.title} className="program-card" style={{ "--prog-accent": p.accent } as React.CSSProperties}>
              <div className="prog-org">{p.org}</div>
              <div className="prog-title">{p.title}</div>
              <div className="prog-detail">{p.detail}</div>
              <div className="prog-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WRITING ──────────────────────────────── */}
      <section className="section rev" id="writing">
        <div className="sec-header">
          <span className="sec-label">06 &middot; Engineering Writing</span>
          <h2 className="sec-title">Engineering Writing</h2>
          <p className="sec-sub">Lessons from building systems that fail, recover, and evolve in production.</p>
        </div>

        <div className="writing-stats rev">
          <div className="wst-item"><span className="wst-val">12+</span><span className="wst-label">Technical Articles</span></div>
          <div className="wst-div"/>
          <div className="wst-item"><span className="wst-val">20k+</span><span className="wst-label">Words Published</span></div>
          <div className="wst-div"/>
          <div className="wst-topics">Distributed Systems &middot; Reliability &middot; AI Infrastructure</div>
        </div>

        <div className="writing-cards">
          {[
            {
              href: "https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723",
              topic: "Distributed Systems",
              topicColor: "blue",
              title: "How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and Network Faults",
              sub: "Exactly-once-style correctness requires fencing tokens, validation, and failure injection.",
              read: "8 min read",
            },
            {
              href: "https://medium.com/@kriti0608/kubernetes-said-everything-was-healthy-it-wasnt-27f7b4b9ed0e",
              topic: "Reliability Engineering / SRE",
              topicColor: "amber",
              title: "Kubernetes Said Everything Was Healthy. It Wasn't.",
              sub: "Green readiness probes do not guarantee healthy user experience.",
              read: "6 min read",
            },
            {
              href: "https://medium.com/@kriti0608/the-most-dangerous-ai-failures-dont-crash-they-quietly-look-correct-a404e343395a",
              topic: "AI Infrastructure",
              topicColor: "violet",
              title: "The Most Dangerous AI Failures Don't Crash — They Quietly Look Correct",
              sub: "Silent regressions are often more dangerous than outages because they appear successful.",
              read: "7 min read",
            },
          ].map(w => (
            <a key={w.href} href={w.href} target="_blank" rel="noopener noreferrer" className={`writing-card wc-${w.topicColor}`}>
              <div className={`wc-topic wc-topic-${w.topicColor}`}>{w.topic}</div>
              <div className="wc-title">{w.title}</div>
              <div className="wc-sub">{w.sub}</div>
              <div className="wc-footer">
                <span className="wc-read">{w.read}</span>
                <span className="wc-cta">Read on Medium &#x2197;</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CONTACT / CTA ────────────────────────── */}
      <section className="section rev" id="contact">
        <div className="contact-block">
          <div className="cb-top-label">Let&apos;s build something that fails loudly.</div>
          <h2 className="cb-headline">
            I build systems that fail loudly, recover safely,<br/>
            and block unsafe releases before users are impacted.
          </h2>
          <p className="cb-sub">Looking for backend/platform, SRE, AI evaluation, and reliability engineering roles. New grad · Dec 2025 · Open to relocation · US work authorized</p>
          <div className="cb-btns">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Download Resume</a>
            <a href="https://github.com/kritibehl" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View GitHub ↗</a>
            <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">Contact Me</a>
          </div>
          <div className="cb-links-row">
            {[
              ["https://github.com/kritibehl",        "GitHub ↗"],
              ["https://www.linkedin.com/in/kriti-behl",  "LinkedIn ↗"],
              ["https://medium.com/@kriti0608",       "Medium ↗"],
              ["https://huggingface.co/kriti0608/FairEval",    "HuggingFace ↗"],
              ["mailto:kriti0608@gmail.com",          "Email ↗"],
            ].map(([h,l]) => (
              <a key={h} href={h} target="_blank" rel="noopener noreferrer" className="cb-text-link">{l}</a>
            ))}
          </div>
        </div>
      </section>

      <div className="footer-note rev">
        Logos / program names shown for experience, programs, open-source ecosystems, and hosted project platforms.
      </div>

    </div>
  );
}