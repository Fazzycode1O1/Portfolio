import { siteConfig } from "@/config/site";

/** JSON-LD structured data — server-rendered as a <script type=application/ld+json>. */
export function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      jobTitle: siteConfig.author.role,
      url: siteConfig.url,
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.twitter],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/projects?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
