import { Sema as Semaphore } from 'async-sema';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { DEBUG_NAMESPACE } from './debug.config.js';
import launch from './index.js';
const debug = Debug(`${DEBUG_NAMESPACE}:globalBrowser`);
export class GlobalBrowser {
    #browser;
    #browserOptions;
    #idleMillis;
    #idleTimeout;
    #semaphore;
    constructor(browserOptions = {}, idleMillis = 60_000) {
        this.#browserOptions = browserOptions;
        this.#idleMillis = idleMillis;
        this.#semaphore = new Semaphore(1);
        exitHook(() => {
            void this.closeBrowser();
        });
    }
    async closeBrowser() {
        debug('Closing browser instance');
        if (this.#browser !== undefined) {
            await this.#browser.close();
            this.#browser = undefined;
        }
    }
    async getBrowser(wait = true) {
        debug('Attempting to get a browser instance (wait=%s)', wait);
        if (wait) {
            await this.#semaphore.acquire();
        }
        else if (this.#semaphore.tryAcquire() === undefined) {
            throw new Error('Browser is currently in use');
        }
        debug('Acquired semaphore for browser instance');
        if (this.#idleTimeout !== undefined) {
            clearTimeout(this.#idleTimeout);
            this.#idleTimeout = undefined;
        }
        if (this.#browser === undefined) {
            this.#browser = await launch(this.#browserOptions);
        }
        return this.#browser;
    }
    async releaseBrowser() {
        debug('Releasing browser instance');
        if (this.#browser !== undefined) {
            const newPage = await this.#browser.newPage();
            for (const page of await this.#browser.pages()) {
                try {
                    if (page !== newPage) {
                        // eslint-disable-next-line no-await-in-loop
                        await page.close();
                    }
                }
                catch { }
            }
        }
        this.#idleTimeout = setTimeout(() => {
            void this.closeBrowser();
        }, this.#idleMillis);
        this.#semaphore.release();
    }
}
