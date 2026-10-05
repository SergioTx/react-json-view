// returns a string "type" of input object
import type { ThemeObject } from '../../../index';
export function toType(obj: unknown): string {
  let type = getType(obj);
  // some extra disambiguation for numbers
  if (typeof obj === 'number') {
    if (Number.isNaN(obj)) {
      type = 'nan';
    } else if ((obj | 0) !== obj) {
      // bitwise OR produces integers
      type = 'float';
    } else {
      type = 'integer';
    }
  }
  return type;
}

// source: http://stackoverflow.com/questions/7390426/better-way-to-get-type-of-a-javascript-variable/7390612#7390612
function getType(obj: unknown): string {
  return (
    {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)?.[1]
      ?.toLowerCase() ?? 'unknown'
  );
}
export function escapeString(value: string | number): string {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')
    .replace(/\f/g, '\\f');
}

// validation for base-16 themes
export function isTheme(theme: unknown): theme is ThemeObject {
  const themeKeys = [
    'base00',
    'base01',
    'base02',
    'base03',
    'base04',
    'base05',
    'base06',
    'base07',
    'base08',
    'base09',
    'base0A',
    'base0B',
    'base0C',
    'base0D',
    'base0E',
    'base0F',
  ];
  return (
    typeof theme === 'object' &&
    theme !== null &&
    themeKeys.every(
      (key) => key in theme && typeof Reflect.get(theme, key) === 'string'
    )
  );
}
