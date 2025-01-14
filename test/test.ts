import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import puppeteerLaunch from '../index.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test`)

await describe('puppeteer-launch', async () => {
  beforeEach(() => {
    console.log('\n')
  })

  await it('Launches the default browser', async () => {
    const browser = await puppeteerLaunch()

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.ok(true)
  })

  await it('Launches a Chrome-based browser', async () => {
    const browser = await puppeteerLaunch({
      browser: 'chrome'
    })

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.match(browserVersion, /chrome\//gi)
  })

  await it('Launches a Firefox browser', async () => {
    const browser = await puppeteerLaunch({
      browser: 'firefox'
    })

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.match(browserVersion, /firefox\//gi)
  })

  await it.skip('Launches a browser when the executablePath is invalid', async () => {
    const browser = await puppeteerLaunch({
      executablePath: String.raw`D:\invalid\path\browser.exe`
    })

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.ok(true)
  })
})
