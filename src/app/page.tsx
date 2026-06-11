"use client";

import type { CSSProperties } from "react";

type Artifact = "faultline" | "kubepulse" | "agentgrid" | "faireval" | "dettrace";

type Project = {
  id: string;
  title: string;
  github: string;
  accent: string;
  kicker: string;
  lead: string;
  outcomes: string[];
  artifact: Artifact;
};

const projects: Project[] = [
  {
    id: "faultline",
    title: "Faultline",
    github: "https://github.com/kritibehl/faultline",
    accent: "var(--green)",
    kicker: "A stale commit hits the boundary and dies.",
    lead: "Faultline makes stale ownership visible at the database boundary. The old write breaks; the current owner commits safely.",
    outcomes: ["0.0% duplicate commits", "1,500+ fault scenarios", "37 stale writes rejected"],
    artifact: "faultline",
  },
  {
    id: "kubepulse",
    title: "KubePulse",
    github: "https://github.com/kritibehl/kubepulse",
    accent: "var(--red)",
    kicker: "Everything is green. Users are not.",
    lead: "KubePulse separates infrastructure health from user-visible health, then blocks rollouts when latency and SLO drift expose hidden failure.",
    outcomes: ["+608% p95 regression blocked", "safe_to_operate=false", "0 false-safe decisions"],
    artifact: "kubepulse",
  },
  {
    id: "agentgrid",
    title: "AgentGrid",
    github: "https://github.com/kritibehl/agentgrid-demo",
    accent: "var(--amber)",
    kicker: "The agent looked confident. The trace disagreed.",
    lead: "AgentGrid turns RAG/tool execution into a flight recorder. Confidence decays across the run until the workflow routes to review.",
    outcomes: ["56 tests passing", "0.80 retrieval hit rate", "880ms p95 latency"],
    artifact: "agentgrid",
  },
  {
    id: "faireval",
    title: "FairEval",
    github: "https://github.com/kritibehl/FairEval-Suite",
    accent: "var(--purple)",
    kicker: "One failed vote denies the release.",
    lead: "FairEval treats model release as governance: quality can improve, but groundedness and serving gates can still stop shipment.",
    outcomes: ["p=0.0 release signal", "40% gate pass rate → BLOCK", "Zenodo artifact published"],
    artifact: "faireval",
  },
  {
    id: "dettrace",
    title: "DetTrace",
    github: "https://github.com/kritibehl/dettrace",
    accent: "var(--blue)",
    kicker: "The bug becomes visible at the exact split.",
    lead: "DetTrace replays executions until the first behavioral fracture appears, making non-reproducible bugs visible as trace divergence.",
    outcomes: ["idx 3 first divergence", "10,000+ trace validations", "1.0 incident confidence"],
    artifact: "dettrace",
  },
];

const mediumLinks = {
  jobQueue: "https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723",
  kubernetes: "https://medium.com/@kriti0608/kubernetes-said-everything-was-healthy-it-wasnt-27f7b4b9ed0e",
  aiFailures: "https://medium.com/@kriti0608/the-most-dangerous-ai-failures-dont-crash-they-quietly-look-correct-a404e343395a",
};

function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#top">Kriti Behl</a>
        <div className="nav-links">
          <a href="#incident">Incident</a>
          <a href="#projects">Projects</a>
          <a href="#oss">Open Source</a>
          <a href="#experience">Experience</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}

