"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { goalSip, inflateFV, inr } from "@/lib/calc";

export default function GoalSipCalc() {
  const [target, setTarget] = useState(5000000);
  const [years, setYears] = useState(10);
  const [returnPct, setReturnPct] = useState(12);
  const [existing, setExisting] = useState(0);
  const [targetInTodaysRupees, setTargetInTodaysRupees] = useState(false);
  const [inflationPct, setInflationPct] = useState(7);

  const effectiveTarget = targetInTodaysRupees ? inflateFV(target, inflationPct, years) : target;

  const { requiredMonthly, targetShortfall } = goalSip({
    targetAmount: effectiveTarget,
    years,
    annualReturnPct: returnPct,
    existingCorpus: existing,
  });

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs</div>
          <Field label="Goal amount">
            <NumInput value={target} onChange={setTarget} rupee />
          </Field>
          <label className="flex items-center gap-2 text-xs text-slate-700 mb-3">
            <input type="checkbox" checked={targetInTodaysRupees} onChange={(e) => setTargetInTodaysRupees(e.target.checked)} />
            The goal amount is in today's rupees (auto-inflate)
          </label>
          {targetInTodaysRupees && (
            <Field label="Inflation (% p.a.)">
              <NumInput value={inflationPct} onChange={setInflationPct} />
            </Field>
          )}
          <Field label="Years to goal">
            <NumInput value={years} onChange={setYears} />
          </Field>
          <Field label="Expected SIP return (% p.a.)">
            <NumInput value={returnPct} onChange={setReturnPct} />
          </Field>
          <Field label="Existing corpus for this goal (optional)">
            <NumInput value={existing} onChange={setExisting} rupee />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="Required monthly SIP"
            value={inr(requiredMonthly)}
            sub={`for ${years} years at ${returnPct}% return`}
            tone="primary"
            big
          />
          <div className="card p-4">
            <ResultRow label="Actual goal (nominal)" value={inr(effectiveTarget)} />
            {existing > 0 && (
              <>
                <ResultRow label="Existing corpus grown to goal date" value={inr(effectiveTarget - targetShortfall)} tone="muted" />
                <ResultRow label="Shortfall to fund via SIP" value={inr(targetShortfall)} bold />
              </>
            )}
            <ResultRow label="Total SIP contribution" value={inr(requiredMonthly * 12 * years)} tone="muted" />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Tip:</strong> The longer your horizon, the smaller the monthly SIP needed — thanks to compounding. If the required SIP feels too high, consider either raising the horizon or pairing a lump-sum investment now.
          </div>
          <CalculatorFooter slug="goal-sip" />
        </>
      }
    />
  );
}
