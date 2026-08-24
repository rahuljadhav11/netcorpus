"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { sukanya, deflateFV, inr } from "@/lib/calc";

export default function SukanyaCalc() {
  const [annual, setAnnual] = useState(150000);
  const [ratePct, setRatePct] = useState(8.2);
  const [startAge, setStartAge] = useState(2);
  const [inflationPct, setInflationPct] = useState(7);

  const overLimit = annual > 150000;
  const { maturity, totalInvested, interest } = sukanya({
    annualInvestment: annual,
    annualRatePct: ratePct,
    startAge,
  });
  const yearsToMaturity = Math.max(0, 21 - startAge);
  const maturityToday = deflateFV(maturity, inflationPct, yearsToMaturity);

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Annual investment" hint="Statutory limit: ₹1.5 lakh per year">
            <NumInput value={annual} onChange={setAnnual} rupee />
          </Field>
          {overLimit && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-800">
              ⚠ Exceeds ₹1.5L annual limit; excess won't earn interest and won't qualify for 80C.
            </div>
          )}
          <Field label="Interest rate (% p.a.)" hint="Current: 8.2% (revised quarterly)">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Girl's current age" hint="Account can be opened only before age 10">
            <NumInput value={startAge} onChange={setStartAge} />
          </Field>
          <Field label="Assumed inflation (% p.a.)" hint="For the 'in today's ₹' preview — education inflation runs ~10%">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Maturity at age 21 (tax-free)"
            value={inr(maturity)}
            sub={`~${inr(maturityToday)} in today's ₹ · matures in ${yearsToMaturity} years (EEE)`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Total invested (15 years)" value={inr(totalInvested)} />
            <ResultRow label="Interest earned (tax-free)" value={inr(interest)} tone="good" />
            <ResultRow label="Multiplier" value={`${(maturity / Math.max(1, totalInvested)).toFixed(2)}×`} tone="muted" />
            <ResultRow label="Value in today's ₹" value={inr(maturityToday)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Sukanya Samriddhi quick facts:</strong> Deposit for 15 years, mature at 21 (or on girl's marriage after 18). Deposits qualify for 80C (old regime). Interest & maturity fully tax-free (EEE). Highest interest rate among small-savings schemes. Max 2 accounts per family.
          </div>
          <CalculatorFooter slug="sukanya" />
        </>
      }
    />
  );
}
