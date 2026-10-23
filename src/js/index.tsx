import React from 'react';

import type { ReactJsonViewProps } from '../../index';
import JsonViewer from './components/JsonViewer';
import { isTheme, toType } from './helpers/util';
import AttributeStore from './stores/ObjectAttributes';
import Theme from './themes/getStyle';
const defaultProps: Required<ReactJsonViewProps> = {
  src: {},
  name: 'root',
  theme: 'rjv-default',
  collapsed: false,
  collapseStringsAfterLength: false,
  shouldCollapse: false,
  sortKeys: false,
  quotesOnKeys: true,
  groupArraysAfterLength: 100,
  indentWidth: 4,
  enableClipboard: true,
  escapeStrings: true,
  displayObjectSize: true,
  displayDataTypes: true,
  iconStyle: 'triangle',
  style: {},
  displayArrayKey: true,
  timestampFields: 'timestamp',
  flashingUpdates: false,
};
const flashStyles = `
@keyframes rjv-flash-a { from { background-color: rgba(255, 196, 0, 0.55); } to { background-color: transparent; } }
@keyframes rjv-flash-b { from { background-color: rgba(255, 196, 0, 0.55); } to { background-color: transparent; } }
.react-json-view .rjv-flash-a { animation: rjv-flash-a 1s ease-out; }
.react-json-view .rjv-flash-b { animation: rjv-flash-b 1s ease-out; }
@media (prefers-reduced-motion: reduce) {
  .react-json-view .rjv-flash-a, .react-json-view .rjv-flash-b { animation: none; }
}`;
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
  React.useEffect(() => () => AttributeStore.clear(rjvId), [rjvId]);
  let { src, name, theme } = props;
  if (toType(theme) === 'object' && !isTheme(theme)) {
    // oxlint-disable-next-line eslint/no-console -- Report invalid public props.
    console.error(
      'react-json-view error:',
      'theme prop must be a theme name or valid base-16 theme object.',
      'defaulting to "rjv-default" theme'
    );
    theme = 'rjv-default';
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
  return (
    <div
      className="react-json-view"
      style={{
        ...Theme(theme, 'app-container').style,
        ...props.style,
      }}
    >
      {props.flashingUpdates && (
        <style href="rjv-flash" precedence="default">
          {flashStyles}
        </style>
      )}
      <JsonViewer
        {...props}
        src={src}
        name={name}
        theme={theme}
        type={Array.isArray(src) ? 'array' : 'object'}
        rjvId={rjvId}
      />
    </div>
  );
}
