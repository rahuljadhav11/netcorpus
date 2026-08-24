/**
 * Financial calculation engine — pure functions, no UI, no side effects.
 * All annual rates come in as percentages (e.g. 8.5 for 8.5%).
 */

import type {
  LoanInput,
  MonthlySnapshot,
  PayoffStrategy,
  PlanInputs,
  ProjectionResult,
  Scenario,
  ScenarioMode,
  YearlySnapshot,
  LoanClosure,
  ExpenseBreakdown,
  TaxSummary,
  StrategyEvent,
  AssetClass,
} from "./types";
import { otherIncomeMonthly } from "./types";

export const monthlyRate = (annualPct: number) => annualPct / 100 / 12;
export const monthlyGrowth = (annualPct: number) =>
  Math.pow(1 + annualPct / 100, 1 / 12) - 1;

/** Present value of a growing annuity, month-by-month. */
export function retirementCorpusNeeded(args: {
  monthlyExpenseAtRetirement: number;
  annualInflationPct: number;
  postRetirementReturnPct: number;
  yearsInRetirement: number;
  /** Monthly pension/rental income at retirement that offsets withdrawal. */
  monthlyPassiveIncomeAtRetirement?: number;
  /** Annual growth of that passive income (rental grows, pension flat). */
  passiveIncomeGrowthPct?: number;
}): number {
  const {
    monthlyExpenseAtRetirement,
    annualInflationPct,
    postRetirementReturnPct,
    yearsInRetirement,
    monthlyPassiveIncomeAtRetirement = 0,
    passiveIncomeGrowthPct = 0,
  } = args;
  const months = Math.max(1, Math.round(yearsInRetirement * 12));
  const rM = monthlyRate(postRetirementReturnPct);
  let pv = 0;
  let expense = monthlyExpenseAtRetirement;
  let passive = monthlyPassiveIncomeAtRetirement;
  for (let m = 1; m <= months; m++) {
    const withdrawal = Math.max(0, expense - passive);
    pv += withdrawal / Math.pow(1 + rM, m);
    if (m % 12 === 0) {
      expense *= 1 + annualInflationPct / 100;
      passive *= 1 + passiveIncomeGrowthPct / 100;
    }
  }
  return pv;
}

export const inflate = (v: number, annualPct: number, years: number) =>
  v * Math.pow(1 + annualPct / 100, years);
export const deflate = (v: number, annualPct: number, years: number) =>
  v / Math.pow(1 + annualPct / 100, years);

export function sumExpenseBreakdown(b?: ExpenseBreakdown): number {
  if (!b) return 0;
  let s = 0;
  for (const v of Object.values(b)) s += Number.isFinite(v) ? v : 0;
  return s;
}

interface LoanRuntime extends LoanInput {
  balance: number;
  totalInterestPaid: number;
  closedAtMonth: number | null;
}

function makeLoanRuntimes(loans: LoanInput[]): LoanRuntime[] {
  return loans.map((l) => ({
    ...l,
    balance: l.principal,
    totalInterestPaid: 0,
    closedAtMonth: null,
  }));
}

function loanOrder(
  loans: LoanRuntime[],
  strategy: PayoffStrategy,
  customOrder?: string[],
): LoanRuntime[] {
  const open = loans.filter((l) => l.balance > 0.01);
  if (strategy === "avalanche") return [...open].sort((a, b) => b.annualRate - a.annualRate);
  if (strategy === "snowball") return [...open].sort((a, b) => a.balance - b.balance);
  if (strategy === "custom" && customOrder) {
    const rank = new Map(customOrder.map((id, i) => [id, i]));
    return [...open].sort((a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999));
  }
  return open;
}

function payLoanMonth(loan: LoanRuntime, payment: number) {
  if (loan.balance <= 0) return { spent: 0, interest: 0, principal: 0 };
  const rM = monthlyRate(loan.annualRate);
  const interest = loan.balance * rM;
  loan.totalInterestPaid += interest;
  const cap = loan.balance + interest;
  const actual = Math.min(payment, cap);
  const principalPaid = Math.max(0, actual - interest);
  loan.balance = Math.max(0, loan.balance + interest - actual);
  return { spent: actual, interest, principal: principalPaid };
}

export interface RunOptions {
  horizonMonths?: number;
  surplusPolicy?: "sip" | "none";
  simulateRetirement?: boolean;
  minimumOnly?: boolean;
  closeLoansFromCorpusAtMonth?: number;
  acceleratedLoanIds?: Set<string>;
}

function epfSplit(basicDA: number, epsCeiling: number, epsEnabled: boolean) {
  const ee = basicDA * 0.12;
  const erTotal = basicDA * 0.12;
  const epsBase = Math.min(basicDA, epsCeiling);
  const eps = epsEnabled ? epsBase * 0.0833 : 0;
  const erEpf = erTotal - eps;
  return { ee, erEpf, eps };
}

export function epsMonthlyPension(
  epsCeiling: number,
  serviceYearsAtRetirement: number,
): number {
  const pensionableSalary = epsCeiling;
  const service = Math.min(35, Math.max(0, serviceYearsAtRetirement));
  return (pensionableSalary * service) / 70;
}

/** NPS split at retirement: 60% tax-free lump + 40% into annuity. */
export function npsPayout(balance: number, annuityAllocationPct: number, annuityReturn: number) {
  const annuityCorpus = balance * (annuityAllocationPct / 100);
  const lump = balance - annuityCorpus;
  const monthlyPension = annuityCorpus * (annuityReturn / 100 / 12);
  return { lump, annuityCorpus, monthlyPension };
}

