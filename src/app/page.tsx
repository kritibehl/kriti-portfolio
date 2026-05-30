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
      id: "agentgrid",
      lanes: ["ai", "backend"],
      eye: "AgentGrid + AutoOps · AI Agents · Operational GenAI",
      impact: "AI-native support platform with agentic workflows, eval gates, trace viewer, incident timeline, and operational dashboard.",
      title: "Operational GenAI Incident Intelligence",
      problem: "Most AI demos stop at generation. This system handles what happens when AI is wrong — no structure, no escalation, no incident record.",
      built: "RAG retrieval → LangGraph workflow → MCP-style tool execution → eval gate → ship/hold/escalate → AutoOps incident ingestion. Live on Cloud Run.",
      verified: "30 passing tests · 9 ship / 10 hold / 6 escalate · 258ms p95 eval latency · 0.88 tool-call success rate · 0 unsafe shipments",
      proves: "I can build agentic AI systems that validate, escalate, and create structured operational intelligence — not just generate.",
      tags: ["FastAPI","LangGraph","AI agents","Eval gates","Cloud Run","AutoOps"],
      chips: [["Live Demo",true],["30 tests",true],["0 unsafe shipments",true],["GitHub",false]],
      links: [["↗ Live Demo","https://agentgrid-seven.vercel.app/"],["↗ AgentGrid","https://github.com/kritibehl/agentgrid"],["↗ AutoOps","https://github.com/kritibehl/AutoOps-Insight"]],
    },
    {
      id: "faultline",
      lanes: ["backend", "sre"],
      eye: "Faultline · Distributed Systems · Backend · PostgreSQL · SRE",
      impact: "Distributed execution correctness framework preventing stale-worker corruption with PostgreSQL fencing-token validation.",
      title: "Distributed Correctness Platform",
      problem: "Stale workers commit outdated results after lease takeover. Lease expiry stops new claims — it does not stop a worker already holding a reference from writing late.",
      built: "PostgreSQL fencing-token validation via UNIQUE(job_id, fencing_token), fault-injection proxy, reconciler, 29-assertion drill suite, k6 load tests, 11 Prometheus metrics, observability stack.",
      verified: "0.0% duplicate commits under 5–20% injected fault rate · 1,500+ failure scenarios · 0 invariant violations · naive baseline: 1.0–2.5% duplicate rate",
      proves: "I can reason about distributed correctness, race conditions, and database-backed failure safety under real injected failures.",
      tags: ["PostgreSQL","Distributed systems","Go","Python","Observability","k6","Correctness"],
      chips: [["0.0% duplicates",true],["1,500+ scenarios",true],["0 violations",true],["GitHub",false]],
      links: [["↗ GitHub","https://github.com/kritibehl/faultline"]],
    },
    {
      id: "kubepulse",
      lanes: ["sre", "backend"],
      eye: "KubePulse + NetRouteLab · Kubernetes · Release Safety · SRE",
      impact: "Cloud-native release-safety platform that blocks unsafe deployments using rollout gates, dependency checks, and network-path validation.",
      title: "Release Safety Validation Platform",
      problem: "Readiness probes report healthy while latency spikes, error rates rise, or dependency cascades degrade real traffic silently.",
      built: "Baseline-vs-degraded comparison engine, SLO gate, probe integrity check, DNS/TCP/TLS diagnostics, dependency risk scoring, rollback recommendations — CI/CD integrable.",
      verified: "+333% p95 drift caught with probes green · AMD MI300X: +608% p95 regression blocked · safe_to_operate=false generated · network-aware release decision report",
      proves: "I can turn unreliable health checks into release-blocking operational decisions, extended to GPU inference serving.",
      tags: ["Kubernetes","CI/CD","Release gates","Terraform","Python","DNS/TLS","Rollback"],
      chips: [["+608% blocked",true],["+333% p95",true],["GitHub",false],["AMD proof",false]],
      links: [["↗ GitHub","https://github.com/kritibehl/KubePulse"]],
    },
    {
      id: "faireval",
      lanes: ["ai"],
      eye: "FairEval-Suite · AI Evaluation · Responsible AI · ML Platform",
      impact: "AI release-safety platform with Responsible AI gates, RAG groundedness metrics, regression views, and hardware-aware serving gates.",
      title: "AI Release Safety & Evaluation Platform",
      problem: "Most GenAI failures are silent: unsupported claims, hallucinated facts, and latency regressions can ship unless evaluation is treated like release infrastructure.",
      built: "FastAPI eval APIs + React dashboards with RAI gates, RAG groundedness metrics, Welch t-test + chi-squared significance testing, 10-case regression library, hardware-aware serving gate, CI release gate.",
      verified: "Gemini Flash: 0.367 avg / 40% pass → BLOCK · AMD serving: p95 +47.1% → BLOCK despite quality pass · p=0.0 on both statistical tests · Zenodo report published",
      proves: "I can build AI release gates that catch hallucination, safety, latency, and regression failures before deployment.",
      tags: ["PyTorch","FastAPI","React","RAG eval","Responsible AI","Statistical gating"],
      chips: [["Live Demo",true],["p=0.0 sig.",true],["AMD gate",true],["Zenodo report",false]],
      links: [["↗ GitHub","https://github.com/kritibehl/FairEval-Suite"],["↗ Live Demo","https://huggingface.co/spaces/kriti0608/FairEval-Suite"],["↗ Zenodo","https://doi.org/10.5281/zenodo.17625268"]],
    },
    {
      id: "autoops",
      lanes: ["ai", "sre", "backend"],
      eye: "AutoOps-Insight · AIOps · Incident Intelligence · Developer Tooling",
      impact: "CI failure intelligence platform converting noisy CI logs into structured incidents, recurrence signals, and hold/release decisions.",
      title: "CI Failure Intelligence Dashboard",
      problem: "When CI pipelines fail, engineers open raw logs and guess. No structure, no recurrence memory, no release decision.",
      built: "FastAPI + React/Vite: ingests CI logs → classifies failure families → fingerprints recurrence → generates hold_release / investigate with confidence scores and SQL analytics.",
      verified: "102 incidents tracked · 51 escalations · 60% release-blocking decisions · 0.91 confidence on dns_failure and latency_spike",
      proves: "I can build AIOps-style incident intelligence that replaces manual log triage with structured release decisions.",
      tags: ["FastAPI","React","PostgreSQL","Kafka","SQL analytics","Incident intelligence"],
      chips: [["102 incidents",true],["0.91 confidence",true],["GitHub",false],["Live API",false]],
      links: [["↗ GitHub","https://github.com/kritibehl/AutoOps-Insight"]],
    },
    {
      id: "dettrace",
      lanes: ["systems"],
      eye: "DetTrace · Systems Debugging · Replay Diagnostics · C++",
      impact: "Deterministic replay platform isolating the first incorrect event before any visible failure downstream.",
      title: "Replay Diagnostics Platform",
      problem: "Concurrency failures refuse to reproduce. Add a log and the bug disappears. By the time you have data, the interleaving is gone.",
      built: "C++17 deterministic replay engine, Swift actor-isolated analysis, visual trace timeline, SPI/UART/I2C-style replay diagnostics, syscall/process timeline, replay explorer CLI.",
      verified: "GPIO interrupt race: first divergence at index 3 · Timer missed tick: first divergence at index 1 · 1.0 confidence on repeated incident patterns",
      proves: "I can build debuggability infrastructure that turns non-reproducible failures into deterministic, replayable root-cause artifacts.",
      tags: ["C++17","Swift","CMake","Deterministic replay","Trace analysis","Linux"],
      chips: [["Index 3 isolated",true],["1.0 confidence",true],["GitHub",false]],
      links: [["↗ GitHub","https://github.com/kritibehl/dettrace"]],
    },
    {
      id: "accelsim",
      lanes: ["systems"],
      eye: "AccelSim-Lite · C++ Performance · Runtime Validation",
      impact: "C++ runtime and performance validation platform with named bottleneck classification, benchmark dashboard, and cache/locality studies.",
      title: "C++ Runtime & Performance Platform",
      problem: "Profilers say a workload is slow. They don't say which stage is stalling — or whether adding compute units helps vs. the bottleneck being memory bandwidth.",
      built: "C++17 six-stage pipeline simulator with named stall classification per cycle: WaitingDependency, NoMemoryPort, NoComputeUnit. Benchmark dashboard, cache/locality studies, runtime regression gates.",
      verified: "Pointer-heavy traversal: 25.65× slower than contiguous scan · memory_heavy: 2.4× throughput degradation · runtime regression gate: PASS",
      proves: "I can instrument C++ runtime behavior, identify binding constraints, and build reproducible performance validation workflows.",
      tags: ["C++17","CMake","GoogleTest","Linux","Cache locality","Perf analysis"],
      chips: [["25.65× cache miss",true],["2.4× degradation",true],["GitHub",false]],
      links: [["↗ GitHub","https://github.com/kritibehl/accelsim-lite"]],
    },
  ];

  const visible = activeTab === "all" ? projects : projects.filter(p => p.lanes.includes(activeTab));

  return (
    <div ref={rootRef} className="page">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero rev">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          Open to roles · New grad Dec 2025 · Open to relocation
        </div>

        <h1 className="hero-name">Kriti Behl</h1>
        <div className="hero-title">Reliability · Distributed Systems · AI Infrastructure</div>

        <p className="hero-bio">
          I build systems that catch failures before production —
          distributed correctness tools, AI evaluation platforms, release safety gates,
          and incident intelligence that turns operational noise into actionable decisions.
        </p>

        <div className="hero-proof-inline rev">
          {[
            { num: "4",      label: "Temporal Go SDK\nMerged PRs",     green: false },
            { num: "1,500+", label: "Fault-injected\nscenarios",        green: false },
            { num: "0.0%",   label: "Duplicate commits\n(Faultline)",   green: true  },
            { num: "608%",   label: "p95 regression\nblocked",          green: false },
            { num: "100k+",  label: "HSM records\nper run (Thales)",    green: false },
            { num: "3.8",    label: "GPA · MS CS\nUniversity of Florida", green: false },
          ].map(({ num, label, green }) => (
            <div key={label} className={`hpi-card${green ? " hpi-green" : ""}`}>
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

      {/* ── WHY RECRUITERS REACH OUT ─────────────── */}
      <section className="section rev" id="why">
        <div className="sec-header">
          <span className="sec-label">Signal</span>
          <h2 className="sec-title">Why engineering teams reach out</h2>
        </div>
        <div className="signal-grid">
          {[
            { icon: "⬡", head: "External OSS validation", body: "4 merged PRs in Temporal Go SDK + 2 Azure SDK PRs under review — maintainer-reviewed changes in production-grade distributed workflow runtimes used by real engineering teams." },
            { icon: "◇", head: "Measurable proof at every project", body: "0.0% duplicate commits. 1,500+ fault-injected scenarios. +608% p95 regression blocked. 100k HSM records/run. Numbers recruiters can screenshot." },
            { icon: "▣", head: "Consistent engineering narrative", body: "Every project follows the same thesis: build systems that detect, explain, and block failures before they reach users. Correctness under failure — not just happy-path demos." },
            { icon: "◈", head: "Programs that signal selection", body: "Meta Production Engineering Fellow (MLH 2026) · McKinsey Forward Participant · Rewriting the Code · University of Florida MS CS." },
          ].map(s => (
            <div key={s.head} className="signal-card">
              <div className="signal-icon">{s.icon}</div>
              <div className="signal-head">{s.head}</div>
              <div className="signal-body">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN SOURCE HIGH ─────────────────────── */}
      <section className="section rev" id="oss">
        <div className="sec-header">
          <span className="sec-label">Open Source Impact</span>
          <h2 className="sec-title">Temporal Go SDK · 4 Merged PRs</h2>
          <p className="sec-sub">
            Maintainer-reviewed contributions to a production workflow runtime used by real engineering teams.
            These are not toy fixes — each addresses a correctness, goroutine-safety, or poller-behavior bug in live infrastructure.
          </p>
        </div>
        <div className="oss-list">
          {[
            { repo:"Temporal", num:"#2298", href:"https://github.com/temporalio/sdk-go/pull/2298", title:"Fixed async future chaining where ready futures could still block callers", desc:"Resolved a bug where already-resolved futures could still cause callers to block, breaking async execution guarantees.", merged:true },
            { repo:"Temporal", num:"#2212", href:"https://github.com/temporalio/sdk-go/pull/2212", title:"Fixed OnWorkflow mock to observe propagated context headers", desc:"Applied workflow context propagation to mock execution so OnWorkflow matchers see the same headers as real execution.", merged:true },
            { repo:"Temporal", num:"#2200", href:"https://github.com/temporalio/sdk-go/pull/2200", title:"Fixed goroutine leak in child-workflow test environment", desc:"Child workflows could block on an unclosed doneChannel. Added idempotent closure with sync.Once and a regression test that fails without the fix.", merged:true },
            { repo:"Temporal", num:"#2248", href:"https://github.com/temporalio/sdk-go/pull/2248", title:"Restored workflow poller type assignment in scalable task pollers", desc:"Wired poller type assignment into scalable task pollers, restoring sticky vs non-sticky distinction used by poller balancing.", merged:true },
            { repo:"Azure",    num:"#26051", href:"https://github.com/Azure/azure-sdk-for-go/pull/26051", title:"Surfaced silently dropped transport errors in azcore retry policy", desc:"Composed realClose() failures with request errors using errors.Join so callers can inspect retry-path failures.", merged:false },
            { repo:"Azure",    num:"#26106", href:"https://github.com/Azure/azure-sdk-for-go/pull/26106", title:"Implemented W3C Trace Context propagation in azcore HTTP tracing", desc:"Added traceparent and tracestate propagation via OpenTelemetry propagators and validated header injection with tests.", merged:false },
          ].map(pr => (
            <div key={pr.num} className={`oss-row ${pr.repo === "Azure" ? "azure" : "temporal"}`}>
              <a href={pr.href} target="_blank" rel="noopener noreferrer" className={pr.repo === "Azure" ? "oss-badge oss-badge-az" : "oss-badge"}>{pr.repo} {pr.num}</a>
              <div className="oss-content">
                <div className="oss-title">{pr.title}</div>
                <div className="oss-desc">{pr.desc}</div>
              </div>
              <span className={pr.merged ? "oss-merged" : "oss-review"}>{pr.merged ? "✓ Merged" : "In Review"}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLE MAPPING ─────────────────────────── */}
      <section className="section rev" id="lanes">
        <div className="sec-header">
          <span className="sec-label">Role Mapping</span>
          <h2 className="sec-title">Where this work maps</h2>
        </div>
        <div className="lanes-grid">
          {[
            { icon:"◇", title:"AI Platform / Evaluation", tags:["FairEval","AgentGrid","Cheenti"],    desc:"RAI gates · RAG eval · model regression · GenAI ops · eval-gate infrastructure" },
            { icon:"⬡", title:"Backend / Platform",       tags:["Faultline","AutoOps","Thales"],      desc:"Distributed correctness · APIs · PostgreSQL · Redis · workflow tooling" },
            { icon:"▣", title:"Reliability / SRE",        tags:["KubePulse","AutoOps","Faultline"],   desc:"SLO validation · rollout gates · observability · incident intelligence" },
            { icon:"◈", title:"Systems / Runtime",        tags:["DetTrace","AccelSim","Temporal OSS"], desc:"C++ · deterministic replay · bottleneck analysis · OSS correctness fixes" },
          ].map(l => (
            <div className="lane-card" key={l.title}>
              <div className="lane-icon">{l.icon}</div>
              <div className="lane-title">{l.title}</div>
              <div className="lane-desc">{l.desc}</div>
              <div className="lane-tags">{l.tags.map(t => <span key={t} className="lane-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────── */}
      <section className="section" id="projects">
        <div className="sec-header rev">
          <span className="sec-label">01 · Systems Lab</span>
          <h2 className="sec-title">Reliability Systems Lab</h2>
          <p className="sec-sub">
            Seven production-style systems proving AI evaluation, agentic ops, release safety, distributed correctness, replay debugging, and runtime performance.
            Each card shows: problem → what I built → verified proof → what it demonstrates.
          </p>
        </div>

        <div className="role-tabs rev">
          {tabs.map(t => (
            <button key={t.id} className={`role-tab${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="proj-list-full">
          {visible.map((p) => (
            <div key={p.id} className="proj-card-full rev">
              <div className="pcf-top">
                <div className="pcf-eye">{p.eye}</div>
                <div className="pcf-tags">{p.tags.map(t => <span key={t} className="pcf-tag">{t}</span>)}</div>
              </div>
              <div className="pcf-impact">{p.impact}</div>
              <h3 className="pcf-title">{p.title}</h3>

              <div className="pcb">
                <div className="pcb-row"><span className="pcb-l">Problem</span><span className="pcb-t">{p.problem}</span></div>
                <div className="pcb-row"><span className="pcb-l">Built</span><span className="pcb-t">{p.built}</span></div>
                <div className="pcb-row"><span className="pcb-l">Verified</span><span className="pcb-res">{p.verified}</span></div>
              </div>

              <div className="pcf-proves"><span className="pcf-proves-label">What this proves · </span>{p.proves}</div>

              <div className="pcf-bottom">
                <div className="pcf-chips">
                  {(p.chips as [string, boolean][]).map(([label, green]) => (
                    <span key={label} className={`chip${green ? " chip-g" : ""}`}>{label}</span>
                  ))}
                </div>
                <div className="pcf-links">
                  {(p.links as [string, string][]).map(([label, href]) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
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
          <span className="sec-label">02 · Stack</span>
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

      {/* ── EXPERIENCE ───────────────────────────── */}
      <section className="section rev" id="experience">
        <div className="sec-header">
          <span className="sec-label">03 · Experience</span>
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

      {/* ── PROGRAMS & COMMUNITIES ───────────────── */}
      <section className="section rev" id="programs">
        <div className="sec-header">
          <span className="sec-label">04 · Programs</span>
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
          <span className="sec-label">05 · Engineering Writing</span>
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