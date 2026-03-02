import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Professor Profile - Only Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let name = "Professor";
  let institution = "";
  let hIndex = 0;
  let citations = 0;
  let works = 0;
  let topics: string[] = [];

  try {
    const res = await fetch(
      `https://api.openalex.org/authors/${id}?mailto=contact@only-research.xyz`,
      { next: { revalidate: 86400 } }
    );
    if (res.ok) {
      const author = await res.json();
      name = author.display_name || "Professor";
      institution = author.last_known_institutions?.[0]?.display_name || "";
      hIndex = author.summary_stats?.h_index || 0;
      citations = author.cited_by_count || 0;
      works = author.works_count || 0;
      topics = (author.topics || []).slice(0, 5).map((t: { display_name: string }) => t.display_name);
    }
  } catch {
    // Use defaults
  }

  function formatNum(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return n.toString();
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Top bar - brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
          >
            <line x1="6" y1="6" x2="18" y2="6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="6" x2="10" y2="18" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="6" x2="10" y2="18" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="6" r="2.5" fill="#60a5fa" />
            <circle cx="18" cy="6" r="2.5" fill="#60a5fa" />
            <circle cx="10" cy="18" r="2.5" fill="#60a5fa" />
          </svg>
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#94a3b8" }}>
            Only Research
          </span>
        </div>

        {/* Professor name */}
        <div
          style={{
            fontSize: "44px",
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>

        {/* Institution */}
        {institution && (
          <div
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              marginBottom: "32px",
            }}
          >
            {institution}
          </div>
        )}

        {/* Metrics row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#fbbf24" }}>
              {hIndex}
            </span>
            <span style={{ fontSize: "14px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              h-index
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#fbbf24" }}>
              {formatNum(citations)}
            </span>
            <span style={{ fontSize: "14px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              citations
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#fbbf24" }}>
              {formatNum(works)}
            </span>
            <span style={{ fontSize: "14px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              works
            </span>
          </div>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {topics.map((topic) => (
              <span
                key={topic}
                style={{
                  fontSize: "14px",
                  color: "#93c5fd",
                  background: "rgba(59, 130, 246, 0.15)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "60px",
            fontSize: "16px",
            color: "#475569",
          }}
        >
          only-research.xyz
        </div>
      </div>
    ),
    { ...size }
  );
}
