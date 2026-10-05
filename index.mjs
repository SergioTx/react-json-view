import ReactJsonView from "./dist/main.js";
/** @type {unknown} */
const imported = ReactJsonView;
const component =
  typeof imported === "object" && imported !== null && "default" in imported
    ? imported.default
    : imported;
export default /** @type {typeof import('./src/js/index').default} */ (
  component
);
