import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Publish an explicit allowlist, never the repository, history, or dependencies.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Unsafe output directory');
const pages = ['index.html', 'about.html', 'accessibility.html', 'areas.html', 'contact.html', 'faqs.html', 'policies.html', 'portfolio.html', 'privacy.html', 'services.html'];
const files = [...pages, 'robots.txt', 'sitemap.xml'];
for (const entry of await fs.readdir(path.join(root, 'assets'), { withFileTypes: true })) {
  if (!entry.isFile() || !/^[\w.-]+\.(?:css|js|svg|png|jpe?g|webp|ico|woff2?)$/i.test(entry.name)) throw new Error('Unexpected public asset: ' + entry.name);
  files.push('assets/' + entry.name);
}
// Validate before replacing any previous generated output.
for (const file of files) {
  const stat = await fs.lstat(path.join(root, file));
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Expected regular public file: ' + file);
  if (pages.includes(file)) {
    const html = await fs.readFile(path.join(root, file), 'utf8');
    if (!/<main\b/.test(html) || !/<title>.+?<\/title>/.test(html)) throw new Error('Incomplete page: ' + file);
  }
}
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(path.join(output, 'assets'), { recursive: true });
for (const file of files) await fs.copyFile(path.join(root, file), path.join(output, file));
console.log(`Prepared ${files.length} unchanged public files in dist/`);
