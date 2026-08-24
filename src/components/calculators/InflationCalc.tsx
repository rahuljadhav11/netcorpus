"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { inflateFV, deflateFV, inr } from "@/lib/calc";

export default function InflationCalc() {
  const [today, setToday] = useState(100000);
  const [inflationPct, setInflationPct] = useState(7);
  const [years, setYears] = useState(20);

  const future = inflateFV(today, inflationPct, years);
  const equivalent = deflateFV(today, inflationPct, years);
  const purchasingPowerLoss = ((today - equivalent) / today) * 100;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Today's amount">
            <NumInput value={today} onChange={setToday} rupee />
          </Field>
          <Field label="Annual inflation (%)" hint="RBI targets 4% but Indian household inflation is 6–8%">
            <NumInput value={inflationPct} onChange={setInflationPct} />
          </Field>
          <Field label="Years to project">
            <NumInput value={years} onChange={setYears} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label={`${inr(today)} in ${years} years costs`}
            value={inr(future)}
            sub={`Same basket at ${inflationPct}% inflation`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label={`Today's ${inr(today)} in ${years} years' rupees`} value={inr(equivalent)} tone="bad" />
            <ResultRow label="Purchasing-power loss" value={`${purchasingPowerLoss.toFixed(1)}%`} tone="bad" bold />
            <ResultRow label="Money needed to keep same lifestyle" value={inr(future)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Why this matters:</strong> Cash sitting in a savings account at 3% loses purchasing power each year. Only investments returning above the inflation rate actually grow your wealth in real terms.
          </div>
          <CalculatorFooter slug="inflation-impact" />
        </>
      }
    />
  );
}
