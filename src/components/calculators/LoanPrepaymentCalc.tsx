"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { loanPrepayment, emiIncrease, amortizeAtEmi, inr } from "@/lib/calc";

export default function LoanPrepaymentCalc() {
  const [outstanding, setOutstanding] = useState(4000000);
  const [ratePct, setRatePct] = useState(8.5);
  const [remainingYears, setRemainingYears] = useState(15);
  const [prepayment, setPrepayment] = useState(500000);
  const [extraMonthly, setExtraMonthly] = useState(5000);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleFor, setScheduleFor] = useState<"increase-emi" | "baseline">("increase-emi");

  const lp = loanPrepayment({
    outstanding,
    annualRatePct: ratePct,
    remainingYears,
    prepaymentAmount: prepayment,
  });

  const bump = emiIncrease({
    outstanding,
    annualRatePct: ratePct,
    remainingYears,
    extraMonthly,
  });

  const schedule = showSchedule
    ? amortizeAtEmi({
        outstanding,
        annualRatePct: ratePct,
        emi: scheduleFor === "increase-emi" ? bump.newEmi : bump.baseEmi,
      })
    : [];

  const monthsSavedYears = (lp.reduceTenure.monthsSaved / 12).toFixed(1);
  const emiReduction = lp.baseline.emi - lp.reduceEmi.emi;
  const bumpMonthsSavedYears = (bump.monthsSaved / 12).toFixed(1);

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Your loan</div>
          <Field label="Outstanding loan balance">
            <NumInput value={outstanding} onChange={setOutstanding} rupee />
          </Field>
          <Field label="Interest rate (% p.a.)">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Remaining tenure (years)">
            <NumInput value={remainingYears} onChange={setRemainingYears} />
          </Field>

          <div className="section-h mt-4 mb-3">One-time prepayment</div>
          <Field label="Prepayment amount (optional)" hint="A single lump payment towards principal">
            <NumInput value={prepayment} onChange={setPrepayment} rupee />
          </Field>

          <div className="section-h mt-4 mb-3">Ongoing extra EMI</div>
          <Field label="Extra monthly payment (optional)" hint="How much MORE than the scheduled EMI you can pay each month">
            <NumInput value={extraMonthly} onChange={setExtraMonthly} rupee />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Best-case interest saved"
            value={inr(Math.max(lp.reduceTenure.interestSaved, bump.interestSaved))}
            sub={
              lp.reduceTenure.interestSaved >= bump.interestSaved
                ? `via ₹${Math.round(prepayment).toLocaleString("en-IN")} one-time prepayment (reduce tenure)`
                : `via ₹${Math.round(extraMonthly).toLocaleString("en-IN")}/mo extra EMI`
            }
            tone="good"
            big
          />

          <div className="section-h">Option A — One-time prepayment (reduce tenure)</div>
          <div className="card p-4">
            <ResultRow label="EMI stays" value={inr(lp.reduceTenure.emi)} />
            <ResultRow label="New tenure" value={`${(lp.reduceTenure.months / 12).toFixed(1)} yrs`} />
            <ResultRow label="Time saved" value={`${monthsSavedYears} yrs (${lp.reduceTenure.monthsSaved} months)`} tone="good" />
            <ResultRow label="Total interest paid" value={inr(lp.reduceTenure.totalInterest)} />
            <ResultRow label="Interest saved" value={inr(lp.reduceTenure.interestSaved)} tone="good" bold />
          </div>

          <div className="section-h">Option B — One-time prepayment (reduce EMI)</div>
          <div className="card p-4">
            <ResultRow label="New EMI" value={inr(lp.reduceEmi.emi)} />
            <ResultRow label="EMI drops by" value={inr(emiReduction)} tone="good" />
            <ResultRow label="Tenure stays" value={`${remainingYears} yrs`} />
            <ResultRow label="Interest saved" value={inr(lp.reduceEmi.interestSaved)} tone="good" bold />
          </div>

          <div className="section-h">Option C — Increase EMI monthly</div>
          <div className="card p-4">
            <ResultRow label="Base EMI" value={inr(bump.baseEmi)} tone="muted" />
            <ResultRow label="New EMI (base + extra)" value={inr(bump.newEmi)} tone="good" />
            <ResultRow label="New tenure" value={`${(bump.monthsToClose / 12).toFixed(1)} yrs`} />
            <ResultRow label="Time saved" value={`${bumpMonthsSavedYears} yrs (${bump.monthsSaved} months)`} tone="good" />
            <ResultRow label="Total interest paid" value={inr(bump.totalInterest)} />
            <ResultRow label="Interest saved" value={inr(bump.interestSaved)} tone="good" bold />
          </div>

          <div className="section-h">Baseline (no prepayment, no extra)</div>
          <div className="card p-4">
            <ResultRow label="Current EMI" value={inr(lp.baseline.emi)} />
            <ResultRow label="Total interest over tenure" value={inr(lp.baseline.totalInterest)} tone="muted" />
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h3 className="font-semibold text-slate-900">Amortization schedule</h3>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs">
                  <button
                    className={`px-2.5 py-1 rounded ${scheduleFor === "baseline" ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"}`}
                    onClick={() => setScheduleFor("baseline")}
                  >
                    Baseline
                  </button>
                  <button
                    className={`px-2.5 py-1 rounded ${scheduleFor === "increase-emi" ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"}`}
                    onClick={() => setScheduleFor("increase-emi")}
                  >
                    Increased EMI
                  </button>
                </div>
                <button className="btn-outline text-xs" onClick={() => setShowSchedule((s) => !s)}>
                  {showSchedule ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {showSchedule && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="text-slate-500 sticky top-0 bg-white">
                    <tr>
                      <th className="py-1.5 pr-3 text-left">Month</th>
                      <th className="py-1.5 pr-3 text-right">Interest</th>
                      <th className="py-1.5 pr-3 text-right">Principal</th>
                      <th className="py-1.5 pr-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((r) => (
                      <tr key={r.month} className="border-t border-slate-100">
                        <td className="py-1 pr-3 text-slate-500">{r.month}</td>
                        <td className="py-1 pr-3 text-right">{inr(r.interest)}</td>
                        <td className="py-1 pr-3 text-right">{inr(r.principal)}</td>
                        <td className="py-1 pr-3 text-right font-medium">{inr(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[11px] text-slate-500 mt-2">
                  {scheduleFor === "increase-emi"
                    ? `Schedule with your extra ₹${Math.round(extraMonthly).toLocaleString("en-IN")}/mo — loan closes in ${bump.monthsToClose} months.`
                    : `Schedule with the original EMI (${remainingYears * 12} months).`}
                </p>
              </div>
            )}
          </div>

          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Rule of thumb:</strong> If your loan rate exceeds your expected post-tax SIP return, prepay. Otherwise consider investing that money instead — the SIP calculator can show you the alternative outcome. Option C (bumping EMI) is often the easiest to implement: no lump sum needed, just a small step-up.
          </div>
          <CalculatorFooter slug="loan-prepayment" />
        </>
      }
    />
  );
}
