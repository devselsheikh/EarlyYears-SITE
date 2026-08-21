import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicRoutes = [
  '/',
  '/daycare',
  '/daycare/about',
  '/daycare/programs',
  '/daycare/parent-info',
  '/daycare/calendar',
  '/daycare/contact',
  '/daycare/parents',
  '/eduhub',
  '/eduhub/about',
  '/eduhub/programs',
  '/eduhub/programs/diploma',
  '/eduhub/contact',
  '/blog',
  '/blog/when-should-my-child-start-nursery',
  '/contact',
  '/workspace',
];

const staticImageRoutes = ['/daycare/about', '/eduhub/about', '/eduhub/programs'];

for (const route of publicRoutes) {
  test(`${route} renders without confirmed accessibility or overflow failures`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1_500);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('main').first()).toBeVisible();
    const overflow = await page.evaluate(() => ({
      amount: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      elements: [...document.querySelectorAll<HTMLElement>('body *')].filter(element => {
        const box = element.getBoundingClientRect();
        return box.right > document.documentElement.clientWidth + 1 || box.left < -1;
      }).slice(0, 8).map(element => { const box = element.getBoundingClientRect(); return `${element.tagName.toLowerCase()}.${element.className}[${box.left.toFixed(1)},${box.right.toFixed(1)};${getComputedStyle(element).transform}]`; }),
    }));
    expect(overflow.amount, `horizontal overflow on ${route}: ${overflow.elements.join(', ')}`).toBeLessThanOrEqual(1);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
    expect(results.violations, `axe violations on ${route}`).toEqual([]);
  });
}

for (const route of staticImageRoutes) {
  test(`${route} renders stable imagery from local semantic slots`, async ({ page }) => {
    await page.route(/(?:supabase\.co|images\.unsplash\.com)/, request => request.abort());
    await page.goto(route, { waitUntil: 'networkidle' });
    const images = page.locator('main img');
    await expect(images.first()).toBeVisible();
    const sources = await images.evaluateAll(elements => elements.map(element => (element as HTMLImageElement).getAttribute('src') ?? ''));
    expect(sources.every(source => source.includes('/images/slots/')), `non-local image on ${route}: ${sources.join(', ')}`).toBe(true);
  });
}

test('shared Parent Portal remains separate from child-linked accounts', async ({ page }) => {
  await page.goto('/daycare/parents');
  await expect(page.getByRole('heading', { name: 'Family Portal' })).toBeVisible();
  await expect(page.getByLabel('Parent Portal PIN')).toBeVisible();
  await expect(page.getByText('No individual child profile is required')).toBeVisible();
});

test('local workspace exposes all four functional role previews', async ({ page }) => {
  await page.goto('/workspace');
  for (const role of ['Owner', 'Admin', 'Teacher', 'Parent']) await expect(page.getByRole('button', { name: new RegExp(role) })).toBeVisible();
});

test('Owner preview exposes full operations and the technical console', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Owner/ }).click();
  await expect(page.getByRole('heading', { name: 'Owner workspace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Children & families' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Class setup' })).toBeVisible();
  await expect(page.getByText('Setup attention')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open console/ })).toHaveAttribute('href', '/admin');
  await expect(page.getByRole('button', { name: 'present' }).first()).toBeEnabled();
});

test('Admin preview operates children without exposing Owner technical controls', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Admin/ }).click();
  await expect(page.getByRole('heading', { name: 'Admin workspace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Children & families' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Class setup' })).toBeVisible();
  await page.getByText('Create a classroom').click();
  await page.getByLabel('Name').fill('Fireflies');
  await page.getByLabel('Age group').fill('4–5 years');
  await page.getByRole('button', { name: /Create classroom/ }).click();
  await expect(page.getByText('Fireflies classroom created.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open console/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'absent', exact: true }).click();
  await expect(page.getByText('Attendance saved on this device.')).toBeVisible();
  await page.getByLabel('Reply to family').fill('Thank you—we have noted that for tomorrow.');
  await page.getByRole('button', { name: /Send family message/ }).click();
  await expect(page.getByText('Thank you—we have noted that for tomorrow.')).toBeVisible();
});

test('Teacher preview is classroom-scoped and can publish family updates', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Teacher/ }).click();
  await expect(page.getByRole('heading', { name: 'Teacher workspace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My classroom' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Amira Hassan/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Lina Mostafa/ })).toHaveCount(0);
  await page.getByLabel('Add a learning update').fill('Built a careful tower during block play.');
  await page.getByRole('button', { name: /Publish update/ }).click();
  await expect(page.getByText('Family update saved on this device.')).toBeVisible();
  await page.getByRole('button', { name: 'Increase Water refills' }).click();
  await page.getByLabel('Care notes').fill('Rested after lunch and joined music time happily.');
  await page.getByRole('button', { name: /Publish to family/ }).click();
  await expect(page.getByText('Daily report published in local preview.')).toBeVisible();
  await expect(page.getByText('Published', { exact: true })).toBeVisible();
});

test('Parent account is child-scoped while preserving the separate shared portal', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Parent/ }).click();
  await expect(page.getByRole('heading', { name: 'Family account workspace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My child' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'present', exact: true })).toBeDisabled();
  await expect(page.getByRole('link', { name: /Open Parent Portal/ })).toHaveAttribute('href', '/daycare/parents');
  await expect(page.getByRole('heading', { name: 'Permissions' })).toBeVisible();
  await expect(page.getByText('The classroom team has not published today’s report yet.')).toBeVisible();
  await page.getByLabel('Message the team').fill('Amira will arrive ten minutes late tomorrow.');
  await page.getByRole('button', { name: /Send message/ }).click();
  await expect(page.getByText('Message saved on this device.')).toBeVisible();
});
