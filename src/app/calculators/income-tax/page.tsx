import type { Metadata } from "next";
import IncomeTaxCalc from "@/components/calculators/IncomeTaxCalc";

export const metadata: Metadata = {
  title: "Income Tax Calculator — Old vs New Regime (FY 2025-26)",
  description:
    "Auto-compare old and new tax regimes for FY 2025-26. Includes standard deduction, 80C, 80D, HRA, home loan interest, NPS employer contribution, and 4% cess.",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Income Tax Calculator (FY 2025-26)</h1>
        <p className="text-sm text-slate-600 mt-1">
          Compare old vs new regime side-by-side, with all major deductions. Rebate u/s 87A and 4% cess included.
        </p>
      </div>
      <IncomeTaxCalc />
    </div>
  );
}
