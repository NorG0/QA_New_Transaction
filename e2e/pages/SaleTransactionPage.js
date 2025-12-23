const { BasePage } = require("./BasePage");
const path = require("path");

class SaleTransactionPage extends BasePage {
    constructor(page) {
        super(page);
        this.transactionForm = page.locator('#transactionForm');
        this.transactionTitle = page.getByRole('heading', { name: 'New Sale Transaction', level: 1 });
        this.buyerName = page.getByLabel('Buyer Name *');
        this.buyerEmail = page.getByLabel('Buyer Email *');
        this.buyerPhone = page.getByLabel('Buyer Phone (SG) *');
        this.propertyAddress = page.getByLabel('Property Address *');
        this.postalCode = page.getByLabel('Postal Code (6 digits, SG) *');
        this.salePrice = page.getByLabel('Sale Price (SGD) *');
        this.uploadDoc = page.locator('#ownershipDocument');
        this.submitButton = page.locator('#submitButton');

        //Error Messages
        this.buyerNameError = page.locator('#buyerNameError');
        this.buyerEmailError = page.locator('#buyerEmailError');
        this.buyerPhoneError = page.locator('#buyerPhoneError');
        this.propertyAddressError = page.locator('#propertyAddressError');
        this.postalCodeError = page.locator('#postalCodeError');
        this.salePriceError = page.locator('#salePriceError');
        this.ownershipDocumentError = page.locator('#ownershipDocumentError');
        this.fileNameError = page.locator('#ownershipDocumentError');
        this.formError = page.locator('#formMessage');
    }

    async fillTransactionForm(formData) {
        await this.buyerName.fill(formData.buyerName || '');
        await this.buyerEmail.fill(formData.buyerEmail || '');
        await this.buyerPhone.fill(formData.buyerPhone || '');
        await this.propertyAddress.fill(formData.propertyAddress || '');
        await this.postalCode.fill(formData.postalCode || '');
        await this.salePrice.fill(formData.salePrice || '');
        //Upload File
        if (formData.fileName) {
            await this.uploadDoc.setInputFiles(path.join(__dirname, `${formData.fileName}.pdf`));
        }
    }



    async getTransactionErrorMessages() {
        return {
            buyerName: await this.buyerNameError.innerText(),
            buyerEmail: await this.buyerEmailError.innerText(),
            buyerPhone: await this.buyerPhoneError.innerText(),
            propertyAddress: await this.propertyAddressError.innerText(),
            postalCode: await this.postalCodeError.innerText(),
            salePrice: await this.salePriceError.innerText(),
            ownershipDocument: await this.ownershipDocumentError.innerText()
        };
    }

    async verifyTransactionErrorMessages(test, expect, expectedErrors) {
        const actualErrors = await this.getTransactionErrorMessages();

        if (expectedErrors.buyerName) expect.soft(actualErrors.buyerName, 'Buyer Name Error should match').toBe(expectedErrors.buyerName);
        if (expectedErrors.buyerEmail) expect.soft(actualErrors.buyerEmail, 'Buyer Email Error should match').toBe(expectedErrors.buyerEmail);
        if (expectedErrors.buyerPhone) expect.soft(actualErrors.buyerPhone, 'Buyer Phone Error should match').toBe(expectedErrors.buyerPhone);
        if (expectedErrors.propertyAddress) expect.soft(actualErrors.propertyAddress, 'Property Address Error should match').toBe(expectedErrors.propertyAddress);
        if (expectedErrors.postalCode) expect.soft(actualErrors.postalCode, 'Postal Code Error should match').toBe(expectedErrors.postalCode);
        if (expectedErrors.salePrice) expect.soft(actualErrors.salePrice, 'Sale Price Error should match').toBe(expectedErrors.salePrice);
        // Map 'fileName' from test data to 'ownershipDocument' in page object
        if (expectedErrors.fileName) expect.soft(actualErrors.ownershipDocument, 'Ownership Document Error should match').toBe(expectedErrors.fileName);
        if (test.info().errors.length > 0) {
            throw new Error('Assertion failures.');
        }
    }
}

module.exports = { SaleTransactionPage };
