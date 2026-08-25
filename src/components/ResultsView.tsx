"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlanInputs, ProjectionResult, Scenario, StrategyEvent } from "@/lib/types";
import { inr, monthLabel, deflate } from "@/lib/finance";
import TimelineChart from "./TimelineChart";

interface Props {
  inputs: PlanInputs;
  result: ProjectionResult;
  scenarios: Scenario[];
}

type View = "nominal" | "real";

export default function ResultsView({ inputs, result, scenarios }: Props) {
  const [showYearly, setShowYearly] = useState(false);
  const [tableGrain, setTableGrain] = useState<"year" | "month">("year");
  const [view, setView] = useState<View>("nominal");

  // The engine flags one scenario as isRecommended. Default the selected tab
  // to whichever that is, but also let the user override via the pills.
  const recommendedIdx = useMemo(
    () => Math.max(0, scenarios.findIndex((s) => s.isRecommended)),
    [scenarios],
  );
  const [activeScenario, setActiveScenario] = useState<number>(recommendedIdx);
  const [userPicked, setUserPicked] = useState(false);

  // If inputs change enough to move the winner, follow it — unless the user
  // has explicitly picked a tab. Also clamp when scenarios shrink.
  useEffect(() => {
    if (!userPicked) {
      setActiveScenario(recommendedIdx);
    } else if (activeScenario >= scenarios.length) {
      setActiveScenario(recommendedIdx);
      setUserPicked(false);
    }
  }, [recommendedIdx, userPicked, activeScenario, scenarios.length]);

  const currentScenario = scenarios[activeScenario] ?? { result, label: "", description: "" };
  const r = currentScenario.result;
  const yearsToRetire = Math.max(0, inputs.retirementAge - inputs.currentAge);

  // Choose display values based on nominal/real toggle.
  const disp = (nominal: number, real: number) => (view === "real" ? real : nominal);
  const shortfallVal = disp(r.surplusOrShortfall, r.real.surplusOrShortfall);
  const shortfallPositive = shortfallVal >= 0;

  const debtFreeLabel = r.debtFreeMonthIndex !== null
    ? monthLabel(r.debtFreeMonthIndex)
    : "Not within horizon";
  const hasOtherAssets = r.yearly.some((y) => y.otherAssetsBalance > 0);

  const downloadCsv = () => {
    const rows = [
      ["Year offset","Age","Income (yr)","Expense (yr)","EMI paid","Surplus","SIP contrib","SIP balance","EPF balance","EPS balance","Other assets","Loan balance","Equity corpus"],
      ...r.yearly.map((y) => [
        y.yearOffset,
        y.age.toFixed(0),
        Math.round(y.salary + y.otherIncome),
        Math.round(y.expense),
        Math.round(y.emiPaid),
        Math.round(y.surplus),
        Math.round(y.sipContribution),
        Math.round(y.sipBalance),
        Math.round(y.epfBalance),
        Math.round(y.epsBalance),
        Math.round(y.otherAssetsBalance),
        Math.round(y.totalLoanBalance),
        Math.round(y.totalCorpus),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finplan-yearly.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Recommendation banner */}
      {scenarios.some((s) => s.isRecommended) && (
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-4 flex items-start gap-3">
          <span className="inline-flex w-8 h-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-white text-sm">★</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">Recommended for your numbers</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {scenarios.find((s) => s.isRecommended)?.label}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {scenarios.find((s) => s.isRecommended)?.description}
            </p>
            {(() => {
              const rec = scenarios.find((s) => s.isRecommended);
              if (!rec || !rec.deltaOverRunnerUp || rec.deltaOverRunnerUp <= 0) return null;
              return (
                <div className="text-xs text-emerald-800 mt-1">
                  ≈ {inr(rec.deltaOverRunnerUp)} more net corpus than the next best strategy.
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Strategy + view toggles */}
      <div className="card p-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="section-h mr-1">Strategy</span>
          {scenarios.map((s, i) => (
            <button
              key={s.mode}
              onClick={() => { setActiveScenario(i); setUserPicked(true); }}
              className={
                "text-xs rounded-full px-3 py-1 border transition inline-flex items-center gap-1 " +
                (activeScenario === i
                  ? "bg-brand-600 border-brand-600 text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50")
              }
              title={s.description}
            >
              {s.isRecommended && <span aria-hidden>★</span>}
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Show as</span>
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
            <button
              className={`text-xs px-3 py-1 rounded ${view === "nominal" ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"}`}
              onClick={() => setView("nominal")}
              title={`Future rupees — the actual amount in your bank at age ${inputs.retirementAge}, prices will be higher by then`}
            >
              Future ₹
            </button>
            <button
              className={`text-xs px-3 py-1 rounded ${view === "real" ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"}`}
              onClick={() => setView("real")}
              title="Adjusted for inflation — what that money feels like in today's buying power"
            >
              Today's ₹
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        <SummaryCard
          label="🏖️ Savings at retirement"
          value={inr(disp(r.corpusAtRetirement, r.real.corpusAtRetirement))}
          sub={`total saved · at age ${inputs.retirementAge}`}
        />
        <SummaryCard
          label="🎯 How much you'll need"
          value={inr(disp(r.targetCorpus, r.real.targetCorpus))}
          sub={`to cover ${inputs.lifeExpectancy - inputs.retirementAge} years of retirement`}
        />
        <SummaryCard
          label={shortfallPositive ? "✅ You're ahead" : "⚠️ Gap to fill"}
          value={inr(Math.abs(shortfallVal))}
          sub={
            shortfallPositive
              ? `On track · ~${inr(disp(r.corpusAtLifeExpectancy, r.real.corpusAtLifeExpectancy))} still left at age ${inputs.lifeExpectancy}`
              : "Try saving more or retiring a few years later"
          }
          tone={shortfallPositive ? "good" : "bad"}
        />
      </div>

      {/* Tax + pension breakdown */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-slate-900">💼 What you'll have at retirement</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Tax applied on gains
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Left — asset breakdown */}
          <div className="space-y-1">
            {/* SIP / MF */}
            <BreakdownRow emoji="📊" label="Mutual fund / SIP savings" value={disp(r.tax.sipBalance, deflate(r.tax.sipBalance, inputs.inflationPct, yearsToRetire))} />
            <BreakdownSubRow emoji="📈" label={`Profit earned`} value={disp(r.tax.sipGains, deflate(r.tax.sipGains, inputs.inflationPct, yearsToRetire))} />
            {r.tax.ltcgTax > 0 && (
              <BreakdownSubRow emoji="🔻" label={`Tax on profit (${inputs.ltcgRatePct}% LTCG)`} value={disp(-r.tax.ltcgTax, -deflate(r.tax.ltcgTax, inputs.inflationPct, yearsToRetire))} negative />
            )}

            {/* EPF */}
            {r.tax.epfBalance > 0 && (
              <BreakdownRow emoji="🛡️" label="EPF savings (tax-free)" value={disp(r.tax.epfBalance, deflate(r.tax.epfBalance, inputs.inflationPct, yearsToRetire))} />
            )}

            {/* Existing other assets merged at retirement */}
            {r.existingAssetValuesAtRetirement.map((a, i) => (
              <BreakdownRow key={i} emoji={assetEmoji(a.assetClass)} label={a.name} value={disp(a.value, deflate(a.value, inputs.inflationPct, yearsToRetire))} />
            ))}

            {/* NPS */}
            {r.tax.npsLumpSum > 0 && (
              <>
                <BreakdownRow emoji="🔵" label="NPS payout (60%, tax-free)" value={disp(r.tax.npsLumpSum, deflate(r.tax.npsLumpSum, inputs.inflationPct, yearsToRetire))} />
                <BreakdownSubRow emoji="💙" label="NPS pension fund (40%, pays monthly)" value={disp(r.tax.npsAnnuityCorpus, deflate(r.tax.npsAnnuityCorpus, inputs.inflationPct, yearsToRetire))} />
              </>
            )}

            {/* Loan payoff */}
            {r.lumpCloseAmount > 0 && (
              <BreakdownRow emoji="🔗" label="Used to clear remaining loans" value={disp(-r.lumpCloseAmount, -deflate(r.lumpCloseAmount, inputs.inflationPct, yearsToRetire))} negative />
            )}

            {/* Total */}
            <div className="mt-3 pt-3 border-t-2 border-slate-200 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">💰 Money you can spend</span>
              <span className="text-lg font-bold text-brand-700 tabular-nums">
                {inr(disp(r.tax.netCorpus - r.lumpCloseAmount, r.real.netCorpus - deflate(r.lumpCloseAmount, inputs.inflationPct, yearsToRetire)))}
              </span>
            </div>
          </div>

          {/* Right — monthly income streams */}
          <div className="space-y-2">
            {r.tax.epsMonthlyPension > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <div className="text-[10px] uppercase tracking-wider text-amber-700 font-medium">🏅 Government pension (EPS)</div>
                <div className="text-lg font-semibold text-amber-900 mt-0.5">
                  {inr(disp(r.tax.epsMonthlyPension, r.real.epsMonthlyPension))} <span className="text-xs font-normal text-amber-700">/ month for life</span>
                </div>
              </div>
            )}
            {r.tax.npsMonthlyPension > 0 && (
              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                <div className="text-[10px] uppercase tracking-wider text-indigo-700 font-medium">🔵 NPS monthly pension</div>
                <div className="text-lg font-semibold text-indigo-900 mt-0.5">
                  {inr(disp(r.tax.npsMonthlyPension, r.real.npsMonthlyPension))} <span className="text-xs font-normal text-indigo-700">/ month for life</span>
                </div>
              </div>
            )}
            {r.tax.otherRetirementIncome > 0 && (
              <div className="rounded-lg bg-teal-50 border border-teal-100 p-3">
                <div className="text-[10px] uppercase tracking-wider text-teal-700 font-medium">🏠 Other monthly income at retirement</div>
                <div className="text-lg font-semibold text-teal-900 mt-0.5">
                  {inr(disp(r.tax.otherRetirementIncome, deflate(r.tax.otherRetirementIncome, inputs.inflationPct, yearsToRetire)))} <span className="text-xs font-normal text-teal-700">/ month (rental, freelance, etc.)</span>
                </div>
              </div>
            )}
            {r.tax.epsMonthlyPension + r.tax.npsMonthlyPension + r.tax.otherRetirementIncome === 0 && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                💡 No regular income added for retirement. Try enabling NPS or adding rental income — it reduces how much you need to save.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategy playback — how this specific strategy plays out */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-900">📖 How "{currentScenario.label}" plays out</h3>
            <p className="text-xs text-slate-500 mt-0.5">{(currentScenario as Scenario).description}</p>
          </div>
        </div>
        <ol className="space-y-3">
          {r.narrative.map((ev, i) =>
            ev.kind === "withdrawal" ? (
              <WithdrawalCard key={i} event={ev} result={r} inputs={inputs} isLast={i === r.narrative.length - 1} />
            ) : (
              <NarrativeItem key={i} event={ev} isLast={i === r.narrative.length - 1} />
            )
          )}
        </ol>
      </div>

      {/* Debt-free + total interest */}
      <div className="card p-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-xs text-slate-500">🗓️ All loans paid off by</div>
          <div className="text-lg font-semibold">{debtFreeLabel}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 text-right">💸 Total interest you'll pay</div>
          <div className="text-lg font-semibold text-right">{inr(r.totalInterestPaid)}</div>
        </div>
      </div>

      {/* Timeline chart */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900">📈 How your money grows over time</h3>
          <span className="text-xs text-slate-500">Future ₹ (not adjusted for inflation)</span>
        </div>
        <TimelineChart result={r} />
      </div>

      {/* Loan closures */}
      <div className="card p-4">
        <h3 className="font-semibold text-slate-900 mb-2">🏦 When your loans will be paid off</h3>
        {r.loanClosures.length === 0 ? (
          <p className="text-sm text-slate-500">No loans closed within this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Loan</th>
                  <th className="py-2 pr-4">Closes in</th>
                  <th className="py-2 pr-4">Interest paid</th>
                </tr>
              </thead>
              <tbody>
                {r.loanClosures.sort((a, b) => a.monthIndex - b.monthIndex).map((c) => (
                  <tr key={c.loanId} className="border-t border-slate-100">
                    <td className="py-2 pr-4">{c.name}</td>
                    <td className="py-2 pr-4">
                      {c.monthLabel}
                      <span className="text-slate-400 text-xs ml-1">(month {c.monthIndex + 1})</span>
                    </td>
                    <td className="py-2 pr-4">{inr(c.totalInterestPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Year-by-year / Month-by-month detail */}
      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <h3 className="font-semibold text-slate-900">
            🗂️ Detailed {tableGrain === "year" ? "yearly" : "monthly"} breakdown
          </h3>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                className={`px-2.5 py-1 rounded ${tableGrain === "year" ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"}`}
                onClick={() => setTableGrain("year")}
              >
                Yearly
              </button>
              <button
                className={`px-2.5 py-1 rounded ${tableGrain === "month" ? "bg-white shadow font-medium text-slate-900" : "text-slate-500"}`}
                onClick={() => setTableGrain("month")}
              >
                Monthly
              </button>
            </div>
            <button className="btn-outline text-xs" onClick={() => setShowYearly((s) => !s)}>
              {showYearly ? "Hide" : "Show"} table
            </button>
            <button className="btn-outline text-xs" onClick={downloadCsv}>Download CSV</button>
          </div>
        </div>
        {showYearly && tableGrain === "year" && (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="text-slate-500 sticky top-0 bg-white">
                <tr>
                  <th className="py-2 pr-3 text-left">Age</th>
                  <th className="py-2 pr-3 text-right">Income/yr</th>
                  <th className="py-2 pr-3 text-right">Expense/yr</th>
                  <th className="py-2 pr-3 text-right">EMI paid</th>
                  <th className="py-2 pr-3 text-right">SIP contrib.</th>
                  <th className="py-2 pr-3 text-right">Loan bal.</th>
                  {hasOtherAssets && <th className="py-2 pr-3 text-right">Other assets</th>}
                  <th className="py-2 pr-3 text-right">Equity corpus</th>
                </tr>
              </thead>
              <tbody>
                {r.yearly.map((y) => {
                  const yrsFromNow = y.yearOffset + 1;
                  const adjust = (n: number) =>
                    view === "real" ? deflate(n, inputs.inflationPct, yrsFromNow) : n;
                  return (
                    <tr key={y.yearOffset} className="border-t border-slate-100">
                      <td className="py-1.5 pr-3">{y.age.toFixed(0)}</td>
                      <td className="py-1.5 pr-3 text-right">{inr(adjust(y.salary + y.otherIncome))}</td>
                      <td className="py-1.5 pr-3 text-right">{inr(adjust(y.expense))}</td>
                      <td className="py-1.5 pr-3 text-right">{inr(adjust(y.emiPaid))}</td>
                      <td className="py-1.5 pr-3 text-right">{inr(adjust(y.sipContribution))}</td>
                      <td className="py-1.5 pr-3 text-right">{inr(adjust(y.totalLoanBalance))}</td>
                      {hasOtherAssets && <td className="py-1.5 pr-3 text-right text-amber-700">{inr(adjust(y.otherAssetsBalance))}</td>}
                      <td className="py-1.5 pr-3 text-right font-medium">{inr(adjust(y.totalCorpus))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {showYearly && tableGrain === "month" && (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="text-slate-500 sticky top-0 bg-white">
                <tr>
                  <th className="py-2 pr-3 text-left">Month</th>
                  <th className="py-2 pr-3 text-left">Age</th>
                  <th className="py-2 pr-3 text-right">Income</th>
                  <th className="py-2 pr-3 text-right">Expense</th>
                  <th className="py-2 pr-3 text-right">EMI</th>
                  <th className="py-2 pr-3 text-right">SIP</th>
                  <th className="py-2 pr-3 text-right">Loan bal.</th>
                  {hasOtherAssets && <th className="py-2 pr-3 text-right">Other assets</th>}
                  <th className="py-2 pr-3 text-right">Equity corpus</th>
                </tr>
              </thead>
              <tbody>
                {r.monthly.map((mS) => {
                  const yrsFromNow = mS.monthIndex / 12;
                  const adjust = (n: number) =>
                    view === "real" ? deflate(n, inputs.inflationPct, yrsFromNow) : n;
                  return (
                    <tr key={mS.monthIndex} className="border-t border-slate-100">
                      <td className="py-1 pr-3 text-slate-600">{monthLabel(mS.monthIndex)}</td>
                      <td className="py-1 pr-3 text-slate-600 tabular-nums">{Math.floor(mS.age)}y {(mS.monthIndex % 12) + 1}m</td>
                      <td className="py-1 pr-3 text-right">{inr(adjust(mS.salary + mS.otherIncome))}</td>
                      <td className="py-1 pr-3 text-right">{inr(adjust(mS.expense))}</td>
                      <td className="py-1 pr-3 text-right">{inr(adjust(mS.loanPayments))}</td>
                      <td className="py-1 pr-3 text-right">{inr(adjust(mS.sipContribution))}</td>
                      <td className="py-1 pr-3 text-right">{inr(adjust(mS.totalLoanBalance))}</td>
                      {hasOtherAssets && <td className="py-1 pr-3 text-right text-amber-700">{inr(adjust(mS.otherAssetsBalance))}</td>}
                      <td className="py-1 pr-3 text-right font-medium">{inr(adjust(mS.totalCorpus))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {showYearly && tableGrain === "month" && (
          <p className="text-[11px] text-slate-500 mt-2">
            Showing {r.monthly.length} months. Scroll inside the table to browse. The CSV download uses yearly rows.
          </p>
        )}
      </div>

      {/* Annual events summary — silent in narrative, surfaced here for clarity */}
      {r.annualEventSummary.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">✈️ Your travel & events plan</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              auto-deducted from savings each year
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-1.5 pr-3">Event</th>
                  <th className="py-1.5 pr-3 text-right">Trips</th>
                  <th className="py-1.5 pr-3 text-right">First → Last</th>
                  <th className="py-1.5 pr-3 text-right">Cost first → last</th>
                  <th className="py-1.5 pr-3 text-right">Lifetime total</th>
                </tr>
              </thead>
              <tbody>
                {r.annualEventSummary.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="py-1.5 pr-3">{s.name}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{s.count}</td>
                    <td className="py-1.5 pr-3 text-right text-slate-600">age {s.firstAge} → {s.lastAge}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{inr(s.firstCost)} → {inr(s.lastCost)}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums font-medium">{inr(s.totalNominal)}</td>
                  </tr>
                ))}
                <tr className="border-t border-slate-200">
                  <td className="py-1.5 pr-3 font-semibold">Total</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums font-semibold">{r.annualEventSummary.reduce((s, e) => s + e.count, 0)}</td>
                  <td />
                  <td />
                  <td className="py-1.5 pr-3 text-right tabular-nums font-semibold text-brand-700">{inr(r.totalAnnualEventCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Each trip's cost is taken out of your savings at year-end. The money stays invested until then, which earns a little extra compared to setting it aside monthly.
          </p>
        </div>
      )}

      {/* What else to consider */}
      <div className="card p-4 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="font-semibold text-slate-900 mb-2">💡 Worth knowing (not in this plan)</h3>
        <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
          <li className="flex gap-2"><span className="text-brand-600 font-semibold">·</span> <span><strong>PPF & Sukanya Samriddhi:</strong> Long-term, tax-free government savings at ~7–8% returns. Add them in the "Existing assets" section so this plan includes them.</span></li>
          <li className="flex gap-2"><span className="text-brand-600 font-semibold">·</span> <span><strong>Health costs in retirement:</strong> Medical bills and insurance premiums typically 3–4× higher after age 60. Add an extra ₹15,000–30,000/month to your retirement expense estimate.</span></li>
          <li className="flex gap-2"><span className="text-brand-600 font-semibold">·</span> <span><strong>Term life insurance:</strong> If your family depends on your income, a cover of 10–15× your annual salary is a common starting point. Include the yearly premium in your expense breakdown.</span></li>
          <li className="flex gap-2"><span className="text-brand-600 font-semibold">·</span> <span><strong>Sovereign Gold Bonds (SGB):</strong> You earn 2.5% interest per year plus gold price gains, and there's no tax when you hold to maturity. Many people keep 5–10% of their savings in gold.</span></li>
          <li className="flex gap-2"><span className="text-brand-600 font-semibold">·</span> <span><strong>Emergency fund:</strong> Keep 6–12 months of expenses in a savings account or FD — separate from your retirement savings — for unexpected costs.</span></li>
          <li className="flex gap-2"><span className="text-brand-600 font-semibold">·</span> <span><strong>Your salary here is take-home pay:</strong> Tax is already deducted before you receive it. No need to deduct it again.</span></li>
        </ul>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        This is an estimate based on what you've entered — not financial advice. Real returns, interest rates, and tax rules change over time.
        Assumes {inputs.ltcgRatePct}% tax on mutual fund profits above ₹{(inputs.ltcgAnnualExemption / 100000).toFixed(2)}L/year (Budget 2024),
        EPF pension formula with ₹{inputs.epfDetails.epsWageCeiling.toLocaleString("en-IN")} wage cap, and {inputs.nps.annuityReturn}% NPS annuity return.
        Talk to a SEBI-registered advisor before making major financial decisions.
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "bad";
}) {
  const gradient =
    tone === "good"
      ? "from-emerald-50 to-white"
      : tone === "bad"
        ? "from-rose-50 to-white"
        : "from-brand-50 to-white";
  const valueCls =
    tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-rose-700" : "text-slate-900";
  return (
    <div className={`card p-4 bg-gradient-to-b ${gradient}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-2xl font-semibold mt-1 tabular-nums ${valueCls}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

/** Lightweight **bold** parser for narrative strings. Splits on **...** and
 *  wraps the enclosed text in a <strong>. Keeps everything else as text. */
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-900">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function NarrativeItem({ event, isLast }: { event: StrategyEvent; isLast: boolean }) {
  const meta = kindMeta(event.kind);
  const monthDate = monthLabel(event.monthIndex);
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center flex-none">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${meta.bg}`}>
          {meta.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
      </div>
      <div className="flex-1 min-w-0 pb-3">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-semibold text-slate-900">{event.title}</span>
          <span className="text-[11px] text-slate-500">
            {monthDate} · age {event.age.toFixed(1)}
          </span>
        </div>
        {event.detail && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{renderBold(event.detail)}</p>
        )}
      </div>
    </li>
  );
}

function kindMeta(k: StrategyEvent["kind"]) {
  switch (k) {
    case "start":        return { bg: "bg-slate-500",   icon: "▶" };
    case "loan-close":   return { bg: "bg-emerald-600", icon: "✓" };
    case "loan-close-lump": return { bg: "bg-amber-600", icon: "⚑" };
    case "goal":         return { bg: "bg-purple-600",  icon: "🎯" };
    case "sip-start":    return { bg: "bg-brand-600",   icon: "↗" };
    case "retirement":   return { bg: "bg-brand-700",   icon: "★" };
    case "withdrawal":   return { bg: "bg-brand-700",   icon: "🏖️" };
    case "warning":      return { bg: "bg-rose-600",    icon: "⚠" };
    default:             return { bg: "bg-slate-500",   icon: "·" };
  }
}

function WithdrawalCard({
  event, result: r, inputs, isLast,
}: {
  event: StrategyEvent;
  result: ProjectionResult;
  inputs: PlanInputs;
  isLast: boolean;
}) {
  const meta = kindMeta(event.kind);
  const monthDate = monthLabel(event.monthIndex);

  const yrsToRet = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const yearsInRet = Math.max(1, inputs.lifeExpectancy - inputs.retirementAge);

  // Passive income at retirement
  const totalPassive = r.tax.epsMonthlyPension + r.tax.npsMonthlyPension + r.tax.otherRetirementIncome;

  // Monthly expense from the first post-retirement snapshot
  const retSnap = r.monthly[r.retirementMonthIndex];
  const baseExpense = retSnap?.expense ?? 0;
  const eventBudget = inputs.annualEvents
    .filter((e) => e.untilAge > inputs.retirementAge)
    .reduce((s, e) => s + (e.annualCost / e.frequencyYears / 12) * Math.pow(1 + e.inflationPct / 100, yrsToRet), 0);
  const totalExpense = baseExpense + eventBudget;
  const drawFromCorpus = Math.max(0, totalExpense - totalPassive);
  const spendableCorpus = r.tax.netCorpus - r.lumpCloseAmount;

  // Corpus longevity
  const survived = r.corpusExhaustedMonthIndex === null;
  const exhaustedAge = r.corpusExhaustedMonthIndex !== null
    ? (inputs.currentAge + r.corpusExhaustedMonthIndex / 12).toFixed(0)
    : null;

  // Other assets grown from retirement to life expectancy
  const otherAssetsAtLE = r.existingAssetValuesAtRetirement.map((a) => ({
    ...a,
    valueAtLE: a.value * Math.pow(1 + a.annualReturnPct / 100, yearsInRet),
  }));

  // Corpus at LE (today's ₹)
  const corpusAtLEReal = r.real.corpusAtLifeExpectancy;

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center flex-none">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-base ${meta.bg}`}>
          {meta.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
      </div>

      <div className="flex-1 min-w-0 pb-3">
        <div className="flex flex-wrap items-baseline gap-x-2 mb-2">
          <span className="text-sm font-semibold text-slate-900">{event.title}</span>
          <span className="text-[11px] text-slate-500">{monthDate} · age {event.age.toFixed(0)}</span>
        </div>

        {/* Monthly budget strip */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Monthly picture</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[100px] rounded-md bg-white border border-slate-200 px-3 py-2 text-center">
              <div className="text-[10px] text-slate-500 mb-0.5">Total spend</div>
              <div className="text-sm font-semibold text-slate-800">{inr(totalExpense)}</div>
              <div className="text-[10px] text-slate-400">per month</div>
            </div>
            {totalPassive > 0 && (
              <div className="flex-1 min-w-[100px] rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-center">
                <div className="text-[10px] text-emerald-700 mb-0.5">Pension / income</div>
                <div className="text-sm font-semibold text-emerald-700">{inr(totalPassive)}</div>
                <div className="text-[10px] text-emerald-600">auto-covered</div>
              </div>
            )}
            <div className="flex-1 min-w-[100px] rounded-md bg-brand-50 border border-brand-200 px-3 py-2 text-center">
              <div className="text-[10px] text-brand-700 mb-0.5">From savings</div>
              <div className="text-sm font-semibold text-brand-700">{inr(drawFromCorpus)}</div>
              <div className="text-[10px] text-brand-600">from ₹{inr(spendableCorpus)} pot</div>
            </div>
          </div>

          {/* Corpus longevity */}
          <div className={`rounded-md px-3 py-2 flex items-center gap-2 ${survived ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
            <span className="text-base">{survived ? "✅" : "⚠️"}</span>
            <div>
              {survived ? (
                <>
                  <p className="text-xs font-medium text-emerald-800">
                    Corpus survives to age {inputs.lifeExpectancy} — your full life expectancy
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {inr(r.corpusAtLifeExpectancy)} still in the pot at {inputs.lifeExpectancy}
                    {corpusAtLEReal > 0 ? ` · ${inr(corpusAtLEReal)} in today's ₹` : ""}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-rose-800">
                    Corpus runs out around age {exhaustedAge} — short of {inputs.lifeExpectancy}
                  </p>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Save more, retire later, or trim retirement expenses
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Other assets at life expectancy */}
          {otherAssetsAtLE.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Other assets at age {inputs.lifeExpectancy} (estimated)
              </p>
              <div className="flex flex-wrap gap-2">
                {otherAssetsAtLE.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-md bg-white border border-slate-200 px-2.5 py-1.5 text-xs">
                    <span>{assetEmoji(a.assetClass)}</span>
                    <span className="text-slate-600">{a.name}</span>
                    <span className="font-semibold text-slate-800">{inr(a.valueAtLE)}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Grown at each asset&apos;s own rate for {yearsInRet} years from retirement value · illiquid, not counted in corpus
              </p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function BreakdownRow({ emoji, label, value, negative }: { emoji: string; label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="flex items-center gap-2 text-sm text-slate-800">
        <span className="text-base leading-none w-5 flex-none">{emoji}</span>
        {label}
      </span>
      <span className={`tabular-nums text-sm font-medium pl-3 flex-none ${negative ? "text-rose-600" : "text-emerald-700"}`}>
        {negative ? "−" : "+"}{inr(Math.abs(value))}
      </span>
    </div>
  );
}

function BreakdownSubRow({ emoji, label, value, negative }: { emoji: string; label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 ml-7 pl-2 border-l-2 border-slate-200">
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="leading-none w-4 flex-none">{emoji}</span>
        {label}
      </span>
      <span className={`tabular-nums text-xs pl-3 flex-none ${negative ? "text-rose-500" : "text-slate-500"}`}>
        {negative ? "−" : "+"}{inr(Math.abs(value))}
      </span>
    </div>
  );
}

function assetEmoji(assetClass: string): string {
  const map: Record<string, string> = {
    equity: "📊", gold: "🪙", ppf: "🏛️", "real-estate": "🏡", fd: "🏦", other: "💼",
  };
  return map[assetClass] ?? "💼";
}
