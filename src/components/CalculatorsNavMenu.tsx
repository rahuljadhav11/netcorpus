"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useTheme } from "@/lib/theme";

const NAV_GROUPS: {
  label: string;
  calcs: { slug: string; title: string; emoji: string }[];
}[] = [
  {
    label: "Investments",
    calcs: [
      { slug: "sip", title: "SIP", emoji: "📈" },
      { slug: "step-sip", title: "Step-up SIP", emoji: "🚀" },
      { slug: "lump-sum", title: "Lump Sum", emoji: "💰" },
      { slug: "goal-sip", title: "Goal-based SIP", emoji: "🎯" },
      { slug: "cagr", title: "CAGR", emoji: "📊" },
    ],
  },
  {
    label: "Bank & Small Savings",
    calcs: [
      { slug: "fd", title: "FD", emoji: "🏦" },
      { slug: "rd", title: "RD", emoji: "🔁" },
      { slug: "ppf", title: "PPF", emoji: "🛡️" },
      { slug: "post-office-mis", title: "Post Office MIS", emoji: "📮" },
      { slug: "scss", title: "SCSS (Senior)", emoji: "🧓" },
      { slug: "sukanya", title: "Sukanya Samriddhi", emoji: "👧" },
      { slug: "nsc", title: "NSC", emoji: "📜" },
      { slug: "sgb", title: "Sovereign Gold Bond", emoji: "🥇" },
    ],
  },
  {
    label: "Loans & Withdrawal",
    calcs: [
      { slug: "emi", title: "EMI", emoji: "🏠" },
      { slug: "loan-prepayment", title: "Loan Prepayment", emoji: "💳" },
      { slug: "rent-vs-buy", title: "Rent vs Buy", emoji: "🔑" },
      { slug: "swp", title: "SWP", emoji: "💸" },
    ],
  },
  {
    label: "Tax & Planning",
    calcs: [
      { slug: "income-tax", title: "Income Tax (Old vs New)", emoji: "🧾" },
      { slug: "hra", title: "HRA Exemption", emoji: "🏘️" },
      { slug: "emergency-fund", title: "Emergency Fund", emoji: "🚨" },
      { slug: "term-insurance", title: "Term Insurance", emoji: "🛟" },
      { slug: "inflation-impact", title: "Inflation Impact", emoji: "📉" },
    ],
  },
];

/**
 * Hover mega-menu for the Calculators nav item. Renders as a wide panel below
 * the trigger, grouped by category with emojis. Falls back gracefully:
 *  - Clicking the trigger still navigates to /calculators (fallback for touch).
 *  - Small delay on mouseleave lets the cursor cross the gap between trigger
 *    and panel without accidentally closing it.
 *  - The whole nav is `hidden sm:flex` in the header, so this is desktop-only
 *    by design; mobile users see the compact QuickJump on calc pages.
 */
export default function CalculatorsNavMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { theme } = useTheme();
  const triggerCls =
    theme === "original"
      ? "text-slate-600 hover:text-brand-700"
      : "text-slate-300 hover:text-white";

  const handleEnter = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href="/calculators"
        className={`inline-flex items-center gap-1 transition font-medium ${triggerCls}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Calculators
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-[760px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-2xl z-40 p-4"
          role="menu"
        >
          {/* Bridge to allow moving cursor from trigger to panel without gap-close. */}
          <div className="absolute -top-2 left-0 right-0 h-2" aria-hidden />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 px-1.5">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.calcs.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/calculators/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-brand-50 transition group"
                      role="menuitem"
                    >
                      <span className="text-base leading-none flex-none">{c.emoji}</span>
                      <span className="text-xs text-slate-700 group-hover:text-brand-800 truncate">
                        {c.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">22 free calculators · no signup</span>
            <Link
              href="/calculators"
              onClick={() => setOpen(false)}
              className="text-brand-700 font-medium hover:text-brand-800"
            >
              See all →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
