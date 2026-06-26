'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import type { DiagnosticMode } from '../components/KubePulseDiagnosticScene';

const KubePulseDiagnosticScene = dynamic(() => import('../components/KubePulseDiagnosticScene'), {
  ssr: false,
  loading: () => <div className="three-loading"><i /><span>Loading diagnostic topology…</span></div>,
});

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

type Scenario = 'healthy' | 'latency' | 'lease' | 'regression' | 'divergence';

type ScenarioConfig = {
  label: string;
  short: string;
  headline: string;
  summary: string;
  accent: string;
  events: string[];
};

const scenarios: Record<Scenario, ScenarioConfig> = {
  healthy: {
    label: 'Normal operation',
    short: 'RESET',
    headline: 'All systems nominal',
    summary: 'Guardrails active. Release approved.',
    accent: '#5eead4',
    events: ['request accepted', 'retrieval hit 0.90', 'evaluation passed', 'release approved'],
  },
  latency: {
    label: 'Latency spike',
    short: 'LATENCY',
    headline: 'Healthy probes. Unhealthy experience.',
    summary: 'KubePulse blocks the rollout.',
    accent: '#fb7185',
    events: ['latency +608%', 'health probes remain green', 'probe mismatch detected', 'rollout blocked'],
  },
  lease: {
    label: 'Expire worker lease',
    short: 'LEASE',
    headline: 'Ownership changed mid-flight.',
    summary: 'Faultline rejects the stale commit.',
    accent: '#a78bfa',
    events: ['worker_a lease expired', 'worker_b acquired token 42', 'stale commit attempted', 'fencing validator rejected write'],
  },
  regression: {
    label: 'Model regression',
    short: 'MODEL',
    headline: 'The answer looks correct. The release is not.',
    summary: 'FairEval routes the release to review.',
    accent: '#fbbf24',
    events: ['quality checks passed', 'groundedness review', 'p95 serving regression', 'release routed to human'],
  },
  divergence: {
    label: 'Trace divergence',
    short: 'TRACE',
    headline: 'Replay departed from reality.',
    summary: 'DetTrace finds the first divergence.',
    accent: '#34d399',
    events: ['expected trace loaded', 'replay started', 'divergence at step 438', 'incident pack exported'],
  },
};

const orgs = [
  { name: 'Temporal OSS', detail: '5 merged PRs', tone: 'temporal', href: links.temporal },
  { name: 'Azure SDK', detail: 'merged contribution', tone: 'azure', href: links.azure },
  { name: 'MLH / Meta PE', detail: 'Production Engineering Track', tone: 'meta', href: '#' },
  { name: 'Thales', detail: '100k+ telemetry records', tone: 'thales', href: '#' },
  { name: 'UF MS CS', detail: '3.8 GPA', tone: 'uf', href: '#' },
];

type ProofMetric = { value: string; label: string };

const proof: ProofMetric[] = [
  { value: '5', label: 'merged Temporal PRs' },
  { value: '100k+', label: 'telemetry records' },
  { value: '1,500+', label: 'injected failures' },
  { value: '73', label: 'AgentGrid tests' },
  { value: '0.0%', label: 'duplicate commits' },
  { value: '+608%', label: 'latency regression detected' },
];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const } },
};

const topologyNodes = [
  { id: 'request', label: 'Request', x: 8, y: 46 },
  { id: 'agentgrid', label: 'AgentGrid', x: 28, y: 22 },
  { id: 'faultline', label: 'Faultline', x: 28, y: 70 },
  { id: 'kubepulse', label: 'KubePulse', x: 53, y: 18 },
  { id: 'faireval', label: 'FairEval', x: 57, y: 72 },
  { id: 'dettrace', label: 'DetTrace', x: 80, y: 28 },
  { id: 'release', label: 'Release', x: 84, y: 72 },
];

