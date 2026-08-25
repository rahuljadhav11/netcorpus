import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "Retirement & Loan Payoff Planner for India",
  description:
    "Plan retirement while juggling home loan, overdraft/flexi facility, EPF/EPS pension, and SIPs. Post-tax, inflation-adjusted, mobile-first. Free and private.",
};

export default function HomePage() {
  return <HomeContent />;
}
