const links = {
  github: 'https://github.com/kritibehl',
  linkedin: 'https://www.linkedin.com/in/kriti-behl/',
  email: 'mailto:kriti0608@gmail.com',
  agentgrid: 'https://github.com/kritibehl/agentgrid-demo',
  faultline: 'https://github.com/kritibehl/faultline',
  kubepulse: 'https://github.com/kritibehl/KubePulse',
  faireval: 'https://github.com/kritibehl/FairEval-Suite',
  dettrace: 'https://github.com/kritibehl/dettrace',
  temporal: 'https://github.com/temporalio/sdk-go/pulls?q=is%3Apr+author%3Akritibehl',
  azure: 'https://github.com/Azure/azure-sdk-for-go/pulls?q=is%3Apr+author%3Akritibehl',
  writing1: 'https://medium.com/@kriti0608/kubernetes-said-everything-was-healthy-it-wasnt-27f7b4b9ed0e',
  writing2: 'https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723',
  writing3: 'https://medium.com/@kriti0608/the-most-dangerous-ai-failures-dont-crash-they-quietly-look-correct-a404e343395a',
};

const orgs = [
  { name: 'Temporal OSS', detail: '5 merged PRs', tone: 'temporal', href: links.temporal },
  { name: 'Azure SDK', detail: 'merged contribution', tone: 'azure', href: links.azure },
  { name: 'Meta PE', detail: 'Production Engineering Fellow', tone: 'meta', href: '#' },
  { name: 'Thales', detail: '100k+ telemetry records', tone: 'thales', href: '#' },
  { name: 'UF MS CS', detail: '3.8 GPA', tone: 'uf', href: '#' },
];

const proof = [
  ['5', 'merged Temporal PRs'],
  ['100k+', 'telemetry records'],
  ['1,500+', 'injected failures'],
  ['73', 'AgentGrid tests'],
  ['0.0%', 'duplicate commits'],
  ['+608%', 'latency regression'],
];

const coverage = [
  ['AI workflow systems', 96],
  ['Distributed execution', 91],
  ['Reliability engineering', 94],
  ['Evaluation systems', 88],
  ['Runtime diagnostics', 86],
  ['Open-source runtimes', 92],
];

const runSteps = [
  ['01', 'Question', 'Why did deployment fail?'],
  ['02', 'Retrieval', '4 evidence sources'],
  ['03', 'Tool run', 'logs parsed'],
  ['04', 'Evaluation', 'confidence 0.42'],
  ['05', 'Review', 'human required'],
  ['06', 'Decision', 'do not deploy'],
];

function OrgRail() {
  return (
    <div className="org-rail" aria-label="External credibility signals">
      {orgs.map((org) => (
        <a key={org.name} href={org.href} className={`org-chip ${org.tone}`}>
          <span>{org.name}</span>
          <strong>{org.detail}</strong>
        </a>
      ))}
    </div>
  );
}

function HeroArtifact() {
  return (
    <div className="hero-artifact" aria-label="AgentGrid workflow run">
      <div className="artifact-top">
        <div>
          <span className="mono-kicker">AGENTGRID CONTROL CENTER</span>
          <h3>Workflow run #287</h3>
        </div>
        <b>LIVE</b>
      </div>
      <div className="run-question">Customer asks: “Why did deployment fail?”</div>
      <div className="run-ladder">
        {runSteps.map(([id, name, status]) => (
          <div className="run-step" key={id}>
            <small>{id}</small>
            <span>{name}</span>
            <strong>{status}</strong>
          </div>
        ))}
        <i className="moving-dot" />
      </div>
      <div className="decision-panel">
        <span>Release recommendation</span>
        <strong>ROUTE TO HUMAN REVIEW</strong>
      </div>
      <div className="mini-metrics">
        <span>Retrieval 0.90</span>
        <span>Eval 5/5</span>
        <span>Latency 820ms</span>
      </div>
    </div>
  );
}

