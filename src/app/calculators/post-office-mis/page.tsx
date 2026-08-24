import type { Metadata } from "next";
import PostOfficeMisCalc from "@/components/calculators/PostOfficeMisCalc";

export const metadata: Metadata = {
  title: "Post Office MIS Calculator — Monthly Income Scheme",
  description:
    "Post Office Monthly Income Scheme: monthly interest payout at 7.4% for a 5-year term. Principal returned at maturity. Max ₹9L / ₹15L (single / joint).",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Post Office MIS Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          5-year monthly income scheme. Interest credited monthly to your SB account; principal returned at maturity.
        </p>
      </div>
      <PostOfficeMisCalc />
    </div>
  );
}
