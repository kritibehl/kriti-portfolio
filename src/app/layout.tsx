import type { Metadata } from "next";
import { Sora, DM_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Kriti Behl — Backend, Distributed Systems & Reliability",
  description: "New-grad software engineer focused on backend infrastructure, distributed systems and reliability.",
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
