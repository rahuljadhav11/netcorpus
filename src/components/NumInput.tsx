"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Numeric text input with sane UX for financial data:
 *  - `type="text"` + `inputMode="decimal"` so we can control display fully.
 *  - Local `text` state lets the field show "" while editing without the
 *    parent value bouncing back to "0" and getting prefixed onto new input.
 *  - Select-all on focus lets users overwrite a value with a single keypress.
 *  - Value prop only overrides local text when the input is NOT focused, so
 *    external updates (e.g. expense breakdown → monthlyExpense) don't fight
 *    the user's typing.
 */
interface Props {
  value: number;
  onChange: (v: number) => void;
  rupee?: boolean;
  className?: string;
  compact?: boolean;
  alignRight?: boolean;
  ariaLabel?: string;
}

export default function NumInput({
  value,
  onChange,
  rupee = false,
  className = "",
  compact = false,
  alignRight = false,
  ariaLabel,
}: Props) {
  const editing = useRef(false);
  const [text, setText] = useState<string>(() =>
    Number.isFinite(value) ? String(value) : "0",
  );

  useEffect(() => {
    if (editing.current) return;
    const next = Number.isFinite(value) ? String(value) : "0";
    if (next !== text) setText(next);
    // We intentionally sync only when the *external* value changes and the
    // user isn't in the middle of editing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const propagate = (raw: string) => {
    if (raw === "" || raw === "-" || raw === "." || raw === "-.") {
      onChange(0);
      return;
    }
    const n = parseFloat(raw);
    if (!isNaN(n) && isFinite(n)) onChange(n);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Accept partial numeric input: "", ".", "-", "1.", "1.2", etc.
    if (raw === "" || /^-?\d*\.?\d*$/.test(raw)) {
      setText(raw);
      propagate(raw);
    }
  };

  const base = compact
    ? "w-full rounded-md border border-slate-300 bg-white py-1.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition tabular-nums"
    : "w-full rounded-md border border-slate-300 bg-white py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition tabular-nums";
  const padLeft = rupee ? "pl-9" : "pl-3";
  const padRight = "pr-3";
  const align = alignRight ? "text-right" : "";

  // Live abbreviation for rupee inputs: shows "≈ ₹1.50 L" / "₹1.20 Cr" once
  // the entered amount crosses ₹1,000, so users can sight-check big numbers.
  const preview = (() => {
    if (!rupee) return null;
    const n = parseFloat(text);
    if (!isFinite(n) || Math.abs(n) < 1000) return null;
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    let label = "";
    if (abs >= 1e7) label = `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
    else if (abs >= 1e5) label = `${sign}₹${(abs / 1e5).toFixed(2)} L`;
    else label = `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
    return label;
  })();

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {rupee && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none select-none">
            ₹
          </span>
        )}
        <input
          aria-label={ariaLabel}
          className={`${base} ${padLeft} ${padRight} ${align}`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onFocus={(e) => {
            editing.current = true;
            // Select all so user can overwrite with a single keystroke.
            requestAnimationFrame(() => e.target.select());
          }}
          onBlur={() => {
            editing.current = false;
            const n = parseFloat(text);
            setText(isNaN(n) ? "0" : String(n));
          }}
          onChange={handleChange}
        />
      </div>
      {preview && (
        <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums select-none">
          ≈ {preview}
        </div>
      )}
    </div>
  );
}
