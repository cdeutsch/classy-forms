# Releases & dependency updates

This repo uses **Dependabot** for dependency PRs and **semantic-release** on the **default branch** (`master`) to publish to npm and maintain `CHANGELOG.md`.

## One-time setup (GitHub + npm)

1. **Branch**  
   Releases are configured for **`master`**, which matches the current GitHub default. If you rename the default branch to **`main`**, update **`branches`** in both [`.github/workflows/release.yml`](.github/workflows/release.yml) and [`.releaserc.json`](.releaserc.json) to `main`.

2. **npm Trusted publishing (recommended)**  
   Publishes from CI use **[Trusted publishing](https://docs.npmjs.com/trusted-publishers)** (OpenID Connect) so you do **not** store a long-lived **`NPM_TOKEN`** in GitHub. Requirements are described in the npm docs ([Node **≥ 22.14.0** and npm CLI **≥ 11.5.1**](https://docs.npmjs.com/trusted-publishers)); this repo’s workflow uses **Node 22.14** on **GitHub-hosted** `ubuntu-latest`.

   **On npmjs.com** (package → **Settings** → **Trusted publishing**):

   - Publisher: **GitHub Actions**
   - **Organization or user:** match the GitHub owner (e.g. `cdeutsch` for `github.com/cdeutsch/classy-forms`)
   - **Repository:** `classy-forms`
   - **Workflow filename:** `release.yml` (filename only, including `.yml`, must match [`.github/workflows/release.yml`](.github/workflows/release.yml) exactly)
   - **Environment name:** leave empty unless you intentionally use a [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) named in npm; if you set one on npm, configure the same on the workflow job.

   **On GitHub:** the workflow already declares **`id-token: write`** (required for OIDC). No **`NPM_TOKEN`** secret is used.

   After a successful release via this workflow, you can remove any old automation tokens and optionally tighten package **[Publishing access](https://docs.npmjs.com/trusted-publishers#recommended-restrict-token-access-when-using-trusted-publishers)** so publishes go through Trusted publishing only.

   **Fallback (unsupported CI only):** If you ever publish from a context where Trusted publishing is unavailable, use a short-lived **[granular access token](https://docs.npmjs.com/creating-and-viewing-access-tokens)** and set **`NPM_TOKEN`** for that job only — not the default for this repo.

3. **`GITHUB_TOKEN`**  
   Workflows use the built-in `GITHUB_TOKEN`. No secret is required for it. Ensure *Settings → Actions → General* allows workflow **Read and write** permissions (needed to push the release commit and create releases).

## How a release happens

1. Push commits to **`master`** that follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `fix: ...`, `feat: ...`).
2. The **Release** workflow runs tests and `npm run build`, then **semantic-release**:
   - Decides the next **semver** from commits since the last release.
   - Updates **`package.json`**, **`CHANGELOG.md`**, and publishes to **npm**.
   - Creates a **Git tag** and **GitHub Release**.
3. Release commits include **`[skip ci]`** in the message so the workflow does not run again on that push.

If there is **no** user-facing change that matches your configured rules (for example, only `chore:`/`docs:` with the default Angular preset), **no** new version is published and the workflow still exits successfully.

### Commit types (default analyzer)

| Commit type | semver bump |
|-------------|-------------|
| `fix:` | patch |
| `feat:` | minor |
| `BREAKING CHANGE:` in footer or `feat!:` / `fix!:` / etc. | major |

### Dependabot

[Dependabot](.github/dependabot.yml) opens PRs monthly for npm (root and `demo/`) and GitHub Actions. PR titles use **`fix(deps):`** so merged dependency updates typically produce a **patch** release when you merge to **`master`**.

## Local dry run (optional)

```bash
npm ci
git fetch origin
npx semantic-release --dry-run
```

No publish or git writes occur; useful to see the next version and notes. The configured release branch (`master`) must exist on **`origin`** or the dry run exits with `ERELEASEBRANCHES`.

## Replacing manual `npm publish`

Do **not** run `npm publish` by hand for normal releases. Let the workflow publish so versions, tags, and `CHANGELOG.md` stay aligned. For emergencies only, document the manual steps in an issue and coordinate with npm.
