import os from 'node:os'
import path from 'node:path'

import {
  type InstalledBrowser,
  Browser,
  getInstalledBrowsers
} from '@puppeteer/browsers'

import { installChromeBrowser, installFirefoxBrowser } from './installers.js'

export const PUPPETEER_CACHE_DIR = path.join(
  os.homedir(),
  '.cache',
  'puppeteer'
)

let installedBrowsers: InstalledBrowser[] = []

export async function refreshInstalledBrowserCache(): Promise<void> {
  installedBrowsers = await getInstalledBrowsers({
    cacheDir: PUPPETEER_CACHE_DIR
  })
}

export async function getCachedChromeBrowser(
  installIfMissing = false
): Promise<InstalledBrowser | undefined> {
  if (installedBrowsers.length === 0) {
    await refreshInstalledBrowserCache()
  }

  const chromeBrowser = installedBrowsers.find(
    (browser) => browser.browser === Browser.CHROME
  )

  if (chromeBrowser === undefined && installIfMissing) {
    await installChromeBrowser()
    await refreshInstalledBrowserCache()
    return await getCachedChromeBrowser(false)
  }

  return chromeBrowser
}

export async function getCachedFirefoxBrowser(
  installIfMissing = false
): Promise<InstalledBrowser | undefined> {
  if (installedBrowsers.length === 0) {
    await refreshInstalledBrowserCache()
  }

  const firefoxBrowser = installedBrowsers.find(
    (browser) => browser.browser === Browser.FIREFOX
  )

  if (firefoxBrowser === undefined && installIfMissing) {
    await installFirefoxBrowser()
    await refreshInstalledBrowserCache()
    return await getCachedFirefoxBrowser(false)
  }

  return firefoxBrowser
}

export async function getCachedBrowser(
  browser: 'chrome' | 'firefox',
  installIfMissing = false
): Promise<InstalledBrowser | undefined> {
  return await (browser === 'chrome'
    ? getCachedChromeBrowser(installIfMissing)
    : getCachedFirefoxBrowser(installIfMissing))
}
