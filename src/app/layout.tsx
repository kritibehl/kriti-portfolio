import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* -----------------------------
   Fonts (Premium, FAANG-safe)
------------------------------ */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* -----------------------------
   Metadata (Recruiter-facing)
------------------------------ */
export const metadata: Metadata = {
  title: {
    default: "Kriti Behl — Systems, Reliability & AI Engineering",
    template: "%s · Kriti Behl",
  },
  description:
    "Systems engineer focused on correctness under failure — spanning execution, infrastructure reliability, and GenAI evaluation. I build systems that are observable, reproducible, and debuggable by design.",
  keywords: [
    "Distributed Systems",
    "Reliability Engineering",
    "Backend Engineering",
    "Execution Determinism",
    "Invariant Verification",
    "GenAI Evaluation",
    "AI Safety",
    "C++",
    "FastAPI",
    "Kubernetes",
    "Prometheus",
  ],
  authors: [{ name: "Kriti Behl" }],
  creator: "Kriti Behl",
  openGraph: {
    title: "Kriti Behl — Systems, Reliability & AI Engineering",
    description:
      "I build systems that stay correct under failure — across execution, infrastructure, and AI.",
    url: "https://kriti-portfolio.vercel.app",
    siteName: "Kriti Behl Portfolio",
    images: [
      {
        url: "/og.png", // optional later
        width: 1200,
        height: 630,
        alt: "Kriti Behl — Systems & Reliability Engineering",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kriti Behl — Systems, Reliability & AI Engineering",
    description:
      "Correctness under failure. Execution, infrastructure, and GenAI systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* -----------------------------
   Root Layout
------------------------------ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-sky-500/30 selection:text-slate-50">
        {/* Global background layer (subtle depth) */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-950 to-black" />

        {/* App content */}
        {children}
      </body>
    </html>
  );
}