export function computeTax(args: {
  sipBalance: number;
  sipCostBasis: number;
  epfBalance: number;
  epsBalance: number;
  epsMonthlyPension: number;
  npsBalance: number;
  npsAnnuityAllocationPct: number;
  npsAnnuityReturn: number;
  otherRetirementIncome: number;
  ltcgRatePct: number;
  ltcgAnnualExemption: number;
}): TaxSummary {
  const sipGains = Math.max(0, args.sipBalance - args.sipCostBasis);
  const taxableGains = Math.max(0, sipGains - args.ltcgAnnualExemption);
  const ltcgTax = taxableGains * (args.ltcgRatePct / 100);
  const nps = npsPayout(args.npsBalance, args.npsAnnuityAllocationPct, args.npsAnnuityReturn);
  // Corpus in hand = SIP (post LTCG) + EPF + NPS lump (60%). Annuity corpus is
  // "spent" buying the pension stream, so it's not in the withdrawable pool.
  const grossCorpus = args.sipBalance + args.epfBalance + nps.lump;
  const netCorpus = grossCorpus - ltcgTax;
  return {
    grossCorpus,
    sipBalance: args.sipBalance,
    sipGains,
    ltcgTax,
    epfBalance: args.epfBalance,
    npsLumpSum: nps.lump,
    npsAnnuityCorpus: nps.annuityCorpus,
    netCorpus,
    epsMonthlyPension: args.epsMonthlyPension,
    npsMonthlyPension: nps.monthlyPension,
    otherRetirementIncome: args.otherRetirementIncome,
  };
}

