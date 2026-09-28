# Source history and reconstruction

## First prototype: Wix

Before the custom-coded website, Caleb built the first prototype on [Wix](https://caleb12235.wixsite.com/caleb1223). This starting point is documented from the owner's account and the URL supplied on September 28, 2026. Its creation date is not established. The automated retrieval tool could not access the page during this review, so its content and availability have not been independently verified.

The Wix prototype is an external historical reference, not an imported source-code snapshot. No Wix source export or screenshots were supplied, and no artificial Git commit or date has been created to represent its development. The commits below begin with the earliest saved custom-code files.

## Saved code milestones

This history selects major snapshots from 30 supplied website versions. It does not fabricate intermediate changes. Numbered prototype filenames, original file modification timestamps, ZIP entry timestamps, and actual content differences support the ordering. Dates below are approximate source/version dates in America/New_York, not assertions of original deployment or original authorship time. ZIP timestamps have limited timezone reliability. All Git author/committer dates are the reconstruction date.

| Commit | Source date | Change supported by the snapshots | Source |
|---|---|---|---|
| 1 | 2026-05-25 | Import earliest saved single-page prototype | AHS Claude Vibe Code 1.0.html |
| 2 | 2026-05-26 | Revise the single-page design and move-in service copy | AHS ChatGPT Vibe Code 1.0.html |
| 3 | 2026-05-27 | Refine project examples, contact flow, and business introduction | AHS ChatGPT Vibe Code 7.0.html |
| 4 | 2026-05-28 | Split the site into service, portfolio, FAQ, contact, and policy pages | anderson-home-services-final-launch-skiplink-hidden.zip |
| 5 | 2026-05-29 | Add same-day guidance, service policies, hours, and updated reviews | anderson-home-services-policies-hours-update.zip |
| 6 | 2026-05-30 | Add service areas and refine domain, pricing, and booking copy | anderson-home-services-domain-pricing-polish.zip |
| 7 | 2026-06-17 | Add Caleb biography and photo with arrival-window policies | anderson-home-services-about-caleb-photo-update.zip |
| 8 | 2026-07-31 | Update full-day pricing, office services, and live-hours links | anderson-home-services-live-hours-fixed.zip |
| 9 | 2026-08-16 | Add remote move-in setup examples and furniture repair portfolio | anderson-home-services-remote-setup-update.zip |
| 10 | 2026-08-21 | Add Google reviews, service-area map, and clearer fixed-quote scope | anderson-home-services-review-map-rework.zip |
| 11 | 2026-08-31 | Clarify arrival discounts, billing messages, and vehicle availability | anderson-home-services-2026-08-31-update.zip |
| 12 | 2026-09-02 | Expand project portfolio and clarify stacked scheduling discounts | anderson-home-services-2026-09-02-policy-cleanup.zip |
| 13 | 2026-09-12 | Update business hours and Tally/Square privacy disclosures | anderson-home-services-2026-09-12-hours-privacy.zip |
| 14 | 2026-09-24 | Preserve deployed September website with SEO, accessibility, tests, and TV project | Current website folder verified against Cloudflare deployment ac458254-c54e-48d1-aca1-cd7b310ccea7 |

## Fidelity

Historical HTML files are copied as index.html for the single-file prototypes. Common packaging folders (site/ and anderson_home_services_live_hours/) are removed so each complete export appears at the repository root. Source file bytes are otherwise retained. Complete ZIP snapshots replace the prior tree; absent files are not invented. The final public file set exactly matches the recorded Cloudflare deployment. Repository-only documentation and test files are not part of that public deployment.

The July hours-update archive contains only 12 files and omits the image assets. It was reviewed but not treated as a complete release; the subsequent live-hours-fixed export supplies the complete snapshot. Other intermediate variants below were reviewed and consolidated into the later selected major snapshots; they are not separate invented commits.

## Reviewed intermediate sources not separately committed

- AHS ChatGPT Vibe Code 2.0.html
- AHS ChatGPT Vibe Code 3.0.html
- AHS ChatGPT Vibe Code 4.0.html
- AHS ChatGPT Vibe Code 5.0.html
- AHS ChatGPT Vibe Code 6.0.html
- anderson-home-services-reviews-updated.zip
- anderson-home-services-sameday-update.zip
- anderson-home-services-final-refinement.zip
- anderson-home-services-final-copy-polish.zip
- anderson-home-services-policy-links-final.zip
- anderson-site-fixed.zip
- anderson-home-services-july-update.zip
- anderson-home-services-hours-update.zip
- anderson-home-services-2026-08-21.zip
- anderson-home-services-google-area-pricing-update.zip
- anderson-home-services-2026-09-02-portfolio-flex-policy.zip
- anderson-home-services-2026-09-02-revised-discounts-portfolio.zip
- anderson-home-services-2026-09-02-cleanup.zip

## Source integrity

Archive/single-file SHA-256 hashes and modification timestamps are recorded in [source-provenance.json](source-provenance.json). The original archives remain outside this repository. Standalone logo experiments and unrelated items were excluded. Current unused-but-deployed assets are retained to preserve exact deployment fidelity.

## Screening

631 website file instances across all old snapshots and the current source were screened for sensitive filenames, dependency directories, private-key blocks, common provider tokens, and credential assignments. No pattern matches were found. No individual reviewed website file exceeded 10 MB. This is not a guarantee of the absence of all possible secrets; image binary metadata was not a credential-pattern scan. Public business contact details and Tally form identifiers are expected website content. No deployment credentials, client records, ZIP bundles, node_modules, or .env files are included.
