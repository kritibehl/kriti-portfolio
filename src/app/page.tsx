// src/app/page.tsx
import Link from "next/link";
import "./globals.css";


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
      "Developed Flask-based REST APIs to compute efficiency and utilization metrics from PostgreSQL lifecycle logs",
      "Engineered backend logic to parse, classify and aggregate device lifecycle states for analytics and reporting",
      "Delivered Chart.js dashboards used by engineering teams for real-time performance monitoring"
    ]
  },
  {
    company: "University of Florida",
    role: "Graduate Assistant",
    period: "December 2024 – Present",
    location: "Gainesville, FL, USA",
    achievements: [
      "Managed weekly scheduling for 100+ volunteers, increasing operational clarity and reporting accuracy",
      "Automated impact-tracking workflows, reducing manual reporting time significantly"
    ]
  },
  {
    company: "Elixir Web Solutions",
    role: "Software Development Intern",
    period: "May 2024 – August 2024",
    location: "New Delhi, India",
    achievements: [
      "Built SEO analytics dashboards using Node.js, Express and REST APIs",
      "Improved frontend load performance by optimizing EJS/jQuery UI components for faster rendering"
    ]
  },
  {
    company: "C1 India Pvt Ltd",
    role: "Software Engineering Intern",
    period: "June 2023 – August 2023",
    location: "Gurugram, India",
    achievements: [
      "Designed Java backend modules supporting procurement systems used by 10K+ enterprise customers",
      "Simulated and benchmarked log-recovery and fault-tolerance scenarios to improve production reliability"
    ]
  }
];


// ----- EDUCATION DATA -----
const education: Education[] = [
  {
    school: "University of Florida",
    degree: "Master of Science in Computer & Information Science & Engineering",
    period: "August 2024 – December 2025 (Expected)",
    location: "Gainesville, FL",
    details: [
      "Graduate GPA: 3.77 / 4.00",
      "Relevant coursework: Advanced Data Structures, Computer Networks, Distributed Operating Systems Principles, Computer & Network Security, NLP Applications, AI and Consciousness, Programming Language Principles, UX Design, Analysis of Algorithms (in progress).",
    ],
  },
  {
    school: "Jaypee Institute of Information Technology",
    degree: "Bachelor of Technology in Computer Science & Engineering (Honours)",
    period: "September 2020 – May 2024",
    location: "Noida, India",
    details: [
      "CGPA: 8.1 / 10.0",
      "Relevant coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, Computer Organization & Architecture, Software Engineering.",
    ],
  },
];

// ----- MAIN PROJECT DATA -----

const fairevalLinks = [
  { href: "https://github.com/kritibehl/FairEval-Suite", label: "GitHub" },
  {
    href: "https://huggingface.co/spaces/kriti0608/FairEval-Suite",
    label: "Live demo",
  },
  {
    href: "https://doi.org/10.5281/zenodo.17625268",
    label: "Zenodo DOI",
  },
];

