/**
 * Pure calculation functions for the standalone /calculators tools.
 * Kept separate from the main planner engine — these are single-purpose,
 * self-contained, and reusable.
 */

// ────────────────────────────────────────────────────────────────────────────
// Investment growth
// ────────────────────────────────────────────────────────────────────────────

/**
 * Future value of a monthly SIP (annuity-due — contribution at start of month,
 * matching most Indian mutual-fund SIP conventions).
 */
export function sipFutureValue(args: {
  monthly: number;
  annualReturnPct: number;
  years: number;
}): number {
  const { monthly, annualReturnPct, years } = args;
  const r = annualReturnPct / 100 / 12;
  const n = Math.round(years * 12);
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

/**
 * Step-up SIP: monthly SIP grows by `annualStepPct` each year.
 * Iterates year-by-year for clarity.
 */
export function stepSipFutureValue(args: {
  startingMonthly: number;
  annualStepPct: number;
  annualReturnPct: number;
  years: number;
}): { finalValue: number; totalInvested: number } {
  const { startingMonthly, annualStepPct, annualReturnPct, years } = args;
  const r = annualReturnPct / 100 / 12;
  const yearsInt = Math.max(0, Math.round(years));
  let monthly = startingMonthly;
  let fv = 0;
  let invested = 0;
  for (let y = 0; y < yearsInt; y++) {
    // Future value of 12 contributions made during year y, at end of year y
    const yearEndFv = r === 0
      ? monthly * 12
      : monthly * ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
    // Then compound for remaining full years
    const remainingYears = yearsInt - y - 1;
    fv += yearEndFv * Math.pow(1 + r, remainingYears * 12);
    invested += monthly * 12;
    monthly *= 1 + annualStepPct / 100;
  }
  return { finalValue: fv, totalInvested: invested };
}

/** Lump-sum future value with configurable compounding frequency. */
export function lumpSumFutureValue(args: {
  principal: number;
  annualReturnPct: number;
  years: number;
  compoundingsPerYear?: number;
}): number {
  const { principal, annualReturnPct, years, compoundingsPerYear = 1 } = args;
  if (annualReturnPct === 0) return principal;
  const r = annualReturnPct / 100 / compoundingsPerYear;
  const n = years * compoundingsPerYear;
  return principal * Math.pow(1 + r, n);
}

/** CAGR from initial → final over n years. */
export function cagr(initial: number, final: number, years: number): number {
  if (initial <= 0 || years <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

// ────────────────────────────────────────────────────────────────────────────
// Bank / post office products
// ────────────────────────────────────────────────────────────────────────────

/** Fixed Deposit maturity. Indian FDs typically compound quarterly. */
export function fdMaturity(args: {
  principal: number;
  annualRatePct: number;
  years: number;
  compoundingsPerYear?: number;
}): { maturity: number; interest: number } {
  const compoundingsPerYear = args.compoundingsPerYear ?? 4;
  const maturity = lumpSumFutureValue({
    principal: args.principal,
    annualReturnPct: args.annualRatePct,
    years: args.years,
    compoundingsPerYear,
  });
  return { maturity, interest: maturity - args.principal };
}

/**
 * Recurring Deposit maturity. Indian RDs compound quarterly. Deposits are
 * made monthly; each deposit earns interest for the remaining tenure.
 */
export function rdMaturity(args: {
  monthly: number;
  annualRatePct: number;
  years: number;
}): { maturity: number; totalDeposited: number; interest: number } {
  const { monthly, annualRatePct, years } = args;
  const quarterlyR = annualRatePct / 100 / 4;
  const totalMonths = Math.round(years * 12);
  let maturity = 0;
  for (let m = 0; m < totalMonths; m++) {
    // Deposit made at month m earns interest for (totalMonths - m) months
    // = (totalMonths - m) / 3 quarters
    const quarters = (totalMonths - m) / 3;
    maturity += monthly * Math.pow(1 + quarterlyR, quarters);
  }
  const totalDeposited = monthly * totalMonths;
  return { maturity, totalDeposited, interest: maturity - totalDeposited };
}

/**
 * Post Office MIS — monthly interest paid out (not reinvested), principal
 * returned at maturity (5-year term).
 */
export function postOfficeMis(args: {
  deposit: number;
  annualRatePct: number;
}): { monthlyInterest: number; annualInterest: number; totalInterest5yr: number } {
  const monthlyInterest = (args.deposit * args.annualRatePct) / 100 / 12;
  return {
    monthlyInterest,
    annualInterest: monthlyInterest * 12,
    totalInterest5yr: monthlyInterest * 60,
  };
}

/**
 * Senior Citizen Savings Scheme — quarterly interest payout, 5-year term.
 */
export function scss(args: {
  deposit: number;
  annualRatePct: number;
}): { quarterlyInterest: number; annualInterest: number; totalInterest5yr: number } {
  const quarterlyInterest = (args.deposit * args.annualRatePct) / 100 / 4;
  return {
    quarterlyInterest,
    annualInterest: quarterlyInterest * 4,
    totalInterest5yr: quarterlyInterest * 20,
  };
}

/**
 * PPF — annual contribution, compounds yearly at declared rate (7.1% currently),
 * 15-year lock-in. Contributions at start of year for max benefit.
 */
export function ppfMaturity(args: {
  annualInvestment: number;
  annualRatePct: number;
  years: number;
}): { maturity: number; totalInvested: number; interest: number } {
  const { annualInvestment, annualRatePct, years } = args;
  const r = annualRatePct / 100;
  let balance = 0;
  for (let y = 0; y < Math.round(years); y++) {
    balance += annualInvestment; // contribution at start of year
    balance *= 1 + r; // interest at end of year
  }
  const totalInvested = annualInvestment * Math.round(years);
  return {
    maturity: balance,
    totalInvested,
    interest: balance - totalInvested,
  };
}

/**
 * Sukanya Samriddhi Yojana — girl child scheme. Deposits allowed for 15 years,
 * matures at 21. Interest compounded annually.
 */
export function sukanya(args: {
  annualInvestment: number;
  annualRatePct: number;
  startAge: number;
  contributionYears?: number;
  maturityAge?: number;
}): { maturity: number; totalInvested: number; interest: number } {
  const contribYears = args.contributionYears ?? 15;
  const maturityAge = args.maturityAge ?? 21;
  const totalYears = maturityAge - args.startAge;
  const r = args.annualRatePct / 100;
  let balance = 0;
  for (let y = 0; y < totalYears; y++) {
    if (y < contribYears) balance += args.annualInvestment;
    balance *= 1 + r;
  }
  const totalInvested = args.annualInvestment * contribYears;
  return { maturity: balance, totalInvested, interest: balance - totalInvested };
}

/** NSC — 5-year National Savings Certificate. Interest compounds annually. */
export function nsc(args: {
  investment: number;
  annualRatePct: number;
  years?: number;
}): { maturity: number; interest: number } {
  const years = args.years ?? 5;
  const maturity = args.investment * Math.pow(1 + args.annualRatePct / 100, years);
  return { maturity, interest: maturity - args.investment };
}

/**
 * Sovereign Gold Bond — 2.5% coupon (paid semi-annually) on the initial gold
 * value, plus capital appreciation on gold. Maturity capital gain is tax-free
 * for retail holders (8-year hold).
 */
export function sgb(args: {
  grams: number;
  gramPrice: number;
  goldAppreciationPct: number;
  tenureYears?: number;
  couponPct?: number;
}): {
  invested: number;
  couponIncome: number;
  maturityGoldValue: number;
  capitalGain: number;
  totalReturn: number;
  effectiveCagr: number;
} {
  const tenure = args.tenureYears ?? 8;
  const coupon = args.couponPct ?? 2.5;
  const invested = args.grams * args.gramPrice;
  // Coupon is on the initial investment amount, paid throughout tenure.
  const couponIncome = invested * (coupon / 100) * tenure;
  const maturityGoldValue = invested * Math.pow(1 + args.goldAppreciationPct / 100, tenure);
  const capitalGain = maturityGoldValue - invested;
  const totalReturn = couponIncome + capitalGain;
  const effectiveCagr = tenure > 0
    ? (Math.pow((invested + totalReturn) / invested, 1 / tenure) - 1) * 100
    : 0;
  return { invested, couponIncome, maturityGoldValue, capitalGain, totalReturn, effectiveCagr };
}

// ────────────────────────────────────────────────────────────────────────────
// Loans
// ────────────────────────────────────────────────────────────────────────────

/** Standard reducing-balance EMI. */
export function emiCalc(args: {
  principal: number;
  annualRatePct: number;
  years: number;
}): { emi: number; totalPayment: number; totalInterest: number } {
  const { principal, annualRatePct, years } = args;
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (r === 0) {
    const emi = principal / n;
    return { emi, totalPayment: principal, totalInterest: 0 };
  }
  const emi =
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  return { emi, totalPayment, totalInterest: totalPayment - principal };
}

/** Loan amortization schedule (month-by-month). */
export function amortize(args: {
  principal: number;
  annualRatePct: number;
  years: number;
}): { month: number; interest: number; principal: number; balance: number }[] {
  const { principal, annualRatePct, years } = args;
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  const emi = emiCalc(args).emi;
  const rows: { month: number; interest: number; principal: number; balance: number }[] = [];
  let balance = principal;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: m, interest, principal: principalPaid, balance });
  }
  return rows;
}

