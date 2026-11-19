import React from 'react';

import type { Namespace } from '../types';

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
  onNavigate: (path: Namespace) => void;
};

export function PathPinButton({
  path,
  onNavigate,
}: PathPinButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="path-navigation-button"
      aria-label={`Show only ${path.map(String).join(' > ')}`}
      title={`Show only ${path.map(String).join(' > ')}`}
      onClick={() => onNavigate(path)}
    >
      <span className="rjv-path-icon" aria-hidden="true">
        <span>📍</span>
      </span>
    </button>
  );
}

type PathBreadcrumbProps = {
  navRef?: React.Ref<HTMLElement>;
  path: Namespace;
  rootLabel: React.ReactNode;
  validPrefixes: boolean[];
  arrayPrefixes: boolean[];
  onNavigate: (path: Namespace) => void;
};

export function PathBreadcrumb({
  navRef,
  path,
  rootLabel,
  validPrefixes,
  arrayPrefixes,
  onNavigate,
}: PathBreadcrumbProps): React.JSX.Element {
  return (
    <nav
      ref={navRef}
      tabIndex={-1}
      className="path-breadcrumb"
      aria-label="Object path"
    >
      <button
        type="button"
        className="rjv-object-name path-breadcrumb-segment path-breadcrumb-valid"
        aria-label="Show full object"
        aria-current={path.length === 0 ? 'location' : undefined}
        disabled={path.length === 0}
        onClick={() => onNavigate([])}
      >
        {rootLabel}
      </button>
      {path.map((segment, index) => {
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
                arrayPrefixes[index] ? 'rjv-array-key' : 'rjv-object-name',
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
            >
              {String(segment)}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
