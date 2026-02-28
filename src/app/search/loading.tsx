// Deterministic widths for skeleton items to avoid Math.random in render
const SIDEBAR_WIDTHS = ["80%", "65%", "90%", "70%", "75%"];
const RESULT_TITLE_WIDTHS = ["55%", "70%", "45%", "60%", "50%", "65%", "40%", "55%"];
const RESULT_SUB_WIDTHS = ["65%", "80%", "55%", "70%", "60%", "75%", "50%", "70%"];
const RESULT_TOPIC_WIDTHS = ["75%", "85%", "65%", "80%", "70%", "90%", "60%", "75%"];

export default function SearchLoading() {
  return (
    <main className="max-w-[52rem] mx-auto px-6 py-6">
      {/* Search bar skeleton */}
      <div className="mb-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex gap-1 mb-3">
            <div className="h-7 w-28 bg-paper-elevated rounded-full animate-pulse" />
            <div className="h-7 w-28 bg-paper-elevated rounded-full animate-pulse" />
          </div>
          <div className="h-12 bg-paper-inset border border-rule rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar skeleton */}
        <aside className="w-44 shrink-0 hidden md:block">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-16 bg-paper-elevated rounded animate-pulse mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: i === 1 ? 5 : 3 }, (_, j) => (
                    <div key={j} className="h-5 bg-paper-elevated rounded animate-pulse" style={{ width: SIDEBAR_WIDTHS[j % SIDEBAR_WIDTHS.length] }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Results skeleton */}
        <div className="flex-1 min-w-0">
          <div className="h-6 w-48 bg-paper-elevated rounded animate-pulse mb-4" />
          <div className="space-y-0">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="py-5 border-b border-rule">
                <div className="flex justify-between items-baseline gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="h-5 bg-paper-elevated rounded animate-pulse mb-2" style={{ width: RESULT_TITLE_WIDTHS[i] }} />
                    <div className="h-4 bg-paper-elevated rounded animate-pulse" style={{ width: RESULT_SUB_WIDTHS[i] }} />
                  </div>
                  <div className="flex gap-5 shrink-0">
                    <div className="h-4 w-10 bg-paper-elevated rounded animate-pulse" />
                    <div className="h-4 w-14 bg-paper-elevated rounded animate-pulse" />
                    <div className="h-4 w-14 bg-paper-elevated rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 bg-paper-elevated rounded animate-pulse mt-2" style={{ width: RESULT_TOPIC_WIDTHS[i] }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
