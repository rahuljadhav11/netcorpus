"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { fdMaturity, inr } from "@/lib/calc";

export default function FdCalc() {
  const [principal, setPrincipal] = useState(500000);
  const [ratePct, setRatePct] = useState(7);
  const [years, setYears] = useState(5);
  const [taxSlab, setTaxSlab] = useState(30);

  const { maturity, interest } = fdMaturity({
    principal,
    annualRatePct: ratePct,
    years,
    compoundingsPerYear: 4,
  });
  const taxOnInterest = interest * (taxSlab / 100);
  const postTaxMaturity = maturity - taxOnInterest;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Deposit amount">
            <NumInput value={principal} onChange={setPrincipal} rupee />
          </Field>
          <Field label="Interest rate (% p.a.)" hint="Current top FD rates: 6.5–7.5% for 1–5 yrs; senior citizens get +0.5%">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Tenure (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Your income tax slab (%)" hint="FD interest is fully taxable at your slab. New regime typical: 5/10/15/20/30.">
            <NumInput value={taxSlab} onChange={setTaxSlab} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard label="Maturity amount" value={inr(maturity)} sub={`${years} yrs at ${ratePct}% quarterly compounding`} tone="primary" big />
          <div className="card p-4">
            <ResultRow label="Principal" value={inr(principal)} />
            <ResultRow label="Interest earned" value={inr(interest)} tone="good" />
            <ResultRow label={`Tax on interest (${taxSlab}% slab)`} value={`−${inr(taxOnInterest)}`} tone="bad" />
            <ResultRow label="Post-tax maturity" value={inr(postTaxMaturity)} bold />
            <ResultRow label="Effective post-tax return (CAGR)" value={`${(((postTaxMaturity / principal) ** (1 / years) - 1) * 100).toFixed(2)}%`} tone="muted" />
          </div>
          <CalculatorFooter slug="fd" />
        </>
      }
    />
  );
}
