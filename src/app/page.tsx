const projects = [
  {
    id: "faultline",
    name: "Faultline",
    theme: "Stale write replay",
    intro: "A worker loses ownership, retries anyway, and attempts to corrupt committed state. Faultline makes the invisible race visible and rejects it at the storage boundary.",
    proof: [["0.0%", "duplicate commits"], ["1,500+", "injected failures"], ["37", "duplicate writes rejected"]],
    href: "/case-studies/faultline",
    github: "https://github.com/kritibehl/faultline",
    visual: "faultline",
  },
  {
    id: "kubepulse",
    name: "KubePulse",
    theme: "Healthy rollout, broken users",
    intro: "The deployment is green. The users are not. KubePulse compares probe health against latency, SLO drift, and rollout risk before traffic shifts.",
    proof: [["+608%", "p95 regression blocked"], ["false", "safe_to_operate"], ["0", "false-safe decisions"]],
    href: "/case-studies/kubepulse",
    github: "https://github.com/kritibehl/kubepulse",
    visual: "kubepulse",
  },
  {
    id: "agentgrid",
    name: "AgentGrid",
    theme: "Agent flight recorder",
    intro: "A question enters the agent. Retrieval confidence drops, the tool path slows, and the workflow is routed to review before a bad response is approved.",
    proof: [["0.80", "retrieval hit rate"], ["880ms", "p95 latency"], ["56", "tests passing"]],
    href: "/case-studies/agentgrid",
    github: "https://github.com/kritibehl/agentgrid-demo",
    visual: "agentgrid",
  },
  {
    id: "faireval",
    name: "FairEval",
    theme: "Release approval denied",
    intro: "A model can look better on aggregate quality while failing groundedness or serving gates. FairEval makes every gate visible and blocks unsafe releases.",
    proof: [["p=0.0", "release signal"], ["40%", "gate pass rate"], ["BLOCK", "decision"]],
    href: "/case-studies/faireval",
    github: "https://github.com/kritibehl/FairEval-Suite",
    visual: "faireval",
  },
  {
    id: "dettrace",
    name: "DetTrace",
    theme: "Divergence playback",
    intro: "A bug refuses to reproduce. DetTrace replays two executions until the exact divergence step becomes visible.",
    proof: [["step 438", "divergence"], ["10k+", "trace validations"], ["1.0", "confidence"]],
    href: "/case-studies/dettrace",
    github: "https://github.com/kritibehl/dettrace",
    visual: "dettrace",
  },
];

const replay = [
  ["00:00", "Everything looks healthy.", "baseline"],
  ["00:12", "Latency starts drifting, but readiness still passes.", "KubePulse"],
  ["00:31", "An agent returns plausible output with weak retrieval.", "AgentGrid"],
  ["00:48", "Model quality passes while groundedness fails.", "FairEval"],
  ["01:06", "A stale worker retries a write after lease transfer.", "Faultline"],
  ["01:19", "Trace divergence becomes reproducible.", "DetTrace"],
  ["01:30", "Unsafe release blocked before production impact.", "outcome"],
];

function Cred({ mark, label, className }: { mark: string; label: string; className: string }) {
  return <span className="cred"><span className={`mark ${className}`}>{mark}</span>{label}</span>;
}

function HeroVisual() {
  return (
    <div className="incident-stage" aria-label="Invisible failure signals becoming visible">
      <div className="hero-caption">
        <strong>Invisible failures become visible.</strong>
        <p>Signals emerge from noise, converge into diagnosis, and leave as release decisions.</p>
      </div>
      <div className="signal s1"><span>stale write</span></div>
      <div className="signal s2"><span>latency drift</span></div>
      <div className="signal s3"><span>model degradation</span></div>
      <div className="signal s4"><span>weak retrieval</span></div>
      <div className="signal s5"><span>trace divergence</span></div>
      <div className="anomaly"><div className="anomaly-label">UNKNOWN<br/>FAILURE</div></div>
      <div className="decision-cloud">
        <span className="decision">PASS</span><span className="decision">BLOCK</span><span className="decision">HOLD</span><span className="decision">TRACE</span>
      </div>
    </div>
  );
}

