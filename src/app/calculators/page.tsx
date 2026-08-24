import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Indian Finance Calculators — SIP, FD, EMI, Tax & More",
  description:
    "Quick, private finance calculators for Indian salaried professionals: SIP, Step-up SIP, FD, RD, EMI, SWP, PPF, Income Tax (old vs new regime), HRA, Post Office MIS. No signup, all in-browser.",
};

interface Calc {
  slug: string;
  title: string;
  desc: string;
  emoji: string;
  live: boolean;
}

const calcs: Calc[] = [
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

const live = calcs.filter((c) => c.live);
const soon = calcs.filter((c) => !c.live);

export default function CalculatorsIndex() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
          Free Indian finance calculators
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Quick, no-signup tools. Everything runs in your browser — no data leaves your device.
          Prefer the long view? Try our full <Link href="/plan" className="text-brand-700 underline underline-offset-2">retirement + loan planner</Link>.
        </p>
      </section>

      <section>
        <div className="section-h mb-3">Live now — {live.length} calculators</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {live.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="card p-4 hover:border-brand-400 hover:shadow-md transition group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{c.emoji}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 group-hover:text-brand-700 transition">{c.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{c.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {soon.length > 0 && (
        <section>
          <div className="section-h mb-3">Coming soon</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {soon.map((c) => (
              <div key={c.slug} className="card p-4 opacity-60">
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{c.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-700">{c.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <h2 className="text-2xl font-semibold">Beyond single-number answers</h2>
        <p className="mt-2 text-brand-100 max-w-xl text-sm">
          These calculators answer one question at a time. Our full planner combines your income, expenses,
          loans, EPF, NPS, life goals, trips, and taxes into a 50-year projection with strategy comparison
          and post-tax corpus.
        </p>
        <Link href="/plan" className="inline-flex mt-4 items-center gap-2 bg-white text-brand-800 rounded-md px-5 py-2.5 font-medium hover:bg-brand-50 transition text-sm">
          Open the full planner →
        </Link>
      </section>
    </div>
  );
}
