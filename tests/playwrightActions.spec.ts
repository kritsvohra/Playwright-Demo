import {test, expect, Locator} from '@playwright/test';


// Text input / text box / input box
test("Test Input Actions", async ({page}) => {

    await page.goto("https://testautomationpractice.blogspot.com");
    const textBox : Locator = page.locator("#name");
    await expect(textBox).toBeVisible();
    await expect(textBox).toBeEnabled();
    const maxLength = await textBox.getAttribute('maxlength');

    await expect(maxLength).toBe("15");

    await textBox.fill("John Keneddy");
    const enteredValue = await textBox.inputValue();
    console.log("Text content of FirstName :: ",enteredValue);
    await expect(enteredValue).toBe("John Keneddy");
});

test("Radio button actions", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com");
    const maleRadioButton = await page.locator("#male");
    await expect(maleRadioButton).toBeVisible();
    await expect(maleRadioButton).toBeEnabled();
    await expect(maleRadioButton).not.toBeChecked();

    await maleRadioButton.check();
    await expect(maleRadioButton).toBeChecked();

})

test("Checkbox Actions", async({page})=> {
    await page.goto("https://testautomationpractice.blogspot.com");
    const sundayCheckbox = await page.getByLabel("Sunday");

    // await sundayCheckbox.check();
    // await expect(sundayCheckbox).toBeChecked();

    // Select all checkboxes and assert each is checked
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const checkboxes: Locator[] = days.map(index => page.getByLabel(index));
    expect(checkboxes.length).toBe(7);

    for(const checkbox of checkboxes){
        await checkbox.check();
    }

    // UnSelect last 3 checkboxes and assert
    for(const checkbox of checkboxes.slice(-3)){
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
    }

    // Check checkboxes which are unchecked and uncheck checkboxes which are checked
    for(const checkbox of checkboxes) {
        if (await checkbox.isChecked) {
            // Only if checked
            await checkbox.uncheck();
            await expect(checkbox).not.toBeChecked();
        } else {
            // Only if not checked
            await checkbox.check();
            await expect(checkbox).toBeChecked();
        }
    }
})
