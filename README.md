# Puppeteer Launch

A helper for `puppeteer.launch()`,
for when cached Puppeteer browsers aren't available or aren't compatible.

A drop-in replacement the falls back to system browsers automatically!

## Installation

```sh
npm install @cityssm/puppeteer-launch
```

## Usage

```javascript
import puppeteerLaunch from '@cityssm/puppeteer-launch'

// Launch the default cached browser (likely Chrome).
// Will fallback to a system browser if no cached browser is available.
const browser = await puppeteerLaunch()

// Launch a Firefox web browser.
// Will use a system Firefox if no Firefox in the Puppeteer cache.
const firefoxBrowser = await puppeteerLaunch({
  product: 'firefox'
})
```