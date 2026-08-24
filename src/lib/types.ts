export type LoanType = "fixed" | "overdraft";

export interface LoanInput {
  id: string;
  name: string;
  type: LoanType;
  principal: number;
  annualRate: number;
  emi: number;
}

export type PayoffStrategy = "avalanche" | "snowball" | "custom";

/**
 * Optional itemised breakdown of monthly expenses — helps users who don't
 * know their number off the top of their head. When provided, the sum drives
 * `monthlyExpense`. All values are in rupees per month unless suffixed.
 */
export interface ExpenseBreakdown {
  // Housing
  rent: number;
  maintenance: number; // society/apartment fees
  propertyTax: number;

  // Utilities
  electricity: number;
  waterGas: number;
  internetMobile: number;
  subscriptions: number; // Netflix/Prime/etc

  // Food
  groceries: number;
  eatingOut: number;

  // Transport
  fuel: number;
  cabPublicTransport: number;
  vehicleMaintenance: number;

  // Family / dependents
  schoolFees: number; // divided monthly if paid termly
  coachingBooks: number;
  domesticHelp: number;
  parentsSupport: number;

  // Health & insurance
  healthInsurance: number;
  medicines: number;
  termInsurance: number;

  // Personal & discretionary
  clothingPersonal: number;
  entertainment: number;
  travelAnnualized: number; // monthly outings — weekend trips, day-outs, etc. (Big annual trips live in annualEvents.)
  giftsFestivals: number;

  // Misc
  otherHousehold: number;
}

export type IncomeFrequency = "monthly" | "quarterly" | "half-yearly" | "annually";

export interface OtherIncome {
  id: string;
  name: string;
  /** Amount per payment. If frequency=monthly this is the monthly rent/salary;
   *  if annually it's the annual bonus / RSU vested amount, and so on. */
  amount: number;
  /** How often this income lands. Bonuses annual/quarterly, rental monthly,
   *  half-yearly retainers, etc. */
  frequency: IncomeFrequency;
  /** Annual growth — rentals with inflation, bonuses with salary hike. */
  growthPct: number;
  /** Does this stream continue after you retire? Rental yes, salary no. */
  activeInRetirement: boolean;
}

export const PAYMENTS_PER_YEAR: Record<IncomeFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  annually: 1,
};

/** Convert a per-payment amount at any frequency to monthly-equivalent. */
export const otherIncomeMonthly = (oi: Pick<OtherIncome, "amount" | "frequency">) =>
  (oi.amount * PAYMENTS_PER_YEAR[oi.frequency]) / 12;

export interface NpsDetails {
  enabled: boolean;
  balance: number;
  monthlyContribution: number;
  expectedReturn: number;
  /**
   * Fraction of NPS corpus at retirement that must go into an annuity
   * (statutory minimum is 40%). The rest (60%) can be withdrawn tax-free.
   */
  annuityAllocationPct: number;
  /** Assumed return on the annuity — used to estimate monthly pension. */
  annuityReturn: number;
}

export interface LifeGoal {
  id: string;
  name: string;
  /** Your age when this cash outflow happens. */
  targetAge: number;
  /** Cost expressed in today's rupees; inflated to targetAge in the sim. */
  currentCost: number;
  /**
   * Category-specific inflation. Education inflation runs ~10% in India,
   * marriage/lifestyle ~6-8%, general goods ~6%.
   */
  inflationPct: number;
}

/**
 * Recurring lifetime outflows — trips, festivals, big-ticket annual spends.
 * Modelled as a lump withdrawal from SIP (then EPF) at the end of each
 * trigger year. Silent in the strategy narrative — you'll see them summarised
 * in the annual-events section but not cluttering the timeline.
 */
