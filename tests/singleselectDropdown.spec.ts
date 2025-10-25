import {test, expect, Locator} from "@playwright/test";
import { text } from "stream/consumers";

test("Single select dropdown", async ({page}) => {
    await page.goto("https://testautomationpractice.blogspot.com/");

    // Select option from dropdown (4 ways)
    await page.locator("#country").selectOption('India');   // Visible text
    await page.locator("#country").selectOption({value: 'india'});  // By using value attribute
    await page.locator("#country").selectOption({label: 'India'});  // By using label
    await page.locator("#country").selectOption({index: 3});    // by using index of element

    // Check number of options in the dropdown (count)
    const dropdownOptions: Locator = page.locator("#country>option");
    await expect(dropdownOptions).toHaveCount(10);

    // Check an option present in the dropdown
    const optionsText: string[] = (await dropdownOptions.allTextContents()).map(text=>text.trim());
    console.log(optionsText);
    expect(optionsText).toContain('Japan');

    // Printing options from dropdown
    for(const option of optionsText){
        console.log(option)
    }

    await page.waitForTimeout(5000);

    

})