# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.1] - 2026-10-23

### Fixed

- Render a single shared flash style tag in the document head when multiple viewers use `flashingUpdates`.

## [1.6.0] - 2026-10-22

### Added

- Add the `flashingUpdates` prop to highlight changed, added, and removed values when `src` changes.

## [1.5.0] - 2026-10-06

### Changed

- Render buttons only for expandable values.

## [1.4.0] - 2026-10-06

### Changed

- Render string values as buttons only when they can be expanded, and keep text selectable in expandable string and function controls.

## [1.3.0] - 2026-10-05

### Added

- Configure timestamp fields.

## [1.2.0] - 2026-10-05

### Added

- Add the `timestampFields` prop to configure timestamp fields with a string or array. It defaults to `timestamp`.

## [1.1.3] - 2026-10-05

### Fixed

- Limit the timestamp tooltip to the timestamp field.

## [1.1.2] - 2026-10-05

### Fixed

- Limit timestamp tooltip and help cursor to fields named `timestamp`.

## [1.1.1] - 2026-10-05

### Fixed

- Configure the release git identity in CI.

## [1.1.0] - 2026-10-05

### Added

- Show an ISO UTC date tooltip and help cursor for numeric Unix timestamps in seconds or milliseconds.
- Add a timestamp example to the first development demo object.

## [1.0.1] - 2026-10-05

### Fixed

- Update CI and release commands to use `main` as the default branch.

## [1.0.0] - 2026-10-05

### Removed

- **BREAKING:** Make the JSON viewer read-only. Remove `onEdit`, `onAdd`, `onDelete`, `onSelect`, `validationMessage`, and custom `bigNumber` support, along with related editing and validation UI.
- **BREAKING:** Remove the `defaultValue`, `selectOnFocus`, and `keyModifier` props used by editing workflows.
- **BREAKING:** Remove CommonJS and UMD entry points; the package is ESM only.

### Changed

- **BREAKING:** Require React 19 or newer.
- Always show commas between values.

- Convert components to functional components and hooks, preserving expansion, collapse, clipboard, and circular-reference behavior.
- Migrate source, demos, tests, and build configuration to strict TypeScript 7. Reject explicit and inferred `any` types and generate declarations during builds.
- Replace webpack and Babel with Vite for library and demo builds. Replace Mocha with Vitest, jsdom, and React Testing Library, including V8 coverage.
- Replace SCSS with plain CSS and remove Sass.
- Replace Prettier with oxfmt and add Oxlint rules for correctness, TypeScript, React, accessibility, and import sorting.
- Refresh fork repository metadata, README installation examples, contributor instructions, documentation links, development examples, and CI.
- Make disclosure, string, function, and clipboard controls keyboard-accessible.
- Add regression coverage for prop updates, Strict Mode, expansion persistence, grouped-array commas, circular references, and read-only behavior.

[Unreleased]: https://github.com/SergioTx/react-json-view/compare/v1.6.1...HEAD
[1.6.1]: https://github.com/SergioTx/react-json-view/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/SergioTx/react-json-view/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/SergioTx/react-json-view/compare/v1.3.0...v1.5.0
[1.3.0]: https://github.com/SergioTx/react-json-view/compare/v1.1.3...v1.3.0
[1.1.3]: https://github.com/SergioTx/react-json-view/compare/v1.1.1...v1.1.3
[1.1.1]: https://github.com/SergioTx/react-json-view/compare/v1.0.1...v1.1.1
[1.0.1]: https://github.com/SergioTx/react-json-view/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/SergioTx/react-json-view/releases/tag/v1.0.0
