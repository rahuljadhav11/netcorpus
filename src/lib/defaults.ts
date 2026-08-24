import type { ExpenseBreakdown, PlanInputs } from "./types";

// Modest ~₹30k/mo lifestyle so the breakdown stays in sync with the top-level
// expense default when the user toggles into itemised mode.
export const defaultExpenseBreakdown: ExpenseBreakdown = {
  rent: 0,
  maintenance: 2000,
  propertyTax: 200,

  electricity: 1200,
  waterGas: 500,
  internetMobile: 800,
  subscriptions: 300,

  groceries: 6000,
  eatingOut: 1500,

  fuel: 2000,
  cabPublicTransport: 500,
  vehicleMaintenance: 500,

  schoolFees: 3000,
  coachingBooks: 800,
  domesticHelp: 1500,
  parentsSupport: 2000,

  healthInsurance: 800,
  medicines: 500,
  termInsurance: 500,

  clothingPersonal: 800,
  entertainment: 500,
  travelAnnualized: 1500,
  giftsFestivals: 800,

  otherHousehold: 500,
};

/** Categorised list — used to render the breakdown form. */
export const expenseCategories: {
  group: string;
  items: { key: keyof ExpenseBreakdown; label: string; hint?: string }[];
}[] = [
  {
    group: "Housing",
    items: [
      { key: "rent", label: "Rent", hint: "Skip if you own — but include society maintenance below" },
      { key: "maintenance", label: "Society / apartment maintenance" },
      { key: "propertyTax", label: "Property tax (÷12 if annual)" },
    ],
  },
  {
    group: "Utilities & subscriptions",
    items: [
      { key: "electricity", label: "Electricity" },
      { key: "waterGas", label: "Water + gas / LPG" },
      { key: "internetMobile", label: "Internet + mobile" },
      { key: "subscriptions", label: "OTT / streaming / apps" },
    ],
  },
  {
    group: "Food",
    items: [
      { key: "groceries", label: "Groceries, milk, vegetables" },
      { key: "eatingOut", label: "Eating out / delivery" },
    ],
  },
  {
    group: "Transport",
    items: [
      { key: "fuel", label: "Fuel / petrol" },
      { key: "cabPublicTransport", label: "Cabs, metro, bus" },
      { key: "vehicleMaintenance", label: "Vehicle service, insurance" },
    ],
  },
  {
    group: "Family & dependents",
    items: [
      { key: "schoolFees", label: "School fees (annual ÷ 12)" },
      { key: "coachingBooks", label: "Coaching, books, activities" },
      { key: "domesticHelp", label: "Maid / cook / driver" },
      { key: "parentsSupport", label: "Parents' support" },
    ],
  },
  {
    group: "Health & insurance",
    items: [
      { key: "healthInsurance", label: "Health insurance premium (÷12)" },
      { key: "medicines", label: "Doctor + medicines" },
      { key: "termInsurance", label: "Term life premium (÷12)" },
    ],
  },
  {
    group: "Personal & lifestyle",
    items: [
      { key: "clothingPersonal", label: "Clothing, personal care" },
      { key: "entertainment", label: "Movies, outings, hobbies" },
      { key: "travelAnnualized", label: "Monthly outings (weekends, small trips)", hint: "Big annual trips are handled separately in the Annual Events section" },
      { key: "giftsFestivals", label: "Gifts, festivals, weddings" },
    ],
  },
  {
    group: "Other",
    items: [{ key: "otherHousehold", label: "Repairs, buffer, misc" }],
  },
];

export const defaultInputs: PlanInputs = {
  currentAge: 30,
  retirementAge: 55,
  lifeExpectancy: 80,

  monthlySalary: 100000,
  salaryGrowthPct: 5,

  monthlyExpense: 30000,
  useExpenseBreakdown: false,
  expenseBreakdown: defaultExpenseBreakdown,
  inflationPct: 7,

  loans: [
    { id: "home", name: "Home Loan", type: "fixed", principal: 5000000, annualRate: 8.5, emi: 43391 },
    { id: "car",  name: "Car Loan",  type: "fixed", principal: 1000000, annualRate: 9.5, emi: 21000 },
  ],
  payoffStrategy: "avalanche",

  epfBalance: 0,
  epfMonthlyContribution: 0,
  epfReturnPct: 8.1,

  epfDetails: {
    mode: "detailed",
    basicDA: 60000,
    epsWageCeiling: 15000,
    currentEpsBalance: 0,
    epsEnabled: true,
    // 25 years from currentAge (30) to retirementAge (55).
    serviceYearsAtRetirement: 25,
  },

  existingInvestments: 0,
  existingAssets: [],
  sipReturnPct: 12,
  postRetirementReturnPct: 8,

  nps: {
    enabled: false,
    balance: 0,
    monthlyContribution: 0,
    expectedReturn: 10,
    annuityAllocationPct: 40,
    annuityReturn: 6,
  },

  otherIncomes: [],

  lifeGoals: [],

  annualEvents: [],

  customStrategy: {
    enabled: false,
    acceleratedLoanIds: [],
  },

  ltcgRatePct: 12.5,
  ltcgAnnualExemption: 125000,
};
