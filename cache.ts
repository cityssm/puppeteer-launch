import os from 'node:os'
import path from 'node:path'

import {
  type InstalledBrowser,
  Browser,
  getInstalledBrowsers
} from '@puppeteer/browsers'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import { installChromeBrowser, installFirefoxBrowser } from './installers.js'

const debug = Debug(`${DEBUG_NAMESPACE}:cache`)

export const PUPPETEER_CACHE_DIR = path.join(
  os.homedir(),
  '.cache',
  'puppeteer'
)

let installedBrowsers: InstalledBrowser[] = []

/**
 * Refreshes the cache of installed browsers by re-querying the Puppeteer cache directory.
 * @returns A promise that resolves to the updated list of installed browsers.
 */
export async function refreshInstalledBrowserCache(): Promise<
  InstalledBrowser[]
> {
  installedBrowsers = await getInstalledBrowsers({
    cacheDir: PUPPETEER_CACHE_DIR
  })

  debug('Refreshed installed browser cache: %O', installedBrowsers)

  return installedBrowsers
}

/**
 * Retrieves the cached Chrome browser from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param installIfMissing - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached Chrome browser, or undefined if not found and not installed.
 */
export async function getCachedChromeBrowser(
  installIfMissing = false
): Promise<InstalledBrowser | undefined> {
  if (installedBrowsers.length === 0) {
    await refreshInstalledBrowserCache()
  }

  const chromeBrowser = installedBrowsers.findLast(
    (browser) => browser.browser === Browser.CHROME
  )

  if (chromeBrowser === undefined && installIfMissing) {
    await installChromeBrowser()
    await refreshInstalledBrowserCache()
    return await getCachedChromeBrowser(false)
  }

  return chromeBrowser
}

/**
 * Retrieves the cached Firefox browser from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param installIfMissing - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached Firefox browser, or undefined if not found and not installed.
 */
export async function getCachedFirefoxBrowser(
  installIfMissing = false
): Promise<InstalledBrowser | undefined> {
  if (installedBrowsers.length === 0) {
    await refreshInstalledBrowserCache()
  }

  const firefoxBrowser = installedBrowsers.findLast(
    (browser) => browser.browser === Browser.FIREFOX
  )

  if (firefoxBrowser === undefined && installIfMissing) {
    await installFirefoxBrowser()
    await refreshInstalledBrowserCache()
    return await getCachedFirefoxBrowser(false)
  }

  return firefoxBrowser
}

/**
 * Retrieves the cached browser for the specified browser type from the Puppeteer cache.
 * If the browser is not found and `installIfMissing` is true, it will attempt to install the browser and refresh the cache before trying again.
 * @param browser - The browser type to retrieve ('chrome' or 'firefox').
 * @param installIfMissing - Whether to install the browser if not found in the cache. Defaults to false.
 * @returns A promise that resolves to the cached browser, or undefined if not found and not installed.
 */
export async function getCachedBrowser(
  browser: 'chrome' | 'firefox',
  installIfMissing = false
): Promise<InstalledBrowser | undefined> {
  return await (browser === 'chrome'
    ? getCachedChromeBrowser(installIfMissing)
    : getCachedFirefoxBrowser(installIfMissing))
}
