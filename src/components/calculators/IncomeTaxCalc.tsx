"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { incomeTax, inr } from "@/lib/calc";

export default function IncomeTaxCalc() {
  const [gross, setGross] = useState(1500000);
  const [age, setAge] = useState<"below60" | "60to79" | "above80">("below60");
  const [section80C, setSection80C] = useState(150000);
  const [section80D, setSection80D] = useState(25000);
  const [hraExempt, setHraExempt] = useState(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);
  const [npsEmployer, setNpsEmployer] = useState(0);
  const [other, setOther] = useState(0);

  const newRegime = incomeTax({
    regime: "new",
    grossIncome: gross,
    age,
    deductions: { npsEmployer }, // most deductions unavailable in new regime
  });
  const oldRegime = incomeTax({
    regime: "old",
    grossIncome: gross,
    age,
    deductions: { section80C, section80D, hraExempt, homeLoanInterest, npsEmployer, other },
  });
  const cheaper = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";
  const saving = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Gross annual income">
            <NumInput value={gross} onChange={setGross} rupee />
          </Field>
          <Field label="Age category">
            <select
              className="input"
              value={age}
              onChange={(e) => setAge(e.target.value as "below60" | "60to79" | "above80")}
            >
              <option value="below60">Below 60</option>
              <option value="60to79">Senior citizen (60–79)</option>
              <option value="above80">Super senior (80+)</option>
            </select>
          </Field>
          <div className="section-h mt-4 mb-2">Old-regime deductions</div>
          <Field label="Section 80C (PF, ELSS, PPF, life insurance)" hint="Cap ₹1.5L">
            <NumInput value={section80C} onChange={setSection80C} rupee />
          </Field>
          <Field label="Section 80D (health insurance)" hint="Cap ₹25k / ₹50k senior">
            <NumInput value={section80D} onChange={setSection80D} rupee />
          </Field>
          <Field label="HRA exemption" hint="Use the HRA calculator to compute">
            <NumInput value={hraExempt} onChange={setHraExempt} rupee />
          </Field>
          <Field label="Home loan interest" hint="Cap ₹2L for self-occupied">
            <NumInput value={homeLoanInterest} onChange={setHomeLoanInterest} rupee />
          </Field>
          <Field label="NPS employer contribution (80CCD-2)" hint="Allowed in BOTH regimes">
            <NumInput value={npsEmployer} onChange={setNpsEmployer} rupee />
          </Field>
          <Field label="Other old-regime deductions">
            <NumInput value={other} onChange={setOther} rupee />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label={`Recommended: ${cheaper === "new" ? "New regime" : "Old regime"}`}
            value={inr(cheaper === "new" ? newRegime.totalTax : oldRegime.totalTax)}
            sub={`Saves ${inr(saving)} vs the other regime`}
            tone="good"
            big
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <div className={`card p-4 ${cheaper === "new" ? "border-brand-300 bg-brand-50/30" : ""}`}>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">New regime {cheaper === "new" && "★"}</div>
              <ResultRow label="Taxable income" value={inr(newRegime.taxable)} />
              <ResultRow label="Tax (before rebate)" value={inr(newRegime.taxBeforeRebate)} tone="muted" />
              <ResultRow label="Rebate u/s 87A" value={`−${inr(newRegime.rebate)}`} tone="muted" />
              <ResultRow label="Cess (4%)" value={inr(newRegime.cess)} tone="muted" />
              <ResultRow label="Total tax" value={inr(newRegime.totalTax)} bold />
            </div>
            <div className={`card p-4 ${cheaper === "old" ? "border-brand-300 bg-brand-50/30" : ""}`}>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Old regime {cheaper === "old" && "★"}</div>
              <ResultRow label="Taxable income" value={inr(oldRegime.taxable)} />
              <ResultRow label="Tax (before rebate)" value={inr(oldRegime.taxBeforeRebate)} tone="muted" />
              <ResultRow label="Rebate u/s 87A" value={`−${inr(oldRegime.rebate)}`} tone="muted" />
              <ResultRow label="Cess (4%)" value={inr(oldRegime.cess)} tone="muted" />
              <ResultRow label="Total tax" value={inr(oldRegime.totalTax)} bold />
            </div>
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Slabs used (FY 2025-26, Budget 2025):</strong> New regime: 0/5/10/15/20/25/30% (₹4L / ₹8L / ₹12L / ₹16L / ₹20L / ₹24L breaks) with ₹75k standard deduction &amp; ₹12L rebate (no tax if taxable income ≤ ₹12L). Old regime: 0/5/20/30% (₹2.5L / ₹5L / ₹10L breaks; higher for senior citizens) with ₹50k std deduction &amp; ₹5L rebate.
          </div>
          <CalculatorFooter slug="income-tax" />
        </>
      }
    />
  );
}
