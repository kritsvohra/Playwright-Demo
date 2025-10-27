import {test, expect} from '@playwright/test';
import { off } from 'process';

test("Bootstrap dropdown", async({page})=> {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    // Login steps
    await page.locator("input[name='username']").fill("Admin");
    await page.locator("input[name='password']").fill("admin123");
    await page.locator("button[type='submit']").click();

    // Click on the PIM
    await page.getByText("PIM").click();

    // Click on Job Title dropdown
    await page.locator("form i").nth(2).click();
    await page.waitForTimeout(3000);

    // Capture all the options from dropdown
    const options = page.locator("div[role='listbox'] span");
    const count = await options.count();
    console.log("Number of options in the dropdown :: ",count);

    // Print all the options
    console.log("Printing all the options")
    for(let i=0; i<count; i++){
        console.log(await options.nth(i).innerText());
    }

    // Select / click on option
    for(let i=0; i<count; i++){
        const text = await options.nth(i).innerText()
        if(text === 'QA Lead'){
            await options.nth(i).click();
        }
    }

})