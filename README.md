# Puppeteer Launch

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/puppeteer-launch)](https://www.npmjs.com/package/@cityssm/puppeteer-launch)
[![DeepSource](https://app.deepsource.com/gh/cityssm/puppeteer-launch.svg/?label=active+issues&show_trend=true&token=uZJ-emVRMecP7RWObivU3uT9)](https://app.deepsource.com/gh/cityssm/puppeteer-launch/)
[![Maintainability](https://api.codeclimate.com/v1/badges/e471091916c9aa631407/maintainability)](https://codeclimate.com/github/cityssm/puppeteer-launch/maintainability)
[![codecov](https://codecov.io/gh/cityssm/puppeteer-launch/graph/badge.svg?token=K55LQ4IX7T)](https://codecov.io/gh/cityssm/puppeteer-launch)
[![Coverage Testing](https://github.com/cityssm/puppeteer-launch/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/puppeteer-launch/actions/workflows/coverage.yml)

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
// Will fallback to a system browser (either Chrome, Chromium, or Firefox)
// if no cached browser is available.
const browser = await puppeteerLaunch()

// Launch a Firefox web browser.
// Will use a system Firefox if no Firefox in the Puppeteer cache.
const firefoxBrowser = await puppeteerLaunch({
  product: 'firefox'
})
```
