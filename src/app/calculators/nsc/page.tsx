import type { Metadata } from "next";
import NscCalc from "@/components/calculators/NscCalc";

export const metadata: Metadata = {
  title: "NSC Calculator — National Savings Certificate",
  description:
    "5-year NSC maturity value at 7.7% annually compounded. Investments qualify for section 80C deduction.",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">NSC Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          5-year National Savings Certificate — safe post-office instrument with 80C benefit.
        </p>
      </div>
      <NscCalc />
    </div>
  );
}
