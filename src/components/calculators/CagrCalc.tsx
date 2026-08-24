"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { cagr, inr } from "@/lib/calc";

export default function CagrCalc() {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(300000);
  const [years, setYears] = useState(10);

  const rate = cagr(initial, final, years);
  const multiplier = final / Math.max(1, initial);
  const absoluteReturn = ((final - initial) / Math.max(1, initial)) * 100;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Initial value">
            <NumInput value={initial} onChange={setInitial} rupee />
          </Field>
          <Field label="Final value">
            <NumInput value={final} onChange={setFinal} rupee />
          </Field>
          <Field label="Number of years">
            <NumInput value={years} onChange={setYears} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard label="CAGR" value={`${rate.toFixed(2)}%`} sub={`${multiplier.toFixed(2)}× over ${years} years`} tone="primary" big />
          <div className="card p-4">
            <ResultRow label="Absolute return" value={`${absoluteReturn.toFixed(1)}%`} />
            <ResultRow label="Wealth gained" value={inr(final - initial)} tone="good" />
            <ResultRow label="Multiplier" value={`${multiplier.toFixed(2)}×`} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Rule of thumb:</strong> Money doubles in ~72 ÷ rate years. Equity mutual funds have averaged 11–13% CAGR long-term in India. FDs 6–7%. Real estate 6–8%. Gold ~8–9%.
          </div>
          <CalculatorFooter slug="cagr" />
        </>
      }
    />
  );
}
