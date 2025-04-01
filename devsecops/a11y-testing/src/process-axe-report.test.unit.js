import {
  processAxeReport,
  convertBlacklistPatternsToRegExp,
} from './process-axe-report.js';

describe('processAxeReport function', () => {
  it('should filter out exempted violations and incompletes', async () => {
    const mockResults = [
      {
        url: 'http://localhost:8080/test',
        results: {
          violations: [
            { id: 'test-violation-id', impact: 'serious' },
            { id: 'another-test-violation-id' },
          ],
          incomplete: [{ id: 'test-incomplete-id' }],
        },
      },
    ];

    const config = {
      ignoreViolations: ['test-violation-id'],
      ignoreIncomplete: ['test-incomplete-id'],
      blacklistPatterns: [],
    };

    const { urlsWithViolations, urlsWithSeriousImpactViolations } =
      await processAxeReport(mockResults, config, { saveToFile: false });

    expect(urlsWithViolations).toHaveLength(1);
    expect(urlsWithSeriousImpactViolations).toHaveLength(0);
  });

  it('should detect and return non-exempted violations and incompletes', async () => {
    const mockResults = [
      {
        url: 'http://localhost:8080/test',
        results: {
          violations: [
            { id: 'test-violation-id', impact: 'serious' },
            { id: 'another-test-violation-id', impact: 'moderate' },
          ],
          incomplete: [{ id: 'test-incomplete-id', impact: 'moderate' }],
        },
      },
      {
        url: 'http://localhost:8080/test2',
        results: {
          violations: [
            { id: 'another-test-serious-violation-id', impact: 'serious' },
            { id: 'another-test-violation-id', impact: 'moderate' },
          ],
          incomplete: [],
        },
      },
    ];

    const config = {
      ignoreViolations: [],
      ignoreIncomplete: [],
      blacklistPatterns: [],
    };

    const {
      urlsWithViolations,
      urlsWithSeriousImpactViolations,
      urlsWithIncompletes,
    } = await processAxeReport(mockResults, config, { saveToFile: false });

    expect(urlsWithViolations).toHaveLength(2);
    expect(urlsWithViolations[0][0]).toBe('http://localhost:8080/test');
    expect(urlsWithViolations[0][1]).toContain('test-violation-id');
    expect(urlsWithViolations[0][1]).toContain('another-test-violation-id');
    expect(urlsWithIncompletes).toHaveLength(1);

    // Serious impact violations
    expect(urlsWithSeriousImpactViolations).toHaveLength(2);
    expect(urlsWithSeriousImpactViolations[0][1]).toContain(
      'test-violation-id',
    );
    expect(urlsWithSeriousImpactViolations[1][1]).toContain(
      'another-test-serious-violation-id',
    );
  });

  it('should exclude URLs matching blacklist patterns', async () => {
    const mockResults = [
      {
        url: 'http://localhost:8080/blacklisted',
        results: {
          violations: [{ id: 'test-violation-id', impact: 'serious' }],
          incomplete: [],
        },
      },
      {
        url: 'http://localhost:8080/allowed',
        results: {
          violations: [{ id: 'allowed-violation-id', impact: 'moderate' }],
          incomplete: [],
        },
      },
    ];

    const config = {
      ignoreViolations: [],
      ignoreIncomplete: [],
      blacklistPatterns: ['blacklisted'], // Blacklist URLs containing 'blacklisted'
    };

    // Convert blacklistPatterns to Regex object
    config.blacklistPatterns = await convertBlacklistPatternsToRegExp(
      config.blacklistPatterns,
    );

    const { urlsWithViolations, urlsWithSeriousImpactViolations } =
      await processAxeReport(mockResults, config, { saveToFile: false });

    expect(urlsWithViolations).toHaveLength(1);
    expect(urlsWithViolations[0][0]).toBe('http://localhost:8080/allowed');
    expect(urlsWithViolations[0][1]).toContain('allowed-violation-id');

    expect(
      urlsWithViolations.find(
        (entry) => entry[0] === 'http://localhost:8080/blacklisted',
      ),
    ).toBeUndefined();
    expect(urlsWithSeriousImpactViolations).toHaveLength(0);
  });
});
