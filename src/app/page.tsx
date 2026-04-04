export default function Home() {
  return (
    <div className="page-wrap">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <nav className="sidenav" aria-label="Section navigation">
        <div className="nav-brand">
          <div className="nav-name">Kriti Behl</div>
          <div className="nav-role">Backend · Distributed Systems · Reliability</div>
          <div className="nav-avail">
            <span className="nav-avail-dot"></span>
            Open to roles
          </div>
        </div>

        <div className="nav-section-label">Navigate</div>

        <a className="nav-link active" href="#about">
          About
        </a>
        <a className="nav-link" href="#projects">
          Projects
        </a>
        <a className="nav-link" href="#oss">
          Open Source
        </a>
        <a className="nav-link" href="#skills">
          Skills
        </a>
        <a className="nav-link" href="#experience">
          Experience
        </a>
        <a className="nav-link" href="#writing">
          Writing
        </a>
        <a className="nav-link" href="#contact">
          Contact
        </a>

        <div className="nav-footer">
          <a href="https://github.com/kritibehl" target="_blank" rel="noopener noreferrer">
            ↗ github.com/kritibehl
          </a>
          <a href="https://linkedin.com/in/kriti-behl" target="_blank" rel="noopener noreferrer">
            ↗ linkedin.com/in/kriti-behl
          </a>
          <a href="https://medium.com/@kriti0608" target="_blank" rel="noopener noreferrer">
            ↗ medium.com/@kriti0608
          </a>
          <a href="https://huggingface.co/kriti0608" target="_blank" rel="noopener noreferrer">
            ↗ huggingface.co/kriti0608
          </a>
        </div>
      </nav>

      <main id="main-content" className="main-content">
        <section id="about" className="hero">
          <div className="hero-eyebrow">New grad · Dec 2025 · Open to relocation</div>

          <h1 className="hero-name">Kriti Behl</h1>

          <p className="hero-sub">
            New-grad software engineer building{" "}
            <strong>backend and distributed systems that stay correct under failure</strong>.
            Built production backend systems at Thales Group, contributed merged fixes to the
            Temporal Go SDK, and built proof-heavy systems including 0 duplicate commits across
            1,500 fault-injected race reproductions.
          </p>

          <div className="hero-actions">
            <a href="/Kriti_Behl_Resume.pdf" className="btn btn-primary">
              Download Resume
            </a>
            <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">
              Email
            </a>
            <a
              href="https://github.com/kritibehl"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/kriti-behl"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
          </div>

          <div className="start-here">
            <div className="start-here-label">Start here</div>
            <div className="start-here-links">
              <a
                href="https://github.com/kritibehl/faultline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Faultline → correctness under failure
              </a>
              <a
                href="https://github.com/kritibehl/KubePulse"
                target="_blank"
                rel="noopener noreferrer"
              >
                KubePulse → resilience validation
              </a>
              <a href="#oss">Temporal PRs → shipped OSS proof</a>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-header">
            <h2>Projects</h2>
          </div>

          <p className="section-intro">
            These projects are built to show not just that systems work, but what happens when
            they fail, recover, or become unsafe in ways surface health checks can miss.
          </p>

          <div className="project-card featured-project">
            <div className="project-badge">Featured</div>
            <h3>Faultline — Distributed Job Processing System</h3>
            <p>
              Distributed job execution system designed to stay correct under crashes, lease
              races, and transport faults — validated with 1,500 fault-injected race runs, 0
              duplicate commits, and 1,500 stale-write rejections.
            </p>
            <p className="project-translation">
              Prevents real-world failures like duplicate payments, duplicate emails, and
              inconsistent state during retries.
            </p>
            <ul>
              <li>Exactly-once execution using leases, fencing tokens, and DB-enforced idempotency</li>
              <li>Fault injection for latency, dropped connections, and timeouts</li>
              <li>Proof-heavy validation across 1,500 failure-mode tests</li>
            </ul>
            <div className="project-links">
              <a
                href="https://github.com/kritibehl/faultline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗ GitHub
              </a>
            </div>
          </div>

          <div className="project-grid">
            <div className="project-card">
              <h3>KubePulse — Kubernetes Resilience Validation</h3>
              <p>Measures whether services truly recover — not just whether probes say so.</p>
              <p className="project-translation">
                Why it matters: shows real recovery validation instead of shallow green-status checks.
              </p>
            </div>

            <div className="project-card">
              <h3>AutoOps-Insight — CI / Infra Failure Analytics</h3>
              <p>Turns raw CI and infra failures into structured operator-facing incidents.</p>
              <p className="project-translation">
                Why it matters: shows debugging workflow design and operational triage thinking.
              </p>
            </div>

            <div className="project-card">
              <h3>DetTrace — Deterministic Replay & Divergence Analysis</h3>
              <p>Turns flaky concurrent failures into reproducible root-cause artifacts.</p>
              <p className="project-translation">
                Why it matters: shows deterministic debugging for hard-to-reproduce failures.
              </p>
            </div>

            <div className="project-card">
              <h3>FairEval Suite — ML Evaluation & Regression Gating</h3>
              <p>Blocks degraded model releases before they ship using reproducible eval artifacts.</p>
              <p className="project-translation">
                Why it matters: shows release gating and regression prevention for ML systems.
              </p>
            </div>
          </div>
        </section>

        <section id="oss" className="section">
          <div className="section-header">
            <h2>Open Source</h2>
          </div>

          <p className="section-intro">
            Contributions to production SDKs, including merged fixes in Temporal and in-review
            fixes in Azure.
          </p>

          <div className="oss-list">
            <div className="oss-row">
              <div>
                <strong>Temporal #2212</strong>
                <p>Fixed OnWorkflow mock to observe propagated context headers.</p>
              </div>
              <span className="oss-status merged">Merged</span>
            </div>

            <div className="oss-row">
              <div>
                <strong>Temporal #2200</strong>
                <p>Fixed goroutine leak in child-workflow test environment.</p>
              </div>
              <span className="oss-status merged">Merged</span>
            </div>

            <div className="oss-row">
              <div>
                <strong>Temporal #2248</strong>
                <p>Restored workflow poller type assignment in scalable task pollers.</p>
              </div>
              <span className="oss-status review">Open</span>
            </div>

            <div className="oss-row">
              <div>
                <strong>Azure #26051</strong>
                <p>Surfaced silently dropped transport errors in azcore retry policy.</p>
              </div>
              <span className="oss-status review">In Review</span>
            </div>

            <div className="oss-row">
              <div>
                <strong>Azure #26106</strong>
                <p>Implemented W3C Trace Context propagation in azcore HTTP tracing.</p>
              </div>
              <span className="oss-status review">In Review</span>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-header">
            <h2>Skills</h2>
          </div>
          <div className="simple-list">
            Python · Go · C++ · Swift · TypeScript · Java · SQL · FastAPI · Flask · PostgreSQL · Docker · Kubernetes · Prometheus · OpenTelemetry
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-header">
            <h2>Experience</h2>
          </div>

          <div className="exp-card">
            <h3>Thales Group — DevSecOps Intern</h3>
            <p>Jun – Aug 2025 · Plantation, FL</p>
            <ul>
              <li>
                Built a PostgreSQL-backed backend analytics service processing ~100k
                state-transition records per run across distributed resource pools.
              </li>
              <li>
                Designed deterministic state-resolution logic and timestamp-delta aggregation for
                utilization reporting windows.
              </li>
              <li>
                Exposed resource- and group-level efficiency metrics via REST APIs for operators
                and capacity planning workflows.
              </li>
            </ul>
          </div>

          <div className="exp-card">
            <h3>Elixir Web Solutions — Software Development Intern</h3>
            <p>May – Aug 2024 · New Delhi, India</p>
            <ul>
              <li>
                Built backend REST services on AWS using Node.js and Express with improved
                validation and error handling.
              </li>
              <li>
                Optimized database query plans and indexing, reducing endpoint latency by ~15–25%
                in tests.
              </li>
            </ul>
          </div>
        </section>

        <section id="writing" className="section">
          <div className="section-header">
            <h2>Writing</h2>
          </div>

          <div className="writing-list">
            <a
              className="writing-card"
              href="https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723"
              target="_blank"
              rel="noopener noreferrer"
            >
              How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and
              Network Faults
            </a>

            <a
              className="writing-card"
              href="https://medium.com/@kriti0608/i-thought-i-built-observability-then-an-incident-proved-i-didnt-9b749e0d4ff3"
              target="_blank"
              rel="noopener noreferrer"
            >
              I Thought I Built Observability. Then an Incident Proved I Didn’t.
            </a>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-header">
            <h2>Contact</h2>
          </div>

          <p className="contact-text">
            I’m targeting backend, infrastructure, reliability, and production engineering roles
            where correctness under failure and system behavior under degradation actually matter.
          </p>

          <div className="hero-actions">
            <a href="/Kriti_Behl_Resume.pdf" className="btn btn-primary">
              Download Resume
            </a>
            <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">
              Email
            </a>
            <a
              href="https://linkedin.com/in/kriti-behl"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/kritibehl"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}