export function runProjection(inputs: PlanInputs, opts: RunOptions = {}): ProjectionResult {
  const {
    horizonMonths,
    surplusPolicy = "sip",
    simulateRetirement = true,
    minimumOnly = false,
    closeLoansFromCorpusAtMonth,
    acceleratedLoanIds,
  } = opts;

  const yearsToLifeEnd = Math.max(1, inputs.lifeExpectancy - inputs.currentAge);
  const months = horizonMonths ?? yearsToLifeEnd * 12;
  const retirementMonthIndex = Math.max(0, (inputs.retirementAge - inputs.currentAge) * 12);

  // salary + expense grow annually (see year-end block); no per-month rate needed.
  const sipRm = monthlyRate(inputs.sipReturnPct);
  const epfRm = monthlyRate(inputs.epfReturnPct);
  const postRm = monthlyRate(inputs.postRetirementReturnPct);
  const npsRm = monthlyRate(inputs.nps.expectedReturn);

  const loans = makeLoanRuntimes(inputs.loans);
  const monthly: MonthlySnapshot[] = [];
  const closures: LoanClosure[] = [];

  let salary = inputs.monthlySalary;
  let baseExpense = inputs.monthlyExpense;
  // Annual events tracked as separate monthly streams so each can inflate at
  // its own rate (foreign trips can climb faster than general inflation, etc).
  const events = inputs.annualEvents.map((e) => ({
    ...e,
    currentMonthly: e.annualCost / 12,
    monthlyG: monthlyGrowth(e.inflationPct),
  }));
  // Equity-class assets seed the SIP balance; all others tracked separately.
  const equityAssetValue = (inputs.existingAssets ?? [])
    .filter((a) => a.assetClass === "equity")
    .reduce((s, a) => s + a.currentValue, 0);
  let sipBalance = inputs.existingInvestments + equityAssetValue;
  let sipCostBasis = sipBalance;

  // Non-equity existing assets: each grows at its own rate pre-retirement,
  // then merges into sipBalance at retirement as a tax-free lump (PPF) or at
  // cost basis (gold, RE, FD — simplified; detailed tax not modelled here).
  const assetTracks = (inputs.existingAssets ?? [])
    .filter((a) => a.assetClass !== "equity")
    .map((a) => ({
      ...a,
      balance: a.currentValue,
      rm: monthlyGrowth(a.annualReturnPct),
    }));

  let epfBalance = inputs.epfBalance;
  let epsBalance = inputs.epfDetails.currentEpsBalance;
  let npsBalance = inputs.nps.enabled ? inputs.nps.balance : 0;
  let npsContribution = inputs.nps.enabled ? inputs.nps.monthlyContribution : 0;

  // Other-income streams — each grows at its own rate.
  // For each other-income stream, track its current monthly-equivalent so it
  // can be summed alongside the salary each month. Bonuses paid quarterly /
  // annually are smoothed into monthly amounts for cashflow purposes.
  const incomes = inputs.otherIncomes.map((oi) => ({ ...oi, current: otherIncomeMonthly(oi) }));
  // Other-income streams also grow annually — hikes match salary cycle.

  // Life goals — precompute the target month and inflated cost.
  const goalPlan = inputs.lifeGoals
    .map((g) => ({
      ...g,
      targetMonth: Math.max(0, Math.round((g.targetAge - inputs.currentAge) * 12)),
      inflatedCost: g.currentCost * Math.pow(1 + g.inflationPct / 100, Math.max(0, g.targetAge - inputs.currentAge)),
    }))
    .filter((g) => g.targetMonth < months);

  const detailed = inputs.epfDetails.mode === "detailed";
  let basicDA = inputs.epfDetails.basicDA;
  const epsCeiling = inputs.epfDetails.epsWageCeiling;
  const epsEnabled = inputs.epfDetails.epsEnabled;
  let simpleContribution = inputs.epfMonthlyContribution;

  let debtFreeMonthIndex: number | null = null;
  let loansOutstandingAtRetirement = 0;
  let lumpCloseAmount = 0;
  let epfMergedAtRetirement = 0; // EPF balance moved to SIP at retirement (tax-free)
  let npsBalanceAtRetirement = 0; // captured before NPS is split at retirement
  const existingAssetValuesAtRetirement: { name: string; assetClass: AssetClass; value: number; annualReturnPct: number }[] = [];

  // Track annual-event lump draws for the silent summary.
  interface AnnualEventTracker {
    id: string;
    name: string;
    firstAge: number;
    lastAge: number;
    count: number;
    firstCost: number;
    lastCost: number;
    totalNominal: number;
  }
  const eventTrackers = new Map<string, AnnualEventTracker>();

  for (let m = 0; m < months; m++) {
    const isRetired = simulateRetirement && m >= retirementMonthIndex;
    const age = inputs.currentAge + m / 12;

    // Snapshot pre-retirement loan balance before any lump close.
    if (m === retirementMonthIndex) {
      loansOutstandingAtRetirement = loans.reduce((s, l) => s + l.balance, 0);
      // Merge EPF into SIP at retirement (tax-free, fully liquid).
      if (epfBalance > 0.01) {
        epfMergedAtRetirement = epfBalance;
        sipBalance += epfBalance;
        sipCostBasis += epfBalance;
        epfBalance = 0;
      }
      // Split NPS at retirement: 60% lump → sipBalance (tax-free), 40% buys annuity.
      // Zero out npsBalance so it doesn't phantom-inflate corpus post-retirement;
      // the monthly pension continues via npsAnnuityMonthlyStream which reads the
      // pre-split balance from the month before retirement.
      if (inputs.nps.enabled && npsBalance > 0.01) {
        npsBalanceAtRetirement = npsBalance;
        const npsLump = npsBalance * (1 - inputs.nps.annuityAllocationPct / 100);
        sipBalance += npsLump;
        sipCostBasis += npsLump; // NPS lump is tax-free — match cost basis
        npsBalance = 0;
      }
      // Capture each non-equity existing asset's value at retirement.
      // They are NOT merged into the withdrawal corpus — they are separate wealth
      // (illiquid or earmarked separately). Stop tracking their growth post-retirement.
      for (const at of assetTracks) {
        if (at.balance > 0.01) {
          existingAssetValuesAtRetirement.push({ name: at.name, assetClass: at.assetClass, value: at.balance, annualReturnPct: at.annualReturnPct });
        }
        at.balance = 0; // remove from ongoing tracking
      }
    }

    // Auto-close: any remaining loans are cleared from corpus at retirement,
    // in every strategy. Servicing EMIs from a fixed retirement pot is bad
    // math — the smart move is a single lump close. Legacy explicit override
    // (closeLoansFromCorpusAtMonth) still works but is no longer required.
    const shouldLumpCloseThisMonth =
      m === retirementMonthIndex ||
      (closeLoansFromCorpusAtMonth !== undefined && m === closeLoansFromCorpusAtMonth);
    if (shouldLumpCloseThisMonth) {
      let outstanding = 0;
      for (const l of loans) outstanding += l.balance;
      const paidFromSip = Math.min(outstanding, sipBalance);
      const paidFromEpf = Math.min(outstanding - paidFromSip, epfBalance);
      sipBalance -= paidFromSip;
      sipCostBasis = Math.max(0, sipCostBasis - paidFromSip);
      epfBalance -= paidFromEpf;
      let remaining = paidFromSip + paidFromEpf;
      lumpCloseAmount = remaining;
      for (const l of loans) {
        if (l.balance <= 0) continue;
        const pay = Math.min(l.balance, remaining);
        l.balance -= pay;
        remaining -= pay;
        if (l.balance <= 0.01 && l.closedAtMonth === null) {
          l.closedAtMonth = m;
          closures.push({ loanId: l.id, name: l.name, monthIndex: m, monthLabel: monthLabel(m), totalInterestPaid: l.totalInterestPaid });
        }
      }
    }

    // Other-income for this month (sums streams that are active).
    let otherIncomeThisMonth = 0;
    for (const oi of incomes) {
      if (isRetired && !oi.activeInRetirement) continue;
      otherIncomeThisMonth += oi.current;
    }

    // EPF/EPS contributions.
    let ee = 0, erEpf = 0, eps = 0;
    if (!isRetired) {
      if (detailed) ({ ee, erEpf, eps } = epfSplit(basicDA, epsCeiling, epsEnabled));
      else { erEpf = simpleContribution; }
    }

    // Monthly expense is baseline only. Annual events (trips, festivals) do
    // NOT reduce monthly cashflow — the full surplus flows into SIP, and each
    // trigger-year the inflated event cost is withdrawn as a silent lump
    // from SIP (then EPF). That way trip money briefly compounds in SIP
    // before being spent, closer to what actually happens if you maintain
    // a liquid/equity fund for trips.
    const expense = baseExpense;

    // Take-home = in-hand salary + other-income. EPF is pre-in-hand
    // (already deducted from CTC), so we don't subtract it here.
    const takeHome = isRetired ? otherIncomeThisMonth : salary + otherIncomeThisMonth;
    // NPS voluntary contribution comes out of in-hand.
    const availableForLoansAndSip = isRetired
      ? 0
      : Math.max(0, takeHome - expense - npsContribution);

    let loanPaymentsThisMonth = 0;
    let remainingPay = availableForLoansAndSip;

    // Interest is a monthly event per loan. We compute it once, then allocate
    // payments across three passes (mandatory → OD-voluntary → acceleration).
    // Each loan finally receives ONE payLoanMonth call at the end so interest
    // isn't double-charged.
    const activeOrder = loanOrder(loans, inputs.payoffStrategy, inputs.customLoanOrder);
    const interestByLoan = new Map<string, number>();
    const allocatedByLoan = new Map<string, number>();
    for (const l of loans) {
      if (l.balance > 0.01) interestByLoan.set(l.id, l.balance * monthlyRate(l.annualRate));
    }
    // Max additional payment we can direct at a loan (balance + interest - already allocated).
    const capFor = (l: LoanRuntime) => {
      const interest = interestByLoan.get(l.id) ?? 0;
      const already = allocatedByLoan.get(l.id) ?? 0;
      return Math.max(0, l.balance + interest - already);
    };
    const alloc = (l: LoanRuntime, amount: number) => {
      if (amount <= 0) return;
      allocatedByLoan.set(l.id, (allocatedByLoan.get(l.id) ?? 0) + amount);
      remainingPay -= amount;
    };

    // Pass 1 — MANDATORY payments:
    //   Fixed loan: min(user's EMI, outstanding + interest).
    //   OD/flexi loan: interest only is legally sufficient; user's target
    //     above that is voluntary and handled in pass 2.
    for (const l of activeOrder) {
      if (remainingPay <= 0 || l.balance <= 0.01) continue;
      const interest = interestByLoan.get(l.id) ?? 0;
      const mandatory = l.type === "overdraft"
        ? Math.min(interest, l.balance + interest)
        : Math.min(l.emi, l.balance + interest);
      alloc(l, Math.min(mandatory, remainingPay, capFor(l)));
    }

    // Pass 2 — VOLUNTARY OD target beyond interest.
    for (const l of activeOrder) {
      if (remainingPay <= 0.01 || l.balance <= 0.01) continue;
      if (l.type !== "overdraft") continue;
      const interest = interestByLoan.get(l.id) ?? 0;
      const target = Math.min(l.emi, l.balance + interest);
      const already = allocatedByLoan.get(l.id) ?? 0;
      const wanted = Math.max(0, target - already);
      alloc(l, Math.min(wanted, remainingPay, capFor(l)));
    }

    // Pass 3 — acceleration: dump extra surplus into priority loans.
    if (!minimumOnly && remainingPay > 0) {
      const stillOpen = loanOrder(loans, inputs.payoffStrategy, inputs.customLoanOrder);
      for (const l of stillOpen) {
        if (remainingPay <= 0.01) break;
        if (l.balance <= 0.01) continue;
        if (acceleratedLoanIds && !acceleratedLoanIds.has(l.id)) continue;
        alloc(l, Math.min(remainingPay, capFor(l)));
      }
    }

    // Apply consolidated payment once per loan.
    for (const l of loans) {
      const total = allocatedByLoan.get(l.id) ?? 0;
      if (total <= 0.001) continue;
      const { spent } = payLoanMonth(l, total);
      loanPaymentsThisMonth += spent;
      if (l.balance <= 0.01 && l.closedAtMonth === null) {
        l.closedAtMonth = m;
        closures.push({ loanId: l.id, name: l.name, monthIndex: m, monthLabel: monthLabel(m), totalInterestPaid: l.totalInterestPaid });
      }
    }

    const leftover = remainingPay;

    const totalLoanBalanceNow = loans.reduce((s, l) => s + l.balance, 0);
    if (debtFreeMonthIndex === null && totalLoanBalanceNow <= 0.01) debtFreeMonthIndex = m;

    // Grow non-equity existing assets pre-retirement (post-retirement they've merged).
    for (const at of assetTracks) {
      if (at.balance > 0.01) at.balance *= (1 + at.rm);
    }
    const otherAssetsNow = assetTracks.reduce((s, at) => s + at.balance, 0);

    // Grow investments + apply contributions
    let sipThisMonth = 0;
    if (!isRetired) {
      const toSip = surplusPolicy === "sip" ? Math.max(0, leftover) : 0;
      sipThisMonth = toSip;
      sipBalance = sipBalance * (1 + sipRm) + toSip;
      sipCostBasis += toSip;
      epfBalance = epfBalance * (1 + epfRm) + ee + erEpf;
      epsBalance = epsBalance * (1 + epfRm) + eps;
      if (inputs.nps.enabled) {
        npsBalance = npsBalance * (1 + npsRm) + npsContribution;
      }
    } else {
      // Retirement drawdown. Passive income = EPS pension + NPS annuity + other-income streams.
      // Annual events (trips) are handled separately as year-end lumps from
      // SIP, not in the monthly draw.
      const monthlyPension = detailed && epsEnabled
        ? epsMonthlyPension(epsCeiling, inputs.epfDetails.serviceYearsAtRetirement)
        : 0;
      const npsPension = npsAnnuityMonthlyStream(inputs, m, retirementMonthIndex, monthly);
      const passive = monthlyPension + npsPension + otherIncomeThisMonth;
      const withdrawal = Math.max(0, expense - passive);
      // Withdraw at start of month (annuity-due — matches Indian MF SWP convention).
      const fromSip = Math.min(sipBalance, withdrawal);
      if (sipBalance > 0.01) {
        sipCostBasis = sipCostBasis * (sipBalance - fromSip) / sipBalance;
      }
      sipBalance -= fromSip;
      const fromEpf = Math.min(epfBalance, withdrawal - fromSip);
      epfBalance -= fromEpf;
      // Remainder grows for the month.
      sipBalance = sipBalance * (1 + postRm);
      epfBalance = epfBalance * (1 + epfRm);
    }

    // Life goals: at the target month, deduct inflated cost from SIP first, then EPF.
    const goalOutflowsThisMonth: { name: string; amount: number }[] = [];
    for (const g of goalPlan) {
      if (g.targetMonth === m) {
        const need = g.inflatedCost;
        const fromSip = Math.min(sipBalance, need);
        // Reduce cost basis proportionally.
        if (sipBalance + fromSip > 0.01) {
          const before = sipBalance + fromSip;
          sipCostBasis = sipCostBasis * (before === 0 ? 0 : (sipBalance / before));
        }
        sipBalance -= fromSip;
        const fromEpf = Math.min(epfBalance, need - fromSip);
        epfBalance -= fromEpf;
        goalOutflowsThisMonth.push({ name: g.name, amount: fromSip + fromEpf });
      }
    }

    // Annual events — silent year-end lump withdrawal from SIP (then EPF).
    // Each event fires when the year-index matches its frequency AND the
    // user's age at year-end is still <= untilAge. Withdrawals do NOT
    // become narrative events (we surface them via a separate summary).
    if ((m + 1) % 12 === 0) {
      const yearIndex = Math.floor(m / 12);
      const endOfYearAge = inputs.currentAge + yearIndex + 1;
      for (const e of events) {
        if (e.frequencyYears <= 0) continue;
        if (yearIndex % e.frequencyYears !== 0) continue;
        if (endOfYearAge > e.untilAge) continue;
        const annualNow = e.currentMonthly * 12;
        if (annualNow <= 0.01) continue;
        const fromSip = Math.min(sipBalance, annualNow);
        if (sipBalance + fromSip > 0.01) {
          const before = sipBalance + fromSip;
          sipCostBasis = sipCostBasis * (before === 0 ? 0 : (sipBalance / before));
        }
        sipBalance -= fromSip;
        const fromEpf = Math.min(epfBalance, annualNow - fromSip);
        epfBalance -= fromEpf;

        // Update the summary tracker (silent — no goalOutflow entry).
        const existing = eventTrackers.get(e.id);
        if (existing) {
          existing.lastAge = endOfYearAge;
          existing.lastCost = annualNow;
          existing.count += 1;
          existing.totalNominal += annualNow;
        } else {
          eventTrackers.set(e.id, {
            id: e.id,
            name: e.name,
            firstAge: endOfYearAge,
            lastAge: endOfYearAge,
            count: 1,
            firstCost: annualNow,
            lastCost: annualNow,
            totalNominal: annualNow,
          });
        }
      }
    }

    const loanBalances: Record<string, number> = {};
    for (const l of loans) loanBalances[l.id] = l.balance;

    monthly.push({
      monthIndex: m,
      age,
      salary: isRetired ? 0 : salary,
      otherIncome: otherIncomeThisMonth,
      expense,
      loanPayments: loanPaymentsThisMonth,
      surplus: Math.max(0, leftover),
      sipContribution: sipThisMonth,
      sipBalance,
      sipCostBasis,
      epfBalance,
      epsBalance,
      npsBalance,
      loanBalances,
      totalLoanBalance: totalLoanBalanceNow,
      otherAssetsBalance: otherAssetsNow,
      totalCorpus: sipBalance + epfBalance + npsBalance + otherAssetsNow,
      goalOutflow: goalOutflowsThisMonth.length ? goalOutflowsThisMonth : undefined,
    });

    // Events grow monthly (small effect since we only read at year-end).
    for (const e of events) e.currentMonthly *= 1 + e.monthlyG;

    // Salary, expenses, rentals, and salary-linked contributions step ONCE
    // a year at year-end — mirroring real-world hike cycles. This keeps
    // month-by-month tables from showing continuous salary drift within a year.
    if ((m + 1) % 12 === 0) {
      salary *= 1 + inputs.salaryGrowthPct / 100;
      baseExpense *= 1 + inputs.inflationPct / 100;
      for (let i = 0; i < incomes.length; i++) {
        incomes[i].current *= 1 + inputs.otherIncomes[i].growthPct / 100;
      }
      basicDA *= 1 + inputs.salaryGrowthPct / 100;
      simpleContribution *= 1 + inputs.salaryGrowthPct / 100;
      npsContribution *= 1 + inputs.salaryGrowthPct / 100;
    }
  }

  const yearly = summarizeYearly(monthly, inputs.currentAge);

  const yrsToRet = Math.max(0, inputs.retirementAge - inputs.currentAge);
  // Base monthly expense at retirement (annual events handled separately as PV below).
  const monthlyExpenseAtRetirement =
    inputs.monthlyExpense * Math.pow(1 + inputs.inflationPct / 100, yrsToRet);

  const pensionAtRetirement = detailed && epsEnabled
    ? epsMonthlyPension(epsCeiling, inputs.epfDetails.serviceYearsAtRetirement)
    : 0;
  const npsBalAtRetirement = npsBalanceAtRetirement;
  const npsAnn = inputs.nps.enabled
    ? npsPayout(npsBalAtRetirement, inputs.nps.annuityAllocationPct, inputs.nps.annuityReturn).monthlyPension
    : 0;
  // Other-income at retirement age (nominal) — those streams still active in retirement.
  const otherIncomeAtRet = inputs.otherIncomes
    .filter((oi) => oi.activeInRetirement)
    .reduce((s, oi) => s + inflate(otherIncomeMonthly(oi), oi.growthPct, yrsToRet), 0);
  // Blended growth for the passive-income annuity (weighted by contribution).
  const totalPassive = pensionAtRetirement + npsAnn + otherIncomeAtRet;
  const blendedPassiveGrowth = totalPassive > 0
    ? (otherIncomeAtRet * (inputs.otherIncomes.find((oi) => oi.activeInRetirement)?.growthPct ?? 0)) / totalPassive
    : 0;

  let targetCorpus = retirementCorpusNeeded({
    monthlyExpenseAtRetirement,
    annualInflationPct: inputs.inflationPct,
    postRetirementReturnPct: inputs.postRetirementReturnPct,
    yearsInRetirement: Math.max(1, inputs.lifeExpectancy - inputs.retirementAge),
    monthlyPassiveIncomeAtRetirement: totalPassive,
    passiveIncomeGrowthPct: blendedPassiveGrowth,
  });

  // Add PV of annual events that fire during retirement. We replicate the exact
  // firing logic used in the simulation (same yearIndex check, same untilAge guard,
  // each event's own inflation rate). This keeps targetCorpus consistent with what
  // the simulation actually withdraws — events that stop at untilAge < lifeExpectancy
  // are not counted past that age, and events with higher-than-general inflation are
  // discounted at the correct rate.
  {
    const postRm = monthlyRate(inputs.postRetirementReturnPct);
    const yearsInRet = Math.max(1, inputs.lifeExpectancy - inputs.retirementAge);
    for (const e of inputs.annualEvents) {
      if (e.frequencyYears <= 0 || e.untilAge <= inputs.retirementAge) continue;
      for (let yr = 1; yr <= yearsInRet; yr++) {
        const globalYearIndex = yrsToRet + yr - 1;
        if (globalYearIndex % e.frequencyYears !== 0) continue;
        const fireAge = inputs.currentAge + globalYearIndex + 1;
        if (fireAge > e.untilAge) break;
        const inflatedCost = e.annualCost * Math.pow(1 + e.inflationPct / 100, yrsToRet + yr);
        targetCorpus += inflatedCost / Math.pow(1 + postRm, yr * 12);
      }
    }
  }

  const atRetirement = monthly[Math.min(monthly.length - 1, retirementMonthIndex)];
  const corpusAtRetirement = atRetirement ? atRetirement.totalCorpus : 0;

  // atRetirement.sipBalance includes EPF lump + NPS 60% lump (both merged at retirement).
  // Subtract them back so computeTax can report each component separately and correctly.
  // computeTax re-adds epfBalance and nps.lump to compute grossCorpus — so they must not
  // already be inside sipBalance.
  const npsLumpMerged = inputs.nps.enabled
    ? npsBalAtRetirement * (1 - inputs.nps.annuityAllocationPct / 100)
    : 0;
  const tax = computeTax({
    sipBalance: Math.max(0, (atRetirement?.sipBalance ?? 0) - epfMergedAtRetirement - npsLumpMerged),
    sipCostBasis: Math.max(0, (atRetirement?.sipCostBasis ?? 0) - epfMergedAtRetirement - npsLumpMerged),
    epfBalance: epfMergedAtRetirement,
    epsBalance: atRetirement?.epsBalance ?? 0,
    epsMonthlyPension: pensionAtRetirement,
    npsBalance: npsBalAtRetirement,
    npsAnnuityAllocationPct: inputs.nps.enabled ? inputs.nps.annuityAllocationPct : 0,
    npsAnnuityReturn: inputs.nps.annuityReturn,
    otherRetirementIncome: otherIncomeAtRet,
    ltcgRatePct: inputs.ltcgRatePct,
    ltcgAnnualExemption: inputs.ltcgAnnualExemption,
  });

  const real = {
    corpusAtRetirement: deflate(corpusAtRetirement, inputs.inflationPct, yrsToRet),
    targetCorpus: deflate(targetCorpus, inputs.inflationPct, yrsToRet),
    surplusOrShortfall: deflate(corpusAtRetirement - targetCorpus, inputs.inflationPct, yrsToRet),
    netCorpus: deflate(tax.netCorpus, inputs.inflationPct, yrsToRet),
    epsMonthlyPension: deflate(pensionAtRetirement, inputs.inflationPct, yrsToRet),
    npsMonthlyPension: deflate(npsAnn, inputs.inflationPct, yrsToRet),
  };

  // Corpus longevity — scan post-retirement months for the point where the
  // spendable corpus (SIP + EPF; NPS annuity corpus is locked separately)
  // drops to zero. Null means it lasts through the horizon.
  let corpusExhaustedMonthIndex: number | null = null;
  for (let i = retirementMonthIndex; i < monthly.length; i++) {
    const spend = monthly[i].sipBalance + monthly[i].epfBalance;
    if (spend <= 0.01) { corpusExhaustedMonthIndex = i; break; }
  }
  // Total corpus left at the end of the sim (~life expectancy). Only meaningful
  // when the sim didn't exhaust the pot mid-way.
  const corpusAtLifeExpectancy = monthly.length > 0
    ? monthly[monthly.length - 1].totalCorpus
    : 0;
  const yrsToLifeEnd = Math.max(1, inputs.lifeExpectancy - inputs.currentAge);
  const corpusAtLifeExpectancyReal = deflate(corpusAtLifeExpectancy, inputs.inflationPct, yrsToLifeEnd);
  const realWithLE = { ...real, corpusAtLifeExpectancy: corpusAtLifeExpectancyReal };

  return {
    monthly,
    yearly,
    loanClosures: closures,
    retirementMonthIndex,
    corpusAtRetirement,
    targetCorpus,
    surplusOrShortfall: corpusAtRetirement - targetCorpus,
    totalInterestPaid: loans.reduce((s, l) => s + l.totalInterestPaid, 0),
    debtFreeMonthIndex,
    tax,
    loansOutstandingAtRetirement,
    lumpCloseAmount,
    corpusExhaustedMonthIndex,
    corpusAtLifeExpectancy,
    existingAssetValuesAtRetirement,
    narrative: [], // filled in by narrateScenario
    annualEventSummary: [...eventTrackers.values()],
    totalAnnualEventCost: [...eventTrackers.values()].reduce((s, t) => s + t.totalNominal, 0),
    real: realWithLE,
  };
}

