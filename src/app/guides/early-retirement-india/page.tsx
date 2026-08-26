import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Plan Early Retirement in India — Realistic Corpus Math",
  description:
    "A grounded guide to planning early retirement in India: how to size your corpus, why inflation compounds against you, and how loan payoff timing changes the picture.",
  alternates: { canonical: "/guides/early-retirement-india" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much corpus do I need to retire at 45 in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rough thumb: 30–35x your annual expenses at retirement, adjusted for inflation between now and then. Someone spending ₹80,000/mo today retiring at 45 with 6% inflation will need roughly ₹1.5–2 Cr in today's rupees, which becomes much larger in nominal terms. Use the planner for a personalised number.",
      },
    },
    {
      "@type": "Question",
      name: "Is 12% SIP return realistic for retirement planning in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Long-run equity index returns in India have been in the 11–13% CAGR range, but there are decade-long spans with lower averages. Plan for 10–11% pre-tax as a conservative default, and stress-test with an 8% figure to see how fragile your plan is.",
      },
    },
  ],
};

export default function Page() {
  return (
    <article className="prose prose-slate max-w-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-semibold text-slate-900">How to plan early retirement in India</h1>
      <p className="text-slate-600 mt-2">
        Early retirement — call it FIRE, call it "just being done with the corporate churn" — is
        a math problem before it is a life problem. Get the numbers roughly right and the rest
        is discipline. Here's how to reason about it, specific to Indian salaried households.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Size your corpus in today's rupees, then inflate it</h2>
      <p className="text-slate-700">
        A ₹80,000/month lifestyle today becomes ₹2.5 lakh/month in 20 years at 6% inflation. Don't
        confuse the "how much do I need" number with today's rupees — always work in nominal
        rupees at the target retirement date. The planner does this for you.
      </p>

      <h2 className="mt-6 text-xl font-semibold">2. Corpus = present value of a growing annuity</h2>
      <p className="text-slate-700">
        You want the corpus at retirement to be able to fund monthly withdrawals for 30–40 years,
        with the withdrawals themselves growing with inflation, and the residual corpus earning a
        post-retirement return. This is a "growing annuity present value" calculation — not a
        simple 25x rule. The 25x rule assumes 4% withdrawal and 30-year horizon; in Indian
        conditions with 6% inflation, you often need 28–35x.
      </p>

      <h2 className="mt-6 text-xl font-semibold">3. Loans complicate the picture</h2>
      <p className="text-slate-700">
        Most Indian households retiring early carry a home loan and often an OD/flexi facility
        or personal loan. Two things matter:
      </p>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li><strong>Compare after-tax rates.</strong> A home loan at 8.5% with the interest deduction gone (new tax regime) is genuinely 8.5%. An equity SIP at 12% pre-tax and 10.4% after LTCG is a ~2% edge — not free money.</li>
        <li><strong>OD loans blur the line.</strong> Money parked in an OD account reduces interest immediately without locking it up. This often beats "prepay vs invest" as a false dichotomy.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">4. Three strategies to compare</h2>
      <ol className="list-decimal pl-5 text-slate-700 space-y-1">
        <li><strong>Pay off debt first.</strong> Maximum surplus to loans until debt-free, then aggressive SIP. Lowest interest cost, latest corpus start.</li>
        <li><strong>Invest alongside minimum EMI.</strong> SIP starts immediately; loan runs its full tenure. Highest interest paid, longest compounding runway.</li>
        <li><strong>Close loans from corpus at retirement.</strong> Minimum EMIs through career, then a one-time lump-sum close from corpus at retirement. Simplifies life; often close to optimal.</li>
      </ol>
      <p className="text-slate-700 mt-2">
        In our planner you can toggle between all three and see the final corpus for each. There
        is no universally correct answer — it depends on your loan rate, your risk tolerance,
        and whether the emotional weight of a home loan is worth paying a premium to remove.
      </p>

      <div className="mt-8">
        <Link href="/plan" className="btn-primary">Try the planner →</Link>
      </div>
    </article>
  );
}
