"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pref = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function countUp(el: HTMLElement, target: number, dur = 2200) {
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

  const tabs = [
    { id: "all",     label: "All Projects" },
    { id: "ai",      label: "AI Platform / Eval" },
    { id: "backend", label: "Backend / Platform" },
    { id: "sre",     label: "Reliability / SRE" },
    { id: "systems", label: "Systems / Runtime" },
  ];

  const projects = [
    {
      id: "faultline",
      flagship: true,
      lanes: ["backend", "sre"],
      eye: "Faultline · Distributed Systems · Backend · PostgreSQL · SRE",
      impact: "Distributed execution correctness framework preventing stale-worker corruption with PostgreSQL fencing-token validation.",
      title: "Distributed Correctness Platform",
      problem: "Stale workers commit outdated results after lease takeover. Lease expiry stops new claims — it does not stop a worker already holding a reference from writing late.",
      built: "PostgreSQL fencing-token validation via UNIQUE(job_id, fencing_token), fault-injection proxy, reconciler, 29-assertion drill suite, k6 load tests, 11 Prometheus metrics, observability stack.",
      verified: "0.0% duplicate commits under 5–20% injected fault rate · 1,500+ failure scenarios · 0 invariant violations · naive baseline: 1.0–2.5% duplicate rate",
      proves: "I can reason about distributed correctness, race conditions, and database-backed failure safety under real injected failures.",
      tags: ["PostgreSQL","Distributed systems","Go","Python","Observability","k6","Correctness"],
      metrics: [
        { val: "0.0%", label: "Duplicate commits", green: true },
        { val: "1,500+", label: "Fault scenarios" },
        { val: "0", label: "Invariant violations", green: true },
      ],
      links: [["↗ GitHub","https://github.com/kritibehl/faultline"]],
      visual: "faultline",
    },
    {
      id: "kubepulse",
      flagship: true,
      lanes: ["sre", "backend"],
      eye: "KubePulse + NetRouteLab · Kubernetes · Release Safety · SRE",
      impact: "Cloud-native release-safety platform that blocks unsafe deployments using rollout gates, dependency checks, and network-path validation.",
      title: "Release Safety Validation Platform",
      problem: "Readiness probes report healthy while latency spikes, error rates rise, or dependency cascades degrade real traffic silently.",
      built: "Baseline-vs-degraded comparison engine, SLO gate, probe integrity check, DNS/TCP/TLS diagnostics, dependency risk scoring, rollback recommendations — CI/CD integrable.",
      verified: "+333% p95 drift caught with probes green · AMD MI300X: +608% p95 regression blocked · safe_to_operate=false generated · network-aware release decision report",
      proves: "I can turn unreliable health checks into release-blocking operational decisions, extended to GPU inference serving.",
      tags: ["Kubernetes","CI/CD","Release gates","Terraform","Python","DNS/TLS","Rollback"],
      metrics: [
        { val: "+608%", label: "p95 regression blocked", green: false },
        { val: "+333%", label: "p95 drift detected" },
        { val: "BLOCK", label: "Safe to operate", green: false, red: true },
      ],
      links: [["↗ GitHub","https://github.com/kritibehl/KubePulse"]],
      visual: "kubepulse",
    },
    {
      id: "faireval",
      flagship: true,
      lanes: ["ai"],
      eye: "FairEval-Suite · AI Evaluation · Responsible AI · ML Platform",
      impact: "AI release-safety platform with Responsible AI gates, RAG groundedness metrics, regression views, and hardware-aware serving gates.",
      title: "AI Release Safety & Evaluation Platform",
      problem: "Most GenAI failures are silent: unsupported claims, hallucinated facts, and latency regressions can ship unless evaluation is treated like release infrastructure.",
      built: "FastAPI eval APIs + React dashboards with RAI gates, RAG groundedness metrics, Welch t-test + chi-squared significance testing, 10-case regression library, hardware-aware serving gate, CI release gate.",
      verified: "Gemini Flash: 0.367 avg / 40% pass → BLOCK · AMD serving: p95 +47.1% → BLOCK despite quality pass · p=0.0 on both statistical tests · Zenodo report published",
      proves: "I can build AI release gates that catch hallucination, safety, latency, and regression failures before deployment.",
      tags: ["PyTorch","FastAPI","React","RAG eval","Responsible AI","Statistical gating"],
      metrics: [
        { val: "p=0.0", label: "Statistical significance", green: true },
        { val: "BLOCK", label: "AMD serving gate", red: true },
        { val: "40%", label: "Pass rate → blocked" },
      ],
      links: [["↗ GitHub","https://github.com/kritibehl/FairEval-Suite"],["↗ Live Demo","https://huggingface.co/spaces/kriti0608/FairEval-Suite"],["↗ Zenodo","https://doi.org/10.5281/zenodo.17625268"]],
      visual: "faireval",
    },
    {
      id: "agentgrid",
      flagship: false,
      lanes: ["ai", "backend"],
      eye: "AgentGrid + AutoOps · AI Agents · Operational GenAI",
      impact: "Agent-based operational support platform with agentic workflows, eval gates, trace viewer, incident timeline, and operational dashboard.",
      title: "Operational GenAI Incident Intelligence",
      problem: "Most AI demos stop at generation. This system handles what happens when AI is wrong — no structure, no escalation, no incident record.",
      built: "RAG retrieval → LangGraph workflow → MCP-style tool execution → eval gate → ship/hold/escalate → AutoOps incident ingestion. Live on Cloud Run.",
      verified: "30 passing tests · 9 ship / 10 hold / 6 escalate · 258ms p95 eval latency · 0.88 tool-call success rate · 0 unsafe shipments",
      proves: "I can build agentic AI systems that validate, escalate, and create structured operational intelligence — not just generate.",
      tags: ["FastAPI","LangGraph","AI agents","Eval gates","Cloud Run","AutoOps"],
      metrics: [
        { val: "0", label: "Unsafe shipments", green: true },
        { val: "0.88", label: "Tool-call success" },
        { val: "258ms", label: "p95 eval latency" },
      ],
      links: [["↗ Live Demo","https://agentgrid-seven.vercel.app/"],["↗ AgentGrid","https://github.com/kritibehl/agentgrid"],["↗ AutoOps","https://github.com/kritibehl/AutoOps-Insight"]],
      visual: "agentgrid",
    },
    {
      id: "dettrace",
      flagship: false,
      lanes: ["systems"],
      eye: "DetTrace · Systems Debugging · Replay Diagnostics · C++",
      impact: "Deterministic replay platform isolating the first incorrect event before any visible failure downstream.",
      title: "Replay Diagnostics Platform",
      problem: "Concurrency failures refuse to reproduce. Add a log and the bug disappears. By the time you have data, the interleaving is gone.",
      built: "C++17 deterministic replay engine, Swift actor-isolated analysis, visual trace timeline, SPI/UART/I2C-style replay diagnostics, syscall/process timeline, replay explorer CLI.",
      verified: "GPIO interrupt race: first divergence at index 3 · Timer missed tick: first divergence at index 1 · 1.0 confidence on repeated incident patterns",
      proves: "I can build debuggability infrastructure that turns non-reproducible failures into deterministic, replayable root-cause artifacts.",
      tags: ["C++17","Swift","CMake","Deterministic replay","Trace analysis","Linux"],
      metrics: [
        { val: "1.0", label: "Incident confidence", green: true },
        { val: "Idx 3", label: "First divergence isolated" },
        { val: "0", label: "Missed replays" },
      ],
      links: [["↗ GitHub","https://github.com/kritibehl/dettrace"]],
      visual: "dettrace",
    },
    {
      id: "accelsim",
      flagship: false,
      lanes: ["systems"],
      eye: "AccelSim-Lite · C++ Performance · Runtime Validation",
      impact: "C++ runtime and performance validation platform with named bottleneck classification, benchmark dashboard, and cache/locality studies.",
      title: "C++ Runtime & Performance Platform",
      problem: "Profilers say a workload is slow. They don't say which stage is stalling — or whether adding compute units helps vs. the bottleneck being memory bandwidth.",
      built: "C++17 six-stage pipeline simulator with named stall classification per cycle: WaitingDependency, NoMemoryPort, NoComputeUnit. Benchmark dashboard, cache/locality studies, runtime regression gates.",
      verified: "Pointer-heavy traversal: 25.65× slower than contiguous scan · memory_heavy: 2.4× throughput degradation · runtime regression gate: PASS",
      proves: "I can instrument C++ runtime behavior, identify binding constraints, and build reproducible performance validation workflows.",
      tags: ["C++17","CMake","GoogleTest","Linux","Cache locality","Perf analysis"],
      metrics: [
        { val: "25.65×", label: "Cache miss penalty" },
        { val: "2.4×", label: "Throughput degradation" },
        { val: "PASS", label: "Regression gate", green: true },
      ],
      links: [["↗ GitHub","https://github.com/kritibehl/accelsim-lite"]],
      visual: "accelsim",
    },
  ];

  const visible = activeTab === "all" ? projects : projects.filter(p => p.lanes.includes(activeTab));

  // SVG visuals for each project
  const visuals: Record<string, React.ReactNode> = {
    faultline: (
      <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        {/* Architecture diagram */}
        <rect width="360" height="160" fill="rgba(0,0,0,0.3)" rx="8"/>
        {/* Title */}
        <text x="12" y="18" fill="rgba(96,165,250,0.8)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1">FAULTLINE · ARCHITECTURE</text>
        {/* Nodes */}
        {[
          {x:30, y:50, w:60, label:"Dispatcher", color:"#3b82f6"},
          {x:150, y:30, w:60, label:"Worker A", color:"#22c55e"},
          {x:150, y:80, w:60, label:"Worker B", color:"#ef4444"},
          {x:275, y:50, w:60, label:"PostgreSQL", color:"#a78bfa"},
        ].map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={22} rx="4" fill="rgba(255,255,255,0.05)" stroke={n.color} strokeWidth="1"/>
            <text x={n.x + n.w/2} y={n.y + 14} fill={n.color} fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
        {/* Arrows */}
        <line x1="90" y1="61" x2="148" y2="42" stroke="rgba(59,130,246,0.5)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="90" y1="61" x2="148" y2="90" stroke="rgba(239,68,68,0.5)" strokeWidth="1" strokeDasharray="3,2"/>
        <line x1="210" y1="41" x2="273" y2="55" stroke="rgba(34,197,94,0.5)" strokeWidth="1"/>
        <line x1="210" y1="90" x2="273" y2="62" stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
        <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6Z" fill="rgba(59,130,246,0.7)"/></marker></defs>
        {/* Fencing token box */}
        <rect x="148" y="115" width="64" height="18" rx="3" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.4)" strokeWidth="1"/>
        <text x="180" y="127" fill="#a78bfa" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="700">FENCING TOKEN</text>
        {/* Result bar */}
        <rect x="12" y="135" width="336" height="16" rx="3" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1"/>
        <text x="180" y="146" fill="#22c55e" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="700">0.0% DUPLICATE COMMITS · 1,500+ FAULT SCENARIOS · 0 VIOLATIONS</text>
      </svg>
    ),
    kubepulse: (
      <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="360" height="160" fill="rgba(0,0,0,0.3)" rx="8"/>
        <text x="12" y="18" fill="rgba(96,165,250,0.8)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1">KUBEPULSE · RELEASE DECISION DASHBOARD</text>
        {/* Status banner - BLOCKED */}
        <rect x="12" y="26" width="336" height="28" rx="5" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"/>
        <circle cx="28" cy="40" r="5" fill="#ef4444"/>
        <text x="38" y="44" fill="#ef4444" fontSize="9" fontWeight="900" fontFamily="monospace">SAFE_TO_OPERATE: FALSE — BLOCK RELEASE</text>
        {/* Metric bars */}
        {[
          {label:"p95 Latency", base:100, curr:433, pct:73, color:"#ef4444", text:"+333%"},
          {label:"Error Rate", base:100, curr:180, pct:40, color:"#f59e0b", text:"+80%"},
          {label:"Throughput", base:100, curr:62, pct:38, color:"#22c55e", text:"-38%"},
        ].map((m, i) => (
          <g key={m.label} transform={`translate(12,${66 + i * 25})`}>
            <text x="0" y="10" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="monospace">{m.label}</text>
            <rect x="80" y="2" width="200" height="8" rx="2" fill="rgba(255,255,255,0.06)"/>
            <rect x="80" y="2" width={m.pct * 2} height="8" rx="2" fill={m.color} opacity="0.7"/>
            <text x="288" y="10" fill={m.color} fontSize="8" fontWeight="700" fontFamily="monospace">{m.text}</text>
          </g>
        ))}
        {/* AMD proof */}
        <rect x="12" y="142" width="336" height="14" rx="3" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.25)" strokeWidth="1"/>
        <text x="180" y="152" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="700">AMD MI300X: +608% p95 REGRESSION BLOCKED · GPU INFERENCE GATE</text>
      </svg>
    ),
    faireval: (
      <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="360" height="160" fill="rgba(0,0,0,0.3)" rx="8"/>
        <text x="12" y="18" fill="rgba(96,165,250,0.8)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1">FAIREVAL · AI RELEASE GATE</text>
        {/* Model leaderboard */}
        {[
          {model:"GPT-4o",    score:0.81, pass:true,  color:"#22c55e"},
          {model:"Claude",    score:0.74, pass:true,  color:"#22c55e"},
          {model:"Gemini Pro",score:0.52, pass:false, color:"#f59e0b"},
          {model:"Gemini Flash",score:0.367,pass:false,color:"#ef4444"},
        ].map((m, i) => (
          <g key={m.model} transform={`translate(12,${28 + i * 22})`}>
            <text x="0" y="14" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace" fontWeight="600">{m.model}</text>
            <rect x="90" y="4" width="180" height="10" rx="2" fill="rgba(255,255,255,0.05)"/>
            <rect x="90" y="4" width={m.score * 180} height="10" rx="2" fill={m.color} opacity="0.6"/>
            <text x="276" y="13" fill={m.color} fontSize="7.5" fontFamily="monospace" fontWeight="700">{m.pass ? "PASS" : "BLOCK"}</text>
            <text x="316" y="13" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace">{m.score.toFixed(3)}</text>
          </g>
        ))}
        {/* Responsible AI risk table */}
        <rect x="12" y="120" width="336" height="32" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)"/>
        {[
          {risk:"Hallucination", sev:"HIGH", action:"BLOCK", c:"#ef4444"},
          {risk:"Latency p95", sev:"MED", action:"REVIEW", c:"#f59e0b"},
          {risk:"Groundedness", sev:"LOW", action:"ALLOW", c:"#22c55e"},
        ].map((r, i) => (
          <g key={r.risk} transform={`translate(${20 + i * 112},122)`}>
            <text x="0" y="12" fill="rgba(255,255,255,0.35)" fontSize="6.5" fontFamily="monospace">{r.risk}</text>
            <text x="0" y="22" fill={r.c} fontSize="8" fontFamily="monospace" fontWeight="800">{r.action}</text>
          </g>
        ))}
        <text x="12" y="152" fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="monospace">p=0.0 statistical significance · Zenodo benchmark report published</text>
      </svg>
    ),
    agentgrid: (
      <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="360" height="160" fill="rgba(0,0,0,0.3)" rx="8"/>
        <text x="12" y="18" fill="rgba(96,165,250,0.8)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1">AGENTGRID · AGENTIC WORKFLOW</text>
        {/* Workflow nodes */}
        {[
          {x:10, label:"RAG\nRetrieve", c:"#3b82f6"},
          {x:80, label:"Agent\nReason", c:"#a78bfa"},
          {x:150, label:"Tool\nExecute", c:"#22c55e"},
          {x:220, label:"Eval\nGate", c:"#f59e0b"},
          {x:290, label:"Ship/\nHold", c:"#22c55e"},
        ].map((n,i) => (
          <g key={n.label}>
            <rect x={n.x} y="30" width="58" height="36" rx="5" fill="rgba(255,255,255,0.04)" stroke={n.c} strokeWidth="1"/>
            {n.label.split("\n").map((line, li) => (
              <text key={li} x={n.x+29} y={li===0?46:56} fill={n.c} fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">{line}</text>
            ))}
            {i < 4 && <line x1={n.x+58} y1="48" x2={n.x+80} y2="48" stroke={n.c} strokeWidth="1" opacity="0.5"/>}
          </g>
        ))}
        {/* Dashboard metrics */}
        {[
          {label:"Ship",   val:"9",    c:"#22c55e"},
          {label:"Hold",   val:"10",   c:"#f59e0b"},
          {label:"Escalate",val:"6",   c:"#ef4444"},
          {label:"Tests",  val:"30✓",  c:"#3b82f6"},
          {label:"p95",    val:"258ms",c:"rgba(255,255,255,0.5)"},
        ].map((m,i) => (
          <g key={m.label} transform={`translate(${12 + i*68},82)`}>
            <rect x="0" y="0" width="60" height="38" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
            <text x="30" y="14" fill="rgba(255,255,255,0.35)" fontSize="6.5" textAnchor="middle" fontFamily="monospace">{m.label}</text>
            <text x="30" y="30" fill={m.c} fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">{m.val}</text>
          </g>
        ))}
        <text x="12" y="150" fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="monospace">0 unsafe shipments · 0.88 tool-call success rate · Live on Cloud Run</text>
      </svg>
    ),
    dettrace: (
      <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="360" height="160" fill="rgba(0,0,0,0.3)" rx="8"/>
        <text x="12" y="18" fill="rgba(96,165,250,0.8)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1">DETTRACE · REPLAY TIMELINE</text>
        {/* Timeline events */}
        <line x1="30" y1="80" x2="330" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        {[
          {x:50,  label:"Event 0", sublabel:"Init",          c:"rgba(255,255,255,0.5)", div:false},
          {x:100, label:"Event 1", sublabel:"Interrupt",     c:"rgba(255,255,255,0.5)", div:false},
          {x:150, label:"Event 2", sublabel:"Context save",  c:"rgba(255,255,255,0.5)", div:false},
          {x:200, label:"Event 3", sublabel:"DIVERGENCE",    c:"#ef4444",               div:true},
          {x:255, label:"Event 4", sublabel:"Wrong handler", c:"rgba(239,68,68,0.5)",   div:false},
          {x:305, label:"Event 5", sublabel:"Race",          c:"rgba(239,68,68,0.5)",   div:false},
        ].map(e => (
          <g key={e.label}>
            <circle cx={e.x} cy="80" r={e.div ? 7 : 4} fill={e.c} stroke={e.div ? "#ef4444" : "none"} strokeWidth={e.div ? 2 : 0}/>
            <text x={e.x} y="96" fill={e.div ? "#ef4444" : "rgba(255,255,255,0.35)"} fontSize="6.5" textAnchor="middle" fontFamily="monospace" fontWeight={e.div ? "800" : "500"}>{e.sublabel}</text>
            {e.div && (
              <>
                <line x1={e.x} y1="25" x2={e.x} y2="72" stroke="rgba(239,68,68,0.4)" strokeWidth="1" strokeDasharray="3,2"/>
                <rect x={e.x-28} y="18" width="56" height="14" rx="3" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"/>
                <text x={e.x} y="28" fill="#ef4444" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="900">FIRST DIVERGE</text>
              </>
            )}
          </g>
        ))}
        <text x="12" y="128" fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="monospace">GPIO interrupt race isolated at index 3 · 1.0 confidence · C++17 deterministic replay</text>
        <rect x="12" y="138" width="336" height="14" rx="3" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)"/>
        <text x="180" y="148" fill="#22c55e" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="700">NON-REPRODUCIBLE → DETERMINISTIC ROOT CAUSE</text>
      </svg>
    ),
    accelsim: (
      <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="proj-svg">
        <rect width="360" height="160" fill="rgba(0,0,0,0.3)" rx="8"/>
        <text x="12" y="18" fill="rgba(96,165,250,0.8)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1">ACCELSIM · PIPELINE BOTTLENECK ANALYSIS</text>
        {/* Pipeline stages */}
        {["Fetch","Decode","Execute","Memory","Writeback"].map((s, i) => (
          <g key={s}>
            <rect x={12 + i*68} y="28" width="58" height="20" rx="3" fill={i===3?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.04)"} stroke={i===3?"#ef4444":"rgba(255,255,255,0.1)"} strokeWidth="1"/>
            <text x={12 + i*68 + 29} y="42" fill={i===3?"#ef4444":"rgba(255,255,255,0.45)"} fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">{s}</text>
          </g>
        ))}
        <text x="180" y="68" fill="#ef4444" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="700">↑ BOTTLENECK: MEMORY BOUND</text>
        {/* Cache comparison */}
        {[
          {label:"Contiguous scan", val:95, c:"#22c55e"},
          {label:"Pointer-heavy traversal", val:18, c:"#ef4444"},
        ].map((b,i) => (
          <g key={b.label} transform={`translate(12,${82 + i*26})`}>
            <text x="0" y="14" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">{b.label}</text>
            <rect x="140" y="4" width="180" height="10" rx="2" fill="rgba(255,255,255,0.05)"/>
            <rect x="140" y="4" width={b.val * 1.8} height="10" rx="2" fill={b.c} opacity="0.65"/>
            {i===1 && <text x="328" y="13" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="800">25.65×</text>}
          </g>
        ))}
        <text x="180" y="150" fill="rgba(255,255,255,0.2)" fontSize="6.5" textAnchor="middle" fontFamily="monospace">WaitingDependency · NoMemoryPort · NoComputeUnit · named stall classification</text>
      </svg>
    ),
  };

  return (
    <div ref={rootRef} className="page">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero rev">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          Open to roles · New grad Dec 2025 · Open to relocation
        </div>

        <h1 className="hero-name">Kriti Behl</h1>
        <div className="hero-title">Backend · Platform · Reliability Engineering</div>

        <p className="hero-bio">
          Building correctness-first systems that detect, reproduce,
          and block failures before production.
        </p>

        {/* Big 3 metrics */}
        <div className="hero-big-metrics rev">
          <div className="hbm-card hbm-blue">
            <div className="hbm-num">4</div>
            <div className="hbm-label">Merged Temporal<br/>Go SDK PRs</div>
          </div>
          <div className="hbm-card hbm-green">
            <div className="hbm-num">0.0%</div>
            <div className="hbm-label">Duplicate commits<br/>(Faultline)</div>
          </div>
          <div className="hbm-card hbm-red">
            <div className="hbm-num">+608%</div>
            <div className="hbm-label">p95 regression<br/>blocked (KubePulse)</div>
          </div>
        </div>

        {/* Supporting row */}
        <div className="hero-proof-inline rev">
          {[
            { num: "1,500+", label: "Fault-injected\nscenarios" },
            { num: "10k+",   label: "Trace\nvalidations" },
            { num: "100k+",  label: "HSM records\nper run" },
            { num: "3.8",    label: "GPA · MS CS\nUniversity of Florida" },
            { num: "Meta PE",label: "MLH Fellow\n2026" },
          ].map(({ num, label }) => (
            <div key={label} className="hpi-card">
              <div className="hpi-num">{num}</div>
              <div className="hpi-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="hero-btns">
          <a href="#projects" className="btn btn-primary">View Work →</a>
          <a href="https://agentgrid-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn btn-live">Live Demo ↗</a>
          <a href="https://github.com/kritibehl" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub ↗</a>
          <a href="https://linkedin.com/in/kriti-behl" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">LinkedIn ↗</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Resume ↗</a>
          <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">Email</a>
        </div>
      </section>

      {/* ── CREDIBILITY BAR ──────────────────────── */}
      <div className="cred-strip rev">
        {[
          "Meta Production Engineering Fellow · MLH Fellowship 2026",
          "4 merged Temporal Go SDK PRs · maintainer-reviewed",
          "M.S. CS · University of Florida · GPA 3.8",
          "FairEval Benchmark v1 · Zenodo technical report",
          "Live deployed AI / ops APIs · Cloud Run",
        ].map(item => (
          <div key={item} className="cred-item">
            <span className="cred-dot">◆</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* ── INTERVIEW TOPICS ─────────────────────── */}
      <section className="section rev" id="topics">
        <div className="sec-header">
          <span className="sec-label">Signal · Interview Topics</span>
          <h2 className="sec-title">What I can go deep on</h2>
        </div>
        <div className="topics-grid">
          {[
            { icon: "⬡", label: "Distributed Correctness",  sub: "Fencing tokens · lease expiry · stale-writer prevention" },
            { icon: "◇", label: "Fault Injection",          sub: "1,500+ scenarios · chaos engineering · invariant testing" },
            { icon: "▣", label: "Release Safety",           sub: "SLO gates · rollout blocking · p95 regression detection" },
            { icon: "◈", label: "Replay Debugging",         sub: "Deterministic replay · first-divergence isolation · C++17" },
            { icon: "◉", label: "AI Evaluation",            sub: "Hallucination gates · RAG groundedness · RAI release safety" },
            { icon: "⬙", label: "Observability",            sub: "Prometheus · OpenTelemetry · Jaeger · Loki · Grafana" },
          ].map(t => (
            <div key={t.label} className="topic-card">
              <div className="topic-icon">{t.icon}</div>
              <div className="topic-label">{t.label}</div>
              <div className="topic-sub">{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN SOURCE HIGH ─────────────────────── */}
      <section className="section rev" id="oss">
        <div className="sec-header">
          <span className="sec-label">01 · Open Source Impact</span>
          <h2 className="sec-title">Temporal Go SDK · 4 Merged PRs</h2>
          <p className="sec-sub">
            Maintainer-reviewed contributions to a production workflow runtime used by real engineering teams.
            Not toy fixes — each addresses a correctness, goroutine-safety, or poller-behavior bug.
          </p>
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
            <div key={pr.num} className={`oss-row ${pr.repo === "Azure" ? "azure" : "temporal"}`}>
              <div className={`oss-badge${pr.repo === "Azure" ? " oss-badge-az" : ""}`}>{pr.repo} {pr.num}</div>
              <div className="oss-content">
                <a href={pr.href} target="_blank" rel="noopener noreferrer" className="oss-title">{pr.title}</a>
                <div className="oss-desc">{pr.desc}</div>
              </div>
              <div className={pr.merged ? "oss-merged" : "oss-review"}>{pr.merged ? "✓ Merged" : "⟳ In Review"}</div>
            </div>
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

      {/* ── ENGINEERING PROOF ────────────────────── */}
      <section className="section rev" id="proof">
        <div className="sec-header">
          <span className="sec-label">Engineering Proof</span>
          <h2 className="sec-title">Selected Evidence</h2>
          <p className="sec-sub">Not claims. Proof.</p>
        </div>
        <div className="proof-grid">
          {[
            { val: "4",      unit:"PRs merged",   desc:"Temporal Go SDK · maintainer-reviewed production runtime", color:"blue"   },
            { val: "1,500+", unit:"fault scenarios", desc:"Injected into Faultline under 5–20% fault rate",        color:"blue"   },
            { val: "0.0%",   unit:"duplicate commits", desc:"Faultline under real injected failures",              color:"green"  },
            { val: "+608%",  unit:"p95 blocked",  desc:"AMD MI300X inference regression — release gated",          color:"red"    },
            { val: "10k+",   unit:"trace validations", desc:"FairEval + AgentGrid evaluation infrastructure",      color:"blue"   },
            { val: "100k+",  unit:"HSM records",  desc:"Per run at Thales · payShield 10K · Luna HSM",             color:"violet" },
          ].map(p => (
            <div key={p.val} className={`proof-card proof-${p.color}`}>
              <div className="proof-val">{p.val}</div>
              <div className="proof-unit">{p.unit}</div>
              <div className="proof-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────── */}
      <section className="section" id="projects">
        <div className="sec-header rev">
          <span className="sec-label">03 · Projects</span>
          <h2 className="sec-title">Engineering Systems</h2>
          <p className="sec-sub">
            Flagship projects first — then supporting systems. Each shows: problem → what I built → verified numbers.
          </p>
        </div>

        <div className="role-tabs rev">
          {tabs.map(t => (
            <button key={t.id} className={`role-tab${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Flagship label */}
        {(activeTab === "all" || visible.some(p => p.flagship)) && (
          <div className="proj-group-label rev">Flagship</div>
        )}

        <div className="proj-list-full">
          {visible.filter(p => p.flagship).map((p) => (
            <div key={p.id} className="proj-card-full flagship rev">
              {/* Visual */}
              <div className="proj-visual">
                {visuals[p.visual]}
              </div>
              <div className="pcf-top">
                <div className="pcf-eye">{p.eye}</div>
                <div className="pcf-tags">{p.tags.map(t => <span key={t} className="pcf-tag">{t}</span>)}</div>
              </div>
              <div className="pcf-impact">{p.impact}</div>
              <h3 className="pcf-title">{p.title}</h3>

              {/* Proof metrics row */}
              <div className="proj-metrics">
                {p.metrics.map(m => (
                  <div key={m.label} className={`pm-card${m.green ? " pm-green" : m.red ? " pm-red" : ""}`}>
                    <div className="pm-val">{m.val}</div>
                    <div className="pm-label">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="pcb">
                <div className="pcb-row"><span className="pcb-l">Problem</span><span className="pcb-t">{p.problem}</span></div>
                <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">{p.built}</span></div>
                <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">{p.verified}</span></div>
              </div>

              <div className="pcf-proves"><span className="pcf-proves-label">What this proves · </span>{p.proves}</div>

              <div className="pcf-bottom">
                <div className="pcf-links">
                  {(p.links as [string, string][]).map(([label, href]) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="pcf-link-btn">{label}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting label */}
        {(activeTab === "all" || visible.some(p => !p.flagship)) && visible.some(p => !p.flagship) && (
          <div className="proj-group-label rev" style={{marginTop:"32px"}}>Supporting Systems</div>
        )}

        <div className="proj-list-supporting">
          {visible.filter(p => !p.flagship).map((p) => (
            <div key={p.id} className="proj-card-support rev">
              <div className="proj-visual-sm">
                {visuals[p.visual]}
              </div>
              <div className="pcs-top">
                <div className="pcf-eye">{p.eye}</div>
              </div>
              <h3 className="pcs-title">{p.title}</h3>
              <div className="pcs-impact">{p.impact}</div>

              <div className="proj-metrics-sm">
                {p.metrics.map(m => (
                  <div key={m.label} className={`pms-card${m.green ? " pm-green" : m.red ? " pm-red" : ""}`}>
                    <div className="pms-val">{m.val}</div>
                    <div className="pms-label">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="pcb">
                <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">{p.built}</span></div>
                <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">{p.verified}</span></div>
              </div>

              <div className="pcf-bottom">
                <div className="pcf-links">
                  {(p.links as [string, string][]).map(([label, href]) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="pcf-link-btn">{label}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────── */}
      <section className="section rev" id="skills">
        <div className="sec-header">
          <span className="sec-label">04 · Stack</span>
          <h2 className="sec-title">Skills &amp; Stack</h2>
        </div>
        <div className="skills-grid">
          {[
            { cat:"Languages",              items:["Python","Go","C++17","SQL","Java"] },
            { cat:"AI Evaluation & GenAI",  items:["Responsible AI gates","RAG groundedness","Evaluator drift","Hallucination checks","Tool-call validation","Latency/cost governance"] },
            { cat:"Backend & Platform",     items:["FastAPI","REST","OpenAPI","PostgreSQL","Redis","SQLAlchemy","Pydantic","Node.js","LangGraph"] },
            { cat:"Reliability / SRE",      items:["Prometheus","Grafana","OpenTelemetry","Jaeger","Loki","k6","Release gates","SLO validation"] },
            { cat:"Cloud / Infra",          items:["Docker","GitHub Actions","Cloud Run","Kubernetes","Helm","Terraform","Chaos testing"] },
            { cat:"Systems / Performance",  items:["C++17","CMake","GoogleTest","Linux","Deterministic replay","Cache/locality","Runtime validation"] },
            { cat:"ML",                     items:["PyTorch","HuggingFace","Eval pipelines","Statistical gating"] },
            { cat:"Education",              items:["MS CS · UF · GPA 3.8","Distributed Systems","Networks","Algorithms","Security","NLP"] },
          ].map(s => (
            <div key={s.cat} className="skill-card">
              <div className="sk-cat">{s.cat}</div>
              <div className="sk-chips">{s.items.map(i => <span key={i} className="sk-chip">{i}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMS & COMMUNITIES ───────────────── */}
      <section className="section rev" id="programs">
        <div className="sec-header">
          <span className="sec-label">05 · Programs</span>
          <h2 className="sec-title">Programs &amp; Communities</h2>
        </div>
        <div className="programs-grid">
          {[
            {
              org: "Meta / MLH Fellowship",
              title: "Meta Production Engineering Fellowship",
              detail: "SRE Track · 2026",
              desc: "Production infrastructure, Linux reliability engineering, and platform operations — highly selective fellowship.",
              accent: "#1877f2",
            },
            {
              org: "University of Florida",
              title: "M.S. Computer Science",
              detail: "GPA 3.8 / 4.0 · Graduating Dec 2025",
              desc: "Distributed Systems · Networks · Algorithms · Security · NLP",
              accent: "#3b82f6",
            },
            {
              org: "McKinsey Forward",
              title: "McKinsey Forward Program",
              detail: "Selected Participant · 2026",
              desc: "Business and leadership development program for high-potential early-career professionals.",
              accent: "#22c55e",
            },
            {
              org: "Rewriting the Code",
              title: "Rewriting the Code",
              detail: "Women in Tech Community",
              desc: "Selective tech community supporting women in software engineering with mentorship, events, and recruiting pipelines.",
              accent: "#a78bfa",
            },
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

      {/* ── ENGINEERING PHILOSOPHY ───────────────── */}
      <section className="section rev" id="philosophy">
        <div className="philosophy-block">
          <div className="phil-label">Engineering Philosophy</div>
          <blockquote className="phil-quote">
            I focus on systems correctness under failure.
            Most software is tested on the happy path — my work concentrates on the paths that fail:
            retries, stale state, silent regressions, rollout mistakes, and unsafe AI outputs.
            I build platforms that make those failures observable, reproducible, and preventable.
          </blockquote>
          <div className="phil-name">— Kriti Behl</div>
        </div>
      </section>

      {/* ── WRITING ──────────────────────────────── */}
      <section className="section rev" id="writing">
        <div className="sec-header">
          <span className="sec-label">06 · Engineering Writing</span>
          <h2 className="sec-title">Selected Writing</h2>
        </div>
        <div className="writing-list">
          {[
            {
              href: "https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723",
              title: "How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and Network Faults",
              sub: "Exactly-once execution semantics, fencing tokens, and validating correctness under real failure conditions.",
              topic: "Distributed Systems",
            },
            {
              href: "https://medium.com/@kriti0608/i-thought-i-built-observability-then-an-incident-proved-i-didnt-9b749e0d4ff3",
              title: "I Thought I Built Observability. Then an Incident Proved I Didn't.",
              sub: "What a production-style incident revealed about the gap between green dashboards and real system behavior.",
              topic: "SRE / Observability",
            },
            {
              href: "https://medium.com/@kriti0608/detecting-silent-regressions-in-genai-systems-at-scale-039ec03db1e4",
              title: "Detecting Silent Regressions in GenAI Systems at Scale",
              sub: "Treating ML evaluation like reliability engineering: stable metrics, reproducible artifacts, CI release gates.",
              topic: "AI Evaluation",
            },
          ].map(w => (
            <a key={w.href} href={w.href} target="_blank" rel="noopener noreferrer" className="writing-row">
              <div className="wr-topic">{w.topic}</div>
              <div className="wr-title">{w.title}</div>
              <div className="wr-sub">{w.sub}</div>
              <span className="wr-arr">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────── */}
      <section className="section rev" id="contact">
        <div className="contact-block">
          <div>
            <div className="cb-head">Let&apos;s work together.</div>
            <p className="cb-sub">
              Looking for AI evaluation, backend/platform, SRE, GenAI operations, systems tooling, and reliability engineering roles.
              I build systems that detect, explain, and block failures before they reach users.
            </p>
            <p className="cb-note">New grad · Dec 2025 · Open to relocation · US work authorized</p>
          </div>
          <div className="cb-right">
            <a href="mailto:kriti0608@gmail.com" className="btn btn-primary">✉ kriti0608@gmail.com</a>
            <div className="cb-links">
              {[
                ["https://linkedin.com/in/kriti-behl", "LinkedIn ↗"],
                ["https://github.com/kritibehl",        "GitHub ↗"],
                ["https://medium.com/@kriti0608",        "Medium ↗"],
                ["https://huggingface.co/kriti0608",     "HuggingFace ↗"],
              ].map(([h, l]) => (
                <a key={h} href={h} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="footer-note rev">
        Logos / program names shown for experience, programs, open-source ecosystems, and hosted project platforms.
      </div>

    </div>
  );
}