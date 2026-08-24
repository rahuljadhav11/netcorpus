import Link from "next/link";
import type { ReactNode } from "react";
import QuickJump from "@/components/calculators/QuickJump";

export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>·</span>
          <Link href="/calculators" className="hover:text-brand-700">Calculators</Link>
        </div>
        {/* Mega-menu in the header handles desktop; QuickJump is the mobile fallback. */}
        <div className="sm:hidden">
          <QuickJump />
        </div>
      </div>
      {children}
    </div>
  );
}
