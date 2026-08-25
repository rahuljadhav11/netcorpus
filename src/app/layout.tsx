import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://finplan-in.example"),
  title: {
    default: "FinPlan India — Retirement & Loan Planner",
    template: "%s · FinPlan India",
  },
  description:
    "Free, private retirement and loan-payoff planner for Indian salaried professionals. Model home loans, overdraft facilities, SIPs, EPF, EPS pension, and post-tax corpus — all in the browser.",
  keywords: [
    "retirement planner India",
    "home loan prepayment calculator",
    "overdraft home loan calculator",
    "SIP calculator India",
    "EPF calculator India",
    "EPS pension calculator",
    "LTCG on mutual funds",
    "financial planning India",
  ],
  openGraph: {
    title: "FinPlan India — Retirement & Loan Planner",
    description:
      "Plan retirement while managing home loan, overdraft, EPF/EPS, and SIPs. Post-tax and inflation-adjusted. Runs locally in your browser.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ThemeProvider>
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
