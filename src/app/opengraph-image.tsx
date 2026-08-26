import { ImageResponse } from "next/og";

export const alt = "NetCorpus India — Retirement & Loan Planner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#0c1a2e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg,#4f46e5,#6366f1)",
              color: "white",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "white" }}>
            NetCorpus India
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "white",
            maxWidth: 920,
          }}
        >
          Plan retirement while paying off your loans.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 900,
          }}
        >
          Free · Private · No signup — home loans, EPF/EPS, SIPs, LTCG tax, all in your browser.
        </div>
      </div>
    ),
    { ...size }
  );
}
