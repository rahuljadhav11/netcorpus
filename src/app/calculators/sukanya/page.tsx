import type { Metadata } from "next";
import SukanyaCalc from "@/components/calculators/SukanyaCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Sukanya Samriddhi Yojana Calculator — Girl Child Savings",
  description:
    "SSY maturity value at age 21. 8.2% tax-free interest (EEE). Contributions for 15 years; matures at 21.",
  alternates: { canonical: "/calculators/sukanya" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Sukanya Samriddhi Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Girl-child savings scheme. Contribute for 15 years, matures at 21. Interest and maturity fully tax-free.
        </p>
      </div>
      <SukanyaCalc />
      <CalculatorContent slug="sukanya" />
    </div>
  );
}
