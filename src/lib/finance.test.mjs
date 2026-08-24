// Ad-hoc sanity checks (run manually with `node --experimental-strip-types src/lib/finance.test.mjs`
// or by transpiling; kept lightweight — no test runner dependency).
// This file is not imported by the app.
import { retirementCorpusNeeded, runProjection, runScenarios } from "./finance.ts";
import { defaultInputs } from "./defaults.ts";

const c = retirementCorpusNeeded({
  monthlyExpenseAtRetirement: 100000,
  annualInflationPct: 6,
  postRetirementReturnPct: 7,
  yearsInRetirement: 30,
});
console.log("PV needed:", c);

const proj = runProjection(defaultInputs);
console.log("debt-free month:", proj.debtFreeMonthIndex);
console.log("corpus at retirement:", proj.corpusAtRetirement);
console.log("target corpus:", proj.targetCorpus);
console.log("surplus/shortfall:", proj.surplusOrShortfall);

const scenarios = runScenarios(defaultInputs);
for (const s of scenarios) {
  console.log(s.label, "→ corpus:", s.result.corpusAtRetirement, "debt-free at month:", s.result.debtFreeMonthIndex);
}
