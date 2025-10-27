import {test, expect, Locator} from '@playwright/test';

test("Autosuggest dropdown", async({page})=> {

    await page.goto("https://www.flipkart.com/");
    await page.locator("input[name='q']").fill("smart");
    await page.waitForTimeout(5000);
    
    // Get all the suggested options --> COmmand+Shift+P on DOM ==> emulate focused page
    const options:Locator = page.locator("ul>li");
    const count = await options.count();
    console.log("Number of suggested options :: ",count);

    // Print all the suggested options in the dropdown
    console.log("Printing all the auto suggestions")
    for(let i = 0; i<count; i++){
        //console.log(await options.nth(i).innerText());
        console.log(await options.nth(i).textContent())
    }

    // Select / Click on smart phone option
    for(let i = 0; i<count; i++){
        const text = await options.nth(i).innerText();
        if(text === 'smartphone'){
            await options.nth(i).click();
            break;
        }    
    }
})