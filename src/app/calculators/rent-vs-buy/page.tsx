import type { Metadata } from "next";
import RentVsBuyCalc from "@/components/calculators/RentVsBuyCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator — Should You Buy a Home in India?",
  description:
    "Compares net worth after N years under two scenarios: buying with a home loan vs renting and investing the down-payment + EMI-rent surplus.",
  alternates: { canonical: "/calculators/rent-vs-buy" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Rent vs Buy Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          The most under-calculated decision most Indians make. Compare buyer vs renter net worth at end of your horizon, with realistic Indian assumptions.
        </p>
      </div>
      <RentVsBuyCalc />
      <CalculatorContent slug="rent-vs-buy" />
    </div>
  );
}
