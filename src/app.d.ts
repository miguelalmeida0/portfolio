import type { BudgetNamespace } from '$lib/server/request-safety';
declare global {
  const __PORTFOLIO_BUILD__: { schemaVersion: number; commit: string; builtAt: string; dirty: boolean };
  namespace App {
    interface Platform { env?: { PORTFOLIO_BUDGET?: BudgetNamespace } }
  }
}

export {};