function CredibilityRail() {
  const creds = [
    { mark: "T", cls: "temporal", title: "Temporal", meta: "4 merged PRs" },
    { mark: "AZ", cls: "azure", title: "Azure", meta: "1 merged / 1 open" },
    { mark: "M", cls: "meta", title: "Meta", meta: "PE Fellow" },
    { mark: "UF", cls: "uf", title: "UF", meta: "MS CS" },
  ];
  return (
    <div className="cred-rail">
      {creds.map((c) => (
        <div className="cred" key={c.mark}>
          <div className={`mark ${c.cls}`}>{c.mark}</div>
          <div>
            <strong>{c.title}</strong>
            <span>{c.meta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Animated invisible failure becoming visible">
      <div className="hero-system-node n-api">API</div>
      <div className="hero-system-node n-worker">Worker</div>
      <div className="hero-system-node n-model">Model</div>
      <div className="hero-system-node n-db">Storage</div>
      <div className="hero-system-node n-gate">Gate</div>
      <div className="hero-incident">
        <span>incident</span>
      </div>
      <div className="hero-pulse hp1" />
      <div className="hero-pulse hp2" />
      <div className="hero-pulse hp3" />
      <div className="hero-pulse hp4" />
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div>
          <p className="kicker">Backend · Platform · Reliability</p>
          <h1><span>Making invisible</span><span>failures visible.</span></h1>
          <p className="hero-sub">
            I build systems that detect hidden risk, explain root cause and block unsafe releases before users feel them.
          </p>
          <CredibilityRail />
          <div className="hero-actions">
            <a className="primary-btn" href="#projects">View work</a>
            <a className="text-btn" href="https://github.com/kritibehl" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a className="text-btn" href="https://linkedin.com/in/kritibehl" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function LivingIncident() {
  const signals = [
    { cls: "sig-latency", label: "latency drift", color: "red" },
    { cls: "sig-retrieval", label: "weak retrieval", color: "amber" },
    { cls: "sig-model", label: "model drift", color: "purple" },
    { cls: "sig-stale", label: "stale write", color: "green" },
    { cls: "sig-diverge", label: "trace split", color: "blue" },
  ];
  return (
    <section id="incident" className="living">
      <div className="living-copy">
        <p className="kicker">The Living Incident</p>
        <h2>One incident. Five interventions.</h2>
        <p>
          Hidden failures emerge as signals. Each project makes one failure visible, explains it and turns it into a decision.
        </p>
      </div>
      <div className="living-stage" aria-label="Animated production incident map">
        <div className="grid-layer" />
        <div className="infra-node node-api">API</div>
        <div className="infra-node node-worker">Worker</div>
        <div className="infra-node node-model">Model</div>
        <div className="infra-node node-storage">Storage</div>
        <div className="infra-node node-release">Release</div>
        <div className="incident-orb">
          <div className="orb-ring ring-a" />
          <div className="orb-ring ring-b" />
          <strong>UNKNOWN<br />FAILURE</strong>
          <span>signals converging</span>
        </div>
        {signals.map((s) => (
          <div key={s.cls} className={`moving-signal ${s.cls} ${s.color}`}>
            <i />
            <span>{s.label}</span>
          </div>
        ))}
        <div className="decision-cloud">
          <span className="pass">PASS</span>
          <span className="block">BLOCK</span>
          <span className="hold">HOLD</span>
          <span className="trace">TRACE</span>
        </div>
      </div>
    </section>
  );
}

function Artifact({ type }: { type: Artifact }) {
  if (type === "faultline") return (
    <div className="artifact fault-artifact">
      <div className="storage-boundary">
        <span>STORAGE BOUNDARY</span>
      </div>
      <div className="write-stream stale">
        <span className="stream-label">token 41</span>
        <div className="packet" />
        <b>REJECTED</b>
      </div>
      <div className="write-stream current">
        <span className="stream-label">token 42</span>
        <div className="packet" />
        <b>ACCEPTED</b>
      </div>
      <div className="boundary-shatter" />
    </div>
  );

  if (type === "kubepulse") return (
    <div className="artifact kube-artifact">
      <div className="services-row">
        <div>Service A <span>✓</span></div>
        <div>Service B <span>✓</span></div>
        <div>Service C <span>✓</span></div>
      </div>
      <div className="user-pain-label">Users turn red while services stay green</div>
      <div className="users-row">
        {Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * 0.08}s` }} />)}
      </div>
      <div className="kube-chart">
        <div className="bar ok"><span>Readiness</span></div>
        <div className="bar danger"><span>Latency +608%</span></div>
        <div className="bar warn"><span>SLO breach</span></div>
      </div>
      <div className="gate-slam">RELEASE BLOCKED</div>
    </div>
  );

  if (type === "agentgrid") return (
    <div className="artifact agent-artifact agentgrid-cinematic" aria-label="AgentGrid confidence collapse trace">
      <div className="agent-topline">AGENT FLIGHT RECORDER</div>
      <div className="agent-path" aria-hidden="true">
        {["Question", "Retrieve", "Tool", "Evaluate", "Review"].map((step, i) => (
          <div className="agent-node" key={step} style={{ animationDelay: `${i * .22}s` }}>
            <i />
            <span>{step}</span>
          </div>
        ))}
        <div className="agent-trace-line" />
        <div className="agent-trace-dot" />
      </div>
      <div className="confidence-collapse">
        {[
          ["0.94", "intake", "100%"],
          ["0.86", "retrieve", "78%"],
          ["0.77", "tool", "52%"],
          ["0.61", "review", "22%"],
        ].map(([score, label, level], i) => (
          <div className="confidence-row" key={score} style={{ "--level": level, animationDelay: `${i * .18}s` } as CSSProperties}>
            <b>{score}</b>
            <span>{label}</span>
            <i />
          </div>
        ))}
      </div>
      <div className="agent-noise" aria-hidden="true" />
      <div className="hold-badge">HUMAN REVIEW</div>
    </div>
  );

  if (type === "faireval") return (
    <div className="artifact fair-artifact">
      <div className="release-history" aria-label="FairEval release history">
        <p>Release history</p>
        <div className="release-step passed"><span>v1</span><b>✓</b></div>
        <div className="release-step passed"><span>v2</span><b>✓</b></div>
        <div className="release-step passed"><span>v3</span><b>✓</b></div>
        <div className="release-step failed"><span>candidate</span><b>×</b></div>
        <strong className="history-caption">Regression appears only at release gate.</strong>
      </div>
      <div className="review-board">
        <div><span>Quality</span><b className="yes">YES</b></div>
        <div><span>Groundedness</span><b className="no">NO</b></div>
        <div><span>Safety</span><b className="yes">YES</b></div>
        <div><span>Serving</span><b className="no">NO</b></div>
        <div className="decision-divider" aria-hidden="true" />
        <div className="release-verdict">
          <span>Verdict</span>
          <b>RELEASE DENIED</b>
        </div>
      </div>
    </div>
  );

  return (
    <div className="artifact trace-artifact">
      <div className="tracebox">
        <div><span>TRACE A</span><div className="trace" /></div>
        <div><span>TRACE B</span><div className="trace b" /></div>
        <div className="divergence">DIVERGENCE FOUND · STEP 438</div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="projects section compact-section">
      <div className="container-wide projects-wrap">
        {projects.map((p) => (
          <div className="project" key={p.id}>
            <Artifact type={p.artifact} />
            <div className="project-copy">
              <p className="kicker" style={{ color: p.accent }}>{p.kicker}</p>
              <h3 className="project-title"><a href={p.github} target="_blank" rel="noreferrer">{p.title}</a></h3>
              <p className="project-lead">{p.lead}</p>
              <div className="outcomes">{p.outcomes.map(o => <span key={o}>{o}</span>)}</div>
              <div className="links">
                <a href={`/case-studies/${p.id}`}>Case study</a>
                <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OpenSource() {
  return (
    <section id="oss" className="opensource compact-section">
      <div className="container">
        <p className="kicker">Open Source Contributions</p>
        <h2 className="h2">Production code accepted.</h2>
        <p className="copy">Maintainer-reviewed work in workflow runtime and cloud SDK code paths.</p>
        <div className="oss-grid">
          <a className="oss-card" href="https://github.com/temporalio/sdk-go/pulls?q=is%3Apr+author%3Akritibehl+is%3Amerged" target="_blank" rel="noreferrer">
            <div className="oss-hub">
              <div className="oss-num temporal-text">4</div>
              <span className="spoke s1">workflow correctness</span>
              <span className="spoke s2">concurrency</span>
              <span className="spoke s3">testing</span>
              <span className="spoke s4">runtime observability</span>
            </div>
            <h3>Merged into Temporal Go SDK</h3>
            <p>Correctness, concurrency safety, workflow testing and runtime observability.</p>
          </a>
          <a className="oss-card" href="https://github.com/Azure/azure-sdk-for-go/pulls?q=is%3Apr+author%3Akritibehl" target="_blank" rel="noreferrer">
            <div className="oss-hub">
              <div className="oss-num azure-text">1 / 1</div>
              <span className="spoke s1">HTTP runtime</span>
              <span className="spoke s2">error surfacing</span>
              <span className="spoke s3">trace context</span>
              <span className="spoke s4">cloud SDK</span>
            </div>
            <h3>Azure SDK for Go</h3>
            <p>One merged PR and one open PR across HTTP runtime error surfacing and trace propagation.</p>
          </a>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const rows = [
    { year: "2024–25", phase: "Graduate systems foundation", org: "University of Florida", role: "MS CS · 3.8 GPA" },
    { year: "2025", phase: "Operational analytics", org: "Thales", role: "100k+ HSM records/run" },
    { year: "2026", phase: "AI workflow systems", org: "VLink", role: "LangGraph · RAG evaluation" },
    { year: "2026", phase: "Production engineering", org: "Meta × MLH", role: "Reliability · Linux · infra" },
  ];
  return (
    <section id="experience" className="experience compact-section">
      <div className="container">
        <h2 className="h2">
  Experience
</h2>

<p className="career-line">
  Operations → Reliability → Platform → Production Engineering
</p>
        <div className="experience-progress" aria-hidden="true"><span>Operations</span><i /> <span>Reliability</span><i /> <span>Platform</span><i /> <span>Production Engineering</span></div>
        <div className="experience-line">
          {rows.map((r) => (
            <div className="experience-step" key={`${r.year}-${r.org}`}>
              <div className="year-dot">{r.year}</div>
              <h3>{r.org}</h3>
              <strong>{r.phase}</strong>
              <p>{r.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Writing() {
  const articles = [
    ["Distributed Systems", "How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and Network Faults", mediumLinks.jobQueue],
    ["Release Safety", "Kubernetes Said Everything Was Healthy. It Wasn't.", mediumLinks.kubernetes],
    ["AI Infrastructure", "The Most Dangerous AI Failures Don’t Crash — They Quietly Look Correct", mediumLinks.aiFailures],
  ];
  return (
    <section id="writing" className="writing compact-section">
      <div className="container">
        <p className="kicker">Writing</p>
        <div className="writing-list">
          {articles.map(([topic, title, href]) => (
            <a className="article-row" href={href} target="_blank" rel="noreferrer" key={title}>
              <span>{topic}</span>
              <h3>{title}</h3>
              <b>Read ↗</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Interested in backend, platform, reliability or infrastructure engineering?</h2>
        <p>Looking for new-grad 2026 opportunities where failure visibility, production safety and systems thinking matter.</p>
        <div className="contact-actions">
          <a href="mailto:kriti.behl@ufl.edu">Email me</a>
          <a href="https://github.com/kritibehl" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://linkedin.com/in/kritibehl" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="https://medium.com/@kriti0608" target="_blank" rel="noreferrer">Medium ↗</a>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LivingIncident />
        <Projects />
        <OpenSource />
        <Experience />
        <Writing />
        <Contact />
      </main>
    </>
  );
}