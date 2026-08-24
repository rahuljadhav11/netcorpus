"use client";

import { useRouter, usePathname } from "next/navigation";

/**
 * A grouped dropdown that lives in the calculators layout so users can jump
 * from one calculator to another without going back to the index. Hidden on
 * the /calculators index page itself.
 */
const GROUPS: { label: string; options: { slug: string; title: string }[] }[] = [
  {
    label: "Investments",
    options: [
      { slug: "sip", title: "SIP" },
      { slug: "step-sip", title: "Step-up SIP" },
      { slug: "lump-sum", title: "Lump Sum / Compound" },
      { slug: "goal-sip", title: "Goal-based SIP" },
      { slug: "cagr", title: "CAGR" },
    ],
  },
  {
    label: "Bank & small savings",
    options: [
      { slug: "fd", title: "FD" },
      { slug: "rd", title: "RD" },
      { slug: "ppf", title: "PPF" },
      { slug: "post-office-mis", title: "Post Office MIS" },
      { slug: "scss", title: "SCSS (Senior)" },
      { slug: "sukanya", title: "Sukanya Samriddhi" },
      { slug: "nsc", title: "NSC" },
      { slug: "sgb", title: "Sovereign Gold Bond" },
    ],
  },
  {
    label: "Loans",
    options: [
      { slug: "emi", title: "EMI" },
      { slug: "loan-prepayment", title: "Loan Prepayment" },
      { slug: "rent-vs-buy", title: "Rent vs Buy" },
    ],
  },
  {
    label: "Withdrawal & tax",
    options: [
      { slug: "swp", title: "SWP" },
      { slug: "income-tax", title: "Income Tax (Old vs New)" },
      { slug: "hra", title: "HRA Exemption" },
    ],
  },
  {
    label: "Planning",
    options: [
      { slug: "emergency-fund", title: "Emergency Fund" },
      { slug: "term-insurance", title: "Term Insurance Need" },
      { slug: "inflation-impact", title: "Inflation Impact" },
    ],
  },
];

export default function QuickJump() {
  const router = useRouter();
  const pathname = usePathname();
  // Show only when we're inside a specific calculator, not on the index.
  const parts = pathname.split("/").filter(Boolean);
  const isCalcPage = parts.length >= 2 && parts[0] === "calculators";
  if (!isCalcPage) return null;
  const current = parts[1];

  return (
    <div className="flex items-center gap-2 text-xs">
      <label className="text-slate-500 flex-none">Jump to:</label>
      <select
        value={current}
        onChange={(e) => router.push(`/calculators/${e.target.value}`)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {GROUPS.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
