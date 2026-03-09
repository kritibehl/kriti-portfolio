"use client";

import React, { useEffect, useState } from "react";

type LinkItem = { href: string; label: string };

type Project = {
  id: string;
  label: string;
  name: string;
  oneLiner: string;
  problem?: string;
  built?: string;
  proof?: string;
  metrics?: string[];
  impact: string[];
  stack: string[];
  links: LinkItem[];
  tags: string[];
};

type Article = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  tags: string[];
};

type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  achievements: string[];
};

type Education = {
  id: string;
  school: string;
  degree: string;
  period: string;
  location: string;
  details: string[];
};

type OpenSourceContribution = {
  id: string;
  project: string;
  title: string;
  summary: string;
  impact: string;
};

type ProofStat = {
  label: string;
  value: string;
};

const CONTACT = {
  name: "Kriti Behl",
  email: "kriti0608@gmail.com",
  github: "https://github.com/kritibehl",
  linkedin: "https://www.linkedin.com/in/kriti-behl/",
  huggingface: "https://huggingface.co/kriti0608",
  medium: "https://medium.com/@kriti0608",
};

const proofStats: ProofStat[] = [
  { label: "Faultline", value: "500 race reproductions · 0 duplicate commits" },
  { label: "KubePulse", value: "8s recovery · resilience score 86/100" },
  { label: "AutoOps", value: "11 failure families · 11 APIs · 14 tests" },
  { label: "DetTrace", value: "First divergence isolated at event index 5" },
];

const experience: Experience[] = [
  {
    id: "thales",
    company: "Thales Group",
    role: "DevSecOps Intern",
    period: "Jun 2025 – Aug 2025",
    location: "Plantation, FL, USA",
    achievements: [
      "Designed and implemented a backend resource utilization engine that computes time-based efficiency from state transition logs in PostgreSQL.",
      "Built deterministic state-machine logic to derive operational resource state from low-level boolean flags, eliminating inconsistent frontend status computation.",
      "Implemented delta-based timestamp evaluation over ordered event logs to calculate % time in-use across configurable time windows and resource groups.",
      "Exposed infrastructure metrics via REST endpoints and integrated group-aware observability dashboards for monitoring, capacity analysis and load imbalance detection.",
    ],
  },
  {
    id: "uf",
    company: "University of Florida",
    role: "Graduate Assistant",
    period: "Dec 2024 – Dec 2025",
    location: "Gainesville, FL, USA",
    achievements: [
      "Owned weekly operational workflows under frequent last-minute changes while maintaining reliable execution despite shifting constraints.",
      "Identified failure points in handoffs and tracking, then standardized recurring workflows and artifacts to reduce missed actions and reporting gaps.",
      "Improved execution reliability by turning ad-hoc coordination into repeatable, debuggable processes.",
    ],
  },
  {
    id: "elixir",
    company: "Elixir Web Solutions",
    role: "Software Development Intern",
    period: "May 2024 – Aug 2024",
    location: "New Delhi, India",
    achievements: [
      "Built SEO analytics dashboards using Node.js/Express and REST APIs for client reporting.",
      "Reduced perceived latency by optimizing rendering paths and eliminating redundant DOM work.",
      "Added defensive error handling and fallback states to keep dashboards usable during partial API failures.",
    ],
  },
  {
    id: "c1",
    company: "C1 India Pvt Ltd",
    role: "Software Engineering Intern",
    period: "Jun 2023 – Aug 2023",
    location: "Gurugram, India",
    achievements: [
      "Designed Java backend modules supporting procurement workflows and enterprise integrations.",
      "Simulated fault-tolerance and log-recovery scenarios to validate resilience assumptions before production exposure.",
      "Implemented defensive input validation and edge-case handling to reduce production risk and instability.",
    ],
  },
];

const education: Education[] = [
  {
    id: "uf-ms",
    school: "University of Florida",
    degree: "M.S. Computer & Information Science & Engineering",
    period: "Aug 2024 – Dec 2025",
    location: "Gainesville, FL",
    details: [
      "GPA: 3.8 / 4.0",
      "Coursework: Advanced Data Structures, Algorithms, Computer Networks, Distributed OS, Security, NLP Applications, Programming Languages.",
    ],
  },
  {
    id: "jiit",
    school: "Jaypee Institute of Information Technology",
    degree: "B.Tech Computer Science & Engineering (Honors)",
    period: "Sep 2020 – May 2024",
    location: "Noida, India",
    details: [
      "CGPA: 8.1 / 10.0",
      "Coursework: DSA, OS, DBMS, Networks, Computer Architecture, Software Engineering.",
    ],
  },
];

