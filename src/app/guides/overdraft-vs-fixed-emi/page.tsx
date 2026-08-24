import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Overdraft Home Loan vs Fixed EMI — How Prepayment Actually Works",
  description:
    "A clear comparison of overdraft/flexi home loans (SBI MaxGain, ICICI Money Saver) and traditional fixed-EMI loans in India. What actually happens when you prepay, month by month.",
};

export default function Page() {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-semibold text-slate-900">Overdraft home loan vs fixed EMI — how prepayment works</h1>
      <p className="text-slate-600 mt-2">
        If you've been offered SBI MaxGain, ICICI Money Saver, HDFC OD, or any "smart" home
        loan variant, you've been offered an overdraft (OD) home loan. It is not the same as
        a fixed EMI loan even if the sticker rate looks identical. Here's the actual mechanics.
      </p>

      <h2 className="mt-8 text-xl font-semibold">The one-sentence difference</h2>
      <p className="text-slate-700">
        In a fixed EMI loan, interest is a schedule you signed. In an OD loan, interest is
        computed each month on whatever balance is actually outstanding — and any rupee sitting
        in the linked account reduces that balance for that month.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Fixed EMI: predictable, inflexible</h2>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li>EMI is fixed at origination based on principal, rate, tenure.</li>
        <li>Every month, EMI splits into interest (on outstanding) and principal.</li>
        <li>To prepay, you make a separate lump-sum payment; the bank recalculates.</li>
        <li>Prepaid money is gone — you can't pull it back if you need it later.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">Overdraft (flexi): flexible, sometimes cheaper</h2>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li>You have a linked current account. Deposit any amount, any time.</li>
        <li>Interest is charged monthly on <em>outstanding balance − parked amount</em>.</li>
        <li>You can withdraw parked money back — it's not "prepaid", it's "parked".</li>
        <li>The "EMI" you pay reduces the balance; over time interest component shrinks faster than a fixed loan.</li>
        <li>Effective rate is usually 0.25–0.50% higher than the equivalent fixed loan, so it's not free flexibility.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">A worked example</h2>
      <p className="text-slate-700">
        Same ₹50L principal at 8.5%, 20-year term. Fixed EMI = ₹43,391.
      </p>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li><strong>Fixed:</strong> Pay ₹43,391 × 240 = ₹1.04 Cr total. Interest paid = ~₹54 lakh.</li>
        <li><strong>OD, no parking:</strong> Same total (assuming same rate, which is rarely true — usually 0.25% higher).</li>
        <li><strong>OD with ₹5L parked from year 2:</strong> Instantly saves ~₹42,500/yr in interest, which shortens the loan by ~2.5 years — without locking up the ₹5L.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">When OD makes sense</h2>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li>You maintain a healthy emergency fund and don't want to choose between emergency access and interest savings.</li>
        <li>You get variable-timing bonuses (RSUs vesting, annual bonus) and want to earn interest savings on them until you decide what to do.</li>
        <li>Your rate premium over the best fixed offer is under ~0.5%.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">When fixed EMI wins</h2>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li>You know you'll not maintain a large parked balance.</li>
        <li>You want maximum psychological simplicity — no temptation to withdraw the parked money.</li>
        <li>The OD premium is above ~0.5% over the best fixed offer available to you.</li>
      </ul>

      <div className="mt-8">
        <Link href="/plan" className="btn-primary">Model both in the planner →</Link>
      </div>
    </article>
  );
}
