"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { scss, inr } from "@/lib/calc";

export default function ScssCalc() {
  const [deposit, setDeposit] = useState(1500000);
  const [ratePct, setRatePct] = useState(8.2);
  const [taxSlab, setTaxSlab] = useState(20); // seniors often in 20% slab

  const overLimit = deposit > 3000000; // ₹30L cap for SCSS
  const { quarterlyInterest, annualInterest, totalInterest5yr } = scss({
    deposit,
    annualRatePct: ratePct,
  });
  const totalTax5yr = totalInterest5yr * (taxSlab / 100);
  const postTaxTotal5yr = totalInterest5yr - totalTax5yr;
  const postTaxQuarterly = quarterlyInterest * (1 - taxSlab / 100);

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Deposit amount" hint="Cap: ₹30 lakh (revised from ₹15L in 2023)">
            <NumInput value={deposit} onChange={setDeposit} rupee />
          </Field>
          {overLimit && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-800">
              ⚠ Exceeds ₹30L SCSS limit.
            </div>
          )}
          <Field label="Interest rate (% p.a.)" hint="Q3 FY24-25 rate: 8.2%. Government revises quarterly.">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Your income tax slab (%)" hint="SCSS interest is fully taxable at your slab; TDS above ₹50k/yr for seniors.">
            <NumInput value={taxSlab} onChange={setTaxSlab} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Quarterly interest"
            value={inr(quarterlyInterest)}
            sub="Paid every 3 months to your bank account"
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Annual interest income (gross)" value={inr(annualInterest)} tone="good" />
            <ResultRow label="Total interest over 5 years (gross)" value={inr(totalInterest5yr)} />
            <ResultRow label={`Tax on interest (${taxSlab}% slab)`} value={`−${inr(totalTax5yr)}`} tone="bad" />
            <ResultRow label="Post-tax total over 5 years" value={inr(postTaxTotal5yr)} tone="good" bold />
            <ResultRow label="Post-tax quarterly payout" value={inr(postTaxQuarterly)} tone="muted" />
            <ResultRow label="Principal (returned at maturity)" value={inr(deposit)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">SCSS quick facts:</strong> Only for 60+ (55+ for VRS retirees). 5-year tenure, extendable in 3-year blocks. Quarterly interest payout. Section 80C benefit on deposit (old regime). Interest is fully taxable.
          </div>
          <div className="card p-4 bg-amber-50 border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong className="text-amber-950">⚠ Purchasing-power warning:</strong> The quarterly payout is fixed for 5 years while your expenses inflate. At 7% inflation, ₹{Math.round(quarterlyInterest).toLocaleString("en-IN")} today buys only ~₹{Math.round(quarterlyInterest / Math.pow(1.07, 5)).toLocaleString("en-IN")} worth of goods in year 5. Best used as a safe *slice* of a diversified retirement plan, not the whole pie.
          </div>
          <CalculatorFooter slug="scss" />
        </>
      }
    />
  );
}
