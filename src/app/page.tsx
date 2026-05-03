"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pref = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function countUp(el: HTMLElement, target: number, dur = 2000) {
      if (pref) { el.textContent = target.toLocaleString(); return; }
      const s = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(e * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
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

  return (
    <div ref={rootRef}>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><span className="badge-dot" />Open to roles · New grad Dec 2025 · Open to relocation</div>
          <h1 className="hero-name">Kriti Behl</h1>
          <p className="hero-line">Software engineer building systems that <span className="hero-accent">catch failures before production.</span></p>
          <p className="hero-desc">Backend · Reliability · Developer Tooling · AI Infrastructure. Production backend at <strong>Thales Group</strong>, 4 merged fixes to the <strong>Temporal Go SDK</strong>.</p>

          <div className="proof-block">
            <div className="pb-label">What I&apos;ve proven</div>
            <div className="pb-items">
              <div className="pb-item"><span className="pb-icon">✓</span><span>Prevented distributed system corruption — <strong>0.0% duplicate commits</strong> under fault injection</span></div>
              <div className="pb-item"><span className="pb-icon">✓</span><span>Blocked unsafe deployments — caught <strong>+608% p95 regression</strong> on AMD MI300X</span></div>
              <div className="pb-item"><span className="pb-icon">✓</span><span>Turned CI failures into release decisions — <strong>0.91 confidence</strong> classification</span></div>
              <div className="pb-item"><span className="pb-icon">✓</span><span>Fixed concurrency bugs in production Go SDK — <strong>4 merged Temporal PRs</strong></span></div>
            </div>
          </div>

          <div className="hero-btns">
            <a href="#projects" className="btn-pri">View Work →</a>
            <a href="https://github.com/kritibehl" target="_blank" rel="noopener noreferrer" className="btn-sec">GitHub ↗</a>
            <a href="https://linkedin.com/in/kriti-behl" target="_blank" rel="noopener noreferrer" className="btn-sec">LinkedIn ↗</a>
            <a href="mailto:kriti0608@gmail.com" className="btn-sec">Email</a>
            <a href="https://medium.com/@kriti0608" target="_blank" rel="noopener noreferrer" className="btn-sec">Medium ↗</a>
            <a href="https://huggingface.co/kriti0608" target="_blank" rel="noopener noreferrer" className="btn-sec">HuggingFace ↗</a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-num"><span className="count-up" data-target="1500">0</span></div>
            <div className="hstat-label">Fault-Injected Scenarios</div>
            <div className="hstat-sub">0 duplicate commits · 0 violations</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">+<span className="count-up" data-target="608">0</span>%</div>
            <div className="hstat-label">p95 Regression Caught</div>
            <div className="hstat-sub">AMD MI300X · vLLM · BLOCK</div>
          </div>
          <div className="hstat">
            <div className="hstat-num"><span className="count-up" data-target="4">0</span> PRs</div>
            <div className="hstat-label">Merged — Temporal SDK</div>
            <div className="hstat-sub">+ 2 Azure SDK in review</div>
          </div>
          <div className="hstat">
            <div className="hstat-num"><span className="count-up" data-target="100">0</span>k</div>
            <div className="hstat-label">Records / Run</div>
            <div className="hstat-sub">Production · Thales Group</div>
          </div>
        </div>
      </section>

      {/* ROLE LANES */}
      <section className="wrap rev" id="lanes">
        <span className="section-label-mono">Role Mapping</span>
        <div className="section-label">Where this work maps</div>
        <div className="lanes">
          {[
            { icon:"⬡", title:"Backend & Platform",    tags:["Faultline","AutoOps","Thales"],                 desc:"Distributed execution · APIs · PostgreSQL · Kubernetes" },
            { icon:"◎", title:"QA Automation",         tags:["AutoOps","KubePulse","Faultline"],               desc:"Regression detection · test automation · release validation" },
            { icon:"◻", title:"Developer Tooling",     tags:["AutoOps","DetTrace","AgentGrid","Temporal OSS"], desc:"CI failure intelligence · dashboards · agentic workflows" },
            { icon:"▣", title:"Reliability & SRE",     tags:["KubePulse","AutoOps","Faultline"],               desc:"SLO validation · rollout gates · observability" },
            { icon:"◇", title:"AI Infrastructure",     tags:["FairEval","KubePulse AMD","AccelSim"],           desc:"Model evaluation · serving latency gates · AMD proof" },
            { icon:"◈", title:"Systems & Performance", tags:["DetTrace","AccelSim","Faultline"],               desc:"Deterministic replay · bottleneck analysis · correctness" },
          ].map((l) => (
            <div className="lane-card" key={l.title}>
              <div className="lane-icon">{l.icon}</div>
              <div className="lane-title">{l.title}</div>
              <div className="lane-desc">{l.desc}</div>
              <div className="lane-tags">{l.tags.map((t) => <span key={t} className="lane-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GENAI HERO PROJECT */}
      <section className="wrap" id="genai-system">
        <span className="section-label-mono">Live System</span>
        <div className="section-label">Production GenAI Incident Intelligence System</div>
        <p className="section-sub">Live Cloud Run system that detects unsafe AI outputs, blocks them with eval gates, and converts failures into AutoOps incident intelligence.</p>

        <div className="genai-hero-card rev">
          <div className="genai-left">
            <div className="why-matters" style={{marginTop:0, marginBottom:"20px"}}>
              <span className="wm-label">Why this matters</span>
              Without systems like this, incorrect or incomplete AI outputs can reach users, causing silent failures.
            </div>

            <div className="genai-proof">
              <div className="gp-label">Live proof</div>
              <div className="gp-grid">
                <div className="gp-item"><span className="gp-val">25</span><span className="gp-key">validation runs</span></div>
                <div className="gp-item"><span className="gp-val green">9</span><span className="gp-key">ship decisions</span></div>
                <div className="gp-item"><span className="gp-val yellow">10</span><span className="gp-key">hold decisions</span></div>
                <div className="gp-item"><span className="gp-val red">6</span><span className="gp-key">escalate decisions</span></div>
                <div className="gp-item"><span className="gp-val">258ms</span><span className="gp-key">p95 eval latency</span></div>
                <div className="gp-item"><span className="gp-val green">0.88</span><span className="gp-key">tool-call success</span></div>
                <div className="gp-item"><span className="gp-val green">0</span><span className="gp-key">unsafe shipments</span></div>
                <div className="gp-item"><span className="gp-val green">✓</span><span className="gp-key">Cloud Run live</span></div>
              </div>
            </div>

            <div className="example-output">
              <div className="eo-label">Example output</div>
              <div className="eo-body">
                <div className="eo-row"><span className="eo-key">Decision</span><span className="badge-block">HOLD</span></div>
                <div className="eo-row"><span className="eo-key">Reason</span><span className="eo-val">missing_context</span></div>
                <div className="eo-divider">AutoOps Output</div>
                <div className="eo-bullets">
                  <div>→ PM summary: Missing deployment context</div>
                  <div>→ Engineering bug: Missing dependency metadata</div>
                  <div>→ Support action: Request logs and retry deployment</div>
                </div>
              </div>
            </div>

            <div className="genai-btns">
              <a href="https://agentgrid-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-pri">Live Demo ↗</a>
              <a href="https://github.com/kritibehl/agentgrid" target="_blank" rel="noopener noreferrer" className="btn-sec">AgentGrid GitHub ↗</a>
              <a href="https://github.com/kritibehl/AutoOps-Insight" target="_blank" rel="noopener noreferrer" className="btn-sec">AutoOps GitHub ↗</a>
            </div>
          </div>

          <div className="genai-right">
            <div className="sys-flow">
              <div className="sf-label">System flow</div>
              {[
                { step: "Query",                      note: "user / support input" },
                { step: "RAG over docs/logs/runbooks", note: "context retrieval" },
                { step: "LangGraph workflow",          note: "stateful multi-step" },
                { step: "MCP-style tool execution",    note: "structured tool calls" },
                { step: "Eval Gate",                   note: "safety + quality check", highlight: true },
                { step: "ship / hold / escalate",      note: "decision output", decision: true },
                { step: "AutoOps",                     note: "incident ingestion" },
                { step: "Incident + Action",            note: "structured output", final: true },
              ].map((s, i, arr) => (
                <div key={s.step} className="sf-item">
                  <div className={`sf-step${s.highlight ? " sf-gate" : s.decision ? " sf-decision" : s.final ? " sf-final" : ""}`}>
                    <span className="sf-name">{s.step}</span>
                    <span className="sf-note">{s.note}</span>
                  </div>
                  {i < arr.length - 1 && <div className="sf-arr">↓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="wrap" id="projects">
        <span className="section-label-mono">01</span>
        <div className="section-label">Featured Technical Work</div>

        {/* AutoOps */}
        <div className="feat-card rev">
          <div className="feat-left">
            <div className="feat-kicker">★ AutoOps-Insight · Developer Tooling · QA Automation · SRE</div>
            <div className="proj-impact">Turns noisy CI failures into release-blocking decisions with root cause and confidence scoring.</div>
            <h2 className="feat-title">CI Failure Intelligence Dashboard</h2>
            <p className="feat-desc">Detected recurring CI failures and blocked unreliable releases — grouped failures into incident families and generated hold/ship decisions with 0.91 confidence.</p>
            <ul className="feat-list">
              <li>Full-stack platform (FastAPI + React/Vite): ingests CI logs → classifies failure families → fingerprints recurrence → generates <code>hold_release</code> / <code>investigate</code> with confidence scores</li>
              <li>Signature-based recurrence tracking across 3 repos — 60% release-blocking decisions; Parquet exports with 17-field schema for downstream analysis</li>
              <li>Fleet-level metrics: noisy services ranking, recurrence heatmaps, root-cause distribution via warehouse-style SQL models</li>
            </ul>
            <div className="why-matters"><span className="wm-label">Why this matters</span>On-call engineers get structured triage instead of raw logs — faster decisions, less tribal knowledge required.</div>
            <div className="feat-chips">
              <span className="chip-green">60% release-blocking decisions</span>
              <span className="chip-green">0.91 confidence</span>
              <span className="chip">FastAPI · React · PostgreSQL · Kafka</span>
            </div>
            <div className="feat-links"><a href="https://github.com/kritibehl/AutoOps-Insight" target="_blank" rel="noopener noreferrer">↗ GitHub</a></div>
          </div>
          <div className="feat-right">
            <div className="stat-block">
              <div className="sb-row">
                <div className="sb-item"><div className="sb-val green">5</div><div className="sb-key">incidents analyzed</div></div>
                <div className="sb-item"><div className="sb-val green">3</div><div className="sb-key">hold-release decisions</div></div>
              </div>
              <div className="sb-row">
                <div className="sb-item"><div className="sb-val green">0.91</div><div className="sb-key">dns_failure confidence</div></div>
                <div className="sb-item"><div className="sb-val green">0.91</div><div className="sb-key">latency_spike confidence</div></div>
              </div>
              <div className="incident-flow">
                <div className="if-step">Raw log</div><div className="if-arr">→</div>
                <div className="if-step">Classify</div><div className="if-arr">→</div>
                <div className="if-step">Fingerprint</div><div className="if-arr">→</div>
                <div className="if-step if-decision">HOLD / SHIP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Faultline */}
        <div className="feat-card rev">
          <div className="feat-left">
            <div className="feat-kicker">★ Faultline · Backend · Platform · Distributed Systems · SRE</div>
            <div className="proj-impact">Prevented duplicate writes under distributed failures — 0.0% duplicate commits vs 1.0–2.5% naive baseline.</div>
            <h2 className="feat-title">Crash-Safe Distributed Job Execution</h2>
            <p className="feat-desc">Stale workers commit after losing ownership. Lease expiry stops new claims — it doesn&apos;t stop an old worker from writing late. Fencing tokens fix the write boundary at the database, not the application.</p>
            <div className="pipeline">
              {[["blue","Worker Claims","SKIP LOCKED"],["blue","Fencing Token","unique constraint"],["yellow","Fault Injected","crash / partition"],["green","Stale Rejected","at DB boundary"],["green","0 Duplicates","across all runs"]].map(([color,label,sub],i,arr) => (
                <span key={label} style={{display:"flex",alignItems:"center",gap:"4px"}}>
                  <span className="pl-step"><span className={`pl-dot pl-${color}`}/><span className="pl-label">{label}</span><span className="pl-sub">{sub}</span></span>
                  {i < arr.length-1 && <span className="pl-arr">→</span>}
                </span>
              ))}
            </div>
            <ul className="feat-list">
              <li>1,500+ injected scenarios: crashes, lease takeovers, retry storms, partial writes — 0 invariant violations</li>
              <li>Coordination overhead measured: 46.5% of runtime in worst case, broken down by claim / poll / reconcile / retry</li>
            </ul>
            <div className="why-matters"><span className="wm-label">Why this matters</span>Double-commits show up as billing errors, inventory miscounts, or audit failures. Fencing tokens make them physically impossible at the DB boundary.</div>
            <div className="feat-chips">
              <span className="chip-green">0.0% duplicates</span>
              <span className="chip-green">1,500+ scenarios</span>
              <span className="chip-green">0 invariant violations</span>
              <span className="chip">Python · PostgreSQL · Prometheus</span>
            </div>
            <div className="feat-links"><a href="https://github.com/kritibehl/faultline" target="_blank" rel="noopener noreferrer">↗ GitHub</a></div>
          </div>
          <div className="feat-right">
            <div className="stat-block">
              <div className="compare-table">
                <div className="ct-head"><span>Fault Rate</span><span>Naive Queue</span><span>Faultline</span></div>
                <div className="ct-row"><span>5%</span><span className="ct-bad">1.0% dupes</span><span className="ct-good">0.0% ✓</span></div>
                <div className="ct-row"><span>10%</span><span className="ct-bad">2.5% dupes</span><span className="ct-good">0.0% ✓</span></div>
                <div className="ct-row"><span>20%</span><span className="ct-bad">2.5% dupes</span><span className="ct-good">0.0% ✓</span></div>
              </div>
              <div className="sb-row" style={{marginTop:"16px"}}>
                <div className="sb-item"><div className="sb-val green">1,500+</div><div className="sb-key">failure scenarios</div></div>
                <div className="sb-item"><div className="sb-val green">0</div><div className="sb-key">invariant violations</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 grid */}
        <div className="proj-grid">

          <div className="proj-card rev">
            <div className="proj-kicker">KubePulse · Reliability · AI Infra</div>
            <div className="proj-impact-sm">Blocked unsafe deployments even when Kubernetes health checks stayed green.</div>
            <h3 className="proj-title">Release Safety Validation</h3>
            <div className="amd-block">
              <div className="amd-title">AMD MI300X — Serving Regression</div>
              <div className="amd-rows">
                <div className="amd-row"><span>Baseline p95</span><span className="amd-v">200 ms</span></div>
                <div className="amd-row"><span>Burst p95</span><span className="amd-v red">1,422 ms</span></div>
                <div className="amd-row"><span>Delta</span><span className="amd-v red">+608%</span></div>
                <div className="amd-row"><span>Decision</span><span className="badge-block">BLOCK</span></div>
              </div>
            </div>
            <ul className="proj-list">
              <li>+333% p95 latency drift while probes stayed green — error budget 0.0%, <code>safe_to_operate=false</code></li>
              <li>Validation data pipeline: structured JSON artifacts per scenario run, CI/CD integrable</li>
            </ul>
            <div className="why-matters"><span className="wm-label">Why this matters</span>Prevents the class of incidents where the system looks healthy but is serving degraded traffic.</div>
            <div className="proj-chips">
              <span className="chip-green">+608% AMD blocked</span>
              <span className="chip-green">+333% p95 caught</span>
              <span className="chip">Python · Kubernetes · Terraform</span>
            </div>
            <div className="proj-links"><a href="https://github.com/kritibehl/KubePulse" target="_blank" rel="noopener noreferrer">↗ GitHub</a></div>
          </div>

          <div className="proj-card rev">
            <div className="proj-kicker">DetTrace · Systems Debugging</div>
            <div className="proj-impact-sm">Isolated the first incorrect event before any visible failure downstream.</div>
            <h3 className="proj-title">First-Failure Isolation</h3>
            <div className="trace-box">
              <div className="trace-row"><span className="trace-label">EXPECTED</span><span className="trace-seq">gpio_edge → irq_assert → isr_enter → <strong className="tok-ok">gpio_ack</strong> → irq_clear</span></div>
              <div className="trace-row" style={{marginTop:"6px"}}><span className="trace-label">ACTUAL</span><span className="trace-seq trace-bad">gpio_edge → irq_assert → isr_enter → <strong>gpio_edge</strong> → register_read</span></div>
              <div className="trace-result">⚑ First divergence: index 3 · event ordering mismatch</div>
            </div>
            <ul className="proj-list">
              <li>C++17 deterministic replay + Swift actor-isolated analysis — finds root cause before symptoms appear</li>
              <li>Cross-incident learning at 1.0 confidence; control-loop: 3/4 scenarios diverged</li>
            </ul>
            <div className="why-matters"><span className="wm-label">Why this matters</span>Turns &quot;we couldn&apos;t reproduce it&quot; into a named, replayable divergence at an exact event index.</div>
            <div className="proj-chips">
              <span className="chip-green">Index 3 isolated</span>
              <span className="chip-green">1.0 confidence</span>
              <span className="chip">C++17 · Swift · CMake</span>
            </div>
            <div className="proj-links"><a href="https://github.com/kritibehl/dettrace" target="_blank" rel="noopener noreferrer">↗ GitHub</a></div>
          </div>

          <div className="proj-card rev">
            <div className="proj-kicker">FairEval-Suite · AI Infra · ML Platform</div>
            <div className="proj-impact-sm">Decides whether to ship a model update — catches regressions average score hides.</div>
            <h3 className="proj-title">Regression Gating for GenAI</h3>
            <div className="gate-rows">
              <div className="gate-row"><span className="gate-label">Baseline</span><span className="gate-val">avg 0.794 · 100% pass</span><span className="badge-ship">SHIP</span></div>
              <div className="gate-row"><span className="gate-label">Candidate</span><span className="gate-val">avg 0.000 · 0% pass</span><span className="badge-block">BLOCK</span></div>
              <div className="gate-row"><span className="gate-label">Gemini Flash</span><span className="gate-val">avg 0.367 · 40% pass</span><span className="badge-block">BLOCK</span></div>
              <div className="gate-row"><span className="gate-label">AMD serving</span><span className="gate-val">quality ✓ · p95 +47.1%</span><span className="badge-block">BLOCK</span></div>
            </div>
            <ul className="proj-list">
              <li>Welch t-test + chi-squared at p=0.0 — structural regression, not noise</li>
              <li>Hardware-aware gate: blocks on serving latency even when output quality holds</li>
            </ul>
            <div className="proj-chips">
              <span className="chip-green">p=0.0 significance</span>
              <span className="chip-green">AMD hardware gate</span>
              <span className="chip">Python · FastAPI · PyTorch</span>
            </div>
            <div className="proj-links">
              <a href="https://github.com/kritibehl/FairEval-Suite" target="_blank" rel="noopener noreferrer">↗ GitHub</a>
              <a href="https://huggingface.co/spaces/kriti0608/FairEval-Suite" target="_blank" rel="noopener noreferrer">↗ Live Demo</a>
            </div>
          </div>

          <div className="proj-card rev">
            <div className="proj-kicker">AccelSim-Lite · Systems · Performance</div>
            <div className="proj-impact-sm">Named which pipeline stage is the binding constraint — not just that a workload is slow.</div>
            <h3 className="proj-title">Accelerator Bottleneck Simulator</h3>
            <div className="accel-tbl">
              <div className="at-head"><span>Workload</span><span>Throughput</span><span>Bottleneck</span></div>
              <div className="at-row"><span>compute_heavy</span><span>0.33 ops/cy</span><span>WaitingDependency</span></div>
              <div className="at-row at-hi"><span>memory_heavy</span><span>0.14 ops/cy</span><span>NoMemoryPort ← 2.4×</span></div>
              <div className="at-row"><span>queue_pressure</span><span>0.32 ops/cy</span><span>Dep + ComputeUnit</span></div>
            </div>
            <ul className="proj-list"><li>Memory pressure: ~2.4× throughput degradation — named stall classification per cycle identifies the correct remediation</li></ul>
            <div className="proj-chips">
              <span className="chip-green">2.4× degradation quantified</span>
              <span className="chip">C++17 · CMake</span>
            </div>
            <div className="proj-links"><a href="https://github.com/kritibehl/accelsim-lite" target="_blank" rel="noopener noreferrer">↗ GitHub</a></div>
          </div>
        </div>

        {/* AgentGrid */}
        <div className="proj-card rev" style={{marginTop:"18px"}}>
          <div className="proj-kicker">AgentGrid · Agentic Systems · Developer Tooling</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"28px"}}>
            <div>
              <div className="proj-impact-sm">Converts unstructured operational documents into structured risk signals, owner routing, and action summaries.</div>
              <h3 className="proj-title">LangGraph Document Triage Agent</h3>
              <ul className="proj-list">
                <li>LangGraph multi-step stateful workflow: classification → issue extraction → severity scoring → owner routing → action generation; deterministic graph nodes with typed shared state contract</li>
                <li>Machine-readable JSON output; CLI-driven, pytest-backed, 3 scenarios 100% pass</li>
              </ul>
              <div className="why-matters"><span className="wm-label">Why this matters</span>Encodes triage logic that currently lives in engineers&apos; heads — consistent, testable, pipeline-integrable.</div>
              <div className="proj-chips">
                <span className="chip-green">3 scenarios · 100% pass</span>
                <span className="chip">LangGraph · Python · CLI</span>
              </div>
              <div className="proj-links"><a href="https://github.com/kritibehl/agentgrid-demo" target="_blank" rel="noopener noreferrer">↗ GitHub</a></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div className="agent-flow">
                {["RFI / Change Order / Safety Notice","Classification","Issue Extraction","Severity Scoring","Owner Routing","Action Summary JSON"].map((step,i,arr)=>(
                  <div key={step} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
                    <div className={`af-step${i===0?" af-input":i===arr.length-1?" af-output":""}`}>{step}</div>
                    {i<arr.length-1&&<div className="af-arr">↓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OSS */}
      <section className="wrap rev" id="oss">
        <span className="section-label-mono">02</span>
        <div className="section-label">Open Source Impact</div>
        <p className="section-sub">4 merged PRs in the Temporal Go SDK + 2 Azure SDK PRs in review.</p>
        <div className="oss-grid">
          {[
            { repo:"Temporal", num:"#2298", href:"https://github.com/temporalio/sdk-go/pull/2298", title:"Fixed async future chaining where ready futures could still block callers", desc:"Resolved a bug where already-resolved futures in the workflow test environment could still cause callers to block, breaking async execution guarantees.", merged:true },
            { repo:"Temporal", num:"#2212", href:"https://github.com/temporalio/sdk-go/pull/2212", title:"Fixed OnWorkflow mock to observe propagated context headers", desc:"Applied workflow context propagation to mock execution so OnWorkflow matchers see the same headers as real workflow execution.", merged:true },
            { repo:"Temporal", num:"#2200", href:"https://github.com/temporalio/sdk-go/pull/2200", title:"Fixed goroutine leak in child-workflow test environment", desc:"Child workflows could block on an unclosed doneChannel. Added idempotent closure with sync.Once and a regression test that fails without the fix.", merged:true },
            { repo:"Temporal", num:"#2248", href:"https://github.com/temporalio/sdk-go/pull/2248", title:"Restored workflow poller type assignment in scalable task pollers", desc:"Wired poller type assignment into scalable task pollers, restoring sticky vs non-sticky distinction used by poller balancing.", merged:true },
            { repo:"Azure", num:"#26051", href:"https://github.com/Azure/azure-sdk-for-go/pull/26051", title:"Surfaced silently dropped transport errors in azcore retry policy", desc:"Composed realClose() transport failures with request errors using errors.Join so callers can inspect retry-path failures instead of losing them silently.", merged:false },
            { repo:"Azure", num:"#26106", href:"https://github.com/Azure/azure-sdk-for-go/pull/26106", title:"Implemented W3C Trace Context propagation in azcore HTTP tracing", desc:"Added traceparent and tracestate propagation via OpenTelemetry propagators and validated header injection with tests.", merged:false },
          ].map((pr)=>(
            <div key={pr.num} className={`oss-card ${pr.repo==="Azure"?"oss-azure-card":"oss-temporal-card"}`}>
              <div className="oss-top">
                <a href={pr.href} target="_blank" rel="noopener noreferrer" className={pr.repo==="Azure"?"oss-badge-azure":"oss-badge-temporal"}>{pr.repo} {pr.num}</a>
                <span className={pr.merged?"oss-merged":"oss-review"}>{pr.merged?"Merged":"In Review"}</span>
              </div>
              <div className="oss-title">{pr.title}</div>
              <div className="oss-desc">{pr.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="wrap rev" id="skills">
        <span className="section-label-mono">03</span>
        <div className="section-label">Skills & Stack</div>
        <div className="skills-grid">
          {[
            { cat:"Languages",               items:["Python","Go","C++17","Swift","TypeScript","Java","SQL"] },
            { cat:"Systems & Correctness",   items:["Idempotency","Fencing tokens","Deterministic replay","State machines","Retries / backoff"] },
            { cat:"Reliability Engineering", items:["Chaos testing","Regression gating","Release safety","Failure mode analysis","SLO tracking"] },
            { cat:"Backend & APIs",          items:["FastAPI","REST","Pydantic","Node.js","React","Next.js"] },
            { cat:"Observability",           items:["Prometheus","Grafana","OpenTelemetry","Structured logging"] },
            { cat:"Infrastructure",          items:["PostgreSQL","SQLite","Docker","Kubernetes","GitHub Actions","Terraform"] },
            { cat:"ML & Evaluation",         items:["PyTorch","HuggingFace Transformers","DistilBERT","Eval pipelines","Statistical gating"] },
            { cat:"Education",               items:["MS CS · UF · GPA 3.8","Distributed Systems","Networks","Algorithms","Security","NLP"] },
          ].map((s)=>(
            <div key={s.cat} className="skill-card">
              <div className="skill-cat">{s.cat}</div>
              <div className="skill-items">{s.items.map((i)=><span key={i} className="skill-chip">{i}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="wrap rev" id="experience">
        <span className="section-label-mono">04</span>
        <div className="section-label">Experience</div>
        <div className="exp-list">
          {[
            { role:"Software Engineer", dates:"Feb 2026 – Present", company:"Cheenti Digital LLC · Remote", current:true, bullets:["Built 4-phase internal platform unifying analytics, search, campaign, and website-performance workflows into one reporting and monitoring system","Developed automated diagnostics covering 5+ technical issue classes: crawlability, broken links, redirect chains, metadata gaps, sitemap issues","Built monitoring workflows across 4 performance dimensions to surface regressions earlier than periodic reporting"] },
            { role:"DevSecOps Intern", dates:"Jun 2025 – Aug 2025", company:"Thales Group · Plantation, FL", current:false, bullets:["Built Python backend processing ~100k state-transition records per run; computed per-resource utilization, queue depth, and efficiency across HSM resource pools (payShield 10K, Luna HSM)","Replaced frontend JavaScript state computation with deterministic backend state engine; REST endpoints exposing real-time HSM state, queue depth, idle/recovery counts, and time-in-state from PostgreSQL event logs","Implemented configurable time-window efficiency analysis (24h–N days) via delta-based evaluation; exposed via REST APIs","Built internal dashboard for DevOps/engineering teams showing per-resource-type efficiency charts across HSM states: active, idle, queued, recovery, validation, error"] },
            { role:"Graduate Assistant", dates:"Dec 2024 – Dec 2025", company:"University of Florida · Gainesville, FL", current:false, bullets:["Operated and improved production scheduling system used by ~600–800 weekly users; diagnosed live failures and restored correctness during active usage"] },
          ].map((e)=>(
            <div key={e.role+e.company} className="exp-card">
              <div className="exp-head">
                <div>
                  <div className="exp-role">{e.role}{e.current&&<span className="exp-current">Current</span>}</div>
                  <div className="exp-company">{e.company}</div>
                </div>
                <div className="exp-dates">{e.dates}</div>
              </div>
              <ul className="exp-bullets">{e.bullets.map((b)=><li key={b}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* WRITING */}
      <section className="wrap rev" id="writing">
        <span className="section-label-mono">05</span>
        <div className="section-label">Selected Writing</div>
        <div className="writing-list">
          {[
            { href:"https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723", title:"How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and Network Faults", sub:"A deep dive into exactly-once execution semantics, fencing tokens, and validating correctness under real failure conditions." },
            { href:"https://medium.com/@kriti0608/i-thought-i-built-observability-then-an-incident-proved-i-didnt-9b749e0d4ff3", title:"I Thought I Built Observability. Then an Incident Proved I Didn't.", sub:"What a production-style incident revealed about the gap between green dashboards and real system behavior." },
            { href:"https://medium.com/@kriti0608/detecting-silent-regressions-in-genai-systems-at-scale-039ec03db1e4", title:"Detecting Silent Regressions in GenAI Systems at Scale", sub:"How I treat ML evaluation like reliability engineering: stable metrics, reproducible artifacts, and CI release gates." },
          ].map((w)=>(
            <a key={w.href} href={w.href} target="_blank" rel="noopener noreferrer" className="writing-card">
              <div><div className="writing-title">{w.title}</div><div className="writing-sub">{w.sub}</div></div>
              <span className="writing-arr">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="wrap rev" id="contact">
        <div className="contact-block">
          <div className="contact-left">
            <div className="contact-head">Let&apos;s work together.</div>
            <p className="contact-sub">Looking for backend, platform, QA automation, or reliability engineering roles. I build systems that prevent failures before production.</p>
            <p className="contact-note">New grad · Dec 2025 · Open to relocation</p>
          </div>
          <div className="contact-right">
            <a href="mailto:kriti0608@gmail.com" className="btn-pri contact-cta">✉ kriti0608@gmail.com</a>
            <div className="contact-links">
              {[["https://linkedin.com/in/kriti-behl","LinkedIn ↗"],["https://github.com/kritibehl","GitHub ↗"],["https://medium.com/@kriti0608","Medium ↗"],["https://huggingface.co/kriti0608","HuggingFace ↗"]].map(([h,l])=>(
                <a key={h} href={h} target="_blank" rel="noopener noreferrer" className="btn-sec">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}