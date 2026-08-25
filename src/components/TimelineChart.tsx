"use client";

import { useState } from "react";
import type { ProjectionResult } from "@/lib/types";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { inr } from "@/lib/finance";

interface Props {
  result: ProjectionResult;
}

export default function TimelineChart({ result }: Props) {
  const [showOtherAssets, setShowOtherAssets] = useState(false);

  const data = result.yearly.map((y) => ({
    age: Math.round(y.age),
    corpus: Math.round(y.totalCorpus),
    loans: Math.round(y.totalLoanBalance),
    epf: Math.round(y.epfBalance),
    sip: Math.round(y.sipBalance),
    otherAssets: Math.round(y.otherAssetsBalance),
  }));
  const hasOtherAssets = data.some((d) => d.otherAssets > 0);

  return (
    <div>
      {hasOtherAssets && (
        <label className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOtherAssets}
            onChange={(e) => setShowOtherAssets(e.target.checked)}
            className="accent-amber-500"
          />
          Show other assets
        </label>
      )}
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="corpusFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3f8c6f" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3f8c6f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="age" tick={{ fontSize: 12 }} label={{ value: "Age", position: "insideBottom", offset: -2, style: { fontSize: 11, fill: "#64748b" } }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => inr(v as number)} width={70} />
            <Tooltip
              formatter={(value: number, name: string) => [inr(value), labelFor(name)]}
              labelFormatter={(l) => `Age ${l}`}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="corpus" name="Equity corpus" stroke="#2f6f57" fill="url(#corpusFill)" strokeWidth={2} />
            <Line type="monotone" dataKey="sip" name="SIP" stroke="#0ea5e9" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="epf" name="EPF" stroke="#8b5cf6" dot={false} strokeWidth={1.5} />
            {showOtherAssets && <Line type="monotone" dataKey="otherAssets" name="Other assets" stroke="#f59e0b" dot={false} strokeWidth={1.5} strokeDasharray="4 3" />}
            <Line type="monotone" dataKey="loans" name="Loan balance" stroke="#dc2626" dot={false} strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function labelFor(name: string) {
  const map: Record<string, string> = {
    corpus: "Equity corpus",
    sip: "SIP",
    epf: "EPF",
    otherAssets: "Other assets",
    loans: "Loan balance",
  };
  return map[name] ?? name;
}
