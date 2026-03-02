import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My List",
  description: "Your saved professors on Only Research. Track outreach status, add private notes, compare candidates side by side, and export your shortlist to CSV for offline tracking.",
  openGraph: {
    title: "My List | Only Research",
    description: "Save and track professors you're interested in. Add notes, track email status, and compare candidates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "My List | Only Research",
    description: "Save and track professors you're interested in. Add notes, track email status, and compare candidates.",
  },
  alternates: {
    canonical: "/my-list",
  },
};

export default function MyListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
