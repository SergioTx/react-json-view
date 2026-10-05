import type { ValueProps } from '../../types';
import React from 'react';
import DataTypeLabel from './DataTypeLabel';

// theme
import Theme from './../../themes/getStyle';
export default function Boolean(props: ValueProps) {
  const typeName = 'bool';
  return (
    <div {...Theme(props.theme, 'boolean')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {props.value ? 'true' : 'false'}
    </div>
  );
}
