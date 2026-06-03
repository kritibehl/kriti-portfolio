"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [kubePhase, setKubePhase] = useState(0);
  const [statusTick, setStatusTick] = useState(0);
  const [heroFlowStep, setHeroFlowStep] = useState(0);
  const [fenceStep, setFenceStep] = useState(0);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Hero animated flow: 0=normal, 1=fault, 2=retry, 3=stale, 4=rejected
  useEffect(() => {
    const steps = [2000, 1200, 1000, 1000, 1800];
    let s = 0;
    const step = () => {
      s = (s + 1) % steps.length;
      setHeroFlowStep(s);
      t = setTimeout(step, steps[s]);
    };
    let t = setTimeout(step, steps[0]);
    return () => clearTimeout(t);
  }, []);

  // Fencing token animation
  useEffect(() => {
    const iv = setInterval(() => setFenceStep(s => (s + 1) % 6), 900);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const phases = [2000, 1500, 2000];
    let phase = 0;
    const step = () => {
      phase = (phase + 1) % 3;
      setKubePhase(phase);
      t = setTimeout(step, phases[phase]);
    };
    let t = setTimeout(step, phases[0]);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setStatusTick(t => t + 1), 2200);
    return () => clearInterval(iv);
  }, []);

  // Bloomberg ticker scroll
  useEffect(() => {
    const iv = setInterval(() => setTickerOffset(o => o - 1), 28);
    return () => clearInterval(iv);
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
      proofBadges: ["0.0% Duplicates", "1,500+ Scenarios", "0 Invariant Violations", "ACTIVE Fencing Tokens"],
      tags: ["PostgreSQL","Go","Python","k6","Observability","Correctness"],
      metrics: [
        { val: "0.0%",   label: "Duplicate Commits",            color: "green" },
        { val: "1,500+", label: "Fault Scenarios",              color: "blue" },
        { val: "0",      label: "Invariant Violations",         color: "green" },
        { val: "37",     label: "Duplicate Deliveries Prevented", color: "green" },
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
      proofBadges: ["+608% Regression Blocked", "Canary Analysis Engine", "Dependency Health Gates", "safe_to_operate=false"],
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
      proofBadges: ["p=0.0 Significance", "AMD BLOCK", "Live HuggingFace API", "Zenodo Published"],
      tags: ["PyTorch","FastAPI","React","RAG eval","Responsible AI","Statistical gating"],
      metrics: [
        { val: "p=0.0",  label: "Statistical Significance", color: "green" },
        { val: "BLOCK",  label: "AMD Serving Gate",          color: "red" },
        { val: "40%",    label: "Pass Rate → Blocked",       color: "amber" },
      ],
      evalCards: [
        { label: "Dataset Drift", val: "DETECTED", color: "amber", icon: "⬡" },
        { label: "Reviewer Agreement", val: "p=0.0", color: "green", icon: "◎" },
        { label: "Release Decision", val: "BLOCK", color: "red", icon: "⬛" },
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
      title: "AgentGrid",
      tagline: "AI Workflow & Agent Observability Platform",
      problem: "Most AI demos stop at generation. AgentGrid handles what happens when AI is wrong — full observability over retrieval quality, tool execution, escalation decisions, and model-version comparisons.",
      built: "Agent workflow observability layer for RAG/tool-calling systems, tracking retrieval quality, tool execution, latency, escalation decisions, model-version comparisons, and PySpark-based trace analytics.",
      verified: "56 tests passing · 0.80 retrieval hit rate · 0.80 tool success rate · 880ms p95 latency · 20% escalation rate",
      tags: ["Python","FastAPI","React","TypeScript","Redis","LangChain","RAG","PySpark"],
      proofBadges: ["56 Tests Passed","0.80 Retrieval Hit Rate","0.80 Tool Success Rate","PySpark Analytics"],
      metrics: [
        { val: "0.80",  label: "Retrieval Hit Rate", color: "blue"  },
        { val: "56",    label: "Tests Passing",       color: "green" },
        { val: "880ms", label: "p95 Latency",         color: "blue"  },
      ],
      links: [
        ["GitHub ↗","https://github.com/kritibehl/agentgrid-demo"],
        ["Live Demo ↗","https://agentgrid-seven.vercel.app/"],
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

  const heroFlowLabels = [
    { nodes: ["Request","Queue","Worker","DB"], note: null, noteColor: "" },
    { nodes: ["Request","Queue","Worker","DB"], note: "⚡ FAULT INJECTED", noteColor: "#ef4444" },
    { nodes: ["Request","Queue","Worker","DB"], note: "↺ RETRY...", noteColor: "#f59e0b" },
    { nodes: ["Request","Queue","Worker","DB"], note: "✗ STALE WRITE", noteColor: "#ef4444" },
    { nodes: ["Request","Queue","Worker","DB"], note: "✓ REJECTED · 0.0% DUPLICATES", noteColor: "#22c55e" },
  ];

  // ── SVG VISUALS ──────────────────────────────────────────────────────────
  const visuals: Record<string, React.ReactNode> = {
    faultline: (
      <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <defs>
          <marker id="fl-arr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7Z" fill="rgba(96,165,250,0.8)"/></marker>
          <marker id="fl-arr-red" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7Z" fill="rgba(239,68,68,0.8)"/></marker>
          <marker id="fl-arr-grn" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7Z" fill="rgba(34,197,94,0.8)"/></marker>
        </defs>
        <rect width="700" height="260" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">FAULTLINE · DISTRIBUTED CORRECTNESS ARCHITECTURE</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <rect x="20" y="56" width="100" height="38" rx="6" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5"/>
        <text x="70" y="72" fill="#60a5fa" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Dispatcher</text>
        <text x="70" y="86" fill="rgba(96,165,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">job scheduler</text>
        <rect x="175" y="40" width="100" height="38" rx="6" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.45)" strokeWidth="1.5"/>
        <text x="225" y="57" fill="#22c55e" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Worker A</text>
        <text x="225" y="71" fill="rgba(34,197,94,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">active · token 42</text>
        <rect x="175" y="96" width="100" height="38" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" strokeDasharray="5,3"/>
        <text x="225" y="113" fill="#ef4444" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Worker B</text>
        <text x="225" y="127" fill="rgba(239,68,68,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">stale · token 41</text>
        <rect x="340" y="56" width="120" height="38" rx="6" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.45)" strokeWidth="1.5"/>
        <text x="400" y="72" fill="#a78bfa" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">Fencing Token</text>
        <text x="400" y="86" fill="rgba(167,139,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">current=42</text>
        <rect x="520" y="40" width="110" height="90" rx="6" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5"/>
        <text x="575" y="68" fill="#60a5fa" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">PostgreSQL</text>
        <text x="575" y="82" fill="rgba(96,165,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">UNIQUE(job_id,</text>
        <text x="575" y="94" fill="rgba(96,165,250,0.5)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">fencing_token)</text>
        <rect x="530" y="100" width="90" height="20" rx="4" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.6)" strokeWidth="1"/>
        <text x="575" y="114" fill="#ef4444" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">WRITE REJECTED</text>
        <line x1="120" y1="70" x2="173" y2="62" stroke="rgba(96,165,250,0.7)" strokeWidth="1.5" markerEnd="url(#fl-arr)"/>
        <line x1="275" y1="59" x2="338" y2="68" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" markerEnd="url(#fl-arr-grn)"/>
        <line x1="460" y1="64" x2="518" y2="70" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" markerEnd="url(#fl-arr-grn)"/>
        <line x1="120" y1="80" x2="173" y2="108" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#fl-arr-red)"/>
        <line x1="275" y1="115" x2="338" y2="82" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#fl-arr-red)"/>
        <line x1="460" y1="78" x2="518" y2="108" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#fl-arr-red)"/>
        <rect x="20" y="168" width="660" height="70" rx="8" fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.15)" strokeWidth="1"/>
        <text x="36" y="188" fill="rgba(34,197,94,0.6)" fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5">CORRECTNESS GUARANTEES</text>
        {[
          { x: 36,  y: 208, text: "✓ UNIQUE(job_id, fencing_token)", color: "#22c55e" },
          { x: 36,  y: 222, text: "✓ 0.0% DUPLICATE COMMITS", color: "#22c55e" },
          { x: 260, y: 208, text: "✓ STALE WRITES REJECTED", color: "#22c55e" },
          { x: 260, y: 222, text: "✓ 1,500+ SCENARIOS VALIDATED", color: "#60a5fa" },
          { x: 484, y: 208, text: "✓ FENCING TOKEN: ACTIVE", color: "#60a5fa" },
          { x: 484, y: 222, text: "✓ 37 DUPLICATES PREVENTED", color: "#22c55e" },
        ].map(t => (
          <text key={t.text} x={t.x} y={t.y} fill={t.color} fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{t.text}</text>
        ))}
      </svg>
    ),

    kubepulse: (
      <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="200" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(245,158,11,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">KUBEPULSE · RELEASE HEALTH GATE</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {[
          { x: 20,  label: "Readiness Probe", val: "healthy ✓", color: "#22c55e" },
          { x: 190, label: "p95 Latency",     val: "+608% ✗",   color: "#ef4444" },
          { x: 360, label: "Error Rate",       val: "+2.1% ✗",   color: "#ef4444" },
          { x: 530, label: "SLO Gate",         val: "BLOCK",      color: "#ef4444" },
        ].map(n => (
          <g key={n.label}>
            <rect x={n.x} y="46" width="155" height="52" rx="7" fill="rgba(255,255,255,0.03)" stroke={n.color} strokeOpacity="0.4" strokeWidth="1.5"/>
            <text x={n.x+77} y="68" fill={n.color} fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{n.val}</text>
            <text x={n.x+77} y="83" fill="rgba(255,255,255,0.3)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{n.label}</text>
          </g>
        ))}
        <text x="350" y="128" fill="#ef4444" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">SAFE_TO_OPERATE: FALSE · RELEASE BLOCKED</text>
        <text x="36" y="164" fill="rgba(34,197,94,0.6)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">✓ AMD MI300X +608% p95 blocked · probe integrity check · dependency health gates · rollback signal</text>
      </svg>
    ),

    faireval: (
      <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="200" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(167,139,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">FAIREVAL · AI RELEASE GOVERNANCE PLATFORM</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {[
          { x: 20,  label: "RAG Groundedness", val: "0.367",   color: "#f59e0b" },
          { x: 190, label: "Pass Rate",          val: "40%",    color: "#ef4444" },
          { x: 360, label: "AMD p95 Δ",          val: "+47.1%", color: "#ef4444" },
          { x: 530, label: "Decision",           val: "BLOCK",  color: "#ef4444" },
        ].map(n => (
          <g key={n.label}>
            <rect x={n.x} y="46" width="155" height="52" rx="7" fill="rgba(255,255,255,0.03)" stroke={n.color} strokeOpacity="0.4" strokeWidth="1.5"/>
            <text x={n.x+77} y="68" fill={n.color} fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{n.val}</text>
            <text x={n.x+77} y="83" fill="rgba(255,255,255,0.3)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{n.label}</text>
          </g>
        ))}
        <text x="350" y="128" fill="#a78bfa" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">p=0.0 STATISTICAL SIGNIFICANCE · RELEASE BLOCKED</text>
        <text x="36" y="164" fill="rgba(167,139,250,0.6)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">✓ Live HuggingFace API · Zenodo published · Welch t-test + chi-squared · dataset drift detected</text>
      </svg>
    ),

    agentgrid: (
      <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="160" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">AGENTGRID · AGENT OBSERVABILITY PLATFORM</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {[
          { x: 20,  label: "Retrieval Hit Rate", val: "0.80", color: "#60a5fa" },
          { x: 190, label: "Tool Success",        val: "0.80", color: "#22c55e" },
          { x: 360, label: "Tests Passing",       val: "56",   color: "#22c55e" },
          { x: 530, label: "p95 Latency",         val: "880ms",color: "#a78bfa" },
        ].map(n => (
          <g key={n.label}>
            <rect x={n.x} y="46" width="155" height="52" rx="7" fill="rgba(255,255,255,0.03)" stroke={n.color} strokeOpacity="0.3" strokeWidth="1"/>
            <text x={n.x+77} y="68" fill={n.color} fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{n.val}</text>
            <text x={n.x+77} y="83" fill="rgba(255,255,255,0.3)" fontSize="7.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{n.label}</text>
          </g>
        ))}
        <text x="36" y="128" fill="rgba(96,165,250,0.6)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">✓ PySpark trace analytics · RAG/tool-calling observability · LangGraph orchestration · 56 passing tests</text>
      </svg>
    ),

    dettrace: (
      <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="160" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(96,165,250,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">DETTRACE · DETERMINISTIC REPLAY ENGINE</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <g key={i}>
            <rect x={20+i*66} y="48" width="52" height="28" rx="5"
              fill={i===3?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.03)"}
              stroke={i===3?"rgba(239,68,68,0.6)":"rgba(255,255,255,0.08)"} strokeWidth="1"/>
            <text x={20+i*66+26} y="66" fill={i===3?"#ef4444":"rgba(255,255,255,0.3)"} fontSize="8" fontWeight={i===3?"900":"600"} textAnchor="middle" fontFamily="'JetBrains Mono',monospace">idx {i}</text>
          </g>
        ))}
        <text x="218" y="104" fill="#ef4444" fontSize="8.5" fontWeight="900" fontFamily="'JetBrains Mono',monospace">↑ FIRST DIVERGENCE · GPIO interrupt race</text>
        <text x="36" y="132" fill="rgba(34,197,94,0.6)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">✓ 1.0 confidence · 10k+ trace validations · C++17 deterministic replay · Swift actor analysis</text>
      </svg>
    ),

    accelsim: (
      <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="700" height="160" fill="rgba(5,7,13,0.95)" rx="12"/>
        <text x="20" y="26" fill="rgba(245,158,11,0.7)" fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace" letterSpacing="2">ACCELSIM-LITE · PIPELINE BOTTLENECK CLASSIFICATION</text>
        <line x1="20" y1="34" x2="680" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {["Fetch","Decode","Execute","Memory","Writeback"].map((s,i) => (
          <g key={s}>
            <rect x={20+i*132} y="48" width="110" height="36" rx="6"
              fill={s==="Memory"?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.06)"}
              stroke={s==="Memory"?"rgba(239,68,68,0.5)":"rgba(245,158,11,0.3)"} strokeWidth="1.5"/>
            <text x={20+i*132+55} y="70" fill={s==="Memory"?"#ef4444":"#f59e0b"} fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">{s}</text>
            {i<4 && <text x={20+i*132+115} y="70" fill="rgba(255,255,255,0.2)" fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">→</text>}
          </g>
        ))}
        <text x="350" y="110" fill="#ef4444" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">↑ BOTTLENECK: NoMemoryPort · WaitingDependency</text>
        <text x="36" y="136" fill="rgba(34,197,94,0.6)" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">✓ 25.65× pointer slowdown · 2.4× throughput degradation · REGRESSION GATE: PASS</text>
      </svg>
    ),
  };

  // Bloomberg ticker items
  const tickerItems = [
    { label: "TEMPORAL OSS", val: "+4 PRs MERGED", color: "#22c55e" },
    { label: "FAULTLINE", val: "0.0% DUPLICATES", color: "#22c55e" },
    { label: "KUBEPULSE", val: "+608% BLOCKED", color: "#ef4444" },
    { label: "FAIREVAL", val: "p=0.0 · BLOCK", color: "#a78bfa" },
    { label: "META PE FELLOW", val: "2026", color: "#60a5fa" },
    { label: "FAULTLINE", val: "1,500+ SCENARIOS", color: "#22c55e" },
    { label: "KUBEPULSE", val: "safe_to_operate=false", color: "#ef4444" },
    { label: "AZURE SDK", val: "2 PRs IN REVIEW", color: "#60a5fa" },
    { label: "FAIREVAL", val: "AMD SERVING GATE · BLOCK", color: "#ef4444" },
    { label: "TEMPORAL OSS", val: "GOROUTINE LEAK FIXED", color: "#22c55e" },
  ];

  return (
    <div ref={rootRef} className="page">

      {/* ── NAV ──────────────────────────────────── */}
      <nav className="top-nav" id="top-nav">
        <span className="nav-logo">KB</span>
        <div className="nav-links">
          <a href="#proof"      className="nav-link">Proof</a>
          <a href="#oss"        className="nav-link">Open Source</a>
          <a href="#projects"   className="nav-link">Projects</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#writing"    className="nav-link">Writing</a>
          <a href="#contact"    className="nav-link">Contact</a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero rev" id="hero">
        <div className="hero-split">

          {/* Left */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              Open to roles · New grad · Open to relocation
            </div>

            <h1 className="hero-headline">
              <span className="hl-building">BUILDING SYSTEMS</span>
              <span className="hl-recover">THAT FAIL LOUDLY,</span>
              <span className="hl-block">RECOVER SAFELY.</span>
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

          {/* Right — animated flow + proof console */}
          <div className="hero-right">
            <div className="arch-diagram">
              <div className="arch-header">
                <span className="arch-dot-live"/>
                <span className="arch-title">LIVE SYSTEM · FAULT INJECTION ACTIVE</span>
              </div>
              {/* Animated vertical flow */}
              <div className="hero-flow">
                {["Request","Queue","Worker","DB"].map((node, i) => (
                  <React.Fragment key={node}>
                    <div className={`hf-node hf-node-${i} ${heroFlowStep >= 1 && i === 2 ? "hf-node-fault" : ""}`}>
                      <span className="hf-label">{node}</span>
                      {heroFlowStep >= 1 && i === 2 && <span className="hf-fault-tag">FAULT</span>}
                    </div>
                    {i < 3 && (
                      <div className="hf-arrow">
                        <div className="hf-packet" style={{animationDelay:`${i * 0.6}s`}}/>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <div className={`hf-status-note ${heroFlowStep > 0 ? "hf-note-vis" : ""}`}
                  style={{color: heroFlowLabels[heroFlowStep]?.noteColor || "transparent"}}>
                  {heroFlowLabels[heroFlowStep]?.note || ""}
                </div>
              </div>
              <div className="arch-fault-row">
                <span className="arch-fault-badge">FAULT INJECTED 15%</span>
                <span className="arch-safe-badge">✓ STALE WRITES REJECTED</span>
                <span className="arch-safe-badge">✓ 0.0% DUPLICATES</span>
              </div>
            </div>

            {/* Faultline Status Proof Console */}
            <div className="proof-console">
              <div className="pc-header">
                <span className="con-dot con-red"/><span className="con-dot con-yellow"/><span className="con-dot con-green"/>
                <span className="pc-title">FAULTLINE STATUS</span>
              </div>
              <div className="live-proof-grid">
                {[
                  { val: "15%",    label: "Fault Rate",           color: "#f59e0b" },
                  { val: "0.0%",   label: "Duplicate Rate",       color: "#22c55e" },
                  { val: "1,500+", label: "Scenarios",            color: "#60a5fa" },
                  { val: "0",      label: "Invariant Violations", color: "#22c55e" },
                  { val: "ACTIVE", label: "Fencing Tokens",       color: "#60a5fa" },
                  { val: "PASSING",label: "Decision",             color: "#22c55e" },
                ].map(c => (
                  <div key={c.label} className="lp-card">
                    <div className="lp-val" style={{color: c.color}}>{c.val}</div>
                    <div className="lp-label">{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOOMBERG TICKER STRIP ───────────────── */}
      <div className="bloomberg-ticker">
        <div className="bt-badge">
          <span className="bt-badge-dot"/>
          LIVE
        </div>
        <div className="bt-track-wrap">
          <div className="bt-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="bt-item">
                <span className="bt-item-label">{item.label}</span>
                <span className="bt-item-val" style={{color: item.color}}>{item.val}</span>
                <span className="bt-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUSTED NETWORK ──────────────────────── */}
      <div className="trusted-strip rev">
        <div className="ts-label">Trusted Networks &amp; Contributions</div>
        <div className="ts-logos">
          {[
            { name:"Temporal",            sub:"4 merged PRs",           logo:"https://cdn.simpleicons.org/temporal/white",        type:"img"      },
            { name:"Azure SDK",           sub:"2 PRs under review",     logo:"https://cdn.simpleicons.org/microsoftazure/white",   type:"img"      },
            { name:"Meta × MLH",          sub:"PE Fellow · 2026",       logo:"https://cdn.simpleicons.org/meta/white",             type:"img"      },
            { name:"GitHub",              sub:"Open-source projects",   logo:"https://cdn.simpleicons.org/github/white",           type:"img"      },
            { name:"Hugging Face",        sub:"FairEval published",     logo:"https://cdn.simpleicons.org/huggingface/white",      type:"img"      },
            { name:"Medium",              sub:"12+ technical articles", logo:"https://cdn.simpleicons.org/medium/white",           type:"img"      },
            { name:"Thales",              sub:"100k+ HSM records/run",  initials:"TH",  color:"#60a5fa", bg:"rgba(96,165,250,0.12)", type:"initials" },
            { name:"University of Florida",sub:"MS CS · GPA 3.8",      initials:"UF",  color:"#f97316", bg:"rgba(249,115,22,0.12)", type:"initials" },
            { name:"McKinsey",            sub:"Forward · 2026",         initials:"McK", color:"#22c55e", bg:"rgba(34,197,94,0.10)", type:"initials" },
            { name:"Rewriting the Code",  sub:"Women in Tech",          initials:"RtC", color:"#a78bfa", bg:"rgba(167,139,250,0.12)", type:"initials" },
          ].map(l => (
            <div key={l.name} className="ts-logo-item">
              <div className="ts-logo-icon">
                {l.type === "img" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.logo} alt={l.name} width={36} height={36} className="ts-img" />
                ) : (
                  <div className="ts-initials" style={{color:l.color, background:l.bg, border:`1px solid ${l.color}33`}}>{l.initials}</div>
                )}
              </div>
              <div className="ts-text">
                <div className="ts-name">{l.name}</div>
                <div className="ts-sub">{l.sub}</div>
              </div>
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
            { target: 4,      suffix: "",    label: "Merged OSS PRs",          sub: "Temporal Go SDK · maintainer-reviewed",   color: "blue",   href: "https://github.com/temporalio/sdk-go/pulls?q=is%3Apr+author%3Akritibehl" },
            { target: 0,      suffix: ".0%", label: "Duplicate Commits",        sub: "Faultline · fencing-token correctness",   color: "green",  href: "https://github.com/kritibehl/faultline" },
            { target: 1500,   suffix: "+",   label: "Fault Scenarios",          sub: "5–20% injected fault rate",               color: "blue",   href: "https://github.com/kritibehl/faultline" },
            { target: 100000, suffix: "+",   label: "HSM Records / Run",        sub: "payShield 10K · Luna HSM · Thales",       color: "violet", href: "https://github.com/kritibehl" },
            { target: 608,    suffix: "%",   label: "p95 Regression Blocked",   sub: "AMD MI300X · KubePulse release gate",     color: "red",    href: "https://github.com/kritibehl/KubePulse" },
            { target: 10000,  suffix: "+",   label: "Trace Validations",        sub: "FairEval + DetTrace eval infrastructure", color: "blue",   href: "https://github.com/kritibehl/FairEval-Suite" },
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

      {/* ── OPEN SOURCE IMPACT ───────────────────── */}
      <section className="section rev" id="oss">
        <div className="sec-header">
          <span className="sec-label">01 · Open Source Impact</span>
          <h2 className="sec-title">Open Source Impact</h2>
          <p className="sec-sub">Maintainer-reviewed contributions to production workflow runtimes and cloud SDKs. Correctness, goroutine-safety, tracing, networking bugs.</p>
        </div>

        <div className="oss-impact-grid">
          {/* Temporal */}
          <div className="oss-impact-card oss-ic-blue">
            <div className="oss-ic-header">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.simpleicons.org/temporal/white" alt="Temporal" width={28} height={28} className="oss-ic-logo" />
              <div>
                <div className="oss-ic-name">Temporal Go SDK</div>
                <div className="oss-ic-sub">temporalio/sdk-go</div>
              </div>
              <div className="oss-ic-badge">4 Merged PRs</div>
            </div>
            <div className="oss-ic-tags">
              {["Maintainer Reviewed","Workflow Correctness","Goroutine Safety","Async Tracing","Concurrency Fixes"].map(t => (
                <span key={t} className="oss-ic-tag">{t}</span>
              ))}
            </div>
            <div className="oss-ic-prs">
              {[
                { num:"#2298", title:"Fixed async future chaining where ready futures could still block callers", href:"https://github.com/temporalio/sdk-go/pull/2298" },
                { num:"#2212", title:"Fixed OnWorkflow mock to observe propagated context headers", href:"https://github.com/temporalio/sdk-go/pull/2212" },
                { num:"#2200", title:"Fixed goroutine leak in child-workflow test environment", href:"https://github.com/temporalio/sdk-go/pull/2200" },
                { num:"#2248", title:"Restored workflow poller type assignment in scalable task pollers", href:"https://github.com/temporalio/sdk-go/pull/2248" },
              ].map(pr => (
                <a key={pr.num} href={pr.href} target="_blank" rel="noopener noreferrer" className="oss-ic-pr">
                  <span className="oss-ic-pr-num">{pr.num}</span>
                  <span className="oss-ic-pr-title">{pr.title}</span>
                  <span className="oss-ic-pr-badge oss-pr-merged">✓ Merged</span>
                </a>
              ))}
            </div>
            <a href="https://github.com/temporalio/sdk-go/pulls?q=is%3Apr+author%3Akritibehl" target="_blank" rel="noopener noreferrer" className="oss-view-link" style={{marginTop:"14px",display:"inline-block"}}>View all Temporal PRs ↗</a>
          </div>

          {/* Azure */}
          <div className="oss-impact-card oss-ic-azure">
            <div className="oss-ic-header">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.simpleicons.org/microsoftazure/white" alt="Azure" width={28} height={28} className="oss-ic-logo" />
              <div>
                <div className="oss-ic-name">Azure SDK for Go</div>
                <div className="oss-ic-sub">Azure/azure-sdk-for-go</div>
              </div>
              <div className="oss-ic-badge oss-ic-badge-review">2 Under Review</div>
            </div>
            <div className="oss-ic-tags">
              {["Networking","HTTP Runtime","W3C Trace Context","OpenTelemetry","Error Propagation"].map(t => (
                <span key={t} className="oss-ic-tag">{t}</span>
              ))}
            </div>
            <div className="oss-ic-prs">
              {[
                { num:"#26051", title:"Surfaced silently dropped transport errors in azcore retry policy", href:"https://github.com/Azure/azure-sdk-for-go/pull/26051" },
                { num:"#26106", title:"Implemented W3C Trace Context propagation in azcore HTTP tracing", href:"https://github.com/Azure/azure-sdk-for-go/pull/26106" },
              ].map(pr => (
                <a key={pr.num} href={pr.href} target="_blank" rel="noopener noreferrer" className="oss-ic-pr">
                  <span className="oss-ic-pr-num oss-pr-num-az">{pr.num}</span>
                  <span className="oss-ic-pr-title">{pr.title}</span>
                  <span className="oss-ic-pr-badge oss-pr-review">⟳ In Review</span>
                </a>
              ))}
            </div>
            <a href="https://github.com/Azure/azure-sdk-for-go/pulls?q=is%3Apr+author%3Akritibehl" target="_blank" rel="noopener noreferrer" className="oss-view-link" style={{marginTop:"14px",display:"inline-block"}}>View all Azure PRs ↗</a>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────── */}
      <section className="section rev" id="experience">
        <div className="sec-header">
          <span className="sec-label">02 · Experience</span>
          <h2 className="sec-title">Experience</h2>
        </div>
        <div className="exp-list">
          <div className="exp-card exp-card-primary current">
            <div className="exp-top">
              <div>
                <div className="exp-role">Software Developer <span className="exp-badge">Current</span></div>
                <div className="exp-co">VLink · Remote</div>
              </div>
              <div className="exp-dates">May 2026 – Present</div>
            </div>
            <p className="exp-summary">Building LangGraph/LangChain RAG orchestration and retrieval evaluation workflows for internal AI systems.</p>
            <div className="exp-chips">
              {["LangGraph","LangChain","RAG","Vector Retrieval","Agent Evaluation"].map(c => <span key={c} className="exp-chip">{c}</span>)}
            </div>
          </div>
          <div className="exp-card exp-card-primary">
            <div className="exp-top">
              <div>
                <div className="exp-role">Production Engineering Fellow</div>
                <div className="exp-co">Meta × MLH Fellowship</div>
              </div>
              <div className="exp-dates">Jun – Sep 2026</div>
            </div>
            <p className="exp-summary">Selected for Meta&apos;s Production Engineering Fellowship focused on Linux systems, reliability engineering, operational debugging, and infrastructure.</p>
            <div className="exp-chips">
              {["Linux Systems","Reliability Engineering","Operational Debugging","Infrastructure"].map(c => <span key={c} className="exp-chip">{c}</span>)}
            </div>
          </div>
          <div className="exp-card exp-card-primary">
            <div className="exp-top">
              <div>
                <div className="exp-role">Software Engineering Intern</div>
                <div className="exp-co">Thales Group · Remote</div>
              </div>
              <div className="exp-dates">May – Aug 2025</div>
            </div>
            <p className="exp-summary">Built a hardware-accelerated HSM data pipeline processing 100k+ records per run across payShield 10K and Luna HSM systems with FastAPI and Redis orchestration.</p>
            <div className="exp-metrics-row">
              {[{ val:"100k+",lbl:"HSM Records/Run"},{ val:"3k+",lbl:"Weekly Events"},{ val:"20+",lbl:"Validation Checks"}].map(m => (
                <div key={m.lbl} className="exp-metric-chip">
                  <span className="exp-metric-val">{m.val}</span>
                  <span className="exp-metric-lbl">{m.lbl}</span>
                </div>
              ))}
            </div>
            <div className="exp-chips" style={{marginTop:"10px"}}>
              {["FastAPI","Redis","Human-review gates","20+ validation checks"].map(c => <span key={c} className="exp-chip exp-chip-sm">{c}</span>)}
            </div>
          </div>
          <div className="exp-card exp-card-secondary">
            <div className="exp-top">
              <div>
                <div className="exp-role exp-role-sm">Graduate Assistant</div>
                <div className="exp-co exp-co-sm">University of Florida · Gainesville, FL</div>
              </div>
              <div className="exp-dates">Jan – Dec 2025</div>
            </div>
            <p className="exp-summary-sm">Supported operations for a scheduling system serving 600–800 weekly users; coordinated issue resolution and service continuity.</p>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY — COMPACT HORIZONTAL ────── */}
      <section className="section rev" id="how">
        <div className="sec-header">
          <span className="sec-label">Methodology</span>
          <h2 className="sec-title">How I Build Failure-Aware Systems</h2>
        </div>
        <div className="method-cards-row">
          {[
            { icon: "⚡", step: "BREAK",    desc: "Define failure modes first. Stale writes. Silent regressions. Goroutine leaks." },
            { icon: "◎",  step: "DETECT",   desc: "Instrument for failure. Fencing tokens, SLO gates, eval pipelines." },
            { icon: "✓",  step: "VALIDATE", desc: "1,500+ fault scenarios, 10k+ trace validations. Not mocks." },
            { icon: "⬛", step: "DECIDE",   desc: "A decision. BLOCK. REJECT. ESCALATE — not just an alert." },
            { icon: "↺",  step: "REPLAY",   desc: "Deterministic replay. First-divergence isolation. Leave a trail." },
          ].map(s => (
            <div key={s.step} className="method-card">
              <div className="mc-icon">{s.icon}</div>
              <div className="mc-step">{s.step}</div>
              <div className="mc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAULTLINE HERO PROJECT ───────────────── */}
      <section className="section" id="faultline-hero">
        <div className="sec-header rev">
          <span className="sec-label">Flagship · Distributed Systems</span>
          <h2 className="sec-title">Faultline</h2>
          <p className="sec-sub">Distributed correctness under failure — 0.0% duplicate commits at 15% injected fault rate.</p>
        </div>

        <div className="faultline-hero-layout rev">
          {/* Left: Architecture */}
          <div className="fhl-left">
            <div className="fhl-arch-label">Architecture</div>
            {visuals["faultline"]}

            {/* Animated fencing token flow */}
            <div className="fence-flow-panel">
              <div className="ffp-header">
                <span className="con-dot con-red"/><span className="con-dot con-yellow"/><span className="con-dot con-green"/>
                <span className="ffp-title">FENCING TOKEN FLOW · LIVE</span>
              </div>
              <div className="fence-rows">
                {/* Worker A — ACCEPT */}
                <div className={`fence-row ${fenceStep >= 0 ? "fence-row-vis" : ""}`}>
                  <span className="fence-worker fence-worker-a">Worker A</span>
                  <span className="fence-arrow">→</span>
                  <span className={`fence-token ${fenceStep >= 1 ? "fence-tok-active" : ""}`}>token 42</span>
                  <span className="fence-arrow">→</span>
                  <span className={`fence-result fence-accept ${fenceStep >= 2 ? "fence-result-vis" : ""}`}>✓ ACCEPT</span>
                </div>
                {/* Worker B — REJECT */}
                <div className={`fence-row ${fenceStep >= 3 ? "fence-row-vis" : ""}`}>
                  <span className="fence-worker fence-worker-b">Worker B</span>
                  <span className="fence-arrow">→</span>
                  <span className={`fence-token fence-tok-stale ${fenceStep >= 4 ? "fence-tok-active" : ""}`}>token 41</span>
                  <span className="fence-arrow">→</span>
                  <span className={`fence-result fence-reject ${fenceStep >= 5 ? "fence-result-vis" : ""}`}>✗ REJECT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="fhl-right">
            <div className="fhl-metrics-label">Proof Metrics</div>
            <div className="fhl-metrics">
              {[
                { val: "0.0%",   label: "Duplicate Commits",            color: "#22c55e", sub: "vs 1–2.5% naive baseline" },
                { val: "1,500+", label: "Fault Scenarios",              color: "#60a5fa", sub: "5–20% injected fault rate" },
                { val: "0",      label: "Invariant Violations",         color: "#22c55e", sub: "across all test runs" },
                { val: "37",     label: "Duplicate Deliveries Prevented", color: "#22c55e", sub: "concrete correctness cases" },
              ].map(m => (
                <div key={m.label} className="fhl-metric">
                  <div className="fhl-m-val" style={{color: m.color}}>{m.val}</div>
                  <div className="fhl-m-label">{m.label}</div>
                  <div className="fhl-m-sub">{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="pcb" style={{marginTop:"24px"}}>
              <div className="pcb-row"><span className="pcb-l">Problem</span><span className="pcb-t">Stale workers commit outdated results after lease takeover. Lease expiry stops new claims, not a worker already holding a reference from writing late.</span></div>
              <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">PostgreSQL fencing-token validation via UNIQUE(job_id, fencing_token), fault-injection proxy, reconciler, 29-assertion drill suite, k6 load tests, 11 Prometheus metrics.</span></div>
              <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">0.0% duplicate commits under 5–20% injected fault rate · 1,500+ failure scenarios · 0 invariant violations · naive baseline: 1.0–2.5%</span></div>
            </div>

            <div className="pf-links" style={{marginTop:"18px"}}>
              <a href="https://github.com/kritibehl/faultline" target="_blank" rel="noopener noreferrer" className="pcf-link-btn">GitHub ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────── */}
      <section className="section" id="projects">
        <div className="sec-header rev">
          <span className="sec-label">03 · Engineering Systems</span>
          <h2 className="sec-title">All Projects</h2>
          <p className="sec-sub">Problem → What I built → Verified numbers. Each project is a proof artifact, not a demo.</p>
        </div>

        <div className="filter-tabs rev">
          {filters.map(f => (
            <button key={f.id} className={`filter-tab${activeFilter === f.id ? " active" : ""}`} onClick={() => setActiveFilter(f.id)}>{f.label}</button>
          ))}
        </div>

        {(activeFilter === "all" || visible.some(p => p.flagship)) && (
          <div className="proj-group-label rev">Flagship</div>
        )}

        <div className="proj-flagship-list">
          {visible.filter(p => p.flagship).map(p => (
            <div key={p.id} className="proj-flagship rev">
              {(p as {proofBadges?: string[]}).proofBadges && (
                <div className="pf-proof-badges">
                  {(p as {proofBadges: string[]}).proofBadges.map(b => (
                    <span key={b} className="pf-proof-badge">✓ {b}</span>
                  ))}
                </div>
              )}
              <div className="proj-visual">{visuals[p.visual]}</div>
              <div className="pf-header">
                <div>
                  <h3 className="pf-title">{p.title}</h3>
                  <div className="pf-tagline">{p.tagline}</div>
                </div>
                <div className="pf-tags">{p.tags.slice(0,5).map(t => <span key={t} className="pf-tag">{t}</span>)}</div>
              </div>
              <div className="pf-metrics">
                {p.metrics.map(m => (
                  <div key={m.label} className={`pf-metric pf-m-${m.color}`}>
                    <div className="pfm-val">{m.val}</div>
                    <div className="pfm-label">{m.label}</div>
                  </div>
                ))}
              </div>
              {(p as {evalCards?: {label:string;val:string;color:string;icon:string}[]}).evalCards && (
                <div className="eval-cards-row">
                  {(p as {evalCards:{label:string;val:string;color:string;icon:string}[]}).evalCards.map(ec => (
                    <div key={ec.label} className={`eval-card eval-card-${ec.color}`}>
                      <div className="eval-card-icon">{ec.icon}</div>
                      <div className="eval-card-val" style={{color: ec.color==="amber"?"#f59e0b":ec.color==="red"?"#ef4444":"#22c55e"}}>{ec.val}</div>
                      <div className="eval-card-label">{ec.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="pcb">
                <div className="pcb-row"><span className="pcb-l">Problem</span><span className="pcb-t">{p.problem}</span></div>
                <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">{p.built}</span></div>
                <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">{p.verified}</span></div>
              </div>
              <div className="pf-links">
                {(p.links as [string, string][]).map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="pcf-link-btn">{label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {visible.some(p => !p.flagship) && (
          <>
            <div className="proj-group-label rev" style={{marginTop:"40px"}}>Supporting Systems</div>
            <div className="proj-support-grid">
              {visible.filter(p => !p.flagship).map(p => (
                p.id === "accelsim" ? (
                  <div key={p.id} className="proj-support rev" style={{gridColumn:"1 / -1"}}>
                    <div className="accelsim-wide">
                      <div>
                        <h3 className="ps-title" style={{marginBottom:"6px"}}>{p.title}</h3>
                        <div className="ps-tagline" style={{marginBottom:"16px"}}>{p.tagline}</div>
                        <div className="accelsim-pipeline">
                          <div style={{fontSize:"0.58rem",color:"rgba(96,165,250,0.6)",fontFamily:"var(--mono)",letterSpacing:"1px",marginBottom:"10px",textTransform:"uppercase"}}>Pipeline Bottleneck Analysis</div>
                          <div className="accelsim-stages">
                            {["Fetch","Decode","Execute","Memory","Writeback"].map((s, i, arr) => (
                              <React.Fragment key={s}><span className="accelsim-stage">{s}</span>{i < arr.length - 1 && <span className="accelsim-arrow">→</span>}</React.Fragment>
                            ))}
                          </div>
                          <div className="accelsim-bottleneck">Detected stall classes:</div>
                          <div className="accelsim-stalls">
                            <span className="accelsim-stall">NoMemoryPort</span>
                            <span className="accelsim-stall">WaitingDependency</span>
                            <span className="accelsim-stall">MEMORY BOUND</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="accelsim-metrics" style={{marginTop:"34px"}}>
                          <div className="accelsim-metric"><div className="accelsim-mval">25.65×</div><div className="accelsim-mlbl">Pointer slowdown</div></div>
                          <div className="accelsim-metric"><div className="accelsim-mval">2.4×</div><div className="accelsim-mlbl">Throughput degradation</div></div>
                          <div className="accelsim-metric green"><div className="accelsim-mval">PASS</div><div className="accelsim-mlbl">Regression gate</div></div>
                        </div>
                        <div className="pf-links" style={{marginTop:"16px"}}>
                          {(p.links as [string, string][]).map(([label, href]) => (
                            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="pcf-link-btn">{label}</a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={p.id} className="proj-support rev">
                    <div className="proj-visual-sm">{visuals[p.visual]}</div>
                    <h3 className="ps-title">{p.title}</h3>
                    <div className="ps-tagline">{p.tagline}</div>
                    {(p as {proofBadges?: string[]}).proofBadges && (
                      <div className="ps-proof-badges">
                        {(p as {proofBadges: string[]}).proofBadges.map(b => <span key={b} className="ps-proof-badge">✓ {b}</span>)}
                      </div>
                    )}
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
                )
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── PROJECT EVIDENCE ─────────────────────── */}
      <section className="section rev" id="evidence">
        <div className="sec-header">
          <span className="sec-label">Verified Proof</span>
          <h2 className="sec-title">Project Evidence</h2>
        </div>
        <div className="evidence-grid">
          {[
            { project:"Faultline", color:"green", items:[
              { label:"0.0% Duplicate Commits", href:"https://github.com/kritibehl/faultline" },
              { label:"1,500+ Failure Scenarios", href:"https://github.com/kritibehl/faultline" },
              { label:"37 Duplicate Deliveries Prevented", href:"https://github.com/kritibehl/faultline" },
              { label:"29-assertion Drill Suite", href:"https://github.com/kritibehl/faultline" },
            ]},
            { project:"KubePulse", color:"red", items:[
              { label:"+608% p95 Regression Blocked", href:"https://github.com/kritibehl/KubePulse" },
              { label:"Canary Analysis Engine", href:"https://github.com/kritibehl/KubePulse" },
              { label:"Dependency Health Gates", href:"https://github.com/kritibehl/KubePulse" },
              { label:"safe_to_operate=false", href:"https://github.com/kritibehl/KubePulse" },
            ]},
            { project:"FairEval", color:"violet", items:[
              { label:"Zenodo Research Artifact", href:"https://doi.org/10.5281/zenodo.17625268" },
              { label:"Live API on HuggingFace", href:"https://huggingface.co/spaces/kriti0608/FairEval-Suite" },
              { label:"Statistical Release Gate p=0.0", href:"https://github.com/kritibehl/FairEval-Suite" },
              { label:"AMD Serving Gate · BLOCK", href:"https://github.com/kritibehl/FairEval-Suite" },
            ]},
            { project:"AgentGrid", color:"blue", items:[
              { label:"56 Tests Passing", href:"https://github.com/kritibehl/agentgrid-demo" },
              { label:"Live Trace Analytics", href:"https://agentgrid-seven.vercel.app/" },
              { label:"PySpark Processing Pipeline", href:"https://github.com/kritibehl/agentgrid-demo" },
              { label:"0.80 Retrieval Hit Rate", href:"https://agentgrid-seven.vercel.app/" },
            ]},
          ].map(e => (
            <div key={e.project} className={`ev-card ev-${e.color}`}>
              <div className="ev-title">{e.project}</div>
              <div className="ev-items">
                {e.items.map(item => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="ev-item">
                    <span className="ev-check">✓</span>
                    <span className="ev-item-label">{item.label}</span>
                    <span className="ev-arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI SYSTEMS ───────────────────────────── */}
      <section className="section rev" id="ai-systems">
        <div className="sec-header">
          <span className="sec-label">AI Infrastructure</span>
          <h2 className="sec-title">AI Systems &amp; Evaluation</h2>
        </div>
        <div className="ai-systems-grid">
          {[
            { name:"FairEval", desc:"Release governance, Responsible AI gates, RAG groundedness, statistical regression checks.", href:"https://github.com/kritibehl/FairEval-Suite", chips:["RAG evaluation","Release governance","Responsible AI","Statistical gating"], color:"violet" },
            { name:"AgentGrid", desc:"Agent observability, retrieval analytics, trace dashboards, PySpark processing.", href:"https://agentgrid-seven.vercel.app/", chips:["Agent observability","Retrieval analytics","LangGraph","PySpark"], color:"blue" },
            { name:"VLink RAG", desc:"LangGraph/LangChain orchestration, retrieval architecture evaluation, agent-execution patterns.", href:"#experience", chips:["LangGraph","LangChain","RAG orchestration","Agent evaluation"], color:"green" },
          ].map(s => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`ais-card ais-${s.color}`}>
              <div className="ais-name">{s.name}</div>
              <div className="ais-desc">{s.desc}</div>
              <div className="ais-chips">{s.chips.map(c => <span key={c} className="ais-chip">{c}</span>)}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SKILLS — COMPACT ─────────────────────── */}
      <section className="section rev" id="skills">
        <div className="sec-header">
          <span className="sec-label">04 · Stack</span>
          <h2 className="sec-title">Skills &amp; Stack</h2>
        </div>
        <div className="skills-compact">
          {[
            { cat:"Languages",         items:["Python","Go","C++17","SQL","Java"] },
            { cat:"AI / Evaluation",   items:["RAI gates","RAG groundedness","Hallucination checks","Tool-call validation","Latency governance"] },
            { cat:"Backend",           items:["FastAPI","PostgreSQL","Redis","LangGraph","SQLAlchemy"] },
            { cat:"Reliability / SRE", items:["Prometheus","OpenTelemetry","Jaeger","k6","Release gates","SLO validation"] },
            { cat:"Cloud / Infra",     items:["Docker","GitHub Actions","Cloud Run","Kubernetes","Terraform"] },
            { cat:"Systems",           items:["C++17","CMake","GoogleTest","Deterministic replay","Cache/locality"] },
          ].map(s => (
            <div key={s.cat} className="sc-row">
              <div className="sc-cat">{s.cat}</div>
              <div className="sc-chips">{s.items.map(i => <span key={i} className="sc-chip">{i}</span>)}</div>
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
        <div className="programs-row">
          {[
            { org:"Meta × MLH",             detail:"PE Fellow · 2026",  logo:"https://cdn.simpleicons.org/meta/white",  type:"img", color:"#1877f2" },
            { org:"University of Florida",   detail:"MS CS · GPA 3.8",  initials:"UF",  color:"#f97316", type:"initials" },
            { org:"McKinsey Forward",        detail:"Selected · 2026",   initials:"McK", color:"#22c55e", type:"initials" },
            { org:"Rewriting the Code",      detail:"Women in Tech",     initials:"RtC", color:"#a78bfa", type:"initials" },
          ].map(p => (
            <div key={p.org} className="prog-row-card">
              {p.type === "img"
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={p.logo} alt={p.org} width={28} height={28} className="prog-row-logo" />
                : <div className="prog-row-initials" style={{color:p.color,background:`${p.color}18`,border:`1px solid ${p.color}44`}}>{p.initials}</div>
              }
              <div>
                <div className="prog-row-name">{p.org}</div>
                <div className="prog-row-detail">{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WRITING ──────────────────────────────── */}
      <section className="section rev" id="writing">
        <div className="sec-header">
          <span className="sec-label">06 · Engineering Writing</span>
          <h2 className="sec-title">Engineering Writing</h2>
          <p className="sec-sub">Lessons from building systems that fail, recover, and evolve in production.</p>
        </div>
        <div className="writing-stats rev">
          <div className="wst-item"><span className="wst-val">12+</span><span className="wst-label">Technical Articles</span></div>
          <div className="wst-div"/>
          <div className="wst-item"><span className="wst-val">20k+</span><span className="wst-label">Words Published</span></div>
          <div className="wst-div"/>
          <div className="wst-topics">Distributed Systems · Reliability · AI Infrastructure</div>
        </div>
        <div className="writing-cards">
          {[
            { href:"https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723", topic:"Distributed Systems", topicColor:"blue", title:"How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and Network Faults", read:"8 min read", coverBg:"linear-gradient(135deg,rgba(56,189,248,0.15) 0%,rgba(5,7,13,0.95) 100%)", coverIcon:"⬡", coverLines:["fencing_token=42","UNIQUE(job_id,token)","0.0% duplicates"] },
            { href:"https://medium.com/@kriti0608/kubernetes-said-everything-was-healthy-it-wasnt-27f7b4b9ed0e", topic:"Reliability Engineering", topicColor:"amber", title:"Kubernetes Said Everything Was Healthy. It Wasn't.", read:"6 min read", coverBg:"linear-gradient(135deg,rgba(245,158,11,0.15) 0%,rgba(5,7,13,0.95) 100%)", coverIcon:"◈", coverLines:["probe: healthy ✓","p95: +608% ✗","safe_to_operate: false"] },
            { href:"https://medium.com/@kriti0608/the-most-dangerous-ai-failures-dont-crash-they-quietly-look-correct-a404e343395a", topic:"AI Infrastructure", topicColor:"violet", title:"The Most Dangerous AI Failures Don't Crash — They Quietly Look Correct", read:"7 min read", coverBg:"linear-gradient(135deg,rgba(167,139,250,0.15) 0%,rgba(5,7,13,0.95) 100%)", coverIcon:"⬛", coverLines:["quality: PASS","hardware: BLOCK","decision: BLOCKED"] },
          ].map(w => (
            <a key={w.href} href={w.href} target="_blank" rel="noopener noreferrer" className={`writing-card wc-${w.topicColor}`}>
              <div className="wc-cover" style={{background:w.coverBg}}>
                <div className="wc-cover-icon">{w.coverIcon}</div>
                <div className="wc-cover-lines">{w.coverLines.map(l => <div key={l} className="wc-cover-line">{l}</div>)}</div>
              </div>
              <div className="wc-body">
                <span className={`wc-topic wc-topic-${w.topicColor}`}>{w.topic}</span>
                <div className="wc-title">{w.title}</div>
                <div className="wc-read">{w.read} · Medium ↗</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────── */}
      <section className="section rev" id="contact">
        <div className="contact-block">
          <div className="cb-eyebrow">Interested in correctness, distributed systems,<br/>reliability engineering, or AI infrastructure?</div>
          <div className="cb-cta-big">Let&apos;s talk.</div>
          <p className="cb-timing">Currently interviewing for 2026 opportunities · New grad · Open to relocation</p>
          <div className="cb-btns-big">
            <a href="https://github.com/kritibehl" target="_blank" rel="noopener noreferrer" className="btn-big btn-big-blue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.simpleicons.org/github/000000" alt="" width={20} height={20} style={{filter:"invert(1)"}}/>GitHub
            </a>
            <a href="https://www.linkedin.com/in/kriti-behl" target="_blank" rel="noopener noreferrer" className="btn-big btn-big-ghost">LinkedIn ↗</a>
            <a href="https://medium.com/@kriti0608" target="_blank" rel="noopener noreferrer" className="btn-big btn-big-ghost">Medium ↗</a>
            <a href="mailto:kriti0608@gmail.com" className="btn-big btn-big-ghost">Email ↗</a>
          </div>
        </div>
      </section>

      <div className="footer-note rev">
        Logos / program names shown for experience, programs, open-source ecosystems, and hosted project platforms.
      </div>
    </div>
  );
}