export interface AnnualEvent {
  id: string;
  name: string;
  /** Cost per event, in today's rupees. Inflates at its own rate. */
  annualCost: number;
  /** Category inflation — foreign trips typically 8–10% (INR weakness). */
  inflationPct: number;
  /**
   * How often the event repeats. 1 = every year, 2 = every 2 years, etc.
   * Trigger year N (0-indexed from currentAge) fires when N % frequencyYears === 0.
   */
  frequencyYears: number;
  /** Age at which the event stops firing (travel capacity drops, etc). */
  untilAge: number;
}

export type AssetClass = "equity" | "gold" | "ppf" | "real-estate" | "fd" | "other";

export interface ExistingAsset {
  id: string;
  name: string;
  assetClass: AssetClass;
  currentValue: number;
  annualReturnPct: number;
}

export const ASSET_CLASS_DEFAULTS: Record<AssetClass, { label: string; returnPct: number }> = {
  equity:          { label: "Equity / MF",  returnPct: 12  },
  gold:            { label: "Gold",          returnPct: 8   },
  ppf:             { label: "PPF",           returnPct: 7.1 },
  "real-estate":   { label: "Real Estate",   returnPct: 9   },
  fd:              { label: "FD / Debt",     returnPct: 7   },
  other:           { label: "Other",         returnPct: 8   },
};

export interface EpfDetails {
  /**
   * Whether the user wants to model EPF/EPS accurately (using Basic+DA) or
   * stay with a simple monthly-contribution number.
   */
  mode: "simple" | "detailed";
  /** Basic + DA per month (used only in detailed mode). */
  basicDA: number;
  /**
   * Cap on EPS-eligible basic salary. Statutory limit is ₹15,000/mo (as of
   * 2026). Exposed for users covered by higher-wages rulings.
   */
  epsWageCeiling: number;
  /**
   * Current EPS corpus estimate (informational — EPS pays as pension, not
   * lump sum). We track this so users can see EPS build up over their career.
   */
  currentEpsBalance: number;
  /**
   * If the user opts out of EPS (e.g. new-hire above ceiling), set to false —
   * the entire 12% employer share goes to EPF instead.
   */
  epsEnabled: boolean;
  /** Assumed years of service used for EPS pension formula. */
  serviceYearsAtRetirement: number;
}

export interface PlanInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;

  monthlySalary: number;
  salaryGrowthPct: number;

  monthlyExpense: number;
  expenseBreakdown?: ExpenseBreakdown;
  useExpenseBreakdown: boolean;
  inflationPct: number;

  loans: LoanInput[];
  payoffStrategy: PayoffStrategy;
  customLoanOrder?: string[];

  epfBalance: number;
  epfMonthlyContribution: number; // Used in simple mode
  epfReturnPct: number;
  epfDetails: EpfDetails;

  existingInvestments: number; // legacy field kept for migration; prefer existingAssets
  existingAssets: ExistingAsset[];
  sipReturnPct: number;
  postRetirementReturnPct: number;

  nps: NpsDetails;
  otherIncomes: OtherIncome[];
  lifeGoals: LifeGoal[];
  annualEvents: AnnualEvent[];

  /**
   * User-defined "custom plan": which loans get all surplus payments and in
   * what order. Loans not listed here get only their scheduled EMI. Once
   * every accelerated loan is closed, remaining surplus flows into the SIP.
   */
  customStrategy: {
    enabled: boolean;
    /** Loan ids in priority order (first entry attacked first). */
    acceleratedLoanIds: string[];
  };

  // Tax settings for withdrawal calculations
  ltcgRatePct: number; // 12.5 as of 2024 revision
  ltcgAnnualExemption: number; // ₹1.25L (Union Budget 2024)
}

export interface MonthlySnapshot {
  monthIndex: number;
  age: number;
  salary: number;
  otherIncome: number;
  expense: number;
  loanPayments: number;
  surplus: number;
  sipContribution: number;
  sipBalance: number;
  sipCostBasis: number; // sum of contributions — used for LTCG basis
  epfBalance: number;
  epsBalance: number;
  npsBalance: number;
  loanBalances: Record<string, number>;
  totalLoanBalance: number;
  otherAssetsBalance: number;
  totalCorpus: number;
  /** Life goal cash outflows that happened this month. */
  goalOutflow?: { name: string; amount: number }[];
}

