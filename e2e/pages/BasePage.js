class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'http://127.0.0.1:8080/';
  }

  async gotoURL(option = '') {
    await this.page.goto(`${this.baseUrl}${option}`, { waitUntil: 'domcontentloaded' });
  }
}

export { BasePage };
