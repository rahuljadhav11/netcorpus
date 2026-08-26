export type FaqItem = { q: string; a: string };

export type CalculatorContent = {
  /** One or two sentences — what this calculator answers and for whom. */
  intro: string;
  /** How the number is actually computed — formula/mechanics, not marketing copy. */
  howItWorks: string;
  /** A concrete worked example using round numbers. */
  example: string;
  faq: FaqItem[];
  /** Other calculator slugs worth linking to from this page. */
  related: string[];
};

export const CALCULATOR_CONTENT: Record<string, CalculatorContent> = {
  sip: {
    intro:
      "A Systematic Investment Plan (SIP) is a fixed amount invested every month into a mutual fund. This calculator projects what a monthly SIP grows into at a given return, and what that's worth once inflation is stripped out.",
    howItWorks:
      "The math is a future value of an annuity-due (each instalment is assumed to go in at the start of the month, which is how most SIP debits actually work). Monthly return = annual return ÷ 12; the corpus compounds every month as new instalments are added. The 'in today's ₹' figure then discounts that future corpus back by your assumed inflation rate, so you're comparing purchasing power, not just a bigger-looking number.",
    example:
      "₹10,000/month for 15 years at 12% p.a. grows to about ₹50.5L — of which ₹18L is what you actually put in and ₹32.5L is growth. At 7% assumed inflation, that ₹50.5L is worth roughly ₹18.3L in today's rupees — a useful reality check on what the final number actually buys.",
    faq: [
      {
        q: "Is 12% a realistic SIP return assumption in India?",
        a: "Long-run Nifty/Sensex index returns have averaged roughly 11–13% CAGR over multi-decade periods, but any single 10–15 year window can land meaningfully below or above that. 12% is a reasonable planning default, not a guarantee — worth stress-testing at 9–10% too.",
      },
      {
        q: "Does this account for tax on the SIP gains?",
        a: "The main result is pre-tax. If you switch to the 'withdrawn as a single lump' view, it applies LTCG at 12.5% above the ₹1.25L annual exemption (per Union Budget 2024 equity taxation rules) to show a realistic post-tax number.",
      },
      {
        q: "Why does the calculator assume the SIP date is the start of the month?",
        a: "Because that's how most bank SIP mandates actually execute — the debit usually happens in the first few days of the month, so each instalment gets (very slightly) more time to compound than if it went in at month-end.",
      },
    ],
    related: ["step-sip", "goal-sip", "cagr", "swp"],
  },
  "step-sip": {
    intro:
      "A step-up (or 'top-up') SIP increases your monthly investment by a fixed percentage every year — typically matched to an expected salary hike — instead of staying flat for the whole tenure.",
    howItWorks:
      "The monthly instalment for year N is the year-1 instalment compounded by your step-up percentage, N−1 times. Each year's higher instalment then compounds at your expected return for its remaining time in the market. Because later, larger instalments have less time to compound, a step-up SIP front-loads more of its final value from the early years than intuition suggests — but it still comfortably out-grows a flat SIP of the same starting amount because the total invested is much higher.",
    example:
      "Starting at ₹10,000/month, stepping up 10% every year, at 12% return over 20 years, invests substantially more than a flat ₹10,000 SIP over the same period and produces a proportionally larger corpus — because your invested amount is tracking your rising income instead of staying fixed in nominal terms while inflation erodes it.",
    faq: [
      {
        q: "How much should I step up my SIP by each year?",
        a: "Matching your expected annual salary hike (commonly 8–12% for salaried professionals in India) is a reasonable default — it keeps your savings rate roughly constant as a share of income rather than shrinking every year as your salary grows and the SIP doesn't.",
      },
      {
        q: "Is a step-up SIP better than just starting with a higher flat SIP?",
        a: "If you can genuinely afford the higher flat amount today, that usually wins on total corpus since the money compounds longer. Step-up SIPs exist for the realistic case where you can't afford the bigger number yet but will be able to as your salary grows.",
      },
    ],
    related: ["sip", "goal-sip", "lump-sum"],
  },
  "lump-sum": {
    intro:
      "This is straightforward compound-interest projection for a one-time investment — a bonus, an inheritance, or a maturity payout you're redeploying — rather than a recurring monthly contribution.",
    howItWorks:
      "Standard compound interest: final value = principal × (1 + annual return)^years. The calculator also shows the same figure in today's rupees after your assumed inflation rate, and an approximate post-tax value assuming the gain is taxed as long-term capital gains at redemption.",
    example:
      "₹5L invested for 10 years at 12% p.a. grows to roughly ₹15.5L — a 3.1× multiple. The same ₹5L left in a savings account at ~3% would only reach about ₹6.7L over the same period, which is the entire case for taking on equity volatility for money you won't need for a decade.",
    faq: [
      {
        q: "Should I invest a lump sum all at once or spread it out (STP)?",
        a: "Investing all at once statistically wins more often than not over long horizons, since markets rise more years than they fall. But if the amount is large relative to your other savings, a Systematic Transfer Plan (STP) over 6–12 months trades some expected return for lower regret risk if markets fall right after you invest.",
      },
    ],
    related: ["sip", "cagr", "goal-sip"],
  },
  "goal-sip": {
    intro:
      "Works backwards from a target amount — a house down payment, a child's education, a specific corpus — to tell you the monthly SIP required to get there by your deadline.",
    howItWorks:
      "This inverts the standard SIP future-value formula: instead of solving for final corpus given a monthly amount, it solves for the monthly amount given a target final corpus, your assumed return, and time horizon, net of whatever you've already saved toward the goal.",
    example:
      "Targeting ₹50L in 10 years at 12% p.a. with no existing savings requires roughly ₹21,700/month. If you already have ₹5L saved and growing at the same rate, the required monthly SIP drops meaningfully because that existing amount is doing part of the compounding work for you.",
    faq: [
      {
        q: "Should I use today's rupees or future rupees for my goal amount?",
        a: "If your goal is itself expressed in today's terms (e.g. 'a house that costs ₹50L today'), toggle the 'target is in today's rupees' option so the calculator inflates the target to what it'll actually cost at your deadline before solving for the SIP.",
      },
      {
        q: "What if the required SIP is more than I can afford?",
        a: "Three levers: extend the timeline, increase your assumed return (carries more risk), or accept a partially-funded goal and plan to cover the gap from another source at the deadline. A step-up SIP (see that calculator) is often the realistic middle ground.",
      },
    ],
    related: ["sip", "step-sip", "swp"],
  },
  cagr: {
    intro:
      "Compound Annual Growth Rate answers one question: given a starting value, an ending value, and a time period, what constant annual growth rate would explain the difference?",
    howItWorks:
      "CAGR = (Final Value ÷ Initial Value)^(1/years) − 1. It's a smoothed rate — the actual year-to-year returns almost certainly varied, sometimes a lot — so CAGR tells you the equivalent steady rate, not what any individual year looked like.",
    example:
      "₹1L grown to ₹3L over 10 years works out to a CAGR of about 11.6% — useful for comparing that investment's performance against a fund's benchmark or another asset class on a like-for-like annualised basis.",
    faq: [
      {
        q: "Is CAGR the same as average annual return?",
        a: "No — a simple average of yearly returns overstates real growth when returns are volatile, because it ignores compounding and sequence. CAGR reflects what actually happened to your money; a plain average doesn't.",
      },
    ],
    related: ["sip", "lump-sum"],
  },
  fd: {
    intro:
      "Fixed Deposit maturity calculator with quarterly compounding (the standard convention most Indian banks use) and a post-tax view, since FD interest is fully taxable at your slab rate.",
    howItWorks:
      "Maturity value = principal × (1 + rate/4)^(4×years), reflecting quarterly compounding. Unlike PPF or ELSS, FD interest has no tax exemption — it's added to your income and taxed at your slab rate, and banks deduct TDS at 10% (20% without PAN) once interest crosses ₹40,000/year (₹50,000 for seniors) in a financial year.",
    example:
      "₹5L at 7% p.a. for 5 years grows to about ₹7.1L. If you're in the 30% tax slab, the post-tax maturity value is meaningfully lower — the calculator's post-tax figure makes that visible up front instead of leaving you to discover it at tax-filing time.",
    faq: [
      {
        q: "Why does the calculator assume 30% tax by default?",
        a: "It's a placeholder for the top salaried slab — adjust it to your actual marginal rate. FD interest stacks on top of your salary income, so it's usually taxed at whatever your highest slab is, not a flat rate.",
      },
      {
        q: "Is a 5-year tax-saver FD different?",
        a: "A 5-year tax-saver FD qualifies for Section 80C deduction on the amount invested (old regime only), but the interest earned is still fully taxable — the 80C benefit is only on the principal going in, not the interest coming out.",
      },
    ],
    related: ["rd", "ppf", "nsc"],
  },
  rd: {
    intro:
      "Recurring Deposit maturity calculator for a fixed monthly deposit over a fixed term, with the same quarterly-compounding convention banks use for FDs.",
    howItWorks:
      "Each monthly instalment compounds quarterly for its own remaining tenure until maturity — so the first instalment earns interest for the full term, the last one for barely a quarter. RD interest is taxed exactly like FD interest: added to income, taxed at slab rate, with TDS above the same ₹40,000/₹50,000 thresholds.",
    example:
      "₹5,000/month for 5 years at 6.7% p.a. matures to roughly ₹3.55L, against ₹3L actually deposited — about ₹55,000 in interest before tax.",
    faq: [
      {
        q: "RD or SIP for a 5-year goal?",
        a: "RD gives a guaranteed, known return with zero volatility — appropriate for a goal where you can't tolerate the amount coming in lower than planned. A SIP into equity has historically outperformed over 5+ years but with no such guarantee; the right choice depends on how fixed the deadline and amount actually are.",
      },
    ],
    related: ["fd", "sip"],
  },
  ppf: {
    intro:
      "Public Provident Fund maturity calculator. PPF is one of the few EEE (Exempt-Exempt-Exempt) instruments left in India — contributions, interest, and maturity are all tax-free.",
    howItWorks:
      "Interest compounds annually (calculated monthly on the lowest balance between the 5th and last day of the month, credited at year-end) at the government-declared rate, revised quarterly. The account has a mandatory 15-year lock-in, extendable indefinitely in blocks of 5 years, with partial withdrawal allowed from year 7.",
    example:
      "The statutory maximum of ₹1.5L/year at the current declared rate of 7.1% grows to roughly ₹40.7L over 15 years — of which ₹22.5L is your own contribution and ₹18.2L is entirely tax-free interest.",
    faq: [
      {
        q: "What's the current PPF interest rate?",
        a: "The government revises the rate quarterly. The calculator defaults to 7.1% (the recently declared rate) — check the latest EPFO/finance ministry notification before relying on it for a real 15-year plan, and adjust the input if it's changed.",
      },
      {
        q: "Can I have more than one PPF account?",
        a: "No — one PPF account per person (a separate account can be opened for a minor child under guardianship). The ₹1.5L/year cap applies across all your PPF accounts combined, not per account.",
      },
      {
        q: "What happens after 15 years?",
        a: "You can withdraw the full maturity amount tax-free, or extend the account in 5-year blocks — either continuing to contribute or leaving it untouched while it keeps earning interest.",
      },
    ],
    related: ["sukanya", "nsc", "scss"],
  },
  "post-office-mis": {
    intro:
      "Post Office Monthly Income Scheme pays a fixed monthly interest payout on a lump-sum deposit over a 5-year term — designed for people who want predictable monthly cash flow rather than compounding growth.",
    howItWorks:
      "Interest is simple (not compounding) and paid out monthly rather than reinvested: monthly payout = deposit × annual rate ÷ 12. The principal is returned at the end of the 5-year term. Interest is fully taxable as income; there's no TDS deducted by the post office, but you're still liable to declare and pay tax on it.",
    example:
      "A ₹9L deposit (near the ₹9L single-account cap) at 7.4% p.a. pays about ₹5,550/month for 5 years, with the full ₹9L returned at maturity — useful as a supplementary income stream, not a growth vehicle.",
    faq: [
      {
        q: "What's the maximum I can deposit in MIS?",
        a: "₹9L for a single account, ₹15L for a joint account, as per current India Post rules — check the latest limits before depositing, since these are occasionally revised.",
      },
      {
        q: "Is MIS interest reinvested or paid out?",
        a: "Paid out monthly, directly to your linked savings account. It doesn't compound — if you want the interest to keep growing, you'd need to manually reinvest each payout elsewhere.",
      },
    ],
    related: ["scss", "fd", "ppf"],
  },
  scss: {
    intro:
      "Senior Citizens' Savings Scheme — a government-backed, quarterly-payout instrument specifically for people 60+ (or 55+ for those who've taken voluntary retirement), currently offering one of the higher guaranteed rates among small savings schemes.",
    howItWorks:
      "Interest is simple, paid out quarterly rather than compounded, at the declared rate (revised quarterly by the government). Deposits qualify for Section 80C deduction up to ₹1.5L (old regime). The account has a 5-year tenure, extendable once by 3 years.",
    example:
      "The near-maximum ₹15L deposit at 8.2% p.a. pays roughly ₹30,750 every quarter — about ₹1.23L/year — for 5 years, with the ₹15L principal returned at maturity.",
    faq: [
      {
        q: "Is SCSS interest taxable?",
        a: "Yes, fully taxable as income at your slab rate, and TDS is deducted if total interest exceeds ₹50,000/year (senior citizen threshold) — you can submit Form 15H to avoid TDS if your total income is below the taxable limit.",
      },
      {
        q: "What's the maximum SCSS deposit?",
        a: "₹30L per individual (raised from ₹15L in recent years) — check the current India Post/bank notification, since this limit has been revised.",
      },
    ],
    related: ["post-office-mis", "fd", "ppf"],
  },
  sukanya: {
    intro:
      "Sukanya Samriddhi Yojana is a girl-child savings scheme — deposits made until she turns 15 (account matures at 21), at a rate that's historically run above PPF, with the same EEE tax treatment.",
    howItWorks:
      "Interest compounds annually at the declared rate on the account balance. The account must be opened before the girl turns 10, deposits are made for 15 years from account opening (or until she turns 21 for the account to be closed, whichever gives the longer runway shown here), and partial withdrawal (up to 50%) is allowed once she turns 18 for education expenses.",
    example:
      "Starting at age 2 with the statutory maximum ₹1.5L/year at 8.2% p.a. builds a meaningfully larger corpus by maturity than an equivalent PPF contribution, purely because of the higher declared rate — though PPF is more flexible on withdrawal timing.",
    faq: [
      {
        q: "What's the current Sukanya Samriddhi interest rate?",
        a: "Revised quarterly by the government, historically set higher than PPF as a policy incentive. The calculator defaults to 8.2% — verify against the latest notification.",
      },
      {
        q: "Can I open more than one Sukanya account?",
        a: "One account per girl child, maximum two children per family (three in the case of twins on the second birth) — the scheme isn't meant to be stacked per family, it's per eligible child.",
      },
    ],
    related: ["ppf", "nsc"],
  },
  nsc: {
    intro:
      "National Savings Certificate is a 5-year, government-backed, fixed-rate investment that qualifies for Section 80C deduction — one of the few 80C options with a guaranteed, government-backed return.",
    howItWorks:
      "Interest compounds annually at the declared rate and is paid out fully at maturity along with the principal (it isn't distributed yearly). Interest is taxable each year on an accrual basis even though you don't receive it until maturity — but each year's accrued interest (except the final year) is itself eligible for a fresh 80C deduction if you're claiming it, which partially offsets the tax.",
    example:
      "₹1L invested at 7.7% p.a. for 5 years matures to roughly ₹1.45L — about ₹45,000 in interest, taxed each year on accrual even though it's paid in one lump sum at the end.",
    faq: [
      {
        q: "Why does NSC interest get taxed before I receive it?",
        a: "Because NSC is deemed to be reinvested each year — the government treats the annual accrued interest as taxable income in the year it accrues, not the year it's paid out, similar to how a cumulative FD is sometimes treated.",
      },
    ],
    related: ["ppf", "fd", "scss"],
  },
  sgb: {
    intro:
      "Sovereign Gold Bond return calculator — a fixed annual coupon paid on the bond's face value, plus whatever gold price appreciation you assume over the holding period.",
    howItWorks:
      "Total return = annual coupon (paid semi-annually on the original investment) + capital appreciation on redemption value, tracked against the gold price you assume. If held to maturity (8 years), capital gains are entirely tax-free — a meaningful advantage over physical gold or gold ETFs, where capital gains are taxable.",
    example:
      "10 grams at ₹8,500/gram (₹85,000 invested) with a 2.5% annual coupon and 9% assumed gold price appreciation over 8 years produces both a steady coupon income stream and a tax-free capital gain at redemption — a combination physical gold can't match.",
    faq: [
      {
        q: "Is SGB really better than physical gold?",
        a: "For pure investment purposes, usually yes — no making charges, no storage/theft risk, a 2.5% annual coupon on top of price appreciation, and tax-free gains if held to the full 8-year maturity. Physical gold's advantage is liquidity and cultural/ceremonial use, not investment returns.",
      },
      {
        q: "Can I exit before 8 years?",
        a: "Early redemption is allowed from year 5 on interest-payment dates, or you can sell on the stock exchange anytime if the bond is listed — but the tax-free capital gains benefit only applies to holding until the full 8-year maturity.",
      },
    ],
    related: ["fd", "lump-sum"],
  },
  emi: {
    intro:
      "Reducing-balance EMI calculator for any loan — home, car, or personal — with the full month-by-month amortization schedule so you can see exactly how much of each payment is interest versus principal.",
    howItWorks:
      "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is principal, r is the monthly interest rate, and n is the number of months. Each month, interest is charged on the outstanding balance, and whatever's left of the fixed EMI reduces principal — which is why the interest portion is largest in month 1 and smallest in the final month, even though the EMI itself never changes.",
    example:
      "₹50L at 8.5% for 20 years works out to an EMI of ₹43,391/month. Over the full tenure that's ₹1.04Cr paid — ₹50L principal and ₹54L interest, meaning you pay roughly as much in interest as you borrowed.",
    faq: [
      {
        q: "Why is so much of my early EMI interest, not principal?",
        a: "Because interest is charged on the outstanding balance, which is highest at the start. As principal reduces month by month, the interest component shrinks and the principal component grows — even though the EMI amount itself is fixed for the whole tenure.",
      },
      {
        q: "Does a lower EMI always mean a cheaper loan?",
        a: "No — a longer tenure lowers the EMI but increases total interest paid, since you're borrowing the bank's money for longer. Compare total interest paid, not just the monthly figure, when choosing tenure.",
      },
    ],
    related: ["loan-prepayment", "rent-vs-buy"],
  },
  "loan-prepayment": {
    intro:
      "Shows exactly how much interest a lump-sum prepayment saves and how many months it shortens your loan by — since banks apply prepayments to principal first, and every rupee off principal stops earning interest immediately.",
    howItWorks:
      "A prepayment reduces the outstanding principal on the date it's made; interest for every subsequent month is then calculated on that lower balance. Since the EMI itself typically stays fixed (unless you request re-amortization), the loan simply finishes earlier — the calculator recomputes the full remaining schedule with and without the prepayment to show the exact interest saved and months shaved off.",
    example:
      "On a ₹40L loan at 8.5% with 15 years remaining, a ₹5L lump-sum prepayment plus an extra ₹5,000/month typically saves several lakh in interest and shortens the tenure by multiple years — the exact figures depend on when in the tenure the prepayment happens, since earlier prepayments compound the savings for longer.",
    faq: [
      {
        q: "Is it always better to prepay than invest the same amount?",
        a: "Not automatically. Compare your loan's after-tax interest rate against your realistic after-tax investment return. A home loan at 8.5% with no interest deduction (new tax regime) is a guaranteed 8.5% 'return' from prepaying; an equity SIP at 12% pre-tax is roughly 10.4% after LTCG — a real but modest edge, not a guarantee.",
      },
      {
        q: "Does prepaying always reduce my EMI?",
        a: "Only if you ask the bank to re-amortize. By default, most banks keep your EMI the same and simply shorten the tenure — which saves more total interest than reducing the EMI would, since the loan closes sooner.",
      },
    ],
    related: ["emi", "rent-vs-buy"],
  },
  "rent-vs-buy": {
    intro:
      "Compares the long-run financial outcome of buying a home with a loan versus renting an equivalent property and investing the difference — the down payment and any monthly savings — in the market instead.",
    howItWorks:
      "The 'buy' path tracks home equity built through EMI payments plus assumed property price appreciation, minus total interest paid. The 'rent' path invests the down payment amount plus the monthly gap between rent and EMI (whichever is lower) at your assumed investment return, with rent itself growing annually. The comparison is only as good as its assumptions — property appreciation and investment return are both genuinely uncertain over a 15–20 year horizon.",
    example:
      "A ₹1Cr property with a ₹20L down payment, an EMI around ₹1.74L/month versus ₹35,000/month rent, invested at 12% versus 6% property appreciation, is exactly the kind of comparison where the 'right' answer flips depending on which appreciation assumption you trust — worth running at a few different property-growth scenarios rather than trusting one number.",
    faq: [
      {
        q: "Is renting and investing actually better than buying in India?",
        a: "It depends heavily on your city's rent-to-price ratio and how you weight the non-financial value of owning (stability, no landlord risk, forced savings discipline). In high price-to-rent cities, renting and investing the difference can out-perform buying financially — but 'financially optimal' isn't the only thing that matters in a housing decision.",
      },
      {
        q: "What property appreciation rate should I assume?",
        a: "Indian residential real estate has historically delivered quite modest returns net of transaction costs (stamp duty, brokerage) in many markets — 5–7% is a more defensible long-run assumption than the double-digit numbers sometimes quoted, though it varies enormously by city and locality.",
      },
    ],
    related: ["emi", "loan-prepayment"],
  },
  swp: {
    intro:
      "A Systematic Withdrawal Plan draws a fixed (or inflation-adjusted) amount from an existing corpus every month — this calculator shows how long that corpus actually lasts, factoring in continued growth and LTCG tax on each withdrawal.",
    howItWorks:
      "Each month, the withdrawal is deducted and the remaining balance grows at your assumed return. If inflation-adjustment is on, the withdrawal amount itself increases each year with inflation (so your purchasing power stays constant, but the corpus depletes faster in nominal terms). If tax is applied, each withdrawal's gain portion (proportional to your cost basis) is taxed as LTCG — claiming the ₹1.25L annual exemption fresh every year, which is why spreading a large redemption across many years via SWP is more tax-efficient than one lump withdrawal.",
    example:
      "A ₹1Cr corpus with ₹50,000/month withdrawal, growing at 8% while withdrawals inflate at 7%, will last a very different number of years than the same corpus with a flat, non-inflating withdrawal — the gap between your withdrawal growth rate and your corpus growth rate is what determines longevity, not the corpus size alone.",
    faq: [
      {
        q: "Why is SWP more tax-efficient than one lump-sum withdrawal?",
        a: "Because the ₹1.25L LTCG exemption applies per financial year. Withdrawing ₹50L in one year uses the exemption once; spreading the same ₹50L across 10 years of SWP claims the exemption 10 times, meaningfully reducing total tax paid on the same total withdrawal.",
      },
      {
        q: "What withdrawal rate is 'safe' for a retirement corpus?",
        a: "The commonly cited 4% rule is a US-market-derived rough guide, not a guarantee — in Indian conditions with higher inflation, a lower starting withdrawal rate (3–3.5%) is more conservative. Run this calculator at your specific numbers rather than relying on a rule of thumb.",
      },
    ],
    related: ["sip", "goal-sip", "inflation-impact"],
  },
  "income-tax": {
    intro:
      "Compares your tax liability under the old and new regimes for FY 2025-26 side by side, and automatically flags which one is cheaper for your specific numbers.",
    howItWorks:
      "New regime slabs: nil up to ₹4L, 5% from ₹4-8L, 10% from ₹8-12L, 15% from ₹12-16L, 20% from ₹16-20L, 25% from ₹20-24L, 30% above ₹24L — plus a ₹75,000 standard deduction and full rebate (up to ₹60,000) if taxable income is ≤₹12L. Old regime keeps a lower basic exemption (₹2.5L below 60, ₹3L for 60–79, ₹5L for 80+) with a ₹50,000 standard deduction, but allows deductions like 80C (₹1.5L cap), 80D, HRA exemption, and home loan interest — plus a smaller ₹12,500 rebate if taxable income is ≤₹5L. Both add a 4% health & education cess on the final tax.",
    example:
      "At ₹15L gross income with ₹1.5L in 80C and ₹25,000 in 80D, the old regime's deductions often bring taxable income down enough to compete with or beat the new regime's lower rates — but past roughly ₹15-18L gross with typical deduction levels, the new regime usually wins because its lower rates outweigh the old regime's deductions. The exact crossover depends entirely on how much you can actually claim under the old regime.",
    faq: [
      {
        q: "Which tax regime should I choose?",
        a: "There's no universal answer — it depends on how much you can genuinely claim in old-regime deductions (80C, 80D, HRA, home loan interest). If your claimable deductions are modest, the new regime's lower rates usually win. Enter your real numbers here rather than assuming either regime is automatically better.",
      },
      {
        q: "Can I switch between regimes every year?",
        a: "Salaried individuals (with no business income) can choose either regime every financial year when filing their return, regardless of what they declared to their employer for TDS purposes — so it's worth recomputing this every year as your income and deductions change.",
      },
    ],
    related: ["hra", "emergency-fund"],
  },
  hra: {
    intro:
      "Computes your House Rent Allowance exemption under Section 10(13A) — the least of three specific amounts, which is smaller (and less intuitive) than most people assume.",
    howItWorks:
      "Exempt HRA = the minimum of: (a) actual HRA received, (b) 50% of basic salary in a metro city or 40% in a non-metro, and (c) actual rent paid minus 10% of basic salary. Whichever of these three is smallest is what you actually get to exclude from taxable income — the other two don't matter once you've found the minimum.",
    example:
      "On ₹6L basic salary, ₹2.4L HRA received, and ₹3L rent paid in a metro: (a) ₹2.4L, (b) 50% of ₹6L = ₹3L, (c) ₹3L − ₹60,000 = ₹2.4L. The minimum is ₹2.4L — in this case the full HRA received happens to be exempt, but that's not guaranteed; it depends entirely on the relationship between your rent, basic salary, and HRA component.",
    faq: [
      {
        q: "Is HRA exemption available under the new tax regime?",
        a: "No — HRA exemption (like most other old-regime deductions) is only available if you file under the old tax regime. Factor this into the old-vs-new regime comparison if you pay significant rent.",
      },
      {
        q: "What if I don't get HRA as part of my salary but pay rent?",
        a: "You may be able to claim rent paid under Section 80GG instead, subject to its own (smaller) limits — that's a separate calculation from the HRA exemption shown here, which only applies if HRA is an explicit salary component.",
      },
    ],
    related: ["income-tax"],
  },
  "emergency-fund": {
    intro:
      "A quick sizing calculator for how much you should keep in liquid, easily-accessible savings before investing anything else — based on your actual monthly expenses, not an arbitrary round number.",
    howItWorks:
      "Target fund = monthly expenses × number of months of buffer you want, minus whatever you've already set aside. The standard guidance is 6 months of expenses for a salaried professional with reasonably stable income; single-income households, freelancers, or anyone in a volatile industry are often better served by 9–12 months.",
    example:
      "At ₹60,000/month expenses with a 6-month target and ₹2L already saved, you need roughly ₹1.6L more to hit the full buffer — a concrete, checkable number instead of a vague 'save more' intention.",
    faq: [
      {
        q: "Where should the emergency fund actually sit?",
        a: "Somewhere genuinely liquid and low-risk — a savings account, a liquid mutual fund, or a sweep-in FD. The whole point is being able to access it within a day or two without penalty or market-timing risk, which rules out equity, long-tenure FDs, and anything with a lock-in.",
      },
      {
        q: "Should I build the emergency fund before starting SIPs?",
        a: "Generally yes, or at least in parallel — an underfunded emergency reserve often forces people to break a long-term investment or take on high-interest debt when something unexpected happens, which usually costs more than the SIP gains would have been worth.",
      },
    ],
    related: ["term-insurance", "sip"],
  },
  "term-insurance": {
    intro:
      "Estimates how much term life cover you actually need using the Human Life Value method — replacing your dependents' future expenses and clearing outstanding debts, rather than a rough 'X times your salary' rule of thumb.",
    howItWorks:
      "The calculator projects your dependents' monthly expenses forward for the number of years they'd depend on your income, inflating them annually, then discounts that stream back to a present value using your assumed discount rate. It adds any outstanding loans (so debt doesn't fall on your family) and subtracts your existing liquid corpus and any existing life cover, since those already reduce the gap a new policy needs to fill.",
    example:
      "₹60,000/month household expenses, 25 years of dependency, 7% inflation, a 6% discount rate, ₹40L in outstanding loans, and ₹5L in existing liquid assets produces a required cover figure well into eight figures — a useful corrective against the common (and usually inadequate) '10x annual salary' heuristic.",
    faq: [
      {
        q: "Why is the Human Life Value method better than '10x salary'?",
        a: "'10x salary' ignores your actual expenses, how long your dependents will need support, inflation over that period, and any existing debt or assets. Two people earning the same salary can need very different cover depending on family size, age of children, and outstanding loans — a flat multiple can't capture that.",
      },
      {
        q: "Should I buy a term plan or a traditional/ULIP policy?",
        a: "For pure protection, term insurance is dramatically cheaper per rupee of cover than traditional or ULIP policies, because it carries no investment component. The standard advice — buy term for protection, invest separately (SIP/PPF/etc.) for growth — holds up well against the numbers in most cases.",
      },
    ],
    related: ["emergency-fund", "income-tax"],
  },
  "inflation-impact": {
    intro:
      "Shows what a given amount of money today will be 'worth' — in terms of purchasing power — after a number of years of inflation, and conversely how much you'd need in the future to match today's buying power.",
    howItWorks:
      "Future purchasing power of today's ₹X = X ÷ (1 + inflation)^years. It's the same discounting math used throughout the site's other calculators (retirement corpus, SIP 'in today's ₹' figures, SWP) — this page exists as a standalone version of that one calculation for whenever you just need the number directly.",
    example:
      "₹1L today, at 7% assumed inflation, has the purchasing power of only about ₹25,800 in 20 years — meaning you'd need roughly ₹3.87L in 20 years just to buy what ₹1L buys today. This is the entire reason 'safe' fixed-return instruments that barely beat inflation don't actually preserve wealth over long horizons.",
    faq: [
      {
        q: "What inflation rate should I assume for long-term planning?",
        a: "India's headline CPI inflation has averaged roughly 5–7% over the past decade, though your personal inflation rate (driven by education, healthcare, and housing costs) often runs higher than the headline number. 7% is a reasonably conservative planning default for long-horizon goals.",
      },
      {
        q: "Why does the retirement planner care so much about inflation?",
        a: "Because a corpus that looks large in nominal (future) rupees can be a disappointment in real terms if inflation erodes it faster than expected — sizing a retirement or goal corpus without an inflation assumption is one of the most common planning mistakes.",
      },
    ],
    related: ["sip", "swp"],
  },
};

export function getCalculatorContent(slug: string): CalculatorContent | undefined {
  return CALCULATOR_CONTENT[slug];
}
