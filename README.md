# react-json-view

**react-json-view** (rjv) is a React component for displaying JavaScript **arrays** and **JSON objects**.

[Live demo](https://sergiotx.github.io/react-json-view/)

Fork from [https://github.com/uiwjs/react-json-view](https://github.com/uiwjs/react-json-view).

This fork aims to keep the viewer lightweight and reduce dependencies by removing editing, selection, and validation properties. It also adds some extra features, like path pinning or flashing updates.

The viewer loads its stylesheet automatically. Multiple viewers on the same page share one stylesheet, but can use different themes and indentation. The library styles are in the `react-json-view` cascade layer, so normal unlayered CSS can override them.

Copy buttons are always visible on viewports up to `48rem` wide or on devices without hover. Otherwise, hover over a row or press Tab to focus and reveal its copy button.
Viewer buttons use the active theme's property name color (`base07`) for their keyboard focus outlines.

## Highlights

- Object, array, string and function values can be collapsed and expanded.
- Object and array nodes display length.
- Object and array nodes support a "Copy to Clipboard" feature.
- String values can be truncated after a specified length.
- Arrays can be subgrouped after a specified length.
- Base-16 Theme Support.

## Installation

Requires React 19 or newer.

This package is ESM-only. Development requires Node.js 22.12 or newer.

```shell
npm install @sergiotx/react-json-view --save
```

## Usage

```js
import ReactJsonView from '@sergiotx/react-json-view';

// Pass an object or array as `src`. Raw JSON text strings are not parsed,
// though string values nested in the data are supported.

<ReactJsonView
  src={{
    string: 'this is a test string',
    integer: 42,
    array: [1, 2, 3, 'test', NaN],
    float: 3.14159,
    undefined: undefined,
    object: {
      'first-child': true,
      'second-child': false,
      'last-child': null,
    },
    string_number: '1234',
    date: new Date(),
  }}
/>;
```

## API

| Name                         | Type                      | Default       | Description                                                                                                                                                                                                                                                                                        |
| :--------------------------- | :------------------------ | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                        | `object`                  | Required      | Parsed object or array to display. If omitted or `null` at runtime, an empty object is shown. Raw JSON text strings and other primitive top-level values are not parsed.                                                                                                                           |
| `name`                       | `string` or `null`        | `null`        | Contains the name of your root node. Use `null` for no name.                                                                                                                                                                                                                                       |
| `theme`                      | `object`                  | `rjv-default` | Pass an imported Base16 palette or an object of color overrides. Omitted colors inherit from the default palette.                                                                                                                                                                                  |
| `style`                      | `object`                  | `{}`          | Style attributes for react-json-view container. Explicit style attributes will override attributes provided by a theme.                                                                                                                                                                            |
| `iconStyle`                  | `string`                  | `'triangle'`  | Style of expand/collapse icons. Accepted values are "circle", "triangle" or "square".                                                                                                                                                                                                              |
| `indentWidth`                | `integer`                 | 4             | Set the indent-width for nested objects.                                                                                                                                                                                                                                                           |
| `enableCollapse`             | `boolean`                 | `true`        | Set to `false` to show all objects, arrays, array groups, strings, and functions in full, without collapse controls. Overrides `collapsed`, `shouldCollapse`, and `collapseStringsAfterLength`.                                                                                                    |
| `collapsed`                  | `boolean` or `integer`    | `false`       | When set to `true`, all nodes will be collapsed by default. Use an integer value to collapse at a particular depth.                                                                                                                                                                                |
| `collapseStringsAfterLength` | `integer`                 | `false`       | When an integer value is assigned, strings will be cut off at that length. Collapsed strings are followed by an ellipsis. String content can be expanded and collapsed by clicking on the string value.                                                                                            |
| `shouldCollapse`             | `(field)=>{}`             | `false`       | Callback function to provide control over what objects and arrays should be collapsed by default. An object is passed to the callback containing `name`, `src`, `type` ("array" or "object") and `namespace`.                                                                                      |
| `groupArraysAfterLength`     | `integer`                 | 100           | Display arrays in groups of this size. Each group has a disclosure button; when `enableCollapse` is `false`, all groups stay open.                                                                                                                                                                 |
| `enableClipboard`            | `boolean` or `(copy)=>{}` | `true`        | When prop is not `false`, the user can copy objects and arrays to clipboard by clicking on the clipboard icon. Copy callbacks are supported.                                                                                                                                                       |
| `enablePathNavigation`       | `boolean`                 | `false`       | When set to `true`, property rows show a pin button that filters the viewer to that subpath. A breadcrumb remains visible and updates when the source changes.                                                                                                                                     |
| `displayObjectSize`          | `boolean`                 | `false`       | When set to `true`, objects and arrays are labeled with size.                                                                                                                                                                                                                                      |
| `displayDataTypes`           | `boolean`                 | `false`       | When set to `true`, data type labels prefix values.                                                                                                                                                                                                                                                |
| `hideVerticalLines`          | `boolean`                 | `false`       | When set to `true`, hides the vertical guide lines between tree rows.                                                                                                                                                                                                                              |
| `sortKeys`                   | `boolean`                 | `false`       | Set to `true` to sort object keys.                                                                                                                                                                                                                                                                 |
| `quotesOnKeys`               | `boolean`                 | `true`        | Set to `false` to remove quotes from keys (e.g., `"name":` vs. `name:`).                                                                                                                                                                                                                           |
| `displayArrayKey`            | `boolean`                 | `true`        | When set to `true`, the index of the elements prefix values.                                                                                                                                                                                                                                       |
| `escapeStrings`              | `boolean`                 | `true`        | When set to `true`, strings sequences such as \n, \t, \r, \f will be escaped.                                                                                                                                                                                                                      |
| `timestampFields`            | `string` or `string[]`    | `'timestamp'` | Field names whose numeric values should be parsed as Unix timestamps and show a date tooltip. Matching is by field name at any nesting depth.                                                                                                                                                      |
| `flashingUpdates`            | `boolean`                 | `false`       | Set to `true` when `src` changes over time. Each value is compared with its previous value at the same path and changed values flash briefly. Added properties flash, and object sizes flash when properties are added or removed. The animation is disabled when the user prefers reduced motion. |

## Theming

### Import a built-in palette

Import a palette and pass it as the `theme` object:

```jsx
import ReactJsonView from '@sergiotx/react-json-view';
import { monokai } from '@sergiotx/react-json-view/themes';

<ReactJsonView src={data} theme={monokai} />;
```

The viewer entry point does not import any optional palettes. A bundler with
tree shaking can include just the named exports you use from `/themes`.

### Import one palette directly

Use the individual module's default export to load just that palette without
relying on tree shaking:

```js
import monokai from '@sergiotx/react-json-view/themes/monokai';
```

Individual paths use the palette's file name, for example `/themes/atelier-dune`
for `atelierDune` and `/themes/default` for `base16Default`. To defer loading,
use a dynamic import of the individual module:

```js
const { default: monokai } =
  await import('@sergiotx/react-json-view/themes/monokai');
```

### Migrate from string themes

String themes are no longer supported. Replace `theme="monokai"` with
`theme={monokai}` after importing the palette, or omit `theme` if you previously
used `theme="rjv-default"`. To replace a `:inverted` theme name, pass the result
of `invertBase16Theme`:

```jsx
import { invertBase16Theme, monokai } from '@sergiotx/react-json-view/themes';

const invertedMonokai = invertBase16Theme(monokai);

<ReactJsonView src={data} theme={invertedMonokai} />;
```

### Available palettes

The built-in palettes are stored locally and retain the upstream
[MIT license notice](./LICENSE-base16.md).

The following named exports are available from `/themes`:

- `'apathy'`
- `'ashes'`
- `'atelierDune'`
- `'atelierForest'`
- `'atelierHeath'`
- `'atelierLakeside'`
- `'atelierSeaside'`
- `'base16Default'`
- `'bespin'`
- `'brewer'`
- `'bright'`
- `'chalk'`
- `'codeschool'`
- `'colors'`
- `'eighties'`
- `'embers'`
- `'flat'`
- `'google'`
- `'grayscale'`
- `'greenscreen'`
- `'harmonic'`
- `'hopscotch'`
- `'isotope'`
- `'marrakesh'`
- `'mocha'`
- `'monokai'`
- `'nicinabox'`
- `'ocean'`
- `'paraiso'`
- `'pop'`
- `'railscasts'`
- `'shapeshifter'`
- `'solarized'`
- `'summerfruit'`
- `'threezerotwofour'`
- `'tomorrow'`
- `'tube'`
- `'twilight'`

### Custom theme

Pass a full Base16 palette or supply just the colors you want to change.
Omitted or `undefined` colors use `rjv-default`.

To customize an imported palette while keeping its other colors, spread it
before adding your overrides:

```jsx
<ReactJsonView src={data} theme={{ ...monokai, base09: '#9a3412' }} />
```

To override just a few colors from `rjv-default`, pass them directly:

```jsx
<ReactJsonView
  src={data}
  theme={{ base00: '#ffffff', base09: '#9a3412' }}
  enableCollapse={false}
/>
```

To better understand custom themes, take a look at the [base-16 theme styling guidelines](https://github.com/chriskempson/base16/blob/master/styling.md).
