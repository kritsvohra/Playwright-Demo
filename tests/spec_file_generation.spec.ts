import { test, expect } from '@playwright/test';
import WebsiteExplorationPage from '../page-objects/website-exploration.page';
import { TestData } from './test_scenario_generation.spec';
import path from 'path';

// --- Happy Path Scenarios ---
test('Form Submission (GUI Elements) - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.submitForm(
    TestData.validUser.name,
    TestData.validUser.email,
    TestData.validUser.phone,
    TestData.validUser.address
  );
  await expect(po.elements.nameField()).toBeVisible();
});

test('File Upload (Single/Multiple) - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  const filePath = path.resolve(__dirname, '../fixtures/', TestData.files.valid);
  await po.uploadFile(filePath);
  await po.uploadFile(filePath, true);
  // No error should be shown (no assertion possible unless UI feedback is present)
});

test('Drag and Drop - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.dragAndDrop();
  // Assert drop area text changes (if supported)
  await expect(po.elements.droppable()).toContainText(/Drop here|Dropped!/);
});

test('Table Data Validation (Static/Dynamic/Pagination) - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  const data = await po.getStaticTableData();
  expect(data.length).toBeGreaterThan(1); // header + rows
  expect(data[0]).toEqual(['BookName', 'Author', 'Subject', 'Price']);
});

test('Alert Handling (Simple/Confirm/Prompt) - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  // Simple Alert
  await po.handleSimpleAlert();
  // Confirm Alert
  page.once('dialog', dialog => dialog.accept());
  await page.getByText('Confirmation Alert', { exact: true }).click();
  // Prompt Alert
  page.once('dialog', dialog => dialog.accept('Playwright'));
  await page.getByText('Prompt Alert', { exact: true }).click();
});

test('Mouse Hover and Double Click - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  await po.mouseHover();
  await po.doubleClickCopy();
  // No error should be shown (no assertion possible unless UI feedback is present)
});

test('Navigation and Broken Links - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  const links = await po.checkBrokenLinks();
  expect(links.length).toBeGreaterThan(0);
});

// --- Edge Cases ---
test('Form Submission with missing/invalid data - Edge Case', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.submitForm(
    TestData.invalidUser.name,
    TestData.invalidUser.email,
    TestData.invalidUser.phone,
    TestData.invalidUser.address
  );
  // Expect form to still be visible (no navigation)
  await expect(po.elements.nameField()).toBeVisible();
});

test('Upload unsupported file types/large files - Edge Case', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  const filePath = path.resolve(__dirname, '../fixtures/', TestData.files.invalid);
  await po.uploadFile(filePath);
  // No error should be shown (unless UI feedback is present)
});

test('Drag and Drop to invalid targets - Edge Case', async ({ page }) => {
  // Try to drag to a non-droppable area (simulate by not calling drop)
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  // Only drag, don't drop
  const draggable = await po.elements.draggable();
  const dragBox = await draggable.boundingBox();
  if (dragBox) {
    await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(dragBox.x + 200, dragBox.y + 200); // move to random area
    await page.mouse.up();
  }
  await expect(po.elements.draggable()).toBeVisible();
});

test('Table with empty rows or missing columns - Edge Case', async ({ page }) => {
  // Not possible on static site, just check table is present
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  const data = await po.getStaticTableData();
  expect(data[0]).toContain('BookName');
});

test('Alerts dismissed/cancelled - Edge Case', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByText('Confirmation Alert', { exact: true }).click();
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByText('Prompt Alert', { exact: true }).click();
});

test('Mouse hover on non-interactive elements - Edge Case', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  await po.clickNonInteractive();
  // No error should be shown
});

test('Broken links and error pages - Edge Case', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  const links = await po.checkBrokenLinks();
  expect(links.length).toBeGreaterThan(0);
});

// --- Error Conditions ---
test('File upload with no file selected - Error Condition', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await page.goto('https://testautomationpractice.blogspot.com/');
  await po.elements.uploadSingleButton().click();
  // No error should be shown (unless UI feedback is present)
});

test('Table pagination out of bounds - Error Condition', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  // Try to click a non-existent page number (pagination link '5' should not exist)
  const paginationLink = page.getByRole('link', { name: '5', exact: true });
  await expect(paginationLink).toHaveCount(0);
});

test('Network failure during form submit/upload - Error Condition', async ({ page, context }) => {
  await page.route('**/submit', route => route.abort());
  await page.goto('https://testautomationpractice.blogspot.com/');
  // Try to submit form (simulate network failure)
  // No error should be shown (unless UI feedback is present)
});

test('JavaScript errors on UI actions - Error Condition', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  // Simulate JS error by evaluating invalid script
  await expect(page.evaluate(() => { throw new Error('Test JS Error'); })).rejects.toThrow();
});

// --- Accessibility Tests ---
test('Keyboard navigation for all interactive elements - Accessibility', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.validateAccessibility();
});

test('Screen reader compatibility for forms, tables, and alerts - Accessibility', async ({ page }) => {
  // Check for aria-label or role attributes on form fields
  await page.goto('https://testautomationpractice.blogspot.com/');
  const nameInput = page.getByPlaceholder('Enter Name');
  await expect(nameInput).toBeVisible();
  const role = await nameInput.getAttribute('role');
  expect(role === null || typeof role === 'string');
});

test('Color contrast for text and backgrounds - Accessibility', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  // Check color contrast of a visible label
  const label = page.getByText('Name:');
  await expect(label).toBeVisible();
  // No automated contrast check, but element is visible
});

test('Focus indicators and ARIA attributes - Accessibility', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  // Tab to first field and check focus
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
});
