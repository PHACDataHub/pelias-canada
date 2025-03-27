// eslint-disable-next-line no-restricted-imports
import { runAccessibilityScan } from '../index.js';

describe('End-to-End Accessibility Test', () => {
  let scanResults;

  beforeAll(async () => {
    // const isSafeInputs = false; // Skips the Safe Inputs specific login steps
    // eslint-disable-next-line @microsoft/sdl/no-insecure-url
    const HOMEPAGE_URL = 'http://127.0.0.1:8080';
    // scanResults = await runAccessibilityScan(isSafeInputs, HOMEPAGE_URL);
    scanResults = await runAccessibilityScan(HOMEPAGE_URL);
  });

  it('should crawl and scan more than one page', () => {
    const { filteredResults } = scanResults;

    const hasAccessiblePage = filteredResults.some(
      // eslint-disable-next-line @microsoft/sdl/no-insecure-url
      (entry) => entry.url === 'http://127.0.0.1:8080/accessible.html',
    );

    const hasInaccessiblePage = filteredResults.some(
      // eslint-disable-next-line @microsoft/sdl/no-insecure-url
      (entry) => entry.url === 'http://127.0.0.1:8080/inaccessible.html',
    );

    expect(hasAccessiblePage).toBe(true);
    expect(hasInaccessiblePage).toBe(true);
  });

  it('should not return violations for the accessible page.', () => {
    const { urlsWithViolations } = scanResults;

    const accessiblePageViolations = urlsWithViolations.find(
      // eslint-disable-next-line @microsoft/sdl/no-insecure-url
      (entry) => entry[0] === 'http://127.0.0.1:8080/accessible.html',
    );
    expect(accessiblePageViolations).toBeUndefined();
  });

  it('should return accessibility violations for the inaccessible page.', () => {
    const { urlsWithViolations } = scanResults;

    const hasInaccessiblePageViolations = urlsWithViolations.some(
      // eslint-disable-next-line @microsoft/sdl/no-insecure-url
      (entry) => entry[0] === 'http://127.0.0.1:8080/inaccessible.html',
    );
    expect(hasInaccessiblePageViolations).toBe(true);
  });
});
