import type { Metadata } from "next";
import PlannerClient from "@/components/PlannerClient";

export const metadata: Metadata = {
  title: "Retirement + Loan Payoff Planner",
  description:
    "Combined retirement and multi-loan payoff planner for Indian households. Fixed and overdraft loans, EPF, SIPs, inflation-adjusted corpus target.",
};

export default function PlanPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Plan your money</h1>
        <p className="text-sm text-slate-600 mt-1">
          Replace the sample numbers with your own — everything updates as you type. Your inputs save
          to this browser only, so they'll be here next time you visit.
        </p>
      </div>
      <PlannerClient />
    </div>
  );
}
