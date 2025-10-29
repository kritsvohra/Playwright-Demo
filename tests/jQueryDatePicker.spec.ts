import {test, expect, Locator} from '@playwright/test';

test("JQuery Date Picker", async ({page}) => {
    await page.goto("https://testautomationpractice.blogspot.com/");
    const dateInput: Locator = await page.locator("#datepicker").nth(0);
    await expect(dateInput).toBeVisible();

    // Using fill
    // dateInput.fill("11/20/2025");

    // Using DatePicker
    await dateInput.click();    // opens the date picker

    // Select target date
    const year = "2023";
    const month = "November";
    const date = "15";

    while(true){
        const currentMonth = await page.locator(".ui-datepicker-month").textContent();
        const currentYear = await page.locator(".ui-datepicker-year").textContent();

        if(currentMonth=== month && currentYear === year) {
            break;
        }

        // Future
        // await page.locator(".ui-icon.ui-icon-circle-triangle-e").click();

        // Past
        await page.locator(".ui-icon.ui-icon-circle-triangle-w").click();

    }

    const allDates = await page.locator(".ui-datepicker-calendar td").all();

    for(let dt of allDates){
        const dateText = await dt.innerText();

        if(dateText === date){
            dt.click();
            break;
        }
    }

    await page.waitForTimeout(2000);

})