function Artifact({ type }: { type: string }) {
  if (type === "faultline") return <div className="artifact"><div className="commit-world"><div className="worker wa"><strong>Worker A</strong><span>token 41 · stale</span></div><div className="worker wb"><strong>Worker B</strong><span>token 42 · owner</span></div><div className="db">COMMIT<br/>GATE</div><div className="lane red"/><div className="lane green"/><div className="reject">REJECTED</div><div className="accept">ACCEPTED</div></div></div>;
  if (type === "kubepulse") return <div className="artifact"><div className="rollout"><div className="cluster"><div className="svc">Service A ✓</div><div className="svc">Service B ✓</div><div className="svc">Service C ✓</div></div><div className="users">{Array.from({length:14}).map((_,i)=><span key={i} className="person"/> )}</div><div className="bars"><div className="barrow"><span>Readiness</span><div className="barbg"><div className="barfill good"/></div><b>PASS</b></div><div className="barrow"><span>Latency</span><div className="barbg"><div className="barfill bad"/></div><b>+608%</b></div><div className="barrow"><span>SLO</span><div className="barbg"><div className="barfill warn"/></div><b>BREACH</b></div></div><div className="block-stamp">RELEASE BLOCKED</div></div></div>;
  if (type === "agentgrid") return <div className="artifact"><div className="trace"><div className="question">User asks a question. The answer looks plausible.</div><div className="nodes"><div className="node"><i>R</i><strong>Retrieve context</strong><span className="score">0.80</span></div><div className="node"><i>T</i><strong>Tool call</strong><span className="score">880ms</span></div><div className="node"><i>E</i><strong>Evaluate confidence</strong><span className="score">low</span></div><div className="node"><i>H</i><strong>Route to human review</strong><span className="score">HOLD</span></div></div><div className="hold">UNSAFE AUTO-APPROVAL AVOIDED</div></div></div>;
  if (type === "faireval") return <div className="artifact"><div className="board"><div className="gate"><strong>Quality</strong><span className="badge pass">PASS</span></div><div className="gate"><strong>Groundedness</strong><span className="badge fail">FAIL</span></div><div className="gate"><strong>Safety</strong><span className="badge pass">PASS</span></div><div className="gate"><strong>Serving</strong><span className="badge fail">FAIL</span></div><div className="denied">RELEASE DENIED</div></div></div>;
  return <div className="artifact"><div className="dettrace"><div className="trace-line"><span>Trace A</span><div className="track"/></div><div className="trace-line"><span>Trace B</span><div className="track"><span className="xmark">×</span></div></div><div className="freeze">DIVERGENCE FOUND · STEP 438</div></div></div>;
}

