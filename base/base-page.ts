// Minimal base class and types for standalone use
export class BasePage {
  protected page: import('@playwright/test').Page;
  protected config: any;
  public elements: Record<string, any> = {};
  constructor(page: import('@playwright/test').Page, config?: any) {
    this.page = page;
    this.config = config;
  }
}
// Updated step decorator to support both legacy and standard signatures
export function step(...args: any[]): any {
  // If used as a method decorator, args.length === 3
  // If used as a legacy decorator, args.length === 2
  // This implementation is a no-op for both cases
  return undefined;
}
