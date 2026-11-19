import React from 'react';

import type { ValueProps } from '../../types';
import DataTypeLabel from './DataTypeLabel';
export default function Float(props: ValueProps) {
  const typeName = 'float';
  return (
    <div className="rjv-value rjv-float">
      <DataTypeLabel typeName={typeName} {...props} />
      {typeof props.value === 'number' ? props.value : String(props.value)}
    </div>
  );
}
