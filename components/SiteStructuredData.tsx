import { SITE_STRUCTURED_DATA } from "@/lib/site";

export default function SiteStructuredData() {
  const json = JSON.stringify(SITE_STRUCTURED_DATA).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