/** Placeholder helper — NPS annuity monthly stream during drawdown.
 * We compute the annuity pension once at retirement start using the NPS
 * balance at that instant. During retirement months the pension is fixed.
 */
function npsAnnuityMonthlyStream(
  inputs: PlanInputs,
  currentMonth: number,
  retirementMonthIndex: number,
  monthlySoFar: MonthlySnapshot[],
): number {
  if (!inputs.nps.enabled) return 0;
  if (currentMonth < retirementMonthIndex) return 0;
  const snap = monthlySoFar[retirementMonthIndex - 1] ?? monthlySoFar[monthlySoFar.length - 1];
  const bal = snap ? snap.npsBalance : 0;
  return npsPayout(bal, inputs.nps.annuityAllocationPct, inputs.nps.annuityReturn).monthlyPension;
}

function summarizeYearly(monthly: MonthlySnapshot[], startAge: number): YearlySnapshot[] {
  const out: YearlySnapshot[] = [];
  for (let y = 0; y * 12 < monthly.length; y++) {
    const slice = monthly.slice(y * 12, y * 12 + 12);
    if (slice.length === 0) break;
    const last = slice[slice.length - 1];
    const sum = (fn: (s: MonthlySnapshot) => number) => slice.reduce((s, m) => s + fn(m), 0);
    out.push({
      yearOffset: y,
      // Age at START of this year — so retirementAge (55) rows show retirement figures.
      age: startAge + y,
      salary: sum((s) => s.salary),
      otherIncome: sum((s) => s.otherIncome),
      expense: sum((s) => s.expense),
      emiPaid: sum((s) => s.loanPayments),
      surplus: sum((s) => s.surplus),
      sipContribution: sum((s) => s.sipContribution),
      sipBalance: last.sipBalance,
      epfBalance: last.epfBalance,
      epsBalance: last.epsBalance,
      npsBalance: last.npsBalance,
      totalLoanBalance: last.totalLoanBalance,
      otherAssetsBalance: last.otherAssetsBalance,
      totalCorpus: last.totalCorpus,
    });
  }
  return out;
}

