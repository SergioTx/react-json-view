# Changelog

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
