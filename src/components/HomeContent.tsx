"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme";

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

const features = [
  {
    icon: "🏦",
    color: "from-brand-400 to-brand-700",
    glow: "var(--t-btn-shadow)",
    title: "EPF & EPS done right",
    body: "Employee 12% + employer 8.33% EPS / 3.67% EPF split, capped basic, statutory pension formula. Not just a lump number.",
  },
  {
    icon: "🏠",
    color: "from-blue-500 to-cyan-500",
    glow: "rgba(59,130,246,0.2)",
    title: "Overdraft-loan aware",
    body: "Correctly models flexi/OD home loans (SBI MaxGain, ICICI Money Saver). Parked surplus reduces interest immediately.",
  },
  {
    icon: "📊",
    color: "from-brand-400 to-brand-600",
    glow: "var(--t-btn-shadow)",
    title: "Post-tax corpus",
    body: "LTCG at 12.5% above ₹1.25L applied to equity gains. EPF and NPS lump tax-free. See gross vs net in one glance.",
  },
  {
    icon: "📈",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.2)",
    title: "Inflation-adjusted",
    body: "Toggle between future rupees and today's rupees. See what your corpus actually buys at retirement age.",
  },
  {
    icon: "🧾",
    color: "from-rose-500 to-pink-500",
    glow: "rgba(244,63,94,0.2)",
    title: "Expense estimator",
    body: "Don't know your monthly spend? Fill in rent, groceries, school fees, EMIs, help — arrive at a real number.",
  },
  {
    icon: "⚖️",
    color: "from-brand-500 to-brand-700",
    glow: "var(--t-btn-shadow)",
    title: "4 strategies compared",
    body: "Compare 'pay debt first', 'invest alongside', 'close from corpus', and 'smart hybrid' side-by-side instantly.",
  },
];

export default function HomeContent() {
  const { theme } = useTheme();
  return theme === "original" ? <ClassicHome /> : <GlossyHome />;
}

/* ════════════════════════════════════════════════════════════════════════
   Classic (backed-up) design
   ════════════════════════════════════════════════════════════════════════ */

