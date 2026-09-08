import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'screenshots');
const BASE = 'http://localhost:5173';
const ORDER_ID = process.env.RAKZA_ORDER_ID || '8';
const PRODUCT_ID = process.env.RAKZA_PRODUCT_ID || '36';
const ROW_ID = process.env.RAKZA_ROW_ID || '1';
const BIN_ID = process.env.RAKZA_BIN_ID || '1';

const USERS = {
  admin: { email: 'admin@rakza.local', password: 'Admin123!' },
  agent: { email: 'agent@rakza.local', password: 'Agent123!' },
  warehouse: { email: 'warehouse@rakza.local', password: 'Wh123!' },
  driver: { email: 'driver@rakza.local', password: 'Drv123!' },
  superAdmin: { email: 'super@rakza.local', password: 'Super123!' },
};

async function snap(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('saved', name);
  return file;
}

async function loginUser(page, creds, superAdmin = false) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#email', creds.email);
  await page.fill('#password', creds.password);
  await page.click('button[type="submit"]');
  if (superAdmin) {
    await page.waitForURL(/super-admin/, { timeout: 15000 });
  } else {
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  }
  await page.waitForTimeout(800);
}

async function logout(page) {
  await page.evaluate(() => {
    localStorage.removeItem('rakza_token');
    localStorage.removeItem('rakza_sa_token');
  });
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
}

async function visit(page, route, name) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  return snap(page, name);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'he-IL',
  });
  const page = await context.newPage();

  // Public
  await visit(page, '/', '00-public-landing');
  await visit(page, '/login', '01-public-login');

  // Admin
  await loginUser(page, USERS.admin);
  await visit(page, '/', '10-admin-dashboard');
  await visit(page, '/orders', '11-admin-orders');
  await visit(page, `/orders/${ORDER_ID}`, '12-admin-order-detail');
  await visit(page, '/products', '13-admin-products');
  await visit(page, `/products/${PRODUCT_ID}`, '14-admin-product-edit');
  await visit(page, '/products/new', '15-admin-product-new');
  await visit(page, '/customers', '16-admin-customers');
  await visit(page, '/warehouse', '17-admin-warehouse-map');
  await visit(page, `/warehouse/rows/${ROW_ID}`, '18-admin-warehouse-row');
  await visit(page, `/warehouse/bins/${BIN_ID}`, '19-admin-warehouse-bin');
  await visit(page, '/users', '20-admin-users');
  await visit(page, '/settings', '21-admin-settings');
  await logout(page);

  // Agent
  await loginUser(page, USERS.agent);
  await visit(page, '/', '30-agent-sales');
  await visit(page, '/orders/new', '31-agent-new-order');
  await visit(page, '/my-orders', '32-agent-my-orders');
  await visit(page, '/customers', '33-agent-customers');
  await logout(page);

  // Warehouse
  await loginUser(page, USERS.warehouse);
  await visit(page, '/orders', '40-warehouse-pick-list');
  await visit(page, `/orders/${ORDER_ID}`, '41-warehouse-order-pick');
  await visit(page, '/warehouse', '42-warehouse-map');
  await visit(page, `/warehouse/bins/${BIN_ID}`, '43-warehouse-bin');
  await logout(page);

  // Driver
  await loginUser(page, USERS.driver);
  await visit(page, '/', '50-driver-deliveries');
  await logout(page);

  // Super-admin
  await loginUser(page, USERS.superAdmin, true);
  await visit(page, '/super-admin/dashboard', '60-sa-companies');
  await visit(page, '/super-admin/analytics', '61-sa-analytics');
  await visit(page, '/super-admin/settings', '62-sa-billing');
  await visit(page, '/super-admin/logs', '63-sa-logs');

  await browser.close();
  console.log('done', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
