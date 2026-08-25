"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme";

export default function SiteFooter() {
  const { theme } = useTheme();

  if (theme === "original") {
    return (
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
    );
  }

  return (
    <footer className="border-t border-slate-800 mt-16 no-print"
      style={{ background: "#0c111d" }}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid sm:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold"
                style={{ background: "var(--t-logo-gradient)" }}>
                ₹
              </span>
              <span className="font-bold text-white text-sm">FinPlan India</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A private, browser-only planner for Indian salaried households. No data leaves your device.
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">All calculations run locally</span>
            </div>
          </div>

          {/* Planner */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Planner</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/plan" className="hover:text-brand-300 transition">Full retirement planner</Link></li>
              <li><Link href="/guides/early-retirement-india" className="hover:text-brand-300 transition">Early retirement guide</Link></li>
              <li><Link href="/guides/overdraft-vs-fixed-emi" className="hover:text-brand-300 transition">OD vs fixed EMI guide</Link></li>
            </ul>
          </div>

          {/* Calculators */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Calculators</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/calculators/emi" className="hover:text-brand-300 transition">EMI calculator</Link></li>
              <li><Link href="/calculators/step-sip" className="hover:text-brand-300 transition">Step-up SIP</Link></li>
              <li><Link href="/calculators/swp" className="hover:text-brand-300 transition">SWP calculator</Link></li>
              <li><Link href="/calculators/income-tax" className="hover:text-brand-300 transition">Income tax</Link></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Disclaimer</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Planning estimate, not financial advice. Rates, taxes, and EPS rules change — verify before acting. Consult a SEBI-registered advisor for personal decisions.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-[11px] text-slate-600">© {new Date().getFullYear()} FinPlan India. Free to use forever.</p>
          <p className="text-[11px] text-slate-600">Made with care for Indian households.</p>
        </div>
      </div>
    </footer>
  );
}
