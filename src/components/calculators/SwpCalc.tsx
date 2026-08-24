"use client";

import { useState } from "react";
import NumInput from "../NumInput";
import Shell, { Field, MetricCard, ResultRow, CalculatorFooter } from "./Shell";
import { swp, inr } from "@/lib/calc";

export default function SwpCalc() {
  const [corpus, setCorpus] = useState(10000000);
  const [withdrawal, setWithdrawal] = useState(50000);
  const [returnPct, setReturnPct] = useState(8);
  const [years, setYears] = useState(30);
  const [inflationPct, setInflationPct] = useState(7);
  const [applyInflation, setApplyInflation] = useState(true);
  const [applyTax, setApplyTax] = useState(true);
  const [costBasis, setCostBasis] = useState(6000000);
  const [ltcgRate, setLtcgRate] = useState(12.5);
  const [ltcgExempt, setLtcgExempt] = useState(125000);

  const withInfl = swp({
    initialCorpus: corpus,
    monthlyWithdrawal: withdrawal,
    annualReturnPct: returnPct,
    years,
    annualInflationPct: applyInflation ? inflationPct : 0,
    costBasis: applyTax ? costBasis : corpus, // if tax off, treat everything as basis (no gain)
    ltcgRatePct: applyTax ? ltcgRate : 0,
    ltcgAnnualExemption: ltcgExempt,
  });
  const flat = swp({
    initialCorpus: corpus,
    monthlyWithdrawal: withdrawal,
    annualReturnPct: returnPct,
    years,
    annualInflationPct: 0,
    costBasis: corpus,
    ltcgRatePct: 0,
  });

  const targetMonths = years * 12;
  const lasted = withInfl.monthsLasted >= targetMonths;
  const flatLasted = flat.monthsLasted >= targetMonths;
  const inflEatsMonths = flat.monthsLasted - withInfl.monthsLasted;

  return (
    <Shell
      inputs={
        <div>
          <div className="section-h mb-3">Corpus & withdrawal</div>
          <Field label="Initial corpus">
            <NumInput value={corpus} onChange={setCorpus} rupee />
          </Field>
          <Field label="Monthly expense (today's ₹)" hint="Your current monthly expense. Inflation-adjusts so year-1 withdrawal = this × (1+i).">
            <NumInput value={withdrawal} onChange={setWithdrawal} rupee />
          </Field>
          <Field label="Expected annual return (%)" hint="Post-retirement: 6–8% typical for balanced allocation">
            <NumInput value={returnPct} onChange={setReturnPct} />
          </Field>
          <Field label="Withdrawal duration (years)">
            <NumInput value={years} onChange={setYears} />
          </Field>

          <div className="section-h mt-4 mb-3">Inflation adjustment</div>
          <label className="flex items-center gap-2 text-sm text-slate-700 mb-3">
            <input
              type="checkbox"
              checked={applyInflation}
              onChange={(e) => setApplyInflation(e.target.checked)}
            />
            Withdrawal increases yearly to keep purchasing power
          </label>
          {applyInflation && (
            <Field label="Annual inflation (%)" hint="Withdrawal steps up by this rate once a year. Indian household inflation 6–8%.">
              <NumInput value={inflationPct} onChange={setInflationPct} />
            </Field>
          )}

          <div className="section-h mt-4 mb-3">LTCG tax on withdrawals</div>
          <label className="flex items-center gap-2 text-sm text-slate-700 mb-3">
            <input
              type="checkbox"
              checked={applyTax}
              onChange={(e) => setApplyTax(e.target.checked)}
            />
            Apply LTCG (equity mutual fund SWP)
          </label>
          {applyTax && (
            <>
              <Field label="Cost basis (money invested in the corpus)" hint="How much of the corpus is your contributions vs unrealized gains. Anything above this is gains that attract LTCG when withdrawn.">
                <NumInput value={costBasis} onChange={setCostBasis} rupee />
              </Field>
              <Field label="LTCG rate (%)" hint="12.5% since Union Budget 2024">
                <NumInput value={ltcgRate} onChange={setLtcgRate} />
              </Field>
              <Field label="Annual LTCG exemption" hint="₹1.25L per Budget 2024">
                <NumInput value={ltcgExempt} onChange={setLtcgExempt} rupee />
              </Field>
            </>
          )}
        </div>
      }
      result={
        <>
          <MetricCard
            label={lasted ? "Balance at end of period" : "Corpus runs out"}
            value={lasted ? inr(withInfl.finalBalance) : `at year ${(withInfl.monthsLasted / 12).toFixed(1)}`}
            sub={lasted ? `Lasted the full ${years} years` : `Short of ${years} years`}
            tone={lasted ? "good" : "bad"}
            big
          />

          <div className="card p-4">
            <ResultRow label={applyInflation ? "Year-1 actual withdrawal (inflation-adjusted)" : "Year-1 monthly withdrawal"} value={inr(withInfl.firstMonthlyWithdrawal)} />
            <ResultRow
              label={`Year-${years} monthly withdrawal`}
              value={inr(withInfl.lastMonthlyWithdrawal)}
              tone={applyInflation ? "muted" : undefined}
            />
            <ResultRow label="Total withdrawn (gross)" value={inr(withInfl.totalWithdrawn)} />
            {applyTax && (
              <>
                <ResultRow label="  − LTCG tax paid over horizon" value={`−${inr(withInfl.totalLtcgTax)}`} tone="bad" />
                <ResultRow label="Total received after tax" value={inr(withInfl.netAfterTax)} bold tone="good" />
              </>
            )}
            <ResultRow label="Initial corpus" value={inr(corpus)} tone="muted" />
            <ResultRow label={lasted ? "Balance remaining" : "Balance"} value={lasted ? inr(withInfl.finalBalance) : "₹0"} tone={lasted ? "good" : "bad"} bold />
          </div>

          {applyTax && (
            <div className="card p-4 bg-gradient-to-br from-slate-50 to-white text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">How LTCG on SWP works:</strong> Each monthly withdrawal is treated as a sale of MF units. The gain portion of the withdrawal = withdrawal × (unrealised gains / corpus). Gains are summed each year — anything above the ₹{Math.round(ltcgExempt).toLocaleString("en-IN")} annual exemption is taxed at {ltcgRate}%. SWP has a natural advantage over lump withdrawal: gains are spread across years so you get the exemption every year.
            </div>
          )}

          {applyInflation && (
            <div className="card p-4 bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">
                Impact of ignoring inflation
              </div>
              <ResultRow
                label={`If withdrawal stayed flat at ${inr(withdrawal)}`}
                value={flatLasted ? `lasts all ${years} yrs` : `runs out at ${(flat.monthsLasted / 12).toFixed(1)} yrs`}
              />
              <ResultRow
                label="Inflation-adjusted withdrawal shortens corpus by"
                value={inflEatsMonths > 0 ? `~${(inflEatsMonths / 12).toFixed(1)} years` : "no impact (already lasts)"}
                tone={inflEatsMonths > 0 ? "bad" : "good"}
                bold
              />
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                A flat withdrawal loses buying power every year. At {inflationPct}% inflation, ₹{withdrawal.toLocaleString("en-IN")} today grows to ₹{Math.round(withdrawal * Math.pow(1 + inflationPct / 100, years)).toLocaleString("en-IN")} by year {years} — but a flat SWP still pays out the original amount.
              </p>
            </div>
          )}

          <div className="card p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">How SWP works:</strong> Corpus keeps earning at your assumed return. Each month you pull out your (inflated) withdrawal. If returns beat withdrawal-growth, corpus can even grow. If withdrawal outpaces returns, corpus depletes — sooner with inflation, later without.
          </div>
          <CalculatorFooter slug="swp" />
        </>
      }
    />
  );
}
