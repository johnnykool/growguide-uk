import type { Metadata } from "next";
import ResourceLibrary from "@/components/ResourceLibrary";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = `Free growing resources | ${SITE_NAME}`;
const description = "Preview and download free printable resources for your UK garden. Explore our growing calendar, crop rotation, companion planting, vegetable storage and seed care guides.";

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
