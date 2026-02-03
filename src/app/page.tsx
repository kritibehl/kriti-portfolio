// src/app/page.tsx
"use client";

/**
 * FAANG-coded portfolio page (email-first, proof-first, readable, no dead-space grids).
 *
 * Included changes:
 * ✅ Removed VoiceVisionReasoner (Option A)
 * ✅ Larger readable fonts (text-base/text-lg + leading-relaxed)
 * ✅ Removed “30-second proof” label (replaced with capability anchors)
 * ✅ Removed Skills subtitle (“Kept tight and relevant...”)
 * ✅ Fixed empty space next to single-card sections (SmartGrid: 1 card => centered, 2+ => grid)
 * ✅ Contact microcopy: “Feel free to reach out — email works best.”
 */

import React, { useEffect, useMemo, useState } from "react";

/* ----------------------------- Types ----------------------------- */

type LinkItem = { href: string; label: string };

type Project = {
  id: string;
  label: string;
  name: string;
  oneLiner: string;

  problem?: string;
  built?: string;
  proof?: string;

  impact: string[];
  stack: string[];
  links: LinkItem[];
  tags: string[];
  featured?: boolean;
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

/* ----------------------------- Config ----------------------------- */

const CONTACT = {
  name: "Kriti Behl",
  email: "kriti0608@gmail.com",
  github: "https://github.com/kritibehl",
  linkedin: "https://www.linkedin.com/in/kriti-behl/",
  huggingface: "https://huggingface.co/kriti0608",
  medium: "https://medium.com/@kriti0608",
};

const FILTERS = [
  "Featured",
  "Distributed Systems",
  "Reliability",
  "Execution",
  "GenAI Evaluation",
  "AI Safety",
  "Tooling",
] as const;

/* ----------------------------- Data: Experience ----------------------------- */

const experience: Experience[] = [
  {
    id: "thales-devsecops-elite",
    company: "Thales Group",
    role: "DevSecOps Intern",
    period: "Jun 2025 – Aug 2025",
    location: "Plantation, FL, USA",
    achievements: [
      "Improved correctness and trust in operational metrics by making lifecycle data crash-safe, regression-aware and debuggable.",
      "Built crash-safe lifecycle state machines to convert raw PostgreSQL event logs into KPI-grade efficiency and utilization metrics, replacing brittle manual analysis.",
      "Designed out-of-order and missing-event–tolerant aggregation logic, enabling reliable regression detection across releases despite imperfect data.",
      "Shipped Chart.js dashboards with drill-down views used by engineers to identify regressions and triage issues faster.",
      "Focused on system correctness under imperfect data, not just happy-path dashboards.",
    ],
  },

  {
    id: "uf-ga-elite",
    company: "University of Florida",
    role: "Graduate Assistant",
    period: "Dec 2024 – Dec 2025",
    location: "Gainesville, FL, USA",
    achievements: [
      "Maintained reliability in high-churn, constraint-driven operations by reducing coordination failure and execution drift.",
      "Owned weekly operational workflows under frequent last-minute changes, maintaining reliable execution despite shifting constraints.",
      "Identified failure points in handoffs and tracking, then standardized recurring workflows and artifacts to reduce missed actions and reporting gaps.",
      "Improved week-over-week execution reliability by turning ad-hoc coordination into repeatable, debuggable processes.",
    ],
  },

  {
    id: "elixir-swe-elite",
    company: "Elixir Web Solutions",
    role: "Software Development Intern",
    period: "May 2024 – Aug 2024",
    location: "New Delhi, India",
    achievements: [
      "Improved dashboard reliability and perceived performance by hardening behavior under partial failures.",
      "Built SEO analytics dashboards using Node.js/Express and REST APIs for client reporting.",
      "Reduced perceived latency by optimizing rendering paths and eliminating redundant DOM work.",
      "Added defensive error handling and fallback states to keep dashboards usable during partial API failures.",
    ],
  },

  {
    id: "c1-swe-elite",
    company: "C1 India Pvt Ltd",
    role: "Software Engineering Intern",
    period: "Jun 2023 – Aug 2023",
    location: "Gurugram, India",
    achievements: [
      "Increased backend robustness by validating failure and recovery assumptions early.",
      "Designed Java backend modules supporting procurement workflows and enterprise integrations.",
      "Simulated fault-tolerance and log-recovery scenarios to validate resilience assumptions before production exposure.",
      "Implemented defensive input validation and edge-case handling to reduce production risk and instability.",

    ],
  },
];


/* ----------------------------- Data: Education ----------------------------- */

const education: Education[] = [
  {
    id: "uf-mscs",
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
    id: "jiit-btech",
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

/* ----------------------------- Data: Live Demos ----------------------------- */

const demoCards = [
  {
    kicker: "Production ML System",
    title: "FairEval Suite",
    desc: "Deterministic GenAI evaluation with CI-friendly regression detection and inspectable metrics.",
    links: [
      { href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite", label: "Live demo" },
      { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
      { href: "https://doi.org/10.5281/zenodo.17625268", label: "Zenodo" },
    ],
  },
  {
    kicker: "Safety Middleware",
    title: "JailBreakDefense",
    desc: "Intent-preserving jailbreak defense with benchmarks and traceable logs over time.",
    links: [
      { href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense", label: "Live demo" },
      { href: "https://github.com/kritibehl/JailBreakDefense", label: "GitHub" },
      { href: "https://doi.org/10.5281/zenodo.17694184", label: "Zenodo" },
    ],
  },
  {
    kicker: "Regression Suite",
    title: "SpeechIntentEval",
    desc: "High-context intent regression tests (polite, sarcastic, ambiguous) for assistant robustness.",
    links: [
      { href: "https://huggingface.co/spaces/kriti0608/SpeechIntentEval", label: "Live demo" },
      { href: "https://github.com/kritibehl/SpeechIntentEval", label: "GitHub" },
    ],
  },
];

/* ----------------------------- Data: Projects ----------------------------- */

const faultline: Project = {
  id: "faultline",
  featured: true,
  label: "Distributed Systems & Execution Correctness (ELITE)",
  name: "Faultline — Distributed Job Processing System",

  oneLiner:
    "Crash-safe distributed job execution system that remains correct under worker crashes, retries and partial failures.",

  problem:
    "Retries and mid-execution crashes commonly cause duplicate execution, inconsistent state and unclear recovery paths in distributed job systems.",

  built:
    "Designed a lease-based distributed state machine with database-enforced idempotency, bounded retries with backoff and crash-safe reconciliation.",

  proof:
    "Designed to make failure states explicit and recoverable, reducing incident ambiguity and manual intervention during outages.",

  impact: [
    "Guarantees correctness across worker crashes, race conditions and retry amplification.",
    "Prevents duplicate side effects through database-enforced idempotency.",
    "Deterministically converges state instead of masking errors during recovery.",
    "Prometheus dashboards surface retry storms, partial failures and recovery behavior.",
  ],

  stack: [
    "Go",
    "PostgreSQL",
    "Distributed state machines",
    "Idempotency",
    "Retries/backoff",
    "Prometheus",
  ],

  links: [{ href: "https://github.com/kritibehl/faultline", label: "GitHub" }],
  tags: ["Featured", "Distributed Systems", "Execution", "Reliability"],
};

const faireval: Project = {
  id: "faireval",
  featured: true,
  label: "GenAI Evaluation & Release Safety (ELITE)",
  name: "FairEval Suite — Deterministic GenAI Evaluation",

  oneLiner:
    "Deterministic GenAI evaluation framework designed to catch silent regressions before models ship.",

  problem:
    "GenAI behavior drifts silently across versions; most evaluations are non-repeatable and not CI-integrated.",

  built:
    "Deterministic scoring, CI-integrated regression gates, and versioned evaluation artifacts.",

  proof:
    "Treats GenAI evaluation as a release-blocking quality gate, not an offline research artifact.",

  impact: [
    "Catches silent regressions before release.",
    "Supports safe model iteration under frequent version churn.",
    "Provides auditability via versioned artifacts.",
  ],

  stack: [
    "Python",
    "FastAPI",
    "CI/CD",
    "Evaluation pipelines",
    "Versioned artifacts",
  ],

  links: [
    { href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite", label: "Live demo" },
    { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
  ],

  tags: ["Featured", "GenAI Evaluation", "Reliability"],
};

const reliabilityInfra: Project[] = [
 {
  id: "autoops",
  label: "Reliability & Release Safety (ELITE)",
  name: "AutoOps-Insight — CI/CD Failure Analytics",

  oneLiner:
    "Turns noisy CI/CD logs into actionable reliability signals by surfacing recurring failure modes.",

  problem:
    "CI/CD pipelines generate volume, not insight—systemic failures hide behind per-run noise.",

  built:
    "Failure classification pipeline over CI logs with dashboards for flaky tests, slow stages, and repeat offenders.",

  proof:
    "Shifts CI from per-run debugging to trend-based reliability analysis.",

  impact: [
    "Reduces manual triage by surfacing systemic reliability issues.",
    "Highlights flaky tests and chronic failure points.",
    "Designed to reduce mean-time-to-diagnosis.",
  ],

  stack: [
    "Python",
    "FastAPI",
    "CI/CD APIs",
    "Prometheus",
    "Grafana",
  ],

  links: [{ href: "https://github.com/kritibehl/autoops-insight", label: "GitHub" }],
  tags: ["Reliability", "Tooling"],
}
,
  {
    id: "kubepulse",
    label: "Chaos Engineering",
    name: "KubePulse",
    oneLiner: "Chaos testing framework to inject controlled failures and validate resilience before production incidents.",
    problem:
      "Systems look healthy until infrastructure fails; observability gaps and brittle recovery paths surface too late.",
    built: "Controlled experiments for pod crashes, latency, CPU pressure and network disruption tied to resilience checks.",
    proof: "Failure injection makes hidden failure modes measurable and repeatable.",
    impact: [
      "Injects controlled outages and resource pressure to validate behavior under partial failures.",
      "Surfaces brittle dependencies and missing signals before they become incidents.",
      "Supports reliability test runs aligned with release readiness workflows.",
      "Pairs experiments with metrics/alerts to validate detection, not just recovery.",
    ],
    stack: ["Python", "Kubernetes", "Docker", "Prometheus", "Grafana"],
    links: [{ href: "https://github.com/kritibehl/kubepulse", label: "GitHub" }],
    tags: ["Reliability"],
  },
];

const executionDeterminism: Project[] = [
  {
  id: "dettrace",
  label: "Execution Correctness & Verification (ELITE)",
  name: "DetTrace — Deterministic Replay & Invariant Verification",

  oneLiner:
    "Deterministic execution replay engine that converts nondeterministic bugs into reproducible, fail-fast failures.",

  problem:
    "Nondeterministic execution makes flaky tests and concurrency bugs difficult to reproduce and diagnose.",

  built:
    "Stable execution trace recording, deterministic replay, and runtime enforcement of ordering and state invariants.",

  proof:
    "Fail-fast diagnostics identify the first divergent event, not downstream symptoms.",

  impact: [
    "Eliminates non-reproducible failures by making execution deterministic by design.",
    "Enforces ordering and state invariants at runtime.",
    "Shortens debug cycles for flaky tests and concurrency issues.",
    "Designed for scheduling races and regressions that logging cannot isolate.",
  ],

  stack: [
    "C++17",
    "Deterministic replay",
    "Invariant enforcement",
    "Execution tracing",
    "Concurrency debugging",
  ],

  links: [{ href: "https://github.com/kritibehl/dettrace", label: "GitHub" }],
  tags: ["Execution", "Reliability"],
}
,
  {
  id: "accelsim",
  label: "Systems Modeling (ELITE)",
  name: "AccelSim-Lite — CPU / Accelerator Functional Simulator",

  oneLiner:
    "Deterministic execution model for reasoning about correctness and performance in CPU and accelerator pipelines.",

  problem:
    "Low-level execution paths are timing- and ordering-sensitive, making correctness and performance hard to reason about.",

  built:
    "Deterministic models for compute units, queues, and memory interactions with unit-tested lifecycle transitions.",

  proof:
    "Enables repeatable correctness analysis for execution paths that are otherwise nondeterministic.",

  impact: [
    "Models instruction flow, scheduling, and execution latency deterministically.",
    "Unit tests validate instruction ordering and lifecycle boundaries.",
    "Supports reasoning about scheduling trade-offs under deterministic assumptions.",
  ],

  stack: [
    "C++",
    "OOP",
    "CPU pipelines",
    "Accelerator modeling",
    "Deterministic simulation",
  ],

  links: [{ href: "https://github.com/kritibehl/accelsim-lite", label: "GitHub" }],
  tags: ["Execution"],
},
];

/**
 * ✅ Option A applied: VoiceVisionReasoner removed here.
 */
const genaiSafety: Project[] = [
  {
    id: "jailbreakdefense",
    label: "AI Safety · Security",
    name: "JailBreakDefense",
    oneLiner:
      "Safety middleware that detects jailbreak-style prompts and repairs intent while keeping the assistant usable.",
    problem: "Binary refusals break UX and still miss adversarial intent; safety needs measurable behavior over time.",
    built: "Intent-repair pipeline + evaluation harness + inspectable logs/benchmarks for continuous measurement.",
    proof: "Treats safety like reliability: consistent handling, measurable outcomes, repeatable evaluation.",
    impact: [
      "Routes adversarial prompts through intent-repair instead of blunt refusals.",
      "Preserves user intent by rewriting unsafe requests toward safe alternatives where possible.",
      "Designed as a lightweight drop-in layer in front of existing LLM APIs.",
      "Includes benchmarks and artifacts to track safety behavior over time.",
    ],
    stack: ["Python", "Transformers", "Intent Repair", "Evaluation Harness", "Redis"],
    links: [
      { href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense", label: "Live demo" },
      { href: "https://github.com/kritibehl/jailbreak-defense", label: "GitHub" },
    ],
    tags: ["AI Safety", "GenAI Evaluation"],
  },
  {
    id: "speechintenteval",
    label: "Robustness · Dataset",
    name: "SpeechIntentEval",
    oneLiner:
      "Regression suite for subtle, high-context intent (indirect, polite, sarcastic, ambiguous) in assistants.",
    problem: "Assistants regress on nuanced intent; standard evals often miss these failures.",
    built: "Curated test set + regression runner for consistent comparisons across models/versions.",
    proof: "Targets realistic edge cases that cause silent regressions in production assistants.",
    impact: [
      "Curates high-context intent cases to probe robustness under real phrasing variation.",
      "Runs regression tests against new model versions to catch drift early.",
      "Supports apples-to-apples comparisons across models on the same intent set.",
      "Designed to expose failure modes easy to miss in standard test suites.",
    ],
    stack: ["Python", "Dataset Design", "Evaluation Scripts", "GitHub Actions"],
    links: [
      { href: "https://huggingface.co/spaces/kriti0608/SpeechIntentEval", label: "Live demo" },
      { href: "https://github.com/kritibehl/speech-intent-eval", label: "GitHub" },
    ],
    tags: ["GenAI Evaluation"],
  },
];

const developerTools: Project[] = [
  {
    id: "chromecopilot",
    label: "Developer Productivity",
    name: "Chrome Copilot",
    oneLiner: "Privacy-first browser extension to debug logs and stack traces faster (workflow-first, not chat-first).",
    problem: "Debugging slows down when logs are noisy and context is scattered across tools.",
    built: "In-browser parsing + suggested fix paths using LLM APIs with caching and rate limiting.",
    proof: "Designed to minimize data handling: avoid server-side storage by default and keep workflows practical.",
    impact: [
      "Parses console logs and exception traces in the browser to reduce context switching.",
      "Suggests likely causes and fix paths with caching + rate limiting for predictable behavior.",
      "Privacy-first constraints by design (no default server-side log storage).",
      "Built for real debugging workflows rather than generic chatbot interactions.",
    ],
    stack: ["JavaScript", "Chrome APIs", "LLM APIs", "Caching", "Rate Limiting"],
    links: [{ href: "https://github.com/kritibehl/chrome-copilot", label: "GitHub" }],
    tags: ["Tooling"],
  },
  {
    id: "resumate",
    label: "Applied ML · Backend",
    name: "ResuMate",
    oneLiner: "API-first resume-to-job analyzer that turns job requirements into structured, actionable feedback.",
    problem: "Tailoring resumes is slow without a structured mapping from requirements to evidence.",
    built: "Backend service comparing resumes vs JDs and returning structured matches/gaps as JSON.",
    proof: "Designed for iterative workflows with persistence rather than one-off outputs.",
    impact: [
      "Extracts requirement matches and gaps to accelerate targeting and iteration.",
      "Maps missing requirements to suggested bullet rewrites to improve clarity and alignment.",
      "Exposes a clean FastAPI JSON API suitable for automation and dashboards.",
      "Built to support repeated iteration with stable, readable outputs.",
    ],
    stack: ["Python", "FastAPI", "Docker", "Redis", "LLM APIs"],
    links: [{ href: "https://github.com/kritibehl/resumate", label: "GitHub" }],
    tags: ["Tooling"],
  },
];

/* ----------------------------- Data: Writing ----------------------------- */

const articles: Article[] = [
  {
    id: "faireval-human-aligned",
    title: "FairEval: A Human-Aligned Evaluation Framework for Generative Models",
    subtitle: "Designing deterministic evaluation signals to catch silent regressions and compare versions reliably.",
    href: "https://medium.com/@kritibehl",
    tags: ["ML Systems", "Evaluation", "Reliability"],
  },
  {
    id: "silent-regressions",
    title: "Detecting Silent Regressions in GenAI Systems at Scale",
    subtitle: "A systems approach to drift: stable metrics, reproducibility and CI gating.",
    href: "https://medium.com/@kritibehl",
    tags: ["Production", "CI", "Metrics"],
  },
  {
    id: "observability-incident",
    title: "I Thought I Built Observability. Then an Incident Proved I Didn’t.",
    subtitle: "What failed, what signals were missing and how to redesign instrumentation for debuggability.",
    href: "https://medium.com/@kritibehl",
    tags: ["Observability", "Incidents", "Systems"],
  },
];

/* ----------------------------- Data: Skills ----------------------------- */

const skills: Record<string, string[]> = {
  "Core Languages": ["C++", "Go", "Python", "TypeScript/JavaScript", "Java", "SQL"],

  "Systems & Correctness": [
    "State machines",
    "Idempotency",
    "Deterministic replay",
    "Invariants",
    "Retries/backoff",
  ],

  "Backend Engineering": [
    "FastAPI",
    "REST",
    "Node.js/Express",
    "API design",
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

  "Cloud & DevOps": [
    "Docker",
    "Kubernetes",
    "CI/CD",
    "AWS (basics)",
  ],

  Datastores: ["PostgreSQL", "MongoDB", "Redis"],

  "Testing & Quality Engineering": [
    "Unit testing",
    "Integration testing",
    "Property-based testing",
    "Flaky test mitigation",
    "CI validation",
  ],
};


/* ----------------------------- Helpers ----------------------------- */

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

/* ----------------------------- Page ----------------------------- */

export default function Home() {
  const showSticky = useScrollY(420);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Featured");

  const allProjects = useMemo<Project[]>(
    () => [faultline, faireval, ...reliabilityInfra, ...executionDeterminism, ...genaiSafety, ...developerTools],
    []
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === "Featured") return [faultline, faireval];
    if (activeFilter === "Distributed Systems") return allProjects.filter((p) => p.tags.includes("Distributed Systems"));
    if (activeFilter === "Reliability") return allProjects.filter((p) => p.tags.includes("Reliability"));
    if (activeFilter === "Execution") return allProjects.filter((p) => p.tags.includes("Execution"));
    if (activeFilter === "GenAI Evaluation") return allProjects.filter((p) => p.tags.includes("GenAI Evaluation"));
    if (activeFilter === "AI Safety") return allProjects.filter((p) => p.tags.includes("AI Safety"));
    if (activeFilter === "Tooling") return allProjects.filter((p) => p.tags.includes("Tooling"));
    return allProjects;
  }, [activeFilter, allProjects]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-sky-500/30 selection:text-slate-50">
      {/* Sticky email CTA */}
      <div
        className={classNames(
          "fixed bottom-4 right-4 z-50 transition-all duration-300",
          showSticky ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
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
        {/* Header */}
        <header className="mb-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-5xl font-extrabold tracking-tight text-white leading-none">
              {CONTACT.name.toUpperCase()}
            </div>
            <div className="mt-2 text-lg font-medium text-slate-300">
              Correctness under failure — execution · infrastructure · GenAI systems
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <a href="#proof" className="hover:text-slate-100">
              Proof
            </a>
            <a href="#projects" className="hover:text-slate-100">
              Projects
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

        {/* Hero */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/90 p-8 text-center shadow-2xl shadow-black/60 md:p-10">
            <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
              CORRECTNESS • RELIABILITY • DETERMINISM
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              I build systems that stay correct under failure — across execution, infrastructure and AI.
            </h1>

            <p className="mt-6 mx-auto max-w-3xl text-lg text-slate-200 leading-relaxed">
  I design for <span className="text-sky-300">crashes</span>,{" "}
  <span className="text-sky-300">race-driven edge cases</span> and{" "}
  <span className="text-sky-300">silent regressions</span> — then make failures{" "}
  <span className="text-indigo-300">visible</span>,{" "}
  <span className="text-indigo-300">reproducible</span> and{" "}
  <span className="text-indigo-300">fixable</span>.
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

              <a
                href="#demos"
                className="rounded-full border border-slate-600 bg-slate-950/40 px-6 py-3 text-sm text-slate-200 hover:border-sky-500/70 hover:text-slate-50"
              >
                Try Live Demos
              </a>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              If this work matches what you’re building, I’m one email away.
            </div>

            {/* Proof Chips */}
            <div id="proof" className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-300">
              {[
                "Deterministic replay & invariants",
                "Distributed state machines",
                "Failure injection & regression gates",
                "Prometheus / Grafana / CI/CD",
                "C++ · Go · FastAPI · Kubernetes · Postgres",
              ].map((x) => (
                <span key={x} className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1">
                  {x}
                </span>
              ))}
            </div>

            {/* Capability anchors */}
            <div className="mt-6 mx-auto max-w-4xl grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <span className="text-sky-300 font-medium">Distributed execution</span>
                <p className="mt-1 text-slate-300 leading-relaxed">
                  Crash-safe job processing, idempotency, retries and reconciliation.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <span className="text-sky-300 font-medium">Deterministic behavior</span>
                <p className="mt-1 text-slate-300 leading-relaxed">
                  Execution tracing, invariant checks and fail-fast divergence detection.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <span className="text-sky-300 font-medium">AI systems reliability</span>
                <p className="mt-1 text-slate-300 leading-relaxed">
                  GenAI evaluation, safety tooling and regression gates that ship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live demos */}
        <section id="demos" className="mb-12 space-y-4">
          <SectionHeader
            title="Live Systems You Can Try"
            subtitle="Proof beats claims — these are deployed demos you can interact with."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {demoCards.map((d) => (
              <DemoCard key={d.title} kicker={d.kicker} title={d.title} desc={d.desc} links={d.links} />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-12 space-y-4">
          <SectionHeader
            title="Projects"
            subtitle="Capability-driven: correctness, reliability, determinism and measurable behavior."
          />

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={classNames(
                  "rounded-full border px-3 py-1 text-xs transition",
                  activeFilter === chip
                    ? "border-sky-500/70 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-sky-500/40 hover:text-slate-200"
                )}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Featured pair */}
          {activeFilter === "Featured" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FeaturedCard project={faultline} tone="indigo" />
              <FeaturedCard project={faireval} tone="sky" />
            </div>
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}

          {/* Reliability & Infrastructure */}
          <div className="pt-10">
            <SectionHeader
              title="Reliability & Infrastructure Engineering"
              subtitle="Make failures observable and actionable before they reach production."
            />
            <div className="mt-4">
              <SmartGrid count={reliabilityInfra.length}>
                {reliabilityInfra.map((p) => (
                  <CaseStudyCard key={p.id} project={p} />
                ))}
              </SmartGrid>
            </div>
          </div>

          {/* Execution, Determinism & Verification */}
          <div className="pt-10">
            <SectionHeader
              title="Execution, Determinism & Verification"
              subtitle="Make nondeterministic systems reproducible, verifiable and debuggable by design."
            />

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-base text-slate-200">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">One narrative</div>
              <p className="leading-relaxed">
  If your team deals with <span className="text-sky-300">flaky tests</span>,{" "}
  <span className="text-sky-300">execution divergence</span>, or{" "}
  <span className="text-sky-300">hard-to-reproduce regressions</span>, feel free to reach out.
</p>

            </div>

            <div className="mt-4">
              <SmartGrid count={executionDeterminism.length}>
                {executionDeterminism.map((p) => (
                  <CaseStudyCard key={p.id} project={p} />
                ))}
              </SmartGrid>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-base text-slate-200">
              <p className="leading-relaxed">
                If your team deals with <span className="text-sky-300">nondeterminism</span>,{" "}
                <span className="text-sky-300">flaky tests</span>, or{" "}
                <span className="text-sky-300">hard-to-reproduce regressions</span>, feel free to reach out.
              </p>
              <div className="mt-3">
                <a
                  href={`mailto:${CONTACT.email}?subject=Portfolio%20-%20Determinism%20%26%20Debuggability`}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs text-sky-200 hover:border-sky-500/70"
                >
                  ✉️ Email {CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* GenAI evaluation & safety */}
          <div className="pt-10">
            <SectionHeader
              title="GenAI Evaluation & Safety Tooling"
              subtitle="Reliability-first model behavior: safety, regressions, intent."
            />
            <div className="mt-4">
              <SmartGrid count={genaiSafety.length}>
                {genaiSafety.map((p) => (
                  <CaseStudyCard key={p.id} project={p} />
                ))}
              </SmartGrid>
            </div>
          </div>

          {/* Developer tools */}
          <div className="pt-10">
            <SectionHeader title="Developer Tools" subtitle="Workflow-first tools that reduce debugging time and friction." />
            <div className="mt-4">
              <SmartGrid count={developerTools.length}>
                {developerTools.map((p) => (
                  <CaseStudyCard key={p.id} project={p} />
                ))}
              </SmartGrid>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="mb-12 space-y-4">
          <SectionHeader
            title="Experience"
            subtitle="Hands-on engineering across backend systems, reliability and operations."
          />
          <div className="space-y-4">
            {experience.map((exp) => (
              <article
                key={exp.id}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-7 md:p-8 shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">{exp.role}</h3>
                    <p className="text-sm text-sky-400">{exp.company}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{exp.period}</span>
                    <span className="mt-1 text-xs text-slate-400">{exp.location}</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-base text-slate-100 leading-relaxed">
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

        {/* Education */}
        <section id="education" className="mb-12 space-y-4">
          <SectionHeader title="Education" subtitle="CS foundation across systems, networks, security and ML." />
          <div className="space-y-4">
            {education.map((edu) => (
              <article
                key={edu.id}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-7 md:p-8 shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">{edu.degree}</h3>
                    <p className="text-sm text-sky-400">{edu.school}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{edu.period}</span>
                    <span className="mt-1 text-xs text-slate-400">{edu.location}</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-base text-slate-100 leading-relaxed">
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

        {/* Skills (subtitle removed) */}
        <section id="skills" className="mb-12 space-y-4">
  <SectionHeader title="Technical Skills" />

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {Object.entries(skills).map(([category, items]) => (
      <div
        key={category}
        className="flex h-full min-h-[180px] flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-black/30 hover:border-sky-500/40"
      >
        <h3 className="text-base font-semibold text-sky-400">{category}</h3>

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


        {/* Writing */}
        <section id="writing" className="mb-12 space-y-4">
          <SectionHeader
            title="Postmortems & Engineering Notes"
            subtitle="Write-ups from real builds: failures, missing signals, trade-offs and how to fix them."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-base shadow-lg shadow-black/40 hover:border-sky-500/60"
              >
                <h3 className="text-[1.05rem] font-semibold text-slate-50">{a.title}</h3>
                <p className="text-[1rem] text-slate-200 leading-relaxed">{a.subtitle}</p>

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

        {/* Contact */}
        <section id="contact" className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Let’s Talk</h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-7 md:p-8 text-slate-100 shadow-xl shadow-black/40">
            <p className="text-[1.05rem] leading-relaxed text-slate-200">
              If your team cares about <span className="text-sky-300">correctness under failure</span>,{" "}
              <span className="text-sky-300">debuggability</span>,{" "}
              <span className="text-sky-300">observability</span> or{" "}
              <span className="text-sky-300">GenAI reliability</span>, I’d love to hear from you.
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

            <div className="mt-4 text-xs text-slate-400">Feel free to reach out — email works best.</div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>Built with Next.js + TypeScript. Proof-first portfolio; key systems are open source.</div>
            <div>
              © {new Date().getFullYear()} {CONTACT.name}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const hasSubtitle = Boolean(subtitle && subtitle.trim().length > 0);

  return (
    <div
      className={classNames(
        "flex flex-col gap-1",
        hasSubtitle ? "md:flex-row md:items-baseline md:justify-between" : ""
      )}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{title}</h2>
      {hasSubtitle ? (
        <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[0.95rem]">{subtitle}</p>
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
      <div className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">{kicker}</div>
      <h3 className="text-[1.05rem] font-semibold text-slate-50">{title}</h3>
      <p className="text-[1rem] text-slate-200 leading-relaxed">{desc}</p>

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

function FeaturedCard({ project, tone }: { project: Project; tone: "sky" | "indigo" }) {
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
        toneBg
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.7rem] uppercase tracking-[0.28em] text-slate-300">Featured</div>
        <span className={classNames("rounded-full border px-3 py-1 text-[0.7rem]", toneTag)}>{project.label}</span>
      </div>

      <h3 className="mt-2 text-2xl font-semibold text-slate-50">{project.name}</h3>
      <p className="mt-2 text-lg text-slate-100 leading-relaxed">{project.oneLiner}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 text-base text-slate-200">
        {project.problem && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Problem</div>
            <p className="mt-1 leading-relaxed">{project.problem}</p>
          </div>
        )}
        {project.built && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">What I built</div>
            <p className="mt-1 leading-relaxed">{project.built}</p>
          </div>
        )}
        {project.proof && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Proof</div>
            <p className="mt-1 leading-relaxed">{project.proof}</p>
          </div>
        )}
      </div>

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

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.slice(0, 10).map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}

function CaseStudyCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-7 md:p-8 text-base shadow-lg shadow-black/40 transition hover:border-sky-500/60 hover:shadow-xl hover:shadow-black/60">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.78rem] uppercase tracking-[0.24em] text-slate-400">{project.label}</div>
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
      <p className="text-lg text-slate-100 leading-relaxed">{project.oneLiner}</p>

      {(project.problem || project.built || project.proof) && (
        <div className="mt-1 grid grid-cols-1 gap-2">
          {project.problem && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Problem</div>
              <div className="mt-1 text-base text-slate-200 leading-relaxed">{project.problem}</div>
            </div>
          )}
          {project.built && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Built</div>
              <div className="mt-1 text-base text-slate-200 leading-relaxed">{project.built}</div>
            </div>
          )}
          {project.proof && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Proof</div>
              <div className="mt-1 text-base text-slate-200 leading-relaxed">{project.proof}</div>
            </div>
          )}
        </div>
      )}

      <ul className="mt-1 space-y-2 text-base text-slate-300 leading-relaxed">
        {project.impact.slice(0, 4).map((line) => (
          <li key={line} className="pl-3">
            <span className="mr-1 text-slate-500">•</span>
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-2 flex flex-wrap gap-2">
        {project.stack.slice(0, 10).map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
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

/**
 * SmartGrid
 * - 1 card => centered, max-width (no empty space)
 * - 2+ cards => 2-column grid on md+
 */
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
  return <div className={classNames("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>{children}</div>;
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <SmartGrid count={projects.length}>
      {projects.map((p) => (
        <CaseStudyCard key={p.id} project={p} />
      ))}
    </SmartGrid>
  );
}
