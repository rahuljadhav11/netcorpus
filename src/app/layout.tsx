import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import CalculatorsNavMenu from "@/components/CalculatorsNavMenu";

export const metadata: Metadata = {
  metadataBase: new URL("https://finplan-in.example"),
  title: {
    default: "FinPlan India — Retirement & Loan Planner",
    template: "%s · FinPlan India",
  },
  description:
    "Free, private retirement and loan-payoff planner for Indian salaried professionals. Model home loans, overdraft facilities, SIPs, EPF, EPS pension, and post-tax corpus — all in the browser.",
  keywords: [
    "retirement planner India",
    "home loan prepayment calculator",
    "overdraft home loan calculator",
    "SIP calculator India",
    "EPF calculator India",
    "EPS pension calculator",
    "LTCG on mutual funds",
    "financial planning India",
  ],
  openGraph: {
    title: "FinPlan India — Retirement & Loan Planner",
    description:
      "Plan retirement while managing home loan, overdraft, EPF/EPS, and SIPs. Post-tax and inflation-adjusted. Runs locally in your browser.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-30">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold text-brand-700">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-600 text-white text-sm">₹</span>
              <span className="text-slate-900">FinPlan</span>
              <span className="text-brand-600 text-xs px-1.5 py-0.5 rounded bg-brand-50 border border-brand-100">India</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-5 text-sm text-slate-600">
              <Link href="/plan" className="hover:text-brand-700 transition">Planner</Link>
              <CalculatorsNavMenu />
              <Link href="/guides" className="hover:text-brand-700 transition">Guides</Link>
              <Link href="/plan" className="btn-primary text-xs !py-1.5">Start planning →</Link>
            </nav>
            <Link href="/plan" className="sm:hidden btn-primary text-xs !py-1.5">Plan →</Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-slate-200 mt-16 py-8 bg-white/50 no-print">
          <div className="mx-auto max-w-6xl px-4 grid sm:grid-cols-3 gap-6 text-xs text-slate-500">
            <div>
              <div className="font-semibold text-slate-800 mb-1">FinPlan India</div>
              <p className="leading-relaxed">A private, browser-only planner for Indian salaried households. No data leaves your device.</p>
            </div>
            <div>
              <div className="font-semibold text-slate-800 mb-1">Planner</div>
              <ul className="space-y-1">
                <li><Link href="/plan" className="hover:text-brand-700">Full planner</Link></li>
                <li><Link href="/guides/early-retirement-india" className="hover:text-brand-700">Early retirement guide</Link></li>
                <li><Link href="/guides/overdraft-vs-fixed-emi" className="hover:text-brand-700">OD vs fixed EMI</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-800 mb-1">Disclaimer</div>
              <p className="leading-relaxed">This is a planning estimate, not financial advice. Rates, taxes, and EPS rules change — verify before acting. Consult a SEBI-registered advisor for personal decisions.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