function OrgRail() {
  return (
    <div className="org-rail" aria-label="External credibility signals">
      {orgs.map((org) => (
        <a key={org.name} href={org.href} className={`org-chip ${org.tone}`} target={org.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
          <span>{org.name}</span>
          <strong>{org.detail}</strong>
        </a>
      ))}
    </div>
  );
}

function nodeState(id: string, scenario: Scenario, phase: number) {
  if (scenario === 'healthy') return 'ok';
  if (phase < 1 && id !== 'request') return 'idle';

  const affected: Record<Exclude<Scenario, 'healthy'>, string[]> = {
    latency: ['kubepulse', 'agentgrid', 'faireval', 'release'],
    lease: ['faultline', 'dettrace', 'release'],
    regression: ['agentgrid', 'faireval', 'release'],
    divergence: ['dettrace', 'agentgrid', 'release'],
  };

  if (!affected[scenario].includes(id)) return 'ok';
  if (id === 'release' && phase >= 3) return 'blocked';
  if (phase >= 2) return 'alert';
  return 'active';
}

function SystemObservatory() {
  const [scenario, setScenario] = useState<Scenario>('healthy');
  const [phase, setPhase] = useState(4);
  const config = scenarios[scenario];

  useEffect(() => {
    if (scenario === 'healthy') {
      setPhase(4);
      return;
    }

    setPhase(0);
    const timer = window.setInterval(() => {
      setPhase((current) => {
        if (current >= 4) {
          window.clearInterval(timer);
          return 4;
        }
        return current + 1;
      });
    }, 720);

    return () => window.clearInterval(timer);
  }, [scenario]);

  const selectScenario = (next: Scenario) => {
    if (next === scenario && next !== 'healthy') {
      setScenario('healthy');
      window.setTimeout(() => setScenario(next), 40);
      return;
    }
    setScenario(next);
  };

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--rx', `${-y * 2.3}deg`);
    event.currentTarget.style.setProperty('--ry', `${x * 3.2}deg`);
    event.currentTarget.style.setProperty('--gx', `${(x + 1) * 50}%`);
    event.currentTarget.style.setProperty('--gy', `${(y + 1) * 50}%`);
  };

  const onLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <div className="observatory-shell" style={{ '--scenario': config.accent } as CSSProperties} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="observatory-chrome">
        <div>
          <span className="mono-kicker">SYSTEM FAILURE OBSERVATORY</span>
          <strong>LIVE / RUN #287</strong>
        </div>
        <div className={`system-pill ${scenario === 'healthy' ? 'nominal' : 'incident'}`}>
          <i /> {scenario === 'healthy' ? 'NOMINAL' : phase < 4 ? 'INCIDENT ACTIVE' : 'CONTAINED'}
        </div>
      </div>

      <div className="observatory-body">
        <div className="topology-stage">
          <div className="topology-grid" aria-hidden="true" />
          <div className="aurora aurora-one" aria-hidden="true" />
          <div className="aurora aurora-two" aria-hidden="true" />
          <svg className="topology-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 46 C15 46 20 22 28 22" />
            <path d="M8 46 C15 46 20 70 28 70" />
            <path d="M28 22 C38 22 42 18 53 18" />
            <path d="M28 70 C40 70 45 72 57 72" />
            <path d="M53 18 C64 18 68 28 80 28" />
            <path d="M57 72 C67 72 72 28 80 28" />
            <path d="M80 28 C86 38 86 58 84 72" />
            <path d="M53 18 C66 38 70 60 84 72" />
          </svg>

          <div className={`signal-train signal-${scenario}`} aria-hidden="true"><i /><i /><i /></div>

          {topologyNodes.map((node) => {
            const state = nodeState(node.id, scenario, phase);
            return (
              <div
                className={`topology-node node-${state} topology-${node.id}`}
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <span>{node.label}</span>
                <small>{state === 'blocked' ? 'BLOCKED' : state === 'alert' ? 'INTERVENE' : state === 'active' ? 'ANALYZING' : state === 'idle' ? 'STANDBY' : 'HEALTHY'}</small>
              </div>
            );
          })}

          <div className={`incident-core core-${scenario}`}>
            <span>{config.short}</span>
            <b>{phase < 2 ? 'INJECTING' : phase < 4 ? 'PROPAGATING' : scenario === 'healthy' ? 'READY' : 'CONTAINED'}</b>
          </div>
        </div>

        <aside className="incident-readout" aria-live="polite">
          <div className="readout-head">
            <span>ACTIVE INVESTIGATION</span>
            <b>{String(phase).padStart(2, '0')}/04</b>
          </div>
          <h3>{config.headline}</h3>
          <p>{config.summary}</p>
          <div className="event-stream">
            {config.events.map((event, index) => (
              <div className={index < phase || scenario === 'healthy' ? 'visible' : ''} key={event}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                <span>{event}</span>
                <b>{index < phase || scenario === 'healthy' ? '✓' : '—'}</b>
              </div>
            ))}
          </div>
          <div className="readout-metrics">
            <span><b>{scenario === 'latency' ? '850ms' : '120ms'}</b> p95 latency</span>
            <span><b>{scenario === 'lease' ? '42' : '41'}</b> fencing token</span>
            <span><b>{scenario === 'healthy' ? 'PASS' : 'BLOCK'}</b> release</span>
          </div>
        </aside>
      </div>

      <div className="scenario-controls" aria-label="Failure injection controls">
        {(Object.keys(scenarios) as Scenario[]).map((key) => (
          <button type="button" key={key} className={scenario === key ? 'selected' : ''} onClick={() => selectScenario(key)}>
            <i />
            <span>{scenarios[key].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EvidenceWall() {
  return (
    <motion.section id="evidence" className="evidence-wall section-pad print-keep" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal}>
      <div className="section-copy">
        <p className="eyebrow">Evidence, not adjectives</p>
        <h2>Proof, not adjectives.</h2>
        <p className="body-copy">Maintainer-reviewed code. Production signals. Measured failure behavior.</p>
      </div>
      <div className="proof-grid">
        {proof.map((item, index) => (
          <motion.div className="proof-item" key={item.label} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }} transition={{ delay: index * 0.065, duration: 0.55 }} whileHover={{ y: -8, rotateX: 2, rotateY: index % 2 ? -2 : 2 }}>
            <strong className="proof-value">{item.value}</strong>
            <span>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function NarrativeRail() {
  const steps = [
    ['01', 'Inject', 'Controlled failure'],
    ['02', 'Observe', 'Telemetry + traces'],
    ['03', 'Enforce', 'Reject or block'],
    ['04', 'Explain', 'Reproducible proof'],
  ];
  return (
    <motion.section className="narrative section-pad print-compact" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal}>
      <div className="narrative-title">
        <p className="eyebrow">One operating model</p>
        <h2>Break it. Watch it. Prove it.</h2>
      </div>
      <div className="narrative-rail">
        {steps.map(([id, title, copy]) => (
          <motion.article key={id} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.75 }} transition={{ delay: Number(id) * 0.06, duration: 0.55 }}>
            <small>{id}</small>
            <h3>{title}</h3>
            <p>{copy}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function AgentGrid() {
  const [confidence, setConfidence] = useState(42);
  const [toolHealthy, setToolHealthy] = useState(true);
  const autonomous = confidence >= 75 && toolHealthy;

  const nodes = [
    ['01', 'Request', 'accepted'],
    ['02', 'Retriever', `confidence ${confidence / 100}`],
    ['03', 'Tool runtime', toolHealthy ? 'success' : 'timeout'],
    ['04', 'Evaluation', autonomous ? 'pass' : 'review'],
    ['05', 'Decision', autonomous ? 'complete' : 'human'],
  ];

  return (
    <motion.section id="agentgrid" className="project-section agent-section print-project" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.7 }}>
      <div className="project-heading light-heading">
        <div>
          <p className="eyebrow cyan">Flagship system · interactive</p>
          <h2>AgentGrid</h2>
        </div>
        <p>Slide confidence. Routing changes.</p>
        <a href={links.agentgrid} target="_blank" rel="noreferrer">View GitHub ↗</a>
      </div>

      <div className="agent-lab">
        <aside className="lab-controls dark-controls">
          <span className="control-label">RETRIEVAL CONFIDENCE</span>
          <div className="big-control-value">{confidence}%</div>
          <input aria-label="Retrieval confidence" type="range" min="20" max="98" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} />
          <button type="button" className={toolHealthy ? 'toggle-on' : ''} onClick={() => setToolHealthy((value) => !value)}>
            <i /> Tool runtime {toolHealthy ? 'healthy' : 'timed out'}
          </button>
          <div className="decision-copy" aria-live="polite">
            <small>RELEASE RECOMMENDATION</small>
            <strong>{autonomous ? 'AUTONOMOUS COMPLETE' : 'ROUTE TO HUMAN REVIEW'}</strong>
          </div>
        </aside>

        <div className="agent-canvas">
          <div className="canvas-grid" aria-hidden="true" />
          <div className={`agent-route ${autonomous ? 'route-pass' : 'route-review'}`} aria-hidden="true" />
          {nodes.map(([id, name, status], index) => (
            <div className={`agent-node agent-node-${index}`} key={id}>
              <small>{id}</small>
              <strong>{name}</strong>
              <span>{status}</span>
            </div>
          ))}
          <div className={`agent-packet ${autonomous ? 'packet-pass' : 'packet-review'}`} aria-hidden="true" />
          <div className={`decision-orb ${autonomous ? 'pass' : 'review'}`}>
            <span>{autonomous ? 'PASS' : 'REVIEW'}</span>
            <b>{autonomous ? 'ship' : 'human required'}</b>
          </div>
        </div>
      </div>
      <div className="project-outcome cyan-outcome">Workflow quality → reviewable.</div>
    </motion.section>
  );
}

function Faultline() {
  const [step, setStep] = useState(4);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    setStep(0);
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= 4) {
          window.clearInterval(timer);
          setRunning(false);
          return 4;
        }
        return current + 1;
      });
    }, 760);
    return () => window.clearInterval(timer);
  }, [running]);

  const events = [
    ['lease_expired', 'worker_a', 'token=41'],
    ['ownership_transferred', 'worker_b', 'token=42'],
    ['commit_attempt', 'worker_a', 'stale_owner'],
    ['validator_response', 'rejected', 'fencing_token_failed'],
    ['storage_state', 'committed', 'state_preserved'],
  ];

  return (
    <motion.section id="systems" className="project-section fault-section print-project" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={reveal}>
      <div className="project-heading">
        <div>
          <p className="eyebrow violet">Correctness debugger · replayable</p>
          <h2>Faultline</h2>
        </div>
        <p>41 expires. 42 wins.</p>
        <a href={links.faultline} target="_blank" rel="noreferrer">View GitHub ↗</a>
      </div>

      <div className="fault-lab">
        <aside className="fault-story">
          <h3>41 expires → 42 wins → reject.</h3>
          <p>State preserved.</p>
          <button type="button" className="primary-action" onClick={() => setRunning(true)} disabled={running}>
            {running ? 'Race running…' : 'Replay lease race'}
          </button>
          <div className="arch-stack">
            {['Expire', 'Claim', 'Validate', 'Reject', 'Preserve'].map((item, index) => <span key={item} title={item}><i>{index + 1}</i><b>{item}</b></span>)}
          </div>
        </aside>

        <div className="incident-console">
          <div className="console-head"><span>INCIDENT #2847</span><b>{step >= 4 ? 'STATE PRESERVED' : 'REPLAYING'}</b></div>
          <div className="authority-flow" aria-label="Faultline authority transfer proof">
            <span className={step >= 0 ? 'active' : ''}><i>01</i><b>worker_a</b><small>expired</small></span>
            <span className={step >= 1 ? 'active owner' : ''}><i>02</i><b>worker_b</b><small>owner</small></span>
            <span className={step >= 3 ? 'active rejected' : ''}><i>03</i><b>validator</b><small>reject</small></span>
          </div>
          <div className="lease-stage">
            <div className="lease-grid" aria-hidden="true" />
            <div className="state-preserved-halo" aria-hidden="true" />
            <div className="worker-line worker-a"><span>worker_a</span><em>old owner</em><i className={step >= 2 ? 'stale' : ''}>41</i></div>
            <div className="worker-line worker-b"><span>worker_b</span><em>current owner</em><i className={step >= 1 ? 'owner' : ''}>42</i></div>
            <div className={`fence ${step >= 3 ? 'rejecting' : ''}`}><span>FENCING</span><b>VALIDATOR</b></div>
            <div className={`write-pulse ${step >= 2 ? 'moving' : ''}`} />
            <div className={`reject-label ${step >= 3 ? 'show' : ''}`}>STALE WRITE REJECTED</div>
          </div>
          <div className="fault-bottom-grid">
            <div className="mini-proof-rail" aria-label="lease expired, ownership transferred, stale commit rejected, state preserved">
              {events.map((row, index) => (
                <i className={index <= step ? 'visible' : ''} key={row.join('-')} title={row.join(' ')} />
              ))}
            </div>
            <div className="fault-result-card">
              <small>CORRECTNESS GUARANTEE</small>
              <strong>Current owner only.</strong>
              <b>{step >= 4 ? 'STATE PRESERVED' : 'VERIFYING…'}</b>
            </div>
          </div>
          <div className="console-badges"><span>0 dupes</span><span>1.5k faults</span><span>37 rejected</span></div>
        </div>
      </div>
      <div className="project-outcome violet-outcome">Stale writes rejected. State preserved.</div>
    </motion.section>
  );
}

