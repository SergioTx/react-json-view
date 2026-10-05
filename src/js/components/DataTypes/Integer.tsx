import type { ValueProps } from '../../types';
import React from 'react';
import DataTypeLabel from './DataTypeLabel';

// theme
import Theme from './../../themes/getStyle';
export default function Integer(props: ValueProps) {
  const typeName = 'int';
  return (
    <div {...Theme(props.theme, 'integer')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {typeof props.value === 'number' ? props.value : String(props.value)}
    </div>
  );
}
