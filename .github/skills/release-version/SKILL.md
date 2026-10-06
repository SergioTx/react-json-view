---
name: release-version
description: 'Use when bumping, releasing, staging, or publishing this package. Preserve the exact requested version; do not let standard-version bump it again.'
---

# Release a Version

Use this workflow for requests to bump a version, create a release, publish, or push a release commit in this repository.

## Rules

- The exact version requested by the user is authoritative.
- Never combine a manual version bump with `pnpm release`. That command runs `standard-version`, which calculates another bump from conventional commits.
- Do not report a package as published merely because it was staged. This repository uses an npm stage-only token; a maintainer must approve the stage with npm 2FA before it is public.
- Preserve existing worktree changes. Inspect the current manifest, changelog, tags, remote branch, and release workflow before editing.

## Manual Version

When the user names a target version such as `1.4.0`:

1. Confirm the target is valid semver and greater than the latest `v*` tag. Check for an existing local/remote tag and npm stage for that version.
2. Update `package.json` to exactly the requested version and add the matching `CHANGELOG.md` entry. Keep both in the release commit.
3. Make the requested code/docs changes and run `corepack pnpm format:check`, `corepack pnpm lint`, `corepack pnpm test`, and `corepack pnpm build` as appropriate.
4. Commit the prepared version with a conventional `feat:` or `fix:` message so `.github/workflows/main.yml` does not filter the push. Include the version and changelog in that same commit when requested.
5. Push to `main`. The release workflow recognizes a package version ahead of the latest tag, creates the matching tag, and runs `postrelease` to submit that exact version to npm staging and create the GitHub Release. Do not run `pnpm release` in this path.
6. Verify the CI run, created tag/GitHub Release, and npm stage version. Report the exact stage ID and status. State that publication is pending until the stage is approved.

## Automatic Version

When no exact version is requested and the user wants the repository's automated bump:

1. Leave `package.json` and `CHANGELOG.md` unchanged before the release commit.
2. Use a conventional feature/fix commit that passes the workflow filters.
3. Let CI run `pnpm release`; `standard-version` calculates the next version, updates the changelog, commits, and tags it. The `postrelease` lifecycle then stages the package.
4. Verify the produced version instead of assuming the requested or expected version.

## Avoiding Repeat Bumps

Inspect the Release step in `.github/workflows/main.yml` before retrying. If the requested version is already in `package.json` and is ahead of the latest tag, retry through the prepared-version path. Do not call `pnpm release` after that path has tagged the requested version. If the workflow calls `pnpm release` for an already completed version, fix that branch before triggering another release.
