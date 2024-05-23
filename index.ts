// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-object-injection */

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

const debug = Debug('puppeteer-launch:index')

const defaultPuppeteerOptions: LaunchOptions = {
  timeout: 60_000,
  protocol: 'webDriverBiDi'
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
 * @param {LaunchOptions} options - Optional launch parameters
 * @returns {Promise<Browser>} - A Puppeteer browser instance.
 */
export default async function launch(
  options?: LaunchOptions
): Promise<Browser> {
  const puppeteerOptions = Object.assign({}, defaultPuppeteerOptions, options)

  try {
    debug(`Attempting to launch browser: ${JSON.stringify(puppeteerOptions)}`)

    const browser = await puppeteerLaunch(puppeteerOptions)

    if (browser === undefined) {
      throw new Error()
    }

    debug('Launched puppeteer browser')

    return browser
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
        const fallbackPuppeteerOptions = Object.assign({}, puppeteerOptions, {
          project: fallback.type === 'firefox' ? 'firefox' : 'chrome',
          executablePath: fallback.command
        })

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

    throw error
  }
}

export * as puppeteer from 'puppeteer'
