"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { termInsuranceNeed, inr } from "@/lib/calc";

export default function TermInsuranceCalc() {
  const [monthlyExpense, setMonthlyExpense] = useState(60000);
  const [dependencyYears, setDependencyYears] = useState(25);
  const [inflationPct, setInflationPct] = useState(7);
  const [discountRatePct, setDiscountRatePct] = useState(6);
  const [existingCorpus, setExistingCorpus] = useState(500000);
  const [existingCover, setExistingCover] = useState(0);
  const [outstandingLoans, setOutstandingLoans] = useState(4000000);

  const r = termInsuranceNeed({
    monthlyExpense,
    dependencyYears,
    inflationPct,
    discountRatePct,
    existingLiquidCorpus: existingCorpus,
    existingLifeCover: existingCover,
    outstandingLoans,
  });

  // Also compute the simple "10-15x annual income" rule for reference.
  const annualIncome = monthlyExpense * 12 * 1.5; // Rough: expense ≈ 60-70% of income
  const ruleOfThumb15x = annualIncome * 15;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Dependents' monthly expense (today)" hint="What your family needs each month if you're not around">
            <NumInput value={monthlyExpense} onChange={setMonthlyExpense} rupee />
          </Field>
          <Field label="Years of financial dependency" hint="Till youngest child is 25, or spouse retires — usually 20–30 yrs">
            <NumInput value={dependencyYears} onChange={setDependencyYears} />
          </Field>
          <Field label="Expense inflation (% p.a.)">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>
          <Field label="Investment return on payout (% p.a.)" hint="Safe portfolio: FD + debt MF, 6–7%">
            <NumInput value={discountRatePct} onChange={setDiscountRatePct} />
          </Field>
          <Field label="Existing liquid corpus (FD, MF, EPF)">
            <NumInput value={existingCorpus} onChange={setExistingCorpus} rupee />
          </Field>
          <Field label="Existing life cover you already have">
            <NumInput value={existingCover} onChange={setExistingCover} rupee />
          </Field>
          <Field label="Outstanding loans" hint="Should be cleared with the payout so family isn't burdened">
            <NumInput value={outstandingLoans} onChange={setOutstandingLoans} rupee />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Recommended term cover"
            value={inr(r.recommendedCover)}
            sub="Human Life Value method — replaces future expenses"
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Total need (PV of future expenses + loans)" value={inr(r.grossNeed)} />
            <ResultRow label="− Existing corpus + cover" value={`−${inr(r.existingOffset)}`} tone="muted" />
            <ResultRow label="Recommended cover" value={inr(r.recommendedCover)} bold />
            <ResultRow label="Rule-of-thumb (15× annual income)" value={inr(ruleOfThumb15x)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Term insurance quick facts:</strong> Pure protection product — no investment component. Premiums for 30-year-olds: ~₹800–1,500/mo for ₹1 Cr cover. Buy till age 60–65. Prefer long-tenure plans and disclose everything honestly. Section 80C benefit (old regime).
          </div>
          <CalculatorFooter slug="term-insurance" />
        </>
      }
    />
  );
}
