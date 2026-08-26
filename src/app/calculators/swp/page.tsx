import type { Metadata } from "next";
import SwpCalc from "@/components/calculators/SwpCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "SWP Calculator — Corpus Longevity with Monthly Withdrawals",
  description:
    "Systematic Withdrawal Plan calculator: how long does a retirement corpus last if you pull ₹X per month at Y% return?",
  alternates: { canonical: "/calculators/swp" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">SWP Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Given a corpus and a monthly withdrawal, how long does the money last? Or: does it survive the years you need it?
        </p>
      </div>
      <SwpCalc />
      <CalculatorContent slug="swp" />
    </div>
  );
}