/**
 * Loan prepayment analysis — compare two outcomes of a one-time prepayment:
 *   1. Reduce tenure (keep same EMI, finish faster)
 *   2. Reduce EMI (keep same tenure, pay less monthly)
 */
export function loanPrepayment(args: {
  outstanding: number;
  annualRatePct: number;
  remainingYears: number;
  prepaymentAmount: number;
}): {
  baseline: { emi: number; totalInterest: number; months: number };
  reduceTenure: { emi: number; totalInterest: number; months: number; interestSaved: number; monthsSaved: number };
  reduceEmi: { emi: number; totalInterest: number; months: number; interestSaved: number };
} {
  const r = args.annualRatePct / 100 / 12;
  const n = Math.round(args.remainingYears * 12);
  const baseEmi = emiCalc({
    principal: args.outstanding,
    annualRatePct: args.annualRatePct,
    years: args.remainingYears,
  }).emi;
  const baseTotal = baseEmi * n;
  const baseInterest = baseTotal - args.outstanding;

  // After prepayment, principal drops.
  const newPrincipal = Math.max(0, args.outstanding - args.prepaymentAmount);

  // Option A — same EMI, fewer months.
  // n = ln(EMI / (EMI - P·r)) / ln(1+r)
  let reduceTenureMonths = 0;
  if (r > 0 && newPrincipal > 0) {
    const inside = baseEmi / (baseEmi - newPrincipal * r);
    reduceTenureMonths = Math.max(0, Math.ceil(Math.log(inside) / Math.log(1 + r)));
  } else if (baseEmi > 0) {
    reduceTenureMonths = Math.ceil(newPrincipal / baseEmi);
  }
  const reduceTenureTotal = baseEmi * reduceTenureMonths;
  const reduceTenureInterest = Math.max(0, reduceTenureTotal - newPrincipal);

  // Option B — same tenure, lower EMI.
  const reduceEmiEmi = emiCalc({
    principal: newPrincipal,
    annualRatePct: args.annualRatePct,
    years: args.remainingYears,
  }).emi;
  const reduceEmiTotal = reduceEmiEmi * n;
  const reduceEmiInterest = Math.max(0, reduceEmiTotal - newPrincipal);

  return {
    baseline: { emi: baseEmi, totalInterest: baseInterest, months: n },
    reduceTenure: {
      emi: baseEmi,
      totalInterest: reduceTenureInterest,
      months: reduceTenureMonths,
      interestSaved: baseInterest - reduceTenureInterest,
      monthsSaved: n - reduceTenureMonths,
    },
    reduceEmi: {
      emi: reduceEmiEmi,
      totalInterest: reduceEmiInterest,
      months: n,
      interestSaved: baseInterest - reduceEmiInterest,
    },
  };
}

