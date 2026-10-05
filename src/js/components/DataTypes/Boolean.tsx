import React from 'react';

import type { ValueProps } from '../../types';
// theme
import Theme from './../../themes/getStyle';
import DataTypeLabel from './DataTypeLabel';
export default function Boolean(props: ValueProps) {
  const typeName = 'bool';
  return (
    <div {...Theme(props.theme, 'boolean')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {props.value ? 'true' : 'false'}
    </div>
  );
}
