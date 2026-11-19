import React from 'react';

import type { ReactJsonViewProps } from '../../index';
import stylesheet from '../style/global.css?inline';
import JsonViewer from './components/JsonViewer';
import { PathBreadcrumb, resolvePath } from './components/PathNavigation';
import VariableEditor from './components/VariableEditor';
import { base16Keys, isTheme, toType } from './helpers/util';
import AttributeStore from './stores/ObjectAttributes';
import { rjvDefault } from './themes/base16/rjv-themes';
import type { Namespace } from './types';
const defaultProps: Required<ReactJsonViewProps> = {
  src: {},
  name: null,
  theme: rjvDefault,
  enableCollapse: true,
  collapsed: false,
  collapseStringsAfterLength: false,
  shouldCollapse: false,
  sortKeys: false,
  quotesOnKeys: true,
  groupArraysAfterLength: 100,
  indentWidth: 4,
  enableClipboard: true,
  enablePathNavigation: false,
  escapeStrings: true,
  displayObjectSize: false,
  displayDataTypes: false,
  hideVerticalLines: false,
  iconStyle: 'triangle',
  style: {},
  displayArrayKey: true,
  timestampFields: 'timestamp',
  flashingUpdates: false,
};
export default function ReactJsonView(
  inputProps: ReactJsonViewProps
): React.JSX.Element {
  const supplied = Object.fromEntries<unknown>(
    Object.entries<unknown>({ ...inputProps }).filter(
      ([, value]) => value !== undefined
    )
  ) as Partial<ReactJsonViewProps>;
  const props = {
    ...defaultProps,
    ...supplied,
  };
  const [rjvId] = React.useState(
    () => Date.now().toString() + Math.random().toString(36).slice(2)
  );
  const [navigationPath, setNavigationPath] = React.useState<Namespace>([]);
  const breadcrumbRef = React.useRef<HTMLElement>(null);
  const focusBreadcrumb = React.useRef(false);
  React.useEffect(() => {
    if (focusBreadcrumb.current) {
      focusBreadcrumb.current = false;
      breadcrumbRef.current?.focus();
    }
  }, [navigationPath]);
  function navigate(path: Namespace) {
    focusBreadcrumb.current = true;
    setNavigationPath(path);
  }
  React.useEffect(() => () => AttributeStore.clear(rjvId), [rjvId]);
  let { src, name, theme } = props;
  if (src === null) {
    src = {};
  }
  if (!isTheme(theme)) {
    // oxlint-disable-next-line eslint/no-console -- Report invalid public props.
    console.error(
      'react-json-view error:',
      'theme prop must be a valid base-16 theme object.',
      'defaulting to "rjv-default" theme'
    );
    theme = rjvDefault;
  }
  if (toType(src) !== 'object' && toType(src) !== 'array') {
    // oxlint-disable-next-line eslint/no-console -- Report invalid public props.
    console.error(
      'react-json-view error:',
      'src property must be a valid json object'
    );
    name = 'ERROR';
    src = {
      message: 'src property must be a valid json object',
    };
  }
  const activePath = props.enablePathNavigation ? navigationPath : [];
  const pathResolution = resolvePath(src, activePath);
  const selectedSrc = pathResolution.value;
  const selectedType = toType(selectedSrc);
  const selectedIsContainer =
    selectedType === 'object' || selectedType === 'array';
  const rootNamespace: Namespace = [typeof name === 'string' ? name : null];
  const selectedParentPath = activePath.slice(0, -1);
  const selectedParent = resolvePath(src, selectedParentPath).value;
  const selectedName = activePath.at(-1);
  const breadcrumbRootLabel =
    name === null || name === undefined || name === '' ? 'root' : name;
  const rootStyle: React.CSSProperties & Record<`--rjv-${string}`, string> = {
    '--rjv-indent': `${(props.indentWidth ?? 4) * 5}px`,
  };
  for (const key of base16Keys) {
    rootStyle[`--rjv-${key.toLowerCase()}`] =
      (Object.hasOwn(theme, key) ? theme[key] : undefined) ?? rjvDefault[key];
  }
  return (
    <div
      className="react-json-view"
      data-hide-guides={props.hideVerticalLines || undefined}
      style={{ ...rootStyle, ...props.style }}
    >
      <style href="react-json-view" precedence="default">
        {stylesheet}
      </style>
      {props.enablePathNavigation && (
        <PathBreadcrumb
          navRef={breadcrumbRef}
          path={navigationPath}
          rootLabel={breadcrumbRootLabel}
          validPrefixes={pathResolution.validPrefixes}
          arrayPrefixes={pathResolution.arrayPrefixes}
          onNavigate={navigate}
        />
      )}
      {selectedIsContainer ? (
        <JsonViewer
          {...props}
          src={selectedSrc as object}
          name={name}
          theme={theme}
          type={Array.isArray(selectedSrc) ? 'array' : 'object'}
          rjvId={rjvId}
          navigationPath={activePath}
          onNavigate={navigate}
        />
      ) : (
        <div className="pretty-json-container object-container">
          <div className="object-content">
            <VariableEditor
              {...props}
              variable={{
                name:
                  typeof selectedName === 'string' ||
                  typeof selectedName === 'number'
                    ? selectedName
                    : '',
                value: selectedSrc,
                type: toType(selectedSrc),
              }}
              namespace={rootNamespace.concat(activePath)}
              type={Array.isArray(selectedParent) ? 'array' : 'object'}
              rootValue
              navigationPath={activePath}
              isLast
              theme={theme}
              rjvId={rjvId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
