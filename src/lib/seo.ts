/**
 * Single source of truth for the deployed origin. Must match Vercel's actual
 * Production Domain exactly (check `vercel project inspect` / the dashboard) —
 * the apex netcorpus.in 308-redirects here, so declaring the apex as canonical
 * would tell crawlers a URL is canonical when it isn't even the final,
 * resolvable address. sitemap.ts, robots.ts, layout.tsx metadataBase, and
 * every page's canonical URL all read from this.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netcorpus.in";
