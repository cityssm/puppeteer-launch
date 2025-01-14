import {
  type InstalledWebBrowser,
  chromeWebBrowserTypes,
  getInstalledWebBrowsers
} from '@cityssm/web-browser-info'
import Debug from 'debug'
import {
  type Browser,
  type LaunchOptions,
  launch as puppeteerLaunch
} from 'puppeteer'

import { DEBUG_NAMESPACE } from './debug.config.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

let installedWebBrowsers: InstalledWebBrowser[] = []

async function loadFallbackBrowsers(): Promise<InstalledWebBrowser[]> {
  if (installedWebBrowsers.length === 0) {
    const tempInstalledWebBrowsers: InstalledWebBrowser[] = []

    /*
     * Load Chrome first
     */

    const fallbackChromeBrowsers = await getInstalledWebBrowsers(
      chromeWebBrowserTypes,
      110
    )
    tempInstalledWebBrowsers.push(...fallbackChromeBrowsers)

    /*
     * Load Firefox
     */

    const fallbackFirefoxBrowsers = await getInstalledWebBrowsers('firefox')
    tempInstalledWebBrowsers.push(...fallbackFirefoxBrowsers)

    installedWebBrowsers = tempInstalledWebBrowsers

    if (tempInstalledWebBrowsers.length === 0) {
      throw new Error('No fallback system browsers available.')
    } else {
      debug('Available fallback browsers:')
      debug(tempInstalledWebBrowsers)
    }
  }

  return installedWebBrowsers
}

/**
 * Launches a Puppeteer browser instance.
 * Automatically falls back to a system browser if no browser is available in the Puppeteer cache.
 * @param options - Optional launch parameters
 * @returns - A Puppeteer browser instance.
 */
export default async function launch(
  options: LaunchOptions = {}
): Promise<Browser> {
  const puppeteerOptions: LaunchOptions = {
    timeout: 60_000,
    protocol: 'webDriverBiDi',
    headless: true,
    ...options
  }

  try {
    debug(`Attempting to launch browser: ${JSON.stringify(puppeteerOptions)}`)

    const browser = await puppeteerLaunch(puppeteerOptions)

    // eslint-disable-next-line sonarjs/different-types-comparison, @typescript-eslint/no-unnecessary-condition
    if (browser === undefined) {
      throw new Error('Puppeteer browser is undefined')
    }

    debug('Launched puppeteer browser')

    return browser
  } catch (error) {
    debug('Switching to fallback browsers')

    const fallbackOptions = await loadFallbackBrowsers()

    for (const fallback of fallbackOptions) {
      if (
        (options.browser === 'firefox' && fallback.type !== 'firefox') ||
        (options.browser === 'chrome' &&
          !(chromeWebBrowserTypes as string[]).includes(fallback.type))
      ) {
        continue
      }

      try {
        const fallbackPuppeteerOptions: LaunchOptions = {
          ...puppeteerOptions,

          browser: fallback.type === 'firefox' ? 'firefox' : 'chrome',
          executablePath: fallback.command
        }

        debug(
          `Attempting to launch fallback browser: ${JSON.stringify(
            fallbackPuppeteerOptions
          )}`
        )

        const browser = await puppeteerLaunch(fallbackPuppeteerOptions)

        debug('Launched fallback browser')
        debug(fallback)

        return browser
      } catch {
        debug(`Error launching browser: ${fallback.command}`)
        // ignore, try the next one
      }
    }

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error
  }
}

export * as puppeteer from 'puppeteer'
