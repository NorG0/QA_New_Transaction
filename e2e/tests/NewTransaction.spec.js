const { expect, test } = require('@playwright/test');
const { SaleTransactionPage } = require('../pages/SaleTransactionPage');
const { TransactionSummaryPage } = require('../pages/TransactionSummaryPage');
const { generateTestData } = require('../utils/createTestData');

const errorMessages = {
    requiredFields: {
        buyerName: 'Buyer name is required.',
        buyerEmail: 'Buyer email is required.',
        buyerPhone: 'Buyer phone is required.',
        propertyAddress: 'Property address is required.',
        postalCode: 'Postal code is required.',
        salePrice: 'Sale price is required.',
        fileName: 'Ownership document is required.',
    },
    invalidFields: {
        invalidEmail: 'Invalid email format.',
        invalidPhoneNumber: 'Phone must be 8 digits, starting with 8 or 9.',
        invalidPostalCode: 'Postal code must be 6 digits.',
        invalidSalePrice: 'Sale price must be a positive number.',
        invalidFileName: 'File size must not exceed 10MB.'
    },
    formError: 'Please fix the errors above and resubmit.'
};



test.describe('Verify Transaction Form submition', async () => {
    /** @type {SaleTransactionPage} */
    let saletransactionPage;
    /** @type {TransactionSummaryPage} */
    let transactionSummaryPage;
    test.beforeEach('Setup local app', async ({ page }) => {
        saletransactionPage = new SaleTransactionPage(page);
        transactionSummaryPage = new TransactionSummaryPage(page);
        await saletransactionPage.gotoURL();
        await expect(saletransactionPage.transactionTitle).toBeVisible();
        await expect(saletransactionPage.transactionForm).toBeVisible();
    });

    test('Verify submition transaction should work correctly', async ({ page }) => {
        const testData = generateTestData(
            {
                isPhoneNumber: true,
                propertyAddress: 'No 1, Thu Duc City',
                isPostalCode: true,
                salePrice: '1234',
                fileName: '../test_data/CUDA'
            });

        await saletransactionPage.fillTransactionForm(testData);
        await saletransactionPage.submitButton.click();

        await page.waitForURL('**/summary**');
        await expect(transactionSummaryPage.summaryContent).toBeVisible();
        await expect(transactionSummaryPage.transactionSummaryTitle).toBeVisible();

        await transactionSummaryPage.verifyTransactionData(test, expect, testData);
    });

    test('Verify submition transaction should show error message when no inputing', async ({ page }) => {

        await saletransactionPage.fillTransactionForm({});
        await saletransactionPage.submitButton.click();

        await expect(transactionSummaryPage.summaryContent).toBeHidden();
        await expect(transactionSummaryPage.transactionSummaryTitle).toBeHidden();

        await saletransactionPage.verifyTransactionErrorMessages(test, expect, errorMessages.requiredFields);
    });

    test('Verify submition transaction should show error message when invalid inputing', async ({ page }) => {
        const testData = generateTestData(
            {
                emailType: 'missingDomain',
                isPhoneNumber: false,
                propertyAddress: 'No 1, Thu Duc City',
                isPostalCode: true,
                salePrice: '1234',
                fileName: '../test_data/NVIDIA'
            });

        await saletransactionPage.fillTransactionForm(testData);
        await saletransactionPage.submitButton.click();

        await expect(transactionSummaryPage.summaryContent).toBeHidden();
        await expect(transactionSummaryPage.transactionSummaryTitle).toBeHidden();

        await expect(saletransactionPage.buyerEmailError).toHaveText(errorMessages.invalidFields.invalidEmail);
        await expect(saletransactionPage.buyerPhoneError).toHaveText(errorMessages.invalidFields.invalidPhoneNumber);
        await expect(saletransactionPage.fileNameError).toHaveText(errorMessages.invalidFields.invalidFileName);
        await expect(saletransactionPage.formError).toHaveText(errorMessages.formError);
    });

})
