# Locator Migration Prompt

## RISE Structure

**Role**: You are a test automation consultant specializing in migrating legacy test suites to modern, maintainable locator strategies using Playwright's built-in locators.

**Input**:
- Existing page object with XPath/CSS selectors: [CODE or FILE_PATH]
- Target page URL for validation: [URL]
- Modern locator examples from: `../playwright-tests/page-objects/base-page.ts`

**Steps**:
1. Analyse existing XPath/CSS selectors for semantic meaning
2. Identify semantic equivalents using Playwright built-in locators
3. Assess locator reliability and maintainability
4. Create migration mapping from old to new locators
5. Suggest HTML improvements for better testability (for dev team)
6. Provide fallback strategies for complex cases
7. Validate new locators against accessibility standards
8. Generate refactored page object methods

**Expected Output**:

## Migration Analysis

### Current Locator Assessment
| Current Selector | Type | Reliability | Maintainability | Migration Priority |
|------------------|------|-------------|-----------------|-------------------|
| `//button[@type="submit"]` | XPath | Medium | Low | High |
| `input#username` | CSS | High | Medium | Medium |
| `.btn-primary` | CSS | Low | Low | High |
| `[data-testid="submit"]` | CSS | High | High | Low |

## Migration Mapping

### High Priority Migrations
```typescript
// BEFORE (XPath/CSS)
this.elements.submitButton = '//button[@type="submit"]';
this.elements.usernameField = 'input#username';
this.elements.errorMessage = '.error-message';

// AFTER (New Pattern)
this.elementsByLocator.submitButton = this.page.getByRole('button', { name: 'Submit' });
this.elementsByLocator.usernameField = this.page.getByLabel('Username');
this.elementsByLocator.errorMessage = this.page.getByRole('alert');
```

### Medium Priority Migrations
```typescript
// BEFORE
this.elements.navigationMenu = '//nav//ul';
this.elements.documentLink = '//a[contains(text(), "Documents")]';

// AFTER
this.elementsByLocator.navigationMenu = this.page.getByRole('navigation');
this.elementsByLocator.documentLink = this.page.getByRole('link', { name: 'Documents' });
```

### Complex Cases Requiring Analysis
```typescript
// BEFORE - Complex XPath
this.elements.dynamicRow = '//tr[contains(., "{{value}}")][{{index}}]';

// AFTER - Modern approach with methods
getDynamicRow(value: string, index: number) {
    return this.page.getByRole('row').filter({ hasText: value }).nth(index - 1);
}
```

## Refactored Page Object

```typescript
import { Page, expect } from "@playwright/test";
import { BasePage, step } from "./base-page";
import { EnvConfig } from "../config/env-config";

/**
 * Migrated page object using modern Playwright locators
 * [Original functionality description]
 */
export default class MigratedPage extends BasePage {
    private readonly elementsByLocator: Record<string, Locator> = {};

    constructor(page: Page, config: EnvConfig) {
        super(page, config);
        this.registerElements();
        this.registerElementsByLocator();
    }

    private registerElements() {
        // Legacy string selectors for backward compatibility
        this.elements.submitButton = 'button[type="submit"]';
        this.elements.usernameField = 'input#username';
        this.elements.errorMessage = '.error-message';
    }

    private registerElementsByLocator() {
        // Modern Locator objects
        this.elementsByLocator.submitButton = this.page.getByRole('button', { name: 'Submit' });
        this.elementsByLocator.usernameField = this.page.getByLabel('Username');
        this.elementsByLocator.errorMessage = this.page.getByRole('alert');
        this.elementsByLocator.successMessage = this.page.getByText('Success', { exact: false });

        // Complex locators with filters
        this.elementsByLocator.navigationMenu = this.page.getByRole('navigation');
    }

    /**
     * Migrated method using modern locators
     * @param username - User's username
     * @param password - User's password
     */
    @step
    async login(username: string, password: string): Promise<void> {
        await this.elementsByLocator.usernameField.fill(username);
        await this.elementsByLocator.passwordField.fill(password);
        await this.elementsByLocator.submitButton.click();

        // Modern assertion with semantic locator
        await expect(this.elementsByLocator.successMessage).toBeVisible();
    }

    /**
     * Enhanced method with accessibility validation
     * @param rowText - Text to identify the row
     * @param index - Row index (1-based)
     */
    @step
    async selectTableRow(rowText: string, index: number): Promise<void> {
        const row = this.page.getByRole('row').filter({ hasText: rowText }).nth(index - 1);
        await row.click();

        // Verify accessibility
        await expect(row).toHaveAttribute('aria-selected', 'true');
    }
}
```

## HTML Improvement Suggestions

### For Development Team
```html
<!-- BEFORE - Poor testability -->
<button class="btn btn-primary" onclick="submit()">Submit</button>
<div class="error-msg" style="color: red;">Error occurred</div>

<!-- AFTER - Better testability -->
<button type="submit" aria-label="Submit form">Submit</button>
<div role="alert" aria-live="polite">Error occurred</div>

<!-- RECOMMENDED - Optimal testability -->
<button type="submit" data-testid="submit-form">Submit</button>
<div role="alert" aria-live="polite" data-testid="error-message">Error occurred</div>
```

### Accessibility Improvements
```html
<!-- Add proper labels -->
<label for="username">Username</label>
<input id="username" type="text" required aria-describedby="username-help">
<div id="username-help">Enter your registered username</div>

<!-- Add proper roles -->
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
```

## Fallback Strategies

### When Modern Locators Aren't Sufficient
```typescript
// Strategy 1: Combine modern locators with filters
this.elements.specificButton = () =>
    this.page.getByRole('button').filter({ hasText: 'Specific Text' });

// Strategy 2: Use locator with CSS when semantic meaning is preserved
this.elements.statusIcon = () =>
    this.page.locator('[aria-label="Status indicator"]');

// Strategy 3: Chain locators for complex hierarchies
this.elements.nestedElement = () =>
    this.page.getByRole('dialog').getByRole('button', { name: 'Close' });

// Strategy 4: Use data-testid as last resort
this.elements.complexWidget = () =>
    this.page.getByTestId('complex-widget-container');
```

## Migration Execution Plan

### Phase 1: High-Impact, Low-Risk (Week 1)
- Migrate simple button and link selectors
- Update form field locators
- Replace basic text-based selectors

### Phase 2: Medium Complexity (Week 2)
- Migrate navigation and menu selectors
- Update table and list item locators
- Replace modal and dialog selectors

### Phase 3: Complex Cases (Week 3)
- Migrate dynamic selectors with parameters
- Update complex hierarchical selectors
- Handle edge cases and fallbacks

### Phase 4: Validation and Cleanup (Week 4)
- Run full test suite validation
- Performance testing with new locators
- Documentation updates
- Remove deprecated selectors

## Validation Checklist

- [ ] All new locators work in target browsers
- [ ] Accessibility compliance maintained/improved
- [ ] Test execution time not significantly impacted
- [ ] No false positives/negatives introduced
- [ ] Locators are maintainable and readable
- [ ] Fallback strategies documented
- [ ] Team training completed

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Locator not found | High | Comprehensive testing, fallback strategies |
| Performance degradation | Medium | Benchmark testing, optimization |
| False positives | High | Specific locator validation |
| Team adoption | Medium | Training, documentation, gradual rollout |
Jot something down