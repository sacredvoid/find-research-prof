import Link from "next/link";
import { Professor } from "@/types";
import { formatNumber } from "@/lib/utils";
import SaveButton from "@/components/SaveButton";

function isActiveResearcher(updatedDate: string): boolean {
  if (!updatedDate) return false;
  const updated = new Date(updatedDate);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  return updated > twoYearsAgo;
}

export default function ProfessorCard({ professor }: { professor: Professor }) {
  const active = isActiveResearcher(professor.updatedDate);

  return (
    <div className="group relative py-5 border-b border-rule hover:bg-accent-bg transition-all -mx-3 px-3 rounded-md">
      <Link href={`/professor/${professor.id}`} className="block">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-6">
          <div className="min-w-0 pr-8">
            <h3 className="font-semibold text-ink tracking-tight text-[1.05rem] leading-snug group-hover:text-accent transition-colors">
              {professor.name}
              {active && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[0.65rem] font-medium bg-oa-bg text-oa align-middle">
                  Active
                </span>
              )}
            </h3>
            <p className="text-ink-secondary text-sm mt-0.5">
              {professor.institution}
              {professor.country && (
                <span className="text-ink-tertiary"> — {professor.country}</span>
              )}
              {professor.department && (
                <span className="text-ink-tertiary"> · {professor.department}</span>
              )}
            </p>
          </div>
          <div className="flex gap-3 sm:gap-5 shrink-0 font-mono text-sm tabular-nums">
            <span className="text-gold" title="h-index">
              h {professor.hIndex}
            </span>
            <span className="text-gold" title="Citations">
              {formatNumber(professor.citedByCount)}
              <span className="text-ink-tertiary ml-0.5 font-sans text-xs">cited</span>
            </span>
            <span className="text-gold" title="Works">
              {formatNumber(professor.worksCount)}
              <span className="text-ink-tertiary ml-0.5 font-sans text-xs">works</span>
            </span>
          </div>
        </div>
        {professor.topics.length > 0 && (
          <p className="mt-2 text-sm text-ink-tertiary leading-relaxed">
            {professor.topics.map((t, i) => (
              <span key={t.id}>
                {i > 0 && ", "}
                <span className="text-ink-secondary">{t.name}</span>
              </span>
            ))}
          </p>
        )}
      </Link>
      <div className="absolute top-5 right-3">
        <SaveButton professor={professor} size="small" />
      </div>
    </div>
  );
}
