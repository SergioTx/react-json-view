import React from 'react';

import type { ValueProps } from '../../types';
import DataTypeLabel from './DataTypeLabel';
export default function Boolean(props: ValueProps) {
  const typeName = 'bool';
  return (
    <div className="rjv-value rjv-boolean">
      <DataTypeLabel typeName={typeName} {...props} />
      {props.value ? 'true' : 'false'}
    </div>
  );
}
