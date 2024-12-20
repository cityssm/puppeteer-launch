import { type Browser, type LaunchOptions } from 'puppeteer';
export default function launch(options?: LaunchOptions): Promise<Browser>;
export * as puppeteer from 'puppeteer';
