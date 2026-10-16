import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(import.meta.dirname, '..');
const pages = (await fs.readdir(root)).filter(f => f.endsWith('.html'));
let server, browser, base;
before(async () => {
  server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    try {
      const bytes = await fs.readFile(file);
      const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      res.end(bytes);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
});
after(async () => { await browser?.close(); await new Promise(resolve => server ? server.close(resolve) : resolve()); });
async function offlinePage(options = {}) {
  const context = await browser.newContext(options);
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  return { context, page: await context.newPage() };
}
test('all pages: content, links, assets, metadata, structured hours and mobile overflow', async () => {
  const { context, page } = await offlinePage();
  const titles = new Set(), descriptions = new Set();
  for (const file of pages) {
    await page.goto(base + '/' + file);
    assert.equal(await page.locator('h1').count(), 1, file + ' h1');
    assert.ok((await page.locator('main').innerText()).length > 100, file + ' main content');
    const title = await page.title();
    assert.ok(title && !titles.has(title), file + ' unique title'); titles.add(title);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    assert.ok(description && !descriptions.has(description), file + ' unique description'); descriptions.add(description);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    assert.equal(canonical, 'https://andersonhomeservicesdmv.com/' + (file === 'index.html' ? '' : file.replace('.html', '')));
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const business = schemas.flatMap(text => { const data = JSON.parse(text); return data['@graph'] || [data]; }).find(data => data['@type'] === 'LocalBusiness');
    assert.deepEqual(business.openingHoursSpecification, [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday','Monday','Tuesday'], opens: '11:00', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday','Thursday'], opens: '17:30', closes: '00:00' }
    ]);
    assert.deepEqual(business.specialOpeningHoursSpecification, [
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-10-11', validThrough: '2026-10-11', opens: '00:00', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-10-13', validThrough: '2026-10-13', opens: '17:30', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-10-15', validThrough: '2026-10-15', opens: '11:00', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-10-19', validThrough: '2026-10-19', opens: '00:00', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-10-26', validThrough: '2026-10-26', opens: '00:00', closes: '00:00' },
      { '@type': 'OpeningHoursSpecification', validFrom: '2026-12-20', validThrough: '2027-01-04', opens: '00:00', closes: '00:00' }
    ]);
    const refs = await page.locator('[href], img[src], script[src]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href') || n.getAttribute('src')));
    for (const ref of refs) {
      if (!ref || /^(https?:|mailto:|sms:|tel:|data:)/.test(ref)) continue;
      const url = new URL(ref, base + '/' + file);
      const target = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
      await fs.access(path.join(root, target));
      if (url.hash) {
        const targetHtml = await fs.readFile(path.join(root, target), 'utf8');
        assert.ok(targetHtml.includes('id="' + url.hash.slice(1) + '"'), file + ' anchor ' + ref);
      }
    }
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), file + ' overflow at ' + width);
    }
  }
  await context.close();
});
test('keyboard navigation and reduced motion', async () => {
  const { context, page } = await offlinePage({ viewport: { width: 375, height: 800 }, reducedMotion: 'reduce' });
  await page.goto(base + '/faqs.html');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Skip to main content');
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#main-content');
  const menu = page.locator('.hamburger');
  await menu.focus(); await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  const summary = page.locator('summary').first();
  await summary.focus(); await page.keyboard.press('Space');
  assert.equal(await page.locator('details').first().getAttribute('open'), '');
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  await context.close();
});
test('no analytics tags or consent popups on any page', async () => {
  const { context, page } = await offlinePage();
  for (const file of pages) {
    await page.goto(base + '/' + file);
    assert.equal(await page.locator('.privacy-controls, .privacy-settings, #ahs-google-tag').count(), 0);
    assert.equal(await page.locator('script[src*="googletagmanager"], script[src*="google-analytics"], script[src*="facebook"]').count(), 0);
    assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined');
  }
  await context.close();
});
test('Tally script failure sets iframe source and leaves direct contact available', async () => {
  const { context, page } = await offlinePage();
  await page.goto(base + '/contact.html');
  await page.waitForFunction(() => document.querySelector('.tally-frame').src.includes('tally.so/r/Gx5vzO'));
  assert.ok(await page.locator('.tally-note a[href^="sms:"]').isVisible());
  assert.ok(await page.locator('.tally-note a[href^="mailto:"]').isVisible());
  await context.close();
});
test('mobile inquiries show pricing first and discount details work with a keyboard', async () => {
  const { context, page } = await offlinePage({ viewport: { width: 375, height: 800 } });
  await page.goto(base + '/index.html');
  await page.locator('header .hero-cta a[href^="contact.html"]').click();
  assert.equal(new URL(page.url()).hash, '#contact-info');
  const info = page.locator('#contact-info');
  assert.ok(await info.isVisible());
  assert.match(await info.innerText(), /one-hour minimum/);
  assert.ok(await page.evaluate(() =>
    document.getElementById('contact-info').getBoundingClientRect().bottom <=
      document.querySelector('.tally-card').getBoundingClientRect().top
  ), 'information precedes the form on mobile');
  for (const file of pages) {
    await page.goto(base + '/' + file);
    assert.equal(await page.locator('a[href^="tel:"], a[href*="wa.me"], a[href*="api.whatsapp.com"]').count(), 0, file);
  }
  await page.goto(base + '/services.html');
  const discounts = page.locator('#ways-to-save details');
  assert.equal(await discounts.getAttribute('open'), null);
  await discounts.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.ok(await discounts.locator('.faq-a').isVisible());
  await page.keyboard.press('Space');
  assert.equal(await discounts.getAttribute('open'), null);
  await context.close();
});

