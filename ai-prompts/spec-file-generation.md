# Spec File Generation Prompt

## RISE Structure

**Role**: You are an expert test automation engineer specializing in modern Playwright patterns, semantic HTML testing, and enterprise test frameworks.

**Input**:
- Test scenarios from test-scenario-generation.md output: [SCENARIOS]
- OR Codegen recorded steps file: [CODEGEN_FILE]
- User roles involved: [ROLES]
- Framework patterns from `../playwright-tests/tests/smoke-tests/`
- CommonSteps reference: `../playwright-tests/libs/common-steps.ts`
- Test data patterns: `../playwright-tests/test-data`

**Steps**:
1. Structure test file following framework conventions (no describe block)
2. Use page object goto() methods for navigation
3. Implement proper test tagging strategy with separate tags block
4. Leverage CommonSteps for common methods
5. Use page object methods instead of raw locators
6. Add test.step() wrappers for logical groupings
7. Handle passwords with base64 encoding

**Expected outcome**:

```typescript
import {test} from "../../fixtures/context-with-extension";
import {CommonSteps} from "../../libs/common-steps";
import {Environments} from "../../libs/environments";
import {TestData} from "../../test-data/[test-category]/[test-file-name]";

const tags = [
    // Note: tags should be defined in this block and referenced in test-functions
];

const credentials = {
    username: "[USERNAME]",
    password: "[PASSWORD]" // should be base64 encoded
}

test.beforeAll(()=>{
    test.skip(process.env.TEST_ENV!== Environments.[TARGET_ENV],
    "Not applicable for target environment");
})

test("[Test Description]", {tag: ["@smoke"]}, async({page})=>{
    
    await test.step("[Test Description]", async()=>{

    })
})
```

## Navigation Patterns

```typescript
// Use the page object goto() methods for navigation
await page.documents.main.goto();
```

## Page Object Method patterns

```typescript
// Use page object methods instead of raw locators
await page.login.login()
```

## CommonSteps Usage Patterns

```typescript
// For login
const username = await CommonSteps.login();
```

## Test Data Template

```typescript
//test-data/[category]/[test-name].ts
export const TestData = {
    username: "abcd",
    password: "password"
}
```

## Modern Locator Examples

```typescript
// Interactive elements
await page.getByRole('button', {name: 'Submit'}).click()
await page.getByRole('link', {name: 'Documents'}).click()
await page.getByRole('tab', {name: 'Details'}).click()

// Form elements 
await page.getByLabel('username').fill(username);
await page.getByPlaceholder('Enter Description').fill(description)
await page.getByRole('combobox', {name: 'Gender'}).selectOption(gender)

// Content Verification
await expect(page.getByText('Success')).toBeVisible()

// Accessibility Checks 
await expect(page.getByRole('main')).toBeVisible();
await expect(page.getByRole('banner')).toBeVisible();
await expect(page.getByRole('navigation')).toBeVisible()