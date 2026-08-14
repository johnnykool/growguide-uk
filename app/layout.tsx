import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteAnalytics from "@/components/SiteAnalytics";
import SiteStructuredData from "@/components/SiteStructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const DESIGN_DIRECTION_CONTRACT = `<!--
THESIS: Local weather visibly bends advice toward the plants and tasks it changes; this refuses the category-default photo hero and sprout-card dashboard.
OWN-WORLD: Garden ground, pale mineral, sky blue, ember coral, moss veil, black-flower anchors, rainline GG paths, matte panels, fine borders, and one workhorse sans.
STORY: A UK grower sees their place and forecast, understands what needs doing now, then checks their plot and season without an account or extra data.
FIRST VIEWPORT: Compact Rainline GG shell; dark forecast ribbon; 60/40 pale working canvas with factual plot profile left and short actions right; seasonal timeline below; advice action stays inside the actions panel.
FORM: Rain to Action, third approved composition; seed 6b059f98.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/brand/growguide-social.png",
        width: 1200,
        height: 630,
        alt: "Weather paths flow into GrowGuide UK actions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/brand/growguide-social.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body
        className={`${figtree.variable} flex min-h-screen flex-col font-sans`}
      >
        <template
          data-design-direction="gravity-rain"
          dangerouslySetInnerHTML={{ __html: DESIGN_DIRECTION_CONTRACT }}
        />
        <SiteStructuredData />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <SiteAnalytics />
      </body>
    </html>
  );
}
