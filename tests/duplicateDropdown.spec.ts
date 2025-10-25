import {test, expect, Locator} from '@playwright/test';
import { has } from 'lodash';
import { text } from 'stream/consumers';

test("Verify Dropdown contain duplicates", async ({page})=> {
    await page.goto("https://testautomationpractice.blogspot.com/");

    const dropdownOptions: Locator = page.locator("#colors>option");  // having duplicates
    //const dropdownOptions: Locator = page.locator("#animals>option");   // not having duplicates
    
    const optionsText:string[] = (await dropdownOptions.allTextContents()).map(text=>text.trim());

    const mySet = new Set<String>();    // Set => Duplictaes not allowed
    const duplicates:string[] = []; //Array=> Duplicates allowed

    for(const text of optionsText){
        if(mySet.has(text)){
            duplicates.push(text);
        }else {
            mySet.add(text);
        }
    }

    console.log("Duplicate options are::",duplicates);

    if(duplicates.length > 0){
        console.log("Duplicate options found..", duplicates);
    }else {
        console.log("No duplicates found");
    }
    
    await page.waitForTimeout(5000);
})