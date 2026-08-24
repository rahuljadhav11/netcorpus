import type { PlanInputs, ExistingAsset, AssetClass } from "./types";
import { defaultInputs } from "./defaults";

/**
 * Bump the version segment when the shape of PlanInputs changes in a way
 * that old saved data can't be safely merged. Otherwise, forward-compatible
 * additions (new optional fields) are handled by the deep-merge in load().
 */
export const STORAGE_KEY = "finplan.inputs.v1";

/** Load user inputs from localStorage. Returns null if nothing is saved or
 *  the stored blob is corrupt. Merges with `defaultInputs` so new fields
 *  added after the user last saved get sensible defaults. */
export function loadInputs(): PlanInputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    // Deep-merge known nested shapes so schema evolution is safe.
    return {
      ...defaultInputs,
      ...parsed,
      epfDetails: { ...defaultInputs.epfDetails, ...(parsed.epfDetails ?? {}) },
      nps: { ...defaultInputs.nps, ...(parsed.nps ?? {}) },
      expenseBreakdown: parsed.expenseBreakdown
        ? { ...defaultInputs.expenseBreakdown!, ...parsed.expenseBreakdown }
        : defaultInputs.expenseBreakdown,
      // Arrays: trust user's data as-is (their loans/incomes/goals).
      loans: Array.isArray(parsed.loans) ? parsed.loans : defaultInputs.loans,
      otherIncomes: Array.isArray(parsed.otherIncomes)
        ? parsed.otherIncomes.map((oi: Record<string, unknown>) => ({
            id: String(oi.id ?? `inc-${Math.random().toString(36).slice(2)}`),
            name: String(oi.name ?? "Income"),
            // Support the older `monthlyAmount` field name for pre-frequency data.
            amount: Number(oi.amount ?? oi.monthlyAmount ?? 0),
            frequency: (oi.frequency ?? "monthly") as
              | "monthly"
              | "quarterly"
              | "half-yearly"
              | "annually",
            growthPct: Number(oi.growthPct ?? 0),
            activeInRetirement: !!oi.activeInRetirement,
          }))
        : defaultInputs.otherIncomes,
      lifeGoals: Array.isArray(parsed.lifeGoals) ? parsed.lifeGoals : defaultInputs.lifeGoals,
      annualEvents: Array.isArray(parsed.annualEvents)
        ? parsed.annualEvents.map((e: Record<string, unknown>) => ({
            id: String(e.id ?? `evt-${Math.random().toString(36).slice(2)}`),
            name: String(e.name ?? "Event"),
            annualCost: Number(e.annualCost ?? 0),
            inflationPct: Number(e.inflationPct ?? 7),
            // Fields added later — supply sensible defaults if the saved
            // event predates them so old data doesn't break.
            frequencyYears: Number(e.frequencyYears ?? 1),
            untilAge:
              typeof e.untilAge === "number"
                ? e.untilAge
                : e.activeInRetirement
                ? 80
                : (parsed.retirementAge ?? 60) - 1,
          }))
        : defaultInputs.annualEvents,
      customStrategy: parsed.customStrategy && typeof parsed.customStrategy === "object"
        ? {
            enabled: !!parsed.customStrategy.enabled,
            acceleratedLoanIds: Array.isArray(parsed.customStrategy.acceleratedLoanIds)
              ? parsed.customStrategy.acceleratedLoanIds
              : [],
          }
        : defaultInputs.customStrategy,
      existingAssets: (() => {
        if (Array.isArray(parsed.existingAssets) && parsed.existingAssets.length > 0) {
          return (parsed.existingAssets as Record<string, unknown>[]).map((a): ExistingAsset => ({
            id: String(a.id ?? `ast-${Math.random().toString(36).slice(2)}`),
            name: String(a.name ?? "Investment"),
            assetClass: (["equity","gold","ppf","real-estate","fd","other"].includes(String(a.assetClass))
              ? a.assetClass : "equity") as AssetClass,
            currentValue: Number(a.currentValue ?? 0),
            annualReturnPct: Number(a.annualReturnPct ?? 8),
          }));
        }
        // Migrate old single-field to an equity asset entry.
        const legacy = Number(parsed.existingInvestments ?? 0);
        if (legacy > 0) {
          return [{
            id: "ast-legacy-equity",
            name: "Equity / MF",
            assetClass: "equity" as AssetClass,
            currentValue: legacy,
            annualReturnPct: 12,
          }];
        }
        return [];
      })(),
    };
  } catch {
    return null;
  }
}

export function saveInputs(inputs: PlanInputs): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    return true;
  } catch {
    // Storage full, disabled (private mode on some browsers), or blocked by policy.
    return false;
  }
}

export function clearInputs() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
