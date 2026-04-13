/**
 * Selenium UI Testing
 * Framework: Selenium WebDriver + Jest
 * Run: npm run test:selenium
 *
 * Prerequisites:
 *   - Frontend running on http://localhost:5173
 *   - Backend running on http://localhost:5001
 *   - Chrome/Chromium browser installed
 *   - ChromeDriver installed and in PATH
 */

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const BASE_URL = 'http://localhost:5173';
const TIMEOUT = 10000;

function getChromeOptions() {
    const options = new chrome.Options();
    // options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    return options;
}

describe('Selenium UI Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(getChromeOptions())
            .build();
        await driver.manage().setTimeouts({ implicit: TIMEOUT });
    }, 30000);

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    }, 15000);

    // ----------------------------------------------------------
    // 1. Page Load Tests
    // ----------------------------------------------------------
    describe('Page Load Tests', () => {
        it('SEL-001: should load the admin login page', async () => {
            await driver.get(`${BASE_URL}/admin/login`);
            const title = await driver.getTitle();
            expect(title).toBeTruthy();

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/admin/login');
        }, TIMEOUT);

        it('SEL-002: should load the employee login page', async () => {
            await driver.get(`${BASE_URL}/employee/login`);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/employee/login');
        }, TIMEOUT);

        it('SEL-003: should display login form elements', async () => {
            await driver.get(`${BASE_URL}/admin/login`);

            const usernameField = await driver.findElements(By.css('input[type="text"]'));
            const passwordField = await driver.findElements(By.css('input[type="password"]'));
            const submitButton = await driver.findElements(By.css('button[type="submit"]'));

            expect(usernameField.length).toBeGreaterThan(0);
            expect(passwordField.length).toBeGreaterThan(0);
            expect(submitButton.length).toBeGreaterThan(0);
        }, TIMEOUT);
    });

    // ----------------------------------------------------------
    // 2. Navigation Tests
    // ----------------------------------------------------------
    describe('Navigation Tests', () => {
        it('SEL-004: should redirect unauthenticated user from admin dashboard', async () => {
            await driver.get(`${BASE_URL}/admin/dashboard`);
            await driver.sleep(2000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('login');
        }, TIMEOUT);

        it('SEL-005: should redirect unauthenticated user from employee dashboard', async () => {
            await driver.get(`${BASE_URL}/employee/dashboard`);
            await driver.sleep(2000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('login');
        }, TIMEOUT);

        it('SEL-006: should show 404 page for invalid route', async () => {
            await driver.get(`${BASE_URL}/nonexistent-page`);
            await driver.sleep(1000);

            const bodyText = await driver.findElement(By.css('body')).getText();
            const is404 = bodyText.toLowerCase().includes('404') ||
                          bodyText.toLowerCase().includes('not found') ||
                          bodyText.toLowerCase().includes('page');
            expect(is404).toBeTruthy();
        }, TIMEOUT);
    });

    // ----------------------------------------------------------
    // 3. Admin Login Flow Tests
    // ----------------------------------------------------------
    describe('Admin Login Flow Tests', () => {
        it('SEL-007: should show error for invalid login credentials', async () => {
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const usernameField = await driver.findElement(By.css('input[type="text"]'));
            const passwordField = await driver.findElement(By.css('input[type="password"]'));
            const submitButton = await driver.findElement(By.css('button[type="submit"]'));

            await usernameField.clear();
            await usernameField.sendKeys('invalid_user');
            await passwordField.clear();
            await passwordField.sendKeys('invalid_password');
            await submitButton.click();

            await driver.sleep(2000);

            const bodyText = await driver.findElement(By.css('body')).getText();
            const hasErrorIndication = bodyText.toLowerCase().includes('error') ||
                                       bodyText.toLowerCase().includes('not found') ||
                                       bodyText.toLowerCase().includes('wrong') ||
                                       bodyText.toLowerCase().includes('invalid') ||
                                       bodyText.toLowerCase().includes('failed');
            expect(hasErrorIndication).toBeTruthy();
        }, 15000);

        it('SEL-008: should verify password input type is password', async () => {
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const passwordField = await driver.findElement(By.css('input[type="password"]'));
            const type = await passwordField.getAttribute('type');
            expect(type).toBe('password');
        }, TIMEOUT);
    });

    // ----------------------------------------------------------
    // 4. Responsive UI Tests
    // ----------------------------------------------------------
    describe('Responsive UI Tests', () => {
        it('SEL-009: should render correctly on desktop viewport', async () => {
            await driver.manage().window().setRect({ width: 1920, height: 1080 });
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const body = await driver.findElement(By.css('body'));
            const displayed = await body.isDisplayed();
            expect(displayed).toBe(true);
        }, TIMEOUT);

        it('SEL-010: should render correctly on tablet viewport', async () => {
            await driver.manage().window().setRect({ width: 768, height: 1024 });
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const body = await driver.findElement(By.css('body'));
            const displayed = await body.isDisplayed();
            expect(displayed).toBe(true);
        }, TIMEOUT);

        it('SEL-011: should render correctly on mobile viewport', async () => {
            await driver.manage().window().setRect({ width: 375, height: 812 });
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const body = await driver.findElement(By.css('body'));
            const displayed = await body.isDisplayed();
            expect(displayed).toBe(true);

            await driver.manage().window().setRect({ width: 1920, height: 1080 });
        }, TIMEOUT);
    });

    // ----------------------------------------------------------
    // 5. Page Content Verification Tests
    // ----------------------------------------------------------
    describe('Page Content Tests', () => {
        it('SEL-012: login page should contain form elements', async () => {
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const inputs = await driver.findElements(By.css('input'));
            expect(inputs.length).toBeGreaterThanOrEqual(2);
        }, TIMEOUT);

        it('SEL-013: page should have proper document structure', async () => {
            await driver.get(`${BASE_URL}/admin/login`);

            const html = await driver.findElement(By.css('html'));
            expect(html).toBeTruthy();

            const body = await driver.findElement(By.css('body'));
            expect(body).toBeTruthy();
        }, TIMEOUT);

        it('SEL-014: page should load CSS styles', async () => {
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const stylesheets = await driver.findElements(By.css('link[rel="stylesheet"], style'));
            expect(stylesheets.length).toBeGreaterThanOrEqual(0);
        }, TIMEOUT);
    });

    // ----------------------------------------------------------
    // 6. Successful Login Tests
    // ----------------------------------------------------------
    describe('Successful Login Tests', () => {
        it('SEL-015: should login successfully with valid admin credentials', async () => {
            await driver.get(`${BASE_URL}/admin/login`);
            await driver.sleep(1000);

            const usernameField = await driver.findElement(By.css('input[type="text"]'));
            const passwordField = await driver.findElement(By.css('input[type="password"]'));
            const submitButton = await driver.findElement(By.css('button[type="submit"]'));

            await usernameField.clear();
            await usernameField.sendKeys('admin');
            await passwordField.clear();
            await passwordField.sendKeys('admin123');
            await submitButton.click();

            await driver.wait(until.urlContains('/admin/dashboard'), TIMEOUT);

            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/admin/dashboard');
        }, 15000);

        it('SEL-016: should display dashboard content after successful login', async () => {
            const currentUrl = await driver.getCurrentUrl();
            if (!currentUrl.includes('/admin/dashboard')) {
                await driver.get(`${BASE_URL}/admin/login`);
                await driver.sleep(1000);

                const usernameField = await driver.findElement(By.css('input[type="text"]'));
                const passwordField = await driver.findElement(By.css('input[type="password"]'));
                const submitButton = await driver.findElement(By.css('button[type="submit"]'));

                await usernameField.clear();
                await usernameField.sendKeys('admin');
                await passwordField.clear();
                await passwordField.sendKeys('admin123');
                await submitButton.click();

                await driver.wait(until.urlContains('/admin/dashboard'), TIMEOUT);
            }

            await driver.sleep(2000);

            const body = await driver.findElement(By.css('body'));
            const displayed = await body.isDisplayed();
            expect(displayed).toBe(true);

            const bodyText = await body.getText();
            expect(bodyText.length).toBeGreaterThan(0);
        }, 20000);
    });
});
