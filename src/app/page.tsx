import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const EXAMPLE_SEARCHES = [
  "Computational Neuroscience",
  "Machine Learning",
  "Climate Change",
  "Quantum Computing",
  "Gene Therapy",
  "Behavioral Economics",
  "Robotics",
  "Astrophysics",
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-57px)]">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find professors by research topic
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Search any research area and discover professors worldwide — their
            papers, citations, institutions, and direct links, all in one place.
          </p>
        </div>

        <SearchBar />

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400 mb-3">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_SEARCHES.map((topic) => (
              <Link
                key={topic}
                href={`/search?q=${encodeURIComponent(topic)}&type=topic`}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">240M+</div>
              <div className="text-sm text-gray-500">Academic works indexed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Global</div>
              <div className="text-sm text-gray-500">
                Professors from every country
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Free</div>
              <div className="text-sm text-gray-500">
                No login required, open data
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
          Data from{" "}
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            OpenAlex
          </a>{" "}
          (CC0 license). ResearchProf is not affiliated with any university.
        </div>
      </footer>
    </main>
  );
}
