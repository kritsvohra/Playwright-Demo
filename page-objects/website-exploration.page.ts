import { Page, expect } from "@playwright/test";
import { BasePage, step } from "../base/base-page";

/**
 * Page object for Website Exploration functionality
 * Handles form submission, drag-and-drop, and alert operations
 */
export default class WebsiteExplorationPage extends BasePage {
    public elements: Record<string, any> = {};
    public page: import('@playwright/test').Page;
    constructor(page: import('@playwright/test').Page, config: any = {}) {
        super(page, config);
        this.page = page;
        this.registerElements();
    }
    private registerElements() {
        // Interactive elements with semantic locators
        this.elements.guiElementsLink = () => this.page.getByRole('link', { name: 'GUI Elements' });
        this.elements.nameField = () => this.page.getByPlaceholder('Enter Name');
        this.elements.emailField = () => this.page.getByPlaceholder('Enter EMail');
        this.elements.phoneField = () => this.page.getByPlaceholder('Enter Phone');
        this.elements.addressField = () => this.page.getByLabel('Address:');
        this.elements.submitButton = () => this.page.locator('input[type="submit"]');
        this.elements.draggable = () => this.page.getByText('Drag me to my target', { exact: true });
        this.elements.droppable = () => this.page.getByText('Drop here', { exact: true });
        this.elements.simpleAlertButton = () => this.page.getByText('Simple Alert', { exact: true });
        this.elements.singleFileInput = () => this.page.locator('input[type="file"]').first();
        this.elements.multiFileInput = () => this.page.locator('input[type="file"]').nth(1);
        this.elements.uploadSingleButton = () => this.page.getByText('Upload Single File', { exact: true });
        this.elements.uploadMultiButton = () => this.page.getByText('Upload Multiple Files', { exact: true });
        this.elements.staticTable = () => this.page.locator('table').first();
        this.elements.doubleClickButton = () => this.page.getByText('Copy Text', { exact: true });
        this.elements.mouseHoverButton = () => this.page.getByText('Point Me', { exact: true });
        this.elements.nonInteractive = () => this.page.getByText('Automation Testing Practice', { exact: true });
        this.elements.brokenLinks = () => this.page.locator('a').filter({ hasText: /Errorcode/ });

        // Verification elements
        this.elements.successMessage = () => this.page.getByText('Success', { exact: false });
        this.elements.requiredValidation = () => this.page.locator('body');

        // Accessibility elements
        this.elements.mainContent = () => this.page.getByRole('main');
        this.elements.navigationMenu = () => this.page.getByRole('navigation');
    }

    /**
     * Navigates to the main page and GUI Elements section
     */
    @step
    async gotoGuiElements(): Promise<void> {
        await this.page.goto('https://testautomationpractice.blogspot.com/');
        await this.elements.guiElementsLink().click();
    }

    /**
     * Fills and submits the form
     */
    @step
    async submitForm(name: string, email: string, phone: string, address: string): Promise<void> {
        await this.elements.nameField().fill(name);
        await this.elements.emailField().fill(email);
        await this.elements.phoneField().fill(phone);
        await this.elements.addressField().fill(address);
        await this.elements.submitButton().click();
    }

    /**
     * Submits the form with empty fields
     */
    @step
    async submitEmptyForm(): Promise<void> {
        await this.elements.submitButton().click();
    }

    /**
     * Performs drag and drop
     */
    @step
    async dragAndDrop(): Promise<void> {
        const draggable = await this.elements.draggable();
        const droppable = await this.elements.droppable();
        const dragBox = await draggable.boundingBox();
        const dropBox = await droppable.boundingBox();
        if (dragBox && dropBox) {
            await this.page.mouse.move(
                dragBox.x + dragBox.width / 2,
                dragBox.y + dragBox.height / 2
            );
            await this.page.mouse.down();
            await this.page.mouse.move(
                dropBox.x + dropBox.width / 2,
                dropBox.y + dropBox.height / 2
            );
            await this.page.mouse.up();
        }
    }

    /**
     * Clicks the Simple Alert button and accepts the alert
     */
    @step
    async handleSimpleAlert(): Promise<void> {
        await this.elements.simpleAlertButton().waitFor();
        this.page.once('dialog', dialog => dialog.accept());
        await this.elements.simpleAlertButton().click();
    }

    /**
     * Validates accessibility compliance
     */
    @step
    async validateAccessibility(): Promise<void> {
        // Only check for name field visibility as a minimal accessibility check
        await expect(this.elements.nameField()).toBeVisible();
    }

    @step
    async uploadFile(filePath: string, multiple = false): Promise<void> {
        if (multiple) {
            await this.elements.multiFileInput().setInputFiles([filePath, filePath]);
            await this.elements.uploadMultiButton().click();
        } else {
            await this.elements.singleFileInput().setInputFiles(filePath);
            await this.elements.uploadSingleButton().click();
        }
    }

    @step
    async doubleClickCopy(): Promise<void> {
        await this.elements.doubleClickButton().dblclick();
    }

    @step
    async mouseHover(): Promise<void> {
        await this.elements.mouseHoverButton().hover();
    }

    @step
    async getStaticTableData(): Promise<string[][]> {
        const rows = await this.elements.staticTable().locator('tr').all();
        return Promise.all(rows.map(async row => {
            const cells = await row.locator('th,td').allTextContents();
            return cells;
        }));
    }

    @step
    async checkBrokenLinks(): Promise<string[]> {
        const links = await this.elements.brokenLinks().all();
        const results: string[] = [];
        for (const link of links) {
            const url = await link.getAttribute('href');
            if (url) results.push(url);
        }
        return results;
    }

    @step
    async clickNonInteractive(): Promise<void> {
        await this.elements.nonInteractive().click();
    }
}
