# Anderson Home Services

The website for my furniture assembly, move-in setup, drywall TV mounting, and light home services business in the Washington DC metro area.

**Live website:** https://andersonhomeservicesdmv.com

![TV mounting, TV stand and two bookcases](assets/tv-stand-bookcases.jpg)

## About this project

I first prototyped the website on [Wix](https://caleb12235.wixsite.com/caleb1223). I then developed the custom-coded website iteratively with assistance from ChatGPT, Claude, and Codex, using my own business requirements, service descriptions, and project photos. It grew from single-page HTML prototypes into a ten-page static website. This repository records those saved code milestones and the current deployed source.

- Furniture assembly and larger move-in projects, with real project examples.
- Responsive layouts, keyboard navigation, native FAQ disclosures, and reduced-motion support.
- Page metadata, canonical URLs, structured business information, and a sitemap.
- Tally inquiry form with direct text/email alternatives.
- Plain-language service and privacy policies; no Google Analytics or advertising pixels in the current source.
- Automated checks for links, metadata, business hours, mobile overflow, keyboard behavior, and form loading/fallback.

## Reconstructed history

The Git history was reconstructed in September 2026 from saved HTML files and ZIP exports. It is not a record of the original keystrokes or original Git commits. Commit dates show when the reconstruction was made; source dates and hashes are documented in [the history guide](docs/HISTORY.md). Earlier snapshots may contain obsolete business terms, missing prototype assets, and old third-party links. Only the newest snapshot represents the current website.

## Live deployment and publishing

The latest verified production deployment is **ac458254-c54e-48d1-aca1-cd7b310ccea7**. All 37 public files were compared byte-for-byte with that deployment before this repository was prepared. [Deployment record and file hashes](docs/DEPLOYMENT.json).

At verification, Cloudflare Pages project **andersonhomeservices** used direct uploads, with no Git source configured. Its production branch label was **main**. This repository has no automatic publishing workflow. Preparing or pushing this history does not itself request a Cloudflare deployment. Recheck Cloudflare settings before future pushes if integrations change.

Publish only the public HTML files, assets directory, robots.txt, and sitemap.xml when explicitly choosing to release a website update. Never upload this entire repository, test dependencies, or private customer records as the public site.

## Local use and checks

Open index.html for a basic local preview. With Node.js and npm installed, run:

```sh
npm install
npx playwright install chromium
npm test
```

The normal test suite blocks third-party traffic. See [maintenance instructions](MAINTENANCE.md) for the optional read-only live Tally loading check. Submission tests are disabled because there is no separate test form. No tests submit customer inquiries.

## Files

Top-level HTML files contain the pages; assets/ contains shared styles, scripts, and images; tests/ contains browser checks. docs/ records provenance and the existing live deployment. Old ZIP bundles, unused standalone logo experiments, credentials, and client records are not included.

Business text, branding, and project photos are published for reference. No reuse license is granted by this repository.