const flagship: Project[] = [
  {
    label: "Production ML System",
    name: "FairEval-Suite",
    oneLiner: "Evaluation framework for generative models with safety and reliability checks.",
    impact: [
      "Centralizes evaluation runs for models like GPT-4o, Claude, and DeepSeek-R1",
      "Tracks hallucinations, clarity and helpfulness across different model versions",
      "Plugs into CI/CD so model changes are checked before they ship",
      "Instrumented with Prometheus metrics and automated tests"
    ],
    stack: ["Python", "FastAPI", "MongoDB", "Chart.js", "pytest", "Prometheus", "Docker"],
    links: fairevalLinks,
  },
  {
    label: "Safety & Security",
    name: "JailBreakDefense",
    oneLiner: "Safety middleware that detects and repairs jailbreak-style prompts.",
    impact: [
      "Detects adversarial prompts and routes them through an intent-repair pipeline",
      "Preserves user intent instead of blunt refusals by rewriting unsafe queries",
      "Designed to sit in front of existing LLM APIs as a lightweight safety layer",
      "Includes benchmark + logs to inspect safety performance over time"
    ],
    stack: ["Python", "Transformers", "Custom RepairEngine", "Safety RAG", "Redis"],
    links: [
      {
        href: "https://github.com/kritibehl/JailBreakDefense",
        label: "GitHub",
      },
      {
        href: "https://huggingface.co/spaces/kriti0608/JailBreakDefense",
        label: "Live demo",
      },
      {
        href: "https://doi.org/10.5281/zenodo.17694184",
        label: "Zenodo DOI",
      },
    ],
  },
  {
    label: "Benchmark & Dataset",
    name: "SpeechIntentEval",
    oneLiner: "Regression test suite for indirect speech understanding in assistants.",
    impact: [
      "300+ curated examples for tricky, indirect, or sarcastic user intents",
      "Designed to catch failures that toxicity filters + simple classifiers miss",
      "CLI + scripts to run regression tests against new model versions",
      "Helps compare different models on subtle intent understanding"
    ],
    stack: ["Python", "Dataset design", "Evaluation scripts", "GitHub Actions"],
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

const infra: Project[] = [
  {
    label: "DevOps & Observability",
    name: "AutoOps-Insight",
    oneLiner: "CI/CD analytics platform aggregating metrics across pipelines.",
    impact: [
      "Pulls logs and metadata from Jenkins and GitHub Actions across many repos",
      "Highlights flaky tests, recurring failures, and slow stages for teams",
      "Grafana dashboards backed by Prometheus metrics and alert rules",
      "Built to shorten feedback loops for infra and feature teams"
    ],
    stack: ["Python", "FastAPI", "MongoDB", "Prometheus", "Grafana", "Jenkins API"],
    links: [
      {
        href: "https://github.com/kritibehl/AutoOps-Insight",
        label: "GitHub",
      },
    ],
  },
  {
    label: "Chaos Engineering",
    name: "KubePulse",
    oneLiner: "Kubernetes chaos testing framework for resilience testing.",
    impact: [
      "Injects pod failures, CPU pressure, and network disruptions in staging",
      "Helps teams validate how services behave under partial outages",
      "Integrates experiments into reliability test runs",
      "Surfaces hidden failure modes before production"
    ],
    stack: ["FastAPI", "Docker", "Kubernetes", "Prometheus", "Grafana", "Python"],
    links: [
      {
        href: "https://github.com/kritibehl/KubePulse",
        label: "GitHub",
      },
    ],
  },
];

const tools: Project[] = [
  {
    label: "Developer Productivity",
    name: "Chrome Copilot",
    oneLiner: "Browser extension for debugging logs and stack traces faster.",
    impact: [
      "Parses console logs and exception traces directly in the browser",
      "Suggests likely causes and potential fixes using LLM APIs",
      "Implements caching and rate limiting to keep usage efficient",
      "Focused on privacy: no server-side storage of user data"
    ],
    stack: ["JavaScript", "Chrome APIs", "OpenAI API", "Webpack"],
    links: [
      {
        href: "https://github.com/kritibehl/Chrome-Copilot",
        label: "GitHub",
      },
    ],
  },
  {
    label: "ML Application",
    name: "ResuMate",
    oneLiner: "Resume-job match analyzer for job seekers.",
    impact: [
      "Compares resumes with job descriptions to highlight gaps and matches",
      "Extracts requirements and aligns them to experience bullets",
      "FastAPI service exposed as a simple JSON API",
      "Built to plug into job search workflows and dashboards"
    ],
    stack: ["Python", "FastAPI", "LLM APIs", "Docker", "Redis"],
    links: [
      {
        href: "https://github.com/kritibehl/ResuMate",
        label: "GitHub",
      },
    ],
  },
];

const articles: Article[] = [
  {
    title:
      "Building production AI safety systems without a research lab",
    subtitle:
      "How I architected, deployed and scaled evaluation frameworks as a solo builder.",
    href: "https://medium.com/@kriti0608/i-didnt-have-a-big-research-lab-so-i-built-my-own-ai-safety-tools-from-scratch-525deac360e6",
    tags: ["System Design", "AI Safety", "Scalability"],
  },
  {
    title:
      "FairEval: From research prototype to evaluation system",
    subtitle:
      "Deep-dive into designing human-aligned evaluation metrics and pipelines.",
    href: "https://medium.com/@kriti0608/faireval-a-human-aligned-evaluation-framework-for-generative-models-d822bfd5c99d",
    tags: ["ML Systems", "Production", "Metrics"],
  },
  {
    title:
      "Real-time jailbreak defense: Intent repair at <100ms latency",
    subtitle:
      "Designing a safety middleware that processes adversarial prompts without sacrificing UX.",
    href: "https://medium.com/@kriti0608/why-ai-refusals-feel-like-punishment-and-how-i-learned-to-repair-intent-instead-c7a890a7b0e8",
    tags: ["Security", "Performance", "API Design"],
  },
];

// ----- SKILLS SECTION -----
const skills = {
  "Languages": ["Python", "JavaScript/TypeScript", "Java", "Go", "SQL"],
  "Backend & APIs": ["FastAPI", "Node.js", "Django", "GraphQL", "REST", "gRPC"],
  "ML & AI": ["PyTorch", "TensorFlow", "Transformers", "Scikit-learn", "LLM APIs"],
  "Databases": ["MongoDB", "PostgreSQL", "Redis", "DynamoDB"],
  "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
  "Monitoring": ["Prometheus", "Grafana", "DataDog", "ELK Stack"],
};

// ----- PAGE -----

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
    CS Graduate Student · Building ML Systems & Infrastructure
  </div>
</div>

          <nav className="flex flex-wrap gap-4 text-sm text-slate-400">
            <a href="#experience" className="hover:text-slate-100">
              Experience
            </a>
            <a href="#education" className="hover:text-slate-100">
              Education
            </a>
            <a href="#projects" className="hover:text-slate-100">
              Projects
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
          </nav>
        </header>

        {/* Hero – Impact-focused but honest */}
        <section className="mb-12">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/90 p-7 text-center shadow-xl shadow-black/60 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              ML SYSTEMS · SAFETY · DEVOPS
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
              I build ML systems, safety tooling and DevOps infrastructure.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-100 md:text-lg">
              I'm a Computer Science graduate student who likes shipping real things:
              evaluation frameworks, jailbreak defenses, CI/CD analytics, and developer
              tools. Most of my work lives as open-source projects and live demos that
              you can click, inspect, and break.
            </p>

            {/* removed the Scale / Performance / Impact metric strip */}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-800/60 hover:brightness-110"
              >
                View projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
              >
                Get in touch
              </a>
              <Link
                href="https://github.com/kritibehl"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm text-slate-200 hover:border-sky-400 hover:text-slate-50"
              >
                GitHub
              </Link>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-12 space-y-4">
          <SectionHeader
            title="Experience"
            subtitle="Hands-on experience across backend engineering, DevOps, and campus operations."
          />
          
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-6 shadow-lg shadow-black/40 hover:border-sky-500/80"
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
            subtitle="Strong grounding in computer science with a focus on systems, ML, and software engineering."
          />
          
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-6 shadow-lg shadow-black/40 hover:border-sky-500/80"
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
            subtitle="From backend APIs and infra to ML evaluation and safety tooling."
          />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([category, items]) => (
              <div
                key={category}
                className="rounded-2xl border border-slate-800 bg-slate-950/95 p-5 hover:border-sky-500/50"
              >
                <h3 className="mb-3 text-sm font-semibold text-sky-400">
                  {category}
                </h3>
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

        {/* Live demos strip */}
        <section id="demos" className="mb-12 space-y-4">
          <SectionHeader
            title="Live Demos"
            subtitle="These systems are deployed as interactive demos you can try."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">
                Production ML System
              </div>
              <h3 className="text-[1rem] font-semibold text-slate-50">
                FairEval Suite
              </h3>
              <p className="text-[0.9rem] text-slate-100">
                Evaluation framework with metrics, charts, and examples to probe model behavior.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <DemoButton href="https://huggingface.co/spaces/kriti0608/FairEval-Suite">
                  Live demo
                </DemoButton>
                <DemoButton href="https://github.com/kritibehl/FairEval-Suite">
                  GitHub
                </DemoButton>
              </div>
            </article>

            <article className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">
                Safety Middleware
              </div>
              <h3 className="text-[1rem] font-semibold text-slate-50">
                JailBreakDefense
              </h3>
              <p className="text-[0.9rem] text-slate-100">
                Safety layer that detects jailbreak-style prompts and repairs them while keeping intent.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <DemoButton href="https://huggingface.co/spaces/kriti0608/JailBreakDefense">
                  Live demo
                </DemoButton>
                <DemoButton href="https://github.com/kritibehl/JailBreakDefense">
                  GitHub
                </DemoButton>
              </div>
            </article>

            <article className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">
                Test Suite
              </div>
              <h3 className="text-[1rem] font-semibold text-slate-50">
                SpeechIntentEval
              </h3>
              <p className="text-[0.9rem] text-slate-100">
                Regression test suite for indirect, polite, or sarcastic user intents.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <DemoButton href="https://huggingface.co/spaces/kriti0608/SpeechIntentEval">
                  Live demo
                </DemoButton>
                <DemoButton href="https://github.com/kritibehl/SpeechIntentEval">
                  GitHub
                </DemoButton>
              </div>
            </article>
          </div>
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
              <div className="text-[0.7rem] text-sky-300">
                Open-source · Live demo linked below
              </div>
            </div>
            <h3 className="mt-1 text-xl font-semibold text-slate-50">
              {flagshipMain.name}
            </h3>
            <p className="text-[0.95rem] text-slate-100">
              {flagshipMain.oneLiner}
            </p>
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

        <section className="mb-12 space-y-4">
          <SectionHeader
            title="Infrastructure & DevOps"
            subtitle="Observability, resilience, and CI/CD health projects."
          />
          <ProjectGrid projects={infra} twoColumn />
        </section>

        <section className="mb-12 space-y-4">
          <SectionHeader
            title="Developer Tools"
            subtitle="Tools that make debugging and job search workflows less painful."
          />
          <ProjectGrid projects={tools} twoColumn />
        </section>

        {/* Writing */}
        <section id="writing" className="mb-12 space-y-4">
          <SectionHeader
            title="Technical Writing"
            subtitle="Architecture notes, lessons learned, and write-ups of these projects."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.title}
                className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60"
              >
                <h3 className="text-[0.98rem] font-semibold text-slate-50">
                  {a.title}
                </h3>
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
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            About
          </h2>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-5 text-[0.95rem] leading-relaxed text-slate-100 md:text-base">
            <p>
              I'm a Computer Science graduate student at the University of Florida
              who likes building systems end-to-end: backend APIs, infrastructure,
              and the monitoring around them.
            </p>
            <p className="mt-3">
              I gravitate towards ML systems, safety pipelines, and developer tools—
              anything where better tooling or infra makes engineers and users happier.
              I care about clean code, tests, and observability from day zero.
            </p>
            <p className="mt-3">
              I'm looking for full-time software engineering roles where I can own
              systems, work closely with strong teams, and keep shipping.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Contact
          </h2>
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
                Resume available on request. Open to full-time opportunities.
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              Built with Next.js and TypeScript. All key projects are open source.
            </div>
            <div>© {new Date().getFullYear()} Kriti Behl</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ----- REUSABLE COMPONENTS -----

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
        {title}
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[0.9rem]">
        {subtitle}
      </p>
    </div>
  );
}

function ProjectGrid({
  projects,
  twoColumn,
}: {
  projects: Project[];
  twoColumn?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 ${
        twoColumn ? "md:grid-cols-2" : "md:grid-cols-3"
      }`}
    >
      {projects.map((p) => (
        <article
          key={p.name}
          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/95 p-5 text-sm shadow-lg shadow-black/40 hover:border-sky-500/80 hover:shadow-xl hover:shadow-black/60"
        >
          <div className="text-[0.8rem] uppercase tracking-[0.24em] text-slate-400">
            {p.label}
          </div>
          <h3 className="text-lg font-semibold text-slate-50">
            {p.name}
          </h3>
          <p className="text-[0.98rem] text-slate-100">
            {p.oneLiner}
          </p>
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

function DemoButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 hover:border-sky-400 hover:text-slate-50"
    >
      {children}
    </a>
  );
}
