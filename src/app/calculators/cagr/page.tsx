import type { Metadata } from "next";
import CagrCalc from "@/components/calculators/CagrCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "CAGR Calculator — Compound Annual Growth Rate",
  description:
    "Compute the CAGR (Compound Annual Growth Rate) of any investment given initial value, final value, and duration.",
  alternates: { canonical: "/calculators/cagr" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">CAGR Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          The single number that tells you how well an investment actually performed. Useful for comparing returns across different tenures.
        </p>
      </div>
      <CagrCalc />
      <CalculatorContent slug="cagr" />
    </div>
  );
}