export function monthLabel(monthIndex: number, startYear = new Date().getFullYear(), startMonth = new Date().getMonth()) {
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const total = startMonth + monthIndex;
  const year = startYear + Math.floor(total / 12);
  return `${names[total % 12]} ${year}`;
}

/**
 * Build a chronological narrative for a strategy so users understand
 * *what actually happens* month-by-month. Includes:
 *  - Plan-start snapshot
 *  - Each loan closing (with freed-up EMI note)
 *  - Life-goal outflows
 *  - Retirement (with corpus, outstanding-loan info, lump-close)
 */
export function narrateScenario(inputs: PlanInputs, mode: ScenarioMode, result: ProjectionResult): StrategyEvent[] {
  const events: StrategyEvent[] = [];
  const retMonth = result.retirementMonthIndex;
  const first = result.monthly[0];
  if (!first) return events;

  // Start. Compute the pre-allocation monthly pool so we can quote a real ₹.
  const scheduledEMI = inputs.loans.reduce((s, l) => s + l.emi, 0);
  const monthOnePool = first.loanPayments + first.surplus; // total available for loans+SIP
  const extraAboveEMI = Math.max(0, monthOnePool - scheduledEMI);
  const emiStr = `₹${Math.round(scheduledEMI).toLocaleString("en-IN")}/mo`;
  const extraStr = `₹${Math.round(extraAboveEMI).toLocaleString("en-IN")}/mo`;

  const acceleratedNames = (inputs.customStrategy?.acceleratedLoanIds ?? [])
    .map((id) => inputs.loans.find((l) => l.id === id)?.name)
    .filter(Boolean)
    .join(" → ");

  const startDetail = mode === "debt-first"
    ? `After paying base EMIs (${emiStr}) and expenses, ~${extraStr} is your surplus. In this strategy, that full surplus accelerates the next open loan. SIP contribution stays ₹0 until every loan is closed.`
    : mode === "invest-alongside"
    ? `Only the scheduled EMI (${emiStr}) is paid on each loan. Your surplus of ~${extraStr} flows into SIP from month 1. Loans amortise naturally, and anything still open at retirement is lump-closed from corpus.`
    : mode === "custom"
    ? `Your priority order: ${acceleratedNames || "(none)"}. All surplus (~${extraStr}) attacks that list one at a time. Non-selected loans continue at minimum EMI. SIP starts once every accelerated loan is closed.`
    : `Loans above ${inputs.sipReturnPct}% (higher than SIP return) get accelerated — their share of your ~${extraStr} surplus is used for extra payments. Cheaper loans get minimum EMI only, and the rest of the surplus flows into SIP.`;
  events.push({
    monthIndex: 0,
    age: inputs.currentAge,
    kind: "start",
    title: "Plan begins",
    detail: startDetail,
  });

  // Loan closures pre-retirement.
  const sorted = [...result.loanClosures].sort((a, b) => a.monthIndex - b.monthIndex);
  for (const c of sorted) {
    if (c.monthIndex >= retMonth) continue; // lump-close events handled below
    const loan = inputs.loans.find((l) => l.id === c.loanId);
    const freed = loan ? loan.emi : 0;
    const interestNote = `Interest paid on this loan: ₹${Math.round(c.totalInterestPaid).toLocaleString("en-IN")}.`;
    let flowNote = "";
    if (freed > 0) {
      const rupees = `₹${Math.round(freed).toLocaleString("en-IN")}/mo`;
      if (mode === "debt-first") {
        flowNote = `Freed-up ${rupees} now accelerates the next loan (or begins SIP once every loan is cleared). `;
      } else if (mode === "smart-hybrid" && inputs.loans.find((l) => l.id === c.loanId && l.annualRate > inputs.sipReturnPct)) {
        flowNote = `This was a high-rate loan you were accelerating. Freed-up ${rupees} now flows into your SIP. `;
      } else {
        flowNote = `Freed-up ${rupees} now flows into your SIP. `;
      }
    }
    events.push({
      monthIndex: c.monthIndex,
      age: inputs.currentAge + c.monthIndex / 12,
      kind: "loan-close",
      title: `${c.name} paid off`,
      detail: flowNote + interestNote,
      amount: freed,
    });
  }

  // Life-goal outflows.
  for (const m of result.monthly) {
    if (!m.goalOutflow) continue;
    for (const g of m.goalOutflow) {
      events.push({
        monthIndex: m.monthIndex,
        age: m.age,
        kind: "goal",
        title: `Goal: ${g.name}`,
        detail: `₹${Math.round(g.amount).toLocaleString("en-IN")} withdrawn from corpus (inflated to this year's rupees).`,
        amount: g.amount,
      });
    }
  }

  // Debt-free milestone (only interesting when it's before retirement AND after month 0).
  if (result.debtFreeMonthIndex !== null && result.debtFreeMonthIndex > 0 && result.debtFreeMonthIndex < retMonth) {
    events.push({
      monthIndex: result.debtFreeMonthIndex,
      age: inputs.currentAge + result.debtFreeMonthIndex / 12,
      kind: "sip-start",
      title: "Fully debt-free",
      detail: mode === "debt-first"
        ? "From here, 100% of the surplus that used to pay EMIs starts flowing into your SIP."
        : "All loans are paid off ahead of retirement.",
    });
  }

  // Retirement.
  const retSnap = result.monthly[Math.min(result.monthly.length - 1, retMonth)];
  const retCorpus = retSnap ? retSnap.totalCorpus : 0;
  const outstanding = result.loansOutstandingAtRetirement;
  const lumpClosed = result.lumpCloseAmount;

  let retDetail = `Corpus of ₹${Math.round(retCorpus).toLocaleString("en-IN")} in place.`;
  if (lumpClosed > 0.01) {
    retDetail += ` ₹${Math.round(lumpClosed).toLocaleString("en-IN")} used to close remaining loans in a single lump payment (the smart default — carrying EMIs into a fixed retirement corpus is bad math).`;
  } else {
    retDetail += " All loans already paid off.";
  }
  events.push({
    monthIndex: retMonth,
    age: inputs.retirementAge,
    kind: "retirement",
    title: `Retirement (age ${inputs.retirementAge})`,
    detail: retDetail,
    amount: retCorpus,
  });

  // Pension / passive income summary at retirement.
  const streams: string[] = [];
  if (result.tax.epsMonthlyPension > 0) streams.push(`EPS pension ₹${Math.round(result.tax.epsMonthlyPension).toLocaleString("en-IN")}`);
  if (result.tax.npsMonthlyPension > 0) streams.push(`NPS annuity ₹${Math.round(result.tax.npsMonthlyPension).toLocaleString("en-IN")}`);
  if (result.tax.otherRetirementIncome > 0) streams.push(`other income ₹${Math.round(result.tax.otherRetirementIncome).toLocaleString("en-IN")}`);
  const totalPassive = result.tax.epsMonthlyPension + result.tax.npsMonthlyPension + result.tax.otherRetirementIncome;

  if (streams.length) {
    events.push({
      monthIndex: retMonth,
      age: inputs.retirementAge,
      kind: "retirement",
      title: "Passive income kicks in",
      detail: `Every month you get ${streams.join(" + ")} = about ₹${Math.round(totalPassive).toLocaleString("en-IN")}/mo without touching your corpus.`,
      amount: totalPassive,
    });
  }

  const withdrawFromCorpus = Math.max(0, (result.monthly[retMonth]?.expense ?? 0) - totalPassive);

  events.push({
    monthIndex: retMonth + 1,
    age: inputs.retirementAge + 1 / 12,
    kind: "withdrawal",
    title: "Living in retirement",
    amount: withdrawFromCorpus,
  });

  // Chronological order for a clean visual timeline. Ties preserve insertion order
  // (so "Retirement" comes before "Passive income" at the same month).
  events.sort((a, b) => a.monthIndex - b.monthIndex);

  return events;
}

