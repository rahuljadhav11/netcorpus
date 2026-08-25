"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme";

export default function Shell({
  inputs,
  result,
}: {
  inputs: ReactNode;
  result: ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-6">
      <div className={`card min-w-0 ${theme === "original" ? "p-4" : "p-5"}`}>{inputs}</div>
      <div className="min-w-0 space-y-4">{result}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <div className={`last:mb-0 ${theme === "original" ? "mb-3" : "mb-3.5"}`}>
      <label className="label">{label}</label>
      {children}
      {hint && <p className={`text-[10px] text-slate-400 mt-1 ${theme === "original" ? "" : "leading-relaxed"}`}>{hint}</p>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  tone,
  big,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "primary" | "good" | "bad" | "neutral";
  big?: boolean;
}) {
  const { theme } = useTheme();

  if (theme === "original") {
    const toneCls =
      tone === "primary"
        ? "bg-gradient-to-br from-brand-50 via-white to-brand-50 border-brand-200"
        : tone === "good"
          ? "bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-emerald-200"
          : tone === "bad"
            ? "bg-gradient-to-br from-rose-50 via-white to-rose-50 border-rose-200"
            : "bg-white border-slate-200";
    const valueCls =
      tone === "primary"
        ? "text-brand-800"
        : tone === "good"
          ? "text-emerald-700"
          : tone === "bad"
            ? "text-rose-700"
            : "text-slate-900";
    return (
      <div className={`rounded-xl border ${toneCls} p-4 shadow-sm`}>
        <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">{label}</div>
        <div className={`${big ? "text-3xl md:text-4xl" : "text-2xl"} font-semibold mt-1 tabular-nums ${valueCls}`}>
          {value}
        </div>
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      </div>
    );
  }

  const styles: Record<string, { border: string; bg: string; valueColor: string; accent: string }> = {
    primary: {
      border: "border-brand-200",
      bg:     "from-brand-50/80 to-white",
      valueColor: "text-brand-700",
      accent: "bg-brand-500",
    },
    good: {
      border: "border-emerald-200",
      bg:     "from-emerald-50/80 to-white",
      valueColor: "text-emerald-700",
      accent: "bg-emerald-500",
    },
    bad: {
      border: "border-rose-200",
      bg:     "from-rose-50/80 to-white",
      valueColor: "text-rose-700",
      accent: "bg-rose-500",
    },
    neutral: {
      border: "border-slate-200",
      bg:     "from-slate-50/60 to-white",
      valueColor: "text-slate-900",
      accent: "bg-slate-400",
    },
  };
  const s = styles[tone ?? "neutral"];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} p-5`}
      style={{ boxShadow: "0 2px 16px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.04)" }}>
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.accent} opacity-80`} />

      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
      <div className={`${big ? "text-3xl md:text-4xl" : "text-2xl"} font-bold mt-2 tabular-nums ${s.valueColor} leading-none`}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-2 font-medium">{sub}</div>}
    </div>
  );
}

export function ResultRow({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad" | "muted";
  bold?: boolean;
}) {
  const { theme } = useTheme();

  if (theme === "original") {
    const cls =
      tone === "good"
        ? "text-emerald-700"
        : tone === "bad"
          ? "text-rose-700"
          : tone === "muted"
            ? "text-slate-500"
            : "text-slate-900";
    return (
      <div className={`flex items-baseline justify-between py-1.5 ${bold ? "font-semibold" : ""}`}>
        <span className={tone === "muted" ? "text-slate-500 text-sm" : "text-slate-700 text-sm"}>{label}</span>
        <span className={`tabular-nums ${cls}`}>{value}</span>
      </div>
    );
  }

  const cls =
    tone === "good"  ? "text-emerald-700 font-semibold" :
    tone === "bad"   ? "text-rose-700 font-semibold" :
    tone === "muted" ? "text-slate-400" :
    "text-slate-800";
  return (
    <div className={`flex items-baseline justify-between py-1.5 ${bold ? "font-bold border-t border-slate-100 mt-1 pt-2.5" : ""}`}>
      <span className={`text-sm ${tone === "muted" ? "text-slate-400" : "text-slate-600"}`}>{label}</span>
      <span className={`tabular-nums text-sm ${cls}`}>{value}</span>
    </div>
  );
}

export function CalculatorFooter({ slug }: { slug: string }) {
  const { theme } = useTheme();

  if (theme === "original") {
    return (
      <div className="card p-4 bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <div className="font-semibold text-slate-900">Want the full picture?</div>
            <p className="text-xs text-slate-600 mt-1">
              The main FinPlan India planner rolls this calculation into a 50-year retirement plan alongside your loans, EPF, taxes, trips, and life goals.
            </p>
          </div>
          <Link href="/plan" className="btn-primary text-sm flex-none">
            Open the planner →
          </Link>
        </div>
        <div className="mt-3 text-[11px] text-slate-500">
          Simple estimate for {slug.replace(/-/g, " ")}. Assumptions are conservative but rates &amp; taxes will vary — verify before acting.
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-100 p-5"
      style={{ background: "var(--t-calc-footer-bg)" }}>
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle,var(--t-calc-footer-glow),transparent)` }} />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-bold text-slate-900">Want the full picture?</div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">
            The main FinPlan India planner rolls this into a 50-year retirement plan alongside your loans, EPF, taxes, trips, and life goals.
          </p>
        </div>
        <Link href="/plan"
          className="flex-none inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
          style={{ background: "var(--t-btn-bg)", boxShadow: "0 4px 14px var(--t-btn-shadow)" }}>
          Open the planner →
        </Link>
      </div>
      <div className="mt-3 text-[11px] text-slate-400 relative">
        Simple estimate for {slug.replace(/-/g, " ")}. Rates &amp; taxes will vary — verify before acting.
      </div>
    </div>
  );
}
