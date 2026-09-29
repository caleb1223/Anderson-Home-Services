# Approved releases from GitHub to Cloudflare

Repository: https://github.com/caleb1223/Anderson-Home-Services

Live website: https://andersonhomeservicesdmv.com

Cloudflare Pages project: `andersonhomeservices-github`

Production branch: `main`. Automatic production deployments are enabled. Preview-branch deployments are disabled. Changes on a working branch do not publish the website.

## Release process

1. Work in this Git repository on a separate branch. Do not edit an old ZIP export and directly upload it.
2. Review the diff, run the appropriate tests, and run `node scripts/build-public.mjs`.
3. Show Caleb the changes and ask for explicit approval to publish. A request to edit is not permission to deploy. A current instruction to deploy approves that release.
4. After approval, merge or fast-forward the reviewed changes to `main` and push to GitHub.
5. Cloudflare builds that commit automatically. Confirm the production deployment succeeded and matches the approved commit, then check the live website.

This approval rule is documented for human and agent operators; it is not a GitHub branch-protection rule. Anyone with permission to push directly to main can trigger a deployment. Do not push unapproved changes to main.

## Cloudflare build settings

- Build command: `node scripts/build-public.mjs`
- Build output directory: `dist`
- Node.js version: `24`
- `SKIP_DEPENDENCY_INSTALL=true` (the static build needs only Node; browser-test dependencies are used locally)
- Analytics: not enabled

The build copies only ten named HTML pages, robots.txt, sitemap.xml, and approved asset file types. It does not alter images or source file bytes. Documentation, client information, Git files, dependencies, and tests must never be uploaded as the public site.

## Rollback

Prefer rolling back to a successful deployment within the Git-connected Pages project and then preparing a matching Git revert. An urgent live rollback may temporarily put GitHub and the website out of sync; document it and reconcile the repository before the next release.

The original Direct Upload project `andersonhomeservices` and its deployment `ac458254-c54e-48d1-aca1-cd7b310ccea7` are retained as an additional fallback. Reassigning the custom domain to it is an administrative recovery step, not the normal release process. Do not delete it without Caleb's explicit approval.
