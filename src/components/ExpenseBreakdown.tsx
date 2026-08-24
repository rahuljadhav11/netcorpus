"use client";

import type { ExpenseBreakdown } from "@/lib/types";
import { expenseCategories, defaultExpenseBreakdown } from "@/lib/defaults";
import { inr } from "@/lib/finance";
import { useState } from "react";
import NumInput from "./NumInput";

interface Props {
  value?: ExpenseBreakdown;
  onChange: (v: ExpenseBreakdown, total: number) => void;
}

export default function ExpenseBreakdownForm({ value, onChange }: Props) {
  const current = value ?? defaultExpenseBreakdown;
  const [expanded, setExpanded] = useState<string | null>("Housing");

  const total = Object.values(current).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0);

  const update = (key: keyof ExpenseBreakdown, v: number) => {
    const next = { ...current, [key]: v };
    const t = Object.values(next).reduce((s, x) => s + (Number.isFinite(x) ? x : 0), 0);
    onChange(next, t);
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-brand-700 font-medium">Total monthly expense</div>
          <div className="text-lg font-semibold text-brand-800">{inr(total)}</div>
        </div>
        <div className="text-xs text-slate-500 text-right leading-tight max-w-[180px]">
          Auto-filled into the planner. Edit any row to update.
        </div>
      </div>

      {expenseCategories.map((cat) => {
        const groupTotal = cat.items.reduce((s, it) => s + (current[it.key] || 0), 0);
        const isOpen = expanded === cat.group;
        return (
          <div key={cat.group} className="rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : cat.group)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50"
            >
              <span className="text-sm font-medium text-slate-800">{cat.group}</span>
              <span className="text-xs text-slate-500 flex items-center gap-2">
                <span className="tabular-nums">{inr(groupTotal)}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none">
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 p-3 space-y-2">
                {cat.items.map((it) => (
                  <div key={it.key} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-700">{it.label}</div>
                      {it.hint && <div className="text-[10px] text-slate-400">{it.hint}</div>}
                    </div>
                    <div className="w-36">
                      <NumInput
                        value={current[it.key] || 0}
                        onChange={(v) => update(it.key, v)}
                        rupee
                        compact
                        alignRight
                        ariaLabel={it.label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
