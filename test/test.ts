import assert from 'node:assert'

import puppeteerLaunch from '../index.js'

describe('puppeteer-launch', () => {
  it('Launches a browser', async () => {
    const browser = await puppeteerLaunch()

    await browser.close()

    assert.ok(true)
  })

  it('Launches a Chrome-based browser', async() => {
    const browser = await puppeteerLaunch({
      product: 'chrome'
    })

    const browserVersion = await browser.version()

    await browser.close()

    assert.match(browserVersion, /Chrome\//g)
  })

  it('Launches a Firefox browser', async() => {
    const browser = await puppeteerLaunch({
      product: 'firefox'
    })

    const browserVersion = await browser.version()

    await browser.close()

    assert.match(browserVersion, /Firefox\//g)
  })
})
