import Link from "next/link";
import { getCalculatorContent } from "@/lib/calculatorContent";
import { getCalculator } from "@/lib/calculatorsList";

export default function CalculatorContent({ slug }: { slug: string }) {
  const content = getCalculatorContent(slug);
  if (!content) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const related = content.related
    .map((s) => getCalculator(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="space-y-6 mt-2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="card p-5">
        <p className="text-sm text-slate-700 leading-relaxed">{content.intro}</p>
      </div>

      <div>
        <div className="section-h mb-2">How it's calculated</div>
        <p className="text-sm text-slate-600 leading-relaxed">{content.howItWorks}</p>
      </div>

      <div>
        <div className="section-h mb-2">Worked example</div>
        <p className="text-sm text-slate-600 leading-relaxed">{content.example}</p>
      </div>

      <div>
        <div className="section-h mb-2">Frequently asked</div>
        <div className="space-y-2">
          {content.faq.map((f) => (
            <details key={f.q} className="card p-4 group">
              <summary className="cursor-pointer font-medium text-slate-800 text-sm list-none flex items-center justify-between gap-4">
                <span>{f.q}</span>
                <span className="flex-none text-slate-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <div className="section-h mb-2">Related calculators</div>
          <div className="flex flex-wrap gap-2">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700 transition"
              >
                <span>{c.emoji}</span> {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
