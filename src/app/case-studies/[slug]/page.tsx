import { notFound } from "next/navigation";

const DATA: Record<string, any> = {
  faultline: {
    title: "Faultline", subtitle: "Distributed correctness under worker crashes and stale writes", decision: "PASS",
    problem: "A worker can lose ownership, recover, and retry a stale write after a newer lease holder has already committed the job.",
    incident: ["Worker A owns token 41", "Lease transfers to Worker B with token 42", "Worker A retries commit", "Storage rejects token 41"],
    evidence: ["0.0% duplicate commits", "1,500+ injected failures", "37 duplicate writes rejected"],
    learned: "Correctness has to be enforced at the storage boundary. Application-layer checks are not enough under concurrent retries.",
    github: "https://github.com/kritibehl/faultline"
  },
  kubepulse: {
    title: "KubePulse", subtitle: "Release safety for systems that look healthy but are not", decision: "BLOCK",
    problem: "A rollout can pass readiness checks while user-visible latency regresses sharply enough to create an outage.",
    incident: ["Readiness probe stays green", "p95 latency rises +608%", "SLO breach detected", "Rollout blocked before traffic shift"],
    evidence: ["+608% p95 regression blocked", "safe_to_operate=false", "0 false-safe decisions"],
    learned: "Probe health is not user health. Release safety needs explicit SLO and latency contracts.",
    github: "https://github.com/kritibehl/kubepulse"
  },
  agentgrid: {
    title: "AgentGrid", subtitle: "Agent observability for RAG and tool-calling workflows", decision: "HOLD",
    problem: "Agents can produce plausible answers while retrieval confidence or tool reliability has already dropped below a safe threshold.",
    incident: ["Question enters workflow", "Retrieval score reaches 0.80", "Tool p95 reaches 880ms", "Run routed to human review"],
    evidence: ["56 tests passing", "0.80 retrieval hit rate", "880ms p95 latency"],
    learned: "Human review is not a failure. It is a valid release decision when confidence is insufficient.",
    github: "https://github.com/kritibehl/agentgrid-demo"
  },
  faireval: {
    title: "FairEval", subtitle: "AI evaluation and release governance", decision: "BLOCK",
    problem: "Aggregate quality can improve while groundedness or serving behavior degrades enough to make a model unsafe to release.",
    incident: ["Quality gate passes", "Groundedness gate fails", "Serving gate fails", "Release denied"],
    evidence: ["p=0.0 release signal", "40% gate pass rate", "Zenodo artifact published"],
    learned: "Evaluation gates should be independent. One failed gate should be enough to block a model release.",
    github: "https://github.com/kritibehl/FairEval-Suite"
  },
  dettrace: {
    title: "DetTrace", subtitle: "Replay diagnostics for first divergence before visible failure", decision: "INVESTIGATE",
    problem: "Concurrency failures often disappear when instrumented. The useful clue is the first divergence, not the final crash.",
    incident: ["Trace A and Trace B begin aligned", "Replay advances deterministically", "Paths diverge at step 438", "Root cause investigation starts there"],
    evidence: ["step 438 first divergence", "10,000+ trace validations", "1.0 incident confidence"],
    learned: "Debugging improves when the system records enough structure to replay the failure instead of guessing from logs.",
    github: "https://github.com/kritibehl/dettrace"
  },
};

export function generateStaticParams() { return Object.keys(DATA).map(slug => ({ slug })); }

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const d = DATA[params.slug];
  if (!d) notFound();
  return (
    <main style={{background:"#fbfaf8", color:"#111827", minHeight:"100vh", fontFamily:"Inter, sans-serif", padding:"96px 0"}}>
      <div style={{width:"min(100% - 44px, 880px)", marginInline:"auto"}}>
        <a href="/#work" style={{font:"700 13px JetBrains Mono, monospace", color:"#667085"}}>← Back to work</a>
        <p style={{font:"800 12px JetBrains Mono, monospace", letterSpacing:".12em", textTransform:"uppercase", color:"#2563eb", marginTop:56}}>Case study</p>
        <h1 style={{font:"800 clamp(44px, 8vw, 90px) Geist, Inter, sans-serif", letterSpacing:"-.06em", lineHeight:1, margin:"18px 0"}}>{d.title}</h1>
        <p style={{fontSize:20, color:"#475467", lineHeight:1.65, marginBottom:42}}>{d.subtitle}</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:52}}>{d.evidence.map((e:string)=><div key={e} style={{background:"white", border:"1px solid #e6e0d8", borderRadius:20, padding:22, boxShadow:"0 12px 40px rgba(17,24,39,.05)", font:"800 16px JetBrains Mono, monospace"}}>{e}</div>)}</div>
        {[
          ["Problem", d.problem],
          ["Incident replay", d.incident.join(" → ")],
          ["Decision", `${d.decision} — unsafe behavior was surfaced before release.`],
          ["What I learned", d.learned],
        ].map(([h,b]) => <section key={h} style={{padding:"34px 0", borderTop:"1px solid #e6e0d8"}}><h2 style={{font:"800 24px Geist, Inter, sans-serif", letterSpacing:"-.03em"}}>{h}</h2><p style={{fontSize:17, lineHeight:1.85, color:"#475467"}}>{b}</p></section>)}
        <a href={d.github} style={{display:"inline-flex", marginTop:32, height:46, alignItems:"center", padding:"0 20px", background:"#111827", color:"white", borderRadius:999, fontWeight:800}}>View GitHub ↗</a>
      </div>
    </main>
  );
}
