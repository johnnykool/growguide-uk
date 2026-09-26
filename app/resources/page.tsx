import type { Metadata } from "next";
import ResourceLibrary from "@/components/ResourceLibrary";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = `Free growing resources | ${SITE_NAME}`;
const description = "Free printable guides for your UK garden: autumn plot clearing, winter soil care, tools and greenhouse cleaning, vegetable storage, seed care and growing plans.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resources" },
  openGraph: { title, description, url: `${SITE_URL}/resources` },
  twitter: { title, description, card: "summary_large_image" },
};

export default function ResourcesPage() {
  return <ResourceLibrary />;
}
