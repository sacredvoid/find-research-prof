import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Only Research - Find Professors by Research Topic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {/* Network nodes icon */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
          >
            <line x1="6" y1="6" x2="18" y2="6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="6" x2="10" y2="18" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="6" x2="10" y2="18" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="18" x2="20" y2="16" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="6" r="3" fill="#60a5fa" />
            <circle cx="18" cy="6" r="3" fill="#60a5fa" />
            <circle cx="10" cy="18" r="3" fill="#60a5fa" />
            <circle cx="20" cy="16" r="2.5" fill="#60a5fa" opacity="0.6" />
          </svg>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            Only Research
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#94a3b8",
            marginBottom: "16px",
          }}
        >
          Find the right researcher, faster.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "18px",
            color: "#64748b",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          Search 240M+ academic works across every field and country
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "16px",
            color: "#475569",
            letterSpacing: "0.05em",
          }}
        >
          only-research.xyz
        </div>
      </div>
    ),
    { ...size }
  );
}
