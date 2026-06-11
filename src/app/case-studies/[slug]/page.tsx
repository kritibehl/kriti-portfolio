import { notFound } from "next/navigation";

type CaseStudy = {
  title: string;
  github: string;
  summary: string;
  incident: string;
  intervention: string;
  outcome: string[];
  learned: string[];
};

const cases: Record<string, CaseStudy> = {
  faultline: {
    title: "Faultline",
    github: "https://github.com/kritibehl/faultline",
    summary: "Distributed correctness under stale writes and worker lease takeover.",
    incident: "A worker loses ownership, retries a late commit, and risks duplicating work after a newer lease holder has already completed the job.",
    intervention: "Faultline enforces fencing-token validation at the storage boundary, so stale owners can retry but cannot commit.",
    outcome: ["0.0% duplicate commits", "1,500+ injected failures", "37 stale writes rejected"],
    learned: ["Correctness must be enforced at the boundary where data is committed.", "Fault injection reveals failure modes that unit tests miss.", "A clear reject/accept decision is more useful than another alert."],
  },
  kubepulse: {
    title: "KubePulse",
    github: "https://github.com/kritibehl/kubepulse",
    summary: "Release-safety gate for systems that look healthy while users experience degradation.",
    incident: "Readiness probes stay green while p95 latency and SLO drift indicate that real users are already seeing a degraded rollout.",
    intervention: "KubePulse compares probe health against user-visible health, dependency risk, and rollback thresholds before traffic shifts.",
    outcome: ["+608% p95 regression blocked", "safe_to_operate=false", "0 false-safe decisions"],
    learned: ["Probe health is not user health.", "Release decisions need latency and dependency evidence.", "The safest release gate blocks before users complain."],
  },
  agentgrid: {
    title: "AgentGrid",
    github: "https://github.com/kritibehl/agentgrid-demo",
    summary: "Agent workflow observability for RAG and tool-calling systems.",
    incident: "A request flows through retrieval, tools, and evaluation while confidence decays below the threshold for automatic approval.",
    intervention: "AgentGrid traces each step and routes low-confidence runs to review instead of silently approving them.",
    outcome: ["56 tests passing", "0.80 retrieval hit rate", "880ms p95 latency"],
    learned: ["Agent reliability requires trace-level evidence.", "Human review is a valid system output.", "Retrieval quality is a production reliability metric."],
  },
  faireval: {
    title: "FairEval",
    github: "https://github.com/kritibehl/FairEval-Suite",
    summary: "AI release governance for silent model regressions.",
    incident: "A candidate model can improve aggregate quality while groundedness or serving performance silently regresses.",
    intervention: "FairEval evaluates each release gate independently and denies release when any critical gate fails.",
    outcome: ["p=0.0 release signal", "40% gate pass rate → BLOCK", "Zenodo artifact published"],
    learned: ["Averages hide gate-level failures.", "Release approval should behave like governance, not a leaderboard.", "Published evaluation artifacts create stronger proof than screenshots."],
  },
  dettrace: {
    title: "DetTrace",
    github: "https://github.com/kritibehl/dettrace",
    summary: "Deterministic replay for hidden execution divergence.",
    incident: "A bug cannot be reproduced by inspection because both executions look identical until one trace fractures.",
    intervention: "DetTrace replays and compares traces until the exact divergence point becomes visible.",
    outcome: ["idx 3 first divergence", "10,000+ trace validations", "1.0 incident confidence"],
    learned: ["Replay turns debugging from guessing into evidence.", "The first divergence is often more important than the final crash.", "A small visual trace can explain a complex bug faster than a long report."],
  },
};

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = cases[params.slug];
  if (!c) notFound();

  return (
    <main style={{ background: "#f7f4ef", minHeight: "100vh", color: "#101218", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "min(100% - 40px, 860px)", margin: "0 auto", padding: "88px 0" }}>
        <a href="/#projects" style={{ textDecoration: "none", color: "#626875", fontWeight: 800 }}>← Back to portfolio</a>
        <p style={{ marginTop: 56, font: "800 11px/1 JetBrains Mono, monospace", letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb" }}>Case study</p>
        <h1 style={{ fontFamily: "Geist, Inter, sans-serif", fontSize: "clamp(48px, 8vw, 96px)", letterSpacing: "-.08em", lineHeight: ".9", margin: "18px 0" }}>{c.title}</h1>
        <p style={{ color: "#626875", fontSize: 20, lineHeight: 1.6 }}>{c.summary}</p>

        <div style={{ display: "grid", gap: 18, marginTop: 44 }}>
          {[['Incident', c.incident], ['Intervention', c.intervention]].map(([title, body]) => (
            <section key={title} style={{ background: "#fffdfa", border: "1px solid rgba(16,18,24,.10)", borderRadius: 28, padding: 28 }}>
              <h2 style={{ fontFamily: "Geist, Inter, sans-serif", letterSpacing: "-.04em", marginBottom: 10 }}>{title}</h2>
              <p style={{ color: "#374151", lineHeight: 1.7 }}>{body}</p>
            </section>
          ))}
        </div>

        <section style={{ marginTop: 18, background: "#080a10", color: "white", borderRadius: 28, padding: 28 }}>
          <h2 style={{ fontFamily: "Geist, Inter, sans-serif", letterSpacing: "-.04em", marginBottom: 18 }}>Outcome</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {c.outcome.map((o) => <span key={o} style={{ border: "1px solid rgba(255,255,255,.16)", borderRadius: 999, padding: "10px 14px", font: "800 12px/1 JetBrains Mono, monospace" }}>{o}</span>)}
          </div>
        </section>

        <section style={{ marginTop: 18, background: "#fffdfa", border: "1px solid rgba(16,18,24,.10)", borderRadius: 28, padding: 28 }}>
          <h2 style={{ fontFamily: "Geist, Inter, sans-serif", letterSpacing: "-.04em", marginBottom: 18 }}>What I learned</h2>
          <ol style={{ display: "grid", gap: 12, paddingLeft: 20, color: "#374151", lineHeight: 1.7 }}>
            {c.learned.map((l) => <li key={l}>{l}</li>)}
          </ol>
        </section>

        <a href={c.github} target="_blank" rel="noreferrer" style={{ marginTop: 28, display: "inline-flex", minHeight: 46, alignItems: "center", padding: "0 22px", borderRadius: 999, background: "#101218", color: "white", textDecoration: "none", fontWeight: 850 }}>View GitHub ↗</a>
      </div>
    </main>
  );
}