const diagnosticModes: Record<DiagnosticMode, {
  label: string;
  code: string;
  stopAt: number;
  failingLayer: string;
  headline: string;
  rootCause: string;
  remediation: string[];
  latency: string;
  result: 'PASS' | 'DEGRADED' | 'BLOCK';
}> = {
  healthy: {
    label: 'Healthy path', code: 'BASELINE', stopAt: 5, failingLayer: 'None',
    headline: 'All layers pass.',
    rootCause: 'No fault is injected. DNS resolution, socket setup, HTTP, service routing, and the downstream dependency all complete inside the release SLO.',
    remediation: ['No action required', 'Keep the baseline trace for comparison'], latency: '118ms', result: 'PASS',
  },
  dns: {
    label: 'DNS failure', code: 'NXDOMAIN', stopAt: 1, failingLayer: 'DNS',
    headline: 'DNS fails.',
    rootCause: 'The hostname fails before TCP can start, so downstream layers stay untested.',
    remediation: ['Verify the DNS record and search domain', 'Check CoreDNS health and upstream resolver access'], latency: '4ms', result: 'BLOCK',
  },
  tcp: {
    label: 'Closed port', code: 'ECONNREFUSED', stopAt: 2, failingLayer: 'TCP',
    headline: 'Port closed.',
    rootCause: 'The address resolves, but the port has no reachable listener before HTTP can begin.',
    remediation: ['Confirm the process is listening on the expected port', 'Inspect Service targetPort, firewall, and network policy rules'], latency: '11ms', result: 'BLOCK',
  },
  http: {
    label: 'HTTP failure', code: 'HTTP_503', stopAt: 3, failingLayer: 'HTTP',
    headline: 'HTTP 503.',
    rootCause: 'DNS and TCP pass, but the health endpoint fails before user traffic is safe.',
    remediation: ['Inspect application logs and readiness dependencies', 'Validate the health endpoint contract and timeout'], latency: '146ms', result: 'BLOCK',
  },
  binding: {
    label: 'Localhost binding', code: 'BIND_127_0_0_1', stopAt: 4, failingLayer: 'Service',
    headline: 'Localhost only.',
    rootCause: 'The service binds to 127.0.0.1, so local checks pass while network traffic cannot reach it.',
    remediation: ['Bind the service to 0.0.0.0 instead of localhost', 'Confirm containerPort and Service targetPort alignment'], latency: '23ms', result: 'BLOCK',
  },
  latency: {
    label: 'Latency spike', code: 'P95_BREACH', stopAt: 5, failingLayer: 'Service → Dependency',
    headline: 'P95 breach.',
    rootCause: 'Every layer returns success, but p95 latency crosses the release threshold.',
    remediation: ['Profile downstream latency and connection-pool saturation', 'Block rollout until p95 returns below the SLO'], latency: '850ms', result: 'DEGRADED',
  },
  dependency: {
    label: 'Dependency failure', code: 'UPSTREAM_TIMEOUT', stopAt: 5, failingLayer: 'Dependency',
    headline: 'Dependency timeout.',
    rootCause: 'Client-to-service networking succeeds; the downstream dependency times out.',
    remediation: ['Check dependency reachability, DNS, and credentials', 'Apply timeout budgets, circuit breaking, and fallback behavior'], latency: '2.4s', result: 'BLOCK',
  },
};

