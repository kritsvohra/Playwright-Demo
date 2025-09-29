/**
 * CSS (Cascading Style Sheet)
 * 
 * 2 types of CSS
 * 1. Absolute CSS
 * 2. Relative CSS
 * 
 * 
 * tag with id  --> tag#id
 * tag with class   --> tag.class
 * tag with any other attribute --> tag[attribute=value]
 * tag with class and attribute --> tag.class[attribute=value]
 * 
 * page.locator(css/xpath)
 */

import {test, expect} from '@playwright/test';

test("Verify CSS locator", async ({page}) => {
    await page.goto("https://demowebshop.tricentis.com/");
    await expect(page.locator("input#small-searchterms")).toBeVisible();
    await page.locator("input#small-searchterms").fill("T-shirts");

    await page.locator("input.search-box-text.ui-autocomplete-input").fill("T-Shirts");

    await page.locator("input[name='q']").fill("T-Shirts");

    await page.locator("input.search-box-text.ui-autocomplete-input[name='q']").fill("T-Shirts");
})


