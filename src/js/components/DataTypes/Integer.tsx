import React from 'react';

import type { ValueProps } from '../../types';
import DataTypeLabel from './DataTypeLabel';
export default function Integer(props: ValueProps) {
  const typeName = 'int';
  return (
    <div className="rjv-value rjv-integer">
      <DataTypeLabel typeName={typeName} {...props} />
      {typeof props.value === 'number' ? props.value : String(props.value)}
    </div>
  );
}
