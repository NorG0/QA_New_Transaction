import { BasePage } from './BasePage';

class TransactionSummaryPage extends BasePage {
  constructor(page) {
    super(page);
    this.summaryContent = page.locator('#summaryContent');
    this.transactionSummaryTitle = page.getByRole('heading', {
      name: 'Transaction Summary',
      level: 1,
    });
    this.transactionID = page.locator('p').filter({ hasText: 'Transaction ID:' });
    this.buyerName = page.locator('p').filter({ hasText: 'Buyer Name:' });
    this.buyerEmail = page.locator('p').filter({ hasText: 'Buyer Email:' });
    this.buyerPhone = page.locator('p').filter({ hasText: 'Buyer Phone:' });
    this.propertyAddress = page.locator('p').filter({ hasText: 'Property Address:' });
    this.postalCode = page.locator('p').filter({ hasText: 'Postal Code:' });
    this.salePrice = page.locator('p').filter({ hasText: 'Sale Price (SGD):' });
    this.ownerShipDocName = page.locator('p').filter({ hasText: 'Ownership Document Name:' });
    this.createAnotherTrans = page.getByRole('link', { name: 'Create Another Transaction' });
  }

  getTransactionSummaryResultText = async () => {
    const transactionID = await this.transactionID.innerText();
    const buyerName = await this.buyerName.innerText();
    const buyerEmail = await this.buyerEmail.innerText();
    const buyerPhone = await this.buyerPhone.innerText();
    const propertyAddress = await this.propertyAddress.innerText();
    const postalCode = await this.postalCode.innerText();
    const salePrice = await this.salePrice.innerText();
    const ownerShipDocName = await this.ownerShipDocName.innerText();

    return {
      [transactionID]: 'Transaction ID:',
      [buyerName]: 'Buyer Name:',
      [buyerEmail]: 'Buyer Email:',
      [buyerPhone]: 'Buyer Phone:',
      [propertyAddress]: 'Property Address:',
      [postalCode]: 'Postal Code:',
      [salePrice]: 'Sale Price (SGD):',
      [ownerShipDocName]: 'Ownership Document Name:',
    };
  };

  extractFieldsValue(fieldText) {
    let values = [];
    for (const [fullText, replacedText] of Object.entries(fieldText)) {
      let value = fullText.replace(replacedText, '').trim();
      values.push(value);
    }
    const [
      transactionID,
      buyerName,
      buyerEmail,
      buyerPhone,
      propertyAddress,
      postalCode,
      salePrice,
      ownerShipDocName,
    ] = values;

    return {
      transactionID,
      buyerName,
      buyerEmail,
      buyerPhone,
      propertyAddress,
      postalCode,
      salePrice,
      ownerShipDocName,
    };
  }

  async verifyTransactionData(test, expect, testData) {
    const summaryText = await this.getTransactionSummaryResultText();
    const actualData = this.extractFieldsValue(summaryText);

    expect.soft(actualData.buyerName, 'Buyer Name should match').toBe(testData.buyerName);
    expect.soft(actualData.buyerEmail, 'Buyer Email should match').toBe(testData.buyerEmail);
    expect.soft(actualData.buyerPhone, 'Buyer Phone should match').toBe(testData.buyerPhone);
    expect
      .soft(actualData.propertyAddress, 'Property Address should match')
      .toBe(testData.propertyAddress);
    expect.soft(actualData.postalCode, 'Postal Code should match').toBe(testData.postalCode);
    expect.soft(actualData.salePrice, 'Sale Price should match').toBe(testData.salePrice);

    const expectedFileName = testData.fileName.split('/').pop().split('\\').pop();
    const actualFileName = actualData.ownerShipDocName.replace('.pdf', '');
    expect.soft(actualFileName, 'Ownership Document Name should match').toBe(expectedFileName);

    expect.soft(actualData.transactionID, 'Transaction ID should exist').toBeTruthy();
    expect
      .soft(actualData.transactionID.length, 'Transaction ID should not be empty')
      .toBeGreaterThan(0);

    if (test.info().errors.length > 0) {
      throw new Error('Assertion failures.');
    }
  }
}

export { TransactionSummaryPage };
