import React from 'react';

import type { ValueProps } from '../../types';
// attribute store for storing collapsed state
import AttributeStore from './../../stores/ObjectAttributes';
import DataTypeLabel from './DataTypeLabel';
export default function JsonFunction(props: ValueProps) {
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
  const typeName = 'function';
  if (props.enableCollapse === false) {
    return (
      <div className="rjv-value rjv-function">
        <DataTypeLabel typeName={typeName} {...props} />
        <span className="rjv-function-container">{String(props.value)}</span>
      </div>
    );
  }
  const getFunctionDisplay = () => {
    if (collapsed) {
      return (
        <span>
          {String(props.value)
            .slice(9, -1)
            .replace(/\{[\s\S]+/, '')}
          <span className="function-collapsed">
            <span>{'{'}</span>
            <span className="rjv-ellipsis">...</span>
            <span>{'}'}</span>
          </span>
        </span>
      );
    } else {
      return String(props.value).slice(9, -1);
    }
  };
  return (
    <div className="rjv-value rjv-function">
      <DataTypeLabel typeName={typeName} {...props} />
      <button
        type="button"
        aria-label={collapsed ? 'Expand function' : 'Collapse function'}
        aria-expanded={!collapsed}
        className="rjv-function-container"
        onClick={handleToggleCollapsed}
      >
        {getFunctionDisplay()}
      </button>
    </div>
  );
}
