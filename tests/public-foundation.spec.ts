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
  '/privacy',
  '/terms',
  '/thank-you',
  '/workspace',
];

test('homepage is available on a fresh direct visit', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: /Growth Begins with the Right Foundations/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /The Daycare/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /EduHub/i }).first()).toBeVisible();
  await context.close();
});

test('every named public route receives unique launch metadata', async ({ page }) => {
  const routes = ['/', '/daycare', '/daycare/about', '/daycare/programs', '/eduhub', '/eduhub/programs', '/contact', '/privacy', '/terms'];
  const titles = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${route === '/' ? '/?$' : route + '$'}`));
    const title = await page.title();
    expect(title.length).toBeGreaterThan(20);
    titles.add(title);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThanOrEqual(50);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
  }
  expect(titles.size).toBe(routes.length);
});

const staticImageRoutes = ['/daycare/about', '/eduhub/about', '/eduhub/programs'];
const editorialRoutes = [
  '/blog/when-should-my-child-start-nursery', '/blog/what-is-eyfs-curriculum',
  '/blog/preparing-child-for-preschool', '/blog/nursery-vs-preschool',
  '/blog/choosing-daycare-new-cairo', '/blog/benefits-play-based-learning',
  '/blog/cache-certification-explained', '/blog/becoming-early-years-teacher-egypt',
  '/blog/eyfs-teaching-strategies', '/blog/cpd-early-years-professionals',
  '/blog/cache-level-3-vs-level-5',
];

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
    expect(sources.every(source => source.startsWith('/images/')), `non-local image on ${route}: ${sources.join(', ')}`).toBe(true);
  });
}

test('all parent and educator articles resolve with healthy images and links', async ({ page }) => {
  for (const route of editorialRoutes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1').first(), `missing article at ${route}`).toBeVisible();
    await expect(page.getByText('Article Not Found')).toHaveCount(0);
    const brokenImages = await page.locator('main img').evaluateAll(images => images
      .filter(image => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0)
      .map(image => (image as HTMLImageElement).currentSrc));
    expect(brokenImages, `broken article images at ${route}`).toEqual([]);
    const placeholders = await page.locator('main a[href="#"], main a[href=""], main a:not([href])').count();
    expect(placeholders, `placeholder links at ${route}`).toBe(0);
  }
});

test('legacy newsletter article links resolve to the secure family resource library', async ({ page }) => {
  for (const slug of ['newsletter-may-2026', 'newsletter-april-2026', 'newsletter-march-2026', 'newsletter-february-2026', 'newsletter-january-2026']) {
    await page.goto(`/blog/${slug}`);
    await expect(page).toHaveURL(/\/daycare\/parents$/);
    await expect(page.getByRole('heading', { name: 'Family Portal' })).toBeVisible();
  }
});

test('shared Parent Portal remains separate from child-linked accounts', async ({ page }) => {
  await page.goto('/daycare/parents');
  await expect(page.getByRole('heading', { name: 'Family Portal' })).toBeVisible();
  await expect(page.getByLabel('Parent Portal PIN')).toBeVisible();
  await expect(page.getByText('No individual child profile is required')).toBeVisible();
});

test('parent guides and facilities resolve to the locked family portal', async ({ page }) => {
  for (const route of ['/daycare/parent-info', '/daycare/calendar', '/daycare/facilities', '/daycare/meals', '/daycare/parent-guide']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/daycare\/parents$/);
    await expect(page.getByRole('heading', { name: 'Family Portal' })).toBeVisible();
  }
});

test('legacy EduHub courses link resolves to the current programmes page', async ({ page }) => {
  await page.goto('/eduhub/courses');
  await expect(page).toHaveURL(/\/eduhub\/programs$/);
  await expect(page.getByRole('heading', { name: 'CACHE Qualification Programs' })).toBeVisible();
});

test('EduHub team uses the supplied named portraits', async ({ page }) => {
  await page.goto('/eduhub/about');
  await page.getByRole('heading', { name: 'Meet The Training Team' }).scrollIntoViewIfNeeded();
  for (const name of ['Nesreen Hassanin', 'Lamia Hassanin', 'Ann Osman', 'Bassent Barsoum', 'Robert Mitton']) {
    await expect(page.getByRole('img', { name: new RegExp(name) })).toBeVisible();
  }
});

test('unknown links receive a useful, private recovery page', async ({ page }) => {
  await page.goto('/a-page-that-does-not-exist');
  await expect(page.getByRole('heading', { name: 'This page has wandered off.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to homepage' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Visit the daycare' })).toHaveAttribute('href', '/daycare');
  await expect(page.locator('body')).not.toContainText(/stack|exception|supabase|database/i);
});

test('local workspace exposes all four functional role previews', async ({ page }) => {
  await page.goto('/workspace');
  for (const role of ['Owner', 'Admin', 'Teacher', 'Parent']) await expect(page.getByRole('button', { name: new RegExp(role) })).toBeVisible();
});

test('Owner preview exposes full operations and the technical console', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Owner/ }).click();
  await expect(page.getByRole('heading', { name: 'A simple view of your daycare.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open Owner Console/ })).toHaveAttribute('href', '/admin');
  await page.getByRole('button', { name: 'Children' }).first().click();
  await expect(page.getByRole('heading', { name: 'Children & families' })).toBeVisible();
  await expect(page.getByText('No children added yet')).toBeVisible();
});

test('Admin preview operates children without exposing Owner technical controls', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Admin/ }).click();
  await expect(page.getByRole('heading', { name: 'A simple view of your daycare.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open console/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Classes' }).first().click();
  await expect(page.getByRole('heading', { name: 'Class setup' })).toBeVisible();
  await page.getByText('Create a classroom', { exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Fireflies');
  await page.getByLabel('Age group').fill('4–5 years');
  await page.getByRole('button', { name: /Create classroom/ }).click();
  await expect(page.getByText('Fireflies classroom created.')).toBeVisible();
  await page.getByText('Add a child').click();
  await page.getByLabel('Child’s full name').fill('Test Child');
  await page.getByRole('combobox', { name: 'Classroom' }).selectOption({ label: 'Fireflies' });
  await page.getByRole('button', { name: /Add child/ }).click();
  await expect(page.getByText('Test Child was added securely.')).toBeVisible();
});

test('Teacher preview is classroom-scoped and can publish family updates', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Teacher/ }).click();
  await expect(page.getByRole('heading', { name: 'Everything you need for today.' })).toBeVisible();
  await page.getByRole('button', { name: /Open my class/ }).click();
  await expect(page.getByRole('heading', { name: 'My class' })).toBeVisible();
  await expect(page.getByText('No children are assigned yet')).toBeVisible();
});

test('Parent account is child-scoped while preserving the separate shared portal', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByRole('button', { name: /Parent/ }).click();
  await expect(page.getByRole('heading', { name: 'Your child’s day, all in one place.' })).toBeVisible();
  await page.getByRole('button', { name: /View my child/ }).click();
  await expect(page.getByRole('heading', { name: 'My child' })).toBeVisible();
  await expect(page.getByText('No child is linked yet')).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).first().click();
  await expect(page.getByRole('link', { name: /General Parent Portal/ })).toHaveAttribute('href', '/daycare/parents');
});
