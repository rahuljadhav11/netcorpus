"use client";

import { useState } from "react";
import type { PlanInputs } from "@/lib/types";
import { otherIncomeMonthly } from "@/lib/types";
import { inr } from "@/lib/finance";

/**
 * Live monthly cashflow breakdown. Sticks to the top of the form column as
 * the user scrolls so they see the effect of each new expense / loan / NPS
 * contribution on their remaining surplus immediately.
 */
export default function CashflowSummary({ inputs }: { inputs: PlanInputs }) {
  const [expanded, setExpanded] = useState(true);

  interface Row {
    label: string;
    delta: number;
    sub?: string;
  }
  const rows: Row[] = [];

  // Start from in-hand.
  rows.push({ label: "In-hand salary", delta: inputs.monthlySalary });
  let running = inputs.monthlySalary;

  // Other income streams (rental, freelance, spouse, etc.)
  for (const oi of inputs.otherIncomes) {
    const eqMonthly = otherIncomeMonthly(oi);
    if (eqMonthly > 0) {
      const sub = oi.frequency === "monthly" ? undefined : `${oi.frequency} · ₹${Math.round(oi.amount).toLocaleString("en-IN")}/pmt`;
      rows.push({ label: oi.name, delta: eqMonthly, sub });
      running += eqMonthly;
    }
  }

  // Living expenses.
  if (inputs.monthlyExpense > 0) {
    rows.push({ label: "Living expenses", delta: -inputs.monthlyExpense });
    running -= inputs.monthlyExpense;
  }

  // Annual events don't reduce monthly cashflow — they're withdrawn as
  // silent year-end lumps from SIP. We surface a small info note below
  // instead of a line item.

  // Each loan EMI shown separately so the user sees the drag of every loan.
  for (const loan of inputs.loans) {
    if (loan.emi > 0) {
      rows.push({ label: `${loan.name} EMI`, delta: -loan.emi, sub: `${loan.annualRate}% p.a.` });
      running -= loan.emi;
    }
  }

  // Voluntary NPS.
  if (inputs.nps.enabled && inputs.nps.monthlyContribution > 0) {
    rows.push({ label: "NPS contribution", delta: -inputs.nps.monthlyContribution });
    running -= inputs.nps.monthlyContribution;
  }

  const isNegative = running < 0;

  // EPF/EPS grows in the background — not part of cashflow because it's
  // pre-in-hand. Shown as a fine-print aside.
  const detailed = inputs.epfDetails.mode === "detailed";
  const bgEpf = detailed
    ? inputs.epfDetails.basicDA * 0.24 // EE 12% + ER 12% (of which some to EPS)
    : (inputs.epfMonthlyContribution || 0);

  return (
    <div className="sticky top-14 z-20 rounded-xl border border-slate-200 bg-white/95 backdrop-blur shadow-sm mb-4 no-print">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-3 py-2.5 gap-2 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`inline-block w-2 h-2 rounded-full flex-none ${isNegative ? "bg-rose-500" : "bg-emerald-500"}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex-none">Cashflow</span>
          <span
            className={`text-sm font-semibold tabular-nums truncate ${isNegative ? "text-rose-700" : "text-emerald-700"}`}
            title="Amount left every month after essentials, EMIs, and voluntary contributions"
          >
            {isNegative ? "" : "+"}
            {inr(running)}
            <span className="text-[10px] uppercase text-slate-500 tracking-wide ml-1 font-normal">
              {isNegative ? "deficit" : "left for SIP / loans"}
            </span>
          </span>
        </div>
        <span className="text-slate-400 text-xs flex-none">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-3 pt-2 pb-3">
          <ol className="space-y-1.5 max-h-64 overflow-y-auto">
            {rows.map((r, i) => {
              const neg = r.delta < 0;
              return (
                <li key={i} className="flex items-start justify-between text-xs gap-2">
                  <div className="min-w-0 flex-1">
                    <div className={`truncate ${neg ? "text-slate-700" : "text-slate-900 font-medium"}`}>{r.label}</div>
                    {r.sub && <div className="text-[10px] text-slate-400 truncate">{r.sub}</div>}
                  </div>
                  <span className={`tabular-nums flex-none pl-2 ${neg ? "text-rose-600" : "text-emerald-700"}`}>
                    {neg ? "−" : "+"}
                    {inr(Math.abs(r.delta))}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Left over each month</span>
            <span className={`font-semibold tabular-nums text-sm ${isNegative ? "text-rose-700" : "text-emerald-700"}`}>
              {isNegative ? "" : "+"}
              {inr(running)}
            </span>
          </div>
          {isNegative ? (
            <div className="mt-2 rounded-md bg-rose-50 border border-rose-100 p-2 text-[11px] text-rose-800 leading-snug">
              ⚠ You're spending more than you earn. Reduce expenses, refinance loans, or double-check your in-hand figure.
            </div>
          ) : (
            <div className="mt-2 rounded-md bg-emerald-50 border border-emerald-100 p-2 text-[11px] text-emerald-800 leading-snug">
              This surplus is what the planner uses each month — routed into loan acceleration, SIP, or both, depending on the strategy you pick.
            </div>
          )}
          {bgEpf > 0 && (
            <div className="mt-2 text-[10px] text-slate-500 leading-snug">
              (In the background, ~{inr(bgEpf)}/mo also flows into EPF/EPS — already deducted from your CTC before in-hand, so not shown here.)
            </div>
          )}
          {inputs.annualEvents.length > 0 && (
            <div className="mt-1 text-[10px] text-slate-500 leading-snug">
              (Annual events like trips are funded silently from SIP once a year — see the Annual Events section for the full trip plan.)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
