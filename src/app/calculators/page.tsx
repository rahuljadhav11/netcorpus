import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import { CALCULATORS } from "@/lib/calculatorsList";

export const metadata: Metadata = {
  title: "Free Indian Finance Calculators — SIP, FD, EMI, Tax & More",
  description:
    "Quick, private finance calculators for Indian salaried professionals: SIP, Step-up SIP, FD, RD, EMI, SWP, PPF, Income Tax (old vs new regime), HRA, Post Office MIS. No signup, all in-browser.",
  alternates: { canonical: "/calculators" },
};

const live = CALCULATORS.filter((c) => c.live);
const soon = CALCULATORS.filter((c) => !c.live);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: live.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.title,
    description: c.desc,
    url: `${SITE_URL}/calculators/${c.slug}`,
  })),
};

export default function CalculatorsIndex() {
  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
