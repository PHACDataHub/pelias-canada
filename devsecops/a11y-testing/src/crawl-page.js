// Crawl and collect URLs for accessibility checks
import { AxePuppeteer } from '@axe-core/puppeteer';

export async function crawlPage(
  page,
  browser,
  HOMEPAGE_URL,
  visitedPages,
  allResults,
  blacklistPatterns,
) {
  const currentUrl = page.url();
  let uniqueUrl = currentUrl;

  // Skip if page has been visited already
  if (visitedPages.has(currentUrl)) {
    console.log(`Skipping already visited page: ${currentUrl}`);
    return;
  }

  // Mark page as visited
  visitedPages.add(currentUrl);

  // Check if the current URL matches any blacklist patterns
  const isBlacklisted = blacklistPatterns.some((pattern) => {
    const regex = new RegExp(pattern);
    return regex.test(currentUrl);
  });

  // Skip if the URL is blacklisted
  if (isBlacklisted) {
    console.log(`Skipping as on blacklist: ${currentUrl}`);
    return;
  }

  // Distinguish between the login page and the dashboard with the same URL for the results
  if (currentUrl === HOMEPAGE_URL) {
    uniqueUrl += '-post-login';
  }

  console.log(`Assessing page: ${uniqueUrl}`);

  // Run Axe accessibility checks on the current page
  const results = await new AxePuppeteer(page).analyze();

  // Add the results to allResults
  allResults.push({
    url: uniqueUrl,
    results,
  });

  // Get all links on the current page
  const links = await page.$$eval('a', (anchors) =>
    anchors.map((anchor) => anchor.href),
  );

  // Crawl through each link found on the current page
  for (const link of links) {
    // Avoid revisiting the same pages or external URLs
    if (!visitedPages.has(link) && link.startsWith(HOMEPAGE_URL)) {
      const newPage = await browser.newPage();
      await newPage.goto(link, { waitUntil: 'networkidle2' });
      await crawlPage(
        newPage,
        browser,
        HOMEPAGE_URL,
        visitedPages,
        allResults,
        blacklistPatterns,
      ); // Recursively crawl new pages
      await newPage.close(); // Close new page after crawling
    }
  }
}
