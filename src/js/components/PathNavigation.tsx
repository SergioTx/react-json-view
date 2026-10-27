import React from 'react';

import Theme from '../themes/getStyle';
import type { Namespace, Theme as ThemeType } from '../types';

type NavigationTheme = ThemeType | undefined;

export type PathResolution = {
  value: unknown;
  validPrefixes: boolean[];
  arrayPrefixes: boolean[];
};

export function resolvePath(source: unknown, path: Namespace): PathResolution {
  let value = source;
  let valid = true;
  const validPrefixes: boolean[] = [];
  const arrayPrefixes: boolean[] = [];

  for (const segment of path) {
    const isContainer =
      value !== null &&
      (typeof value === 'object' || typeof value === 'function');
    const isArray = Array.isArray(value);
    arrayPrefixes.push(isArray || typeof segment === 'number');
    const key = String(segment);
    valid =
      valid && isContainer && Object.prototype.hasOwnProperty.call(value, key);
    value = valid ? Reflect.get(value as object, key) : undefined;
    validPrefixes.push(valid);
  }

  return { value, validPrefixes, arrayPrefixes };
}

type PathPinButtonProps = {
  path: Namespace;
  visible: boolean;
  onNavigate: (path: Namespace) => void;
};

export function PathPinButton({
  path,
  visible,
  onNavigate,
}: PathPinButtonProps): React.JSX.Element {
  const [focused, setFocused] = React.useState(false);
  const shown = visible || focused;
  return (
    <button
      type="button"
      className="path-navigation-button"
      aria-label={`Show only ${path.map(String).join(' > ')}`}
      title={`Show only ${path.map(String).join(' > ')}`}
      onClick={() => onNavigate(path)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        border: 0,
        padding: '0 2px',
        background: 'none',
        font: 'inherit',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      📌
    </button>
  );
}

type PathBreadcrumbProps = {
  path: Namespace;
  rootLabel: React.ReactNode;
  validPrefixes: boolean[];
  arrayPrefixes: boolean[];
  theme: NavigationTheme;
  onNavigate: (path: Namespace) => void;
};

export function PathBreadcrumb({
  path,
  rootLabel,
  validPrefixes,
  arrayPrefixes,
  theme,
  onNavigate,
}: PathBreadcrumbProps): React.JSX.Element {
  const rootStyle = Theme(theme, 'object-name');
  return (
    <nav
      className="path-breadcrumb"
      aria-label="Object path"
      style={{ paddingBottom: 4 }}
    >
      <button
        type="button"
        className={[
          rootStyle.className,
          'path-breadcrumb-segment',
          'path-breadcrumb-valid',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Show full object"
        aria-current={path.length === 0 ? 'location' : undefined}
        disabled={path.length === 0}
        onClick={() => onNavigate([])}
        style={{
          ...rootStyle.style,
          border: 0,
          padding: 0,
          background: 'none',
          font: 'inherit',
          textDecoration: path.length === 0 ? 'none' : 'underline',
          userSelect: 'text',
        }}
      >
        {rootLabel}
      </button>
      {path.map((segment, index) => {
        const keyStyle = Theme(
          theme,
          arrayPrefixes[index] ? 'array-key' : 'object-name'
        );
        const pathPrefix = path.slice(0, index + 1);
        const isValid = validPrefixes[index] === true;
        const isCurrent = index === path.length - 1;
        return (
          <React.Fragment key={`${String(segment)}-${index}`}>
            <span className="path-breadcrumb-separator" aria-hidden="true">
              {' > '}
            </span>
            <button
              type="button"
              className={[
                keyStyle.className,
                'path-breadcrumb-segment',
                isValid ? 'path-breadcrumb-valid' : 'path-breadcrumb-invalid',
                isCurrent ? 'path-breadcrumb-current' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={`Navigate to ${pathPrefix.map(String).join(' > ')}`}
              aria-current={isCurrent ? 'location' : undefined}
              disabled={!isValid || isCurrent}
              onClick={() => onNavigate(pathPrefix)}
              style={{
                ...keyStyle.style,
                border: 0,
                padding: 0,
                background: 'none',
                font: 'inherit',
                textDecoration: isValid && !isCurrent ? 'underline' : 'none',
                userSelect: 'text',
              }}
            >
              {String(segment)}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
