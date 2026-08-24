"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { rentVsBuy, inr } from "@/lib/calc";

export default function RentVsBuyCalc() {
  const [price, setPrice] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [loanRatePct, setLoanRatePct] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(35000);
  const [rentGrowthPct, setRentGrowthPct] = useState(7);
  const [propertyAppreciationPct, setPropertyAppreciationPct] = useState(6);
  const [investmentReturnPct, setInvestmentReturnPct] = useState(12);
  const [maintenancePct, setMaintenancePct] = useState(0.5);
  const [annualTax, setAnnualTax] = useState(15000);
  const [horizonYears, setHorizonYears] = useState(10);

  const r = rentVsBuy({
    propertyPrice: price,
    downPayment,
    homeLoanRatePct: loanRatePct,
    homeLoanYears: loanYears,
    monthlyRent,
    rentGrowthPct,
    propertyAppreciationPct,
    investmentReturnPct,
    annualMaintenancePctOfPrice: maintenancePct,
    annualPropertyTax: annualTax,
    horizonYears,
  });

  const buyerWins = r.delta > 0;

  return (
    <Shell
      inputs={
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <div className="section-h mb-3">Buying scenario</div>
          <Field label="Property price">
            <NumInput value={price} onChange={setPrice} rupee />
          </Field>
          <Field label="Down payment">
            <NumInput value={downPayment} onChange={setDownPayment} rupee />
          </Field>
          <Field label="Home loan rate (% p.a.)">
            <NumInput value={loanRatePct} onChange={setLoanRatePct} />
          </Field>
          <Field label="Loan tenure (years)">
            <NumInput value={loanYears} onChange={setLoanYears} />
          </Field>
          <Field label="Property appreciation (% p.a.)" hint="Indian residential real estate: 4–7% long-term">
            <NumInput value={propertyAppreciationPct} onChange={setPropertyAppreciationPct} />
          </Field>
          <Field label="Annual maintenance (% of property)">
            <NumInput value={maintenancePct} onChange={setMaintenancePct} />
          </Field>
          <Field label="Annual property tax">
            <NumInput value={annualTax} onChange={setAnnualTax} rupee />
          </Field>

          <div className="section-h mt-4 mb-3">Renting scenario</div>
          <Field label="Monthly rent for equivalent home">
            <NumInput value={monthlyRent} onChange={setMonthlyRent} rupee />
          </Field>
          <Field label="Rent hike (% p.a.)" hint="Landlords typically hike 5–10% annually">
            <NumInput value={rentGrowthPct} onChange={setRentGrowthPct} />
          </Field>
          <Field label="Investment return on saved capital (% p.a.)" hint="Where you'd invest the down-payment + EMI-rent surplus">
            <NumInput value={investmentReturnPct} onChange={setInvestmentReturnPct} />
          </Field>

          <div className="section-h mt-4 mb-3">Horizon</div>
          <Field label="Years you'll stay in this home">
            <NumInput value={horizonYears} onChange={setHorizonYears} />
          </Field>
        </div>
      }
      result={
        <>
          <MetricCard
            label={buyerWins ? "Buy wins" : "Rent wins"}
            value={inr(Math.abs(r.delta))}
            sub={`Net-worth difference after ${horizonYears} years`}
            tone={buyerWins ? "good" : "bad"}
            big
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <div className={`card p-4 ${buyerWins ? "border-emerald-300 bg-emerald-50/30" : ""}`}>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Buyer {buyerWins && "★"}</div>
              <ResultRow label="Monthly EMI" value={inr(r.emi)} />
              <ResultRow label="Property value at horizon" value={inr(r.propertyValueAtHorizon)} />
              <ResultRow label="Loan outstanding at horizon" value={inr(r.loanOutstandingAtHorizon)} tone="bad" />
              <ResultRow label="Net worth" value={inr(r.buyerNetWorth)} bold />
            </div>
            <div className={`card p-4 ${!buyerWins ? "border-emerald-300 bg-emerald-50/30" : ""}`}>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Renter {!buyerWins && "★"}</div>
              <ResultRow label="Down payment invested" value={inr(downPayment)} />
              <ResultRow label={`Investment return`} value={`${investmentReturnPct}% p.a.`} tone="muted" />
              <ResultRow label="Net worth" value={inr(r.renterNetWorth)} bold />
            </div>
          </div>
          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">What tips it:</strong> Long horizon + high property appreciation + low rent-to-price ratio → buying wins. Short stay + low appreciation + high investment returns → renting wins. Rule of thumb: if <em>annual rent &lt; 3% of property price</em>, renting is usually mathematically better; over 5%, buying is. Doesn't factor emotional value, forced savings discipline, or stamp duty / registration (~5–7% of price at purchase).
          </div>
          <CalculatorFooter slug="rent-vs-buy" />
        </>
      }
    />
  );
}
