/**
 * Single source of truth for the deployed origin. Set NEXT_PUBLIC_SITE_URL
 * once a real domain is live — sitemap.ts, robots.ts, layout.tsx metadataBase,
 * and every page's canonical URL all read from this.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://netcorpus.in";
