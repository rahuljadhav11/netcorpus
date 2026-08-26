import type { Metadata } from "next";
import HraCalc from "@/components/calculators/HraCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "HRA Exemption Calculator — Section 10(13A)",
  description:
    "House Rent Allowance exemption: the least of (actual HRA, 50%/40% of Basic, rent − 10% of Basic). Metro / non-metro handled.",
  alternates: { canonical: "/calculators/hra" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">HRA Exemption Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Only available under the old tax regime. See which of the three limits binds for you.
        </p>
      </div>
      <HraCalc />
      <CalculatorContent slug="hra" />
    </div>
  );
}