/**
 * Increase-EMI variant: user voluntarily pays a higher monthly amount than
 * the scheduled EMI. Returns new tenure and interest saved.
 */
export function emiIncrease(args: {
  outstanding: number;
  annualRatePct: number;
  remainingYears: number;
  extraMonthly: number;
}): {
  baseEmi: number;
  newEmi: number;
  monthsToClose: number;
  monthsSaved: number;
  totalInterest: number;
  interestSaved: number;
} {
  const baseEmi = emiCalc({
    principal: args.outstanding,
    annualRatePct: args.annualRatePct,
    years: args.remainingYears,
  }).emi;
  const newEmi = baseEmi + Math.max(0, args.extraMonthly);
  const r = args.annualRatePct / 100 / 12;
  const baselineMonths = Math.round(args.remainingYears * 12);
  const baselineInterest = baseEmi * baselineMonths - args.outstanding;

  let months: number;
  if (r > 0 && newEmi > args.outstanding * r) {
    months = Math.max(
      1,
      Math.ceil(Math.log(newEmi / (newEmi - args.outstanding * r)) / Math.log(1 + r)),
    );
  } else if (newEmi > 0) {
    months = Math.ceil(args.outstanding / newEmi);
  } else {
    months = baselineMonths;
  }

  const totalInterest = Math.max(0, newEmi * months - args.outstanding);
  return {
    baseEmi,
    newEmi,
    monthsToClose: months,
    monthsSaved: Math.max(0, baselineMonths - months),
    totalInterest,
    interestSaved: Math.max(0, baselineInterest - totalInterest),
  };
}

