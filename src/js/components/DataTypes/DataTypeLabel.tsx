import React from 'react';

import type { LabelProps } from '../../types';
export default function DataTypeLabel(props: LabelProps) {
  const { typeName, displayDataTypes } = props;
  if (displayDataTypes) {
    return <span className="data-type-label">{typeName}</span>;
  }
  return null;
}
