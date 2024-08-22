import { type Browser, PuppeteerLaunchOptions } from 'puppeteer';
export default function launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
export * as puppeteer from 'puppeteer';
