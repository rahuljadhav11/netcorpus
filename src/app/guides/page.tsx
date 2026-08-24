import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides",
  description: "Grounded, non-hype guides on retirement planning and home loans for Indian households.",
};

const guides = [
  {
    href: "/guides/early-retirement-india",
    title: "How to plan early retirement in India",
    desc: "The corpus math, why 25x isn't enough, and how loans complicate the picture.",
  },
  {
    href: "/guides/overdraft-vs-fixed-emi",
    title: "Overdraft home loan vs fixed EMI",
    desc: "SBI MaxGain, ICICI Money Saver, HDFC OD — what actually happens when you park money.",
  },
];

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Guides</h1>
      <p className="text-slate-600 mt-1">Plain-English explainers, no hype.</p>
      <div className="mt-6 space-y-3">
        {guides.map((g) => (
          <Link key={g.href} href={g.href} className="card p-4 block hover:border-brand-500 transition">
            <div className="font-semibold text-slate-900">{g.title}</div>
            <div className="text-sm text-slate-600 mt-1">{g.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
