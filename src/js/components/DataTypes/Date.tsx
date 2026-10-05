import type { ValueProps } from '../../types';
import React from 'react';
import DataTypeLabel from './DataTypeLabel';

// theme
import Theme from './../../themes/getStyle';
export default function Date(props: ValueProps) {
  const value = props.value;
  if (!(value instanceof globalThis.Date)) return null;
  const typeName = 'date';
  const displayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return (
    <div {...Theme(props.theme, 'date')}>
      <DataTypeLabel typeName={typeName} {...props} />
      <span className="date-value" {...Theme(props.theme, 'date-value')}>
        {value.toLocaleTimeString('en-us', displayOptions)}
      </span>
    </div>
  );
}
