"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared layout for every /calculators/[x] page: inputs on the left, results
 * on the right on desktop; stacked on mobile. Also provides a link back to
 * the full planner for those who want the long-form experience.
 */
export default function Shell({
  inputs,
  result,
}: {
  inputs: ReactNode;
  result: ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-6">
      <div className="card p-4 min-w-0">{inputs}</div>
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
  return (
    <div className="mb-3 last:mb-0">
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
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

export function CalculatorFooter({ slug }: { slug: string }) {
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