function EvidenceWall() {
  return (
    <section id="evidence" className="evidence-wall">
      <div className="section-copy">
        <p className="eyebrow">Evidence</p>
        <h2>External validation. Production signals. Maintainer-reviewed code.</h2>
      </div>
      <div className="proof-grid">
        {proof.map(([num, label]) => (
          <div className="proof-item" key={label}>
            <strong>{num}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CoverageMap() {
  return (
    <section className="coverage-section">
      <div className="coverage-copy">
        <p className="eyebrow">Systems coverage</p>
        <h2>Different lanes. One pattern: understand behavior, build evidence.</h2>
        <p>My work crosses AI infrastructure, backend platforms, release engineering, evaluation, diagnostics, telemetry and open-source runtime work without becoming a random project gallery.</p>
      </div>
      <div className="coverage-bars">
        {coverage.map(([label, value]) => (
          <div className="coverage-row" key={label as string}>
            <span>{label}</span>
            <div><i style={{ width: `${value}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AgentGrid() {
  return (
    <section id="agentgrid" className="agentgrid flagship">
      <div className="flagship-head">
        <p className="eyebrow cyan">Flagship system</p>
        <h2>AgentGrid</h2>
        <p>AI workflow platform for evaluation, telemetry, review routing and handoff controls.</p>
        <a href={links.agentgrid}>GitHub →</a>
      </div>

      <div className="agentgrid-stage">
        <aside className="judgment-card">
          <span>Why this matters</span>
          <h3>Most teams can generate responses. Fewer can decide whether those responses should be trusted.</h3>
          <p><b>Question:</b> How do you measure workflow quality after an LLM responds?</p>
          <p><b>Hard problem:</b> The response is not difficult. Trusting it is.</p>
        </aside>

        <div className="control-surface">
          <div className="surface-bar"><span>agentgrid.dev / workflow run</span><b>review required</b></div>
          <div className="flow-canvas">
            {['Request', 'Retriever', 'Tool Runtime', 'Evaluation Engine', 'Review Queue', 'Telemetry Store', 'Handoff'].map((node, i) => (
              <div className={`flow-node node-${i}`} key={node}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                <strong>{node}</strong>
                <span>{i === 0 ? 'accepted' : i === 1 ? 'hit .90' : i === 2 ? 'success' : i === 3 ? 'review' : i === 4 ? 'queued' : i === 5 ? 'live' : 'ready'}</span>
              </div>
            ))}
            <div className="flow-route" />
            <div className="flow-signal" />
          </div>
          <div className="control-bottom">
            <div><strong>73</strong><span>passing tests</span></div>
            <div><strong>5/5</strong><span>eval checks</span></div>
            <div><strong>0.90</strong><span>retrieval hit</span></div>
            <div><strong>820ms</strong><span>p95 latency</span></div>
          </div>
        </div>
      </div>
      <div className="outcome cyan-outcome">Workflow quality became measurable.</div>
    </section>
  );
}

function Faultline() {
  return (
    <section id="systems" className="faultline artifact-split">
      <div className="copy-panel">
        <p className="eyebrow violet">Correctness debugger</p>
        <h2>Faultline</h2>
        <h3>How do you maintain correctness when ownership changes?</h3>
        <p>Running jobs is easy. Maintaining correctness after lease takeover, stale retries, and worker crashes is not.</p>
        <div className="arch-pill">API → Queue → Lease Manager → Fencing Validator → PostgreSQL → Metrics</div>
        <a href={links.faultline}>GitHub →</a>
      </div>
      <div className="incident-console">
        <div className="console-head"><span>INCIDENT #2847</span><b>replay resolved</b></div>
        {[
          ['lease_expired', 'worker_a', 'token=41'],
          ['ownership_transferred', 'worker_b', 'token=42'],
          ['commit_attempt', 'worker_a', 'stale_owner'],
          ['validator_response', 'rejected', 'fencing_token_failed'],
          ['storage_state', 'committed', 'state_preserved'],
        ].map((row) => (
          <div className="console-row" key={row.join('-')}>
            <span>{row[0]}</span><span>{row[1]}</span><strong>{row[2]}</strong>
          </div>
        ))}
        <div className="console-metrics"><span>0.0% duplicate commits</span><span>1,500+ failures</span><span>37 stale writes rejected</span></div>
        <div className="console-outcome">Ownership ambiguity became enforceable.</div>
      </div>
    </section>
  );
}

function KubePulse() {
  return (
    <section className="kubepulse war-room">
      <div className="war-left">
        <p className="eyebrow amber">Release war room</p>
        <h2>KubePulse</h2>
        <h3>Healthy infrastructure does not guarantee healthy user experience.</h3>
        <p>Health probes passed. User-facing latency did not.</p>
        <a href={links.kubepulse}>GitHub →</a>
      </div>
      <div className="war-right">
        <strong className="big-percent">81%</strong>
        <div className="health-row"><span>API healthy</span><span>Worker healthy</span><span>Cache healthy</span><b>Latency +608%</b></div>
        <div className="blocked-banner">ROLLOUT BLOCKED</div>
        <div className="war-result">Unsafe releases became visible before deployment.</div>
      </div>
    </section>
  );
}

function DepthProof() {
  return (
    <section className="depth-proof">
      <div className="section-copy centered">
        <p className="eyebrow">Depth proof</p>
        <h2>Two more investigations into behavior that only looks correct.</h2>
      </div>
      <div className="depth-grid">
        <div className="governance-card">
          <span>Governance board</span>
          <h3>FairEval</h3>
          <p>Models look correct. Should they ship?</p>
          <div className="review-lines"><span>Quality <b>PASS</b></span><span>Safety <b>PASS</b></span><span>Groundedness <b>REVIEW</b></span><span>Serving <b>REVIEW</b></span></div>
          <strong>Model quality became reviewable.</strong>
          <a href={links.faireval}>GitHub →</a>
        </div>
        <div className="trace-card">
          <span>Trace viewer</span>
          <h3>DetTrace</h3>
          <p>Failures disappear. Can they be reproduced?</p>
          <pre>{`trace_a ━━━━━━━━━━━━━━━
trace_b ━━━━━━━╳━━━━━━`}</pre>
          <strong>DIVERGENCE @ STEP 438</strong>
          <em>Non-reproducible failures became diagnosable.</em>
          <a href={links.dettrace}>GitHub →</a>
        </div>
      </div>
    </section>
  );
}

function OpenSource() {
  const prs = [
    ['#2200', 'Workflow runtime reliability', 'Merged'],
    ['#2212', 'Workflow mock headers', 'Merged'],
    ['#2248', 'Poller instrumentation', 'Merged'],
    ['#2298', 'Async completion correctness', 'Merged'],
    ['#2367', 'Worker rate-limit caveat', 'Merged'],
  ];
  return (
    <section id="oss" className="oss-prestige">
      <div className="oss-copy">
        <p className="eyebrow purple">Open source</p>
        <h2>Maintainers accepted the work.</h2>
        <p>Temporal Go SDK and Azure Go SDK contributions were reviewed and merged outside my own repositories.</p>
        <div className="oss-duo"><a href={links.temporal}>Temporal PRs →</a><a href={links.azure}>Azure SDK PR →</a></div>
      </div>
      <div className="pr-list">
        {prs.map((pr) => (
          <div className="pr-card" key={pr[0]}><span>{pr[0]}</span><strong>{pr[1]}</strong><b>{pr[2]}</b></div>
        ))}
        <div className="azure-card"><span>Azure SDK</span><strong>Retry policy error propagation</strong><b>Merged</b></div>
      </div>
    </section>
  );
}

function WritingContact() {
  return (
    <section id="contact" className="writing-contact">
      <div className="writing-head">
        <p className="eyebrow">Engineering writing</p>
        <h2>The investigations continued as writing.</h2>
        <p>I write about distributed systems, AI reliability and production engineering.</p>
      </div>
      <div className="articles">
        <a href={links.writing1}><span>Reliability</span><strong>Kubernetes Said Everything Was Healthy. It Wasn't.</strong></a>
        <a href={links.writing2}><span>Distributed Systems</span><strong>How I Built a Distributed Job Queue That Stays Correct Under Crashes.</strong></a>
        <a href={links.writing3}><span>AI Systems</span><strong>The Most Dangerous AI Failures Don't Crash. They Quietly Look Correct.</strong></a>
      </div>
      <footer>
        <h2>Looking for the next difficult system.</h2>
        <div><a href={links.email}>Email</a><a href={links.github}>GitHub</a><a href={links.linkedin}>LinkedIn</a></div>
      </footer>
    </section>
  );
}

export default function Page() {
  return (
    <main>
      <nav className="nav">
        <a href="#top" className="brand">Kriti Behl</a>
        <div><a href="#evidence">Evidence</a><a href="#agentgrid">AgentGrid</a><a href="#systems">Systems</a><a href="#oss">OSS</a><a href={links.github}>GitHub</a></div>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy reveal">
          <p className="eyebrow">Backend · Platform · AI Infrastructure</p>
          <h1>Complex systems rarely fail for obvious reasons.</h1>
          <p className="hero-sub">I build tools that make their behavior observable, measurable and actionable.</p>
          <OrgRail />
        </div>
        <div className="reveal delay"><HeroArtifact /></div>
      </section>

      <EvidenceWall />
      <CoverageMap />
      <AgentGrid />
      <Faultline />
      <KubePulse />
      <DepthProof />
      <OpenSource />
      <WritingContact />
    </main>
  );
}
