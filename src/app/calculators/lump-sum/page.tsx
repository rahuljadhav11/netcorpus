import type { Metadata } from "next";
import LumpSumCalc from "@/components/calculators/LumpSumCalc";

export const metadata: Metadata = {
  title: "Lump Sum / Compound Interest Calculator",
  description:
    "Future value of a one-time investment at any expected return. Configurable compounding frequency — annual, quarterly, monthly.",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Lump Sum Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Enter a one-time investment; get the future value with your chosen compounding.
        </p>
      </div>
      <LumpSumCalc />
    </div>
  );
}
