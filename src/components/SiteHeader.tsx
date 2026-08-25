"use client";

import Link from "next/link";
import CalculatorsNavMenu from "@/components/CalculatorsNavMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

export default function SiteHeader() {
  const { theme } = useTheme();

  if (theme === "original") {
    return (
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-brand-700">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-600 text-white text-sm">₹</span>
            <span className="text-slate-900">FinPlan</span>
            <span className="text-brand-600 text-xs px-1.5 py-0.5 rounded bg-brand-50 border border-brand-100">India</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm text-slate-600">
            <Link href="/plan" className="hover:text-brand-700 transition">Planner</Link>
            <CalculatorsNavMenu />
            <Link href="/guides" className="hover:text-brand-700 transition">Guides</Link>
            <ThemeToggle />
            <Link href="/plan" className="btn-primary text-xs !py-1.5">Start planning →</Link>
          </nav>
          <Link href="/plan" className="sm:hidden btn-primary text-xs !py-1.5">Plan →</Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60"
      style={{ background: "rgba(17,24,39,0.96)", backdropFilter: "blur(20px)" }}>
      <div className="mx-auto max-w-6xl px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold shadow-lg"
            style={{ background: "var(--t-logo-gradient)" }}>
            ₹
          </span>
          <span className="font-bold text-white tracking-tight text-[15px]">FinPlan</span>
          <span className="text-[11px] font-semibold text-brand-300 px-1.5 py-0.5 rounded-md border border-brand-800/50 bg-brand-950/40">
            India
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/plan"
            className="text-slate-300 hover:text-white transition font-medium">
            Planner
          </Link>
          <CalculatorsNavMenu />
          <Link href="/guides"
            className="text-slate-300 hover:text-white transition font-medium">
            Guides
          </Link>
          <ThemeToggle />
          <Link href="/plan"
            className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:-translate-y-px"
            style={{ background: "var(--t-btn-bg)", boxShadow: "0 2px 8px var(--t-header-cta-shadow)" }}>
            Start free →
          </Link>
        </nav>

        {/* Mobile CTA */}
        <Link href="/plan"
          className="sm:hidden inline-flex items-center text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: "var(--t-btn-bg)" }}>
          Plan →
        </Link>
      </div>
    </header>
  );
}
