import React from 'react';

import type { ValueProps } from '../../types';
// attribute store for storing collapsed state
import AttributeStore from './../../stores/ObjectAttributes';
// theme
import Theme from './../../themes/getStyle';
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
  const getFunctionDisplay = () => {
    if (collapsed) {
      return (
        <span>
          {String(props.value)
            .slice(9, -1)
            .replace(/\{[\s\S]+/, '')}
          <span
            className="function-collapsed"
            style={{
              fontWeight: 'bold',
            }}
          >
            <span>{'{'}</span>
            <span {...Theme(props.theme, 'ellipsis')}>...</span>
            <span>{'}'}</span>
          </span>
        </span>
      );
    } else {
      return String(props.value).slice(9, -1);
    }
  };
  return (
    <div {...Theme(props.theme, 'function')}>
      <DataTypeLabel typeName={typeName} {...props} />
      <button
        type="button"
        {...Theme(props.theme, 'function-value')}
        className="rjv-function-container"
        style={{
          border: 0,
          padding: 0,
          background: 'none',
          color: 'inherit',
          ...Theme(props.theme, 'function-value').style,
        }}
        onClick={handleToggleCollapsed}
      >
        {getFunctionDisplay()}
      </button>
    </div>
  );
}
