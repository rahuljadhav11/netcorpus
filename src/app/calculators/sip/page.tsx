import type { Metadata } from "next";
import SipCalc from "@/components/calculators/SipCalc";
import CalculatorContent from "@/components/calculators/CalculatorContent";

export const metadata: Metadata = {
  title: "SIP Calculator — Monthly SIP Future Value",
  description:
    "Calculate the future value of your monthly SIP (Systematic Investment Plan) at any expected return and duration. Free, private, mobile-first.",
  alternates: { canonical: "/calculators/sip" },
};

export default function Page() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">SIP Calculator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Monthly SIP → final corpus, at your expected annual return. Uses annuity-due (contribution at start of month).
        </p>
      </div>
      <SipCalc />
      <CalculatorContent slug="sip" />
    </div>
  );
}