export default function Page() {
  return (
    <main>
      <nav className="nav"><div className="nav-inner"><a className="brand" href="#">Kriti Behl</a><div className="nav-links"><a href="#replay">Replay</a><a href="#work">Work</a><a href="#oss">Open Source</a><a href="#experience">Experience</a><a href="#writing">Writing</a></div></div></nav>
      <section className="hero">
        <div className="wide hero-grid">
          <div>
            <div className="kicker">Backend · Platform · Reliability</div>
            <h1>Systems that stay correct when everything fails.</h1>
            <p className="hero-copy">I build distributed systems, release gates, agent observability, and AI evaluation tooling that reveal hidden failures before production does.</p>
            <div className="cred-row"><Cred mark="T" className="temporal" label="Temporal Go SDK · 4 merged PRs"/><Cred mark="AZ" className="azure" label="Azure SDK · 1 merged · 1 open"/><Cred mark="M" className="meta" label="Meta PE Fellow"/><Cred mark="UF" className="uf" label="MS CS @ UF"/></div>
            <div className="hero-actions"><a className="btn primary" href="#work">View visual exhibits</a><a className="btn" href="https://github.com/kritibehl">GitHub ↗</a><a className="btn" href="https://linkedin.com/in/kritibehl">LinkedIn ↗</a></div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="section tight" id="replay">
        <div className="container">
          <div className="kicker">Incident replay</div>
          <h2 className="section-title">One incident. Five interventions.</h2>
          <p className="section-sub">The portfolio reads as a single failure becoming observable: weak signals appear, systems investigate, and the unsafe decision is stopped.</p>
          <div className="replay">
            {replay.map(([time,event,system]) => <div className="replay-step" key={time}><div className="step-time">{time}</div><div className="step-event">{event}</div><div className="step-system">{system}</div></div>)}
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="wide">
          <div className="container" style={{marginInline:0}}>
            <div className="kicker">Visual exhibits</div>
            <h2 className="section-title">The work, shown before it is explained.</h2>
            <p className="section-sub">Each exhibit starts with the failure scene, then shows the intervention, evidence, and repo.</p>
          </div>
          <div className="exhibits">
            {projects.map((p) => (
              <article className="exhibit" key={p.id}>
                <Artifact type={p.visual}/>
                <div className="exhibit-copy">
                  <div className="label">{p.theme}</div>
                  <h3>{p.name}</h3>
                  <p>{p.intro}</p>
                  <div className="evidence">{p.proof.map(([a,b]) => <div key={a+b}><strong>{a}</strong><span>{b}</span></div>)}</div>
                  <div className="link-row"><a className="btn primary" href={p.href}>Case Study</a><a className="btn" href={p.github}>GitHub ↗</a></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-band" id="oss">
        <div className="container">
          <div className="kicker">External validation</div>
          <h2 className="section-title">Production code accepted.</h2>
          <p className="section-sub">Maintainer-reviewed contributions to production workflow runtime and cloud SDK code paths.</p>
          <div className="oss-grid">
            <div className="oss-card"><h3>Temporal Go SDK</h3><p>4 merged PRs across correctness, workflow testing, goroutine safety, and task poller behavior.</p><div className="pr"><span>#2298</span>ready future chaining correctness</div><div className="pr"><span>#2248</span>scalable task poller assignment</div><div className="pr"><span>#2212</span>workflow mock header propagation</div><div className="pr"><span>#2200</span>child workflow goroutine leak fix</div></div>
            <div className="oss-card"><h3>Azure SDK for Go</h3><p>1 merged PR and 1 open PR focused on HTTP runtime error surfacing and trace propagation.</p><div className="pr"><span>#26051</span>merged · request-body close errors in retry policy</div><div className="pr"><span>#26106</span>open · W3C trace context propagation</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="experience"><div className="container"><div className="kicker">Experience</div><h2 className="section-title">Where the systems lens comes from.</h2><div className="experience">
        {[
          ["VLink","Software Developer · May 2026 – Present","Building LangGraph/LangChain RAG orchestration workflows, retrieval-quality evaluation, trace behavior analysis, and review routing for low-confidence agent runs.",["LangGraph","LangChain","RAG","Agent Evaluation"]],
          ["Meta × MLH","Production Engineering Fellow · Jun 2026 – Sep 2026","Selected for production engineering training focused on Linux systems, reliability, operational debugging, and infrastructure fundamentals.",["Linux","Reliability","Infrastructure"]],
          ["Thales","Software Engineering Intern · May 2025 – Aug 2025","Processed 100k+ HSM state-transition records per run and built backend analytics for utilization, queue depth, recovery states, and service-health metrics.",["Python","HSM Analytics","Diagnostics"]],
          ["University of Florida","Graduate Assistant · Jan 2025 – Dec 2025","Supported operational workflows serving 600–800 weekly users and coordinated scheduling, issue resolution, and service continuity.",["Operations","Service Continuity"]],
        ].map(([company,role,body,tags]: any) => <div className="exp" key={company}><div><h3>{company}</h3><p>{role}</p></div><div><p>{body}</p><div className="tags">{tags.map((t:string)=><span className="tag" key={t}>{t}</span>)}</div></div></div>)}
      </div></div></section>

      <section className="section tight" id="writing"><div className="container"><div className="kicker">Writing</div><h2 className="section-title">Notes on systems, failure, and tradeoffs.</h2><div className="writing">
        {[
          ["Distributed Systems","How I Built a Distributed Job Queue That Stays Correct Under Crashes, Races, and Network Faults","Fencing tokens, idempotency keys, and injected failures — what it takes to reach 0.0% duplicate commits.","https://medium.com/@kriti0608/how-i-built-a-distributed-job-queue-that-stays-correct-under-crashes-races-and-network-faults-48bc50eec723"],
          ["Release Safety","Kubernetes Said Everything Was Healthy. It Wasn't.","How readiness probes can lie, and how release gates catch latency regressions probes miss.","https://medium.com/@kriti0608/kubernetes-said-everything-was-healthy-it-wasnt-27f7b4b9ed0e"],
          ["AI Infrastructure","The Most Dangerous AI Failures Don't Crash — They Quietly Look Correct","Why evaluation drift, silent quality degradation, and misleading pass rates are hard failures to catch.","https://medium.com/@kriti0608/the-most-dangerous-ai-failures-dont-crash-they-quietly-look-correct-a404e343395a"],
        ].map(([topic,title,body,href]) => <a className="article" href={href} key={title}><div className="label">{topic}</div><h3>{title}</h3><p>{body}</p></a>)}
      </div></div></section>

      <section className="section tight"><div className="container"><div className="contact"><h2>Let’s build systems that reveal hidden failures.</h2><p>Open to backend, platform, reliability, production engineering, and infrastructure roles.</p><div className="hero-actions" style={{justifyContent:"center", marginTop:28}}><a className="btn" href="mailto:kriti.behl@ufl.edu">Email</a><a className="btn" href="https://github.com/kritibehl">GitHub ↗</a><a className="btn" href="https://linkedin.com/in/kritibehl">LinkedIn ↗</a></div></div></div></section>
    </main>
  );
}
