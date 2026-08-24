"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { postOfficeMis, inr } from "@/lib/calc";

export default function PostOfficeMisCalc() {
  const [deposit, setDeposit] = useState(900000);
  const [ratePct, setRatePct] = useState(7.4);
  const [jointAccount, setJointAccount] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);

  const maxDeposit = jointAccount ? 1500000 : 900000;
  const overLimit = deposit > maxDeposit;

  const { monthlyInterest, annualInterest, totalInterest5yr } = postOfficeMis({
    deposit,
    annualRatePct: ratePct,
  });
  const postTaxMonthly = monthlyInterest * (1 - taxSlab / 100);
  const totalTax5yr = totalInterest5yr * (taxSlab / 100);
  const postTaxTotal5yr = totalInterest5yr - totalTax5yr;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Deposit amount" hint={`Max: ₹${(maxDeposit / 100000).toFixed(0)}L (${jointAccount ? "joint" : "single"} account)`}>
            <NumInput value={deposit} onChange={setDeposit} rupee />
          </Field>
          {overLimit && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-800">
              ⚠ Exceeds statutory {jointAccount ? "₹15L (joint)" : "₹9L (single)"} limit for POMIS.
            </div>
          )}
          <Field label="Interest rate (% p.a.)" hint="Government-set, revised quarterly. Q3 FY24-25: 7.4%.">
            <NumInput value={ratePct} onChange={setRatePct} />
          </Field>
          <Field label="Account type">
            <div className="flex gap-2 mt-1">
              <button
                className={`flex-1 text-xs rounded-md px-3 py-2 border ${!jointAccount ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-300 text-slate-700"}`}
                onClick={() => setJointAccount(false)}
              >
                Single (max ₹9L)
              </button>
              <button
                className={`flex-1 text-xs rounded-md px-3 py-2 border ${jointAccount ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-300 text-slate-700"}`}
                onClick={() => setJointAccount(true)}
              >
                Joint (max ₹15L)
              </button>
            </div>
          </Field>
          <Field label="Your income tax slab (%)" hint="POMIS interest is fully taxable at your slab.">
            <NumInput value={taxSlab} onChange={setTaxSlab} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Monthly income"
            value={inr(monthlyInterest)}
            sub={`For 5 years, then principal returned`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Principal (returned at maturity)" value={inr(deposit)} />
            <ResultRow label="Annual interest income" value={inr(annualInterest)} tone="good" />
            <ResultRow label="Total interest over 5 years (gross)" value={inr(totalInterest5yr)} />
            <ResultRow label={`Tax on interest (${taxSlab}% slab)`} value={`−${inr(totalTax5yr)}`} tone="bad" />
            <ResultRow label="Post-tax total over 5 years" value={inr(postTaxTotal5yr)} tone="good" bold />
            <ResultRow label="Effective monthly income (post-tax)" value={inr(postTaxMonthly)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">POMIS quick facts:</strong> 5-year fixed tenure · monthly interest credited to linked SB account · principal returned at maturity · interest is fully taxable at your slab · premature exit allowed after 1 year with 2% penalty.
          </div>
          <div className="card p-4 bg-amber-50 border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong className="text-amber-950">⚠ Purchasing-power warning:</strong> The monthly payout stays flat for 5 years while everything you buy gets more expensive. At 7% inflation, ₹{Math.round(monthlyInterest).toLocaleString("en-IN")}/mo today buys only ~₹{Math.round(monthlyInterest / Math.pow(1.07, 5)).toLocaleString("en-IN")} worth of goods in year 5. POMIS is best for supplementary income, not as your primary retirement stream.
          </div>
          <CalculatorFooter slug="post-office-mis" />
        </>
      }
    />
  );
}
