export interface ReferencePageTitleInput {
  title: string;
  siteTitle?: string;
  isLanding: boolean;
}

/**
 * Builds the browser-tab title of a reference page: the page title, then
 * "API Reference" for non-landing pages, then the site title. The site title
 * is dropped when empty or equal to the page title (case-insensitive).
 */
export const referencePageTitle = ({
  title,
  siteTitle,
  isLanding,
}: ReferencePageTitleInput): string => {
  const parts = [title];
  if (!isLanding) parts.push("API Reference");
  const site = (siteTitle ?? "").trim();
  if (site && site.toLowerCase() !== title.trim().toLowerCase()) {
    parts.push(site);
  }
  return parts.join(" | ");
};