export function runScenarios(inputs: PlanInputs): Scenario[] {
  const retirementMonth = Math.max(0, (inputs.retirementAge - inputs.currentAge) * 12);
  const sipR = inputs.sipReturnPct;

  const highRateIds = new Set(inputs.loans.filter((l) => l.annualRate > sipR).map((l) => l.id));
  const hasHigh = highRateIds.size > 0;
  const hasLow = inputs.loans.some((l) => l.annualRate <= sipR);

  const debtFirst = runProjection(inputs, { minimumOnly: false });
  const investAlongside = runProjection(inputs, { minimumOnly: true });

  // Note: "Close at retirement" as a separate strategy is no longer needed —
  // the engine now auto-closes any remaining loans at retirement in every
  // scenario (it's the smart default). Old scenario removed.
  const list: Scenario[] = [
    { mode: "debt-first", label: "Debt first", description: "Accelerate every loan with all surplus, then invest what's left once you're debt-free.", result: debtFirst },
    { mode: "invest-alongside", label: "Invest alongside", description: "Pay only scheduled EMIs. All monthly surplus goes into SIP from day one. Any loan still open at retirement is closed as a lump from corpus.", result: investAlongside },
  ];

  if (hasHigh && hasLow) {
    const hybrid = runProjection(inputs, { acceleratedLoanIds: highRateIds });
    list.push({
      mode: "smart-hybrid",
      label: "Smart hybrid",
      description: `Accelerate loans above ${sipR.toFixed(1)}% (higher than SIP return); pay minimum on cheaper loans and invest the surplus.`,
      result: hybrid,
    });
  }

  // User's own priority plan — only run when they've configured it.
  const custom = inputs.customStrategy;
  const customIds = (custom?.acceleratedLoanIds ?? []).filter((id) => inputs.loans.some((l) => l.id === id));
  if (custom?.enabled && customIds.length > 0) {
    // Locally override the payoff order so surplus flows in the exact order
    // the user chose (independent of the top-level Avalanche/Snowball setting).
    const customInputs: PlanInputs = {
      ...inputs,
      payoffStrategy: "custom",
      customLoanOrder: customIds,
    };
    const customResult = runProjection(customInputs, {
      acceleratedLoanIds: new Set(customIds),
    });
    const names = customIds
      .map((id) => inputs.loans.find((l) => l.id === id)?.name ?? id)
      .join(" → ");
    list.push({
      mode: "custom",
      label: "Your custom plan",
      description: `Attack ${names} first with all surplus (in that order). Other loans get minimum EMI only. SIP kicks in once these are cleared.`,
      result: customResult,
    });
  }

  // Attach narratives.
  for (const s of list) {
    s.result.narrative = narrateScenario(inputs, s.mode, s.result);
  }

  // Pick winner by post-tax net corpus.
  let bestIdx = 0;
  for (let i = 1; i < list.length; i++) {
    if (list[i].result.tax.netCorpus > list[bestIdx].result.tax.netCorpus) bestIdx = i;
  }
  const bestNet = list[bestIdx].result.tax.netCorpus;
  let runnerUp = -Infinity;
  for (let i = 0; i < list.length; i++) {
    if (i === bestIdx) continue;
    if (list[i].result.tax.netCorpus > runnerUp) runnerUp = list[i].result.tax.netCorpus;
  }
  list[bestIdx].isRecommended = true;
  list[bestIdx].deltaOverRunnerUp = isFinite(runnerUp) ? bestNet - runnerUp : 0;

  return list;
}

export function inr(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
  return `${sign}₹${Math.round(abs)}`;
}

export function inrFull(n: number): string {
  if (!isFinite(n)) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