export interface LoanClosure {
  loanId: string;
  name: string;
  monthIndex: number;
  monthLabel: string;
  totalInterestPaid: number;
}

export interface YearlySnapshot {
  yearOffset: number;
  age: number;
  salary: number;
  otherIncome: number;
  expense: number;
  emiPaid: number;
  surplus: number;
  sipContribution: number;
  sipBalance: number;
  epfBalance: number;
  epsBalance: number;
  npsBalance: number;
  totalLoanBalance: number;
  otherAssetsBalance: number;
  totalCorpus: number;
}

export interface TaxSummary {
  grossCorpus: number;
  sipBalance: number;
  sipGains: number;
  ltcgTax: number;
  epfBalance: number; // tax-free
  npsLumpSum: number; // 60% of NPS — tax-free
  npsAnnuityCorpus: number; // 40% locked into annuity, not spendable
  netCorpus: number;
  epsMonthlyPension: number;
  npsMonthlyPension: number;
  otherRetirementIncome: number; // e.g. rental at retirement age (nominal)
}

export type StrategyEventKind =
  | "start"
  | "loan-close"
  | "loan-close-lump" // closed from corpus at retirement
  | "goal"
  | "sip-start"
  | "retirement"
  | "withdrawal" // systematic withdrawal begins — rich card rendered separately
  | "warning";

export interface StrategyEvent {
  monthIndex: number;
  age: number;
  kind: StrategyEventKind;
  title: string;
  detail?: string;
  amount?: number;
}

export interface ProjectionResult {
  monthly: MonthlySnapshot[];
  yearly: YearlySnapshot[];
  loanClosures: LoanClosure[];
  retirementMonthIndex: number;
  corpusAtRetirement: number;
  targetCorpus: number;
  surplusOrShortfall: number;
  totalInterestPaid: number;
  debtFreeMonthIndex: number | null;
  tax: TaxSummary;
  /** Loan balance right before retirement (post-EMI, pre-any lump close). */
  loansOutstandingAtRetirement: number;
  /** Amount used from corpus at retirement to close remaining loans (if any). */
  lumpCloseAmount: number;
  /** First month post-retirement where total corpus drops to zero, if ever. */
  corpusExhaustedMonthIndex: number | null;
  /** Total corpus at the very last month of the simulation (~life expectancy). */
  corpusAtLifeExpectancy: number;
  /** Chronological narrative of how this strategy plays out. */
  narrative: StrategyEvent[];
  /** Each non-equity existing asset's value at the moment it merged into corpus. */
  existingAssetValuesAtRetirement: { name: string; assetClass: AssetClass; value: number; annualReturnPct: number }[];
  /** Silent-timeline summary of every annual-event lump withdrawal. */
  annualEventSummary: {
    id: string;
    name: string;
    firstAge: number;
    lastAge: number;
    count: number;
    firstCost: number;
    lastCost: number;
    totalNominal: number;
  }[];
  /** Total nominal ₹ withdrawn from corpus for all annual events over the horizon. */
  totalAnnualEventCost: number;
  /** Present-value (today's rupees) of key nominal figures. */
  real: {
    corpusAtRetirement: number;
    targetCorpus: number;
    surplusOrShortfall: number;
    netCorpus: number;
    epsMonthlyPension: number;
    npsMonthlyPension: number;
    corpusAtLifeExpectancy: number;
  };
}

export type ScenarioMode =
  | "debt-first"
  | "invest-alongside"
  | "close-loan-from-corpus"
  | "smart-hybrid"
  | "custom";

export interface Scenario {
  mode: ScenarioMode;
  label: string;
  description: string;
  result: ProjectionResult;
  isRecommended?: boolean;
  /** Delta over the next-best scenario, on net (post-tax) corpus. */
  deltaOverRunnerUp?: number;
}
