import fs from 'fs';
import path from 'path';

// Load ignored URLs and whitelisted violations and incompletes from the config
const configPath = './axeignore.json';

// ------ HELPER FUNCTIONS -----

// Helper function to convert blacklist url patters from the config into a RegExp object (extracted from loadConfig for unit testing)
export async function convertBlacklistPatternsToRegExp(blacklistPatterns) {
  blacklistPatterns = (blacklistPatterns || []).map(
    (pattern) => new RegExp(pattern),
  );
  return blacklistPatterns;
}

// Helper function to load config file
async function loadConfig(configPath) {
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    config.blacklistPatterns = await convertBlacklistPatternsToRegExp(
      config.blacklistPatterns,
    );
    return config;
  } catch (error) {
    console.error(`Failed to load config file at ${configPath}:`, error);
    throw error;
  }
}

// Helper function to filter results based on ignore list
function filterResults(results = [], ignoreList = []) {
  return results.filter((item) => !ignoreList.includes(item.id));
}

// Helper function to check if a URL is blacklisted function
function isUrlBlacklisted(url, blacklistPatterns) {
  return blacklistPatterns.some((regex) => regex.test(url));
}

// Helper function to save results to file function
async function saveResults({
  config,
  urlsWithViolations,
  urlsWithSeriousImpactViolations,
  urlsWithIncompletes,
  filteredResults,
}) {
  const commitSha = process.env.COMMIT_SHA || 'no_sha';
  const resultsDir = path.resolve('./axe-results');
  const filename = path.join(resultsDir, `/ci_axe_results_${commitSha}.json`);

  // Format result so that there's a summary at the top, then full results by url following
  //  This will likely need to be modified to be in a format more easily used by dashboard in the future.
  const result = {
    exemptedViolationIds: config.ignoreViolations || [],
    exemptedIncompleteIds: config.ignoreIncomplete || [],
    exemptedUrlPatterns: config.blacklistPatterns || [],
    urlsWithViolations,
    urlsWithSeriousImpactViolations,
    urlsWithIncompletes,
    fullResults: filteredResults,
  };

  try {
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Results saved to ${filename}`);
  } catch (error) {
    console.error(`Failed to save results to ${filename}:`, error);
    throw error;
  }
}

// Process accessibility report
export async function processAxeReport(
  allResults,
  testConfig = null,
  options = {},
) {
  const {
    saveToFile = true,
    // resultsDir = path.resolve('./axe-results'),
  } = options; // for testing

  const urlsWithViolations = [];
  const urlsWithSeriousImpactViolations = [];
  const urlsWithIncompletes = [];
  const filteredResults = [];

  console.log('\nProcessing results.');

  // Load config file
  const config = testConfig || (await loadConfig(configPath)); // Load config file

  for (const { url, results } of allResults) {
    // Skip URLs based on blacklist patterns
    if (isUrlBlacklisted(url, config.blacklistPatterns)) {
      console.log(`Skipping exempted URL: ${url}`);
      continue;
    }

    // Filter for axe-core violations and incomplete issues based on ignore lists
    const filteredViolations = filterResults(
      results.violations,
      config.ignoreViolations,
    );
    const filteredIncomplete = filterResults(
      results.incomplete,
      config.ignoreIncomplete,
    );

    // Store filtered results
    filteredResults.push({
      url,
      violations: filteredViolations,
      incomplete: filteredIncomplete,
    });

    // Collect URLs with violations and incomplete issues in the specified format
    if (filteredViolations.length > 0) {
      urlsWithViolations.push([
        url,
        filteredViolations.map((violation) => violation.id),
      ]);
    }
    if (filteredIncomplete.length > 0) {
      urlsWithIncompletes.push([
        url,
        filteredIncomplete.map((incomplete) => incomplete.id),
      ]);
    }

    // Collect violations with a serious impact
    const seriousViolations = filteredViolations.filter(
      (violation) => violation.impact === 'serious',
    );
    if (seriousViolations.length > 0) {
      urlsWithSeriousImpactViolations.push([
        url,
        seriousViolations.map((violation) => violation.id),
      ]);
    }
  }

  // Save results to file - to be used by dashboard
  if (saveToFile) {
    // able to set to false for testing
    await saveResults({
      config,
      urlsWithViolations,
      urlsWithSeriousImpactViolations,
      urlsWithIncompletes,
      filteredResults,
    });
  }

  return {
    // for logging from index.js
    urlsWithViolations,
    urlsWithSeriousImpactViolations,
    urlsWithIncompletes,
    filteredResults, // For testing
  };
}
