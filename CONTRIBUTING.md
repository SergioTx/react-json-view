## Run the Dev Server

```bash
# clone this repository
git clone git@github.com:microlinkhq/react-json-view.git && cd react-json-view
# install dependencies
npm install --save-dev
# run the dev server with hot reloading
npm run dev
```

Vite serves the development examples at http://localhost:2000 and updates them when source files change. Run `npm run docs:dev` for the documentation demo at http://localhost:2001.

## Run the Production Build

```bash
# build the ESM library and declarations
npm run build
```

Please add tests for your code before posting a pull request.

Vitest runs the tests with jsdom and React Testing Library. Use `npm run test` for tests and V8 coverage, `npm run test:unit` for tests without coverage, or `npm run test:watch` for watch mode. Coverage includes `coverage/lcov.info` for CI.

## Formatting

The project uses oxfmt. Run `npm run format` to format maintained files or `npm run format:check` to check them without modifying files. The pre-commit hook formats staged code files with oxfmt. Generated builds, coverage, and dependency caches are excluded.

## Type Checking

Source, demos, and tests use TypeScript 7 with strict checking, unchecked-index checking, and exact optional properties. Maintained JavaScript entry points and build configuration are also checked. Dependency declarations are checked rather than skipped.

```bash
npm run typecheck
npm run lint
```

Both commands enforce the no-`any` policy, including inferred `any` values and unsafe calls or member access. Use `unknown` and runtime narrowing for inspected JSON values. The policy gate uses the pinned TypeScript 7 native API because the current TypeScript ESLint parser does not support TypeScript 7.

`npm run build` bundles the library with Vite and generates declaration files. Only ESM is published; React remains external. Babel, webpack, and CommonJS output are not used. Add external `@types` packages when a dependency does not bundle its own declarations.
