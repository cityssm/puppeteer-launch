// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-object-injection */

import {
  type InstalledWebBrowser,
  chromeWebBrowserTypes,
  getInstalledWebBrowsers
} from '@cityssm/web-browser-info'
import Debug from 'debug'
import * as puppeteer from 'puppeteer'

const debug = Debug('puppeteer-launch')

const defaultPuppeteerOptions: puppeteer.LaunchOptions = {
  timeout: 60_000
}

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
 * @param {puppeteer.LaunchOptions} options - Optional launch parameters
 * @returns {Promise<puppeteer.Browser>} - A Puppeteer browser instance.
 */
export default async function launch(
  options?: puppeteer.LaunchOptions
): Promise<puppeteer.Browser> {
  const puppeteerOptions = Object.assign({}, defaultPuppeteerOptions, options)

  try {
    return await puppeteer.launch(puppeteerOptions)
  } catch (error) {
    debug('Switching to fallback browsers')

    const fallbackOptions = await loadFallbackBrowsers()

    for (const fallback of fallbackOptions) {
      if (
        (options?.product === 'firefox' && fallback.type !== 'firefox') ||
        (options?.product === 'chrome' &&
          !(chromeWebBrowserTypes as string[]).includes(fallback.type))
      ) {
        continue
      }

      try {
        const browser = await puppeteer.launch(
          Object.assign({}, puppeteerOptions, {
            project: fallback.type === 'firefox' ? 'firefox' : 'chrome',
            executablePath: fallback.command
          })
        )

        debug('Launched browser')
        debug(fallback)

        return browser
      } catch {
        debug(`Error launching browser: ${fallback.command}`)
        // ignore, try the next one
      }
    }

    throw error
  }
}

export * as puppeteer from 'puppeteer'
