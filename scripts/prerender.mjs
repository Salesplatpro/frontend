import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, writeFileSync } from 'fs'

import puppeteer from 'puppeteer'
import { preview } from 'vite'

import { marketingRoutes } from './prerender-routes.mjs'

const distDir = resolve(fileURLToPath(import.meta.url), '../../dist')

async function main() {
  const server = await preview({
    preview: { port: 4321, strictPort: true },
  })
  const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '')

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let hadFailure = false

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
      hadFailure = true
      console.error(`Failed to prerender ${route}:`, err)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  await server.close()

  if (hadFailure) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
