## 1.1.2 (2026-10-05)

### Bug Fixes

- Limit timestamp tooltip and help cursor to fields named `timestamp`.

## 1.1.1 (2026-10-05)

### Bug Fixes

- **ci:** configure release git identity ([ee466fd](https://github.com/sergiotx/react-json-view/commit/ee466fd78c0502755b94bde48835808eaded0b90))

# Changelog

## 1.1.0 (2026-10-05)

### Added

- Show an ISO UTC date tooltip and help cursor for numeric Unix timestamps in seconds or milliseconds.
- Add a timestamp example to the first development demo object.

## 1.0.1 (2026-10-05)

### Fixed

- Update CI and release commands to use `main` as the default branch.

## 1.0.0 (2026-10-05)

### Breaking Changes

- Make the JSON viewer read-only. Remove `onEdit`, `onAdd`, `onDelete`, `onSelect`, `validationMessage`, and custom `bigNumber` support, along with related editing and validation UI.
- Remove the `defaultValue`, `selectOnFocus`, and `keyModifier` props used by editing workflows.
- Require React 19 or newer and publish ESM only; CommonJS and UMD entry points are removed.
- Always show commas between values.

### Changed

- Convert components to functional components and hooks, preserving expansion, collapse, clipboard, and circular-reference behavior.
- Migrate source, demos, tests, and build configuration to strict TypeScript 7. Reject explicit and inferred `any` types and generate declarations during builds.
- Replace webpack and Babel with Vite for library and demo builds. Replace Mocha with Vitest, jsdom, and React Testing Library, including V8 coverage.
- Replace SCSS with plain CSS and remove Sass.
- Replace Prettier with oxfmt and add Oxlint rules for correctness, TypeScript, React, accessibility, and import sorting.
- Refresh fork repository metadata, README installation examples, contributor instructions, documentation links, development examples, and CI.
- Make disclosure, string, function, and clipboard controls keyboard-accessible.

### Validation

- Add regression coverage for prop updates, Strict Mode, expansion persistence, grouped-array commas, circular references, and read-only behavior.
- Verify strict type checking, the no-`any` gate, linting, Vite builds, and the ESM package entry.
