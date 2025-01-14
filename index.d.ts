import { type Browser, type LaunchOptions } from 'puppeteer';
/**
 * Launches a Puppeteer browser instance.
 * Automatically falls back to a system browser if no browser is available in the Puppeteer cache.
 * @param options - Optional launch parameters
 * @returns - A Puppeteer browser instance.
 */
export default function launch(options?: LaunchOptions): Promise<Browser>;
export * as puppeteer from 'puppeteer';
