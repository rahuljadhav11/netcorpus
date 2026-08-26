import type { Metadata } from "next";
import PpfCalc from "@/components/calculators/PpfCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "PPF Calculator — Public Provident Fund Maturity",
  description:
    "15-year PPF maturity value. Tax-free at every stage (EEE). Current rate 7.1% (revised quarterly by government).",
  alternates: { canonical: "/calculators/ppf" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">PPF Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Annual investment → 15-year (or longer) tax-free maturity. PPF interest and maturity are fully tax-exempt (EEE).
        </p>
      </div>
      <PpfCalc />
      <CalculatorContent slug="ppf" />
    </div>
  );
}
