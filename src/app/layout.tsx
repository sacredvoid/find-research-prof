import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://researchprof.com";
const SITE_NAME = "ResearchProf";
const SITE_DESCRIPTION =
  "Search any research topic and instantly find professors working in that field. View their papers, citations, h-index, collaboration networks, and direct links — all in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ResearchProf — Find Professors by Research Topic",
    template: "%s — ResearchProf",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "find professors",
    "research topic search",
    "academic advisor",
    "PhD advisor finder",
    "research assistantship",
    "professor search engine",
    "collaboration network",
    "h-index lookup",
    "OpenAlex",
    "academic search",
    "find researchers",
    "research lab finder",
  ],
  authors: [{ name: "Samanvya Tripathi" }],
  creator: "Samanvya Tripathi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "ResearchProf — Find Professors by Research Topic",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "ResearchProf — Find Professors by Research Topic",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}&type=topic`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-paper text-ink`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
