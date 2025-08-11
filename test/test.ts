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
    const browser = await puppeteerLaunch({
      args: ['--no-sandbox']
    })

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.ok(true)
  })

  await it('Launches a Chrome-based browser', async () => {
    const browser = await puppeteerLaunch({
      args: ['--no-sandbox'],
      browserOrder: ['chrome-user', 'chrome']
    })

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.match(browserVersion, /chrome\//gi)
  })

  await it('Launches a Firefox browser', async () => {
    const browser = await puppeteerLaunch({
      browser: 'firefox',
      args: ['--no-sandbox']
    })

    const browserVersion = await browser.version()

    await browser.close()

    debug(`Browser: ${browserVersion}`)

    assert.match(browserVersion, /firefox\//gi)
  })
})
