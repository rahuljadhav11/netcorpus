import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://finplan-in.example";
  const now = new Date();
  const calcSlugs = [
    // Investments
    "sip", "step-sip", "lump-sum", "goal-sip", "cagr",
    // Bank / small savings
    "fd", "rd", "ppf", "post-office-mis", "scss", "sukanya", "nsc", "sgb",
    // Loans
    "emi", "loan-prepayment", "rent-vs-buy",
    // Withdrawal
    "swp",
    // Tax
    "income-tax", "hra",
    // Planning
    "emergency-fund", "term-insurance", "inflation-impact",
  ];
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/plan`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/calculators`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...calcSlugs.map((slug) => ({
      url: `${base}/calculators/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/guides`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/guides/early-retirement-india`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/guides/overdraft-vs-fixed-emi`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
  ];
}
