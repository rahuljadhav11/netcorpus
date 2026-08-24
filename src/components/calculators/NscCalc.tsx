"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { nsc, inr } from "@/lib/calc";

export default function NscCalc() {
  const [invested, setInvested] = useState(100000);
  const [ratePct, setRatePct] = useState(7.7);
  const [taxSlab, setTaxSlab] = useState(30);

  const { maturity, interest } = nsc({ investment: invested, annualRatePct: ratePct });
  // NSC interest is taxable at your slab. Interest accrued in first 4 years is
  // deemed reinvested (and also 80C-eligible in old regime). Year-5 interest
  // is taxable at maturity. In practice most people pay slab on the total.
  const totalTax = interest * (taxSlab / 100);
  const postTaxMaturity = maturity - totalTax;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Investment amount" hint="Min ₹1,000; no upper limit. Deposits qualify for 80C.">
            <NumInput value={invested} onChange={setInvested} rupee />
          </Field>
          <Field label="Interest rate (% p.a.)" hint="Q3 FY24-25 rate: 7.7%. Interest compounded annually.">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Your income tax slab (%)" hint="NSC interest is fully taxable at your slab.">
            <NumInput value={taxSlab} onChange={setTaxSlab} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard label="Maturity after 5 years" value={inr(maturity)} sub={`Compounded annually at ${ratePct}%`} tone="primary" big />
          <div className="card p-4">
            <ResultRow label="Principal" value={inr(invested)} />
            <ResultRow label="Interest earned (gross)" value={inr(interest)} tone="good" />
            <ResultRow label={`Tax on interest (${taxSlab}% slab)`} value={`−${inr(totalTax)}`} tone="bad" />
            <ResultRow label="Post-tax maturity" value={inr(postTaxMaturity)} tone="good" bold />
            <ResultRow label="Post-tax return (CAGR)" value={`${(((postTaxMaturity / invested) ** (1 / 5) - 1) * 100).toFixed(2)}% p.a.`} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">NSC quick facts:</strong> 5-year lock-in. Deposits qualify for section 80C. Interest accrues annually but is reinvested (also eligible for 80C in subsequent years). Full maturity is taxable at your slab.
          </div>
          <CalculatorFooter slug="nsc" />
        </>
      }
    />
  );
}
