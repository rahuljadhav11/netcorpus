import type { Metadata } from "next";
import EmergencyFundCalc from "@/components/calculators/EmergencyFundCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "Emergency Fund Calculator — How Much Liquid Buffer Do You Need?",
  description:
    "Compute how large your emergency fund should be based on monthly essentials and coverage months. Standard: 6 months; single-earner households: 12.",
  alternates: { canonical: "/calculators/emergency-fund" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Emergency Fund Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          The first thing you should build before any long-term investment. 6–12 months of essentials, held in liquid instruments.
        </p>
      </div>
      <EmergencyFundCalc />
      <CalculatorContent slug="emergency-fund" />
    </div>
  );
}
