import fs from 'fs';
import * as url from 'node:url';

import { AxePuppeteer } from '@axe-core/puppeteer';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import waitOn from 'wait-on';

// import { crawlPage } from './src/crawl-page.js';
import { processAxeReport } from './src/process-axe-report.js';

dotenv.config();

const resultsDir = process.env.RESULTS_DIR || './axe-results';
fs.mkdirSync(resultsDir, { recursive: true });

const config = JSON.parse(fs.readFileSync('./axeignore.json', 'utf8'));

const blacklistPatterns = config.blacklistPatterns || [];
console.log('Exempted URL Patterns:', blacklistPatterns);
const ignoreIncomplete = config.ignoreIncomplete || [];
console.log('Exempted incomplete ids:', ignoreIncomplete);
const ignoreViolations = config.ignoreViolations || [];
console.log('Exempted violation ids:', ignoreViolations);

function debugStep(page, label) {
  const timestamp = Date.now();
  const cleanLabel = label.replace(/[^\w-]/g, '_');
  const screenshotPath = `${resultsDir}/debug-${cleanLabel}-${timestamp}.png`;
  const htmlPath = `${resultsDir}/debug-${cleanLabel}-${timestamp}.html`;

  return Promise.all([
    page.screenshot({ path: screenshotPath, fullPage: true }),
    page.content().then((html) => fs.writeFileSync(htmlPath, html)),
  ]);
}

// // Extract Safe Inputs specific logic for testing
// async function loginToSafeInputs(page, isSafeInputs) {
//   if (isSafeInputs) {
//     // Perform login in order to move to the next page
//     await page.type('#email', 'owner-axe@phac-aspc.gc.ca'); // email field
//     await page
//       .locator('button[type="submit"]', { hasText: /sign in/i }) // case insensitive regex search for sign in button
//       .click();

//     // Bypass authentication in the dev environment
//     const textSelector = await page
//       .locator('text/Or click here to complete authentication')
//       .waitHandle();

//     textSelector.click();

//     await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
//   }
// }

