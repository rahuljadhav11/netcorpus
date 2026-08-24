"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { emiCalc, amortize, inr } from "@/lib/calc";

export default function EmiCalc() {
  const [principal, setPrincipal] = useState(5000000);
  const [ratePct, setRatePct] = useState(8.5);
  const [years, setYears] = useState(20);
  const [showSchedule, setShowSchedule] = useState(false);

  const { emi, totalPayment, totalInterest } = emiCalc({
    principal,
    annualRatePct: ratePct,
    years,
  });
  const schedule = showSchedule ? amortize({ principal, annualRatePct: ratePct, years }) : [];

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Loan amount">
            <NumInput value={principal} onChange={setPrincipal} rupee />
          </Field>
          <Field label="Interest rate (% p.a.)">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Tenure (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard label="Monthly EMI" value={inr(emi)} sub={`${years * 12} instalments`} tone="primary" big />
          <div className="card p-4">
            <ResultRow label="Principal" value={inr(principal)} />
            <ResultRow label="Total interest paid" value={inr(totalInterest)} tone="bad" />
            <ResultRow label="Total amount paid" value={inr(totalPayment)} bold />
            <ResultRow label="Interest-to-principal ratio" value={`${((totalInterest / principal) * 100).toFixed(0)}%`} tone="muted" />
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Amortization schedule</h3>
              <button className="btn-outline text-xs" onClick={() => setShowSchedule((s) => !s)}>
                {showSchedule ? "Hide" : "Show"}
              </button>
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
              </div>
            )}
          </div>
          <CalculatorFooter slug="emi" />
        </>
      }
    />
  );
}
