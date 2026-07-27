import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { marketingRoutes, SITE_ORIGIN } from './prerender-routes.mjs'

const distDir = resolve(fileURLToPath(import.meta.url), '../../dist')

const urls = marketingRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_ORIGIN}${route}</loc>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap)
console.log(`Wrote sitemap.xml with ${marketingRoutes.length} routes`)
