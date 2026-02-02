// src/app/page.tsx
export const dynamic = "force-dynamic";
import Link from "next/link";
import "./globals.css";
import React from "react";

type Project = {
  label: string;
  name: string;
  oneLiner: string;
  impact: string[];
  stack: string[];
  links: { href: string; label: string }[];
};

type Article = {
  title: string;
  subtitle: string;
  href: string;
  tags: string[];
};

type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  achievements: string[];
};

type Education = {
  school: string;
  degree: string;
  period: string;
  location: string;
  details: string[];
};

// ----- EXPERIENCE DATA -----
const experience: Experience[] = [
  {
    company: "Thales Group",
    role: "DevSecOps Intern",
    period: "June 2025 – August 2025",
    location: "Plantation, FL, USA",
    achievements: [
      "Developed Flask REST APIs to compute efficiency and utilization metrics from PostgreSQL lifecycle logs",
      "Engineered backend logic to parse, classify, and aggregate device state transitions for analytics and reporting",
      "Delivered Chart.js dashboards used by engineering teams to spot regressions and speed up troubleshooting",
    ],
  },
  {
    company: "University of Florida",
    role: "Graduate Assistant",
    period: "December 2024 – Present",
    location: "Gainesville, FL, USA",
    achievements: [
      "Coordinated high-churn volunteer scheduling and last-minute changes to keep weekly operations running smoothly",
      "Improved handoffs and tracking to reduce missed shifts and reporting gaps across recurring operations",
    ],
  },
  {
    company: "Elixir Web Solutions",
    role: "Software Development Intern",
    period: "May 2024 – August 2024",
    location: "New Delhi, India",
    achievements: [
      "Built SEO analytics dashboards using Node.js, Express, and REST APIs for campaign reporting",
      "Improved frontend load performance by optimizing EJS/jQuery components and reducing render work",
    ],
  },
  {
    company: "C1 India Pvt Ltd",
    role: "Software Engineering Intern",
    period: "June 2023 – August 2023",
    location: "Gurugram, India",
    achievements: [
      "Designed Java backend modules supporting procurement workflows for large enterprise customers",
      "Simulated fault-tolerance and log-recovery scenarios to improve reliability and operational readiness",
    ],
  },
];

// ----- EDUCATION DATA -----
const education: Education[] = [
  {
    school: "University of Florida",
    degree: "Master of Science in Computer & Information Science & Engineering",
    period: "August 2024 – December 2025 (Expected)",
    location: "Gainesville, FL",
    details: [
      "Graduate GPA: 3.8 / 4.00",
      "Coursework: Advanced Data Structures, Analysis of Algorithms, Computer Networks, Distributed Operating Systems Principles, Computer & Network Security, NLP Applications, Programming Language Principles, UX Design.",
    ],
  },
  {
    school: "Jaypee Institute of Information Technology",
    degree: "Bachelor of Technology in Computer Science & Engineering (Honours)",
    period: "September 2020 – May 2024",
    location: "Noida, India",
    details: [
      "CGPA: 8.1 / 10.0",
      "Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, Computer Organization & Architecture, Software Engineering.",
    ],
  },
];

