"use client";

import { useEffect, useState } from "react";

interface Step {
  n: number;
  title: string;
  body: string;
  target?: string; // CSS selector
}

const STEPS: Step[] = [
  {
    n: 1,
    title: "Fill in the About You block",
    body: "Current age, target retirement age, and how long you'd like the corpus to last (85 is a common default).",
    target: "#tour-you",
  },
  {
    n: 2,
    title: "Enter salary & growth",
    body: "Your monthly in-hand salary and yearly hike. 8% is a reasonable default for salaried India — bump it if you're in a fast-growth track.",
    target: "#tour-income",
  },
  {
    n: 3,
    title: "Estimate expenses",
    body: "If you don't know your total, tap 'Help me estimate' to itemise rent, groceries, school fees, help, insurance premiums, and so on.",
    target: "#tour-expenses",
  },
  {
    n: 4,
    title: "Add every loan",
    body: "Home loan, personal, overdraft, car — pick fixed EMI or overdraft type. The planner handles all of them together.",
    target: "#tour-loans",
  },
  {
    n: 5,
    title: "Get EPF right",
    body: "Switch to Detailed to model employee 12% + employer split into EPF and EPS pension. Or Simple if you only track a lump figure.",
    target: "#tour-epf",
  },
  {
    n: 6,
    title: "Add rental / other income",
    body: "Rental, freelance, spouse salary — anything regular beyond your main paycheck. Rental usually continues into retirement, so it lowers the required corpus.",
    target: "#tour-income-other",
  },
  {
    n: 7,
    title: "NPS if you contribute",
    body: "Voluntary Tier-1 NPS. At age 60 you get 60% tax-free lump; 40% must buy an annuity. Skip if you don't have one.",
    target: "#tour-nps",
  },
  {
    n: 8,
    title: "Life goals: education, marriage",
    body: "Big lump-sum spends before retirement (kids' education at 18, marriage, etc.). These deplete corpus at a specific age with their own inflation.",
    target: "#tour-goals",
  },
  {
    n: 9,
    title: "Read the recommendation & timeline",
    body: "The strategy with a ★ gives the highest net-of-tax corpus. Below the summary you'll see a step-by-step timeline showing exactly what happens with your money and when.",
  },
];

const LS_KEY = "netcorpus.tour.dismissed";

export default function QuickTour() {
  // null until we've read localStorage — avoids a hydration flash.
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(LS_KEY) === "1");
  }, []);

  const dismiss = () => {
    localStorage.setItem(LS_KEY, "1");
    setDismissed(true);
    setReopened(false);
  };

  const jumpTo = (selector?: string) => {
    if (!selector) return;
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Brief highlight to draw the eye.
    el.classList.add("tour-flash");
    window.setTimeout(() => el.classList.remove("tour-flash"), 1400);
  };

  if (dismissed === null) return null; // still hydrating

  if (dismissed && !reopened) {
    return (
      <div className="flex items-center justify-end -mt-2 mb-2 no-print">
        <button
          onClick={() => setReopened(true)}
          className="text-xs text-slate-500 hover:text-brand-700 underline underline-offset-2"
        >
          Show quick tour
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-4 mb-4 shadow-sm no-print">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex w-9 h-9 flex-none items-center justify-center rounded-full bg-brand-600 text-white text-lg">👋</span>
          <div>
            <div className="text-sm font-semibold text-slate-900">First time here? Take the two-minute tour.</div>
            <div className="text-xs text-slate-600 mt-0.5">Tap a step to jump to that part of the form.</div>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="text-slate-400 hover:text-slate-700 text-sm px-2 py-1 -m-1"
          aria-label="Dismiss tour"
        >
          ✕
        </button>
      </div>

      <ol className="grid sm:grid-cols-2 gap-2">
        {STEPS.map((s) => (
          <li key={s.n}>
            <button
              onClick={() => jumpTo(s.target)}
              disabled={!s.target}
              className={
                "w-full text-left rounded-lg border p-2.5 transition group " +
                (s.target
                  ? "border-slate-200 bg-white hover:border-brand-400 hover:shadow-sm"
                  : "border-slate-200 bg-slate-50 cursor-default")
              }
            >
              <div className="flex items-start gap-2">
                <span className="inline-flex w-5 h-5 flex-none items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-semibold mt-0.5">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 leading-snug">{s.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{s.body}</div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">Nothing you enter leaves your browser.</p>
        <button onClick={dismiss} className="text-xs text-brand-700 font-medium hover:text-brand-800">
          Got it, hide this →
        </button>
      </div>
    </div>
  );
}
