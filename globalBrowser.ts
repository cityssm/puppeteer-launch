import { Sema as Semaphore } from 'async-sema'
import Debug from 'debug'
import exitHook from 'exit-hook'
import type { Browser } from 'puppeteer'

import { DEBUG_NAMESPACE } from './debug.config.js'
import launch, { type LaunchOptionsWithBrowserOrder } from './index.js'

const debug = Debug(`${DEBUG_NAMESPACE}:globalBrowser`)

export class GlobalBrowser {
  #browser: Browser | undefined

  readonly #browserOptions: LaunchOptionsWithBrowserOrder
  readonly #idleMillis: number
  #idleTimeout: NodeJS.Timeout | undefined
  readonly #semaphore: Semaphore

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

  async closeBrowser(): Promise<void> {
    debug('Closing browser instance')
    if (this.#browser !== undefined) {
      await this.#browser.close()
      this.#browser = undefined
    }
  }

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
