import React from 'react';

import type { ValueProps } from '../../types';
import { escapeString, toType } from './../../helpers/util';
// attribute store for storing collapsed state
import AttributeStore from './../../stores/ObjectAttributes';
import DataTypeLabel from './DataTypeLabel';
export default function JsonString(props: ValueProps) {
  const [collapsed, setCollapsed] = React.useState(() =>
    AttributeStore.get(props.rjvId, props.namespace, 'collapsed', true)
  );
  const handleToggleCollapsed = () => {
    const nextCollapsed = !collapsed;
    AttributeStore.set(
      props.rjvId,
      props.namespace,
      'collapsed',
      nextCollapsed
    );
    setCollapsed(nextCollapsed);
  };
  const typeName = 'string';
  const { collapseStringsAfterLength, escapeStrings } = props;
  const rawValue =
    typeof props.value === 'string' ? props.value : String(props.value);
  const content = escapeStrings ? escapeString(rawValue) : rawValue;
  const expandable =
    props.enableCollapse !== false &&
    typeof collapseStringsAfterLength === 'number' &&
    toType(collapseStringsAfterLength) === 'integer' &&
    content.length > collapseStringsAfterLength;
  const value =
    expandable && collapsed ? (
      <span>
        {content.substring(0, collapseStringsAfterLength)}
        <span className="rjv-ellipsis"> ...</span>
      </span>
    ) : (
      content
    );
  return (
    <div className="rjv-value rjv-string">
      <DataTypeLabel typeName={typeName} {...props} />
      {expandable ? (
        <button
          type="button"
          aria-expanded={!collapsed}
          className="string-value"
          aria-label={collapsed ? 'Expand string' : 'Collapse string'}
          onClick={handleToggleCollapsed}
        >
          {'"'}
          {value}
          {'"'}
        </button>
      ) : (
        <span className="string-value">
          {'"'}
          {value}
          {'"'}
        </span>
      )}
    </div>
  );
}
