import type { Metadata } from "next";
import InflationCalc from "@/components/calculators/InflationCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Inflation Calculator — Future Purchasing Power",
  description:
    "How much will ₹X today cost in the future? See the purchasing-power loss and how much you'll need to maintain the same lifestyle.",
  alternates: { canonical: "/calculators/inflation-impact" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Inflation Impact Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Money that sits idle loses purchasing power. See exactly how much.
        </p>
      </div>
      <InflationCalc />
      <CalculatorContent slug="inflation-impact" />
    </div>
  );
}