const diagnosticStages = ['Client', 'DNS', 'TCP', 'HTTP', 'Service', 'DB'];

function KubePulsePrintFallback({ mode, stageState }: { mode: DiagnosticMode; stageState: (index: number) => string }) {
  return (
    <div className="webgl-print-fallback" aria-hidden="true">
      <div className="fallback-path-line" />
      {diagnosticStages.map((stage, index) => {
        const state = stageState(index);
        return (
          <div className={`fallback-node fallback-${state}`} key={`${mode}-${stage}`}>
            <i>{String(index + 1).padStart(2, '0')}</i>
            <strong>{stage}</strong>
            <span>{state === 'passed' ? 'PASS' : state === 'waiting' ? 'NOT REACHED' : state === 'degraded' ? 'SLOW' : state === 'warning' ? 'LOCALHOST ONLY' : 'FAILED'}</span>
          </div>
        );
      })}
    </div>
  );
}

function KubePulse() {
  const [mode, setMode] = useState<DiagnosticMode>('binding');
  const [activeHop, setActiveHop] = useState(0);
  const reducedMotion = useReducedMotion();
  const config = diagnosticModes[mode];

  useEffect(() => {
    setActiveHop(0);
    if (reducedMotion) {
      setActiveHop(config.stopAt);
      return;
    }

    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      if (step > config.stopAt) {
        if (mode === 'healthy' || mode === 'latency') {
          step = 0;
          setActiveHop(0);
          return;
        }
        window.clearInterval(interval);
        return;
      }
      setActiveHop(step);
    }, mode === 'latency' ? 760 : 460);

    return () => window.clearInterval(interval);
  }, [config.stopAt, mode, reducedMotion]);

  const stageState = (index: number) => {
    if (index > activeHop) return 'waiting';
    if (mode === 'latency' && index >= 3) return 'degraded';
    if (index === config.stopAt && mode !== 'healthy' && mode !== 'latency') return mode === 'binding' ? 'warning' : 'failed';
    return 'passed';
  };

  return (
    <motion.section
      id="kubepulse"
      className={`project-section kube-section diagnostic-${config.result.toLowerCase()} print-project`}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.7 }}
    >
      <div className="project-heading light-heading">
        <div>
          <p className="eyebrow amber">Network production engineering · interactive diagnostic</p>
          <h2>KubePulse</h2>
        </div>
        <p>Fault → layer → fix.</p>
        <a href={links.kubepulse} target="_blank" rel="noreferrer">View GitHub ↗</a>
      </div>

      <div className="kube-diagnostic-shell">
        <aside className="failure-selector">
          <div className="panel-kicker"><i /> FAULT INJECTION</div>
          <h3>Pick fault.</h3>
          <p>Path reveals the break.</p>
          <div className="failure-buttons" aria-label="KubePulse failure scenarios">
            {(Object.keys(diagnosticModes) as DiagnosticMode[]).map((key, index) => (
              <motion.button
                type="button"
                key={key}
                className={mode === key ? 'selected' : ''}
                onClick={() => setMode(key)}
                aria-pressed={mode === key}
                whileHover={{ x: 4 }} whileTap={{ scale: 0.985 }}
              >
                <i>{String(index).padStart(2, '0')}</i>
                <span>{diagnosticModes[key].label}</span>
              </motion.button>
            ))}
          </div>
        </aside>

        <div className="diagnostic-visual">
          <div className="diagnostic-topbar">
            <div><span>LIVE PATH</span><b>Client → DNS → TCP → HTTP → Service → DB</b></div>
            <strong className={`result-${config.result.toLowerCase()}`}><i /> {config.result}</strong>
          </div>
          <div className="three-stage" role="img" aria-label={`KubePulse 3D diagnostic path showing ${config.label}`}>
            <div className="webgl-live"><KubePulseDiagnosticScene mode={mode} reducedMotion={Boolean(reducedMotion)} /></div>
            <KubePulsePrintFallback mode={mode} stageState={stageState} />
            <div className="scene-scanline" aria-hidden="true" />
          </div>
          <div className="diagnostic-stage-strip">
            {diagnosticStages.map((stage, index) => (
              <div className={`stage-chip stage-${stageState(index)}`} key={stage}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                <span>{stage}</span>
                <b>{stageState(index) === 'passed' ? '✓' : stageState(index) === 'waiting' ? '—' : stageState(index) === 'degraded' ? 'SLOW' : '×'}</b>
              </div>
            ))}
          </div>
        </div>

        <aside className="diagnostic-report compact-diagnostic-report">
          <AnimatePresence mode="wait">
            <motion.div className="diagnostic-summary" key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.24 }}>
              <div className="summary-pill layer-pill">
                <small>Layer</small>
                <b>{config.failingLayer}</b>
              </div>
              <div className="summary-pill signal-pill">
                <small>Signal</small>
                <b>{config.headline}</b>
              </div>
              <div className="summary-pill fix-pill">
                <small>{config.result === 'PASS' ? 'Proof' : 'Fix'}</small>
                <b>{config.result === 'PASS' ? 'Baseline saved' : config.remediation[0]}</b>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="diagnostic-metrics compact-diagnostic-metrics">
            <span><small>p95</small><b>{config.latency}</b></span>
            <span><small>Gate</small><b>{config.result}</b></span>
          </div>
        </aside>
      </div>

      <motion.div className={`release-verdict diagnostic-verdict verdict-${config.result.toLowerCase()}`} layout>
        <span>{config.result === 'PASS' ? 'PATH VERIFIED' : config.result === 'DEGRADED' ? 'ROLLOUT BLOCKED' : 'BROKEN LAYER FOUND'}</span>
        
      </motion.div>
    </motion.section>
  );
}

