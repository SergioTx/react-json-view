import React from 'react';

import type { ValueProps } from '../../types';
// theme
import Theme from './../../themes/getStyle';
import DataTypeLabel from './DataTypeLabel';
export default function Regexp(props: ValueProps) {
  const typeName = 'regexp';
  return (
    <div {...Theme(props.theme, 'regexp')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {String(props.value)}
    </div>
  );
}
