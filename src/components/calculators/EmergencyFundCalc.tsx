"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { inr } from "@/lib/calc";

export default function EmergencyFundCalc() {
  const [monthlyExpense, setMonthlyExpense] = useState(60000);
  const [months, setMonths] = useState(6);
  const [existing, setExisting] = useState(200000);

  const target = monthlyExpense * months;
  const shortfall = Math.max(0, target - existing);
  const coverageMonths = monthlyExpense > 0 ? existing / monthlyExpense : 0;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Monthly essentials (rent, EMIs, food, utilities)" hint="What you'd spend in bare-minimum months">
            <NumInput value={monthlyExpense} onChange={setMonthlyExpense} rupee />
          </Field>
          <Field label="Months of coverage target" hint="6 is standard; 12 if income is variable / single earner">
            <NumInput value={months} onChange={setMonths} />
          </Field>
          <Field label="Current liquid buffer" hint="FD, liquid MF, savings — money you can access in 24-48 hours">
            <NumInput value={existing} onChange={setExisting} rupee />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label={`Target emergency fund (${months} months)`}
            value={inr(target)}
            sub={`Currently covered: ${coverageMonths.toFixed(1)} months`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Target" value={inr(target)} />
            <ResultRow label="Current liquid" value={inr(existing)} />
            <ResultRow label={shortfall > 0 ? "Shortfall" : "Buffer over target"} value={inr(Math.abs(target - existing))} tone={shortfall > 0 ? "bad" : "good"} bold />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Where to keep it:</strong> Split between a high-yield savings account (2–3 months instant access) and a liquid mutual fund (rest, ~6–7%, 1-day redemption). Do NOT keep this money in equity SIPs — it must be there when you need it most (job loss, medical emergency).
          </div>
          <CalculatorFooter slug="emergency-fund" />
        </>
      }
    />
  );
}
