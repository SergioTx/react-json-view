import React from 'react';

import type { ValueProps } from '../../types';
// theme
import Theme from './../../themes/getStyle';
import DataTypeLabel from './DataTypeLabel';
export default function Float(props: ValueProps) {
  const typeName = 'float';
  return (
    <div {...Theme(props.theme, 'float')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {typeof props.value === 'number' ? props.value : String(props.value)}
    </div>
  );
}
