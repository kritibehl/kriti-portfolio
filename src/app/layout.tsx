import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kriti Behl | Backend, Platform & Reliability Engineer",
  description:
    "Backend, platform, and reliability engineer building systems that reveal hidden failures before production does.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
