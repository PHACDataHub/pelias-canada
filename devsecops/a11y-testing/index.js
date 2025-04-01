import fs from 'fs';
import * as url from 'node:url';

import { AxePuppeteer } from '@axe-core/puppeteer';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import waitOn from 'wait-on';

// import { crawlPage } from './src/crawl-page.js';
import { performInteractions } from './src/perform-interactions.js';
import { debugStep } from './src/debug-step.js';
import { processAxeReport } from './src/process-axe-report.js';

dotenv.config();

// Create a directory to save the results of the scan
const resultsDir = process.env.RESULTS_DIR || './axe-results';
fs.mkdirSync(resultsDir, { recursive: true });

// Import and parse the accessibility ignore config file
const config = JSON.parse(fs.readFileSync('./axeignore.json', 'utf8'));

const blacklistPatterns = config.blacklistPatterns || []; // these are urls not to visit, though if we're no longer crawling this may no longer needed
console.log('Exempted URL Patterns:', blacklistPatterns);
const ignoreIncomplete = config.ignoreIncomplete || []; // axe-core ids to bypass if incomplete
console.log('Exempted incomplete ids:', ignoreIncomplete);
const ignoreViolations = config.ignoreViolations || []; // axe-core ids to bypass if violations occur (ie false positive - right now failures are non-blocking, but may be of more use in the future if are using to block deployment)
console.log('Exempted violation ids:', ignoreViolations);

export async function runAccessibilityScan(
  HOMEPAGE_URL = process.env.HOMEPAGE_URL,
  customRoutes = null, // This is used for testing as we have the routes hardcoded here, and this is a way to bypass that.
) {
  const visitedPages = new Set(); // To track visited pages and avoid duplication
  const allResults = []; // Collect all processed results

  // Wait for the frontend service to be available
  console.log(`Waiting for ${HOMEPAGE_URL} to be ready...`);
  waitOn({
    resources: [HOMEPAGE_URL],
    timeout: 30000, // wait up to 30s
    interval: 500, // check every 500ms
  });
  console.log(`${HOMEPAGE_URL} is ready. Launching scan...`);

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null; // Use docker puppeteer path if running in container, otherwise, use system default

  // Launch the browser
  const browser = await puppeteer.launch({
    executablePath: executablePath || undefined, // To work in both docker with local chrome path
    headless: true,
    // As of alpine 3.20, the --disable-gpu flag is necessary to avoid hanging on browser.newPage()
    // (https://github.com/puppeteer/puppeteer/issues/11640#issuecomment-2264826162).
    // Unless webGL etc is specifically required, disabling the GPU is fine in headless
    // (used to be the default behaviour https://github.com/puppeteer/puppeteer/issues/1260)
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setBypassCSP(true);

  // Define routes to scan (No longer crawling - but hard coding routes to visit, scan, then interact and scan. This is done as the is a SPA using react-router-dom, and app’s routing is dynamic some elements weren't being recognized when crawling)
  const ROUTES_TO_SCAN = customRoutes || [
    // customRoutes are used in test cases
    '/',
    '/reverse-geocoding-bulk',
    '/bulk-address-geocoding',
    '/r-api',
    '/python-api',
    '/geocoding-results-explanation',
    '/frequently-asked-questions',
    '/home',
    '/contact-us',
    '/test',
  ];

  for (const route of ROUTES_TO_SCAN) {
    const url = `${HOMEPAGE_URL.replace(/\/$/, '')}${route}`;
    if (visitedPages.has(url)) {
      console.log(`Skipping already visited route: ${url}`);
      continue;
    }

    // See note above - if we are completely eliminating crawling - blacklist will be removed.
    const isBlacklisted = blacklistPatterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(url);
    });

    if (isBlacklisted) {
      console.log(`Skipping blacklisted route: ${url}`);
      continue;
    }

    console.log(`Scanning route: ${url}`);
    const routePage = await browser.newPage();
    await routePage.setViewport({ width: 1280, height: 800 }); //for desktop - default is smaller
    await routePage.setBypassCSP(true);

    // DEBUGGING - browser side console
    routePage.on('console', (msg) => {
      msg.args().forEach(async (arg) => {
        try {
          const val = await arg.jsonValue();
          console.log(`[browser console] ${val}`);
        } catch (err) {
          console.log(
            `[browser console] Could not resolve console value:`,
            err,
          );
        }
      });
    });

    // await routePage.goto(url, { waitUntil: 'networkidle2' });
    await routePage.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    await debugStep(routePage, `after-goto-${route}`);

    // Perform route-specific interactions
    await performInteractions(route, routePage, allResults);
    // await routePage.screenshot({ path: `screenshot-${route.replace(/\//g, '')}.png` }); // debugging

    const results = await new AxePuppeteer(routePage).analyze();
    allResults.push({ url, results });
    visitedPages.add(url);

    await routePage.close();
  }

  // ---------- Process Results ----------
  const {
    urlsWithViolations,
    urlsWithSeriousImpactViolations,
    urlsWithIncompletes,
    filteredResults,
  } = await processAxeReport(allResults);

  console.log('\nResults Summary:');
  console.log('URLs with violations:', urlsWithViolations);
  console.log('URLs with serious violations:', urlsWithSeriousImpactViolations);
  console.log('URLs with incompletes:', urlsWithIncompletes);

  await browser.close();

  return {
    urlsWithViolations,
    filteredResults,
  };
}

// CLI entry for tests
if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    await runAccessibilityScan();
  }
}
