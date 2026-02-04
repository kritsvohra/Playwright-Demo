import { test, expect } from '@playwright/test';
import WebsiteExplorationPage from '../page-objects/website-exploration.page';
import { BasePage } from '../base/base-page';

// Form Submission - Happy Path
test('Form Submission - Happy Path', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.submitForm('Test User', 'test@example.com', '1234567890', '123 Main St');
  // Optionally, check that the form fields are cleared or page is still visible
  await expect(po.elements.nameField()).toBeVisible();
});

// // Drag and Drop - Happy Path
// test('Drag and Drop - Happy Path', async ({ page }) => {
//   const po = new WebsiteExplorationPage(page);
//   await po.gotoGuiElements();
//   await po.dragAndDrop();
//   await expect(po.elements.droppable()).toHaveText(/Dropped!/);
// });

// Alert Handling
test('Alert Handling', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.handleSimpleAlert();
});

// Form Submission - Empty Fields (Edge Case)
test('Form Submission - Empty Fields', async ({ page }) => {
  const po = new WebsiteExplorationPage(page);
  await po.gotoGuiElements();
  await po.submitEmptyForm();
  await expect(po.elements.nameField()).toBeVisible();
});
