"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { lumpSumFutureValue, deflateFV, inr } from "@/lib/calc";

export default function LumpSumCalc() {
  const [principal, setPrincipal] = useState(500000);
  const [returnPct, setReturnPct] = useState(12);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState<1 | 4 | 12>(1);
  const [inflationPct, setInflationPct] = useState(7);
  const [taxMode, setTaxMode] = useState<"equity" | "slab" | "free">("equity");
  const [taxSlab, setTaxSlab] = useState(30);

  const fv = lumpSumFutureValue({
    principal,
    annualReturnPct: returnPct,
    years,
    compoundingsPerYear: compounding,
  });
  const gained = fv - principal;
  const fvToday = deflateFV(fv, inflationPct, years);
  const tax =
    taxMode === "equity"
      ? Math.max(0, gained - 125000) * 0.125
      : taxMode === "slab"
        ? gained * (taxSlab / 100)
        : 0;
  const postTaxFv = fv - tax;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="One-time investment">
            <NumInput value={principal} onChange={setPrincipal} rupee />
          </Field>
          <Field label="Expected annual return (%)">
            <NumInput value={returnPct} onChange={setReturnPct} />
          </Field>
          <Field label="Duration (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Compounding frequency">
            <select
              className="input"
              value={compounding}
              onChange={(e) => setCompounding(Number(e.target.value) as 1 | 4 | 12)}
            >
              <option value={1}>Annually</option>
              <option value={4}>Quarterly (common for FDs)</option>
              <option value={12}>Monthly</option>
            </select>
          </Field>
          <Field label="Assumed inflation (% p.a.)" hint="For the 'in today's ₹' preview only">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>

          <div className="section-h mt-4 mb-3">Tax on withdrawal</div>
          <Field label="Instrument type">
            <select
              className="input"
              value={taxMode}
              onChange={(e) => setTaxMode(e.target.value as "equity" | "slab" | "free")}
            >
              <option value="equity">Equity MF (LTCG 12.5% above ₹1.25L)</option>
              <option value="slab">Debt / FD / RD / hybrid (taxed at slab)</option>
              <option value="free">Tax-free (PPF, EEE schemes)</option>
            </select>
          </Field>
          {taxMode === "slab" && (
            <Field label="Your income tax slab (%)">
              <NumInput value={taxSlab} onChange={setTaxSlab} />
            </Field>
          )}
        </div>
      }
      result={
        <>
          <MetricCard
            label="Final value"
            value={inr(fv)}
            sub={`~${inr(fvToday)} in today's ₹ · in ${years} years`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Principal invested" value={inr(principal)} />
            <ResultRow label="Interest earned" value={inr(gained)} tone="good" />
            <ResultRow label="Multiplier" value={`${(fv / Math.max(1, principal)).toFixed(2)}×`} tone="muted" />
            <ResultRow label="Value in today's ₹" value={inr(fvToday)} tone="muted" />
          </div>
          <div className="card p-4 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
              {taxMode === "free" ? "Tax on withdrawal" : "If withdrawn at maturity"}
            </div>
            {taxMode === "free" ? (
              <p className="text-xs text-slate-600">Fully tax-free at maturity — no LTCG or slab tax applied.</p>
            ) : taxMode === "equity" ? (
              <>
                <ResultRow label="LTCG tax (12.5% above ₹1.25L exempt)" value={`−${inr(tax)}`} tone="bad" />
                <ResultRow label="Post-tax value" value={inr(postTaxFv)} tone="good" bold />
                <p className="text-[11px] text-slate-500 mt-2">Spreading redemption over multiple years reduces tax (each year gets its own ₹1.25L exemption).</p>
              </>
            ) : (
              <>
                <ResultRow label={`Tax at slab (${taxSlab}%)`} value={`−${inr(tax)}`} tone="bad" />
                <ResultRow label="Post-tax value" value={inr(postTaxFv)} tone="good" bold />
              </>
            )}
          </div>
          <CalculatorFooter slug="lump-sum" />
        </>
      }
    />
  );
}