function FairEvalAndDetTrace() {
  const [groundedness, setGroundedness] = useState(82);
  const [servingRegression, setServingRegression] = useState(42);
  const [traceStep, setTraceStep] = useState(438);

  const gateDecision = useMemo(() => {
    if (servingRegression > 20) return 'BLOCK';
    if (groundedness < 85) return 'REVIEW';
    return 'PASS';
  }, [groundedness, servingRegression]);

  const diverged = traceStep >= 438;

  return (
    <motion.section className="depth-section section-pad print-project" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={reveal}>
      <div className="section-copy centered-copy">
        <p className="eyebrow">Depth proof · two live instruments</p>
        <h2>Evidence changes the decision.</h2>
      </div>

      <div className="depth-grid">
        <article className={`governance-console decision-${gateDecision.toLowerCase()}`}>
          <div className="instrument-head"><span>GOVERNANCE BOARD</span><a href={links.faireval} target="_blank" rel="noreferrer">FairEval ↗</a></div>
          <div className="gate-hero"><small>RELEASE DECISION</small><strong>{gateDecision}</strong><i /></div>
          <label>Groundedness score <b>{groundedness}%</b></label>
          <input aria-label="Groundedness score" type="range" min="55" max="100" value={groundedness} onChange={(event) => setGroundedness(Number(event.target.value))} />
          <label>Serving regression <b>+{servingRegression}%</b></label>
          <input aria-label="Serving regression" type="range" min="0" max="70" value={servingRegression} onChange={(event) => setServingRegression(Number(event.target.value))} />
          <div className="gate-checks">
            <span><i className="pass" />Quality <b>PASS</b></span>
            <span><i className="pass" />Safety <b>PASS</b></span>
            <span><i className={groundedness >= 85 ? 'pass' : 'review'} />Groundedness <b>{groundedness >= 85 ? 'PASS' : 'REVIEW'}</b></span>
            <span><i className={servingRegression <= 20 ? 'pass' : 'block'} />Serving <b>{servingRegression <= 20 ? 'PASS' : 'BLOCK'}</b></span>
          </div>
          <p>Quality gate, not guesswork.</p>
        </article>

        <article className="trace-console">
          <div className="instrument-head"><span>TRACE VIEWER</span><a href={links.dettrace} target="_blank" rel="noreferrer">DetTrace ↗</a></div>
          <div className="trace-status"><small>SCRUB TO INCIDENT</small><strong>{diverged ? 'DIVERGENCE' : 'MATCHING'}</strong><b>@ STEP {traceStep}</b></div>
          <input aria-label="Trace step" type="range" min="410" max="460" value={traceStep} onChange={(event) => setTraceStep(Number(event.target.value))} />
          <div className="trace-timeline">
            <div><span>expected</span>{[0,1,2,3,4,5,6].map((item) => <i key={item} />)}</div>
            <div><span>replayed</span>{[0,1,2,3,4,5,6].map((item) => <i className={diverged && item === 3 ? 'bad' : ''} key={item} />)}</div>
            <em style={{ left: `${Math.min(91, Math.max(12, ((traceStep - 410) / 50) * 79 + 12))}%` }} />
          </div>
          <div className={`trace-alert ${diverged ? 'show' : ''}`}>FIRST DIVERGENCE ISOLATED</div>
          <p>First divergence found.</p>
        </article>
      </div>
    </motion.section>
  );
}

