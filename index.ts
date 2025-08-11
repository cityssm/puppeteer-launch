import Debug from 'debug'
import {
  type Browser,
  type LaunchOptions,
  launch as puppeteerLaunch
} from 'puppeteer'

import { DEBUG_NAMESPACE } from './debug.config.js'
import { getUserChromePath, getUserFirefoxPath } from './user.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

type RetryBrowser = 'chrome-user' | 'chrome' | 'firefox-user' | 'firefox'

export const browserOrderDefault = [
  'chrome',
  'firefox',
  'chrome-user',
  'firefox-user'
] as RetryBrowser[]

/**
 * Launches a Puppeteer browser instance.
 * Automatically falls back to a system browser if no browser is available in the Puppeteer cache.
 * @param options - Optional launch parameters
 * @returns - A Puppeteer browser instance.
 */
export default async function launch(
  options: LaunchOptions & { browserOrder?: RetryBrowser[] } = {}
): Promise<Browser> {
  /*
   * Set default Puppeteer options
   */

  const puppeteerOptions: LaunchOptions = {
    headless: true,
    timeout: 60_000,
    ...options
  }

  /*
   * Set browser order
   */

  let browserOrder = options.browserOrder

  if (browserOrder === undefined) {
    if (puppeteerOptions.browser === 'firefox') {
      browserOrder = ['firefox', 'firefox-user']
    } else if (puppeteerOptions.browser === 'chrome') {
      browserOrder = ['chrome', 'chrome-user']
    } else {
      browserOrder = browserOrderDefault
    }
  }

  /*
   * If no browser is specified, try to load one from the browser order
   */

  if (puppeteerOptions.browser === undefined && browserOrder.length > 0) {
    const browserToLoad = browserOrder.shift()

    debug(`Loading browser: ${browserToLoad}`)

    if (browserToLoad === 'firefox-user') {
      const firefoxPath = await getUserFirefoxPath()
      if (firefoxPath !== undefined) {
        puppeteerOptions.executablePath = firefoxPath
      }
      puppeteerOptions.browser = 'firefox'
    } else if (browserToLoad === 'chrome-user') {
      const chromePath = await getUserChromePath()
      if (chromePath !== undefined) {
        puppeteerOptions.executablePath = chromePath
      }
      puppeteerOptions.browser = 'chrome'
    } else {
      puppeteerOptions.browser = browserToLoad
    }
  }

  /*
   * Attempt to launch the browser
   */

  try {
    debug(`Attempting to launch browser: ${JSON.stringify(puppeteerOptions)}`)

    const browser = await puppeteerLaunch(puppeteerOptions)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (browser === undefined) {
      throw new Error('Puppeteer browser is undefined')
    }

    debug('Launched puppeteer browser')

    return browser
  } catch (error) {
    // debug(`Error launching browser: ${error}`)

    if (browserOrder.length > 0) {
      puppeteerOptions.browser = undefined
      return await launch({
        ...puppeteerOptions,
        browserOrder
      })
    }

    throw error
  }
}

export * as puppeteer from 'puppeteer'

export { installChromeBrowser, installFirefoxBrowser } from './installers.js'
