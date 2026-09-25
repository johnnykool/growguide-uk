import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceLibrary from "@/components/ResourceLibrary";
import { RESOURCES } from "@/data/resources";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RESOURCES.map((resource) => ({ slug: resource.id }));
}

function getResource(slug: string) {
  const resource = RESOURCES.find((entry) => entry.id === slug);
  if (!resource) notFound();
  return resource;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = getResource((await params).slug);
  const title = `${resource.subtitle} | ${SITE_NAME}`;
  const path = `/resources/${resource.id}`;
  const preview = resource.editions[0].previews[0];
  const imageUrl = `${SITE_URL}${preview.src}`;

  return {
    title,
    description: resource.description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: resource.description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      images: [{ url: imageUrl, width: preview.width, height: preview.height, alt: preview.alt }],
    },
    twitter: { card: "summary_large_image", title, description: resource.description, images: [imageUrl] },
  };
}

export default async function ResourcePage({ params }: Props) {
  const resource = getResource((await params).slug);
  return <ResourceLibrary resourceId={resource.id} />;
}