function OpenSource() {
  const prs = [
    ['#2200', 'Workflow runtime reliability'],
    ['#2212', 'Workflow mock headers'],
    ['#2248', 'Poller instrumentation'],
    ['#2298', 'Async completion correctness'],
    ['#2367', 'Worker rate-limit caveat'],
  ];
  return (
    <motion.section id="oss" className="oss-section section-pad print-project" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={reveal}>
      <div className="oss-copy">
        <p className="eyebrow purple">Open source</p>
        <h2>Maintainers accepted the work.</h2>
        <p>Reviewed and merged outside my repositories.</p>
        <div><a href={links.temporal} target="_blank" rel="noreferrer">Temporal PRs ↗</a><a href={links.azure} target="_blank" rel="noreferrer">Azure SDK PR ↗</a></div>
      </div>
      <div className="pr-stack">
        {prs.map(([id, title], index) => <motion.a href={links.temporal} target="_blank" rel="noreferrer" className="pr-card" key={id} initial={{ opacity: 0, x: 38 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.65 }} transition={{ delay: index * 0.075, duration: 0.5 }} whileHover={{ x: 8 }}><span>{id}</span><strong>{title}</strong><b>Merged</b></motion.a>)}
        <motion.a href={links.azure} target="_blank" rel="noreferrer" className="pr-card azure-pr" initial={{ opacity: 0, x: 38 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.65 }} transition={{ delay: .42, duration: .5 }} whileHover={{ x: 8 }}><span>Azure SDK</span><strong>Retry policy error propagation</strong><b>Merged</b></motion.a>
      </div>
    </motion.section>
  );
}

