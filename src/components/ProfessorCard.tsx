import Link from "next/link";
import { Professor } from "@/types";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export default function ProfessorCard({ professor }: { professor: Professor }) {
  return (
    <Link
      href={`/professor/${professor.id}`}
      className="block border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {professor.name}
          </h3>
          <p className="text-gray-600 text-sm mt-0.5">
            {professor.institution}
            {professor.country && ` — ${professor.country}`}
          </p>
          {professor.department && (
            <p className="text-gray-500 text-xs mt-0.5">{professor.department}</p>
          )}
        </div>
        <div className="flex gap-4 text-sm text-gray-500 shrink-0">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{professor.hIndex}</div>
            <div className="text-xs">h-index</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{formatNumber(professor.citedByCount)}</div>
            <div className="text-xs">citations</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{formatNumber(professor.worksCount)}</div>
            <div className="text-xs">works</div>
          </div>
        </div>
      </div>
      {professor.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {professor.topics.map((topic) => (
            <span
              key={topic.id}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {topic.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
