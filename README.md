# QA_New_Transaction - Test Assignment

## Deployment & Setup

### 1. Install Dependencies
Run the following command to install the project dependencies (including Playwright and http-server):
```bash
npm install
# Or for a clean install
npm ci
```
Note: If this is the first time running Playwright, you may also need to install the browsers:
```bash
npx playwright install --with-deps
```

### 2. Run Playwright Tests
To execute the end-to-end tests:
```bash
npx playwright test
```
To run tests with a UI reporter:
```bash
npx playwright test --ui
```
This command handles starting the local server automatically (via `webServer` config) and running the tests in the configured browsers.

### 3. Application Execution & Server
The application **is not run directly** (e.g., `file://...`). Instead, it is served via a local web server to ensure correct behavior (especially for module loading and CORS).

- **Server Tool**: `http-server`
- **Configuration**: The `playwright.config.js` is set to auto-start the server using:
  ```bash
  npx http-server . -p 8080
  ```
- **Test URL**: The tests access the application at `http://127.0.0.1:8080/`.