const demoCards = [
  {
    kicker: "ML Evaluation",
    title: "FairEval Suite",
    desc: "Deterministic GenAI evaluation with CI-friendly regression detection and inspectable release-gate artifacts.",
    links: [
      {
        href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite",
        label: "Live demo",
      },
      { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
      { href: "https://doi.org/10.5281/zenodo.17625268", label: "Zenodo" },
    ],
  },
  {
    kicker: "Safety Middleware",
    title: "JailBreakDefense",
    desc: "Intent-preserving jailbreak defense with benchmarks, traceable logs, and measurable safety behavior over time.",
    links: [
      {
        href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense",
        label: "Live demo",
      },
      {
        href: "https://github.com/kritibehl/JailBreakDefense",
        label: "GitHub",
      },
      { href: "https://doi.org/10.5281/zenodo.17694184", label: "Zenodo" },
    ],
  },
  {
    kicker: "Regression Suite",
    title: "SpeechIntentEval",
    desc: "High-context intent regression tests for indirect, polite, sarcastic, and ambiguous assistant behavior.",
    links: [
      {
        href: "https://huggingface.co/spaces/kriti0608/SpeechIntentEval",
        label: "Live demo",
      },
      {
        href: "https://github.com/kritibehl/SpeechIntentEval",
        label: "GitHub",
      },
    ],
  },
];

const faultline: Project = {
  id: "faultline",
  label: "Distributed Systems & Execution Correctness",
  name: "Faultline — Distributed Job Processing System",
  oneLiner:
    "Crash-safe distributed job execution system with lease-based ownership, fencing token and deterministic validation under reclaim races.",
  problem:
    "Retries and mid-execution crashes in distributed job systems can cause duplicate execution, stale writes and unclear recovery behavior.",
  built:
    "Built a PostgreSQL-backed execution platform with row-level locking, atomic lease acquisition, fencing tokens, crash reconciliation, lease reaping, bounded exponential backoff and database-enforced idempotency.",
  proof:
    "Validated across 500 deterministic race reproductions with 0 duplicate commits and 500 stale-write rejections confirmed.",
  metrics: [
    "500 deterministic race runs",
    "0 duplicate commits",
    "500 stale-write rejections",
    "16 drill scenarios · 29 assertions",
  ],
  impact: [
    "Guarantees correctness across worker crashes, reclaim races, and retry amplification.",
    "Prevents duplicate side effects through fencing-token validation and UNIQUE(job_id, fencing_token) constraints.",
    "Makes failure states explicit and recoverable via reconciliation and lease reaping.",
    "Exports Prometheus signals for retries, stale-write prevention, and reconciliation behavior.",
  ],
  stack: [
    "Python",
    "PostgreSQL",
    "Fencing tokens",
    "Idempotency",
    "Retries/backoff",
    "Prometheus",
  ],
  links: [{ href: "https://github.com/kritibehl/faultline", label: "GitHub" }],
  tags: ["Systems", "Reliability", "Execution"],
};

const kubePulse: Project = {
  id: "kubepulse",
  label: "Resilience Validation",
  name: "KubePulse — Kubernetes Resilience Validation",
  oneLiner:
    "Kubernetes resilience validation framework that runs controlled disruption scenarios and measures whether services truly recover.",
  problem:
    "Services often appear healthy until CPU, latency, dependency, or probe failures expose blind spots in recovery behavior and health signals.",
  built:
    "Built a FastAPI control plane, declarative YAML scenarios, real metrics probing, baseline-vs-observed comparison, readiness false-positive detection and automated resilience scorecards.",
  proof:
    "Validated a CPU-stress scenario with 8s recovery, ~210 ms p95 latency, ~2% error rate and an overall resilience score of 86/100.",
  metrics: [
    "8s recovery window",
    "~210 ms p95 latency",
    "~2% error rate",
    "Resilience score 86/100",
  ],
  impact: [
    "Detects cases where Kubernetes probes report healthy while service behavior remains degraded.",
    "Turns resilience checks into automated scorecards and report artifacts instead of one-off chaos runs.",
    "Supports CI-driven resilience validation with Prometheus instrumentation and Markdown exports.",
    "Makes recovery behavior measurable across repeated disruption scenarios.",
  ],
  stack: [
    "Python",
    "FastAPI",
    "Kubernetes",
    "Prometheus",
    "Grafana",
    "GitHub Actions",
  ],
  links: [{ href: "https://github.com/kritibehl/KubePulse", label: "GitHub" }],
  tags: ["Systems", "Reliability"],
};

const detTrace: Project = {
  id: "dettrace",
  label: "Deterministic Debugging",
  name: "DetTrace — Deterministic Replay & Divergence Analysis",
  oneLiner:
    "C++ replay and divergence-analysis tool that turns flaky concurrent failures into reproducible root-cause artifacts.",
  problem:
    "Flaky concurrent failures are difficult to root-cause because downstream symptoms hide the first ordering mistake.",
  built:
    "Built expected-trace capture, guarded replay, event-level comparison, divergence reporting and a flaky-case walkthrough for concurrent ordering failures.",
  proof:
    "Deterministically isolated the first mismatch at event index 5 in a flaky ordering case while preserving 4 debugging artifacts per run.",
  metrics: [
    "First divergence at event index 5",
    "4 generated artifacts per run",
    "20-event expected trace",
    "Passing integration coverage",
  ],
  impact: [
    "Turns nondeterministic failures into reproducible debugging artifacts.",
    "Makes the first divergent event explicit instead of forcing downstream symptom chasing.",
    "Preserves trace artifacts even when replay aborts on mismatch.",
    "Provides a proof-first systems debugging story with generated reports and walkthroughs.",
  ],
  stack: [
    "C++17",
    "Execution tracing",
    "Guarded replay",
    "Divergence reports",
    "Concurrency debugging",
  ],
  links: [{ href: "https://github.com/kritibehl/dettrace", label: "GitHub" }],
  tags: ["Systems", "Execution"],
};

const autoOps: Project = {
  id: "autoops",
  label: "Reliability Analytics & Release Safety",
  name: "AutoOps-Insight — CI / Infrastructure Failure Analytics",
  oneLiner:
    "Reliability analytics platform that converts raw CI and infrastructure logs into structured incident records, recurrence tracking and release-risk summaries.",
  problem:
    "CI/CD pipelines generate volume, not insight; recurring regressions and release blockers hide behind per-run log noise.",
  built:
    "Built a FastAPI + CLI + dashboard + CI system with rule-based plus ML-backed failure classification, stable signature fingerprinting, SQLite history, recurrence tracking and Markdown/JSON reporting.",
  proof:
    "Classifies failures across 11 families and ships with 11 API endpoints, 5 Prometheus counters, 14 passing tests and recurrence-aware release-risk reporting.",
  metrics: [
    "11 failure families",
    "11 FastAPI endpoints",
    "5 Prometheus counters",
    "14 passing tests",
  ],
  impact: [
    "Turns noisy logs into structured incident artifacts with severity, ownership hints, remediation steps and stable signatures.",
    "Detects recurring failures and aggregates release risk across API, CLI, dashboard and CI workflows.",
    "Exports artifacts suitable for headless CI analysis and human-readable incident review.",
    "Stays explainable through deterministic rule layers and lightweight anomaly heuristics.",
  ],
  stack: [
    "Python",
    "FastAPI",
    "SQLite",
    "React",
    "Prometheus",
    "GitHub Actions",
  ],
  links: [
    { href: "https://github.com/kritibehl/autoops-insight", label: "GitHub" },
  ],
  tags: ["Reliability", "Tooling"],
};

const resuMate: Project = {
  id: "resumate",
  label: "Workflow Engine & Backend Tooling",
  name: "ResuMate — API-First Document Analysis Workflow Engine",
  oneLiner:
    "FastAPI workflow engine for structured document analysis, job history, batching, diffing, exports and repeatable automation.",
  problem:
    "Repeated document-analysis workflows become slow and inconsistent without stable contracts, history, diffing and exportable outputs.",
  built:
    "Refactored a prototype into a modular backend with jobs, versions, history, batches, diffing, exports, fingerprinting and dashboard metrics.",
  proof:
    "Implements 12 FastAPI endpoints across 34 Python source files with 10 test files, 5 passing smoke tests, 2 export modes and 7 workflow capabilities.",
  metrics: [
    "12 API endpoints",
    "34 Python files",
    "10 test files",
    "5 passing smoke tests",
  ],
  impact: [
    "Treats document analysis as a repeatable workflow engine instead of a one-shot text generator.",
    "Supports batch jobs, version/history inspection and run-to-run diffing for iterative workflows.",
    "Exports JSON and Markdown artifacts suitable for automation and review.",
    "Surfaces recent jobs, summary metrics and repeated-input stability through dashboard endpoints.",
  ],
  stack: ["Python", "FastAPI", "Pydantic", "Streamlit", "Workflow APIs"],
  links: [{ href: "https://github.com/kritibehl/ResuMate", label: "GitHub" }],
  tags: ["Tooling", "Backend"],
};

const chromeCopilot: Project = {
  id: "chromecopilot",
  label: "Developer Productivity & Debugging Workflows",
  name: "Chrome Copilot — Workflow-First Browser Debugging Assistant",
  oneLiner:
    "Privacy-aware browser debugging assistant with structured parsing, signature clustering, local fallback analysis and issue-summary export.",
  problem:
    "Debugging slows down when logs are noisy, repeated failures are rediscovered from scratch and context is scattered across tools.",
  built:
    "Built browser-side context capture, deterministic parsing and classification, normalized signature clustering, cache-aware repeated triage, local-only mode and Markdown issue-summary export.",
  proof:
    "Validated across 5 representative browser/frontend error categories and 1,000 benchmarked runs with 100% report completeness, 80% noisy-variant cluster stability and workflow reduction from 8 manual steps to 3.",
  metrics: [
    "1,000 benchmarked runs",
    "100% report completeness",
    "80% cluster stability",
    "8 steps → 3 steps",
  ],
  impact: [
    "Transforms browser-side logs into structured debugging reports with probable cause and next-step guidance.",
    "Caches repeated analyses to accelerate recurring triage workflows.",
    "Works in a deterministic local-only mode rather than depending entirely on model-backed analysis.",
    "Produces handoff-ready Markdown issue summaries for debugging and QA workflows.",
  ],
  stack: [
    "JavaScript",
    "Chrome APIs",
    "Structured parsing",
    "Caching",
    "Local fallback analysis",
  ],
  links: [
    { href: "https://github.com/kritibehl/chrome-copilot", label: "GitHub" },
  ],
  tags: ["Tooling"],
};

const accelSim: Project = {
  id: "accelsim",
  label: "Systems Modeling & Performance Reasoning",
  name: "AccelSim-Lite — Deterministic Compute-Pipeline Simulator",
  oneLiner:
    "Deterministic C++ compute-pipeline simulator for workload latency, throughput, queue pressure and bottleneck analysis.",
  problem:
    "Performance-sensitive execution paths are difficult to reason about without deterministic workload models and structured bottleneck metrics.",
  built:
    "Built a 7-stage pipeline simulator with 3 operation classes, configurable compute/memory limits, dependency-aware scheduling and structured report export.",
  proof:
    "Ships with 4 workload classes, 5 stall categories, 6 report artifacts, and CLI-driven run/compare/benchmark workflows for repeatable performance analysis.",
  metrics: [
    "7-stage pipeline",
    "3 op types",
    "4 resource knobs",
    "5 stall categories",
  ],
  impact: [
    "Models workload latency, throughput, queue occupancy, utilization and dominant bottlenecks under constrained resources.",
    "Supports compute-heavy, memory-heavy, queue-pressure and mixed workload comparison.",
    "Exports text, JSON and CSV artifacts for repeatable analysis and plotting.",
    "Provides architecture/performance signal without overstating hardware fidelity.",
  ],
  stack: [
    "C++",
    "Pipeline modeling",
    "Performance metrics",
    "CLI benchmarking",
    "CSV/JSON reporting",
  ],
  links: [
    { href: "https://github.com/kritibehl/accelsim-lite", label: "GitHub" },
  ],
  tags: ["Execution"],
};

const fairEval: Project = {
  id: "faireval",
  label: "ML Evaluation & Release Safety",
  name: "FairEval Suite — CI-Integrated Evaluation & Regression Gating",
  oneLiner:
    "Deterministic evaluation framework that compares model variants, detects silent regressions and produces versioned release-gate artifacts.",
  problem:
    "Model behavior drifts silently across prompt, model and retrieval changes, but most evaluations are not CI-integrated or release-gated.",
  built:
    "Built dataset-driven evaluation runs, baseline-vs-candidate comparison, threshold-based gates, versioned artifacts and CLI + GitHub Actions workflows.",
  proof:
    "Structures evaluation into runs, reports, compare, and gate artifacts to make regression detection reproducible and release decisions auditable.",
  metrics: [
    "4 artifact stages",
    "5+ evaluation cases",
    "7+ automated tests",
    "CI-integrated gating",
  ],
  impact: [
    "Treats ML evaluation as release-blocking quality infrastructure instead of a one-off script.",
    "Detects score and pass-rate regressions before degraded variants ship.",
    "Preserves versioned artifacts for auditability and debugging.",
    "Supports interactive demo-based inspection of gate outcomes.",
  ],
  stack: [
    "Python",
    "CI/CD",
    "Evaluation pipelines",
    "Versioned artifacts",
    "Hugging Face Spaces",
  ],
  links: [
    {
      href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite",
      label: "Live demo",
    },
    { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
  ],
  tags: ["ML", "Reliability"],
};

const jailBreakDefense: Project = {
  id: "jailbreakdefense",
  label: "AI Safety",
  name: "JailBreakDefense",
  oneLiner:
    "Intent-preserving jailbreak defense with benchmarks, traceable logs and measurable safety behavior over time.",
  problem:
    "Binary refusals break UX and still miss adversarial intent; safety systems need consistent, inspectable handling and evaluation.",
  built:
    "Built an intent-repair pipeline with evaluation harnesses, benchmark artifacts and inspectable logs to measure safety behavior over time.",
  proof:
    "Treats safety like reliability: repeatable handling, measurable behavior and regression-friendly evaluation.",
  impact: [
    "Routes adversarial prompts through intent repair instead of blunt refusal where possible.",
    "Preserves user intent while enforcing safer outcomes.",
    "Includes artifacts to track how safety behavior changes over time.",
  ],
  stack: ["Python", "Transformers", "Intent repair", "Evaluation harness"],
  links: [
    {
      href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense",
      label: "Live demo",
    },
    { href: "https://github.com/kritibehl/JailBreakDefense", label: "GitHub" },
  ],
  tags: ["ML", "AI Safety"],
};

const speechIntentEval: Project = {
  id: "speechintenteval",
  label: "Regression Dataset & Robustness",
  name: "SpeechIntentEval",
  oneLiner:
    "Regression suite for subtle, high-context intent in assistant systems across indirect, polite, sarcastic, and ambiguous phrasing.",
  problem:
    "Assistants regress on nuanced intent, and standard test sets miss realistic edge cases that fail silently in production.",
  built:
    "Built a curated evaluation set and regression runner for comparing model behavior on the same high-context intent cases over time.",
  proof:
    "Targets realistic edge cases that are easy to miss in standard test suites but matter in deployed assistants.",
  impact: [
    "Makes nuanced intent regressions testable and repeatable.",
    "Supports apples-to-apples comparisons across model versions on the same intent set.",
    "Extends evaluation coverage beyond obvious benchmark prompts.",
  ],
  stack: ["Python", "Dataset design", "Evaluation scripts", "GitHub Actions"],
  links: [
    {
      href: "https://huggingface.co/spaces/kriti0608/SpeechIntentEval",
      label: "Live demo",
    },
    { href: "https://github.com/kritibehl/SpeechIntentEval", label: "GitHub" },
  ],
  tags: ["ML"],
};

const workflowProjects: Project[] = [resuMate, chromeCopilot, accelSim];
const mlProjects: Project[] = [fairEval, jailBreakDefense, speechIntentEval];

const openSource: OpenSourceContribution[] = [
  {
    id: "temporal-goroutine-leak",
    project: "Temporal Go SDK",
    title: "Fixed goroutine leak in child-workflow test paths",
    summary:
      "Identified child workflow test paths blocking on an unclosed doneChannel and enforced idempotent closure with sync.Once across exit paths.",
    impact:
      "Converted a flaky test-harness resource leak into a regression-tested fix aligned with real workflow cleanup semantics.",
  },
  {
    id: "azure-retry-errors",
    project: "Azure Go SDK (azcore)",
    title: "Improved retry-path transport error visibility",
    summary:
      "Surfaced realClose() transport errors and composed them with request failures using errors.Join to improve diagnosability in retry flows.",
    impact:
      "Made retry behavior easier to debug by preserving the transport-layer signal rather than masking it behind higher-level request failures.",
  },
  {
    id: "temporal-context-propagation",
    project: "Temporal Go SDK",
    title: "Applied workflow context propagators in mock execution",
    summary:
      "Updated mock workflow execution paths so OnWorkflow matchers observe propagated headers consistent with real workflow execution.",
    impact:
      "Closed the gap between test-path behavior and real runtime semantics, improving correctness for workflow-context-dependent tests.",
  },
];

const articles: Article[] = [
  {
    id: "silent-regressions",
    title: "Detecting Silent Regressions in GenAI Systems at Scale",
    subtitle:
      "A systems approach to drift: stable metrics, reproducibility, and CI gating.",
    href: "https://medium.com/@kriti0608/detecting-silent-regressions-in-genai-systems-at-scale-039ec03db1e4",
    tags: ["Production", "CI", "Metrics"],
  },
  {
    id: "distributed-system-failed",
    title: "The Day My Distributed System Failed — and Why That Was the Point",
    subtitle:
      "Why deterministic failure drills, explicit invariants, and recovery artifacts matter more than happy-path demos.",
    href: "https://medium.com/@kriti0608",
    tags: ["Distributed Systems", "Postmortem", "Correctness"],
  },
  {
    id: "intent-repair",
    title:
      "Why AI Refusals Feel Like Punishment — and How I Learned to Repair Intent Instead",
    subtitle:
      "Treating safety like reliability: measurable behavior, better UX, and inspectable fallback paths.",
    href: "https://medium.com/@kriti0608",
    tags: ["AI Safety", "Reliability", "UX"],
  },
];

const skills: Record<string, string[]> = {
  "Core Languages": [
    "C++",
    "Go",
    "Python",
    "TypeScript/JavaScript",
    "Java",
    "SQL",
  ],
  "Systems & Correctness": [
    "State machines",
    "Idempotency",
    "Deterministic replay",
    "Invariants",
    "Retries/backoff",
  ],
  "Reliability Engineering": [
    "Failure modes",
    "Chaos testing",
    "Regression testing",
    "Release readiness",
    "Debuggability",
  ],
  Observability: [
    "Prometheus",
    "Grafana",
    "Metrics design",
    "Structured logging",
  ],
  "Backend & Workflow APIs": [
    "FastAPI",
    "REST",
    "Pydantic",
    "Node.js/Express",
    "API design",
  ],
  "Cloud & Runtime": [
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "SQLite",
    "GitHub Actions",
  ],
};

function classNames(...xs: Array<string | undefined | false>) {
  return xs.filter(Boolean).join(" ");
}

function useScrollY(threshold = 420) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}

export default function Home() {
  const showSticky = useScrollY(420);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-sky-500/30 selection:text-slate-50">
      <div
        className={classNames(
          "fixed bottom-4 right-4 z-50 transition-all duration-300",
          showSticky
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none",
        )}
      >
        <a
          href={`mailto:${CONTACT.email}?subject=Portfolio%20-%20Let's%20talk`}
          className="group flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-200 shadow-xl shadow-black/50 backdrop-blur hover:border-sky-500/70"
        >
          <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs text-sky-200 group-hover:bg-sky-500/25">
            ✉️ Email
          </span>
          <span className="hidden sm:inline">{CONTACT.email}</span>
          <span className="sm:hidden">Contact</span>
        </a>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 lg:px-6">
        <header className="mb-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-5xl font-extrabold tracking-tight text-white leading-none">
              {CONTACT.name.toUpperCase()}
            </div>
            <div className="mt-2 text-lg font-medium text-slate-300">
              Backend · Systems · Reliability Engineering
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <a href="#projects" className="hover:text-slate-100">
              Projects
            </a>
            <a href="#opensource" className="hover:text-slate-100">
              Open Source
            </a>
            <a href="#experience" className="hover:text-slate-100">
              Experience
            </a>
            <a href="#writing" className="hover:text-slate-100">
              Writing
            </a>
            <a href="#contact" className="hover:text-slate-100">
              Contact
            </a>
            <ExternalLink
              href={CONTACT.linkedin}
              className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
            >
              LinkedIn
            </ExternalLink>
            <ExternalLink
              href={CONTACT.github}
              className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
            >
              GitHub
            </ExternalLink>
          </nav>
        </header>

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/90 p-8 text-center shadow-2xl shadow-black/60 md:p-10">
            <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
              BACKEND • SYSTEMS • RELIABILITY
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              I build correctness-first software that stays safe under crashes,
              races, and silent regressions.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-200">
              My work focuses on{" "}
              <span className="text-sky-300">crash-safe execution</span>,{" "}
              <span className="text-sky-300">resilience validation</span>,{" "}
              <span className="text-sky-300">deterministic debugging</span>, and{" "}
              <span className="text-indigo-300">release-safety tooling</span>{" "}
              that makes failures visible, reproducible, and fixable.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${CONTACT.email}?subject=Portfolio%20-%20Let's%20talk`}
                className="rounded-full bg-sky-600/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 hover:bg-sky-500"
              >
                ✉️ Email Me
              </a>
              <a
                href="#projects"
                className="rounded-full border border-slate-600 bg-slate-950/40 px-6 py-3 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
              >
                View Projects
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {proofStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left"
                >
                  <div className="text-[0.72rem] uppercase tracking-[0.22em] text-slate-400">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-sm font-medium leading-relaxed text-slate-100">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <span className="font-medium text-sky-300">
                  Distributed execution
                </span>
                <p className="mt-1 leading-relaxed text-slate-300">
                  Crash-safe job processing, reconciliation, retries, and
                  database-backed correctness guarantees.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <span className="font-medium text-sky-300">
                  Resilience validation
                </span>
                <p className="mt-1 leading-relaxed text-slate-300">
                  Recovery scorecards, readiness-integrity checks,
                  observability, and release-safety validation under disruption.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <span className="font-medium text-sky-300">
                  Deterministic debugging
                </span>
                <p className="mt-1 leading-relaxed text-slate-300">
                  Replay, divergence detection, trace artifacts, and debugging
                  workflows that make flaky failures reproducible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="mb-12 space-y-10">
          <SectionHeader
            title="Flagship Systems & Reliability Projects"
            subtitle="Proof-first work in crash-safe execution, resilience validation, deterministic debugging, and release-safety tooling."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FeaturedCard project={faultline} tone="indigo" />
            <FeaturedCard project={kubePulse} tone="sky" />
          </div>

          <SmartGrid count={2}>
            <ProjectCard project={detTrace} />
            <ProjectCard project={autoOps} />
          </SmartGrid>

          <div className="pt-6">
            <SectionHeader
              title="Workflow, Tooling & Backend Projects"
              subtitle="API-first workflow systems, debugging accelerators, and supporting performance/systems tooling."
            />
            <div className="mt-4">
              <SmartGrid count={workflowProjects.length}>
                {workflowProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SmartGrid>
            </div>
          </div>

          <div className="pt-6">
            <SectionHeader
              title="ML Evaluation & Release Safety"
              subtitle="Selective ML infrastructure work focused on deterministic evaluation, regression detection, and release gating."
            />
            <div className="mt-4">
              <SmartGrid count={mlProjects.length}>
                {mlProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SmartGrid>
            </div>
          </div>
        </section>

        <section id="demos" className="mb-12 space-y-4">
          <SectionHeader
            title="Interactive Demos"
            subtitle="Live demos for selected ML evaluation and safety projects."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {demoCards.map((d) => (
              <DemoCard
                key={d.title}
                kicker={d.kicker}
                title={d.title}
                desc={d.desc}
                links={d.links}
              />
            ))}
          </div>
        </section>

        <section id="opensource" className="mb-12 space-y-4">
          <SectionHeader
            title="Open Source Systems Engineering"
            subtitle="Recent reliability and correctness contributions in widely used systems SDKs and workflow tooling."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {openSource.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <div className="text-[0.72rem] uppercase tracking-[0.22em] text-slate-400">
                  {item.project}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-200">
                  {item.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.impact}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="mb-12 space-y-4">
          <SectionHeader
            title="Experience"
            subtitle="Hands-on engineering across backend systems, observability and operational reliability."
          />
          <div className="space-y-4">
            {experience.map((exp) => (
              <article
                key={exp.id}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-7 md:p-8 shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-sky-400">{exp.company}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {exp.period}
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      {exp.location}
                    </span>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-slate-100">
                  {exp.achievements.map((a) => (
                    <li key={a} className="flex gap-3">
                      <span className="mt-[0.2rem] text-sky-400">▹</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="mb-12 space-y-4">
          <SectionHeader
            title="Education"
            subtitle="CS foundation across systems, networks, security and applied ML."
          />
          <div className="space-y-4">
            {education.map((edu) => (
              <article
                key={edu.id}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-7 md:p-8 shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-sky-400">{edu.school}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {edu.period}
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      {edu.location}
                    </span>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-slate-100">
                  {edu.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-[0.2rem] text-sky-400">▹</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="mb-12 space-y-4">
          <SectionHeader
            title="Technical Skills"
            subtitle="A compact evidence-backed snapshot of the tools and concepts used across the projects above."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(skills).map(([category, items]) => (
              <div
                key={category}
                className="flex h-full min-h-[180px] flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-black/30 hover:border-sky-500/40"
              >
                <h3 className="text-base font-semibold text-sky-400">
                  {category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[0.85rem] leading-none text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="writing" className="mb-12 space-y-4">
          <SectionHeader
            title="Writing: Failures, Regressions & Deterministic Debugging"
            subtitle="Postmortems and engineering notes from real builds, incidents, missing signals and release-safety work."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-base shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <h3 className="text-[1.05rem] font-semibold text-slate-50">
                  {a.title}
                </h3>
                <p className="text-[1rem] leading-relaxed text-slate-200">
                  {a.subtitle}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-[0.7rem] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <ExternalLink
                    href={a.href}
                    className="text-sm text-sky-400 underline underline-offset-2 hover:text-sky-300"
                  >
                    Read on Medium
                  </ExternalLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
            Let’s Talk
          </h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-7 md:p-8 text-slate-100 shadow-xl shadow-black/40">
            <p className="text-[1.05rem] leading-relaxed text-slate-200">
              If your team cares about{" "}
              <span className="text-sky-300">correctness under failure</span>,{" "}
              <span className="text-sky-300">distributed systems</span>,{" "}
              <span className="text-sky-300">debuggability</span>, or{" "}
              <span className="text-sky-300">release-safety tooling</span>, I’d
              love to hear from you.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${CONTACT.email}?subject=Portfolio%20-%20Let's%20talk`}
                className="rounded-full bg-sky-600/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 hover:bg-sky-500"
              >
                ✉️ {CONTACT.email}
              </a>
              <ExternalLink
                href={CONTACT.github}
                className="rounded-full border border-slate-700 bg-slate-950/40 px-5 py-3 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
              >
                GitHub
              </ExternalLink>
              <ExternalLink
                href={CONTACT.linkedin}
                className="rounded-full border border-slate-700 bg-slate-950/40 px-5 py-3 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
              >
                LinkedIn
              </ExternalLink>
              <ExternalLink
                href={CONTACT.huggingface}
                className="rounded-full border border-slate-700 bg-slate-950/40 px-5 py-3 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
              >
                Hugging Face
              </ExternalLink>
              <ExternalLink
                href={CONTACT.medium}
                className="rounded-full border border-slate-700 bg-slate-950/40 px-5 py-3 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
              >
                Medium
              </ExternalLink>
            </div>
            <div className="mt-4 text-xs text-slate-400">Email works best.</div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              Built with Next.js + TypeScript. Proof-first portfolio; key
              systems are open source.
            </div>
            <div>
              © {new Date().getFullYear()} {CONTACT.name}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const hasSubtitle = Boolean(subtitle && subtitle.trim().length > 0);
  return (
    <div
      className={classNames(
        "flex flex-col gap-1",
        hasSubtitle ? "md:flex-row md:items-baseline md:justify-between" : "",
      )}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
        {title}
      </h2>
      {hasSubtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-[0.95rem]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isHash = href.startsWith("#");
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={isHash || isMail ? undefined : "_blank"}
      rel={isHash || isMail ? undefined : "noopener noreferrer"}
      className={`relative z-10 cursor-pointer pointer-events-auto ${className ?? ""}`}
    >
      {children}
    </a>
  );
}

function DemoCard({
  kicker,
  title,
  desc,
  links,
}: {
  kicker: string;
  title: string;
  desc: string;
  links: LinkItem[];
}) {
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-base shadow-lg shadow-black/40 hover:border-sky-500/60 hover:shadow-xl hover:shadow-black/60">
      <div className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">
        {kicker}
      </div>
      <h3 className="text-[1.05rem] font-semibold text-slate-50">{title}</h3>
      <p className="text-[1rem] leading-relaxed text-slate-200">{desc}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <ExternalLink
            key={l.href + l.label}
            href={l.href}
            className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
          >
            {l.label}
          </ExternalLink>
        ))}
      </div>
    </article>
  );
}

function FeaturedCard({
  project,
  tone,
}: {
  project: Project;
  tone: "sky" | "indigo";
}) {
  const toneBorder =
    tone === "sky"
      ? "border-sky-700/70 hover:border-sky-400/80"
      : "border-indigo-700/70 hover:border-indigo-400/80";
  const toneBg =
    tone === "sky"
      ? "from-sky-950 via-slate-950 to-slate-950/95"
      : "from-indigo-950 via-slate-950 to-slate-950/95";
  const toneTag =
    tone === "sky"
      ? "border-sky-500/50 bg-sky-500/10 text-sky-100"
      : "border-indigo-500/50 bg-indigo-500/10 text-indigo-100";

  return (
    <article
      className={classNames(
        "rounded-3xl border bg-gradient-to-br p-7 md:p-8 shadow-xl shadow-black/60 transition",
        toneBorder,
        toneBg,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-300">
          Flagship
        </div>
        <span
          className={classNames(
            "rounded-full border px-3 py-1 text-[0.7rem]",
            toneTag,
          )}
        >
          {project.label}
        </span>
      </div>
      <h3 className="mt-2 text-2xl font-semibold text-slate-50">
        {project.name}
      </h3>
      <p className="mt-2 text-lg leading-relaxed text-slate-100">
        {project.oneLiner}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 text-base text-slate-200">
        {project.problem ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Problem
            </div>
            <p className="mt-1 leading-relaxed">{project.problem}</p>
          </div>
        ) : null}
        {project.built ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Built
            </div>
            <div className="mt-1 text-base leading-relaxed text-slate-200">
              {project.built}
            </div>
          </div>
        ) : null}
        {project.proof ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Proof
            </div>
            <div className="mt-1 text-base leading-relaxed text-slate-200">
              {project.proof}
            </div>
          </div>
        ) : null}
      </div>
      {project.metrics?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.metrics.map((metric) => (
            <span
              key={metric}
              className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-200"
            >
              {metric}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.links.map((l) => (
          <ExternalLink
            key={l.href + l.label}
            href={l.href}
            className="rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
          >
            {l.label}
          </ExternalLink>
        ))}
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-7 md:p-8 text-base shadow-lg shadow-black/40 transition hover:border-sky-500/60 hover:shadow-xl hover:shadow-black/60">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.78rem] uppercase tracking-[0.24em] text-slate-400">
          {project.label}
        </div>
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-700 bg-slate-950/50 px-2 py-1 text-[0.7rem] text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-50">{project.name}</h3>
      <p className="text-lg leading-relaxed text-slate-100">
        {project.oneLiner}
      </p>

      {(project.problem || project.built || project.proof) && (
        <div className="grid grid-cols-1 gap-2">
          {project.problem ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Problem
              </div>
              <div className="mt-1 text-base leading-relaxed text-slate-200">
                {project.problem}
              </div>
            </div>
          ) : null}
          {project.built ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Built
              </div>
              <div className="mt-1 text-base leading-relaxed text-slate-200">
                {project.built}
              </div>
            </div>
          ) : null}
          {project.proof ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Proof
              </div>
              <div className="mt-1 text-base leading-relaxed text-slate-200">
                {project.proof}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {project.metrics?.length ? (
        <div className="flex flex-wrap gap-2">
          {project.metrics.map((metric) => (
            <span
              key={metric}
              className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-200"
            >
              {metric}
            </span>
          ))}
        </div>
      ) : null}

      <ul className="space-y-2 text-base leading-relaxed text-slate-300">
        {project.impact.slice(0, 4).map((line) => (
          <li key={line} className="pl-3">
            <span className="mr-1 text-slate-500">•</span>
            {line}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        {project.stack.slice(0, 10).map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.links.map((link) => (
          <ExternalLink
            key={link.href + link.label}
            href={link.href}
            className="rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
          >
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </article>
  );
}

function SmartGrid({
  count,
  children,
  className,
}: {
  count: number;
  children: React.ReactNode;
  className?: string;
}) {
  if (count === 1) {
    return (
      <div className={classNames("flex justify-center", className)}>
        <div className="w-full max-w-4xl">{children}</div>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className={classNames("grid grid-cols-1 gap-6 md:grid-cols-3", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={classNames("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
      {children}
    </div>
  );
}
