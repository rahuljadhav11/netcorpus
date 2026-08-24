import type { Metadata } from "next";
import ScssCalc from "@/components/calculators/ScssCalc";

export const metadata: Metadata = {
  title: "SCSS Calculator — Senior Citizen Savings Scheme (8.2%)",
  description:
    "Post Office / bank SCSS: quarterly interest payout at 8.2% p.a. for 5 years. Deposit up to ₹30 lakh. Includes 80C benefit.",
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">SCSS Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          For senior citizens (60+). Quarterly interest, 5-year term, deposits qualify for section 80C.
        </p>
      </div>
      <ScssCalc />
    </div>
  );
}
