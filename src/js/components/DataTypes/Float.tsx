import type { ValueProps } from '../../types';
import React from 'react';
import DataTypeLabel from './DataTypeLabel';

// theme
import Theme from './../../themes/getStyle';
export default function Float(props: ValueProps) {
  const typeName = 'float';
  return (
    <div {...Theme(props.theme, 'float')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {typeof props.value === 'number' ? props.value : String(props.value)}
    </div>
  );
}
