import type { Metadata } from "next";
import TermInsuranceCalc from "@/components/calculators/TermInsuranceCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Term Insurance Calculator — Recommended Cover Amount",
  description:
    "Human Life Value method: recommends a term-insurance sum assured based on your dependents' future expenses, existing corpus, and outstanding loans.",
  alternates: { canonical: "/calculators/term-insurance" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Term Insurance Need Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Uses the Human Life Value method — the present value of your dependents' future expenses, plus loans, minus what they already have.
        </p>
      </div>
      <TermInsuranceCalc />
      <CalculatorContent slug="term-insurance" />
    </div>
  );
}