function WritingContact() {
  return (
    <section id="contact" className="writing-section section-pad print-project">
      <div className="writing-head">
        <div><p className="eyebrow">Engineering writing</p><h2>Writing from real investigations.</h2></div>
        <p>Distributed systems. AI reliability. Production engineering.</p>
      </div>
      <div className="articles">
        <a href={links.writing1} target="_blank" rel="noreferrer"><span>Reliability</span><strong>Kubernetes Said Everything Was Healthy. It Wasn&apos;t.</strong><b>↗</b></a>
        <a href={links.writing2} target="_blank" rel="noreferrer"><span>Distributed Systems</span><strong>How I Built a Distributed Job Queue That Stays Correct Under Crashes.</strong><b>↗</b></a>
        <a href={links.writing3} target="_blank" rel="noreferrer"><span>AI Systems</span><strong>The Most Dangerous AI Failures Don&apos;t Crash. They Quietly Look Correct.</strong><b>↗</b></a>
      </div>
      <footer>
        <div className="footer-copy">
          <p className="eyebrow">Let&apos;s build the proof, not just the promise.</p>
          <h2>Looking for the next difficult system.</h2>
          <span>Backend · Platform · Reliability · AI Infrastructure</span>
        </div>
        <div className="footer-links"><a href={links.email}>Email ↗</a><a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
      </footer>
    </section>
  );
}

