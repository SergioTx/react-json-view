import React from 'react';

import type { LabelProps } from '../../types';
// theme
import Theme from './../../themes/getStyle';
export default function DataTypeLabel(props: LabelProps) {
  const { typeName, displayDataTypes, theme } = props;
  if (displayDataTypes) {
    return (
      <span className="data-type-label" {...Theme(theme, 'data-type-label')}>
        {typeName}
      </span>
    );
  }
  return null;
}
