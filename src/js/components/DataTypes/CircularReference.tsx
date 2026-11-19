import React from 'react';

import type { CircularProps } from '../../types';
export default function CircularReference(props: CircularProps) {
  const { namespace, quotesOnKeys, isLast, jsvRoot } = props;
  const displayName = props.name ? props.name : '';
  return (
    <div className="variable-row rjv-circular-row">
      <span className="rjv-circular-key" key={JSON.stringify(namespace)}>
        <span className="object-key">
          {quotesOnKeys && <span className="rjv-quote">{'"'}</span>}
          <span>{displayName}</span>
          {quotesOnKeys && <span className="rjv-quote">{'"'}</span>}
        </span>
        <span className="rjv-colon">:</span>
      </span>
      <span className="rjv-literal rjv-null">[CIRCULAR REFERENCE]</span>
      {!isLast && !jsvRoot && <span className="rjv-comma">,</span>}
    </div>
  );
}
