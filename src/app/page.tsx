import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Retirement & Loan Payoff Planner for India",
  description:
    "Plan retirement while juggling home loan, overdraft/flexi facility, EPF/EPS pension, and SIPs. Post-tax, inflation-adjusted, mobile-first. Free and private.",
};

const faq = [
  {
    q: "How much retirement corpus do I need to retire at 50 in India?",
    a: "A common thumb rule is 25–30x your annual expenses at retirement, but the actual number depends on inflation, post-retirement returns, life expectancy, and any pension (EPS, NPS) that supplements withdrawals. Use the planner for a number specific to your situation.",
  },
  {
    q: "Does the planner account for LTCG tax on mutual funds?",
    a: "Yes. Long-term capital gains on equity SIPs are taxed at 12.5% above ₹1.25L per year (post Union Budget 2024). EPF withdrawal is tax-free after 5 years of continuous service. Both are factored into the net corpus figure.",
  },
  {
    q: "How does EPS pension work in the calculations?",
    a: "EPS pension = Pensionable Salary × Pensionable Service ÷ 70, where Pensionable Salary is capped at ₹15,000/mo for most employees. The planner shows the estimated monthly pension and reduces your required corpus target accordingly.",
  },
  {
    q: "Should I prepay my home loan or invest in SIPs?",
    a: "Toggle between the 'debt first', 'invest alongside', and 'close loan from corpus' strategies in the planner to see final corpus outcomes for each. There's no single right answer — it depends on your loan rate, tax situation, and comfort with debt.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="pt-8 pb-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 border border-brand-100 text-brand-700 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
              Free · Private · Runs in your browser
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-slate-900 leading-tight tracking-tight">
              Plan retirement while <span className="text-brand-700">paying off your loans</span>.
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl text-lg">
              A calm, honest calculator for Indian salaried professionals. Home loans, overdraft
              facilities, EPF/EPS pension, SIPs, LTCG tax, inflation — all in one place. Answers
              update as you type.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/plan" className="btn-primary text-base !py-2.5">Open the planner →</Link>
              <Link href="/guides/early-retirement-india" className="btn-outline text-base !py-2.5">Read the guide</Link>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Check /> No signup</span>
              <span className="flex items-center gap-1.5"><Check /> No tracking</span>
              <span className="flex items-center gap-1.5"><Check /> Mobile-first</span>
            </div>
          </div>
          <div className="hidden md:block">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Built for how Indians actually earn & spend</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<span className="text-2xl">🏦</span>}
            title="EPF & EPS done right"
            body="Employee 12% + employer 8.33% EPS / 3.67% EPF split, capped basic, pension formula. Not just a lump number."
          />
          <FeatureCard
            icon={<span className="text-2xl">🏠</span>}
            title="Overdraft-loan aware"
            body="Correctly models flexi/OD home loans (SBI MaxGain, ICICI Money Saver). Parked money reduces interest immediately."
          />
          <FeatureCard
            icon={<span className="text-2xl">📊</span>}
            title="Post-tax corpus"
            body="LTCG at 12.5% above ₹1.25L applied to equity gains. EPF tax-free. See gross vs net in one glance."
          />
          <FeatureCard
            icon={<span className="text-2xl">📈</span>}
            title="Inflation-adjusted"
            body="Toggle between future rupees and today's rupees. See what your corpus actually buys."
          />
          <FeatureCard
            icon={<span className="text-2xl">🧾</span>}
            title="Expense estimator"
            body="Don't know your monthly spend? Fill in rent, groceries, school fees, EMIs, help — get to a real number."
          />
          <FeatureCard
            icon={<span className="text-2xl">⚖️</span>}
            title="Three strategies"
            body="Compare 'pay debt first', 'invest alongside', and 'close loan from corpus' side-by-side."
          />
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Step n={1} title="Enter your numbers" body="Age, salary, expenses (or itemise them), loans, EPF balance, existing investments." />
          <Step n={2} title="Watch it project" body="Month-by-month simulation of every rupee. Salary compounds, expenses inflate, loans amortise, SIP+EPF grow." />
          <Step n={3} title="Compare strategies" body="Three payoff/invest strategies side by side. See post-tax corpus in today's or future rupees." />
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Common questions</h2>
        <div className="space-y-2">
          {faq.map((f) => (
            <details key={f.q} className="card p-4 group">
              <summary className="cursor-pointer font-medium text-slate-800 list-none flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Ready to see your numbers?</h2>
        <p className="mt-2 text-brand-100 max-w-xl">
          Open the planner and get an honest picture in under two minutes. No signup, no data leaves your device.
        </p>
        <Link href="/plan" className="inline-flex mt-5 items-center gap-2 bg-white text-brand-800 rounded-md px-5 py-2.5 font-medium hover:bg-brand-50 transition">
          Open the planner →
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon?: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-5 hover:border-brand-300 transition">
      {icon && <div className="mb-2">{icon}</div>}
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="card p-5 relative">
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shadow">{n}</div>
      <h3 className="font-semibold text-slate-900 mt-1">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{body}</p>
    </div>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M4 10l4 4 8-8" stroke="#3f8c6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroPreview() {
  return (
    <div className="card p-5 rotate-1 shadow-xl border-slate-200 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-100 opacity-70" />
      <div className="relative">
        <div className="text-xs text-slate-500">Corpus at retirement (age 55)</div>
        <div className="text-3xl font-semibold text-slate-900 mt-1">₹8.4 Cr</div>
        <div className="text-xs text-emerald-700 mt-1">✓ Buffer over target: ₹1.9 Cr</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniCard label="SIP" value="₹6.1 Cr" />
          <MiniCard label="EPF" value="₹2.3 Cr" />
          <MiniCard label="EPS pension" value="₹7,500 / mo" />
        </div>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-t from-brand-100 to-white border border-slate-100 flex items-end p-2">
          <div className="flex items-end gap-1 w-full h-full">
            {[15, 22, 30, 42, 55, 68, 78, 85, 92, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-brand-500 rounded-sm" style={{ height: `${h}%`, opacity: 0.4 + h / 200 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-800 tabular-nums">{value}</div>
    </div>
  );
}
