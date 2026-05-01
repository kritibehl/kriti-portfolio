import type { Metadata } from "next";
import { Sora, DM_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kriti-portfolio-six.vercel.app"),
  title: "Kriti Behl — Backend, Distributed Systems & Reliability",
  description:
    "New-grad software engineer building backend and distributed systems that stay correct under failure. Production backend experience at Thales Group, merged Temporal Go SDK fixes, and proof-heavy systems work across reliability, correctness, and release safety.",
  openGraph: {
    title: "Kriti Behl — Backend, Distributed Systems & Reliability",
    description:
      "New-grad software engineer building backend and distributed systems that stay correct under failure.",
    url: "https://kriti-portfolio-six.vercel.app",
    siteName: "Kriti Behl Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kriti Behl — Backend, Distributed Systems & Reliability",
    description:
      "New-grad software engineer building backend and distributed systems that stay correct under failure.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmMono.variable}`}>{children}</body>
    </html>
  );
}