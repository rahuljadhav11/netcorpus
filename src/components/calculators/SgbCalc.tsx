"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { sgb, inr } from "@/lib/calc";

export default function SgbCalc() {
  const [grams, setGrams] = useState(10);
  const [gramPrice, setGramPrice] = useState(8500);
  const [appreciation, setAppreciation] = useState(9);
  const [tenure, setTenure] = useState(8);

  const r = sgb({
    grams,
    gramPrice,
    goldAppreciationPct: appreciation,
    tenureYears: tenure,
  });

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Grams of gold">
            <NumInput value={grams} onChange={setGrams} />
          </Field>
          <Field label="Current price per gram (₹)">
            <NumInput value={gramPrice} onChange={setGramPrice} rupee />
          </Field>
          <Field label="Expected gold appreciation (% p.a.)" hint="Long-run average ~8–10%; volatile year to year">
            <NumInput value={appreciation} onChange={setAppreciation} />
          </Field>
          <Field label="Tenure (years)" hint="SGBs run for 8 years; exit allowed after 5">
            <NumInput value={tenure} onChange={setTenure} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard label="Total return at maturity" value={inr(r.totalReturn)} sub={`Coupon + capital gain over ${tenure} years`} tone="primary" big />
          <div className="card p-4">
            <ResultRow label="Invested" value={inr(r.invested)} />
            <ResultRow label="Coupon income (2.5% × principal, taxable)" value={inr(r.couponIncome)} tone="good" />
            <ResultRow label="Gold value at maturity" value={inr(r.maturityGoldValue)} />
            <ResultRow label="Capital gain (tax-free on maturity)" value={inr(r.capitalGain)} tone="good" bold />
            <ResultRow label="Effective CAGR" value={`${r.effectiveCagr.toFixed(2)}%`} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">SGB quick facts:</strong> 8-year tenure, exit allowed after 5. 2.5% annual coupon on initial investment (taxable). Capital gains on maturity are 100% tax-free for individual investors — the standout feature. Redeemable in cash at then-market gold price.
          </div>
          <CalculatorFooter slug="sgb" />
        </>
      }
    />
  );
}