function ClassicHome() {
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
              <span className="flex items-center gap-1.5"><CheckClassic /> No signup</span>
              <span className="flex items-center gap-1.5"><CheckClassic /> No tracking</span>
              <span className="flex items-center gap-1.5"><CheckClassic /> Mobile-first</span>
            </div>
          </div>
          <div className="hidden md:block">
            <HeroPreviewClassic />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Built for how Indians actually earn & spend</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCardClassic
            icon={<span className="text-2xl">🏦</span>}
            title="EPF & EPS done right"
            body="Employee 12% + employer 8.33% EPS / 3.67% EPF split, capped basic, pension formula. Not just a lump number."
          />
          <FeatureCardClassic
            icon={<span className="text-2xl">🏠</span>}
            title="Overdraft-loan aware"
            body="Correctly models flexi/OD home loans (SBI MaxGain, ICICI Money Saver). Parked money reduces interest immediately."
          />
          <FeatureCardClassic
            icon={<span className="text-2xl">📊</span>}
            title="Post-tax corpus"
            body="LTCG at 12.5% above ₹1.25L applied to equity gains. EPF tax-free. See gross vs net in one glance."
          />
          <FeatureCardClassic
            icon={<span className="text-2xl">📈</span>}
            title="Inflation-adjusted"
            body="Toggle between future rupees and today's rupees. See what your corpus actually buys."
          />
          <FeatureCardClassic
            icon={<span className="text-2xl">🧾</span>}
            title="Expense estimator"
            body="Don't know your monthly spend? Fill in rent, groceries, school fees, EMIs, help — get to a real number."
          />
          <FeatureCardClassic
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
          <StepClassic n={1} title="Enter your numbers" body="Age, salary, expenses (or itemise them), loans, EPF balance, existing investments." />
          <StepClassic n={2} title="Watch it project" body="Month-by-month simulation of every rupee. Salary compounds, expenses inflate, loans amortise, SIP+EPF grow." />
          <StepClassic n={3} title="Compare strategies" body="Three payoff/invest strategies side by side. See post-tax corpus in today's or future rupees." />
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

function FeatureCardClassic({ icon, title, body }: { icon?: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-5 hover:border-brand-300 transition">
      {icon && <div className="mb-2">{icon}</div>}
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{body}</p>
    </div>
  );
}

function StepClassic({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="card p-5 relative">
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shadow">{n}</div>
      <h3 className="font-semibold text-slate-900 mt-1">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{body}</p>
    </div>
  );
}

function CheckClassic() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M4 10l4 4 8-8" stroke="#3f8c6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroPreviewClassic() {
  return (
    <div className="card p-5 rotate-1 shadow-xl border-slate-200 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-100 opacity-70" />
      <div className="relative">
        <div className="text-xs text-slate-500">Corpus at retirement (age 55)</div>
        <div className="text-3xl font-semibold text-slate-900 mt-1">₹8.4 Cr</div>
        <div className="text-xs text-emerald-700 mt-1">✓ Buffer over target: ₹1.9 Cr</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniCardClassic label="SIP" value="₹6.1 Cr" />
          <MiniCardClassic label="EPF" value="₹2.3 Cr" />
          <MiniCardClassic label="EPS pension" value="₹7,500 / mo" />
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

function MiniCardClassic({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-800 tabular-nums">{value}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Glossy (current) design
   ════════════════════════════════════════════════════════════════════════ */

function GlossyHome() {
  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl -mx-4 md:mx-0"
        style={{ background: "var(--t-hero-bg)" }}>

        {/* Glow blobs */}
        <div className="absolute -top-24 right-8 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,var(--t-hero-blob-1) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,var(--t-hero-blob-2) 0%,transparent 70%)" }} />

        <div className="relative px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">

            {/* Left copy */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "#c5d4e7" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-pulse" />
                Free · Private · No signup required
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight">
                Plan retirement while{" "}
                <span className="text-gradient-hero">paying off your loans</span>.
              </h1>

              <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-lg">
                A calm, honest calculator for Indian salaried professionals. Home loans, overdraft
                facilities, EPF/EPS, SIPs, LTCG tax, inflation — all in one simulation. Updates as you type.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/plan"
                  className="inline-flex items-center gap-2 text-white font-semibold text-base px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--t-btn-bg)", boxShadow: "0 4px 16px var(--t-btn-shadow)" }}>
                  Open the planner
                  <ArrowRight />
                </Link>
                <Link href="/guides/early-retirement-india"
                  className="inline-flex items-center gap-2 text-white font-medium text-base px-6 py-3 rounded-xl border transition-all hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.18)" }}>
                  Read the guide
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Check /> No account needed</span>
                <span className="flex items-center gap-1.5"><Check /> No data sent anywhere</span>
                <span className="flex items-center gap-1.5"><Check /> Mobile-first</span>
              </div>
            </div>

            {/* Right — glass preview card */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-2xl"
                  style={{ background: "var(--t-hero-glow)" }} />
                <div className="relative rounded-2xl border p-6"
                  style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.14)", backdropFilter: "blur(20px)" }}>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Corpus at retirement · Age 55</span>
                    <span className="text-[10px] text-emerald-400 bg-brand-400/10 px-2 py-0.5 rounded-full font-semibold">SMART HYBRID</span>
                  </div>

                  <div className="text-4xl font-bold text-white tabular-nums">₹8.4 Cr</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-emerald-400 text-xs font-semibold">+₹1.9 Cr buffer</span>
                    <span className="text-slate-500 text-xs">over target</span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { l: "SIP", v: "₹6.1 Cr", c: "#a5b4fc" },
                      { l: "EPF", v: "₹2.3 Cr", c: "#6ee7b7" },
                      { l: "EPS pension", v: "₹7,500/mo", c: "#fde68a" },
                    ].map(({ l, v, c }) => (
                      <div key={l} className="rounded-xl p-3 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">{l}</div>
                        <div className="text-sm font-bold mt-0.5 tabular-nums" style={{ color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mini bar chart */}
                  <div className="mt-5 h-20 rounded-xl overflow-hidden flex items-end gap-0.5 px-1 pt-1"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {[12, 18, 25, 34, 44, 55, 66, 78, 88, 95, 100, 96].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background: i >= 10 ? "rgba(16,185,129,0.6)" : "rgb(var(--brand-500) / 0.5)",
                        }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1 px-1">
                    <span>Age 30</span><span>Retirement</span><span>Age 80</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { n: "15+", l: "Free calculators" },
          { n: "100%", l: "Browser-only, private" },
          { n: "50yr", l: "Simulation horizon" },
          { n: "4", l: "Strategies compared" },
        ].map(({ n, l }) => (
          <div key={l} className="card p-4 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
            <div className="text-2xl font-bold text-gradient-brand tabular-nums">{n}</div>
            <div className="text-xs text-slate-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <p className="section-h mb-1">Built for India</p>
          <h2 className="text-2xl font-bold text-slate-900">How Indians actually earn &amp; spend</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <p className="section-h mb-1">Simple by design</p>
          <h2 className="text-2xl font-bold text-slate-900">Your numbers in under 2 minutes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Step n={1} title="Enter your numbers"
            body="Age, salary, expenses, loans, EPF balance, existing investments, other income, life goals." />
          <Step n={2} title="Simulation runs instantly"
            body="Month-by-month projection of every rupee. Salary compounds, expenses inflate, loans amortise, SIP+EPF grow." />
          <Step n={3} title="Compare strategies"
            body="4 payoff/invest strategies side by side. Post-tax corpus in today's or future rupees. Pick your winner." />
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <p className="section-h mb-1">Common questions</p>
          <h2 className="text-2xl font-bold text-slate-900">What people ask</h2>
        </div>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="card p-5 group cursor-pointer">
              <summary className="list-none flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-800 text-sm md:text-base">{f.q}</span>
                <span className="flex-none w-6 h-6 rounded-full flex items-center justify-center text-brand-500 bg-brand-50 group-open:bg-brand-100 transition text-xs">
                  <span className="group-open:rotate-180 transition-transform inline-block">▾</span>
                </span>
              </summary>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl -mx-4 md:mx-0"
        style={{ background: "var(--t-cta-bg)" }}>

        <div className="absolute -top-16 right-10 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,var(--t-cta-blob-1) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,var(--t-cta-blob-2) 0%,transparent 70%)" }} />

        <div className="relative px-8 py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to see your numbers?
            </h2>
            <p className="mt-3 text-blue-200 max-w-lg text-lg">
              Get an honest picture of your retirement in under two minutes. Free forever, no signup, no data leaves your device.
            </p>
          </div>
          <div className="flex-none">
            <Link href="/plan"
              className="inline-flex items-center gap-2.5 bg-white font-bold text-brand-800 rounded-xl px-8 py-4 text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
              Open the planner
              <ArrowRight dark />
            </Link>
            <p className="mt-2.5 text-center text-xs text-blue-300/70">No account needed · runs in your browser</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, color, glow, title, body }: {
  icon: string; color: string; glow: string; title: string; body: string;
}) {
  return (
    <div className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 bg-gradient-to-br ${color} shadow-md`}
        style={{ boxShadow: `0 4px 16px ${glow}` }}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="card p-5 relative overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-[0.06]"
        style={{ background: "var(--t-logo-gradient)" }} />
      <div className="relative">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold mb-3"
          style={{ background: "var(--t-btn-bg)", boxShadow: "0 4px 12px var(--t-btn-shadow)" }}>
          {n}
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M4 10l4 4 8-8" stroke="rgb(var(--brand-400))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ dark }: { dark?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M12 6l4 4-4 4" stroke={dark ? "#3730a3" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
