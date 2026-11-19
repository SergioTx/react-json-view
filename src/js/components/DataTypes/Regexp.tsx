import React from 'react';

import type { ValueProps } from '../../types';
import DataTypeLabel from './DataTypeLabel';
export default function Regexp(props: ValueProps) {
  const typeName = 'regexp';
  return (
    <div className="rjv-value rjv-regexp">
      <DataTypeLabel typeName={typeName} {...props} />
      {String(props.value)}
    </div>
  );
}
