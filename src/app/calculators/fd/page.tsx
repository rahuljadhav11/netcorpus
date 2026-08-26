import type { Metadata } from "next";
import FdCalc from "@/components/calculators/FdCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "FD Calculator — Fixed Deposit Maturity + Post-Tax Return",
  description:
    "Bank FD maturity value with quarterly compounding. Includes post-tax return based on your income tax slab.",
  alternates: { canonical: "/calculators/fd" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">FD Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Fixed deposit maturity with quarterly compounding — and a post-tax view because FD interest is fully taxable at your slab.
        </p>
      </div>
      <FdCalc />
      <CalculatorContent slug="fd" />
    </div>
  );
}