async function performInteractions(route, page, allResults) {
  switch (route) {
    case '/':
      console.log('Interacting with homepage...');

      // await debugStep(page, 'before-latitude-input');

      try {
        // get latitude gcds-input field
        await page.waitForSelector('gcds-input[name="latitude"]', {
          visible: true,
          timeout: 10000,
        });

        // Set latitude value inside shadow DOM
        await page.evaluate(() => {
          const el = document.querySelector('gcds-input[name="latitude"]');
          const input = el?.shadowRoot?.querySelector('input');
          if (input) {
            input.value = '45.1234';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // await debugStep(page, 'after-latitude-input');

        //  get longitude gcds-input field
        await page.waitForSelector('gcds-input[name="longitude"]', {
          visible: true,
          timeout: 10000,
        });

        // Set longitude value inside shadow DOM
        await page.evaluate(() => {
          const el = document.querySelector('gcds-input[name="longitude"]');
          const input = el?.shadowRoot?.querySelector('input');
          if (input) {
            input.value = '-75.7007';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // await debugStep(page, 'after-longitude-input');

        // await page.evaluate(() => {
        //   const buttons = Array.from(document.querySelectorAll('gcds-button'));
        //   const searchButton = buttons.find(btn => btn.textContent?.includes('Search the coordinates'));

        //   if (!searchButton) {
        //     console.warn('[page] Could not find the "Search the coordinates" button');
        //     return;
        //   }

        //   console.log('[page] Found search button, attempting to click');
        //   searchButton.scrollIntoView({ behavior: 'instant', block: 'center' });

        //   searchButton.click();

        //   // // Try to dispatch the click event manually
        //   // searchButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        //    // Follow with dispatch, in case native click doesn't work
        //   console.log('[page] Dispatching real MouseEvent click...');
        //   const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        //   searchButton.dispatchEvent(event);
        // });

        const buttons = await page.$$('gcds-button');
        for (const button of buttons) {
          const text = await page.evaluate((el) => el.textContent, button);
          if (text.includes('Search the coordinates')) {
            console.log(
              '[test] Found search button, clicking with Puppeteer...',
            );
            await button.evaluate((el) =>
              el.scrollIntoView({ behavior: 'instant', block: 'center' }),
            );
            await button.click();
            break;
          }
        }

        // wait 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await debugStep(page, 'after-puppeteer-click');

        // Try waiting for something new to appear — like a map
        try {
          await page.waitForSelector('canvas', {
            visible: true,
            timeout: 5000,
          });
          console.log('[test] Canvas appeared after clicking!');
        } catch (e) {
          console.warn('[test] Canvas did not appear after click.');
        }

        try {
          await page.waitForFunction(
            () => {
              return Array.from(document.querySelectorAll('gcds-heading')).some(
                (h) => h.textContent?.includes('Information returned:'),
              );
            },
            { timeout: 5000 },
          );
          console.log('[test] "Information returned" heading found!');
        } catch (e) {
          console.warn('[test] Heading not found after click.');
        }

        // Step 2: Axe analysis after interaction
        const coordResults = await new AxePuppeteer(page).analyze();
        allResults.push({
          url: `${page.url()}-after-coordinates`,
          results: coordResults,
        });
      } catch (err) {
        console.warn(`Failed interaction on ${route}:`, err.message);
        await debugStep(page, `error-${route}`);
      }

      break;

    //   // Step 2: Search by address
    //   try {
    //     await page.waitForSelector('input[name="address"]');
    //     await page.type('input[name="address"]', '1000 Airport Parkway Private');

    //     await page.waitForSelector('input[name="city"]');
    //     await page.type('input[name="city"]', 'Ottawa');

    //     await page.waitForSelector('input[name="province"]');
    //     await page.type('input[name="province"]', 'Ontario');

    //     await page.waitForSelector('gcds-button[button-id="Search the address"]');
    //     await page.click('gcds-button[button-id="Search the address"]');

    //     await page.waitForTimeout(2000); // or wait for result

    //     // Scan after address search
    //     const addressResults = await new AxePuppeteer(page).analyze();
    //     allResults.push({
    //       url: `${page.url()}-after-address`,
    //       results: addressResults,
    //     });
    //   } catch (err) {
    //     console.warn(`Failed coordinate search interaction on ${route}:`, err.message);
    //   }

    //   break;

    // case '/reverse-geocoding-bulk':
    //   console.log('Interacting with reverse geocoding page...');
    //   try {
    //     await page.type('#reverse-input', '45.4236, -75.7009'); // example input
    //     await page.click('#submit-reverse'); // simulate form submit
    //     await page.waitForSelector('.reverse-results'); // wait for results to appear
    //   } catch (err) {
    //     console.warn(`Failed coordinate search interaction on ${route}:`, err.message);
    //   }
    //   break;

    // case '/bulk-address-geocoding':
    //   console.log('Interacting with bulk address geocoding page...');
    //   // If there’s a file upload component or textarea
    //   try {
    //     await page.type('#bulk-address-input', '123 Main St\n456 Elm St');
    //     await page.click('#bulk-submit');
    //     await page.waitForSelector('.bulk-results');
    //   } catch (err) {
    //     console.warn(`Failed coordinate search interaction on ${route}:`, err.message);
    //   }
    //   break;

    default:
      console.log(`No interactions defined for ${route}`);
      break;
  }
}

export async function runAccessibilityScan(
  // isSafeInputs = false,

  HOMEPAGE_URL = process.env.HOMEPAGE_URL,
  customRoutes = null,
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
    // args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setBypassCSP(true);

  // Navigate to your login page
  await page.goto(HOMEPAGE_URL, { waitUntil: 'networkidle2' }); // Wait until the page is fully loaded

  // Perform accessibility scan on the login page (localhost) before logging in
  console.log('\nAssessing login page:', HOMEPAGE_URL);
  const homePageResults = await new AxePuppeteer(page).analyze();

  allResults.push({
    url: HOMEPAGE_URL,
    results: homePageResults,
  });

  // await loginToSafeInputs(page, isSafeInputs);

  // change ------------------------------------------------------------------
  // ---------- Define routes to (not-)crawl (more like just visit and interact) ---------- (as this is a SPA using react-router-dom, and your app’s routing is dynamic)
  const ROUTES_TO_SCAN = customRoutes || [
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
    // '/'
  ];

  //  need to upload bulk data and submit test files!!

  for (const route of ROUTES_TO_SCAN) {
    const url = `${HOMEPAGE_URL.replace(/\/$/, '')}${route}`;
    if (visitedPages.has(url)) {
      console.log(`Skipping already visited route: ${url}`);
      continue;
    }

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

// ---------- CLI Entry ----------
if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    await runAccessibilityScan();
  }
}
// ----------------------------------------------------------------------------

//   // Start crawling from the dashboard or starting point
//   await crawlPage(
//     page,
//     browser,
//     HOMEPAGE_URL,
//     visitedPages,
//     allResults,
//     blacklistPatterns,
//   );

//   const {
//     urlsWithViolations,
//     urlsWithSeriousImpactViolations,
//     urlsWithIncompletes,
//     filteredResults, // For testing
//   } = await processAxeReport(allResults);

//   console.log('\nResults Summary:');
//   console.log('URLs with violations:', urlsWithViolations);
//   console.log(
//     'URLs with violations with serious impact:',
//     urlsWithSeriousImpactViolations,
//   );
//   console.log('URLs with incompletes:', urlsWithIncompletes);

//   // Close the browser
//   await browser.close();

//   // For testing
//   return {
//     urlsWithViolations,
//     filteredResults,
//   };
// }

// // if main, run as SafeInputs (including Safe Inputs' login section as isSafeInputs default is true)
// if (import.meta.url.startsWith('file:')) {
//   const modulePath = url.fileURLToPath(import.meta.url);
//   if (process.argv[1] === modulePath) {
//     await runAccessibilityScan();
//   }
// }
