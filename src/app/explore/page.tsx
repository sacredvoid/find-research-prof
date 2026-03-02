import type { Metadata } from "next";
import { Suspense } from "react";
import ExplorePageClient from "@/components/ExplorePageClient";

export const metadata: Metadata = {
  title: "Explore Research Networks",
  description:
    "Visualize research collaboration networks in 3D on Only Research. Search a topic to see how top researchers connect, or search an author to map their co-author network. Interactive force-directed graph powered by OpenAlex data covering 240M+ academic works.",
  openGraph: {
    title: "Explore Research Networks — Only Research",
    description:
      "Interactive 3D visualization of research collaboration networks on Only Research. Discover how researchers connect across fields and institutions, expand nodes to find new collaborators, and explore the global academic graph.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Research Networks — Only Research",
    description:
      "Interactive 3D visualization of research collaboration networks. Discover how researchers connect across fields and institutions, expand nodes to find new collaborators.",
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
