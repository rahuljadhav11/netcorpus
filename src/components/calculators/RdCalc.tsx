"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { rdMaturity, inr } from "@/lib/calc";

export default function RdCalc() {
  const [monthly, setMonthly] = useState(5000);
  const [ratePct, setRatePct] = useState(6.7);
  const [years, setYears] = useState(5);
  const [taxSlab, setTaxSlab] = useState(30);

  const { maturity, totalDeposited, interest } = rdMaturity({
    monthly,
    annualRatePct: ratePct,
    years,
  });
  const taxOnInterest = interest * (taxSlab / 100);
  const postTaxMaturity = maturity - taxOnInterest;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Monthly deposit">
            <NumInput value={monthly} onChange={setMonthly} rupee />
          </Field>
          <Field label="Interest rate (% p.a.)" hint="Bank RD rates: 5.5–7% typical; Post Office RD ~6.7%">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Tenure (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Your income tax slab (%)" hint="RD interest is fully taxable at your slab.">
            <NumInput value={taxSlab} onChange={setTaxSlab} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard label="Maturity amount" value={inr(maturity)} sub={`${years * 12} monthly deposits, quarterly compounding`} tone="primary" big />
          <div className="card p-4">
            <ResultRow label="Total deposited" value={inr(totalDeposited)} />
            <ResultRow label="Interest earned" value={inr(interest)} tone="good" />
            <ResultRow label={`Tax on interest (${taxSlab}% slab)`} value={`−${inr(taxOnInterest)}`} tone="bad" />
            <ResultRow label="Post-tax maturity" value={inr(postTaxMaturity)} bold />
            <ResultRow label="Post-tax return (CAGR)" value={`${(((postTaxMaturity / totalDeposited) ** (1 / years) - 1) * 100).toFixed(2)}% p.a.`} tone="muted" />
          </div>
          <CalculatorFooter slug="rd" />
        </>
      }
    />
  );
}
