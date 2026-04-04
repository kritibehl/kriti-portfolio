"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function countUp(el: HTMLElement, target: number, dur = 1400) {
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString();
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          countUp(el, Number(el.dataset.target));
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );

    root.querySelectorAll(".count-up").forEach((el) => countObserver.observe(el));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    root.querySelectorAll(".reveal").forEach((el) => {
      if (prefersReducedMotion) {
        el.classList.add("visible");
      } else {
        revealObserver.observe(el);
      }
    });

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          root.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
          const anchor = root.querySelector(
            `.nav-link[href="#${(entry.target as HTMLElement).id}"]`
          );
          if (anchor) anchor.classList.add("active");
        });
      },
      { rootMargin: "-28% 0px -58% 0px" }
    );

    root.querySelectorAll("section[id]").forEach((section) => spyObserver.observe(section));

    const cards = root.querySelectorAll<HTMLElement>(
      ".project-card, .featured-card, .oss-row"
    );
    const handlers: Array<{ el: HTMLElement; fn: EventListener }> = [];

    if (!prefersReducedMotion) {
      cards.forEach((card) => {
        const fn: EventListener = (event) => {
          const e = event as MouseEvent;
          const rect = card.getBoundingClientRect();
          card.style.setProperty(
            "--mx",
            `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`
          );
          card.style.setProperty(
            "--my",
            `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`
          );
        };
        card.addEventListener("mousemove", fn);
        handlers.push({ el: card, fn });
      });
    }

    return () => {
      countObserver.disconnect();
      revealObserver.disconnect();
      spyObserver.disconnect();
      handlers.forEach(({ el, fn }) => el.removeEventListener("mousemove", fn));
    };
  }, []);

  return (
    <div ref={rootRef} className="page-wrap">
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
          <span className="nav-link-icon">◈</span> About
        </a>
        <a className="nav-link" href="#projects">
          <span className="nav-link-icon">◻</span> Projects
        </a>
        <a className="nav-link" href="#oss">
          <span className="nav-link-icon">◎</span> Open Source
        </a>
        <a className="nav-link" href="#skills">
          <span className="nav-link-icon">◇</span> Skills
        </a>
        <a className="nav-link" href="#experience">
          <span className="nav-link-icon">▣</span> Experience
        </a>
        <a className="nav-link" href="#writing">
          <span className="nav-link-icon">✎</span> Writing
        </a>
        <a className="nav-link" href="#contact">
          <span className="nav-link-icon">✉</span> Contact
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
        <div className="hero-wrap">
          <section id="about" className="hero">
            <div className="hero-eyebrow">
              <span>⬡</span> New grad · Dec 2025 · Open to relocation
            </div>

            <h1 className="hero-name">Kriti Behl</h1>

            <p className="hero-sub">
              New-grad software engineer building{" "}
              <strong>backend and distributed systems that stay correct under failure</strong>.
              Built production backend systems at Thales Group, contributed merged fixes to the
              Temporal Go SDK, and built proof-heavy systems including 0 duplicate commits across
              1,500 fault-injected race reproductions and resilience checks that catch unsafe
              behavior even when probes still report healthy.
            </p>

            <div className="hero-actions">
              <a href="/Kriti_Behl_Resume.pdf" className="btn btn-primary">
                Download Resume
              </a>
              <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">
                ✉ Email
              </a>
              <a
                href="https://linkedin.com/in/kriti-behl"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                ↗ LinkedIn
              </a>
              <a
                href="https://github.com/kritibehl"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                ↗ GitHub
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
        </div>

        <div className="stat-bar reveal">
          <div className="stat-cell">
            <div className="stat-val">
              <span className="count-up" data-target="1500">
                1,500
              </span>
            </div>
            <div className="stat-label">Failure-Mode Tests</div>
            <div className="stat-note">Concurrency + fault injection · 0 duplicate commits</div>
          </div>

          <div className="stat-cell">
            <div className="stat-val">5</div>
            <div className="stat-label">Open Source PRs</div>
            <div className="stat-note">
              2 merged Temporal · 2 Azure in review · 1 Temporal open
            </div>
          </div>

          <div className="stat-cell">
            <div className="stat-val">
              86<span className="unit">/100</span>
            </div>
            <div className="stat-label">Resilience Score</div>
            <div className="stat-note">
              8s recovery · probe-healthy / system-unsafe detection
            </div>
          </div>

          <div className="stat-cell">
            <div className="stat-val">100k</div>
            <div className="stat-label">State-Transition Records / Run</div>
            <div className="stat-note">Production backend analytics at Thales Group</div>
          </div>
        </div>

        <section className="proof-index reveal" aria-label="Quick proof index">
          <div className="proof-item">✔ Correctness under failure</div>
          <div className="proof-item">✔ Recovery and resilience validation</div>
          <div className="proof-item">✔ Production open-source contributions</div>
        </section>

        <section id="projects" className="section reveal">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2 className="section-title">Projects</h2>
            <div className="section-line"></div>
          </div>

          <p className="section-intro">
            These projects are built to show not just that systems work, but what happens when
            they fail, drift, recover, or become unsafe in ways surface health checks can miss.
          </p>

          <div className="featured-card">
            <div className="featured-badge">★ Featured</div>

            <div className="featured-name">
              <a
                href="https://github.com/kritibehl/faultline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Faultline — Distributed Job Processing System
              </a>
            </div>

            <div className="featured-tagline">
              Distributed job execution system designed to stay correct under crashes, lease
              races, and transport faults — validated with 1,500 fault-injected race runs, 0
              duplicate commits, and 1,500 stale-write rejections.
            </div>

            <div className="featured-translation">
              Translation: prevents real-world failures like duplicate payments, duplicate emails,
              and inconsistent state during retries.
            </div>

            <div className="card-why">
              Why it matters: shows distributed correctness, failure handling, and
              production-style validation under conditions where naive queue designs break.
            </div>

            <div className="pipeline" aria-label="Faultline validation pipeline">
              <div className="pipe-step">
                <div className="pipe-dot pipe-dot-accent"></div>
                Worker Claims
                <div className="pipe-label">SKIP LOCKED</div>
              </div>
              <div className="pipe-arrow">→</div>
              <div className="pipe-step">
                <div className="pipe-dot pipe-dot-accent"></div>
                Fencing Token
                <div className="pipe-label">DB-enforced</div>
              </div>
              <div className="pipe-arrow">→</div>
              <div className="pipe-step">
                <div className="pipe-dot pipe-dot-yellow"></div>
                FaultProxy Injects
                <div className="pipe-label">latency / drop / timeout</div>
              </div>
              <div className="pipe-arrow">→</div>
              <div className="pipe-step">
                <div className="pipe-dot pipe-dot-green"></div>
                Stale Write Rejected
                <div className="pipe-label">1,500 / 1,500</div>
              </div>
              <div className="pipe-arrow">→</div>
              <div className="pipe-step">
                <div className="pipe-dot pipe-dot-green"></div>
                0 Duplicate Commits
                <div className="pipe-label">across all runs</div>
              </div>
            </div>

            <ul className="bullet-list">
              <li>
                PostgreSQL SKIP LOCKED, lease-based ownership, fencing tokens, and DB-enforced
                idempotency for exactly-once execution.
              </li>
              <li>
                FaultProxy injects latency, drops, and timeouts with 0 duplicate commits across
                1,500 failure-mode tests.
              </li>
              <li>
                29-assertion drill suite across 16 scenarios · 11 Prometheus metrics · 12
                automated tests.
              </li>
            </ul>

            <div className="chip-row">
              <span className="chip chip-hi">1,500 failure-mode tests</span>
              <span className="chip chip-hi">0 duplicate commits</span>
              <span className="chip chip-hi">1,500 stale writes blocked</span>
              <span className="chip">12 tests</span>
              <span className="chip">11 Prometheus metrics</span>
              <span className="chip">Python · PostgreSQL</span>
            </div>

            <div className="card-links">
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
              <div className="card-top">
                <div className="card-name">
                  <a
                    href="https://github.com/kritibehl/KubePulse"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    KubePulse — Kubernetes Resilience Validation
                  </a>
                </div>
                <span className="tag tag-sys">Reliability</span>
              </div>
              <div className="card-tagline">
                Measures whether services truly recover — not just whether probes say so.
              </div>
              <div className="card-why">
                Why it matters: shows that I can evaluate real recovery behavior instead of
                trusting green probes.
              </div>
              <ul className="bullet-list">
                <li>
                  YAML disruption scenarios for CPU stress, pod kills, and partitions with
                  baseline-vs-observed comparison.
                </li>
                <li>
                  Detects readiness false positives when probes stay green while service metrics
                  still show degradation.
                </li>
                <li>
                  Validated: 8s recovery · ~210ms p95 · ~2% error rate · resilience score
                  86/100.
                </li>
              </ul>
              <div className="chip-row">
                <span className="chip chip-hi">8s recovery</span>
                <span className="chip chip-hi">~210ms p95</span>
                <span className="chip chip-hi">86/100 score</span>
                <span className="chip">Python · Kubernetes · Prometheus</span>
              </div>
              <div className="card-links">
                <a
                  href="https://github.com/kritibehl/KubePulse"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ GitHub
                </a>
              </div>
            </div>

            <div className="project-card">
              <div className="card-top">
                <div className="card-name">
                  <a
                    href="https://github.com/kritibehl/autoops-insight"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AutoOps-Insight — CI / Infra Failure Analytics
                  </a>
                </div>
                <span className="tag tag-sys">Operations</span>
              </div>
              <div className="card-tagline">
                Raw CI logs → structured incidents with rule-based detection and operator replay.
              </div>
              <div className="card-why">
                Why it matters: shows operator-facing incident triage, structured failure
                analysis, and debugging workflows.
              </div>
              <ul className="bullet-list">
                <li>
                  11 failure families driven by config rules instead of hardcoded backend logic.
                </li>
                <li>Admin audit log and replayable incident workflow for repeatable triage.</li>
                <li>11 FastAPI endpoints · 5 Prometheus counters · 16 passing tests.</li>
              </ul>
              <div className="chip-row">
                <span className="chip chip-hi">11 failure families</span>
                <span className="chip chip-hi">16 tests</span>
                <span className="chip">Config-driven YAML</span>
                <span className="chip">Incident replay</span>
              </div>
              <div className="card-links">
                <a
                  href="https://github.com/kritibehl/autoops-insight"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ GitHub
                </a>
              </div>
            </div>

            <div className="project-card">
              <div className="card-top">
                <div className="card-name">
                  <a
                    href="https://github.com/kritibehl/dettrace"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DetTrace — Deterministic Replay & Divergence Analysis
                  </a>
                </div>
                <span className="tag tag-dbg">Debugging</span>
              </div>
              <div className="card-tagline">
                Turns flaky concurrent failures into reproducible root-cause artifacts.
              </div>
              <div className="card-why">
                Why it matters: shows deterministic debugging and first-divergence isolation for
                hard-to-reproduce failures.
              </div>
              <ul className="bullet-list">
                <li>
                  Deterministically isolated first divergence at event index 5 across a 20-event
                  trace.
                </li>
                <li>
                  Swift companion analyzer generates JSON and Markdown reports with actor-isolated
                  state.
                </li>
              </ul>
              <div className="chip-row">
                <span className="chip chip-hi">First divergence isolated</span>
                <span className="chip">4 artifacts / run</span>
                <span className="chip">3 Swift tests</span>
                <span className="chip">C++17 · Swift</span>
              </div>
              <div className="card-links">
                <a
                  href="https://github.com/kritibehl/dettrace"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ GitHub
                </a>
              </div>
            </div>

            <div className="project-card">
              <div className="card-top">
                <div className="card-name">
                  <a
                    href="https://github.com/kritibehl/FairEval-Suite"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FairEval Suite — ML Evaluation & Regression Gating
                  </a>
                </div>
                <span className="tag tag-ml">ML Infra</span>
              </div>
              <div className="card-tagline">
                Blocks degraded model releases before they ship with reproducible eval artifacts.
              </div>
              <div className="card-why">
                Why it matters: shows release gating and regression prevention for ML systems
                before bad changes ship.
              </div>
              <ul className="bullet-list">
                <li>
                  Dataset-driven compare and gate pipeline from cases.jsonl to reports,
                  comparisons, and blocked releases.
                </li>
                <li>
                  Release gate blocks on average score drops, pass-rate drops, and per-case
                  regressions.
                </li>
                <li>
                  FastAPI endpoints, full CLI, Docker support, and test coverage for real-model
                  gating behavior.
                </li>
              </ul>
              <div className="chip-row">
                <span className="chip chip-hi">11 tests</span>
                <span className="chip chip-hi">Release gates</span>
                <span className="chip">DistilBERT</span>
                <span className="chip">Python · PyTorch · FastAPI</span>
              </div>
              <div className="card-links">
                <a
                  href="https://github.com/kritibehl/FairEval-Suite"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ GitHub
                </a>
                <a
                  href="https://huggingface.co/spaces/kriti0608/FairEval-Suite"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Live Demo
                </a>
                <a
                  href="https://doi.org/10.5281/zenodo.17625268"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Zenodo
                </a>
              </div>
              <div className="demo-note">
                Demo may take 30–60s to wake due to inactivity.
              </div>
            </div>
          </div>
        </section>

        <section id="oss" className="section reveal">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2 className="section-title">Open Source Impact</h2>
            <div className="section-line"></div>
          </div>

          <p className="section-intro">
            Contributions to production SDKs, including merged fixes in Temporal and in-review
            fixes in Azure around transport error handling and distributed tracing.
          </p>

          <div className="oss-list">
            <div className="oss-row temporal">
              <a
                href="https://github.com/temporalio/sdk-go/pull/2212"
                target="_blank"
                rel="noopener noreferrer"
                className="oss-pr-badge"
              >
                Temporal #2212
              </a>
              <div className="oss-content">
                <div className="oss-title">
                  Fixed OnWorkflow mock to observe propagated context headers
                </div>
                <div className="oss-desc">
                  Aligned mock execution behavior with real runtime propagation expectations.
                </div>
              </div>
              <span className="oss-status status-merged">Merged</span>
            </div>

            <div className="oss-row temporal">
              <a
                href="https://github.com/temporalio/sdk-go/pull/2200"
                target="_blank"
                rel="noopener noreferrer"
                className="oss-pr-badge"
              >
                Temporal #2200
              </a>
              <div className="oss-content">
                <div className="oss-title">
                  Fixed goroutine leak in child-workflow test environment
                </div>
                <div className="oss-desc">
                  Closed an unclosed channel path with regression coverage.
                </div>
              </div>
              <span className="oss-status status-merged">Merged</span>
            </div>

            <div className="oss-row temporal">
              <a
                href="https://github.com/temporalio/sdk-go/pull/2248"
                target="_blank"
                rel="noopener noreferrer"
                className="oss-pr-badge"
              >
                Temporal #2248
              </a>
              <div className="oss-content">
                <div className="oss-title">
                  Restored workflow poller type assignment in scalable task pollers
                </div>
                <div className="oss-desc">
                  Restored sticky vs non-sticky poller distinction used by balancing logic.
                </div>
              </div>
              <span className="oss-status status-review">Open</span>
            </div>

            <div className="oss-row azure">
              <a
                href="https://github.com/Azure/azure-sdk-for-go/pull/26051"
                target="_blank"
                rel="noopener noreferrer"
                className="oss-pr-badge azure-badge"
              >
                Azure #26051
              </a>
              <div className="oss-content">
                <div className="oss-title">
                  Surfaced silently dropped transport errors in azcore retry policy
                </div>
                <div className="oss-desc">
                  Ensured close-path failures are preserved instead of disappearing silently.
                </div>
              </div>
              <span className="oss-status status-review">In Review</span>
            </div>

            <div className="oss-row azure">
              <a
                href="https://github.com/Azure/azure-sdk-for-go/pull/26106"
                target="_blank"
                rel="noopener noreferrer"
                className="oss-pr-badge azure-badge"
              >
                Azure #26106
              </a>
              <div className="oss-content">
                <div className="oss-title">
                  Implemented W3C Trace Context propagation in azcore HTTP tracing
                </div>
                <div className="oss-desc">
                  Added traceparent and tracestate propagation with test coverage.
                </div>
              </div>
              <span className="oss-status status-review">In Review</span>
            </div>
          </div>
        </section>

        <section id="skills" className="section reveal">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2 className="section-title">Skills & Stack</h2>
            <div className="section-line"></div>
          </div>

          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-cat">Languages</div>
              <div className="skill-chips">
                <span className="skill-chip">Python</span>
                <span className="skill-chip">Go</span>
                <span className="skill-chip">C++</span>
                <span className="skill-chip">Swift</span>
                <span className="skill-chip">TypeScript</span>
                <span className="skill-chip">Java</span>
                <span className="skill-chip">SQL</span>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-cat">Systems</div>
              <div className="skill-chips">
                <span className="skill-chip">Idempotency</span>
                <span className="skill-chip">Fencing tokens</span>
                <span className="skill-chip">Deterministic replay</span>
                <span className="skill-chip">State machines</span>
                <span className="skill-chip">Retries / backoff</span>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-cat">Backend</div>
              <div className="skill-chips">
                <span className="skill-chip">FastAPI</span>
                <span className="skill-chip">Flask</span>
                <span className="skill-chip">REST APIs</span>
                <span className="skill-chip">Node.js</span>
                <span className="skill-chip">Pydantic</span>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-cat">Infra & Observability</div>
              <div className="skill-chips">
                <span className="skill-chip">PostgreSQL</span>
                <span className="skill-chip">Docker</span>
                <span className="skill-chip">Kubernetes</span>
                <span className="skill-chip">Prometheus</span>
                <span className="skill-chip">OpenTelemetry</span>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section reveal">
          <div className="section-header">
            <span className="section-num">04</span>
            <h2 className="section-title">Experience</h2>
            <div className="section-line"></div>
          </div>

          <div className="exp-list">
            <div className="exp-card">
              <div className="exp-top">
                <div className="exp-role">DevSecOps Intern</div>
                <div className="exp-dates">Jun – Aug 2025</div>
              </div>
              <div className="exp-company">Thales Group · Plantation, FL</div>
              <ul className="exp-bullets">
                <li>
                  Built a PostgreSQL-backed backend analytics service processing ~100k
                  state-transition records per run across distributed resource pools.
                </li>
                <li>
                  Designed deterministic state-resolution logic and timestamp-delta aggregation for
                  24-hour to 30-day utilization windows.
                </li>
                <li>
                  Exposed resource- and group-level efficiency metrics via REST APIs for operators
                  and capacity planning workflows.
                </li>
              </ul>
            </div>

            <div className="exp-card">
              <div className="exp-top">
                <div className="exp-role">Software Development Intern</div>
                <div className="exp-dates">May – Aug 2024</div>
              </div>
              <div className="exp-company">Elixir Web Solutions · New Delhi, India</div>
              <ul className="exp-bullets">
                <li>
                  Built backend REST services on AWS using Node.js and Express with improved
                  validation and error handling.
                </li>
                <li>
                  Optimized database query plans and indexing, reducing endpoint latency by roughly
                  15–25% in tests.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="writing" className="section reveal">
          <div className="section-header">
            <span className="section-num">05</span>
            <h2 className="section-title">Selected Writing</h2>
            <div className="section-line"></div>
          </div>

          <div className="writing-list">
            <a
              className="writing-card"
              href="https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <div className="writing-title">
                  How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and
                  Network Faults
                </div>
                <div className="writing-sub">
                  Exactly-once execution semantics, fencing tokens, and validating correctness
                  under failure.
                </div>
              </div>
              <span className="writing-arrow">→</span>
            </a>

            <a
              className="writing-card"
              href="https://medium.com/@kriti0608/i-thought-i-built-observability-then-an-incident-proved-i-didnt-9b749e0d4ff3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <div className="writing-title">
                  I Thought I Built Observability. Then an Incident Proved I Didn’t.
                </div>
                <div className="writing-sub">
                  What production-style failure taught me about green dashboards vs real behavior.
                </div>
              </div>
              <span className="writing-arrow">→</span>
            </a>
          </div>
        </section>

        <section id="contact" className="section reveal">
          <div className="section-header">
            <span className="section-num">06</span>
            <h2 className="section-title">Contact</h2>
            <div className="section-line"></div>
          </div>

          <div className="contact-card">
            <div className="contact-headline">
              I’m targeting backend, infrastructure, reliability, and production engineering roles
              where correctness under failure and system behavior under degradation actually
              matter.
            </div>
            <p className="contact-sub">New grad, Dec 2025 · Open to relocation.</p>
            <div className="contact-btns">
              <a href="/Kriti_Behl_Resume.pdf" className="btn btn-primary">
                Download Resume
              </a>
              <a href="mailto:kriti0608@gmail.com" className="btn btn-ghost">
                ✉ kriti0608@gmail.com
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
          </div>
        </section>
      </main>
    </div>
  );
}