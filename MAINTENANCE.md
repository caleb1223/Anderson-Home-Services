# Website maintenance

This folder is the website source, not the client-record store. Client records remain in the business's existing services. This repository contains reconstructed version history. The separately maintained website folder and live deployment were not modified during reconstruction.

## Checks

With Node.js and npm installed, run `npm install`, then `npx playwright install chromium`, then `npm test`. Run `TEST_LIVE_FORM=1 npm test` on POSIX, or `$env:TEST_LIVE_FORM='1'; npm test` in PowerShell, to include the read-only live Tally rendering check. The ordinary suite blocks third-party traffic. No test submits the production inquiry form or sends Google Analytics hits.

Submission testing is deliberately not enabled: only the production Tally form exists. Before adding it, create a separate test form, isolate its notifications/integrations, and use synthetic customer details. Do not point submission tests at form Gx5vzO.

Checks cover local links/assets/anchors, titles/descriptions/canonicals, structured business hours, main content, four viewport widths, keyboard controls, reduced motion, absence of analytics tags/popups, and Tally fallback. External links and full assistive-technology usability still need periodic manual review.

## Analytics

Google Analytics and its consent interface were removed at the owner’s request. Do not add optional tracking tags without a new decision about privacy and consent. Essential hosting and third-party form/map/font requests remain disclosed in the privacy policy.

## Publishing

Cloudflare Pages project: `andersonhomeservices-github`; production branch: `main`; custom domain: https://andersonhomeservicesdmv.com . Get Caleb's approval before publishing. Push the tested, approved commit to main; Cloudflare builds it with `node scripts/build-public.mjs` and publishes only dist/. Do not upload a separate uncommitted website copy. Never publish tests, node_modules, documentation, credentials, or customer records. Verify the production commit and URL after release. See docs/PUBLISHING.md for the full workflow and rollback notes.

## Policy review

Confirm phone contact sync destinations and Square marketing settings in the respective accounts. Square can create Instant Profiles from card payments; do not promise that tap-to-pay is anonymous. Legal enforceability of liability and booking terms requires local professional review. Indefinite retention wording does not override applicable deletion or retention laws.
