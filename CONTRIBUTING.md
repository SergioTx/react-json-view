## Run the Dev Server

```bash
# clone this repository
git clone git@github.com:microlinkhq/react-json-view.git && cd react-json-view
# install dependencies
npm install --save-dev
# run the dev server with hot reloading
npm run dev
```

Webpack Dev Server should automatically open up http://localhost:2000 in your web browser. If it does not, open a browser and navigate to port 2000. The hot reloader will automatically reload when files are modified in the `/src/` directory.

## Run the Production Build

```bash
# run the build (note: you may need to use `sudo` priveledges to run the build successfully)
npm run build
```

Please add tests for your code before posting a pull request.

You can run the test suite with `npm run test` or `npm run test:watch` to automatically reload when files are modified.

## Type Checking

Source, demos, and tests use TypeScript 7 with strict checking, unchecked-index checking, and exact optional properties. Maintained JavaScript entry points and build configuration are also checked. Dependency declarations are checked rather than skipped.

```bash
npm run typecheck
npm run lint
```

Both commands enforce the no-`any` policy, including inferred `any` values and unsafe calls or member access. Use `unknown` and runtime narrowing for inspected JSON values. The policy gate uses the pinned TypeScript 7 native API because the current TypeScript ESLint parser does not support TypeScript 7.

`npm run build` generates declaration files before compiling the distributable library. Add external `@types` packages when a dependency does not bundle its own declarations.
