import type { Metadata } from "next";
import LoanPrepaymentCalc from "@/components/calculators/LoanPrepaymentCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Loan Prepayment Calculator — Interest Saved & New Tenure",
  description:
    "See how a one-time prepayment on your loan affects tenure and total interest. Compare reduce-tenure vs reduce-EMI options.",
  alternates: { canonical: "/calculators/loan-prepayment" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Loan Prepayment Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Home loan feeling heavy? See exactly what a one-time prepayment does. Two options side-by-side: finish faster, or pay less monthly.
        </p>
      </div>
      <LoanPrepaymentCalc />
      <CalculatorContent slug="loan-prepayment" />
    </div>
  );
}
