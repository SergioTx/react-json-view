import React from 'react';

import type { ValueProps } from '../../types';
// theme
import Theme from './../../themes/getStyle';
import DataTypeLabel from './DataTypeLabel';
export default function Integer(props: ValueProps) {
  const typeName = 'int';
  return (
    <div {...Theme(props.theme, 'integer')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {typeof props.value === 'number' ? props.value : String(props.value)}
    </div>
  );
}
