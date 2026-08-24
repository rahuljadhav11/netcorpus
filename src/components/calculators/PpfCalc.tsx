"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { ppfMaturity, deflateFV, inr } from "@/lib/calc";

export default function PpfCalc() {
  const [annual, setAnnual] = useState(150000);
  const [ratePct, setRatePct] = useState(7.1);
  const [years, setYears] = useState(15);
  const [inflationPct, setInflationPct] = useState(7);

  const { maturity, totalInvested, interest } = ppfMaturity({
    annualInvestment: annual,
    annualRatePct: ratePct,
    years,
  });
  const maturityToday = deflateFV(maturity, inflationPct, years);
  const overLimit = annual > 150000;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Annual investment" hint="Statutory limit ₹1.5L / year across all PPF accounts">
            <NumInput value={annual} onChange={setAnnual} rupee />
          </Field>
          {overLimit && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-800">
              ⚠ Exceeds ₹1.5L annual limit. Only the first ₹1.5L would qualify for interest and 80C deduction.
            </div>
          )}
          <Field label="Interest rate (% p.a.)" hint="Current declared rate: 7.1%. Government revises quarterly.">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Duration (years)" hint="Minimum 15-year lock-in; extendable in 5-year blocks">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Assumed inflation (% p.a.)" hint="For the 'in today's ₹' preview only">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Maturity value (tax-free)"
            value={inr(maturity)}
            sub={`~${inr(maturityToday)} in today's ₹ · ${years} yrs at ${ratePct}%`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Total invested" value={inr(totalInvested)} />
            <ResultRow label="Interest earned (tax-free)" value={inr(interest)} tone="good" />
            <ResultRow label="Return multiple" value={`${(maturity / Math.max(1, totalInvested)).toFixed(2)}×`} tone="muted" />
            <ResultRow label="Value in today's ₹" value={inr(maturityToday)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">PPF quick facts:</strong> 15-year lock-in (extendable in 5-yr blocks) · deposits qualify for section 80C deduction (old regime) · interest and maturity fully tax-free (EEE) · partial withdrawal allowed from year 7 · one PPF account per person.
          </div>
          <CalculatorFooter slug="ppf" />
        </>
      }
    />
  );
}
