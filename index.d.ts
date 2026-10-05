import * as React from 'react';

export interface ReactJsonViewProps {
  /**
   * This property contains your input JSON.
   *
   * Required.
   */
  src: object;
  /**
   * Contains the name of your root node. Use null or false for no name.
   *
   * Default: "root"
   */
  name?: React.JSX.Element | string | null | false;
  /**
   * RJV supports base-16 themes. Check out the list of supported themes in the demo.
   * A custom "rjv-default" theme applies by default.
   *
   * Default: "rjv-default"
   */
  theme?: ThemeKeys | ThemeObject;
  /**
   * Style attributes for react-json-view container.
   * Explicit style attributes will override attributes provided by a theme.
   *
   * Default: "rjv-default"
   */
  style?: React.CSSProperties;
  /**
   * Style of expand/collapse icons. Accepted values are "circle", triangle" or "square".
   *
   * Default: {}
   */
  iconStyle?: 'circle' | 'triangle' | 'square';
  /**
   * Set the indent-width for nested objects.
   *
   * Default: 4
   */
  indentWidth?: number;
  /**
   * When set to true, all nodes will be collapsed by default.
   * Use an integer value to collapse at a particular depth.
   *
   * Default: false
   */
  collapsed?: boolean | number;
  /**
   * When an integer value is assigned, strings will be cut off at that length.
   * Collapsed strings are followed by an ellipsis.
   * String content can be expanded and collapsed by clicking on the string value.
   *
   * Default: false
   */
  collapseStringsAfterLength?: number | false;
  /**
   * Callback function to provide control over what objects and arrays should be collapsed by default.
   * An object is passed to the callback containing name, src, type ("array" or "object") and namespace.
   *
   * Default: false
   */
  shouldCollapse?: false | ((field: CollapsedFieldProps) => boolean);
  /**
   * When an integer value is assigned, arrays will be displayed in groups by count of the value.
   * Groups are displayed with brakcet notation and can be expanded and collapsed by clickong on the brackets.
   *
   * Default: 100
   */
  groupArraysAfterLength?: number;
  /**
   * When prop is not false, the user can copy objects and arrays to clipboard by clicking on the clipboard icon.
   * Copy callbacks are supported.
   *
   * Default: true
   */
  enableClipboard?: boolean | ((copy: OnCopyProps) => void);
  /**
   * When set to true, objects and arrays are labeled with size.
   *
   * Default: true
   */
  displayObjectSize?: boolean;
  /**
   * When set to true, data type labels prefix values.
   *
   * Default: true
   */
  displayDataTypes?: boolean;
  /**
   * When set to true, the index of the elements prefix values
   *
   * Default: true
   */
  displayArrayKey?: boolean;
  /**
   * set to false to remove quotes from keys (eg. "name": vs. name:)
   *
   * Default: true
   */
  quotesOnKeys?: boolean;

  /**
   * Set to true to sort object keys.
   *
   * Default: false
   */
  sortKeys?: boolean;

  /**
   * Set to true to escape strings sequences such as \n, \t, \r, \f
   *
   * Default: true
   */
  escapeStrings?: boolean;
  /**
   * Field names whose numeric values should be interpreted as Unix timestamps.
   * Matching field names are recognized at any nesting depth.
   *
   * Default: "timestamp"
   */
  timestampFields?: string | string[];
}

export interface OnCopyProps {
  /**
   * The JSON tree source object
   */
  src: unknown;
  /**
   * List of keys.
   */
  namespace: Array<string | number | false | null>;
  /**
   * The last key in the namespace array.
   */
  name: string | number | false | null;
}

export interface CollapsedFieldProps {
  /**
   * The name of the entry.
   */
  name: React.JSX.Element | string | number | false | null | undefined;
  /**
   * The corresponding JSON subtree.
   */
  src: object;
  /**
   * The type of src. Can only be "array" or "object".
   */
  type: 'array' | 'object';
  /**
   * The scopes above the current entry.
   */
  namespace: Array<string | number | false | null>;
}

export interface ThemeObject {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
}

export type ThemeKeys =
  | 'apathy'
  | 'apathy:inverted'
  | 'ashes'
  | 'bespin'
  | 'brewer'
  | 'bright:inverted'
  | 'bright'
  | 'chalk'
  | 'codeschool'
  | 'colors'
  | 'eighties'
  | 'embers'
  | 'flat'
  | 'google'
  | 'grayscale'
  | 'grayscale:inverted'
  | 'greenscreen'
  | 'harmonic'
  | 'hopscotch'
  | 'isotope'
  | 'marrakesh'
  | 'mocha'
  | 'monokai'
  | 'ocean'
  | 'paraiso'
  | 'pop'
  | 'railscasts'
  | 'rjv-default'
  | 'shapeshifter'
  | 'shapeshifter:inverted'
  | 'solarized'
  | 'summerfruit'
  | 'summerfruit:inverted'
  | 'threezerotwofour'
  | 'tomorrow'
  | 'tube'
  | 'twilight';

declare const ReactJson: React.ComponentType<ReactJsonViewProps>;
export default ReactJson;
