import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Methodology",
  description:
    "Who builds NetCorpus India, why it's free and private, and exactly how the retirement, loan, and tax calculations work — assumptions, formulas, and limitations, stated plainly.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-semibold text-slate-900">About NetCorpus India</h1>
      <p className="text-slate-600 mt-2">
        NetCorpus India is an independent, ad-free (for now) set of calculators and a retirement
        planner built for Indian salaried professionals. It exists because most free calculators
        online either oversimplify (a flat "25x expenses" rule with no inflation, no tax, no loans)
        or bury the actual math behind a lead-generation form. This site does neither — every
        number is computed client-side, in your browser, and the formulas behind each result are
        documented on that calculator's own page.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What this is not</h2>
      <p className="text-slate-700">
        This is not financial advice, and nobody on the other end of this site is a SEBI-registered
        investment adviser or an IRDAI-licensed insurance agent. It's a calculation tool. The
        numbers it produces are only as good as the assumptions you put in (expected returns,
        inflation, tax rates) — all of which are genuinely uncertain over long horizons. Treat every
        result as a starting point for your own thinking or a conversation with a qualified advisor,
        not a final answer.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Why it's free and private</h2>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li>Every calculation runs in your browser. Your income, loan amounts, and savings never leave your device or hit a server — there's nothing to leak because nothing is transmitted.</li>
        <li>No account, no signup, no email capture required to use any calculator or the full planner.</li>
        <li>Some calculator pages link to third-party financial platforms (mutual fund apps, insurance comparison sites, loan marketplaces) as a way to fund keeping the tools free. Those links are clearly marked "Partner" and disclosed as such — see the disclosure below.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">Methodology — how the numbers are actually computed</h2>
      <p className="text-slate-700">
        Rather than one generic explanation, the exact formula, assumptions, and a worked example
        are published on every individual calculator page (look for the "How it's calculated" and
        "Worked example" sections). A few methodology choices that apply site-wide:
      </p>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li><strong>Statutory figures</strong> (PPF/SCSS/Sukanya interest rates, tax slabs, EPS formula, LTCG exemption limits) are sourced from official government notifications at the time of writing and are revised periodically by the government — always cross-check the current rate before making a real financial decision, and treat any default value shown here as a reasonable planning assumption, not a live-updated feed.</li>
        <li><strong>Inflation and return assumptions</strong> are editable defaults, not predictions. Where we default to 12% equity returns or 7% inflation, that reflects long-run historical averages — not a promise about the next 10–20 years.</li>
        <li><strong>Tax calculations</strong> reflect FY 2025-26 rules (post Union Budget 2024/2025 changes to LTCG and the new-regime slabs) as understood at the time of writing. Tax law changes; verify current rules before filing.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">Affiliate / partner disclosure</h2>
      <p className="text-slate-700">
        Some calculator pages show a "Partner" card recommending a third-party platform relevant to
        that calculation (e.g. a mutual fund app on the SIP calculator, a loan comparison site on
        the EMI calculator). We may earn a referral commission if you sign up through those links,
        at no extra cost to you. Partner placement is based on topical relevance to the calculator,
        not on which partner pays the most — but you should treat any such link with the same
        skepticism as advertising anywhere else, and compare options independently before acting.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Corrections</h2>
      <p className="text-slate-700">
        If a formula, rate, or statutory figure on this site is wrong or out of date, that's a real
        bug — the intent is to be exactly right about the mechanics even where the input assumptions
        are necessarily uncertain.
      </p>

      <div className="mt-8">
        <Link href="/calculators" className="btn-primary">Browse the calculators →</Link>
      </div>
    </article>
  );
}
