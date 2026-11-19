import React from 'react';

import type { NameProps } from '../types';
export default function getObjectName(props: NameProps) {
  const {
    parent_type: parentType,
    namespace,
    quotesOnKeys,
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
      <span className="rjv-array-key" key={JSON.stringify(namespace)}>
        <span className="array-key rjv-selectable">{displayName}</span>
        {afterName}
        {displayColon && <span className="rjv-colon">:</span>}
      </span>
    ) : (
      <span />
    );
  } else {
    return (
      <span className="rjv-object-name" key={JSON.stringify(namespace)}>
        <span className="object-key rjv-selectable">
          {quotesOnKeys && <span className="rjv-quote">{'"'}</span>}
          <span>{displayName}</span>
          {quotesOnKeys && <span className="rjv-quote">{'"'}</span>}
        </span>
        {afterName}
        {displayColon && <span className="rjv-colon">:</span>}
      </span>
    );
  }
}
