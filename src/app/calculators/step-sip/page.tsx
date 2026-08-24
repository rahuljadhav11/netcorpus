import type { Metadata } from "next";
import StepSipCalc from "@/components/calculators/StepSipCalc";

export const metadata: Metadata = {
  title: "Step-up SIP Calculator — SIP with Annual Increase",
  description:
    "Model a SIP that grows every year at your salary-hike rate. Compare against a flat SIP to see the compounding advantage.",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Step-up SIP Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Realistic long-term SIP — grows every year with your salary. Compares against a flat SIP so you see the step-up advantage.
        </p>
      </div>
      <StepSipCalc />
    </div>
  );
}
