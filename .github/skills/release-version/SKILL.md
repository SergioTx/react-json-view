---
name: release-version
description: 'Use when bumping, releasing, staging, or publishing this package. CI publishes exactly the version in package.json.'
---

# Release a Version

Use this workflow for requests to bump a version, create a release, publish, or push a release commit in this repository.

## How CI Publishes

On every push to `main`, `.github/workflows/main.yml` tests and builds, then reads the version from `package.json`. If tag `v<version>` or npm version `<version>` already exists, nothing is published. Otherwise it extracts the `## [<version>]` section from `CHANGELOG.md` (failing if it is missing or empty), creates the tag, runs `npm stage publish`, pushes the tag, and creates the GitHub Release with `gh release create` using those notes. CI never bumps versions or commits.

## Rules

- The version in `package.json` is authoritative; update it yourself along with the matching `CHANGELOG.md` entry.
- Do not report a package as published merely because it was staged. This repository uses an npm stage-only token; a maintainer must approve the stage with npm 2FA before it is public.
- Preserve existing worktree changes. Inspect the current manifest, changelog, tags, and remote branch before editing.

## Steps

1. Pick the target version (patch/minor/major as requested). Confirm it is valid semver, greater than the latest `v*` tag, and has no existing tag or npm version.
2. Update `package.json` to exactly that version. In `CHANGELOG.md` (Keep a Changelog format), move `[Unreleased]` entries into a new `## [x.y.z] - YYYY-MM-DD` section using Added/Changed/Deprecated/Removed/Fixed/Security, and update the compare links at the bottom.
3. Run `corepack pnpm format:check`, `corepack pnpm lint`, `corepack pnpm test`, and `corepack pnpm build`.
4. Commit and push to `main`.
5. Verify the CI run, tag, GitHub Release, and npm stage. State that publication is pending until the stage is approved.
