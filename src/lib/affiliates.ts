export type AffiliateOffer = {
  category: string;
  partner: string;
  blurb: string;
  ctaLabel: string;
  /** TODO: replace "#" with the real affiliate/referral link once you've
   *  joined a program (e.g. via Cuelinks or INRDeals — see conversation
   *  notes). Nothing here points anywhere yet. */
  href: string;
};

/**
 * Per-calculator affiliate offer, keyed by the same `slug` already passed to
 * <CalculatorFooter slug="..." />. Calculators for government schemes
 * (PPF, NSC, SCSS, Sukanya, Post Office MIS, SGB) are intentionally omitted —
 * those are opened directly at a post office/bank branch, so there's no
 * honest referral to make.
 */
export const AFFILIATE_OFFERS: Record<string, AffiliateOffer> = {
  sip: {
    category: "Investing",
    partner: "Groww",
    blurb: "Start this SIP in a few minutes, fully online.",
    ctaLabel: "Start a SIP on Groww",
    href: "#",
  },
  "step-sip": {
    category: "Investing",
    partner: "Groww",
    blurb: "Set up a step-up SIP that increases automatically each year.",
    ctaLabel: "Start on Groww",
    href: "#",
  },
  "lump-sum": {
    category: "Investing",
    partner: "Groww",
    blurb: "Invest this lump sum in a fund that matches your horizon.",
    ctaLabel: "Invest on Groww",
    href: "#",
  },
  "goal-sip": {
    category: "Investing",
    partner: "Groww",
    blurb: "Turn this goal into a running SIP, fully online.",
    ctaLabel: "Start on Groww",
    href: "#",
  },
  cagr: {
    category: "Investing",
    partner: "Groww",
    blurb: "Explore funds with this kind of long-term track record.",
    ctaLabel: "Browse funds on Groww",
    href: "#",
  },
  swp: {
    category: "Investing",
    partner: "Groww",
    blurb: "Set up a systematic withdrawal plan on your existing folio.",
    ctaLabel: "Manage on Groww",
    href: "#",
  },
  "inflation-impact": {
    category: "Investing",
    partner: "Groww",
    blurb: "The real fix for inflation is investing ahead of it.",
    ctaLabel: "Start investing on Groww",
    href: "#",
  },
  emi: {
    category: "Home loan",
    partner: "BankBazaar",
    blurb: "Compare current home loan rates across lenders.",
    ctaLabel: "Compare rates on BankBazaar",
    href: "#",
  },
  "loan-prepayment": {
    category: "Home loan",
    partner: "BankBazaar",
    blurb: "See if refinancing beats prepaying at your current rate.",
    ctaLabel: "Compare rates on BankBazaar",
    href: "#",
  },
  "rent-vs-buy": {
    category: "Home loan",
    partner: "BankBazaar",
    blurb: "If buying wins, check today's best home loan offers.",
    ctaLabel: "Compare rates on BankBazaar",
    href: "#",
  },
  "income-tax": {
    category: "Tax filing",
    partner: "ClearTax",
    blurb: "File your ITR with this regime factored in.",
    ctaLabel: "File with ClearTax",
    href: "#",
  },
  hra: {
    category: "Tax filing",
    partner: "ClearTax",
    blurb: "Claim this HRA exemption correctly at filing time.",
    ctaLabel: "File with ClearTax",
    href: "#",
  },
  "term-insurance": {
    category: "Insurance",
    partner: "PolicyBazaar",
    blurb: "Compare term plans from this cover amount.",
    ctaLabel: "Compare plans",
    href: "#",
  },
  "emergency-fund": {
    category: "Savings",
    partner: "Jupiter",
    blurb: "Park this fund somewhere it still earns while staying liquid.",
    ctaLabel: "Open a savings account",
    href: "#",
  },
  fd: {
    category: "Fixed deposits",
    partner: "Stable Money",
    blurb: "Compare FD rates across banks before you book one.",
    ctaLabel: "Compare FD rates",
    href: "#",
  },
  rd: {
    category: "Recurring deposits",
    partner: "Stable Money",
    blurb: "Compare RD rates across banks before you book one.",
    ctaLabel: "Compare RD rates",
    href: "#",
  },
};

export function getAffiliateOffer(slug: string): AffiliateOffer | undefined {
  return AFFILIATE_OFFERS[slug];
}
