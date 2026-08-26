import type { Metadata } from "next";
import EmiCalc from "@/components/calculators/EmiCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "EMI Calculator — Home / Car / Personal Loan + Amortization",
  description:
    "Reducing-balance EMI calculator with a full month-by-month amortization schedule. Works for home, car, and personal loans.",
  alternates: { canonical: "/calculators/emi" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">EMI Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Reducing-balance EMI for any loan. Includes the full amortization schedule so you can see how interest and principal shift over time.
        </p>
      </div>
      <EmiCalc />
      <CalculatorContent slug="emi" />
    </div>
  );
}
