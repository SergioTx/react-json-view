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
    type,
    theme,
    namespace: namespaceProp,
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
  const pathPin =
    enablePathNavigation && onNavigate && !rootValue ? (
      <PathPinButton
        path={navigationPath.length > 0 ? navigationPath : [variable.name]}
        onNavigate={onNavigate}
      />
    ) : null;
  let value = '';
  if (!ValueComponent) {
    try {
      value = JSON.stringify(variable.value) ?? '';
    } catch {
      value = '';
    }
  }
  return (
    <div data-root-value={rootValue || undefined} className="variable-row">
      {!rootValue && type === 'array' ? (
        displayArrayKey ? (
          <span className="rjv-array-key">
            <span className="rjv-selectable">{variable.name}</span>
            {pathPin}
            <span className="rjv-colon">:</span>
          </span>
        ) : (
          pathPin
        )
      ) : !rootValue ? (
        <span>
          <span className="object-key rjv-object-name rjv-selectable">
            {!!quotesOnKeys && <span className="rjv-quote">{'"'}</span>}
            <span className="rjv-key-text">{escapeString(variable.name)}</span>
            {!!quotesOnKeys && <span className="rjv-quote">{'"'}</span>}
          </span>
          {pathPin}
          <span className="rjv-colon">:</span>
        </span>
      ) : null}
      <div
        className={['variable-value', flashClass].filter(Boolean).join(' ')}
        title={timestampTitle}
      >
        {ValueComponent ? (
          <ValueComponent value={variable.value} {...props} />
        ) : (
          <div className="object-value">{value}</div>
        )}
      </div>
      {!rootValue && !isLast && <span className="rjv-comma">,</span>}
      {enableClipboard && (
        <CopyToClipboard
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
