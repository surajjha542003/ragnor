# RAGNOR: GitHub → Cloudflare Pages → ragnor.shop

## Preparation completed

- Existing React + Vite + TypeScript application retained without design or integration changes.
- Local Git repository initialized on `main`. No commit, remote, push, deployment, or DNS change performed.
- `.node-version` pins Node 24.20.0, matching the successful local build.
- `.gitignore` excludes dependencies, build output, local tooling, environment/credential files, and Wrangler state. Empty `.env.*.example` templates may be committed; the existing photography template has no credentials. No environment variables are needed for this frontend.
- `npm.cmd run build` and lint passed. Lockfile dependency declarations match package.json.
- `npm.cmd run verify:deployment` confirmed 150 public files copied byte-for-byte, including 100 product/gallery images (52 First Saga WebPs). All 154 output files fit Pages limits.
- Common secret-pattern scan of commit candidates found no matches. This is a targeted scan, not a guarantee against every possible secret format. Inspect staged content before publishing.

## 1. Create the private GitHub repository (after approval to publish code)

1. Sign into GitHub and create a repository named `ragnor` under the intended account.
2. Select **Private**. Leave README, .gitignore and license initialization unchecked; they already exist locally where applicable.
3. Run these commands in PowerShell. Replace `YOUR_GITHUB_USERNAME` with the actual owner. If Git requests author identity, configure your own name and email locally before committing.

```powershell
Set-Location C:\Users\simon\ragnor
git status --short
git add .
git diff --cached --stat
git diff --cached --name-only
git diff --cached
git commit -m "Prepare existing RAGNOR frontend for Cloudflare Pages"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ragnor.git
git push -u origin main
```

Before committing, confirm no actual `.env`, credentials, `node_modules`, `.tooling`, or `dist` files appear. Keep `package-lock.json`, `build/firstSagaAssets.ts`, all source files, and all `public/` assets. Authenticate through GitHub's normal credential flow; never embed a token in the remote URL. Do not enable GitHub Pages; GitHub holds the source and Cloudflare hosts the website.

## 2. Connect Cloudflare Pages

1. In Cloudflare, open **Workers & Pages → Create application → Pages → Connect to Git**.
2. Choose GitHub. Authorize the Cloudflare GitHub app for **only the `ragnor` repository**, then select that repository.
3. Enter these settings:

| Setting | Value |
| --- | --- |
| Project name | `ragnor` if available; otherwise a unique name |
| Production branch | `main` |
| Framework preset | React (Vite), or None with the settings below |
| Root directory | Leave blank (repository root) |
| Build command | `npm run build && npm run verify:deployment` |
| Build output directory | `dist` |
| Node version | Read from committed `.node-version`: `24.20.0` |
| Application environment variables | None required |

Use `npm`, not `npm.cmd`, on Cloudflare's Linux build environment. Keep dependency installation enabled and commit the lockfile. Do not set `NODE_ENV=production` or omit development dependencies during installation: TypeScript and Vite are build tools in devDependencies. If an account-level `NODE_VERSION` override exists, align it with `.node-version`.

4. Select **Save and Deploy**. Use Pages Free; no paid service, Workers AI, payment integration, or GitHub Actions workflow is required.
5. Open the exact `https://<project-name>.pages.dev` address returned by Cloudflare. Future pushes to `main` automatically build and deploy; other enabled branches can produce preview deployments. A private source repository does not make the deployed website private.

## 3. Verify the Pages deployment before changing DNS

Open each URL directly, then refresh the browser:

- `/shop?collection=first-saga`
- `/product/raven-oath`, `/product/north-sea`, `/product/iron-saga`
- `/forge`, `/saved`, `/cart`, `/checkout`
- `/about` and an unknown route (the app's NotFound screen should appear)

Check front/back controls and images, Forge customization/save/reopen, and the existing cart flow on a non-draft product. First Saga remains draft with Price pending and ordering unavailable. Verify `/products/first-saga/raven-oath/back.webp` opens as an image. Use DevTools to check for missing assets and console errors.

Cloudflare's native SPA fallback serves the root for paths without matching static assets when there is no top-level `404.html`. This project intentionally has no `public/404.html`, Pages Functions, or custom Worker. No blanket redirect is needed. The verification command guards these assumptions; it does not replace testing the live Pages deployment.

The homepage's existing Unsplash editorial image remains an external dependency with its existing fallback. All local product/gallery images are included. Cart and saved designs use origin-specific localStorage, so localhost data will not transfer automatically to pages.dev or ragnor.shop. Hosting does not enable the existing AI, account, or checkout placeholders.

## 4. Connect ragnor.shop only after separate DNS approval

For the apex `ragnor.shop`, Cloudflare Pages requires the domain to be a Cloudflare zone with Cloudflare nameservers. Registration can remain at GoDaddy; no domain transfer is needed.

1. Add `ragnor.shop` to the same Cloudflare account on the Free plan.
2. Review the imported DNS records against GoDaddy's current records. Preserve any email MX/SPF/DKIM/DMARC records and other services. Check DNSSEC migration requirements if DNSSEC is currently enabled before switching nameservers.
3. After DNS approval, open GoDaddy's domain management for `ragnor.shop`, then its nameserver settings. Replace the current nameservers with the exact two assigned by Cloudflare. Do not guess those values.
4. Wait for the Cloudflare zone to become active.
5. Open the Pages project → **Custom domains → Set up a domain**. Enter `ragnor.shop` and follow the wizard to associate the domain and create the Pages DNS record. Resolve any conflicting apex web record deliberately; retain unrelated service records.
6. Wait for the custom domain and HTTPS certificate to become active, then repeat the direct-link/refresh checks on `https://ragnor.shop`.
7. If wanted, add `www.ragnor.shop` separately through the same custom-domain wizard; make any canonical redirect a separate deliberate setting.

Do not create a standalone CNAME without first associating the hostname with the Pages project. If keeping GoDaddy nameservers is required, a subdomain such as `www.ragnor.shop` can use a CNAME to the Pages address; the apex setup described above still requires Cloudflare nameservers.

## Local repeatable checks

```powershell
Set-Location C:\Users\simon\ragnor
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:deployment
```

The current checks used installed dependencies; a fresh network install and Cloudflare's Linux build have not yet been executed. Review the first Cloudflare build log before treating deployment as verified.

## Official references

- [Cloudflare Git integration and private repositories](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [React/Vite build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build image and Node version selection](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Native SPA routing](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Custom domain and apex nameserver requirements](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
