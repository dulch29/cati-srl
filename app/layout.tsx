import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cati SRL | AI Self-Regulated Learning Companion",
  description:
    "Turn daily study reflections into personalized, adaptive learning actions, calibrated metacognitive insights, and personal knowledge graphs.",
};

import { PageTransitionLoader } from "@/components/ui/page-transition-loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
        <PageTransitionLoader />
        {children}
      </body>
    </html>
  );
}