test('schedule groups closures and uses four- and twelve-week windows in Eastern time', async () => {
  const { context, page } = await offlinePage({ timezoneId: 'Asia/Tokyo' });
  const visit = async (instant) => {
    await page.clock.setFixedTime(new Date(instant));
    await page.goto(base + '/contact.html?testDate=' + encodeURIComponent(instant) + '#upcoming-hours');
  };
  await visit('2026-10-17T02:00:00Z'); // Still October 16 in Eastern time.
  assert.equal(await page.locator('#upcoming-hours').getAttribute('open'), '');
  const rows = page.locator('#operating-schedule li[data-date]');
  assert.equal(await rows.count(), 3);
  assert.match(await page.locator('[data-date="2026-10-19"]').innerText(), /Closed$/);
  assert.match(await page.locator('[data-date="2026-10-26"]').innerText(), /Closed$/);
  const holiday = page.locator('[data-date="2026-12-20"]');
  assert.equal(await holiday.getAttribute('data-end-date'), '2027-01-04');
  assert.match(await holiday.innerText(), /Dec 20, 2026 – Jan 4, 2027/);
  // 29 vs. 28 days before a one-day closure.
  await visit('2026-09-20T16:00:00Z');
  assert.equal(await page.locator('[data-date="2026-10-19"]').count(), 0);
  await visit('2026-09-21T16:00:00Z');
  assert.equal(await page.locator('[data-date="2026-10-19"]').count(), 1);
  // 85 vs. 84 days before the long break, including an Eastern date boundary.
  await visit('2026-09-27T02:00:00Z');
  assert.equal(await holiday.count(), 0);
  await visit('2026-09-27T16:00:00Z');
  assert.equal(await holiday.count(), 1);
  await visit('2027-01-04T16:00:00Z');
  assert.equal(await holiday.count(), 1); // Still the same long block on its last day.
  await visit('2027-01-05T16:00:00Z');
  assert.equal(await rows.count(), 0);
  assert.equal(await page.locator('#operating-schedule').innerText(), 'No upcoming schedule changes to show.');

  // A two-day break uses the short window; a three-day break uses the long one.
  const html = (await fs.readFile(path.join(root, 'contact.html'), 'utf8')).replace(
    /data-hours-exceptions='[^']*'/,
    "data-hours-exceptions='" + JSON.stringify({
      '2026-11-02': 'Closed', '2026-11-03': 'Closed',
      '2026-11-09': 'Closed', '2026-11-10': 'Closed', '2026-11-11': 'Closed'
    }) + "'"
  );
  await context.route('**/contact.html?**', route => route.fulfill({ contentType: 'text/html', body: html }));
  await visit('2026-09-21T16:00:00Z');
  assert.equal(await page.locator('[data-date="2026-11-02"]').count(), 0); // Six weeks away.
  assert.equal(await page.locator('[data-date="2026-11-09"]').count(), 1);
  await visit('2026-10-05T16:00:00Z');
  assert.equal(await page.locator('[data-date="2026-11-02"]').getAttribute('data-end-date'), '2026-11-03');
  await context.close();
});

test('live Tally form renders without submitting', { skip: !process.env.TEST_LIVE_FORM }, async () => {
  const page = await browser.newPage();
  await page.goto(base + '/contact.html');
  await page.locator('.tally-frame').scrollIntoViewIfNeeded();
  try {
    await page.frameLocator('.tally-frame').getByRole('button', { name: 'Send Project Details', exact: true }).waitFor({ timeout: 45000 });
  } catch (error) {
    console.error(await Promise.all(page.frames().map(async frame => ({ url: frame.url(), text: (await frame.locator('body').innerText().catch(() => '')).slice(0, 1500) }))));
    throw error;
  }
  await page.close();
});
