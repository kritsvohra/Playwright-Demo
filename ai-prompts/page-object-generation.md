# Page Object Generation Prompt

## RISE Structure

**Role**: You are a Senior SDET with 12+ years of experience in Playwright test automation, specializing in modern locator strategies and the Page Object Model pattern used in enterprise applications.

**Input**:
- Target URL: [URL]
- User story/feature description: [DESCRIPTION]
<!-- - Framework patterns from: `../playwright-tests/docs/standards-and-guidelines/page-objects.md`
- Base page pattern: `../playwright-tests/page-objects/base-page.ts`
- Example page objects: `../playwright-tests/page-objects/login-page.ts` -->

**Steps**:
1. Analyse the provided URL and identify UI elements
2. Generate element selectors using Playwright built-in locators (getByRole, getByText, getByLabel, getByPlaceholder, getByAltText, getByTitle, getByTestId)
3. Avoid XPath and CSS selectors - prioritize semantic locators
4. Create page object methods using `@step` decorator pattern
5. Use `this.page.locator()` only when built-in locators aren't sufficient
6. Follow the `registerElements()` pattern but store locator functions instead of strings
7. Reference existing similar page objects for pattern consistency
8. Suggest CommonSteps integration points
9. Include verification and status checking elements
10. Add accessibility validation elements
11. Integrate with existing framework structure
12. Generate comprehensive JavaDoc comments following established standards

**Expected Output**:
```typescript
import { Page, expect } from "@playwright/test";
import { BasePage, step } from "./base-page";
import { EnvConfig } from "../config/env-config";

/**
 * Page object for [PAGE_NAME] functionality
 * Handles [MAIN_FUNCTIONALITY] and related operations
 */
export default class [PageName]Page extends BasePage {
    constructor(page: Page, config: EnvConfig) {
        super(page, config);
        this.registerElements();
    }

    private registerElements() {
        // Interactive elements with semantic locators
        this.elements.submitButton = () => this.page.getByRole('button', { name: 'Submit' });
        this.elements.cancelButton = () => this.page.getByRole('button', { name: 'Cancel' });
        this.elements.usernameField = () => this.page.getByLabel('Username');
        this.elements.errorMessage = () => this.page.getByRole('alert');
        this.elements.statusIndicator = () => this.page.getByRole('status');

        // Verification elements
        this.elements.successMessage = () => this.page.getByText('Success', { exact: false });
        this.elements.documentStatus = () => this.page.getByTestId('document-status');

        // Accessibility elements
        this.elements.mainContent = () => this.page.getByRole('main');
        this.elements.navigationMenu = () => this.page.getByRole('navigation');
    }

    /**
     * [Method description]
     * @param param - Parameter description
     */
    @step
    async methodName(param: string): Promise<void> {
        await this.elements.usernameField().fill(param);
        await this.elements.submitButton().click();
        await expect(this.elements.statusIndicator()).toBeVisible();
    }
}
```

## Integration with PexaApp

Provide the code to add the new page object to `../playwright-tests/page-objects/pexa-app.ts`:

```typescript
// Import statement
import [PageName]Page from "./[page-name]-page";

// Private property
private readonly _[pageName]Page!: [PageName]Page;

// Getter method
get [pageName]Page(): [PageName]Page {
    return this._[pageName]Page ?? new [PageName]Page(this._page, this.config);
}
```

## Locator Priority Guidelines

### Primary Strategy (Always Try First)
1. **getByRole()** - Interactive elements (buttons, links, inputs)
2. **getByLabel()** - Form fields with labels
3. **getByText()** - Content-based identification
4. **getByPlaceholder()** - Input fields with placeholders
5. **getByTestId()** - When semantic options unavailable

### JSP Frontend Fallback Strategy
When Playwright built-in locators fail in JSP applications:
1. **Trace Viewer Analysis** - Use Playwright trace viewer to identify stable selectors
2. **UI Inspector Method** - Use Playwright UI inspector for element analysis
3. **Robust CSS Selectors** - Use stable CSS selectors with multiple attributes
4. **XPath as Last Resort** - For complex JSP structures where CSS isn't sufficient

### JSP Fallback Pattern
```typescript
private registerElements() {
    // Always try built-in locators first
    this.elements.submitButton = () => {
        const byRole = this.page.getByRole('button', { name: 'Submit' });
        if (byRole.isVisible()) return byRole;

        // JSP fallback - use trace viewer/UI inspector findings
        return this.page.locator('input[type="submit"][name="submitBtn"]');
    };
}
```

## Workflow for Senior QE with JSP Applications

1. **Captures initial flow via user actions** → Get initial structure using Playwright codegen
2. **Apply page-object-generation.md prompt** → Generate with built-in locators
3. **Test locators** → Identify failures in JSP environment
4. **Use Trace Viewer/UI Inspector** → Find stable alternatives for failed locators
5. **Refine page object** → Update failed locators with JSP-appropriate selectors

## CommonSteps Integration Suggestions

Suggest which existing CommonSteps methods can be used with this page object:

```typescript
// Example integration points
await login()
```

## Accessibility Validation Methods

Include methods for accessibility compliance:

```typescript
/**
 * Validates page accessibility compliance
 */
@step
async validateAccessibility(): Promise<void> {
    // Check main landmarks
    await expect(this.elements.mainContent()).toBeVisible();
    await expect(this.elements.navigationMenu()).toBeVisible();

    // Verify keyboard navigation
    await this.page.keyboard.press('Tab');
    await expect(this.page.locator(':focus')).toBeVisible();

    // Check ARIA attributes
    await expect(this.elements.submitButton()).toHaveAttribute('aria-label');
}
```