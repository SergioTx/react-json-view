import React from 'react';

import type { NameProps } from '../types';
import Theme from './../themes/getStyle';
export default function getObjectName(props: NameProps) {
  const {
    parent_type: parentType,
    namespace,
    quotesOnKeys,
    theme,
    jsvRoot,
    name,
    displayArrayKey,
    afterName,
    displayColon = true,
  } = props;
  const displayName = props.name ? props.name : '';
  if (jsvRoot && (name === false || name === null)) {
    return <span />;
  } else if (parentType === 'array') {
    return displayArrayKey ? (
      <span {...Theme(theme, 'array-key')} key={JSON.stringify(namespace)}>
        <span className="array-key" style={{ userSelect: 'text' }}>
          {displayName}
        </span>
        {afterName}
        {displayColon && <span {...Theme(theme, 'colon')}>:</span>}
      </span>
    ) : (
      <span />
    );
  } else {
    return (
      <span {...Theme(theme, 'object-name')} key={JSON.stringify(namespace)}>
        <span className="object-key" style={{ userSelect: 'text' }}>
          {quotesOnKeys && (
            <span
              style={{
                verticalAlign: 'top',
              }}
            >
              {'"'}
            </span>
          )}
          <span>{displayName}</span>
          {quotesOnKeys && (
            <span
              style={{
                verticalAlign: 'top',
              }}
            >
              {'"'}
            </span>
          )}
        </span>
        {afterName}
        {displayColon && <span {...Theme(theme, 'colon')}>:</span>}
      </span>
    );
  }
}