export default function Page() {
  return (
    <main>
      <nav className="nav">
        <a href="#top" className="brand">Kriti Behl <i /></a>
        <div><a href="#observatory">Lab</a><a href="#evidence">Evidence</a><a href="#agentgrid">AgentGrid</a><a href="#systems">Systems</a><a href="#oss">OSS</a><a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy reveal">
          <p className="eyebrow">Backend · Platform · AI Infrastructure</p>
          <h1>Complex systems rarely fail for obvious reasons.</h1>
          <p className="hero-sub">I build tools that make their behavior observable, measurable, and actionable.</p>
          <div className="hero-actions" aria-label="Primary portfolio actions">
            <a className="hero-primary" href="#observatory">Run a failure scenario <span>↓</span></a>
            <a className="hero-secondary" href="#kubepulse">Open KubePulse lab <span>↗</span></a>
            <a className="hero-text-link" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
          <div className="availability-line"><i /> Open to backend, platform, reliability, and production engineering roles</div>
          <OrgRail />
        </div>
        <div id="observatory" className="observatory-wrap reveal delay"><SystemObservatory /></div>
      </section>

      <EvidenceWall />
      <NarrativeRail />
      <AgentGrid />
      <Faultline />
      <KubePulse />
      <FairEvalAndDetTrace />
      <OpenSource />
      <WritingContact />
    </main>
  );
}
