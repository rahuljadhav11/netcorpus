"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { stepSipFutureValue, sipFutureValue, deflateFV, inr } from "@/lib/calc";

export default function StepSipCalc() {
  const [monthly, setMonthly] = useState(10000);
  const [stepPct, setStepPct] = useState(10);
  const [returnPct, setReturnPct] = useState(12);
  const [years, setYears] = useState(20);
  const [inflationPct, setInflationPct] = useState(7);

  const { finalValue, totalInvested } = stepSipFutureValue({
    startingMonthly: monthly,
    annualStepPct: stepPct,
    annualReturnPct: returnPct,
    years,
  });
  const flatFv = sipFutureValue({ monthly, annualReturnPct: returnPct, years });
  const gained = finalValue - totalInvested;
  const stepAdvantage = finalValue - flatFv;
  const finalValueToday = deflateFV(finalValue, inflationPct, years);
  const ltcgTax = Math.max(0, gained - 125000) * 0.125;
  const postTaxFv = finalValue - ltcgTax;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Starting monthly SIP">
            <NumInput value={monthly} onChange={setMonthly} rupee />
          </Field>
          <Field label="Annual step-up (%)" hint="How much you raise your SIP each year — often tied to salary hike">
            <NumInput value={stepPct} onChange={setStepPct} />
          </Field>
          <Field label="Expected annual return (%)">
            <NumInput value={returnPct} onChange={setReturnPct} />
          </Field>
          <Field label="Duration (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Assumed inflation (% p.a.)" hint="For the 'in today's ₹' preview only">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Final value"
            value={inr(finalValue)}
            sub={`~${inr(finalValueToday)} in today's ₹ · ${years} yrs, +${stepPct}%/yr step-up`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Total invested" value={inr(totalInvested)} />
            <ResultRow label="Wealth gained" value={inr(gained)} tone="good" />
            <ResultRow label="Advantage over flat SIP" value={inr(stepAdvantage)} tone="good" bold />
            <ResultRow label="  (flat SIP would give)" value={inr(flatFv)} tone="muted" />
            <ResultRow label="Value in today's ₹" value={inr(finalValueToday)} tone="muted" />
          </div>
          <div className="card p-4 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">If withdrawn as a single lump</div>
            <ResultRow label="LTCG tax (12.5% above ₹1.25L exempt)" value={`−${inr(ltcgTax)}`} tone="bad" />
            <ResultRow label="Post-tax value" value={inr(postTaxFv)} tone="good" bold />
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              For lower tax total, redeem via SWP over multiple years — you get the ₹1.25L exemption every year.
            </p>
          </div>
          <CalculatorFooter slug="step-sip" />
        </>
      }
    />
  );
}