/**
 * Amortization schedule for any given EMI (typically the increased EMI).
 * Runs until the balance is cleared or a safety cap is hit.
 */
export function amortizeAtEmi(args: {
  outstanding: number;
  annualRatePct: number;
  emi: number;
}): { month: number; interest: number; principal: number; balance: number }[] {
  const r = args.annualRatePct / 100 / 12;
  const rows: { month: number; interest: number; principal: number; balance: number }[] = [];
  let balance = args.outstanding;
  const MAX_MONTHS = 1200;
  for (let m = 1; m <= MAX_MONTHS && balance > 0.01; m++) {
    const interest = balance * r;
    let principalPaid = args.emi - interest;
    if (principalPaid <= 0) break; // EMI can't cover interest — infinite loop guard
    principalPaid = Math.min(principalPaid, balance);
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: m, interest, principal: principalPaid, balance });
  }
  return rows;
}

// ────────────────────────────────────────────────────────────────────────────
// Withdrawals
// ────────────────────────────────────────────────────────────────────────────

/**
 * SWP — how does a corpus evolve when you withdraw a fixed amount monthly?
 * Returns final balance, months it lasted, and total withdrawn.
 */
export function swp(args: {
  initialCorpus: number;
  monthlyWithdrawal: number;
  annualReturnPct: number;
  years: number;
  /** Withdrawal steps up by this % once a year to preserve purchasing power. */
  annualInflationPct?: number;
  /** How much of the initial corpus is your cost basis (contributions paid).
   *  Anything above this is gains that will attract LTCG when withdrawn.
   *  Defaults to `initialCorpus` — i.e. treat corpus as freshly parked capital. */
  costBasis?: number;
  /** LTCG rate on equity-MF gains (12.5% since Union Budget 2024). */
  ltcgRatePct?: number;
  /** Annual gains exemption before LTCG kicks in (₹1.25L per Budget 2024). */
  ltcgAnnualExemption?: number;
}): {
  finalBalance: number;
  monthsLasted: number;
  totalWithdrawn: number;
  totalLtcgTax: number;
  netAfterTax: number;
  firstMonthlyWithdrawal: number;
  lastMonthlyWithdrawal: number;
  schedule: { month: number; balance: number; withdrawn: number }[];
} {
  const {
    initialCorpus,
    monthlyWithdrawal,
    annualReturnPct,
    years,
    annualInflationPct = 0,
    costBasis: costBasisArg,
    ltcgRatePct = 12.5,
    ltcgAnnualExemption = 125000,
  } = args;
  const r = annualReturnPct / 100 / 12;
  const infl = annualInflationPct / 100;
  const totalMonths = Math.round(years * 12);

  let balance = initialCorpus;
  let costBasis = costBasisArg ?? initialCorpus;
  // Pre-apply one inflation step so year-N withdrawal = initial × (1+i)^N,
  // consistent with a standalone inflation projection over N years.
  let withdrawal = infl > 0 ? monthlyWithdrawal * (1 + infl) : monthlyWithdrawal;
  let monthsLasted = 0;
  let totalWithdrawn = 0;
  let lastMonthlyWithdrawal = withdrawal;
  let annualGainRealized = 0;
  let totalLtcgTax = 0;
  const schedule: { month: number; balance: number; withdrawn: number }[] = [];

  const settleAnnualTax = () => {
    const taxable = Math.max(0, annualGainRealized - ltcgAnnualExemption);
    totalLtcgTax += taxable * (ltcgRatePct / 100);
    annualGainRealized = 0;
  };

  for (let m = 1; m <= totalMonths; m++) {
    // Withdraw at start of month (annuity-due — matches Indian MF SWP convention).
    const w = Math.min(balance, withdrawal);
    // Split the withdrawal into basis + gain portions before deducting.
    const gainRatio = balance > 0 ? Math.max(0, balance - costBasis) / balance : 0;
    const gainInW = w * gainRatio;
    const basisInW = w - gainInW;
    balance -= w;
    costBasis = Math.max(0, costBasis - basisInW);
    annualGainRealized += gainInW;
    totalWithdrawn += w;
    if (w > 0.01) {
      monthsLasted++;
      lastMonthlyWithdrawal = w;
    }
    // Remainder grows for the month.
    balance = balance * (1 + r);
    schedule.push({ month: m, balance, withdrawn: w });

    // Year-end: settle LTCG on the year's realized gains, then bump withdrawal.
    if (m % 12 === 0) {
      settleAnnualTax();
      if (infl > 0) withdrawal *= 1 + infl;
    }
    if (balance <= 0.01) break;
  }
  // Settle any tail-year gains (if we broke early or didn't hit a year boundary).
  settleAnnualTax();

  return {
    finalBalance: balance,
    monthsLasted,
    totalWithdrawn,
    totalLtcgTax,
    netAfterTax: totalWithdrawn - totalLtcgTax,
    /** Actual first withdrawal — equals monthlyWithdrawal × (1+i) when inflation is on. */
    firstMonthlyWithdrawal: infl > 0 ? monthlyWithdrawal * (1 + infl) : monthlyWithdrawal,
    lastMonthlyWithdrawal,
    schedule,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Tax (FY 2025-26 slabs)
// ────────────────────────────────────────────────────────────────────────────

/** New regime slabs — Budget 2025 (FY 2025-26). */
const newRegimeSlabs: { upTo: number; rate: number }[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

/** Old regime slabs — age-dependent basic exemption. */
function oldRegimeSlabs(
  age: "below60" | "60to79" | "above80",
): { upTo: number; rate: number }[] {
  const exempt = age === "below60" ? 250000 : age === "60to79" ? 300000 : 500000;
  const slabs: { upTo: number; rate: number }[] = [];
  slabs.push({ upTo: exempt, rate: 0 });
  if (exempt < 500000) slabs.push({ upTo: 500000, rate: 5 });
  slabs.push({ upTo: 1000000, rate: 20 });
  slabs.push({ upTo: Infinity, rate: 30 });
  return slabs;
}

function slabTax(
  taxable: number,
  slabs: { upTo: number; rate: number }[],
): number {
  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    if (taxable <= prev) break;
    const inSlab = Math.min(taxable, s.upTo) - prev;
    tax += Math.max(0, inSlab) * (s.rate / 100);
    prev = s.upTo;
  }
  return tax;
}

export interface TaxDeductions {
  standard?: number;
  section80C?: number;
  section80D?: number;
  hraExempt?: number;
  homeLoanInterest?: number;
  npsEmployer?: number;
  other?: number;
}

/**
 * Compute income-tax under a specific regime. Adds 4% health & education cess.
 * Rebate u/s 87A applied where relevant.
 */
export function incomeTax(args: {
  regime: "new" | "old";
  grossIncome: number;
  age: "below60" | "60to79" | "above80";
  deductions?: TaxDeductions;
}): {
  taxable: number;
  taxBeforeRebate: number;
  rebate: number;
  cess: number;
  totalTax: number;
} {
  const d = args.deductions ?? {};
  const std = d.standard ?? (args.regime === "new" ? 75000 : 50000);
  const extraOld = args.regime === "old"
    ? (d.section80C ?? 0) + (d.section80D ?? 0) + (d.hraExempt ?? 0) +
      (d.homeLoanInterest ?? 0) + (d.other ?? 0)
    : 0;
  const npsEmployer = d.npsEmployer ?? 0; // 80CCD(2) — allowed under both regimes
  const taxable = Math.max(0, args.grossIncome - std - extraOld - npsEmployer);

  const slabs = args.regime === "new" ? newRegimeSlabs : oldRegimeSlabs(args.age);
  const taxBeforeRebate = slabTax(taxable, slabs);

  // Rebate u/s 87A
  let rebate = 0;
  // New regime: full rebate for taxable income ≤ ₹12L (Budget 2025, max rebate ₹60K).
  // Old regime: rebate ≤ ₹12,500 for taxable income ≤ ₹5L.
  if (args.regime === "new" && taxable <= 1200000) {
    rebate = Math.min(taxBeforeRebate, 60000);
  } else if (args.regime === "old" && taxable <= 500000) {
    rebate = Math.min(taxBeforeRebate, 12500);
  }
  const afterRebate = taxBeforeRebate - rebate;
  const cess = afterRebate * 0.04;
  return {
    taxable,
    taxBeforeRebate,
    rebate,
    cess,
    totalTax: afterRebate + cess,
  };
}

/** HRA exemption is the least of the three. Section 10(13A). */
export function hraExemption(args: {
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  metroCity: boolean;
}): { exempt: number; taxableHra: number; a: number; b: number; c: number } {
  const a = args.hraReceived;
  const b = (args.metroCity ? 0.5 : 0.4) * args.basicSalary;
  const c = Math.max(0, args.rentPaid - 0.1 * args.basicSalary);
  const exempt = Math.max(0, Math.min(a, b, c));
  return { exempt, taxableHra: Math.max(0, args.hraReceived - exempt), a, b, c };
}

// ────────────────────────────────────────────────────────────────────────────
// Planning helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Reverse SIP — given a target amount and return, what monthly SIP is needed?
 * Existing corpus is deducted from target (compounded to end).
 */
export function goalSip(args: {
  targetAmount: number;
  years: number;
  annualReturnPct: number;
  existingCorpus?: number;
}): { requiredMonthly: number; targetShortfall: number } {
  const existingFv = args.existingCorpus
    ? args.existingCorpus * Math.pow(1 + args.annualReturnPct / 100, args.years)
    : 0;
  const shortfall = Math.max(0, args.targetAmount - existingFv);
  if (shortfall <= 0) return { requiredMonthly: 0, targetShortfall: 0 };
  const r = args.annualReturnPct / 100 / 12;
  const n = Math.round(args.years * 12);
  // Annuity-due: FV = P × ((1+r)^n - 1)/r × (1+r); solve for P.
  if (r === 0) return { requiredMonthly: shortfall / n, targetShortfall: shortfall };
  const required = shortfall / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  return { requiredMonthly: required, targetShortfall: shortfall };
}

/**
 * Term insurance need — rule-of-thumb blend of the Human Life Value method
 * (present value of future earnings) and the income-replacement method.
 * Returns a recommended sum assured after subtracting existing corpus and
 * existing life cover.
 */
export function termInsuranceNeed(args: {
  monthlyExpense: number;
  dependencyYears: number;
  inflationPct: number;
  discountRatePct: number;
  existingLiquidCorpus?: number;
  existingLifeCover?: number;
  outstandingLoans?: number;
}): { recommendedCover: number; grossNeed: number; existingOffset: number } {
  const {
    monthlyExpense,
    dependencyYears,
    inflationPct,
    discountRatePct,
    existingLiquidCorpus = 0,
    existingLifeCover = 0,
    outstandingLoans = 0,
  } = args;
  const rM = discountRatePct / 100 / 12;
  const months = Math.round(dependencyYears * 12);
  let expense = monthlyExpense;
  let pv = 0;
  for (let m = 1; m <= months; m++) {
    pv += expense / Math.pow(1 + rM, m);
    if (m % 12 === 0) expense *= 1 + inflationPct / 100;
  }
  const grossNeed = pv + outstandingLoans;
  const existingOffset = existingLiquidCorpus + existingLifeCover;
  return {
    recommendedCover: Math.max(0, grossNeed - existingOffset),
    grossNeed,
    existingOffset,
  };
}

/**
 * Rent vs Buy — compares net worth at end of horizon under both strategies.
 * Buyer: property equity (value − outstanding loan) after `horizonYears`.
 * Renter: down-payment invested + monthly (EMI − rent) surplus invested,
 *   compounded at `investmentReturnPct`. Rent grows at `rentGrowthPct`.
 */
export function rentVsBuy(args: {
  propertyPrice: number;
  downPayment: number;
  homeLoanRatePct: number;
  homeLoanYears: number;
  monthlyRent: number;
  rentGrowthPct: number;
  propertyAppreciationPct: number;
  investmentReturnPct: number;
  annualMaintenancePctOfPrice: number;
  annualPropertyTax: number;
  horizonYears: number;
}): {
  buyerNetWorth: number;
  renterNetWorth: number;
  delta: number;
  emi: number;
  loanOutstandingAtHorizon: number;
  propertyValueAtHorizon: number;
} {
  const {
    propertyPrice,
    downPayment,
    homeLoanRatePct,
    homeLoanYears,
    monthlyRent,
    rentGrowthPct,
    propertyAppreciationPct,
    investmentReturnPct,
    annualMaintenancePctOfPrice,
    annualPropertyTax,
    horizonYears,
  } = args;
  const loanPrincipal = Math.max(0, propertyPrice - downPayment);
  const emi = loanPrincipal > 0
    ? emiCalc({ principal: loanPrincipal, annualRatePct: homeLoanRatePct, years: homeLoanYears }).emi
    : 0;
  const rM = homeLoanRatePct / 100 / 12;
  const invM = investmentReturnPct / 100 / 12;

  // Buyer: track loan balance monthly + property value.
  let loanBal = loanPrincipal;
  const horizonMonths = Math.round(horizonYears * 12);
  const loanMonths = Math.round(homeLoanYears * 12);
  let annualMaint = (annualMaintenancePctOfPrice / 100) * propertyPrice;
  let annualTax = annualPropertyTax;
  // Renter: DP invested, plus monthly (EMI + maint/12 + tax/12 − rent) surplus invested.
  let renterCorpus = downPayment;
  let currentMonthlyRent = monthlyRent;
  for (let m = 1; m <= horizonMonths; m++) {
    // Buyer's monthly loan interest + principal paydown
    if (m <= loanMonths && loanBal > 0.01) {
      const interest = loanBal * rM;
      const principalPaid = Math.min(loanBal, emi - interest);
      loanBal = Math.max(0, loanBal - principalPaid);
    }
    // Renter's corpus grows
    renterCorpus *= 1 + invM;
    const buyerOutflow = (m <= loanMonths ? emi : 0) + annualMaint / 12 + annualTax / 12;
    const renterOutflow = currentMonthlyRent;
    const surplus = Math.max(0, buyerOutflow - renterOutflow);
    renterCorpus += surplus;
    if (m % 12 === 0) {
      annualMaint *= 1 + propertyAppreciationPct / 100; // maintenance scales with property value
      annualTax *= 1 + rentGrowthPct / 100;
      currentMonthlyRent *= 1 + rentGrowthPct / 100;
    }
  }
  const propertyValueAtHorizon = propertyPrice * Math.pow(1 + propertyAppreciationPct / 100, horizonYears);
  const buyerNetWorth = propertyValueAtHorizon - loanBal;
  return {
    buyerNetWorth,
    renterNetWorth: renterCorpus,
    delta: buyerNetWorth - renterCorpus,
    emi,
    loanOutstandingAtHorizon: loanBal,
    propertyValueAtHorizon,
  };
}

/** Future value of an amount at inflation rate (purchasing-power projection). */
export function inflateFV(amountToday: number, annualPct: number, years: number): number {
  return amountToday * Math.pow(1 + annualPct / 100, years);
}
/** Real (today's ₹) value of a future amount. */
export function deflateFV(futureAmount: number, annualPct: number, years: number): number {
  return futureAmount / Math.pow(1 + annualPct / 100, years);
}

// ────────────────────────────────────────────────────────────────────────────
// Formatting helper (mirrors main planner's inr)
// ────────────────────────────────────────────────────────────────────────────

export function inr(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
  return `${sign}₹${Math.round(abs)}`;
}
