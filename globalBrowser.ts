import { Sema as Semaphore } from 'async-sema'
import Debug from 'debug'
import exitHook from 'exit-hook'
import type { Browser } from 'puppeteer'

import { DEBUG_NAMESPACE } from './debug.config.js'
import launch, { type LaunchOptionsWithBrowserOrder } from './index.js'

const debug = Debug(`${DEBUG_NAMESPACE}:globalBrowser`)

/**
 * A singleton class that manages a global Puppeteer browser instance.
 * It ensures that only one browser instance is active at a time.
 * The browser instance will automatically close after a specified idle time.
 */
export class GlobalBrowser {
  #browser: Browser | undefined

  readonly #browserOptions: LaunchOptionsWithBrowserOrder
  readonly #idleMillis: number
  #idleTimeout: NodeJS.Timeout | undefined
  readonly #semaphore: Semaphore

  /**
   * Creates a new instance of the GlobalBrowser class.
   * @param browserOptions - Optional launch parameters for the Puppeteer browser.
   * @param idleMillis - The time in milliseconds after which the browser will automatically close if idle.
   * Defaults to 60,000 ms (1 minute).
   */
  constructor(
    browserOptions: LaunchOptionsWithBrowserOrder = {},
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    idleMillis = 60_000
  ) {
    this.#browserOptions = browserOptions
    this.#idleMillis = idleMillis
    this.#semaphore = new Semaphore(1)

    exitHook(() => {
      void this.closeBrowser()
    })
  }

  /**
   * Closes the global Puppeteer browser instance if open.
   */
  async closeBrowser(): Promise<void> {
    debug('Closing browser instance')

    if (this.#browser !== undefined) {
      await this.#browser.close()
      this.#browser = undefined
    }
  }

  /**
   * Acquires the global Puppeteer browser instance.
   * If the browser is not already open, it will launch a new instance.
   * The caller must release the browser when done.
   * @param wait - Whether to wait for the browser to become available if in use. Defaults to `true`.
   * @returns The global Puppeteer browser instance.
   */
  async getBrowser(wait = true): Promise<Browser> {
    debug('Attempting to get a browser instance (wait=%s)', wait)

    if (wait) {
      await this.#semaphore.acquire()
    } else if (this.#semaphore.tryAcquire() === undefined) {
      throw new Error('Browser is currently in use')
    }

    debug('Acquired semaphore for browser instance')

    if (this.#idleTimeout !== undefined) {
      clearTimeout(this.#idleTimeout)
      this.#idleTimeout = undefined
    }

    if (this.#browser === undefined) {
      this.#browser = await launch(this.#browserOptions)
    }

    return this.#browser
  }

  /**
   * Releases the global Puppeteer browser instance.
   */
  async releaseBrowser(): Promise<void> {
    debug('Releasing browser instance')

    if (this.#browser !== undefined) {
      const newPage = await this.#browser.newPage()

      for (const page of await this.#browser.pages()) {
        try {
          if (page !== newPage) {
            // eslint-disable-next-line no-await-in-loop
            await page.close()
          }
        } catch {}
      }
    }

    this.#idleTimeout = setTimeout(() => {
      void this.closeBrowser()
    }, this.#idleMillis)

    this.#semaphore.release()
  }
}
