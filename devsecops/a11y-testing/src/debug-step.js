import fs from 'fs';

import dotenv from 'dotenv';

dotenv.config();

const resultsDir = process.env.RESULTS_DIR || './axe-results';

export function debugStep(page, label) {
  const timestamp = Date.now();
  const cleanLabel = label.replace(/[^\w-]/g, '_');
  const screenshotPath = `${resultsDir}/debug-${cleanLabel}-${timestamp}.png`;
  const htmlPath = `${resultsDir}/debug-${cleanLabel}-${timestamp}.html`;

  return Promise.all([
    page.screenshot({ path: screenshotPath, fullPage: true }),
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    page.content().then((html) => fs.writeFileSync(htmlPath, html)),
  ]);
}
