"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { hraExemption, inr } from "@/lib/calc";

export default function HraCalc() {
  const [basic, setBasic] = useState(600000);
  const [hraReceived, setHraReceived] = useState(240000);
  const [rentPaid, setRentPaid] = useState(300000);
  const [metro, setMetro] = useState(true);

  const { exempt, taxableHra, a, b, c } = hraExemption({
    basicSalary: basic,
    hraReceived,
    rentPaid,
    metroCity: metro,
  });

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Inputs (all annual, ₹)</div>
          <Field label="Basic salary (Basic + DA)">
            <NumInput value={basic} onChange={setBasic} rupee />
          </Field>
          <Field label="HRA received" hint="From salary slip's HRA component">
            <NumInput value={hraReceived} onChange={setHraReceived} rupee />
          </Field>
          <Field label="Actual rent paid">
            <NumInput value={rentPaid} onChange={setRentPaid} rupee />
          </Field>
          <Field label="Metro city (Delhi/Mumbai/Kolkata/Chennai)?">
            <div className="flex gap-2 mt-1">
              <button
                className={`flex-1 text-xs rounded-md px-3 py-2 border ${metro ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-300 text-slate-700"}`}
                onClick={() => setMetro(true)}
              >
                Yes — 50% of Basic
              </button>
              <button
                className={`flex-1 text-xs rounded-md px-3 py-2 border ${!metro ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-slate-300 text-slate-700"}`}
                onClick={() => setMetro(false)}
              >
                No — 40% of Basic
              </button>
            </div>
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label="HRA exemption (tax-free)"
            value={inr(exempt)}
            sub={`Taxable HRA: ${inr(taxableHra)}`}
            tone="good"
            big
          />
          <div className="card p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Exemption is the least of these three:</div>
            <ResultRow label="1. Actual HRA received" value={inr(a)} tone={exempt === a ? "good" : undefined} bold={exempt === a} />
            <ResultRow label={`2. ${metro ? "50%" : "40%"} of Basic`} value={inr(b)} tone={exempt === b ? "good" : undefined} bold={exempt === b} />
            <ResultRow label="3. Rent paid − 10% of Basic" value={inr(c)} tone={exempt === c ? "good" : undefined} bold={exempt === c} />
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Notes:</strong> HRA exemption is only available under the <em>old</em> tax regime. Rent receipts + landlord PAN required if annual rent {'>'} ₹1 lakh. If you don't receive HRA but pay rent, see Section 80GG instead.
          </div>
          <CalculatorFooter slug="hra" />
        </>
      }
    />
  );
}
