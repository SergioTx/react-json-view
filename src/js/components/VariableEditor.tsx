import React from 'react';

import {
  normalizeNamespace,
  type ValueProps,
  type VariableProps,
} from '../types';
import {
  escapeString,
  formatTimestamp,
  getFlashClass,
  isSameValue,
} from './../helpers/util';
import Theme from './../themes/getStyle';
import CopyToClipboard from './CopyToClipboard';
import * as DataTypes from './DataTypes/DataTypes';
import { PathPinButton } from './PathNavigation';
const valueComponents: Partial<
  Record<string, React.ComponentType<ValueProps>>
> = {
  string: DataTypes.JsonString,
  integer: DataTypes.JsonInteger,
  float: DataTypes.JsonFloat,
  boolean: DataTypes.JsonBoolean,
  function: DataTypes.JsonFunction,
  null: DataTypes.JsonNull,
  nan: DataTypes.JsonNan,
  undefined: DataTypes.JsonUndefined,
  date: DataTypes.JsonDate,
  regexp: DataTypes.JsonRegexp,
};
export default function VariableEditor(props: VariableProps) {
  const {
    variable,
    singleIndent = 5,
    type,
    theme,
    namespace: namespaceProp,
    indentWidth = 4,
    enableClipboard,
    displayArrayKey,
    quotesOnKeys,
    isLast,
    timestampFields = 'timestamp',
    flashingUpdates,
    flashOnMount,
    enablePathNavigation,
    navigationPath = [],
    onNavigate,
    rootValue = false,
  } = props;
  const namespace = normalizeNamespace(namespaceProp);
  const [hovered, setHovered] = React.useState(false);
  const [flash, setFlash] = React.useState({
    value: variable.value,
    count: flashOnMount ? 1 : 0,
  });
  if (!isSameValue(flash.value, variable.value)) {
    setFlash({
      value: variable.value,
      count: flashingUpdates ? flash.count + 1 : flash.count,
    });
  }
  const flashClass = getFlashClass(flashingUpdates, flash.count);
  const ValueComponent = valueComponents[variable.type];
  const isTimestampField =
    typeof variable.name === 'string' &&
    (typeof timestampFields === 'string'
      ? variable.name === timestampFields
      : timestampFields.includes(variable.name));
  const timestampTitle = isTimestampField
    ? formatTimestamp(variable.value)
    : undefined;
  const objectNameStyle = Theme(theme, 'object-name');
  let value = '';
  if (!ValueComponent) {
    try {
      value = JSON.stringify(variable.value) ?? '';
    } catch {
      value = '';
    }
  }
  return (
    <div
      {...Theme(theme, 'objectKeyVal', {
        paddingLeft: rootValue ? 0 : indentWidth * singleIndent,
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="variable-row"
    >
      {!rootValue && type === 'array' ? (
        displayArrayKey && (
          <span {...Theme(theme, 'array-key')}>
            <span style={{ userSelect: 'text' }}>{variable.name}</span>
            <div {...Theme(theme, 'colon')}>:</div>
          </span>
        )
      ) : !rootValue ? (
        <span>
          <span
            {...objectNameStyle}
            className="object-key"
            style={{ ...objectNameStyle.style, userSelect: 'text' }}
          >
            {!!quotesOnKeys && (
              <span
                style={{
                  verticalAlign: 'top',
                }}
              >
                {'"'}
              </span>
            )}
            <span
              style={{
                display: 'inline-block',
              }}
            >
              {escapeString(variable.name)}
            </span>
            {!!quotesOnKeys && (
              <span
                style={{
                  verticalAlign: 'top',
                }}
              >
                {'"'}
              </span>
            )}
          </span>
          <span {...Theme(theme, 'colon')}>:</span>
        </span>
      ) : null}
      {enablePathNavigation && onNavigate && !rootValue && (
        <PathPinButton
          path={navigationPath.length > 0 ? navigationPath : [variable.name]}
          visible={hovered}
          onNavigate={onNavigate}
        />
      )}
      <div
        className={['variable-value', flashClass].filter(Boolean).join(' ')}
        title={timestampTitle}
        {...Theme(theme, 'variableValue', {
          cursor: timestampTitle ? 'help' : 'default',
        })}
      >
        {ValueComponent ? (
          <ValueComponent value={variable.value} {...props} />
        ) : (
          <div className="object-value">{value}</div>
        )}
      </div>
      {!rootValue && !isLast && <span {...Theme(theme, 'comma')}>,</span>}
      {enableClipboard && (
        <CopyToClipboard
          rowHovered={hovered}
          src={variable.value}
          clickCallback={enableClipboard}
          {...{
            theme,
            namespace: rootValue ? namespace : [...namespace, variable.name],
          }}
        />
      )}
    </div>
  );
}
