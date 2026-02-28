import type { Metadata } from "next";
import { Suspense } from "react";
import ExplorePageClient from "@/components/ExplorePageClient";

export const metadata: Metadata = {
  title: "Explore Research Networks",
  description:
    "Visualize research collaboration networks in 3D. Search a topic to see how top researchers connect, or search an author to map their co-author network. Interactive force-directed graph powered by OpenAlex data.",
  openGraph: {
    title: "Explore Research Networks — ResearchProf",
    description:
      "Interactive 3D visualization of research collaboration networks. Discover how researchers connect across fields and institutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Research Networks — ResearchProf",
    description:
      "Interactive 3D visualization of research collaboration networks.",
  },
  alternates: {
    canonical: "/explore",
  },
};

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <main className="h-[calc(100vh-49px)] flex items-center justify-center text-ink-tertiary text-sm">
        Loading explorer...
      </main>
    }>
      <ExplorePageClient />
    </Suspense>
  );
}
