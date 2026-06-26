# Kriti Behl — Engineering Investigations (20/10 edition)

An interactive engineering portfolio focused on backend systems, platform reliability, AI infrastructure, incident forensics, and maintainer-reviewed open-source work.

## Highlights

- Interactive System Failure Observatory
- AgentGrid evidence-routing lab
- Faultline lease-race replay
- KubePulse React Three Fiber network diagnostic
- FairEval release governance controls
- DetTrace divergence scrubber
- Print/PDF-safe static WebGL fallback
- Stable print counters and reduced-motion support
- Responsive desktop, tablet, and mobile layouts

## Requirements

- Node.js 22 (`.nvmrc` is included)
- npm

## Run locally

```bash
nvm use
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Exporting a PDF

Use the browser print dialog in landscape mode. Print styles automatically:

- render final metric values rather than mid-animation values,
- replace the WebGL scene with a deterministic network diagram,
- remove sticky navigation and animation transforms,
- tighten section spacing and prevent oversized blank pages.
