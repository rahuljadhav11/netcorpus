export interface Calc {
  slug: string;
  title: string;
  desc: string;
  emoji: string;
  live: boolean;
}

export const CALCULATORS: Calc[] = [
  // Investments
  { slug: "sip", title: "SIP Calculator", desc: "Monthly SIP → future corpus at expected return.", emoji: "📈", live: true },
  { slug: "step-sip", title: "Step-up SIP", desc: "SIP that grows every year with your salary hike.", emoji: "🚀", live: true },
  { slug: "lump-sum", title: "Lump Sum / Compound Interest", desc: "One-time investment growth over time.", emoji: "💰", live: true },
  { slug: "goal-sip", title: "Goal-based SIP", desc: "Given a goal, what SIP gets you there?", emoji: "🎯", live: true },
  { slug: "cagr", title: "CAGR", desc: "Compound annual growth rate of any investment.", emoji: "📊", live: true },
  // Bank / small savings
  { slug: "fd", title: "FD Calculator", desc: "Fixed deposit maturity with post-tax view.", emoji: "🏦", live: true },
  { slug: "rd", title: "RD Calculator", desc: "Recurring deposit maturity (quarterly compounding).", emoji: "🔁", live: true },
  { slug: "ppf", title: "PPF Calculator", desc: "15-yr tax-free public provident fund.", emoji: "🛡️", live: true },
  { slug: "post-office-mis", title: "Post Office MIS", desc: "Monthly income scheme at 7.4% for 5 years.", emoji: "📮", live: true },
  { slug: "scss", title: "SCSS (Senior Citizens)", desc: "8.2% quarterly payout for 60+.", emoji: "🧓", live: true },
  { slug: "sukanya", title: "Sukanya Samriddhi", desc: "Girl child savings scheme at 8.2%.", emoji: "👧", live: true },
  { slug: "nsc", title: "NSC", desc: "5-year National Savings Certificate.", emoji: "📜", live: true },
  { slug: "sgb", title: "Sovereign Gold Bond", desc: "2.5% coupon + gold price appreciation.", emoji: "🥇", live: true },
  // Loans
  { slug: "emi", title: "EMI Calculator", desc: "Home / car / personal loan EMI + amortization.", emoji: "🏠", live: true },
  { slug: "loan-prepayment", title: "Loan Prepayment", desc: "What you save by prepaying a lump-sum.", emoji: "💳", live: true },
  { slug: "rent-vs-buy", title: "Rent vs Buy", desc: "Should you rent or buy your home?", emoji: "🔑", live: true },
  // Retirement / withdrawal
  { slug: "swp", title: "SWP Calculator", desc: "How long will your retirement corpus last with monthly withdrawals?", emoji: "💸", live: true },
  // Tax
  { slug: "income-tax", title: "Income Tax (Old vs New)", desc: "FY 2025-26 slabs. Auto-picks the cheaper regime.", emoji: "🧾", live: true },
  { slug: "hra", title: "HRA Exemption", desc: "Section 10(13A) — least-of-three calculation.", emoji: "🏘️", live: true },
  // Planning
  { slug: "emergency-fund", title: "Emergency Fund", desc: "How much liquid buffer do you need?", emoji: "🚨", live: true },
  { slug: "term-insurance", title: "Term Insurance Need", desc: "How much cover for your dependents?", emoji: "🛟", live: true },
  { slug: "inflation-impact", title: "Inflation Impact", desc: "What ₹X today will be worth tomorrow.", emoji: "📉", live: true },
];

export function getCalculator(slug: string): Calc | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
