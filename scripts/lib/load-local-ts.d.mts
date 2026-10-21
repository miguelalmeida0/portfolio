/** Load a local TypeScript module in isolation without starting a server. */
export function loadLocalTs<TModule = Record<string, unknown>>(
  entry: string,
  options?: { stubs?: Record<string, string> }
): Promise<TModule>;
