"use client";

import type { PlanInputs, LoanInput, LoanType, PayoffStrategy, OtherIncome, LifeGoal, AnnualEvent, IncomeFrequency, ExistingAsset, AssetClass } from "@/lib/types";
import { otherIncomeMonthly, ASSET_CLASS_DEFAULTS } from "@/lib/types";
import { useState } from "react";
import ExpenseBreakdownForm from "./ExpenseBreakdown";
import NumInput from "./NumInput";
import CashflowSummary from "./CashflowSummary";
import { epsMonthlyPension, inr, npsPayout } from "@/lib/finance";

interface Props {
  value: PlanInputs;
  onChange: (v: PlanInputs) => void;
}

export default function InputsForm({ value, onChange }: Props) {
  const set = <K extends keyof PlanInputs>(key: K, v: PlanInputs[K]) =>
    onChange({ ...value, [key]: v });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTax, setShowTax] = useState(false);

  const addLoan = () => {
    const id = `loan-${Date.now()}`;
    onChange({
      ...value,
      loans: [
        ...value.loans,
        { id, name: "New Loan", type: "fixed", principal: 100000, annualRate: 12, emi: 5000 },
      ],
    });
  };
  const updateLoan = (id: string, patch: Partial<LoanInput>) => {
    onChange({
      ...value,
      loans: value.loans.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  };
  const removeLoan = (id: string) => {
    onChange({ ...value, loans: value.loans.filter((l) => l.id !== id) });
  };

  const addIncome = (preset?: Partial<OtherIncome>) => {
    const id = `inc-${Date.now()}`;
    const defaults: OtherIncome = {
      id,
      name: "Rental income",
      amount: 25000,
      frequency: "monthly",
      growthPct: 5,
      activeInRetirement: true,
    };
    onChange({ ...value, otherIncomes: [...value.otherIncomes, { ...defaults, ...preset, id }] });
  };
  const updateIncome = (id: string, patch: Partial<OtherIncome>) =>
    onChange({ ...value, otherIncomes: value.otherIncomes.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  const removeIncome = (id: string) =>
    onChange({ ...value, otherIncomes: value.otherIncomes.filter((i) => i.id !== id) });

  const addGoal = (preset?: Partial<LifeGoal>) => {
    const id = `goal-${Date.now()}`;
    const defaults: LifeGoal = {
      id,
      name: "Kids' higher education",
      targetAge: Math.min(value.retirementAge - 1, value.currentAge + 14),
      currentCost: 3000000,
      inflationPct: 10,
    };
    onChange({ ...value, lifeGoals: [...value.lifeGoals, { ...defaults, ...preset, id }] });
  };
  const updateGoal = (id: string, patch: Partial<LifeGoal>) =>
    onChange({ ...value, lifeGoals: value.lifeGoals.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
  const removeGoal = (id: string) =>
    onChange({ ...value, lifeGoals: value.lifeGoals.filter((g) => g.id !== id) });

  const addAnnual = (preset?: Partial<AnnualEvent>) => {
    const id = `evt-${Date.now()}`;
    const defaults: AnnualEvent = {
      id,
      name: "India trip",
      annualCost: 50000,
      inflationPct: 7,
      frequencyYears: 1,
      untilAge: 60,
    };
    onChange({ ...value, annualEvents: [...value.annualEvents, { ...defaults, ...preset, id }] });
  };
  const updateAnnual = (id: string, patch: Partial<AnnualEvent>) =>
    onChange({ ...value, annualEvents: value.annualEvents.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const removeAnnual = (id: string) =>
    onChange({ ...value, annualEvents: value.annualEvents.filter((e) => e.id !== id) });

  const addAsset = (preset?: Partial<ExistingAsset>) => {
    const id = `ast-${Date.now()}`;
    const cls: AssetClass = preset?.assetClass ?? "equity";
    const defaults: ExistingAsset = {
      id,
      name: ASSET_CLASS_DEFAULTS[cls].label,
      assetClass: cls,
      currentValue: 100000,
      annualReturnPct: ASSET_CLASS_DEFAULTS[cls].returnPct,
    };
    onChange({ ...value, existingAssets: [...(value.existingAssets ?? []), { ...defaults, ...preset, id }] });
  };
  const updateAsset = (id: string, patch: Partial<ExistingAsset>) =>
    onChange({ ...value, existingAssets: (value.existingAssets ?? []).map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  const removeAsset = (id: string) =>
    onChange({ ...value, existingAssets: (value.existingAssets ?? []).filter((a) => a.id !== id) });

  const detailed = value.epfDetails.mode === "detailed";
  const previewPension = epsMonthlyPension(
    value.epfDetails.epsWageCeiling,
    value.epfDetails.serviceYearsAtRetirement,
  );

  const eeContribution = detailed ? value.epfDetails.basicDA * 0.12 : 0;
  const erEpsContribution = detailed && value.epfDetails.epsEnabled
    ? Math.min(value.epfDetails.basicDA, value.epfDetails.epsWageCeiling) * 0.0833
    : 0;
  const erEpfContribution = detailed
    ? value.epfDetails.basicDA * 0.12 - erEpsContribution
    : 0;

  return (
    <div className="space-y-4">
      <CashflowSummary inputs={value} />

      <Section id="tour-you" title="👤 You">
        <Grid cols={3}>
          <Field label="Current age">
            <NumInput value={value.currentAge} onChange={(v) => set("currentAge", v)} />
          </Field>
          <Field label="Retirement age">
            <NumInput value={value.retirementAge} onChange={(v) => set("retirementAge", v)} />
          </Field>
          <Field label="Life expectancy">
            <NumInput value={value.lifeExpectancy} onChange={(v) => set("lifeExpectancy", v)} />
          </Field>
        </Grid>
      </Section>

      <Section id="tour-income" title="💰 Income">
        <Grid>
          <Field label="In-hand salary / month" hint="What actually hits your bank account — post-tax, post-EPF deductions">
            <NumInput value={value.monthlySalary} onChange={(v) => set("monthlySalary", v)} rupee />
          </Field>
          <Field label="Salary growth (% / yr)">
            <NumInput value={value.salaryGrowthPct} onChange={(v) => set("salaryGrowthPct", v)} />
          </Field>
        </Grid>
      </Section>

      <Section
        id="tour-expenses"
        title="💸 Expenses"
        collapsible
        summary={`${inr(value.monthlyExpense)}/mo${value.useExpenseBreakdown ? " · itemised" : ""}`}
      >
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2 flex items-center gap-2 text-xs">
          <button
            className={`flex-1 rounded px-2 py-1.5 transition ${!value.useExpenseBreakdown ? "bg-white shadow text-slate-900 font-medium" : "text-slate-500"}`}
            onClick={() => set("useExpenseBreakdown", false)}
          >
            I know the number
          </button>
          <button
            className={`flex-1 rounded px-2 py-1.5 transition ${value.useExpenseBreakdown ? "bg-white shadow text-slate-900 font-medium" : "text-slate-500"}`}
            onClick={() => {
              // Sync monthlyExpense to breakdown sum on entering breakdown mode.
              const b = value.expenseBreakdown;
              const t = b ? Object.values(b).reduce((s, x) => s + (Number.isFinite(x) ? x : 0), 0) : value.monthlyExpense;
              onChange({ ...value, useExpenseBreakdown: true, monthlyExpense: Math.round(t) });
            }}
          >
            Help me estimate
          </button>
        </div>
        {value.useExpenseBreakdown ? (
          <ExpenseBreakdownForm
            value={value.expenseBreakdown}
            onChange={(b, t) => onChange({ ...value, expenseBreakdown: b, monthlyExpense: Math.round(t) })}
          />
        ) : (
          <Grid>
            <Field label="Total expense / month">
              <NumInput value={value.monthlyExpense} onChange={(v) => set("monthlyExpense", v)} rupee />
            </Field>
            <Field label="Inflation (% / yr)">
              <NumInput value={value.inflationPct} onChange={(v) => set("inflationPct", v)} />
            </Field>
          </Grid>
        )}
        {value.useExpenseBreakdown && (
          <div className="mt-3">
            <Field label="Inflation (% / yr)">
              <NumInput value={value.inflationPct} onChange={(v) => set("inflationPct", v)} />
            </Field>
          </div>
        )}
      </Section>

      <Section
        id="tour-loans"
        title="🏦 Loans"
        collapsible
        summary={
          value.loans.length === 0
            ? "no loans"
            : `${value.loans.length} loan${value.loans.length === 1 ? "" : "s"} · ${inr(value.loans.reduce((s, l) => s + l.emi, 0))}/mo EMIs`
        }
      >
        <div className="mb-2">
          <label className="label">Payoff order</label>
          <select
            className="input"
            value={value.payoffStrategy}
            onChange={(e) => set("payoffStrategy", e.target.value as PayoffStrategy)}
          >
            <option value="avalanche">Avalanche (highest rate first)</option>
            <option value="snowball">Snowball (smallest balance first)</option>
            <option value="custom">Custom (as listed)</option>
          </select>
        </div>
        <div className="space-y-3">
          {value.loans.map((l) => (
            <div key={l.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <input
                  className="input flex-1 py-1"
                  value={l.name}
                  onChange={(e) => updateLoan(l.id, { name: e.target.value })}
                />
                <button className="text-slate-400 hover:text-rose-600 text-sm px-2" onClick={() => removeLoan(l.id)} aria-label="Remove loan">✕</button>
              </div>
              <Grid cols={2}>
                <Field label="Type">
                  <select
                    className="input"
                    value={l.type}
                    onChange={(e) => updateLoan(l.id, { type: e.target.value as LoanType })}
                  >
                    <option value="fixed">Fixed EMI</option>
                    <option value="overdraft">Overdraft / Flexi</option>
                  </select>
                </Field>
                <Field label="Rate (% / yr)">
                  <NumInput value={l.annualRate} onChange={(v) => updateLoan(l.id, { annualRate: v })} />
                </Field>
                <Field label="Outstanding">
                  <NumInput value={l.principal} onChange={(v) => updateLoan(l.id, { principal: v })} rupee />
                </Field>
                <Field
                  label={l.type === "overdraft" ? "Target monthly payment" : "EMI"}
                  hint={
                    l.type === "overdraft"
                      ? "Minimum is only the interest — anything above shrinks principal. Set higher than the current interest to actually pay down."
                      : undefined
                  }
                >
                  <NumInput value={l.emi} onChange={(v) => updateLoan(l.id, { emi: v })} rupee />
                </Field>
              </Grid>
            </div>
          ))}
        </div>
        <button className="btn-outline mt-3 w-full" onClick={addLoan}>🏦 + Add another loan</button>

        <div className="mt-5 pt-4 border-t border-slate-200">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={value.customStrategy.enabled}
              onChange={(e) => onChange({ ...value, customStrategy: { ...value.customStrategy, enabled: e.target.checked } })}
            />
            Custom plan — decide which loans to attack first
          </label>
          {value.customStrategy.enabled && (
            <div className="mt-2 rounded-lg border border-brand-100 bg-brand-50/40 p-3">
              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                Tick the loans you want to kill first with all your surplus. They'll be attacked in the order shown (use ↑ ↓ to reorder). Any loan you don't tick pays only its scheduled EMI. Your SIP begins once every ticked loan is closed.
              </p>
              <ol className="space-y-1.5">
                {(() => {
                  // Show accelerated loans first (in user's chosen order), then the rest.
                  const acc = value.customStrategy.acceleratedLoanIds;
                  const orderedLoans = [
                    ...acc.map((id) => value.loans.find((l) => l.id === id)).filter((l): l is LoanInput => !!l),
                    ...value.loans.filter((l) => !acc.includes(l.id)),
                  ];
                  return orderedLoans.map((loan) => {
                    const idx = acc.indexOf(loan.id);
                    const isAcc = idx !== -1;
                    const toggle = () => {
                      const next = isAcc
                        ? acc.filter((id) => id !== loan.id)
                        : [...acc, loan.id];
                      onChange({ ...value, customStrategy: { ...value.customStrategy, acceleratedLoanIds: next } });
                    };
                    const move = (dir: -1 | 1) => {
                      const next = [...acc];
                      const from = next.indexOf(loan.id);
                      const to = from + dir;
                      if (from < 0 || to < 0 || to >= next.length) return;
                      [next[from], next[to]] = [next[to], next[from]];
                      onChange({ ...value, customStrategy: { ...value.customStrategy, acceleratedLoanIds: next } });
                    };
                    return (
                      <li key={loan.id} className="flex items-center gap-2 rounded-md bg-white border border-slate-200 px-2 py-1.5">
                        <input type="checkbox" checked={isAcc} onChange={toggle} className="flex-none" />
                        {isAcc && (
                          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-semibold flex-none">
                            {idx + 1}
                          </span>
                        )}
                        <span className="flex-1 text-xs truncate">
                          <span className="font-medium text-slate-800">{loan.name}</span>
                          <span className="text-slate-500"> · {loan.annualRate}%</span>
                        </span>
                        {isAcc && (
                          <span className="flex items-center gap-1 flex-none">
                            <button
                              type="button"
                              className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={idx === 0}
                              onClick={() => move(-1)}
                              aria-label="Move up"
                            >↑</button>
                            <button
                              type="button"
                              className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={idx === acc.length - 1}
                              onClick={() => move(1)}
                              aria-label="Move down"
                            >↓</button>
                          </span>
                        )}
                      </li>
                    );
                  });
                })()}
              </ol>
              {value.customStrategy.acceleratedLoanIds.length === 0 && (
                <p className="text-[11px] text-amber-700 mt-2">
                  ⚠ Tick at least one loan — otherwise the plan is identical to "Invest alongside".
                </p>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section
        id="tour-epf"
        title="🛡️ EPF / EPS"
        collapsible
        summary={
          detailed
            ? `detailed · Basic ${inr(value.epfDetails.basicDA)}`
            : value.epfMonthlyContribution > 0
              ? `simple · ${inr(value.epfMonthlyContribution)}/mo`
              : "not contributing"
        }
        tooltip="Your employer must put 12% of your Basic salary into EPF (you put in 12% too). Part of the employer's share goes into a pension fund (EPS) that pays you monthly after retirement."
      >
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2 flex items-center gap-2 text-xs">
          <button
            className={`flex-1 rounded px-2 py-1.5 transition ${!detailed ? "bg-white shadow text-slate-900 font-medium" : "text-slate-500"}`}
            onClick={() => onChange({ ...value, epfDetails: { ...value.epfDetails, mode: "simple" } })}
          >
            Simple (one number)
          </button>
          <button
            className={`flex-1 rounded px-2 py-1.5 transition ${detailed ? "bg-white shadow text-slate-900 font-medium" : "text-slate-500"}`}
            onClick={() => onChange({ ...value, epfDetails: { ...value.epfDetails, mode: "detailed" } })}
          >
            Detailed (per EPF Act)
          </button>
        </div>

        <Grid>
          <Field label="Current EPF balance">
            <NumInput value={value.epfBalance} onChange={(v) => set("epfBalance", v)} rupee />
          </Field>
          <Field label="EPF interest rate (% / yr)">
            <NumInput value={value.epfReturnPct} onChange={(v) => set("epfReturnPct", v)} />
          </Field>
        </Grid>

        {!detailed ? (
          <div className="mt-3">
            <Field label="Total EPF contribution / month (you + employer)">
              <NumInput value={value.epfMonthlyContribution} onChange={(v) => set("epfMonthlyContribution", v)} rupee />
            </Field>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              In simple mode, we treat this lump as one growing EPF contribution and skip EPS. Switch to Detailed to model the 8.33% EPS split accurately.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-3">
              <Grid>
                <Field label="Basic + DA / month" hint={`Typically 30–50% of your CTC. This grows ${value.salaryGrowthPct}% each year with your salary hike.`}>
                  <NumInput value={value.epfDetails.basicDA} onChange={(v) => onChange({ ...value, epfDetails: { ...value.epfDetails, basicDA: v } })} rupee />
                </Field>
                <Field label="EPS wage ceiling" hint="Govt limit is ₹15,000/mo. Leave as-is unless your company has a special arrangement.">
                  <NumInput value={value.epfDetails.epsWageCeiling} onChange={(v) => onChange({ ...value, epfDetails: { ...value.epfDetails, epsWageCeiling: v } })} rupee />
                </Field>
                <Field label="Current EPS balance (approx)">
                  <NumInput value={value.epfDetails.currentEpsBalance} onChange={(v) => onChange({ ...value, epfDetails: { ...value.epfDetails, currentEpsBalance: v } })} rupee />
                </Field>
                <Field label="Years of service at retirement" hint="Total number of years you'll have worked in EPF-covered jobs by the time you retire.">
                  <NumInput value={value.epfDetails.serviceYearsAtRetirement} onChange={(v) => onChange({ ...value, epfDetails: { ...value.epfDetails, serviceYearsAtRetirement: v } })} />
                </Field>
              </Grid>
              <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={value.epfDetails.epsEnabled}
                  onChange={(e) => onChange({ ...value, epfDetails: { ...value.epfDetails, epsEnabled: e.target.checked } })}
                />
                Include pension (EPS) — uncheck if your company opted out or your Basic salary is above the ceiling
              </label>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <MiniStat label="You (12%)" value={inr(eeContribution)} />
              <MiniStat label="Employer → EPF" value={inr(erEpfContribution)} />
              <MiniStat label={value.epfDetails.epsEnabled ? "Employer → EPS" : "EPS off"} value={value.epfDetails.epsEnabled ? inr(erEpsContribution) : "—"} />
            </div>

            {value.epfDetails.epsEnabled && (
              <div className="mt-2 rounded-md bg-amber-50 border border-amber-100 p-2 text-[11px] text-amber-800">
                <strong>Estimated EPS pension at retirement:</strong> {inr(previewPension)} / month (formula-capped).
                This is a pension stream, not a lump sum — it reduces how much corpus you need.
              </div>
            )}
          </>
        )}
      </Section>

      <Section
        id="tour-income-other"
        title="💵 Other income"
        collapsible
        summary={
          value.otherIncomes.length === 0
            ? "none"
            : `${value.otherIncomes.length} stream${value.otherIncomes.length === 1 ? "" : "s"} · +${inr(value.otherIncomes.reduce((s, oi) => s + otherIncomeMonthly(oi), 0))}/mo eqv`
        }
        tooltip="Any regular income beyond your main salary — rental, freelance, spouse salary, quarterly variable pay, annual bonus, RSU vesting. Pick the right frequency; the planner smooths it into monthly-equivalent cashflow."
      >
        {value.otherIncomes.length === 0 && (
          <p className="text-xs text-slate-500 mb-2">
            No extra income streams. Common examples: rental income from a flat, freelance/consulting, spouse's salary, monthly interest from FDs.
          </p>
        )}
        <div className="space-y-3">
          {value.otherIncomes.map((oi) => (
            <div key={oi.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <input
                  className="input flex-1 py-1"
                  value={oi.name}
                  onChange={(e) => updateIncome(oi.id, { name: e.target.value })}
                />
                <button className="text-slate-400 hover:text-rose-600 text-sm px-2" onClick={() => removeIncome(oi.id)} aria-label="Remove income">✕</button>
              </div>
              <Grid cols={2}>
                <Field label={oi.frequency === "monthly" ? "Monthly amount" : "Amount per payment"}>
                  <NumInput value={oi.amount} onChange={(v) => updateIncome(oi.id, { amount: v })} rupee />
                </Field>
                <Field label="Frequency">
                  <select
                    className="input"
                    value={oi.frequency}
                    onChange={(e) => updateIncome(oi.id, { frequency: e.target.value as IncomeFrequency })}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half-yearly</option>
                    <option value="annually">Annually</option>
                  </select>
                </Field>
                <Field label="Growth (% / yr)" hint="Bonuses grow with salary; rental with rent index">
                  <NumInput value={oi.growthPct} onChange={(v) => updateIncome(oi.id, { growthPct: v })} />
                </Field>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={oi.activeInRetirement}
                      onChange={(e) => updateIncome(oi.id, { activeInRetirement: e.target.checked })}
                    />
                    Continues after I retire
                  </label>
                </div>
              </Grid>
              {oi.frequency !== "monthly" && (
                <div className="mt-2 text-[11px] text-slate-500 tabular-nums">
                  ≈ {inr(otherIncomeMonthly(oi))} / month cashflow contribution
                  <span className="text-slate-400"> · {inr(oi.amount)} × {oi.frequency}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Quick add</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <button className="btn-outline text-xs" onClick={() => addIncome({ name: "Rental income", amount: 25000, frequency: "monthly", growthPct: 5, activeInRetirement: true })}>🏠 Rental</button>
            <button className="btn-outline text-xs" onClick={() => addIncome({ name: "Freelance / consulting", amount: 30000, frequency: "monthly", growthPct: 8, activeInRetirement: false })}>💻 Freelance</button>
            <button className="btn-outline text-xs" onClick={() => addIncome({ name: "Spouse salary", amount: 60000, frequency: "monthly", growthPct: 7, activeInRetirement: false })}>👫 Spouse</button>
            <button className="btn-outline text-xs" onClick={() => addIncome({ name: "Annual bonus", amount: 200000, frequency: "annually", growthPct: value.salaryGrowthPct, activeInRetirement: false })}>🎁 Annual bonus</button>
            <button className="btn-outline text-xs" onClick={() => addIncome({ name: "Quarterly variable pay", amount: 50000, frequency: "quarterly", growthPct: value.salaryGrowthPct, activeInRetirement: false })}>📅 Quarterly bonus</button>
            <button className="btn-outline text-xs" onClick={() => addIncome({ name: "RSU vesting", amount: 300000, frequency: "annually", growthPct: 8, activeInRetirement: false })}>📊 RSU vesting</button>
            <button className="btn-outline text-xs" onClick={() => addIncome()}>Custom…</button>
          </div>
        </div>
      </Section>

      <Section
        id="tour-invest"
        title="📈 Existing assets"
        collapsible
        summary={(() => {
          const assets = value.existingAssets ?? [];
          if (assets.length === 0) return "none added";
          const total = assets.reduce((s, a) => s + a.currentValue, 0);
          return `${assets.length} asset${assets.length === 1 ? "" : "s"} · ${inr(total)} today`;
        })()}
        tooltip="Gold, PPF, real estate equity, existing MF/stocks — these compound at their own rates and merge into your retirement corpus."
      >
        {(value.existingAssets ?? []).length === 0 && (
          <p className="text-xs text-slate-500 mb-3">Add any savings or investments you already hold — equity, gold, PPF, real estate, FDs.</p>
        )}
        {(value.existingAssets ?? []).map((a) => (
          <div key={a.id} className="border border-slate-200 rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded border border-slate-200 px-2 py-1 text-sm"
                value={a.name}
                onChange={(e) => updateAsset(a.id, { name: e.target.value })}
              />
              <button type="button" onClick={() => removeAsset(a.id)} className="text-slate-400 hover:text-rose-500 text-lg leading-none">×</button>
            </div>
            <Grid>
              <Field label="Asset type">
                <select
                  className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm bg-white"
                  value={a.assetClass}
                  onChange={(e) => {
                    const cls = e.target.value as AssetClass;
                    updateAsset(a.id, { assetClass: cls, annualReturnPct: ASSET_CLASS_DEFAULTS[cls].returnPct });
                  }}
                >
                  {(Object.entries(ASSET_CLASS_DEFAULTS) as [AssetClass, { label: string; returnPct: number }][]).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Current value">
                <NumInput value={a.currentValue} onChange={(v) => updateAsset(a.id, { currentValue: v })} rupee />
              </Field>
              <Field label="Expected return % p.a.">
                <div className="relative">
                  <NumInput value={a.annualReturnPct} onChange={(v) => updateAsset(a.id, { annualReturnPct: v })} className="pr-6" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">%</span>
                </div>
              </Field>
            </Grid>
          </div>
        ))}
        <div className="mt-2">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Quick add</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <button type="button" className="btn-ghost text-xs" onClick={() => addAsset({ assetClass: "equity", name: "Equity / MF", currentValue: 200000, annualReturnPct: 12 })}>📊 Equity / MF</button>
            <button type="button" className="btn-ghost text-xs" onClick={() => addAsset({ assetClass: "gold", name: "Gold", currentValue: 100000, annualReturnPct: 8 })}>🪙 Gold</button>
            <button type="button" className="btn-ghost text-xs" onClick={() => addAsset({ assetClass: "ppf", name: "PPF", currentValue: 200000, annualReturnPct: 7.1 })}>🏛️ PPF</button>
            <button type="button" className="btn-ghost text-xs" onClick={() => addAsset({ assetClass: "real-estate", name: "Real Estate equity", currentValue: 1000000, annualReturnPct: 9 })}>🏡 Real Estate</button>
            <button type="button" className="btn-ghost text-xs" onClick={() => addAsset({ assetClass: "fd", name: "Fixed Deposit", currentValue: 100000, annualReturnPct: 7 })}>🏦 FD</button>
            <button type="button" className="btn-ghost text-xs" onClick={() => addAsset()}>💼 Other…</button>
          </div>
        </div>
      </Section>

      <Section
        id="tour-nps"
        title="🧘 NPS (National Pension System)"
        collapsible
        summary={
          value.nps.enabled
            ? `on · ${inr(value.nps.monthlyContribution)}/mo${value.nps.balance > 0 ? ` · balance ${inr(value.nps.balance)}` : ""}`
            : "off"
        }
        tooltip="A government retirement savings scheme. When you retire: 60% of your balance is tax-free cash, and the remaining 40% is used to buy a monthly pension for life."
      >
        <label className="flex items-center gap-2 text-sm text-slate-700 mb-3">
          <input
            type="checkbox"
            checked={value.nps.enabled}
            onChange={(e) => onChange({ ...value, nps: { ...value.nps, enabled: e.target.checked } })}
          />
          I contribute to NPS
        </label>
        {value.nps.enabled && (
          <>
            <Grid>
              <Field label="Current NPS balance">
                <NumInput value={value.nps.balance} onChange={(v) => onChange({ ...value, nps: { ...value.nps, balance: v } })} rupee />
              </Field>
              <Field label="Monthly contribution">
                <NumInput value={value.nps.monthlyContribution} onChange={(v) => onChange({ ...value, nps: { ...value.nps, monthlyContribution: v } })} rupee />
              </Field>
              <Field label="Expected return (% / yr)" hint="8–11% typical for aggressive scheme">
                <NumInput value={value.nps.expectedReturn} onChange={(v) => onChange({ ...value, nps: { ...value.nps, expectedReturn: v } })} />
              </Field>
              <Field label="% used for monthly pension" hint="By law minimum 40% goes toward a monthly pension for life">
                <NumInput value={value.nps.annuityAllocationPct} onChange={(v) => onChange({ ...value, nps: { ...value.nps, annuityAllocationPct: v } })} />
              </Field>
              <Field label="Pension return (% / yr)" hint="~6% is typical for most pension providers">
                <NumInput value={value.nps.annuityReturn} onChange={(v) => onChange({ ...value, nps: { ...value.nps, annuityReturn: v } })} />
              </Field>
            </Grid>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              At retirement, 60% of your NPS balance is withdrawn tax-free and adds to your corpus. 40% buys a lifetime annuity that pays a monthly pension.
            </p>
          </>
        )}
      </Section>

      <Section
        id="tour-goals"
        title="🎯 Life goals"
        collapsible
        summary={
          value.lifeGoals.length === 0
            ? "none"
            : `${value.lifeGoals.length} goal${value.lifeGoals.length === 1 ? "" : "s"} · ${inr(value.lifeGoals.reduce((s, g) => s + g.currentCost, 0))} today`
        }
        tooltip="Big lump-sum outflows before retirement — kids' education, marriage, foreign trip. These reduce the corpus your investments accumulate."
      >
        {value.lifeGoals.length === 0 && (
          <p className="text-xs text-slate-500 mb-2">
            Add lump-sum life events. These are big future expenses that will deplete your corpus at a specific age — the planner accounts for them.
          </p>
        )}
        <div className="space-y-3">
          {value.lifeGoals.map((g) => {
            const yrs = Math.max(0, g.targetAge - value.currentAge);
            const inflated = g.currentCost * Math.pow(1 + g.inflationPct / 100, yrs);
            return (
              <div key={g.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <input
                    className="input flex-1 py-1"
                    value={g.name}
                    onChange={(e) => updateGoal(g.id, { name: e.target.value })}
                  />
                  <button className="text-slate-400 hover:text-rose-600 text-sm px-2" onClick={() => removeGoal(g.id)} aria-label="Remove goal">✕</button>
                </div>
                <Grid cols={2}>
                  <Field label="Cost today">
                    <NumInput value={g.currentCost} onChange={(v) => updateGoal(g.id, { currentCost: v })} rupee />
                  </Field>
                  <Field label="Your age when it happens">
                    <NumInput value={g.targetAge} onChange={(v) => updateGoal(g.id, { targetAge: v })} />
                  </Field>
                  <Field label="Category inflation (% / yr)" hint="Education ~10%, marriage ~7–8%, general ~6%">
                    <NumInput value={g.inflationPct} onChange={(v) => updateGoal(g.id, { inflationPct: v })} />
                  </Field>
                  <Field label="Cost in that year">
                    <div className="input bg-slate-50 border-slate-200 tabular-nums text-slate-700 pointer-events-none">
                      {inr(inflated)}
                    </div>
                  </Field>
                </Grid>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Quick add</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <button className="btn-outline text-xs" onClick={() => addGoal({ name: "Kids' higher education", currentCost: 3000000, inflationPct: 10, targetAge: Math.min(value.retirementAge - 1, value.currentAge + 14) })}>🎓 Kids' education</button>
            <button className="btn-outline text-xs" onClick={() => addGoal({ name: "Kids' marriage", currentCost: 2000000, inflationPct: 7, targetAge: Math.min(value.retirementAge - 1, value.currentAge + 21) })}>💍 Kids' marriage</button>
            <button className="btn-outline text-xs" onClick={() => addGoal({ name: "Home renovation", currentCost: 1000000, inflationPct: 6, targetAge: Math.min(value.retirementAge - 1, value.currentAge + 5) })}>🏠 Home renovation</button>
            <button className="btn-outline text-xs" onClick={() => addGoal()}>Custom…</button>
          </div>
        </div>
      </Section>

      <Section
        id="tour-annual"
        title="✈️ Annual events"
        collapsible
        summary={(() => {
          if (value.annualEvents.length === 0) return "none";
          const tripCounts = value.annualEvents.reduce((s, e) => {
            const maxYear = e.untilAge - value.currentAge - 1;
            const freq = Math.max(1, Math.round(e.frequencyYears));
            return s + (maxYear >= 0 ? Math.floor(maxYear / freq) + 1 : 0);
          }, 0);
          return `${value.annualEvents.length} event${value.annualEvents.length === 1 ? "" : "s"} · ${tripCounts} occurrence${tripCounts === 1 ? "" : "s"} lifetime`;
        })()}
        tooltip="Recurring lifetime spends — India / foreign trips, Diwali, gifts. Each triggers at its own frequency (every N years) until a specified age, then withdraws from SIP silently."
      >
        {value.annualEvents.length === 0 && (
          <p className="text-xs text-slate-500 mb-2">
            Add trips and festival budgets. Each fires at its own cadence (e.g. India trip every year, foreign trip every 2 years) until an age you set — travel usually tapers with age.
          </p>
        )}
        <div className="space-y-3">
          {value.annualEvents.map((e) => {
            // Preview: match the engine's trigger math exactly.
            // yearIndex fires if yearIndex % freq === 0 AND currentAge + yearIndex + 1 <= untilAge.
            const maxYear = e.untilAge - value.currentAge - 1;
            const freq = Math.max(1, Math.round(e.frequencyYears));
            const tripCount = maxYear >= 0 ? Math.floor(maxYear / freq) + 1 : 0;
            const lastYearIdx = tripCount > 0 ? Math.floor(maxYear / freq) * freq : 0;
            const lastCost = e.annualCost * Math.pow(1 + e.inflationPct / 100, lastYearIdx);
            const firstAge = value.currentAge + 1;
            const lastAge = value.currentAge + lastYearIdx + 1;
            return (
              <div key={e.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <input
                    className="input flex-1 py-1"
                    value={e.name}
                    onChange={(ev) => updateAnnual(e.id, { name: ev.target.value })}
                  />
                  <button className="text-slate-400 hover:text-rose-600 text-sm px-2" onClick={() => removeAnnual(e.id)} aria-label="Remove annual event">✕</button>
                </div>
                <Grid cols={2}>
                  <Field label="Cost per trip (today's ₹)">
                    <NumInput value={e.annualCost} onChange={(v) => updateAnnual(e.id, { annualCost: v })} rupee />
                  </Field>
                  <Field label="Category inflation (% / yr)" hint="Foreign trips ~8–10% (INR weakness); domestic ~7%; festivals ~6–7%">
                    <NumInput value={e.inflationPct} onChange={(v) => updateAnnual(e.id, { inflationPct: v })} />
                  </Field>
                  <Field label="Every X years" hint="1 = every year, 2 = every 2 years, etc.">
                    <NumInput value={e.frequencyYears} onChange={(v) => updateAnnual(e.id, { frequencyYears: Math.max(1, Math.round(v)) })} />
                  </Field>
                  <Field label="Until age" hint="Travel capacity drops with age — set the last age this event fires">
                    <NumInput value={e.untilAge} onChange={(v) => updateAnnual(e.id, { untilAge: v })} />
                  </Field>
                </Grid>
                <div className="mt-2 rounded-md bg-slate-50 border border-slate-100 p-2 text-[11px] text-slate-600 leading-snug">
                  <strong className="text-slate-800">{tripCount} trip{tripCount === 1 ? "" : "s"}</strong>
                  {tripCount > 0
                    ? ` — from age ${firstAge} through ${lastAge}. Last one at ~${inr(lastCost)} in that year's rupees.`
                    : ` — untilAge (${e.untilAge}) is not after your current age (${value.currentAge}); no trips will fire.`}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Quick add</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <button className="btn-outline text-xs" onClick={() => addAnnual({ name: "India trip", annualCost: 50000, inflationPct: 7, frequencyYears: 1, untilAge: 60 })}>🇮🇳 India trip</button>
            <button className="btn-outline text-xs" onClick={() => addAnnual({ name: "Foreign trip", annualCost: 200000, inflationPct: 9, frequencyYears: 2, untilAge: 60 })}>🌏 Foreign trip</button>
            <button className="btn-outline text-xs" onClick={() => addAnnual({ name: "Festival / Diwali", annualCost: 40000, inflationPct: 7, frequencyYears: 1, untilAge: 80 })}>🪔 Festival</button>
            <button className="btn-outline text-xs" onClick={() => addAnnual()}>Custom…</button>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          These are funded via silent year-end withdrawals from SIP (then EPF). Trip money briefly compounds in SIP before you spend it. See the full breakdown in results.
        </div>
      </Section>

      <Section id="tour-assumptions" title="⚙️ Return assumptions" collapsible open={showAdvanced} onToggle={() => setShowAdvanced((s) => !s)}>
        <Grid>
          <Field label="SIP / equity return (% / yr)">
            <NumInput value={value.sipReturnPct} onChange={(v) => set("sipReturnPct", v)} />
          </Field>
          <Field label="Post-retirement return (% / yr)">
            <NumInput value={value.postRetirementReturnPct} onChange={(v) => set("postRetirementReturnPct", v)} />
          </Field>
        </Grid>
      </Section>

      <Section id="tour-tax" title="📋 Tax on withdrawal" collapsible open={showTax} onToggle={() => setShowTax((s) => !s)}>
        <Grid>
          <Field label="Equity LTCG rate (%)" hint="12.5% since Budget 2024">
            <NumInput value={value.ltcgRatePct} onChange={(v) => set("ltcgRatePct", v)} />
          </Field>
          <Field label="LTCG annual exemption" hint="₹1.25L per Budget 2024">
            <NumInput value={value.ltcgAnnualExemption} onChange={(v) => set("ltcgAnnualExemption", v)} rupee />
          </Field>
        </Grid>
        <p className="text-[11px] text-slate-500 mt-2">
          EPF is tax-free at withdrawal after 5 years of continuous service. EPS pension is taxable as salary in retirement — not netted here.
        </p>
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
  collapsible,
  open,
  onToggle,
  tooltip,
  defaultOpen = true,
  summary,
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  /** If provided, section is *controlled* — parent owns open state. */
  open?: boolean;
  onToggle?: () => void;
  tooltip?: string;
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean;
  /**
   * A short one-line summary rendered next to the title. Visible whether
   * the section is open or collapsed — so a collapsed section still tells
   * the user what's inside.
   */
  summary?: string;
}) {
  // Uncontrolled: manage collapse state internally when parent hasn't wired it.
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = open !== undefined && onToggle !== undefined;
  const isOpen = controlled ? open : internalOpen;
  const toggle = controlled ? onToggle : () => setInternalOpen((s) => !s);

  return (
    <div id={id} className="card p-4 scroll-mt-24 transition-shadow">
      <button
        type="button"
        onClick={toggle}
        className={`w-full flex items-center justify-between gap-2 text-left ${collapsible ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="text-brand-600 flex-none">{icon}</span>}
          <span className="section-h flex-none">{title}</span>
          {tooltip && (
            <span className="group relative flex-none">
              <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[10px] cursor-help">i</span>
              <span className="hidden group-hover:block absolute z-10 top-6 left-0 w-64 p-2 rounded-md bg-slate-900 text-white text-[11px] leading-snug shadow-lg">
                {tooltip}
              </span>
            </span>
          )}
          {summary && (
            <span
              className={`text-[11px] tabular-nums truncate min-w-0 ${isOpen ? "text-slate-400" : "text-slate-600 font-medium"}`}
              title={summary}
            >
              · {summary}
            </span>
          )}
        </span>
        {collapsible ? (
          <span className="text-slate-400 text-xs flex items-center gap-1 flex-none">
            <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : null}
      </button>
      {(!collapsible || isOpen) && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  const cls = cols === 3 ? "grid grid-cols-1 sm:grid-cols-3 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3";
  return <div className={cls}>{children}</div>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800 tabular-nums text-sm">{value}</div>
    </div>
  );
}

// ---- inline SVG icons ----
function IconUser() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3 17a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function IconRupee() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 4h9M6 8h9M8 4c3 0 4 2 4 4s-1 4-4 4H6l6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconWallet() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M14 11h2M2.5 8h15" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function IconLoan() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 8l7-5 7 5v9H3V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 17v-5h4v5" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
function IconShield() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}
function IconChart() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 16V4M3 16h14M6 13l3-3 3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconSettings() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.5 1.5M14 14l1.5 1.5M4.5 15.5l1.5-1.5M14 6l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function IconTax() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 3h10v14l-5-3-5 3V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 7h6M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function IconIncome() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 6h14v10H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="10" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 6V4h8v2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}
function IconNps() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 6h12M4 10h12M4 14h12M6 4v12M14 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function IconGoal() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="1" fill="currentColor" /></svg>;
}
function IconAirplane() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2.5 11l7-1V4a1 1 0 012 0v6l7 1v2l-7-1v3l2 1v1l-3-1-3 1v-1l2-1v-3l-7 1v-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>;
}
