import {test, expect} from '@playwright/test';

/**
 * Locator identifies the element on the page
 * 
 * 1. page.getByAltText() --> to locate an element, usually image, by its text alternative
 * 2. page.getByText() --> to locate by text context
 * 3. page.getByRole() --> to locate by explicit and implicit accessibility attributes
 * 4. page.getByLabel() --> to locate a form control by associated label's text
 * 5. page.getByPlaceholder() --> to locate an input by placeholder
 * 6. page.getByTitle() --> to locate an element by its title attribute
 * 7. page.getByTestId() --> to locate an element based on its data-testid attribute
 */

test("Playwright locators", async({page}) => {
    await page.goto("https://demo.nopcommerce.com");
    const logo = page.getByAltText("nopCommerce demo store")
    await expect(logo).toBeVisible();

    await expect(page.getByText("Welcome to our store")).toBeVisible();
    await expect(page.getByText("Welcome to")).toBeVisible();

    await page.getByRole("link", {name: 'Register'}).click();
    await expect(page.getByRole("heading", {name: 'Register'})).toBeVisible();

    await page.getByLabel("First name:").fill("John");
    await page.getByLabel("Last name:").fill("Smith");
    await page.getByLabel("Email:").fill("john.smith@xyz.com");

    await page.getByPlaceholder("Search store").fill("Apple Macbook Pro");

    // const link = await page.getByTitle("Home page link");
    // expect(link).toHaveText("Home");

    await expect(page.getByTestId("directions")).toHaveText("test@xyz.com");

})

