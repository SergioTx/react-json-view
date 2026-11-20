# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2026-11-20

### Fixed

- Fix vertical bar alignment.

## [3.0.2] - 2026-11-20

### Fixed

- Remove duplicate vertical guide lines while keeping guides beneath expanded disclosure controls.

## [3.0.1] - 2026-11-19

### Fixed

- Reveal copy buttons when hovering over their row, while keeping them available on keyboard focus and visible on narrow screens and devices without hover.
- Center the copy button's tighter focus outline around the icon without shrinking its hit area. Use the active theme's property name color for all viewer button focus outlines.

## [3.0.0] - 2026-11-19

### Added

- Accept partial Base16 theme objects and inherit missing colors from `rjv-default`.
- Add `enableCollapse={false}` to show all content without collapse controls, and expose the option in the demo.
- Export built-in palettes and `invertBase16Theme` from `@sergiotx/react-json-view/themes`. Each palette is also available individually, for example at `@sergiotx/react-json-view/themes/monokai`.

### Changed

- Make disclosure controls announce their state. Show copy buttons on focus or on narrow screens, and keep path navigation available without hover.
- Keep optional palettes out of the viewer entry point so consumers bundle only the palettes they import.
- Store the built-in palettes locally and ship their upstream MIT license notice.
- Move viewer styling into the `react-json-view` CSS layer and load one shared stylesheet automatically, with per-viewer theme and indentation variables.

### Fixed

- Report clipboard success only after the write succeeds and announce failures.
- Improve demo zoom, responsive layout, and reduced-motion behavior; defer JSON validation and pause flashing while the page is hidden.

### Removed

- **BREAKING:** Remove string theme names, including `:inverted` variants, and the `ThemeKeys` type. Import a palette and pass it as `theme={palette}`; use `invertBase16Theme(palette)` for an inverted palette. Omit `theme` to use the default.
- Remove the `react-base16-styling` dependency.

## [2.0.3] - 2026-11-16

### Changed

- Update development dependencies, including Vite, Vitest, Oxlint, and Oxfmt.

## [2.0.2] - 2026-11-03

### Added

- Add an nvm configuration and contributor guidance matching the latest Node.js LTS used in CI.

### Removed

- Remove the published Node.js engine restriction so development tooling requirements do not constrain consumers.

## [2.0.1] - 2026-11-03

### Changed

- Update development dependencies, including Oxlint and Node.js 26 type declarations.

## [2.0.0] - 2026-10-28

### Added

- Add a JSON editor to the demo with validation errors and flashing-mode synchronization.

### Changed

- **BREAKING:** Restrict the root `name` prop to strings or `null` and default it to `null`.
- **BREAKING:** Hide object sizes and data type labels by default.
- Keep `src` required in TypeScript; omitted or `null` values render an empty object at runtime.
- Add the `hideVerticalLines` prop to optionally hide vertical tree guides.
- Load selected built-in Base16 themes on demand in separate chunks to reduce the initial bundle size.
- Keep the active theme visible while another built-in theme loads.
- Change `rjv-default` colors. It's now a dark theme.
- Remove the alternate `rjv-grey` palette; `rjv-default` is now the sole built-in local palette.
- Align nested collapse icons to the left of property names and give them a theme-colored background.
- Align continuous vertical guides with the expand icon and extend them to closing braces.
- Remove the extra gap before property colons.

## [1.7.1] - 2026-10-28

### Added

- Deploy the live demo to GitHub Pages on pushes to `main` and link to it from the README.

### Changed

- Update development dependencies, including React, Vite, Vitest, and formatting and linting tools.
- Upgrade the package manager to pnpm 12.15.0.
- Use the latest Node.js LTS release in GitHub Actions.

## [1.7.0] - 2026-10-27

### Added

- Add the opt-in `enablePathNavigation` prop with hover-only pin buttons and breadcrumbs for navigating object and array subpaths.
- Preserve the selected breadcrumb path when the source changes, showing `undefined` for missing paths and allowing navigation back to the full root.

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

[Unreleased]: https://github.com/SergioTx/react-json-view/compare/v3.0.3...HEAD
[3.0.3]: https://github.com/SergioTx/react-json-view/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/SergioTx/react-json-view/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/SergioTx/react-json-view/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/SergioTx/react-json-view/compare/v2.0.3...v3.0.0
[2.0.3]: https://github.com/SergioTx/react-json-view/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/SergioTx/react-json-view/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/SergioTx/react-json-view/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/SergioTx/react-json-view/compare/v1.7.1...v2.0.0
[1.7.1]: https://github.com/SergioTx/react-json-view/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/SergioTx/react-json-view/compare/v1.6.1...v1.7.0
[1.6.1]: https://github.com/SergioTx/react-json-view/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/SergioTx/react-json-view/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/SergioTx/react-json-view/compare/v1.3.0...v1.5.0
[1.3.0]: https://github.com/SergioTx/react-json-view/compare/v1.1.3...v1.3.0
[1.1.3]: https://github.com/SergioTx/react-json-view/compare/v1.1.1...v1.1.3
[1.1.1]: https://github.com/SergioTx/react-json-view/compare/v1.0.1...v1.1.1
[1.0.1]: https://github.com/SergioTx/react-json-view/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/SergioTx/react-json-view/releases/tag/v1.0.0
