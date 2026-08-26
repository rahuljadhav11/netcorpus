import type { Metadata } from "next";
import RdCalc from "@/components/calculators/RdCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "RD Calculator — Recurring Deposit Maturity",
  description:
    "Recurring deposit maturity with quarterly compounding — the standard Indian bank / Post Office RD formula.",
  alternates: { canonical: "/calculators/rd" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">RD Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Monthly deposits, quarterly-compounded interest — the standard Indian recurring deposit formula.
        </p>
      </div>
      <RdCalc />
      <CalculatorContent slug="rd" />
    </div>
  );
}
