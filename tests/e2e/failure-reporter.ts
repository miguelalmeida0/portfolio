import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

// Keep assertion details available in live CI logs, even if a runner times out.
export default class FailureReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed' || result.status === 'skipped') return;
    console.error(`\n${test.titlePath().join(' > ')} (attempt ${result.retry + 1})`);
    for (const error of result.errors) console.error(error.message ?? error.value);
  }
}
