import {test, expect} from '@playwright/test';

test("Multi select dropdown", async ({page}) => {

    await page.goto("https://testautomationpractice.blogspot.com/");

    // Select option from dropdown (4 ways)
    await page.locator("#colors").selectOption(['Red','Blue','Green']); // using visible text
    await page.locator("#colors").selectOption(['red','green','white']);    // using value atribute
    await page.locator("#colors").selectOption([{label: 'Red'}, {label: 'Green'}, {label: 'White'}]);   // using label attribute
    await page.locator("#colors").selectOption([{index:0}, {index: 2}, {index: 4}]);

    // Check the number of options in the dropdown
    const dropdownOptions  = await page.locator("#colors>option");
    await expect(dropdownOptions).toHaveCount(7);

    // Check option present in the dropdown
    const optionsText: string[] = (await dropdownOptions.allTextContents()).map(text=>text.trim());
    console.log(optionsText);

    expect(optionsText).toContain("Green");

    // Printing options from dropdown
    for(const option of optionsText){
        console.log(option);
    }

    
})