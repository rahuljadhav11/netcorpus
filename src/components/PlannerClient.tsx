"use client";

import { useCallback, useEffect, useMemo, useState, useDeferredValue } from "react";
import type { PlanInputs } from "@/lib/types";
import { defaultInputs } from "@/lib/defaults";
import { runProjection, runScenarios } from "@/lib/finance";
import { loadInputs, saveInputs, clearInputs } from "@/lib/storage";
import InputsForm from "./InputsForm";
import ResultsView from "./ResultsView";
import QuickTour from "./QuickTour";

const SAVE_DEBOUNCE_MS = 400;

export default function PlannerClient() {
  const [inputs, setInputs] = useState<PlanInputs>(defaultInputs);
  const [hydrated, setHydrated] = useState(false);
  const [loadedFromSave, setLoadedFromSave] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  // Load persisted data on mount. Until this runs, we render defaults (matching SSR).
  useEffect(() => {
    const stored = loadInputs();
    if (stored) {
      setInputs(stored);
      setLoadedFromSave(true);
    }
    setHydrated(true);
  }, []);

  // Debounced save whenever inputs change (post-hydration only).
  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    const t = window.setTimeout(() => {
      const ok = saveInputs(inputs);
      setSaveState(ok ? "saved" : "failed");
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [inputs, hydrated]);

  const reset = useCallback(() => {
    if (typeof window !== "undefined" && !window.confirm(
      "Reset every field to the sample defaults? Your saved numbers will be cleared from this browser."
    )) {
      return;
    }
    clearInputs();
    setInputs(defaultInputs);
    setLoadedFromSave(false);
    setSaveState("idle");
  }, []);

  const deferred = useDeferredValue(inputs);
  const primary = useMemo(() => runProjection(deferred), [deferred]);
  const scenarios = useMemo(() => runScenarios(deferred), [deferred]);

  return (
    <div className="space-y-4">
      <SaveIndicator
        hydrated={hydrated}
        loadedFromSave={loadedFromSave}
        state={saveState}
        onReset={reset}
      />
      <QuickTour />
      <div className="grid lg:grid-cols-[400px_minmax(0,1fr)] gap-6">
        <div className="min-w-0">
          <InputsForm value={inputs} onChange={setInputs} />
        </div>
        <div className="min-w-0">
          <ResultsView inputs={deferred} result={primary} scenarios={scenarios} />
        </div>
      </div>
    </div>
  );
}

function SaveIndicator({
  hydrated,
  loadedFromSave,
  state,
  onReset,
}: {
  hydrated: boolean;
  loadedFromSave: boolean;
  state: "idle" | "saving" | "saved" | "failed";
  onReset: () => void;
}) {
  // Pre-hydration: keep it minimal so we don't cause a hydration mismatch.
  if (!hydrated) {
    return (
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 no-print">
        <span className="opacity-0">·</span>
      </div>
    );
  }

  const label =
    state === "saving" ? "Saving…"
    : state === "failed" ? "⚠ Could not save (browser blocked storage)"
    : loadedFromSave ? "Your numbers are saved on this device"
    : "New session — start typing to save your numbers on this device";

  const dotCls =
    state === "saving" ? "bg-amber-500"
    : state === "failed" ? "bg-rose-500"
    : loadedFromSave || state === "saved" ? "bg-emerald-500"
    : "bg-slate-300";

  return (
    <div className="flex items-center justify-between gap-3 text-xs no-print">
      <div className="flex items-center gap-2 text-slate-600">
        <span className={`inline-block w-2 h-2 rounded-full ${dotCls}`} />
        <span>{label}</span>
        <span className="hidden sm:inline text-slate-400">· nothing leaves your browser</span>
      </div>
      <button
        onClick={onReset}
        className="text-slate-500 hover:text-rose-600 underline underline-offset-2"
      >
        Reset to defaults
      </button>
    </div>
  );
}
