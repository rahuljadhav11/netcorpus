"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { sipFutureValue, deflateFV, inr } from "@/lib/calc";

export default function SipCalc() {
  const [monthly, setMonthly] = useState(10000);
  const [returnPct, setReturnPct] = useState(12);
  const [years, setYears] = useState(15);
  const [inflationPct, setInflationPct] = useState(7);

  const fv = sipFutureValue({ monthly, annualReturnPct: returnPct, years });
  const invested = monthly * 12 * years;
  const gained = fv - invested;
  const fvToday = deflateFV(fv, inflationPct, years);
  // Equity SIP LTCG: 12.5% above ₹1.25L annual exemption (Budget 2024).
  const ltcgTax = Math.max(0, gained - 125000) * 0.125;
  const postTaxFv = fv - ltcgTax;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Monthly SIP amount">
            <NumInput value={monthly} onChange={setMonthly} rupee />
          </Field>
          <Field label="Expected annual return (%)" hint="Long-run Indian equity index has averaged ~11–13% CAGR">
            <NumInput value={returnPct} onChange={setReturnPct} />
          </Field>
          <Field label="Investment duration (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Assumed inflation (% p.a.)" hint="For the 'in today's ₹' preview only — doesn't change SIP math">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Final SIP value"
            value={inr(fv)}
            sub={`~${inr(fvToday)} in today's ₹ · ${years} years at ${returnPct}% p.a.`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Total invested" value={inr(invested)} />
            <ResultRow label="Wealth gained" value={inr(gained)} tone="good" />
            <ResultRow label="Return multiple" value={`${(fv / Math.max(1, invested)).toFixed(2)}×`} tone="muted" />
            <ResultRow label="Value in today's ₹" value={inr(fvToday)} tone="muted" />
          </div>
          <div className="card p-4 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">If withdrawn as a single lump</div>
            <ResultRow label="LTCG tax (12.5% above ₹1.25L exempt)" value={`−${inr(ltcgTax)}`} tone="bad" />
            <ResultRow label="Post-tax value" value={inr(postTaxFv)} tone="good" bold />
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Post-tax figure assumes you sell everything in one year. Redeeming via SWP over multiple years lets you claim the ₹1.25L exemption <em>every</em> year — usually lower total tax. See the SWP calculator.
            </p>
          </div>
          <CalculatorFooter slug="sip" />
        </>
      }
    />
  );
}