// ----- MAIN PROJECT DATA -----
const fairevalLinks = [
  { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
  { href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite", label: "Live demo" },
  { href: "https://doi.org/10.5281/zenodo.17625268", label: "Zenodo DOI" },
];

const flagship: Project[] = [
  {
    label: "Production ML System",
    name: "FairEval Suite",
    oneLiner: "Evaluation framework for generative models with safety and reliability checks.",
    impact: [
      "Runs evals across GPT-4o / Claude / DeepSeek-R1 in one pipeline",
      "Tracks regressions: hallucinations, clarity, and helpfulness across model versions",
      "CI gate: blocks unsafe or low-quality model changes before release",
      "Prometheus metrics + automated tests for repeatable scoring and visibility",
    ],
    stack: ["Python", "FastAPI", "MongoDB", "Chart.js", "pytest", "Prometheus", "Docker"],
    links: fairevalLinks,
  },
  {
    label: "Safety & Security",
    name: "JailBreakDefense",
    oneLiner: "Safety middleware that detects and repairs jailbreak-style prompts without breaking UX.",
    impact: [
      "Detects adversarial prompts and routes them through an intent-repair pipeline",
      "Preserves user intent by rewriting unsafe requests instead of blunt refusals",
      "Drops in front of existing LLM APIs as a lightweight safety layer",
      "Includes benchmark + logs to inspect safety performance over time",
    ],
    stack: ["Python", "Transformers", "Repair Engine", "Safety RAG", "Redis"],
    links: [
      { href: "https://github.com/kritibehl/JailBreakDefense", label: "GitHub" },
      { href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense", label: "Live demo" },
      { href: "https://doi.org/10.5281/zenodo.17694184", label: "Zenodo DOI" },
    ],
  },
  {
    label: "Benchmark & Dataset",
    name: "SpeechIntentEval",
    oneLiner: "Regression test suite for indirect and high-context speech understanding in assistants.",
    impact: [
      "300+ curated examples for indirect, polite, sarcastic, and ambiguous intents",
      "Designed to catch failures that toxicity filters and simple classifiers miss",
      "CLI + scripts to run regression tests against new model versions",
      "Supports apples-to-apples comparisons across models on subtle intent tasks",
    ],
    stack: ["Python", "Dataset Design", "Evaluation Scripts", "GitHub Actions"],
    links: [
      { href: "https://huggingface.co/spaces/kriti0608/SpeechIntentEval", label: "Live demo" },
      { href: "https://github.com/kritibehl/SpeechIntentEval", label: "GitHub" },
    ],
  },
];

const infra: Project[] = [
  {
    label: "DevOps & Observability",
    name: "AutoOps-Insight",
    oneLiner: "CI/CD analytics platform aggregating metrics across pipelines for faster feedback loops.",
    impact: [
      "Pulls logs and metadata from Jenkins and GitHub Actions across repos",
      "Surfaces flaky tests, recurring failures, and slow stages for teams",
      "Grafana dashboards backed by Prometheus metrics and alert rules",
      "Built to reduce pipeline noise and shorten time-to-fix for build failures",
    ],
    stack: ["Python", "FastAPI", "MongoDB", "Prometheus", "Grafana", "Jenkins API"],
    links: [{ href: "https://github.com/kritibehl/AutoOps-Insight", label: "GitHub" }],
  },
  {
    label: "Chaos Engineering",
    name: "KubePulse",
    oneLiner: "Kubernetes chaos testing and reliability framework for staging and pre-prod.",
    impact: [
      "Injects pod failures, CPU pressure, and network disruptions via controlled experiments",
      "Validates service behavior under partial outages and noisy-neighbor conditions",
      "Integrates experiments into reliability test runs and release readiness checks",
      "Surfaces hidden failure modes before they hit production",
    ],
    stack: ["Python", "FastAPI", "Docker", "Kubernetes", "Prometheus", "Grafana"],
    links: [{ href: "https://github.com/kritibehl/KubePulse", label: "GitHub" }],
  },
];

const tools: Project[] = [
  {
    label: "Developer Productivity",
    name: "Chrome Copilot",
    oneLiner: "Browser extension for debugging logs and stack traces faster (privacy-first).",
    impact: [
      "Parses console logs and exception traces directly in the browser",
      "Suggests likely causes and fix paths using LLM APIs with caching + rate limiting",
      "Designed to avoid server-side storage of user data",
      "Built for practical debugging workflows (not generic chat)",
    ],
    stack: ["JavaScript", "Chrome APIs", "LLM APIs", "Webpack"],
    links: [{ href: "https://github.com/kritibehl/Chrome-Copilot", label: "GitHub" }],
  },
  {
    label: "ML Application",
    name: "ResuMate",
    oneLiner: "Resume-to-job match analyzer that highlights gaps and strengthens targeting.",
    impact: [
      "Compares resumes with job descriptions to extract matches and missing requirements",
      "Maps requirements to experience bullets for faster tailoring",
      "Exposes a FastAPI service as a clean JSON API",
      "Built to plug into job search workflows and dashboards",
    ],
    stack: ["Python", "FastAPI", "LLM APIs", "Docker", "Redis"],
    links: [{ href: "https://github.com/kritibehl/ResuMate", label: "GitHub" }],
  },
];

const articles: Article[] = [
  {
    title: "Building production AI safety systems without a research lab",
    subtitle: "How I architected, deployed and scaled evaluation frameworks as a solo builder.",
    href: "https://medium.com/@kriti0608/i-didnt-have-a-big-research-lab-so-i-built-my-own-ai-safety-tools-from-scratch-525deac360e6",
    tags: ["System Design", "AI Safety", "Scalability"],
  },
  {
    title: "FairEval: From research prototype to evaluation system",
    subtitle: "Deep-dive into designing human-aligned evaluation metrics and pipelines.",
    href: "https://medium.com/@kriti0608/faireval-a-human-aligned-evaluation-framework-for-generative-models-d822bfd5c99d",
    tags: ["ML Systems", "Production", "Metrics"],
  },
  {
    title: "Real-time jailbreak defense: Intent repair at <100ms latency",
    subtitle: "Designing a safety middleware that processes adversarial prompts without sacrificing UX.",
    href: "https://medium.com/@kriti0608/why-ai-refusals-feel-like-punishment-and-how-i-learned-to-repair-intent-instead-c7a890a7b0e8",
    tags: ["Security", "Performance", "API Design"],
  },
];

// ----- SKILLS SECTION -----
const skills: Record<string, string[]> = {
  Languages: ["Python", "JavaScript/TypeScript", "Java", "Go", "SQL"],
  "Backend & APIs": ["FastAPI", "Node.js", "Django", "GraphQL", "REST", "gRPC"],
  "ML & AI": ["PyTorch", "TensorFlow", "Transformers", "Scikit-learn", "LLM APIs"],
  Databases: ["MongoDB", "PostgreSQL", "Redis", "DynamoDB"],
  "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
  Monitoring: ["Prometheus", "Grafana", "DataDog", "ELK Stack"],
};

export default function Home() {
  const flagshipMain = flagship[0];
  const flagshipRest = flagship.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 lg:px-6">
        {/* Header */}
        <header className="mb-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-5xl font-extrabold tracking-tight text-white leading-none">
              KRITI BEHL
            </div>
            <div className="mt-2 text-lg font-medium text-slate-300">
              CS Graduate Student · Backend, AI/ML Systems & Infrastructure Reliability
            </div>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-slate-400">
            <a href="#projects" className="hover:text-slate-100">
              Projects
            </a>
            <a href="#experience" className="hover:text-slate-100">
              Experience
            </a>
            <a href="#skills" className="hover:text-slate-100">
              Skills
            </a>
            <a href="#writing" className="hover:text-slate-100">
              Writing
            </a>
            <a href="#contact" className="hover:text-slate-100">
              Contact
            </a>

            <Link
              href="https://www.linkedin.com/in/kriti-behl/"
              target="_blank"
              className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
            >
              LinkedIn
            </Link>

            <Link
              href="/Kriti_Behl_Resume.pdf"
              target="_blank"
              className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
            >
              Resume
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="mb-10">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/90 p-8 text-center shadow-xl shadow-black/60 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              BACKEND • RELIABILITY • AI SYSTEMS
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              I build reliable backend systems—and evaluation + safety tooling that ships.
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-200 leading-relaxed">
              I focus on <span className="text-sky-300">measurable reliability</span>: instrumentation,
              failure modes, and fast recovery. From{" "}
              <span className="text-indigo-300">distributed systems + observability</span> to{" "}
              <span className="text-sky-300">LLM evaluation + safety pipelines</span>, I turn ambiguous
              problems into production-ready systems.
            </p>

            {/* Proof Bar */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-300">
              {[
                "MS CS @ UF · Dec 2025",
                "Backend + Reliability",
                "Open-source + Live Demos",
                "Prometheus/Grafana · CI/CD",
                "FastAPI · Postgres · Kubernetes",
              ].map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1"
                >
                  {x}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="#projects"
                className="rounded-full bg-sky-600/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-800/50 hover:bg-sky-500"
              >
                View Projects
              </a>

              <Link
                href="https://github.com/kritibehl"
                target="_blank"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
              >
                GitHub
              </Link>

              <a
                href="/Kriti_Behl_Resume.pdf"
                target="_blank"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
              >
                Download Resume
              </a>

              <a
                href="#contact"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
              >
                Contact
              </a>
            </div>
          </div>
        </section>

        {/* Track Switcher */}
        <div className="mb-10 flex justify-center gap-4">
          <a
            href="#ai-track"
            className="rounded-full border border-sky-600 px-4 py-1.5 text-xs text-sky-300 hover:bg-sky-600/20"
          >
            AI / Research Track
          </a>
          <a
            href="#systems-track"
            className="rounded-full border border-indigo-600 px-4 py-1.5 text-xs text-indigo-300 hover:bg-indigo-600/20"
          >
            Systems / Infra Track
          </a>
        </div>

        {/* Live demos strip (moved earlier for proof) */}
        <section id="demos" className="mb-12 space-y-4">
          <SectionHeader
            title="Live Demos"
            subtitle="These systems are deployed as interactive demos you can try."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <DemoCard
              kicker="Production ML System"
              title="FairEval Suite"
              desc="Evaluation framework with metrics, charts, and examples to probe model behavior."
              links={[
                { href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite", label: "Live demo" },
                { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
              ]}
            />

            <DemoCard
              kicker="Safety Middleware"
              title="JailBreakDefense"
              desc="Safety layer that detects jailbreak prompts and repairs them while keeping user intent."
              links={[
                { href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense", label: "Live demo" },
                { href: "https://github.com/kritibehl/JailBreakDefense", label: "GitHub" },
              ]}
            />

            <DemoCard
              kicker="Regression Suite"
              title="SpeechIntentEval"
              desc="Test suite for indirect and high-context speech intents (polite, sarcastic, ambiguous)."
              links={[
                { href: "https://huggingface.co/spaces/kriti0608/SpeechIntentEval", label: "Live demo" },
                { href: "https://github.com/kritibehl/SpeechIntentEval", label: "GitHub" },
              ]}
            />
          </div>
        </section>

        {/* AI Track Header */}
        <section id="ai-track" className="mb-4">
          <SectionHeader
            title="AI / ML Systems & Research"
            subtitle="Evaluation, safety, multimodal reasoning, and robust ML tooling."
          />
        </section>

        {/* Projects */}
        <section id="projects" className="mb-12 space-y-4">
          <SectionHeader
            title="Production ML & AI Systems"
            subtitle="Evaluation, safety, and benchmarking projects you can inspect end-to-end."
          />

          {/* FairEval as main flagship card */}
          <article className="flex flex-col gap-2 rounded-3xl border border-sky-700/80 bg-gradient-to-br from-sky-950 via-slate-950 to-slate-950/95 p-6 text-sm shadow-xl shadow-black/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[0.7rem] uppercase tracking-[0.28em] text-sky-300">
                Flagship · {flagshipMain.label}
              </div>
              <div className="text-[0.7rem] text-sky-300">Open-source · Live demo linked below</div>
            </div>

            <h3 className="mt-1 text-xl font-semibold text-slate-50">{flagshipMain.name}</h3>
            <p className="text-[0.95rem] text-slate-100">{flagshipMain.oneLiner}</p>

            <ul className="mt-2 space-y-1 text-[0.9rem] text-slate-200">
              {flagshipMain.impact.map((line) => (
                <li key={line} className="pl-3">
                  <span className="mr-1 text-sky-300">•</span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1">
              {flagshipMain.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-sky-700/70 bg-slate-950/80 px-2 py-1 text-[0.75rem] text-sky-100"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {flagshipMain.links.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target="_blank"
                  className="rounded-full border border-sky-500/80 bg-sky-500/10 px-3 py-1 text-xs text-sky-100 hover:border-sky-300 hover:text-slate-50"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </article>

          {/* Remaining flagship projects */}
          <ProjectGrid projects={flagshipRest} twoColumn />
        </section>

        {/* Systems Track Header */}
        <section id="systems-track" className="mb-4">
          <SectionHeader
            title="Systems, Infrastructure & Reliability Engineering"
            subtitle="Observability, Kubernetes reliability, CI/CD health, and developer tooling."
          />
        </section>

        <section className="mb-12 space-y-4">
          <SectionHeader
            title="Infrastructure & DevOps"
            subtitle="Observability, resilience, and CI/CD health projects."
          />
          <ProjectGrid projects={infra} twoColumn />
        </section>

        <section className="mb-12 space-y-4">
          <SectionHeader title="Developer Tools" subtitle="Tools that make debugging and workflows less painful." />
          <ProjectGrid projects={tools} twoColumn />
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-12 space-y-4">
          <SectionHeader
            title="Experience"
            subtitle="Hands-on experience across backend engineering, DevOps, and operational reliability."
          />

          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-6 shadow-lg shadow-black/40 hover:border-sky-500/80"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">{exp.role}</h3>
                    <p className="text-sm text-sky-400">{exp.company}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {exp.period}
                    </span>
                    <span className="mt-1 text-xs text-slate-400">{exp.location}</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-[0.92rem] text-slate-100">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-[0.2rem] text-sky-400">▹</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="mb-12 space-y-4">
          <SectionHeader
            title="Education"
            subtitle="Strong grounding in CS with emphasis on systems, ML, and software engineering."
          />

          <div className="space-y-4">
            {education.map((edu, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-6 shadow-lg shadow-black/40 hover:border-sky-500/80"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">{edu.degree}</h3>
                    <p className="text-sm text-sky-400">{edu.school}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {edu.period}
                    </span>
                    <span className="mt-1 text-xs text-slate-400">{edu.location}</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-[0.92rem] text-slate-100">
                  {edu.details.map((detail, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-[0.2rem] text-sky-400">▹</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section id="skills" className="mb-12 space-y-4">
          <SectionHeader
            title="Technical Skills"
            subtitle="From backend APIs and infra to ML evaluation, safety tooling, and observability."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([category, items]) => (
              <div
                key={category}
                className="rounded-2xl border border-slate-800 bg-slate-950/95 p-5 hover:border-sky-500/50"
              >
                <h3 className="mb-3 text-sm font-semibold text-sky-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300"
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
            title="Technical Writing"
            subtitle="Architecture notes, lessons learned, and write-ups from my builds."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.title}
                className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60"
              >
                <h3 className="text-[0.98rem] font-semibold text-slate-50">{a.title}</h3>
                <p className="text-[0.9rem] text-slate-100">{a.subtitle}</p>

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
                  <a
                    href={a.href}
                    target="_blank"
                    className="text-xs text-sky-400 underline underline-offset-2 hover:text-sky-300"
                  >
                    Read article
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mb-12 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">About</h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-6 text-[0.95rem] leading-relaxed text-slate-100 md:text-base">
            <p>
              I’m a CS graduate student at the University of Florida building at the intersection of{" "}
              <span className="text-sky-300">LLM evaluation + safety</span> and{" "}
              <span className="text-indigo-300">distributed systems + reliability engineering</span>.
            </p>
            <p className="mt-3">
              I like making complex systems measurable—whether that’s a model under adversarial pressure or a
              service under partial outages. Most of my work ships as open-source projects and live demos you
              can inspect end-to-end.
            </p>
            <p className="mt-3">
              I’m currently applying to AI/ML residency programs and systems roles where I can own real
              systems, collaborate with strong teams, and ship tools that improve reliability.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Contact</h2>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/95 p-5 text-sm text-slate-100 md:text-[0.95rem]">
            <div className="space-y-1">
              <div>
                Email:{" "}
                <a
                  href="mailto:kriti0608@gmail.com"
                  className="underline decoration-slate-500 underline-offset-2 hover:decoration-sky-400"
                >
                  kriti0608@gmail.com
                </a>
              </div>

              <div>
                GitHub:{" "}
                <a
                  href="https://github.com/kritibehl"
                  target="_blank"
                  className="underline decoration-slate-500 underline-offset-2 hover:decoration-sky-400"
                >
                  github.com/kritibehl
                </a>
              </div>

              <div>
                Hugging Face:{" "}
                <a
                  href="https://huggingface.co/kriti0608"
                  target="_blank"
                  className="underline decoration-slate-500 underline-offset-2 hover:decoration-sky-400"
                >
                  huggingface.co/kriti0608
                </a>
              </div>

              <div>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/kriti-behl/"
                  target="_blank"
                  className="underline decoration-slate-500 underline-offset-2 hover:decoration-sky-400"
                >
                  linkedin.com/in/kriti-behl
                </a>
              </div>

              <div className="pt-1 text-xs text-slate-400">
                Open to backend, platform, reliability, and AI/ML residency opportunities.
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>Built with Next.js and TypeScript. All key projects are open source.</div>
            <div>© {new Date().getFullYear()} Kriti Behl</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ----- REUSABLE COMPONENTS -----
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{title}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[0.9rem]">{subtitle}</p>
    </div>
  );
}

function ProjectGrid({ projects, twoColumn }: { projects: Project[]; twoColumn?: boolean }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${twoColumn ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      {projects.map((p) => (
        <article
          key={p.name}
          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-5 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60"
        >
          <div className="text-[0.8rem] uppercase tracking-[0.24em] text-slate-400">{p.label}</div>
          <h3 className="text-lg font-semibold text-slate-50">{p.name}</h3>
          <p className="text-[0.98rem] text-slate-100">{p.oneLiner}</p>

          <ul className="mt-2 space-y-1.5 text-[0.9rem] text-slate-300">
            {p.impact.map((line) => (
              <li key={line} className="pl-3">
                <span className="mr-1 text-slate-500">•</span>
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-[0.78rem] text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {p.links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                target="_blank"
                className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-sky-400 hover:text-slate-50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
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
  links: { href: string; label: string }[];
}) {
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60">
      <div className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">{kicker}</div>
      <h3 className="text-[1rem] font-semibold text-slate-50">{title}</h3>
      <p className="text-[0.9rem] text-slate-100">{desc}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <DemoButton key={l.href + l.label} href={l.href}>
            {l.label}
          </DemoButton>
        ))}
      </div>
    </article>
  );
}

function DemoButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-sky-400 hover:text-slate-50"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
