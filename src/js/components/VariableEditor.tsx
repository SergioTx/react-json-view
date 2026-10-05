import type { VariableProps } from '../types';
import { normalizeNamespace } from '../types';
import type { ValueProps } from '../types';
import React from 'react';
import { escapeString } from './../helpers/util';
import CopyToClipboard from './CopyToClipboard';
import * as DataTypes from './DataTypes/DataTypes';
import Theme from './../themes/getStyle';
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
  } = props;
  const namespace = normalizeNamespace(namespaceProp);
  const [hovered, setHovered] = React.useState(false);
  const ValueComponent = valueComponents[variable.type];
  let value = '';
  if (!ValueComponent) {
    try {
      value = JSON.stringify(variable.value) ?? '';
    } catch {}
  }
  return (
    <div
      {...Theme(theme, 'objectKeyVal', {
        paddingLeft: indentWidth * singleIndent,
      })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="variable-row"
    >
      {type === 'array' ? (
        displayArrayKey && (
          <span {...Theme(theme, 'array-key')}>
            {variable.name}
            <div {...Theme(theme, 'colon')}>:</div>
          </span>
        )
      ) : (
        <span>
          <span {...Theme(theme, 'object-name')} className="object-key">
            {!!quotesOnKeys && (
              <span
                style={{
                  verticalAlign: 'top',
                }}
              >
                "
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
                "
              </span>
            )}
          </span>
          <span {...Theme(theme, 'colon')}>:</span>
        </span>
      )}
      <div
        className="variable-value"
        {...Theme(theme, 'variableValue', {
          cursor: 'default',
        })}
      >
        {ValueComponent ? (
          <ValueComponent value={variable.value} {...props} />
        ) : (
          <div className="object-value">{value}</div>
        )}
      </div>
      {!isLast && <span {...Theme(theme, 'comma')}>,</span>}
      {enableClipboard && (
        <CopyToClipboard
          rowHovered={hovered}
          src={variable.value}
          clickCallback={enableClipboard}
          {...{
            theme,
            namespace: [...namespace, variable.name],
          }}
        />
      )}
    </div>
  );
}
