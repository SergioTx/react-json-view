import React from 'react';

import type { ValueProps } from '../../types';
// theme
import Theme from './../../themes/getStyle';
export default function Nan(props: ValueProps) {
  return <div {...Theme(props.theme, 'nan')}>NaN</div>;
}
