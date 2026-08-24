import type { Metadata } from "next";
import GoalSipCalc from "@/components/calculators/GoalSipCalc";

export const metadata: Metadata = {
  title: "Goal-based SIP Calculator — Required Monthly SIP for a Target",
  description:
    "Given a financial goal amount and time horizon, computes the monthly SIP required. Optional inflation-adjustment for real goal amounts.",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Goal-based SIP Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Reverse SIP — you know the goal, find the monthly amount. Kid's education, house down payment, wedding, retirement corpus — anything.
        </p>
      </div>
      <GoalSipCalc />
    </div>
  );
}
