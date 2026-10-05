import React from 'react';
import JsonViewer from './components/JsonViewer';
import { toType, isTheme } from './helpers/util';
import Theme from './themes/getStyle';
import AttributeStore from './stores/ObjectAttributes';
import type { ReactJsonViewProps } from '../../index';
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
  React.useEffect(() => () => AttributeStore.clear(rjvId), [rjvId]);
  let { src, name, theme } = props;
  if (toType(theme) === 'object' && !isTheme(theme)) {
    console.error(
      'react-json-view error:',
      'theme prop must be a theme name or valid base-16 theme object.',
      'defaulting to "rjv-default" theme'
    );
    theme = 'rjv-default';
  }
  if (toType(src) !== 'object' && toType(src) !== 'array') {
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
