import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kriti Behl | Backend, Platform & Reliability Engineer",
  description:
    "Making invisible failures visible. Backend, platform, and reliability engineering portfolio by Kriti Behl.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
