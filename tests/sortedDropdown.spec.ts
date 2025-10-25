import {test, expect, Locator} from '@playwright/test';

test("Verify Dropdown is sorted or not", async ({page})=> {
    await page.goto("https://testautomationpractice.blogspot.com/");

    const dropdownOptions: Locator = page.locator("#animals>option");
    //const dropdownOptions: Locator = page.locator("#colors>option");
    const optionsText = (await dropdownOptions.allTextContents()).map(text=>text.trim());
    console.log(optionsText);

    const originalList = [...optionsText];
    const sortedList = [...optionsText].sort();

    console.log("Original List::",originalList);
    console.log("Sorted List::", sortedList);

    expect(originalList).toEqual(sortedList);
    await page.waitForTimeout(5000);
})