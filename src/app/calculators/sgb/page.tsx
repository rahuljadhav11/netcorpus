import type { Metadata } from "next";
import SgbCalc from "@/components/calculators/SgbCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Sovereign Gold Bond (SGB) Calculator",
  description:
    "SGB returns: 2.5% annual coupon plus tax-free capital gain on gold price at maturity. 8-year tenure.",
  alternates: { canonical: "/calculators/sgb" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Sovereign Gold Bond Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          The single most tax-efficient way to own gold in India: 2.5% coupon + capital gain (tax-free on maturity).
        </p>
      </div>
      <SgbCalc />
      <CalculatorContent slug="sgb" />
    </div>
  );
}
