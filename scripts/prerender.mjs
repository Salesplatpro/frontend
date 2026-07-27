import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, writeFileSync } from 'fs'

import { preview } from 'vite'

import { marketingRoutes } from './prerender-routes.mjs'

const distDir = resolve(fileURLToPath(import.meta.url), '../../dist')

// Vercel's build container is missing the shared libraries (libnspr4,
// libnss3, etc.) that puppeteer's own bundled Chromium needs, so on Vercel
// we launch @sparticuz/chromium instead, which is built for exactly this
// kind of restricted serverless/build environment. Locally, plain puppeteer
// (with its own bundled, host-appropriate Chromium) is simpler and faster.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const { default: chromium } = await import('@sparticuz/chromium')
    const { default: puppeteerCore } = await import('puppeteer-core')
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }

  const { default: puppeteer } = await import('puppeteer')
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}

async function main() {
  const server = await preview({
    preview: { port: 4321, strictPort: true },
  })
  const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '')

  const browser = await launchBrowser()

  for (const route of marketingRoutes) {
    const page = await browser.newPage()
    try {
      await page.goto(`${baseUrl}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })
      await page.waitForSelector('[data-testid="app-page"]', {
        timeout: 10000,
      })
      const html = await page.content()

      const outPath =
        route === '/'
          ? resolve(distDir, 'index.html')
          : resolve(distDir, route.slice(1), 'index.html')
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, html)
      console.log(`Prerendered ${route} -> ${outPath}`)
    } catch (err) {
      // A route failing to prerender (e.g. a live API call it depends on is
      // slow) shouldn't block deploying the rest of the site — the route
      // still renders fine client-side at runtime, it just misses this
      // deploy's static SEO snapshot.
      console.error(`Failed to prerender ${route}:`, err)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  await server.close()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
